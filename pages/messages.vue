<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <div class="bg-white p-4 shadow-sm border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
      <button @click="$router.back()" class="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors font-bold">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-xl font-black text-slate-900">Messages</h1>
    </div>
    
    <!-- Chats List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 5" :key="i" class="bg-slate-100 h-20 rounded-2xl animate-pulse"></div>
      </div>
      
      <div v-else-if="chats.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">No messages yet</h3>
        <p class="text-slate-500 font-medium">When you start trading, your chats will appear here.</p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div 
          v-for="chat in chats" 
          :key="chat._id" 
          @click="$router.push(`/chat?chatId=${chat._id}`)"
          class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-500 cursor-pointer transition-colors flex items-center gap-4"
        >
          <div class="w-12 h-12 bg-brand-100 text-brand-700 font-bold text-lg rounded-full flex items-center justify-center shrink-0 border border-brand-200">
            {{ getOtherParticipant(chat)?.firstName?.[0]?.toUpperCase() || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-bold text-slate-900 truncate">
                {{ chatTitle(chat) }}
              </h3>
              <span v-if="chat.lastMessage?.createdAt" class="text-xs font-bold text-slate-400 shrink-0">
                {{ new Date(chat.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) }}
              </span>
            </div>
            <p class="text-sm text-slate-500 truncate">
              <span v-if="chat.lastMessage">{{ chat.lastMessage.content || 'Sent an attachment' }}</span>
              <span v-else class="italic">No messages yet</span>
            </p>
          </div>
          <div class="shrink-0 text-slate-400">
            <ChevronRight class="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, MessageCircle, ChevronRight } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useChat } from '@/composables/modules/chat/useChat'

const {
  chats,
  loadingChats: loading,
  connectSocket,
  loadChats,
  ensureMyUserId,
  otherParticipant,
  chatTitle,
} = useChat()

definePageMeta({
  layout: false
})

onMounted(async () => {
  connectSocket()
  await ensureMyUserId()
  await loadChats()
})

// Kept for the avatar initial in the template.
const getOtherParticipant = (chat) => otherParticipant(chat)
</script>
