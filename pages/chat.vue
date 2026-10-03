<template>
  <main class="min-h-screen bg-slate-50 pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[75vh]">
        
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
              <p class="text-xs text-green-500 font-bold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-green-500 block animate-pulse"></span> Online
              </p>
            </div>
          </div>
        </div>
        
        <!-- Chat Area -->
        <div class="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4 relative" ref="chatContainer">
          <div v-for="msg in messages" :key="msg._id" :class="isMine(msg) ? 'self-end' : 'self-start'" class="max-w-[80%] group">
            
            <!-- Message Actions (Reply) -->
            <div class="flex items-center gap-2 mb-1" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
              <button @click="setReply(msg)" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 transition-opacity">
                <Reply class="w-4 h-4" />
              </button>
            </div>

            <!-- Tagged Reply Context -->
            <div v-if="msg.replyTo" class="mb-1 p-2 bg-black/5 border-l-4 border-brand-500 rounded text-xs text-slate-500 truncate" :class="isMine(msg) ? 'text-right' : 'text-left'">
              Reply to: "{{ msg.replyTo.content || 'Attachment' }}"
            </div>

            <!-- Message Bubble -->
            <div :class="isMine(msg) ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'" class="p-3 rounded-2xl shadow-sm text-sm break-words relative">
              
              <div v-if="msg.type === 'text'">{{ msg.content }}</div>
              
              <div v-else-if="msg.type === 'image'">
                <img :src="msg.assetUrl" class="w-full max-w-[200px] rounded-xl object-cover mb-1" />
                <span v-if="msg.content">{{ msg.content }}</span>
              </div>
              
              <div v-else-if="msg.type === 'voice'" class="flex items-center gap-2">
                <button @click="playAudio(msg.assetUrl)" class="p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors">
                  <Play class="w-4 h-4" />
                </button>
                <div class="w-24 h-1 bg-black/20 rounded-full overflow-hidden">
                   <div class="w-0 h-full bg-black/40"></div>
                </div>
                <span class="text-xs font-bold">{{ msg.content || 'Voice Note' }}</span>
              </div>

            </div>
            <p :class="isMine(msg) ? 'text-right mr-1' : 'ml-1'" class="text-[10px] text-slate-400 font-bold mt-1">
              {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
        </div>
        
        <!-- Active Reply Banner -->
        <div v-if="replyingTo" class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between">
          <div class="text-xs text-slate-600 truncate border-l-4 border-brand-500 pl-2">
            <span class="font-bold text-brand-600 block">Replying to</span>
            {{ replyingTo.content || 'Attachment' }}
          </div>
          <button @click="replyingTo = null" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4"/></button>
        </div>

        <!-- Attachment Preview -->
        <div v-if="pendingAsset" class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-slate-200 rounded flex items-center justify-center">
              <Image class="w-5 h-5 text-slate-500" />
            </div>
            <span class="text-xs font-bold text-slate-600">Image Attached</span>
          </div>
          <button @click="pendingAsset = null" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4"/></button>
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-white border-t border-slate-100 relative">
          <form @submit.prevent="sendMessage" class="flex items-center gap-2">
            
            <button type="button" @click="$refs.fileInput.click()" class="p-3 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-full transition-colors shrink-0">
              <Paperclip class="w-5 h-5" />
            </button>
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*" class="hidden" />

            <input v-model="newMessage" type="text" placeholder="Type a message..." class="flex-1 bg-slate-50 border border-slate-200 rounded-full py-3 px-5 text-sm outline-none focus:border-brand-500 transition-colors" />
            
            <button v-if="newMessage.trim() || pendingAsset" type="submit" class="w-12 h-12 bg-brand-600 hover:bg-brand-700 rounded-full flex items-center justify-center text-white transition-colors shrink-0 shadow-sm">
              <Send class="w-5 h-5 ml-1" />
            </button>
            
            <button v-else type="button" @mousedown="startRecording" @mouseup="stopRecording" @mouseleave="stopRecording" :class="isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'" class="w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm">
              <Mic class="w-5 h-5" :class="isRecording ? 'text-white' : ''" />
            </button>

          </form>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ArrowLeft, Send, Paperclip, Mic, Image, X, Reply, Play } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { io } from 'socket.io-client'

const route = useRoute()
const { user, token } = useAuth()

const socket = ref(null)
const messages = ref([])
const newMessage = ref('')
const replyingTo = ref(null)
const pendingAsset = ref(null)
const chatContainer = ref(null)
const isRecording = ref(false)
let mediaRecorder = null
let audioChunks = []

const chatId = ref(route.query.chatId || 'test-chat-123') // Should come from API

onMounted(async () => {
  // Connect WebSocket
  socket.value = io('http://localhost:3005', {
    auth: { token: `Bearer ${token.value}` }
  })

  socket.value.on('connect', () => {
    socket.value.emit('joinChat', { chatId: chatId.value })
  })

  socket.value.on('newMessage', (msg) => {
    messages.value.push(msg)
    scrollToBottom()
  })
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})

const isMine = (msg) => {
  return msg.sender?._id === user.value?._id || msg.sender === user.value?._id
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

const handleFile = (e) => {
  const file = e.target.files[0]
  if (file) {
    // In a real app, upload to Cloudinary via backend here, get URL back.
    // For now, simulate:
    pendingAsset.value = URL.createObjectURL(file)
  }
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data)
    }
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      audioChunks = []
      const url = URL.createObjectURL(audioBlob)
      // Send as voice message
      socket.value.emit('sendMessage', {
        chatId: chatId.value,
        content: 'Voice Note (0:05)',
        type: 'voice',
        assetUrl: url
      })
    }
    mediaRecorder.start()
    isRecording.value = true
  } catch (err) {
    alert("Microphone access denied.")
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

const sendMessage = () => {
  if (!newMessage.value.trim() && !pendingAsset.value) return

  socket.value.emit('sendMessage', {
    chatId: chatId.value,
    content: newMessage.value.trim(),
    type: pendingAsset.value ? 'image' : 'text',
    assetUrl: pendingAsset.value || '',
    replyTo: replyingTo.value?._id
  })
  
  newMessage.value = ''
  pendingAsset.value = null
  replyingTo.value = null
}
</script>
