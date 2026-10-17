<template>
  <main class="h-[calc(100vh-80px)] bg-white flex flex-col overflow-hidden relative">
    
    <!-- Call Overlay -->
    <div v-if="activeCall" class="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center text-white">
      <div v-if="callType === 'video'" class="absolute inset-0 z-0">
        <video ref="remoteVideo" autoplay playsinline class="w-full h-full object-cover"></video>
        <video ref="localVideo" autoplay playsinline muted class="absolute bottom-6 right-6 w-32 h-48 bg-black rounded-xl object-cover shadow-xl border-2 border-slate-700"></video>
      </div>
      
      <div v-if="callType === 'voice'" class="w-32 h-32 bg-slate-800 rounded-full mb-6 flex items-center justify-center animate-pulse z-10 mt-auto">
        <span class="text-4xl font-bold text-slate-400">?</span>
      </div>

      <div class="relative z-10 flex flex-col items-center justify-center text-center mt-auto mb-10 bg-gradient-to-t from-black/80 to-transparent p-8 w-full">
        <h2 class="text-2xl font-bold mb-2">{{ callStatus }}</h2>
        
        <div class="flex items-center gap-6 mt-8">
          <button v-if="callStatus === 'Incoming Call...'" @click="answerCall" class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
            <Phone class="w-7 h-7" />
          </button>
          <button @click="endCall" class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
            <PhoneOff class="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col h-full w-full">
      <div class="bg-white overflow-hidden flex flex-col h-full w-full relative">
        
        <!-- Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm z-10 relative">
          <div class="flex items-center gap-3">
            <button @click="router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft class="w-5 h-5 text-slate-600" />
            </button>
            <div class="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold border border-brand-200">
              {{ headerInitial }}
            </div>
            <div>
              <h2 class="font-bold text-slate-900 leading-tight">{{ headerTitle }}</h2>
              <p class="text-sm font-bold flex items-center gap-1" :class="isConnected ? 'text-green-500' : 'text-slate-400'">
                <span class="w-2 h-2 rounded-full block" :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'"></span>
                {{ isConnected ? 'Online' : 'Connecting...' }}
              </p>
            </div>
          </div>
          
          <div v-if="activeChatId" class="flex items-center gap-2 text-slate-500">
            <button @click="startCall('voice')" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Phone class="w-5 h-5 text-brand-600" />
            </button>
            <button @click="startCall('video')" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Video class="w-5 h-5 text-brand-600" />
            </button>
          </div>
        </div>
        
        <!-- Network Upload Indicator -->
        <div v-if="isUploading" class="absolute top-[72px] left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl shadow-slate-900/20">
          <Loader2 class="w-3 h-3 animate-spin" />
          Sending Media...
        </div>
        
        <!-- Chat Area -->
        <div class="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4 relative" ref="chatContainer" @click="showEmojis = false">
          <!-- No conversation resolved from the URL -->
          <div v-if="conversationUnavailable" class="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <MessageSquare class="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{{ notice.title }}</h3>
              <p class="text-slate-500 font-medium max-w-sm">{{ notice.message }}</p>
            </div>
            <NuxtLink to="/messages" class="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-brand-600 transition-colors text-sm">
              View my messages
            </NuxtLink>
          </div>

          <div v-else-if="loadingConversation" class="flex-1 flex items-center justify-center">
            <Loader2 class="w-6 h-6 text-slate-400 animate-spin" />
          </div>

          <div v-else-if="!messages.length" class="flex-1 flex items-center justify-center text-center">
            <p class="text-slate-500 font-medium">No messages yet — say hello.</p>
          </div>

          <div v-for="msg in messages" :key="msg._id" :class="isMine(msg) ? 'self-end' : 'self-start'" class="max-w-[85%] group">
            
            <!-- Message Actions (Reply) -->
            <div class="flex items-center gap-2 mb-1" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
              <button @click="setReply(msg)" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 transition-opacity">
                <Reply class="w-4 h-4" />
              </button>
            </div>

            <!-- Tagged Reply Context -->
            <div v-if="msg.replyTo" class="mb-1 p-2 bg-black/5 border-l-4 border-brand-500 rounded text-sm text-slate-500 truncate" :class="isMine(msg) ? 'text-right' : 'text-left'">
              Reply to: "{{ replyPreview(msg) }}"
            </div>

            <!-- Message Bubble -->
            <div :class="isMine(msg) ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'" class="p-3 rounded-2xl shadow-sm text-sm break-words relative overflow-hidden">
              
              <div v-if="msg.type === 'image' && msg.assetUrl">
                <img :src="msg.assetUrl" class="w-full max-w-[250px] rounded-xl object-cover mb-2 bg-black/5" loading="lazy" />
                <span v-if="msg.content" class="block mt-1">{{ msg.content }}</span>
              </div>

              <div v-else-if="msg.type === 'voice' && msg.assetUrl" class="flex items-center gap-2">
                <audio :src="msg.assetUrl" controls class="h-10 w-[200px] sm:w-[250px] outline-none filter drop-shadow-sm"></audio>
              </div>

              <div v-else class="whitespace-pre-wrap">{{ msg.content }}</div>

            </div>
            <p :class="isMine(msg) ? 'text-right mr-1' : 'ml-1'" class="text-[10px] text-slate-400 font-bold mt-1">
              {{ formatTime(msg.createdAt) }}
            </p>
          </div>
        </div>
        
        <!-- Active Reply Banner -->
        <div v-if="replyingTo" class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between">
          <div class="text-sm text-slate-600 truncate border-l-4 border-brand-500 pl-2">
            <span class="font-bold text-brand-600 block">Replying to</span>
            {{ replyPreview(replyingTo) }}
          </div>
          <button @click="replyingTo = null" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4"/></button>
        </div>

        <!-- Attachment Preview -->
        <div v-if="pendingAsset" class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
              <img :src="pendingAsset" class="w-full h-full object-cover" />
            </div>
            <span class="text-sm font-bold text-slate-600">Attachment Ready</span>
          </div>
          <button @click="cancelAttachment" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4"/></button>
        </div>
        
        <!-- Emoji Picker Popover -->
        <div v-if="showEmojis" class="absolute bottom-[76px] left-4 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 w-[280px] z-20">
          <div class="grid grid-cols-6 gap-2">
            <button v-for="emoji in popularEmojis" :key="emoji" @click="appendEmoji(emoji)" class="text-2xl hover:bg-slate-100 rounded-lg p-1 transition-colors">
              {{ emoji }}
            </button>
          </div>
        </div>

        <!-- Input Area -->
        <div v-if="!conversationUnavailable" class="p-3 bg-white border-t border-slate-100 relative">
          <form @submit.prevent="sendMessage" class="flex items-end gap-2">
            
            <button type="button" @click="showEmojis = !showEmojis" class="p-3 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-full transition-colors shrink-0 mb-0.5">
              <Smile class="w-5 h-5" />
            </button>

            <button type="button" @click="triggerFileInput" class="p-3 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-full transition-colors shrink-0 mb-0.5">
              <Paperclip class="w-5 h-5" />
            </button>
            <button type="button" @click="startCamera" class="p-3 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-full transition-colors shrink-0 mb-0.5" :disabled="isUploading">
              <Camera class="w-5 h-5" />
            </button>
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*" class="hidden" />

            <div class="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-center min-h-[48px] focus-within:border-brand-500 transition-colors">
              <textarea 
                v-model="newMessage" 
                placeholder="Type a message..." 
                class="w-full bg-transparent p-3 text-sm outline-none resize-none max-h-32"
                rows="1"
                @input="resizeTextarea"
                @keydown.enter.prevent="sendMessage"
                ref="messageInput"
              ></textarea>
            </div>
            
            <button v-if="newMessage.trim() || pendingAsset" type="submit" :disabled="isUploading || sending" class="w-12 h-12 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors shrink-0 shadow-sm mb-0.5">
              <Send v-if="!isUploading && !sending" class="w-5 h-5 ml-1" />
              <Loader2 v-else class="w-5 h-5 animate-spin" />
            </button>
            
            <button v-else type="button" @mousedown="startRecording" @mouseup="stopRecording" @mouseleave="stopRecording" @touchstart.prevent="startRecording" @touchend.prevent="stopRecording" :class="isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30' : 'bg-brand-100 hover:bg-brand-200 text-brand-600'" class="w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm mb-0.5 relative">
              <Mic class="w-5 h-5" :class="isRecording ? 'text-white' : ''" />
              <span v-if="isRecording" class="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">Recording...</span>
            </button>

          </form>
        </div>

        <!-- Camera Overlay -->
        <div v-if="showCamera" class="absolute inset-0 bg-black z-50 flex flex-col">
          <div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent absolute top-0 w-full z-10">
            <button @click="stopCamera" class="text-white p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur">
              <X class="w-6 h-6" />
            </button>
            <button @click="switchCamera" class="text-white p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur">
              <RefreshCw class="w-6 h-6" />
            </button>
          </div>
          
          <video ref="videoElement" class="w-full h-full object-cover flex-1" autoplay playsinline></video>
          <canvas ref="canvasElement" class="hidden"></canvas>
          
          <div class="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center">
            <button @click="capturePhoto" :disabled="isUploading" class="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center p-1 active:scale-95 transition-transform disabled:opacity-50">
              <div v-if="isUploading" class="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <div v-else class="w-full h-full bg-white rounded-full"></div>
            </button>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ArrowLeft, Send, Paperclip, Mic, X, Reply, Phone, Video, Smile, Loader2, PhoneOff, Camera, RefreshCw, MessageSquare } from 'lucide-vue-next'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useChat } from '@/composables/modules/chat/useChat'
import { upload_api } from '@/api_factory/modules/upload'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const { token } = useAuth()
const { showToast } = useCustomToast()

// Shared chat state/logic (conversation list, history, gateway socket, sending)
const {
  chats,
  activeChatId,
  messages,
  sending,
  isConnected,
  socket,
  connectSocket,
  loadChats,
  openChat,
  startChat,
  sendMessage: sendChatMessage,
  ensureMyUserId,
  isMine,
  otherParticipant,
  chatTitle,
} = useChat()

const newMessage = ref('')
const replyingTo = ref(null)
const pendingAsset = ref(null)
const pendingFile = ref(null)
const chatContainer = ref(null)
const messageInput = ref(null)
const fileInput = ref(null)
const isRecording = ref(false)
const isUploading = ref(false)
const showEmojis = ref(false)
const loadingConversation = ref(true)
const conversationUnavailable = ref(false)

const activeCall = ref(null)
const peerConnection = ref(null)
const localStream = ref(null)
const remoteStream = ref(null)
const callStatus = ref('')
const callType = ref('voice')
const remoteVideo = ref(null)
const localVideo = ref(null)
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

const popularEmojis = ['😀','😂','🥰','😎','🥺','😭','🙏','👍','🔥','✨','❤️','🎉']

let mediaRecorder = null
let audioChunks = []

const activeChat = computed(() => chats.value.find(c => String(c._id) === String(activeChatId.value)) || null)
const headerTitle = computed(() => (activeChat.value ? chatTitle(activeChat.value) : 'Secure Chat'))
const headerInitial = computed(() => {
  const participant = activeChat.value ? otherParticipant(activeChat.value) : null
  return String(participant?.firstName?.[0] || participant?.email?.[0] || 'S').toUpperCase()
})

const notice = computed(() => {
  if (!token.value) {
    return {
      title: 'Log in to chat',
      message: 'Conversations with other traders need a signed-in account.',
    }
  }
  return {
    title: 'No conversation selected',
    message: 'Open one of your conversations, or start a new one from an item listing.',
  }
})

onMounted(async () => {
  if (!token.value) {
    conversationUnavailable.value = true
    loadingConversation.value = false
    return
  }

  const chatIdFromQuery = route.query.chatId ? String(route.query.chatId) : ''
  const sellerId = route.query.sellerId ? String(route.query.sellerId) : ''
  const itemId = route.query.itemId ? String(route.query.itemId) : undefined

  connectSocket()
  attachCallListeners()

  try {
    await ensureMyUserId()
    if (chatIdFromQuery) {
      await openChat(chatIdFromQuery)
      if (!chats.value.length) await loadChats()
    } else if (sellerId) {
      await startChat(sellerId, itemId)
    } else {
      conversationUnavailable.value = true
    }
  } catch (err) {
    console.error('Failed to open conversation', err)
    conversationUnavailable.value = true
  } finally {
    loadingConversation.value = false
    scrollToBottom()
  }

  // Auto-start call if requested via query parameter
  if (route.query.call === 'voice' || route.query.call === 'video') {
    setTimeout(() => {
      startCall(route.query.call)
    }, 1000)
  }
})

onUnmounted(() => {
  stopCamera()
  const s = socket.value
  if (s) {
    s.off('call-offer')
    s.off('call-answer')
    s.off('call-ice-candidate')
    s.off('call-end')
  }
})

const attachCallListeners = () => {
  const s = socket.value
  if (!s) return

  s.on('call-offer', async (data) => {
    callType.value = data.type
    activeCall.value = true
    callStatus.value = 'Incoming Call...'
    peerConnection.value = new RTCPeerConnection(config)
    
    peerConnection.value.ontrack = (event) => {
      remoteStream.value = event.streams[0]
      if (data.type === 'video') nextTick(() => { if (remoteVideo.value) remoteVideo.value.srcObject = remoteStream.value })
      else {
        const audio = new Audio()
        audio.srcObject = remoteStream.value
        audio.play()
      }
    }
    
    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) {
        s.emit('call-ice-candidate', { chatId: activeChatId.value, candidate: event.candidate })
      }
    }
    
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.offer))
  })

  s.on('call-answer', async (data) => {
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.answer))
    callStatus.value = 'Connected'
  })

  s.on('call-ice-candidate', async (data) => {
    if (peerConnection.value) {
      await peerConnection.value.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  })

  s.on('call-end', () => {
    cleanupCall()
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const formatTime = (value) => {
  try {
    return value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  } catch {
    return ''
  }
}

const replyPreview = (msg) => {
  if (!msg) return 'Attachment'
  if (typeof msg.replyTo === 'object' && msg.replyTo) return msg.replyTo.content || 'Attachment'
  return msg.content || 'Attachment'
}

const setReply = (msg) => {
  replyingTo.value = msg
}

const appendEmoji = (emoji) => {
  newMessage.value += emoji
  resizeTextarea()
  if (messageInput.value) messageInput.value.focus()
}

const resizeTextarea = () => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
      messageInput.value.style.height = (messageInput.value.scrollHeight) + 'px'
    }
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFile = (e) => {
  const file = e.target.files[0]
  // The Message schema type enum is text | image | voice — video is not supported.
  if (file) {
    pendingFile.value = file
    pendingAsset.value = URL.createObjectURL(file)
  }
}

const cancelAttachment = () => {
  pendingAsset.value = null
  pendingFile.value = null
}

const startRecording = async () => {
  if (!activeChatId.value || isUploading.value) return
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size) audioChunks.push(e.data)
    }
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      audioChunks = []
      if (!activeChatId.value) return

      isUploading.value = true
      try {
        const res = await upload_api.uploadFile(audioBlob, 'audio')
        const url = res?.data?.url || res?.data?.data?.url
        if (!url) throw new Error('No URL returned from the upload server')
        await sendChatMessage('Voice note', { type: 'voice', assetUrl: url })
      } catch (err) {
        console.error('Audio upload failed', err)
        showToast({
          title: 'Upload failed',
          message: err?.response?.data?.message || err?.message || 'Could not send the voice note.',
          toastType: 'error'
        })
      } finally {
        isUploading.value = false
      }
    }
    mediaRecorder.start()
    isRecording.value = true
  } catch (err) {
    showToast({ title: 'Notice', message: "Microphone access denied.", toastType: "error" })
  }
}

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
    mediaRecorder.stream.getTracks().forEach(track => track.stop())
  }
}

const sendMessage = async (e) => {
  if (e && e.shiftKey) return; // Allow Shift+Enter for new line
  if (!newMessage.value.trim() && !pendingFile.value) return
  if (!activeChatId.value) return

  let uploadedUrl = ''

  if (pendingFile.value) {
    isUploading.value = true
    try {
      const res = await upload_api.uploadFile(pendingFile.value, 'image')
      uploadedUrl = res?.data?.url || res?.data?.data?.url || ''
      if (!uploadedUrl) throw new Error('No URL returned from the upload server')
    } catch (err) {
      console.error('Upload failed', err)
      showToast({
        title: 'Upload failed',
        message: err?.response?.data?.message || err?.message || 'Could not upload the attachment.',
        toastType: 'error'
      })
      isUploading.value = false
      return
    }
    isUploading.value = false
  }

  const content = newMessage.value.trim()
  const replyTo = replyingTo.value?._id

  newMessage.value = ''
  cancelAttachment()
  replyingTo.value = null
  showEmojis.value = false
  if (messageInput.value) messageInput.value.style.height = 'auto'

  try {
    await sendChatMessage(content, {
      type: uploadedUrl ? 'image' : 'text',
      assetUrl: uploadedUrl || undefined,
      replyTo,
    })
  } catch (err) {
    // The composable has already surfaced the failure.
  }
}

const startCall = async (type) => {
  if (!socket.value) {
    showToast({ title: 'Notice', message: 'Still connecting to chat. Please try again in a moment.', toastType: 'error' })
    return
  }
  callType.value = type
  activeCall.value = true
  callStatus.value = 'Calling...'
  
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true })
    if (type === 'video') nextTick(() => { if (localVideo.value) localVideo.value.srcObject = localStream.value })
    
    peerConnection.value = new RTCPeerConnection(config)
    localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value))
    
    peerConnection.value.ontrack = (event) => {
      remoteStream.value = event.streams[0]
      if (type === 'video') nextTick(() => { if (remoteVideo.value) remoteVideo.value.srcObject = remoteStream.value })
      else {
        const audio = new Audio()
        audio.srcObject = remoteStream.value
        audio.play()
      }
    }
    
    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) {
        socket.value.emit('call-ice-candidate', { chatId: activeChatId.value, candidate: event.candidate })
      }
    }
    
    const offer = await peerConnection.value.createOffer()
    await peerConnection.value.setLocalDescription(offer)
    socket.value.emit('call-offer', { chatId: activeChatId.value, offer, type })
  } catch (err) {
    showToast({ title: 'Notice', message: "Camera/Microphone permissions denied.", toastType: "error" })
    cleanupCall()
  }
}

const answerCall = async () => {
  callStatus.value = 'Connecting...'
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: callType.value === 'video', audio: true })
    if (callType.value === 'video') nextTick(() => { if (localVideo.value) localVideo.value.srcObject = localStream.value })
    
    localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value))
    
    const answer = await peerConnection.value.createAnswer()
    await peerConnection.value.setLocalDescription(answer)
    socket.value.emit('call-answer', { chatId: activeChatId.value, answer })
    callStatus.value = 'Connected'
  } catch (err) {
    showToast({ title: 'Notice', message: "Camera/Microphone permissions denied.", toastType: "error" })
    endCall()
  }
}

const endCall = () => {
  if (socket.value) socket.value.emit('call-end', { chatId: activeChatId.value })
  cleanupCall()
}

const cleanupCall = () => {
  activeCall.value = false
  if (localStream.value) localStream.value.getTracks().forEach(t => t.stop())
  if (peerConnection.value) peerConnection.value.close()
  localStream.value = null
  remoteStream.value = null
  peerConnection.value = null
}
// --- Camera Logic ---
const showCamera = ref(false)
const videoElement = ref(null)
const canvasElement = ref(null)
const cameraStream = ref(null)
const facingMode = ref('environment')

const startCamera = async () => {
  showCamera.value = true;
  try {
    if (cameraStream.value) {
      cameraStream.value.getTracks().forEach(track => track.stop());
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode.value }
    });
    cameraStream.value = stream;
    nextTick(() => {
      if (videoElement.value) {
        videoElement.value.srcObject = stream;
      }
    });
  } catch (error) {
    console.error('Error accessing camera:', error);
    showToast({ title: 'Camera Error', message: 'Could not access the camera.', toastType: 'error' });
    showCamera.value = false;
  }
}

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop());
    cameraStream.value = null;
  }
  showCamera.value = false;
}

const switchCamera = () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment';
  startCamera(); // Restart with new facing mode
}

const capturePhoto = async () => {
  if (!videoElement.value || !canvasElement.value) return;
  
  const video = videoElement.value;
  const canvas = canvasElement.value;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    
    // Stop camera immediately after capture to show we're processing
    stopCamera();
    
    const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    isUploading.value = true;
    try {
      const res = await upload_api.uploadFile(file, 'image');
      const url = res?.data?.url || res?.data?.data?.url;
      if (url) {
        await sendChatMessage('📷 Photo sent', { type: 'image', assetUrl: url });
      }
    } catch (err) {
      console.error('Failed to upload captured photo', err);
      showToast({ title: 'Upload Failed', message: 'Failed to upload photo. Please try again.', toastType: 'error' });
    } finally {
      isUploading.value = false;
    }
  }, 'image/jpeg', 0.8);
}

// Keep the view pinned to the newest message.
watch(messages, async () => { await nextTick(); scrollToBottom() }, { deep: true })
</script>
