<template>
  <ClientOnly>
    <div v-if="showChatWidget" class="z-[999999] fixed bottom-6 right-6 md:bottom-8 md:right-8">
      <Transition name="slide-up">
        <div
          v-if="isOpen"
          :class="[
            'bg-white shadow-sm border border-gray-50 overflow-hidden flex flex-col transition-all duration-300',
            // Mobile (default)
            'fixed inset-0 w-full h-[100dvh] rounded-none z-[999999]',
            // Desktop (sm and up)
            'sm:absolute sm:inset-auto sm:bottom-[76px] sm:right-0 sm:w-[380px] md:w-[420px] sm:h-[600px] sm:max-h-[85vh] sm:rounded-[2rem] sm:border sm:border-gray-100/50'
          ]"
        >
          <!-- Header -->
          <div class="relative z-10 flex items-center justify-between px-4 py-5 text-gray-900 border-b border-gray-100">
            <div class="flex items-center gap-3 min-w-0">
              <button
                v-if="activeChatId"
                @click="closeChat"
                class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Back to conversations"
              >
                <ChevronLeft class="w-5 h-5 text-gray-500" />
              </button>
              <div class="w-10 h-10 shrink-0 rounded-full bg-brand-600/10 flex items-center justify-center">
                <MessageSquare class="w-5 h-5 text-brand-600" />
              </div>
              <div class="min-w-0">
                <p class="text-lg font-bold tracking-tight truncate">{{ headerTitle }}</p>
                <p class="text-xs text-gray-500 font-medium mt-0.5 truncate">{{ headerSubtitle }}</p>
              </div>
            </div>
            <button
              @click="isOpen = false"
              class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Close chat"
            >
              <X class="w-5 h-5 text-gray-500 hover:text-gray-900" />
            </button>
          </div>

          <!-- Body -->
          <div class="relative z-10 flex-1 overflow-y-auto px-4 py-3 flex flex-col scrollbar-hide">
            <!-- Signed out: this backend has no guest chat, every chat route needs a JWT -->
            <div v-if="!isLoggedIn" class="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
              <p class="text-gray-600 text-base leading-relaxed">
                Log in to see your conversations and message the other trader.
              </p>
              <button
                @click="promptLogin"
                class="rounded-xl bg-brand-600 text-white hover:bg-brand-700 px-5 py-3 text-sm font-bold shadow-sm transition-transform active:scale-[0.98]"
              >
                Log in
              </button>
            </div>

            <!-- Conversation list -->
            <template v-else-if="!activeChatId">
              <div v-if="loadingChats" class="space-y-3">
                <div v-for="i in 4" :key="i" class="h-16 rounded-2xl bg-gray-100 animate-pulse"></div>
              </div>
              <div v-else-if="!chats.length" class="flex-1 flex flex-col items-center justify-center text-center gap-2 py-10">
                <p class="text-gray-700 font-semibold">No conversations yet</p>
                <p class="text-gray-500 text-sm leading-relaxed">
                  Open an item you want and use “Message seller” to start a trade chat.
                </p>
              </div>
              <div v-else class="space-y-2">
                <button
                  v-for="chat in chats"
                  :key="chat._id"
                  @click="openConversation(chat)"
                  class="w-full text-left flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div class="w-10 h-10 shrink-0 rounded-full bg-brand-600/10 text-brand-700 font-bold flex items-center justify-center">
                    {{ participantInitial(chat) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <p class="font-semibold text-sm text-gray-900 truncate">{{ chatTitle(chat) }}</p>
                      <span v-if="chat.lastMessage?.createdAt" class="text-[10px] text-gray-400 shrink-0">
                        {{ formatTime(chat.lastMessage.createdAt) }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 truncate">
                      {{ chat.lastMessage?.content || 'No messages yet' }}
                    </p>
                  </div>
                </button>
              </div>
            </template>

            <!-- Open conversation -->
            <template v-else>
              <div v-if="loadingMessages && !messages.length" class="space-y-3">
                <div v-for="i in 4" :key="i" class="h-12 rounded-2xl bg-gray-100 animate-pulse"></div>
              </div>
              <div v-else-if="!messages.length" class="flex-1 flex items-center justify-center text-center py-10">
                <p class="text-gray-500 text-sm">No messages yet — say hello.</p>
              </div>
              <div v-else class="space-y-1.5">
                <div
                  v-for="(message, idx) in messages"
                  :key="message._id || idx"
                  class="flex w-full"
                  :class="isMine(message) ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-[85%] rounded-[1.5rem] px-4 py-3 shadow-sm border border-gray-50"
                    :class="isMine(message)
                      ? 'bg-brand-600 text-white rounded-br-sm border-brand-600'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'"
                  >
                    <img
                      v-if="message.type === 'image' && message.assetUrl"
                      :src="message.assetUrl"
                      class="rounded-xl max-w-full h-auto mb-2 border border-black/5"
                      loading="lazy"
                    />
                    <audio
                      v-else-if="message.type === 'voice' && message.assetUrl"
                      :src="message.assetUrl"
                      controls
                      class="h-8 w-full mb-1 custom-audio"
                    />
                    <p v-if="message.content" class="whitespace-pre-wrap leading-relaxed text-[14px]">
                      {{ message.content }}
                    </p>
                    <p
                      v-if="message.createdAt"
                      class="text-[10px] mt-1 text-right font-medium"
                      :class="isMine(message) ? 'text-white/70' : 'text-gray-400'"
                    >
                      {{ formatTime(message.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
              <div ref="messageContainer"></div>
            </template>
          </div>

          <!-- Composer -->
          <div
            v-if="isLoggedIn && activeChatId"
            class="bg-white relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div class="px-4 py-3 flex items-center gap-2 border-t border-gray-100">
              <input
                v-model="draft"
                type="text"
                placeholder="Write a message..."
                class="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none py-2"
                @keyup.enter="handleSend"
                :disabled="sending"
              />
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileUpload"
              />
              <button
                @click="triggerFileUpload"
                :disabled="uploadingMedia || sending"
                class="text-gray-400 hover:text-gray-600 transition-colors p-2 disabled:opacity-50"
                title="Attach image"
              >
                <div v-if="uploadingMedia" class="w-5 h-5 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <Paperclip v-else class="w-5 h-5" />
              </button>
              <button
                @click="handleSend"
                :disabled="sending || !draft.trim()"
                class="w-10 h-10 shrink-0 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center disabled:opacity-50 transition-all shadow-sm border border-gray-50 shadow-orange-500/20"
                aria-label="Send message"
              >
                <ArrowRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Floating button with unread badge -->
      <div class="relative flex flex-col items-end">
        <Transition name="fade-slide">
          <div
            v-if="unreadCount > 0 && !isOpen"
            class="absolute bottom-full mb-3 right-0 bg-white shadow-lg rounded-2xl px-4 py-3 flex flex-col items-center shadow-black/10 border border-gray-50 whitespace-nowrap animate-bounce"
          >
            <span class="text-[13px] font-semibold text-gray-800">
              You have {{ unreadCount }} new message{{ unreadCount > 1 ? 's' : '' }}!
            </span>
            <div class="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100"></div>
          </div>
        </Transition>
        <button
          @click="toggleChat"
          class="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-brand-500 to-brand-600 text-white shadow-sm border border-gray-50 shadow-brand-600/40 flex items-center justify-center hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          aria-label="Open chat"
        >
          <div v-if="unreadCount > 0 && !isOpen" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full shadow-sm animate-pulse"></div>
          <div class="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <MessageSquare class="w-7 h-7 transition-transform group-hover:scale-110" />
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { X, ArrowRight, MessageSquare, Paperclip, ChevronLeft } from 'lucide-vue-next'
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { useChat } from '@/composables/modules/chat/useChat'
import type { Chat, ChatMessage } from '@/composables/modules/chat/useChat'
import { upload_api } from '@/api_factory/modules/upload'
import { useCustomToast } from '@/composables/core/useCustomToast'

const {
  chats,
  activeChatId,
  messages,
  isOpen,
  isLoggedIn,
  loadingChats,
  loadingMessages,
  sending,
  incomingMessageTrigger,
  isConnected,
  connectSocket,
  joinActiveChat,
  loadChats,
  openChat,
  sendMessage,
  ensureMyUserId,
  isMine,
  otherParticipant,
  chatTitle,
} = useChat()

const { showToast } = useCustomToast()

const draft = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const messageContainer = ref<HTMLDivElement | null>(null)
const uploadingMedia = ref(false)
const unreadCount = ref(0)

const showChatWidget = computed(() => true)

const headerTitle = computed(() => {
  if (!isLoggedIn.value) return 'Chat'
  if (!activeChatId.value) return 'Messages'
  const chat = chats.value.find((c) => String(c._id) === String(activeChatId.value))
  return chat ? chatTitle(chat) : 'Conversation'
})

const headerSubtitle = computed(() => {
  if (!isLoggedIn.value) return 'Log in to start messaging'
  if (!activeChatId.value) {
    const count = chats.value.length
    return `${count} conversation${count === 1 ? '' : 's'}`
  }
  return isConnected.value ? 'Connected' : 'Connecting…'
})

const participantInitial = (chat: Chat) => {
  const other = otherParticipant(chat)
  return String(other?.firstName?.[0] || other?.email?.[0] || 'U').toUpperCase()
}

const formatTime = (value?: string) => {
  try {
    return value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  } catch {
    return ''
  }
}

const promptLogin = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('open-auth-modal'))
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const openConversation = async (chat: Chat) => {
  await openChat(chat._id)
}

const closeChat = () => {
  activeChatId.value = null
  messages.value = []
}

const handleSend = async () => {
  const text = draft.value.trim()
  if (!text || sending.value) return
  draft.value = ''
  try {
    await sendMessage(text)
  } catch {
    // The composable already surfaced the failure; keep the text so it is not lost.
    draft.value = text
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !activeChatId.value) return

  uploadingMedia.value = true
  try {
    const res: any = await upload_api.uploadFile(file, 'image')
    const url = res?.data?.url || res?.data?.data?.url
    if (!url) throw new Error('No URL returned from the upload server')
    await sendMessage(draft.value.trim() || 'Shared an image', { type: 'image', assetUrl: url })
    draft.value = ''
  } catch (err: any) {
    showToast({
      title: 'Upload failed',
      message: err?.response?.data?.message || err?.message || 'Could not send the image.',
      toastType: 'error',
    })
  } finally {
    uploadingMedia.value = false
    if (input) input.value = ''
  }
}

watch(incomingMessageTrigger, () => {
  if (!isOpen.value) unreadCount.value++
})

watch(isOpen, async (open) => {
  if (!open) return
  unreadCount.value = 0
  if (!isLoggedIn.value) return
  connectSocket()
  joinActiveChat()
  await Promise.all([ensureMyUserId(), loadChats()])
})

// A shared socket cannot outlive the session that authenticated it.
watch(
  messages,
  async () => {
    await nextTick()
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  },
  { deep: true }
)

onMounted(() => {
  if (!isLoggedIn.value) return
  connectSocket()
  void ensureMyUserId()
  void loadChats()
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom right;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
