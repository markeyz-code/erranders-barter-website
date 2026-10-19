import { io, type Socket } from 'socket.io-client'
import { chat_api } from '@/api_factory/modules/chat'
import type { Chat, ChatMessage, ChatMessageType, ChatUser } from '@/api_factory/modules/chat'
import { users_api } from '@/api_factory/modules/users'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { playNotificationSound } from '@/composables/core/useSound'
import { useAuth } from '@/composables/useAuth'

export type { Chat, ChatMessage, ChatMessageType, ChatUser }

/**
 * Chat composable for the real backend contract:
 *   GET  /chats                  → conversation list
 *   GET  /chats/:chatId/messages → messages
 *   POST /chats/init             → find-or-create a conversation
 *   Socket.IO gateway (default namespace, `backend/src/chat/chat.gateway.ts`):
 *     emit `joinChat`   { chatId }
 *     emit `sendMessage` { chatId, content, type, assetUrl, replyTo }
 *     on   `newMessage` (Message document, sender populated)
 *     on   `chatNotification` { chatId, message }
 *
 * Things this backend does NOT have, and which are therefore not modelled here:
 * FAQs, auto-responses, guest/anonymous conversations, business/subdomain rooms,
 * read receipts and any REST send-message endpoint. Messages can only be sent
 * while the Socket.IO connection is up (see `sendMessage`).
 */

const CHATS_KEY = 'chat_conversations'
const ACTIVE_CHAT_KEY = 'chat_active_id'
const MESSAGES_KEY = 'chat_active_messages'
const OPEN_KEY = 'chat_is_open'
const MY_ID_KEY = 'chat_my_user_id'

// One shared client socket for the whole app: the floating widget and the chat
// pages both use this composable, and the gateway has no namespace.
const socket = ref<Socket | null>(null)
const isConnected = ref(false)
const listenersAttached = ref(false)
const tokenWatcherAttached = ref(false)
const seenIncomingIds = new Set<string>()

const resolveWsBaseUrl = (): string => {
  let raw = ''
  try {
    raw = String(useRuntimeConfig().public.apiBaseUrl || '')
  } catch {
    raw = ''
  }
  if (!raw) {
    raw = String(import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3100')
  }
  return raw.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
}

const senderIdOf = (message: ChatMessage): string => {
  const sender = message?.sender
  if (!sender) return ''
  return typeof sender === 'string' ? sender : String(sender._id || '')
}

const senderEmailOf = (message: ChatMessage): string => {
  const sender = message?.sender
  if (!sender || typeof sender === 'string') return ''
  return String(sender.email || '')
}

export const useChat = () => {
  const { showToast } = useCustomToast()
  const { user, token, isLoggedIn } = useAuth()

  const chats = useState<Chat[]>(CHATS_KEY, () => [])
  const activeChatId = useState<string | null>(ACTIVE_CHAT_KEY, () => null)
  const messages = useState<ChatMessage[]>(MESSAGES_KEY, () => [])
  const isOpen = useState<boolean>(OPEN_KEY, () => false)
  const myUserId = useState<string>(MY_ID_KEY, () => '')

  const loadingChats = ref(false)
  const loadingMessages = ref(false)
  const sending = ref(false)
  const incomingMessageTrigger = ref(0)

  const sessionUserId = computed(() => {
    const profile = user.value as any
    return String(profile?._id || profile?.id || '')
  })

  const displayName = computed(() => {
    const profile = user.value as any
    if (!profile) return 'You'
    return (
      profile.fullName ||
      `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
      profile.email ||
      'You'
    )
  })

  /** The signed-in user's id, resolved from the session or from GET /users/me. */
  const ensureMyUserId = async (): Promise<string> => {
    if (myUserId.value) return myUserId.value
    if (sessionUserId.value) {
      myUserId.value = sessionUserId.value
      return myUserId.value
    }
    if (!token.value) return ''
    try {
      const res = await users_api.getProfile()
      const id = String(res?.data?._id || res?.data?.id || '')
      if (id) myUserId.value = id
    } catch {
      // Interceptor already surfaced the error; an empty id only degrades
      // message alignment, so it is not worth a second toast.
    }
    return myUserId.value
  }

  const isMine = (message: ChatMessage): boolean => {
    if (!message) return false
    const senderId = senderIdOf(message)
    if (myUserId.value && senderId) return senderId === myUserId.value
    const senderEmail = senderEmailOf(message)
    const myEmail = (user.value as any)?.email
    if (senderEmail && myEmail) return senderEmail === myEmail
    return false
  }

  /** The other person in a conversation (falls back to the first participant). */
  const otherParticipant = (chat: Chat): ChatUser | null => {
    const participants = Array.isArray(chat?.participants) ? chat.participants : []
    if (!participants.length) return null
    const others = participants.filter((participant) => {
      const id = typeof participant === 'string' ? participant : participant?._id
      return id && String(id) !== myUserId.value
    })
    const picked = others[0] ?? participants[0]
    return (typeof picked === 'string' ? { _id: picked } : picked) as ChatUser
  }

  const chatTitle = (chat: Chat): string => {
    const other = otherParticipant(chat)
    const name = `${other?.firstName || ''} ${other?.lastName || ''}`.trim()
    return name || other?.email || 'Conversation'
  }

  const upsertMessage = (message: ChatMessage) => {
    if (!message) return
    const serverId = message._id
    if (serverId) {
      const existing = messages.value.findIndex((m) => m._id === serverId)
      if (existing >= 0) {
        const next = [...messages.value]
        next[existing] = message
        messages.value = next
        return
      }
    }
    // Replace our optimistic bubble with the server's version of it.
    const pending = messages.value.findIndex(
      (m) => typeof m._id === 'string' && m._id.startsWith('pending_') && m.content === message.content
    )
    if (pending >= 0) {
      const next = [...messages.value]
      next[pending] = message
      messages.value = next
      return
    }
    messages.value = [...messages.value, message]
  }

  const refreshChatPreview = (message: ChatMessage) => {
    const chatId = String(message?.chatId || '')
    if (!chatId) return
    const index = chats.value.findIndex((chat) => String(chat._id) === chatId)
    if (index < 0) {
      void loadChats()
      return
    }
    const next = [...chats.value]
    next[index] = {
      ...next[index],
      lastMessage: message,
      updatedAt: message.createdAt || new Date().toISOString(),
    }
    chats.value = next
  }

  /** Counts an incoming message once, even though the gateway may deliver it twice. */
  const countIncoming = (message: ChatMessage) => {
    if (!message?._id) return
    if (seenIncomingIds.has(message._id)) return
    seenIncomingIds.add(message._id)
    if (senderIdOf(message) !== myUserId.value) {
      incomingMessageTrigger.value++
      playNotificationSound()
    }
  }

  const handleIncomingMessage = (message: ChatMessage) => {
    if (!message?._id) return
    if (activeChatId.value && String(message.chatId) === String(activeChatId.value)) {
      upsertMessage(message)
    }
    refreshChatPreview(message)
    countIncoming(message)
  }

  const handleNotification = (payload: { chatId?: string; message?: ChatMessage }) => {
    if (!payload?.message) return
    if (activeChatId.value && String(payload.chatId) === String(activeChatId.value)) {
      upsertMessage(payload.message)
    }
    refreshChatPreview(payload.message)
    countIncoming(payload.message)
  }

  const joinActiveChat = () => {
    if (!socket.value?.connected || !activeChatId.value) return
    socket.value.emit('joinChat', { chatId: activeChatId.value })
  }

  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.removeAllListeners()
      socket.value.disconnect()
    }
    socket.value = null
    isConnected.value = false
    listenersAttached.value = false
  }

  const connectSocket = () => {
    if (typeof window === 'undefined') return
    if (!token.value) return

    const authToken = `Bearer ${token.value}`
    if (socket.value && (socket.value.auth as any)?.token !== authToken) {
      disconnectSocket()
    }
    if (socket.value) return

    socket.value = io(resolveWsBaseUrl(), {
      auth: { token: authToken },
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      joinActiveChat()
    })
    socket.value.on('disconnect', () => {
      isConnected.value = false
    })
    socket.value.on('connect_error', () => {
      isConnected.value = false
    })

    if (!listenersAttached.value) {
      socket.value.on('newMessage', handleIncomingMessage)
      socket.value.on('chatNotification', handleNotification)
      listenersAttached.value = true
    }
  }

  // A shared socket must not outlive the session that authenticated it.
  if (!tokenWatcherAttached.value) {
    tokenWatcherAttached.value = true
    watch(token, () => {
      if (typeof window === 'undefined') return
      disconnectSocket()
      if (token.value) connectSocket()
    })
  }

  const loadChats = async (): Promise<Chat[]> => {
    if (!token.value) {
      chats.value = []
      return []
    }
    loadingChats.value = true
    try {
      const res = await chat_api.getChats()
      chats.value = Array.isArray(res.data) ? res.data : []
    } catch {
      // axios.config.ts already raises a toast for HTTP/network errors.
      chats.value = []
    } finally {
      loadingChats.value = false
    }
    return chats.value
  }

  const loadMessages = async (chatId?: string | null): Promise<ChatMessage[]> => {
    const id = chatId || activeChatId.value
    if (!id) return []
    loadingMessages.value = true
    try {
      const res = await chat_api.getMessages(id)
      messages.value = Array.isArray(res.data) ? res.data : []
    } catch {
      messages.value = []
    } finally {
      loadingMessages.value = false
    }
    return messages.value
  }

  /** Open a conversation: load its history and subscribe to its socket room. */
  const openChat = async (chatId: string) => {
    if (!chatId) return
    activeChatId.value = chatId
    messages.value = []
    connectSocket()
    joinActiveChat()
    await Promise.all([ensureMyUserId(), loadMessages(chatId)])
  }

  /** POST /chats/init — find-or-create the conversation and open it. */
  const startChat = async (participantId: string, itemId?: string) => {
    if (!participantId) throw new Error('A participant is required to start a chat')
    try {
      const res = await chat_api.initChat(itemId ? { participantId, itemId } : { participantId })
      const chat = res.data
      if (!chat?._id) throw new Error('The server did not return a conversation')
      const existing = chats.value.findIndex((c) => String(c._id) === String(chat._id))
      if (existing >= 0) {
        const next = [...chats.value]
        next[existing] = { ...next[existing], ...chat }
        chats.value = next
      } else {
        chats.value = [chat, ...chats.value]
      }
      await openChat(chat._id)
      return chat
    } catch (error: any) {
      if (!error?.response) {
        showToast({
          title: 'Chat error',
          message: error?.message || 'Unable to start the conversation',
          toastType: 'error',
          duration: 4000,
        })
      }
      throw error
    }
  }

  /**
   * Send over the gateway. The backend has no REST send route and the gateway
   * `sendMessage` event has no acknowledgement callback, so this is
   * fire-and-forget with an optimistic bubble that is reconciled when the server
   * echoes `newMessage` back to the chat room.
   */
  const sendMessage = async (
    content: string,
    options?: { type?: ChatMessageType; assetUrl?: string; replyTo?: string }
  ) => {
    let text = (content || '').trim()
    const type: ChatMessageType = options?.type || 'text'
    const assetUrl = options?.assetUrl

    if (!text && !assetUrl) return
    // `content` is `required: true` in the Message schema, so media messages
    // need a fallback caption or the server rejects the save.
    if (!text) text = type === 'image' ? 'Shared an image' : 'Voice note'

    if (!activeChatId.value) throw new Error('Open a conversation before sending a message')

    await ensureMyUserId()
    connectSocket()

    if (!socket.value?.connected) {
      showToast({
        title: 'Not connected',
        message: 'Still connecting to chat. Please try again in a moment.',
        toastType: 'error',
        duration: 4000,
      })
      throw new Error('Not connected to the chat server')
    }

    const chatId = activeChatId.value
    sending.value = true
    try {
      messages.value = [
        ...messages.value,
        {
          _id: `pending_${Date.now()}`,
          chatId,
          sender: { _id: myUserId.value },
          content: text,
          type,
          assetUrl,
          replyTo: options?.replyTo,
          createdAt: new Date().toISOString(),
        },
      ]

      socket.value.emit('sendMessage', {
        chatId,
        content: text,
        type,
        assetUrl,
        replyTo: options?.replyTo,
      })
    } finally {
      sending.value = false
    }
  }

  return {
    // state
    chats,
    activeChatId,
    messages,
    isOpen,
    myUserId,
    loadingChats,
    loadingMessages,
    sending,
    incomingMessageTrigger,
    isConnected,
    isLoggedIn,
    token,
    displayName,
    socket,
    // actions
    connectSocket,
    disconnectSocket,
    joinActiveChat,
    ensureMyUserId,
    loadChats,
    loadMessages,
    openChat,
    startChat,
    sendMessage,
    // helpers
    isMine,
    otherParticipant,
    chatTitle,
  }
}
