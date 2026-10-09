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
            <button @click="$router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft class="w-5 h-5 text-slate-600" />
            </button>
            <div class="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold border border-brand-200">
              S
            </div>
            <div>
              <h2 class="font-bold text-slate-900 leading-tight">Secure Chat</h2>
              <p class="text-sm text-green-500 font-bold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-green-500 block animate-pulse"></span> Online
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2 text-slate-500">
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
          <div v-for="msg in messages" :key="msg._id" :class="isMine(msg) ? 'self-end' : 'self-start'" class="max-w-[85%] group">
            
            <!-- Message Actions (Reply) -->
            <div class="flex items-center gap-2 mb-1" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
              <button @click="setReply(msg)" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 transition-opacity">
                <Reply class="w-4 h-4" />
              </button>
            </div>

            <!-- Tagged Reply Context -->
            <div v-if="msg.replyTo" class="mb-1 p-2 bg-black/5 border-l-4 border-brand-500 rounded text-sm text-slate-500 truncate" :class="isMine(msg) ? 'text-right' : 'text-left'">
              Reply to: "{{ msg.replyTo.content || 'Attachment' }}"
            </div>

            <!-- Message Bubble -->
            <div :class="isMine(msg) ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'" class="p-3 rounded-2xl shadow-sm text-sm break-words relative overflow-hidden">
              
              <div v-if="msg.type === 'text'" class="whitespace-pre-wrap">{{ msg.content }}</div>
              
              <div v-else-if="msg.type === 'image'">
                <img :src="msg.assetUrl" class="w-full max-w-[250px] rounded-xl object-cover mb-2 bg-black/5" loading="lazy" />
                <span v-if="msg.content" class="block mt-1">{{ msg.content }}</span>
              </div>
              
              <div v-else-if="msg.type === 'video'">
                <video :src="msg.assetUrl" controls class="w-full max-w-[250px] rounded-xl object-cover mb-2 bg-black/5"></video>
                <span v-if="msg.content" class="block mt-1">{{ msg.content }}</span>
              </div>

              <div v-else-if="msg.type === 'voice'" class="flex items-center gap-2">
                <audio :src="msg.assetUrl" controls class="h-10 w-[200px] sm:w-[250px] outline-none filter drop-shadow-sm"></audio>
              </div>

            </div>
            <p :class="isMine(msg) ? 'text-right mr-1' : 'ml-1'" class="text-[10px] text-slate-400 font-bold mt-1">
              {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
        </div>
        
        <!-- Active Reply Banner -->
        <div v-if="replyingTo" class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between">
          <div class="text-sm text-slate-600 truncate border-l-4 border-brand-500 pl-2">
            <span class="font-bold text-brand-600 block">Replying to</span>
            {{ replyingTo.content || 'Attachment' }}
          </div>
          <button @click="replyingTo = null" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4"/></button>
        </div>

        <!-- Attachment Preview -->
        <div v-if="pendingAsset" class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
              <img v-if="pendingFileType === 'image'" :src="pendingAsset" class="w-full h-full object-cover" />
              <Video v-else-if="pendingFileType === 'video'" class="w-6 h-6 text-slate-500" />
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
        <div class="p-3 bg-white border-t border-slate-100 relative">
          <form @submit.prevent="sendMessage" class="flex items-end gap-2">
            
            <button type="button" @click="showEmojis = !showEmojis" class="p-3 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-full transition-colors shrink-0 mb-0.5">
              <Smile class="w-5 h-5" />
            </button>

            <button type="button" @click="$refs.fileInput.click()" class="p-3 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-full transition-colors shrink-0 mb-0.5">
              <Paperclip class="w-5 h-5" />
            </button>
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*,video/*" class="hidden" />

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
            
            <button v-if="newMessage.trim() || pendingAsset" type="submit" :disabled="isUploading" class="w-12 h-12 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors shrink-0 shadow-sm mb-0.5">
              <Send v-if="!isUploading" class="w-5 h-5 ml-1" />
              <Loader2 v-else class="w-5 h-5 animate-spin" />
            </button>
            
            <button v-else type="button" @mousedown="startRecording" @mouseup="stopRecording" @mouseleave="stopRecording" @touchstart.prevent="startRecording" @touchend.prevent="stopRecording" :class="isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30' : 'bg-brand-100 hover:bg-brand-200 text-brand-600'" class="w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm mb-0.5 relative">
              <Mic class="w-5 h-5" :class="isRecording ? 'text-white' : ''" />
              <span v-if="isRecording" class="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">Recording...</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ArrowLeft, Send, Paperclip, Mic, Image, X, Reply, Play, Phone, Video, Smile, Loader2, MicOff, PhoneOff } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

import { io } from 'socket.io-client'

definePageMeta({
  layout: false
})

const route = useRoute()
const { user, token } = useAuth()

const socket = ref(null)
const messages = ref([])
const newMessage = ref('')
const replyingTo = ref(null)
const pendingAsset = ref(null)
const pendingFile = ref(null)
const pendingFileType = ref(null)
const chatContainer = ref(null)
const messageInput = ref(null)
const isRecording = ref(false)
const isUploading = ref(false)
const activeCall = ref(null)
const showEmojis = ref(false)

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

const chatId = ref(route.query.chatId || '')
const sellerId = ref(route.query.sellerId || '')
const itemId = ref(route.query.itemId || '')

onMounted(async () => {
  // If sellerId is provided, init the chat via backend API
  if (sellerId.value && !chatId.value) {
    try {
      const res = await $fetch('/chats/init', {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { participantId: sellerId.value, itemId: itemId.value }
      })
      chatId.value = res._id
    } catch (err) {
      console.error('Failed to init chat', err)
      return
    }
  }

  // Fallback for safety
  if (!chatId.value) {
    chatId.value = 'test-chat-123'
  }

  // Fetch previous messages
  try {
    const prevMessages = await $fetch(`/chats/${chatId.value}/messages`, {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      headers: { Authorization: `Bearer ${token.value}` }
    })
    messages.value = prevMessages || []
    scrollToBottom()
  } catch (err) {
    console.error('Failed to fetch messages', err)
  }

  // Connect WebSocket
  socket.value = io(useRuntimeConfig().public.apiBaseUrl.replace('/api/v1', ''), {
    auth: { token: `Bearer ${token.value}` }
  })

  socket.value.on('connect', () => {
    socket.value.emit('joinChat', { chatId: chatId.value })
  })

  socket.value.on('newMessage', (msg) => {
    messages.value.push(msg)
    scrollToBottom()
  })

  socket.value.on('call-offer', async (data) => {
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
        socket.value.emit('call-ice-candidate', { chatId: chatId.value, candidate: event.candidate })
      }
    }
    
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.offer))
  })

  socket.value.on('call-answer', async (data) => {
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.answer))
    callStatus.value = 'Connected'
  })

  socket.value.on('call-ice-candidate', async (data) => {
    if (peerConnection.value) {
      await peerConnection.value.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  })

  socket.value.on('call-end', () => {
    cleanupCall()
  })

  // Auto-start call if requested via query parameter
  if (route.query.call === 'voice' || route.query.call === 'video') {
    setTimeout(() => {
      startCall(route.query.call)
    }, 1000)
  }
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})

const isMine = (msg) => {
  const currentUserId = user.value?._id || user.value?.id
  return msg.sender?._id === currentUserId || msg.sender === currentUserId
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
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

const handleFile = (e) => {
  const file = e.target.files[0]
  if (file) {
    pendingFile.value = file
    pendingFileType.value = file.type.startsWith('video/') ? 'video' : 'image'
    pendingAsset.value = URL.createObjectURL(file)
  }
}

const cancelAttachment = () => {
  pendingAsset.value = null
  pendingFile.value = null
  pendingFileType.value = null
}



const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data)
    }
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      audioChunks = []
      
      const formData = new FormData()
      formData.append('file', audioBlob, 'voicenote.webm')
      
      isUploading.value = true
      try {
        const res = await $fetch('/upload/video', {
          baseURL: useRuntimeConfig().public.apiBaseUrl,
          method: 'POST',
          headers: { Authorization: `Bearer ${token.value}` },
          body: formData
        })
        
        socket.value.emit('sendMessage', {
          chatId: chatId.value,
          content: 'Voice Note',
          type: 'voice',
          assetUrl: res.url
        })
      } catch (err) {
        console.error('Audio upload failed', err)
      } finally {
        isUploading.value = false
      }
    }
    mediaRecorder.start()
    isRecording.value = true
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: "Microphone access denied.", toastType: "error" })
  }
}

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
    mediaRecorder.stream.getTracks().forEach(track => track.stop())
  }
}

const playAudio = (url) => {
  const audio = new window.Audio(url)
  audio.play()
}

const sendMessage = async (e) => {
  if (e && e.shiftKey) return; // Allow Shift+Enter for new line
  if (!newMessage.value.trim() && !pendingFile.value) return

  let uploadedUrl = ''
  let fileType = pendingFileType.value || 'text'
  
  if (pendingFile.value) {
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', pendingFile.value)
    
    try {
      const endpoint = fileType === 'video' ? '/upload/video' : '/upload/image'
      const res = await $fetch(endpoint, {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: formData
      })
      uploadedUrl = res.url
    } catch(err) {
      console.error('Upload failed', err)
      isUploading.value = false
      return
    }
    isUploading.value = false
  }

  socket.value.emit('sendMessage', {
    chatId: chatId.value,
    content: newMessage.value.trim(),
    type: uploadedUrl ? fileType : 'text',
    assetUrl: uploadedUrl,
    replyTo: replyingTo.value?._id
  })
  
  newMessage.value = ''
  cancelAttachment()
  replyingTo.value = null
  showEmojis.value = false
  if (messageInput.value) messageInput.value.style.height = 'auto'
}

const startCall = async (type) => {
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
        socket.value.emit('call-ice-candidate', { chatId: chatId.value, candidate: event.candidate })
      }
    }
    
    const offer = await peerConnection.value.createOffer()
    await peerConnection.value.setLocalDescription(offer)
    socket.value.emit('call-offer', { chatId: chatId.value, offer, type })
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: "Camera/Microphone permissions denied.", toastType: "error" })
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
    socket.value.emit('call-answer', { chatId: chatId.value, answer })
    callStatus.value = 'Connected'
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: "Camera/Microphone permissions denied.", toastType: "error" })
    endCall()
  }
}

const endCall = () => {
  if (socket.value) socket.value.emit('call-end', { chatId: chatId.value })
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
</script>
