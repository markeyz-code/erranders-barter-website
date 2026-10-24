<template>
  <Teleport to="body">
    <Transition name="call-pop">
      <div
        v-if="incomingCall"
        @touchstart.passive="handleUserTouchRing"
        @pointerdown="handleUserTouchRing"
        @click="handleUserTouchRing"
        class="fixed inset-0 z-[99999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none"
      >
        <div class="bg-slate-900 border border-white/15 text-white rounded-3xl max-w-sm w-full p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          
          <!-- Background Ambient Glow -->
          <div class="absolute -top-24 -left-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Pulsing Rings around Caller Avatar -->
          <div class="relative my-4">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-500/20 animate-ping absolute inset-0"></div>
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-600 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl border-4 border-white/20 relative z-10">
              {{ incomingCall.callerInitial }}
            </div>
          </div>

          <!-- Caller Information -->
          <div class="space-y-1 mb-8 z-10">
            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">
              {{ incomingCall.callerName }}
            </h3>
            <p class="text-xs sm:text-sm font-semibold text-brand-300 flex items-center justify-center gap-1.5 animate-pulse">
              <span class="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
              Incoming {{ incomingCall.type === 'video' ? 'Video' : 'Voice' }} Call...
            </p>
            <p class="text-[11px] text-slate-400 mt-1">Decluttered Escrow Call</p>
          </div>

          <!-- Call Action Buttons -->
          <div class="flex items-center justify-center gap-6 w-full z-10">
            <!-- Decline Call -->
            <button
              type="button"
              @click.stop="declineCall"
              class="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div class="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all">
                <PhoneOff class="w-7 h-7" />
              </div>
              <span class="text-xs font-bold text-slate-300 group-hover:text-white">Decline</span>
            </button>

            <!-- Answer Call -->
            <button
              type="button"
              @click.stop="acceptCall"
              class="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div class="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-all animate-bounce">
                <Video v-if="incomingCall.type === 'video'" class="w-7 h-7" />
                <Phone v-else class="w-7 h-7" />
              </div>
              <span class="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">Answer</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Phone, PhoneOff, Video } from 'lucide-vue-next'
import { useChat } from '@/composables/modules/chat/useChat'
import { startRingtone, stopRingtone, initAudioUnlock } from '@/composables/core/useSound'

interface IncomingCallPayload {
  chatId: string
  type: 'voice' | 'video'
  callerName: string
  callerInitial: string
  offer?: any
}

const router = useRouter()
const route = useRoute()
const { socket, connectSocket, activeChatId } = useChat()

const incomingCall = ref<IncomingCallPayload | null>(null)
let ringTimeout: any = null

const handleUserTouchRing = () => {
  if (incomingCall.value) {
    startRingtone()
  }
}

const declineCall = () => {
  stopRingtone()
  if (ringTimeout) {
    clearTimeout(ringTimeout)
    ringTimeout = null
  }
  const chatId = incomingCall.value?.chatId
  incomingCall.value = null
  if (typeof window !== 'undefined') {
    delete (window as any).__PENDING_CALL_OFFER__
  }
  if (socket.value && chatId) {
    socket.value.emit('call-end', { chatId })
  }
}

const acceptCall = () => {
  stopRingtone()
  if (ringTimeout) {
    clearTimeout(ringTimeout)
    ringTimeout = null
  }
  if (!incomingCall.value) return
  const callData = incomingCall.value
  incomingCall.value = null

  if (typeof window !== 'undefined') {
    (window as any).__PENDING_CALL_OFFER__ = {
      chatId: callData.chatId,
      type: callData.type,
      offer: callData.offer,
      callerName: callData.callerName,
      autoAnswer: true
    }
  }

  // Route directly to chat with autoAnswer parameter and timestamp for reactivity
  router.push(`/chat?chatId=${callData.chatId}&call=${callData.type}&autoAnswer=true&ts=${Date.now()}`)
}

const attachSocketListeners = (s: any) => {
  if (!s) return
  s.off('incoming-call')
  s.off('call-end')

  s.on('incoming-call', (data: any) => {
    // If user is already on chat page in active conversation with this chatId, let chat.vue handle it
    if (route.path === '/chat' && activeChatId.value && String(data?.chatId || '') === String(activeChatId.value)) {
      return
    }

    const callerName = data.callerName || 'Declutter Trader'
    incomingCall.value = {
      chatId: String(data.chatId),
      type: data.type === 'video' ? 'video' : 'voice',
      callerName,
      callerInitial: String(callerName[0] || 'T').toUpperCase(),
      offer: data.offer,
    }

    // Start loud repeating melodic ringtone and mobile phone vibration
    startRingtone()

    // Auto-dismiss and stop ringing after 35 seconds if unanswered
    if (ringTimeout) clearTimeout(ringTimeout)
    ringTimeout = setTimeout(() => {
      declineCall()
    }, 35000)
  })

  s.on('call-end', (data: any) => {
    // Unconditionally dismiss modal and silence ringtone on any call-end
    stopRingtone()
    if (ringTimeout) {
      clearTimeout(ringTimeout)
      ringTimeout = null
    }
    incomingCall.value = null
    if (typeof window !== 'undefined') {
      delete (window as any).__PENDING_CALL_OFFER__
    }
  })
}

onMounted(() => {
  initAudioUnlock()
  connectSocket()
  if (socket.value) {
    attachSocketListeners(socket.value)
  }
})

// Watch socket reactively so listeners are guaranteed to attach whenever socket connects/reconnects
watch(socket, (s) => {
  if (s) {
    attachSocketListeners(s)
  }
}, { immediate: true })

onUnmounted(() => {
  stopRingtone()
  if (ringTimeout) clearTimeout(ringTimeout)
  const s = socket.value
  if (s) {
    s.off('incoming-call')
    s.off('call-end')
  }
})
</script>

<style scoped>
.call-pop-enter-active,
.call-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.call-pop-enter-from,
.call-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
