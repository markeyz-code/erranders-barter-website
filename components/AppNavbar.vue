<template>
  <div class="fixed top-6 left-0 w-full z-[100] px-4 pointer-events-none">
    <div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full h-16 flex items-center justify-between px-2 shadow-sm pointer-events-auto relative">
      
      <!-- Logo -->
       <a href="/" class="flex items-center gap-2 pl-3">
        <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-14 w-auto" />
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
         <a href="/explore" class="hover:text-[#FF5C1A] transition-colors">Buy</a>
         <a href="/sell" class="hover:text-[#FF5C1A] transition-colors">Sell</a>
         <a href="/swap" class="hover:text-[#FF5C1A] transition-colors">Swap</a>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 pr-1">
        
        <!-- Chat Notification Icon -->
        <a v-if="user" href="/messages" class="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF5C1A]/10 text-slate-700 hover:text-[#FF5C1A] transition-colors">
          <MessageCircle class="w-5 h-5" />
          <span v-if="unreadChats.length > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        </a>

        <!-- Desktop Auth -->
        <div v-if="!user" class="hidden md:flex items-center gap-1">
           <a href="/login" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#FF5C1A] transition-colors rounded-full hover:bg-[#FF5C1A]/10">Log In</a>
           <a href="/signup" class="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-full">Sign Up</a>
        </div>
         <a v-else href="/dashboard" class="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF5C1A]/10 text-slate-700 hover:text-[#FF5C1A] transition-colors mr-2">
          <User class="w-5 h-5" />
        </a>
        
         <a href="/sell" class="hidden md:block bg-slate-900 text-white font-black px-4 sm:px-6 py-2.5 rounded-full hover:bg-[#FF5C1A] transition-colors text-sm">Start Trading</a>

        <!-- Mobile Hamburger Toggle -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors mr-1 outline-none">
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="absolute top-[120%] left-0 w-full bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden md:hidden flex flex-col p-3 gap-1 pointer-events-auto">
           <a @click="isMobileMenuOpen = false" href="/explore" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Buy Items</a>
           <a @click="isMobileMenuOpen = false" href="/sell" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Sell Items</a>
           <a @click="isMobileMenuOpen = false" href="/swap" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Swap Items</a>
          
          <div class="h-px bg-slate-100 my-2 mx-2"></div>
          
          <template v-if="!user">
             <a @click="isMobileMenuOpen = false" href="/login" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Log In</a>
             <a @click="isMobileMenuOpen = false" href="/signup" class="px-4 py-3.5 text-base font-bold text-white bg-slate-900 rounded-2xl text-center mt-2 hover:bg-slate-800 transition-colors">Sign Up</a>
          </template>
          <template v-else>
             <a @click="isMobileMenuOpen = false" href="/messages" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors flex items-center justify-between">
              <div class="flex items-center gap-3"><MessageCircle class="w-5 h-5"/> Messages</div>
              <span v-if="unreadChats.length > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ unreadChats.length }}</span>
            </a>
             <a @click="isMobileMenuOpen = false" href="/dashboard" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors flex items-center gap-3">
              <User class="w-5 h-5"/> Dashboard
            </a>
          </template>
          
           <a @click="isMobileMenuOpen = false" href="/sell" class="px-4 py-3.5 text-base font-bold text-white bg-[#FF5C1A] rounded-2xl text-center mt-2 hover:bg-[#FF7A45] transition-colors">Start Trading</a>
        </div>
      </Transition>
      
    </div>
    
    <!-- Chat Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-[-20px] opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-[-20px] opacity-0"
    >
      <div v-if="showChatToast && latestMessage" class="pointer-events-auto absolute top-20 right-4 max-w-sm w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors" @click="navigateToChat">
        <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
          <MessageCircle class="w-5 h-5 text-brand-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900 truncate">New Message</p>
          <p class="text-sm text-slate-600 truncate mt-0.5">
            {{ latestMessage.message?.content || 'Sent an attachment' }}
          </p>
        </div>
        <button @click.stop="showChatToast = false" class="text-slate-400 hover:text-slate-600 shrink-0">
          <X class="w-5 h-5" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowRightLeft, User, Menu, X, MessageCircle } from 'lucide-vue-next'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'

const { user, token } = useAuth()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const unreadChats = ref([])
const showChatToast = ref(false)
const latestMessage = ref(null)

let socket = null

const navigateToChat = () => {
  if (latestMessage.value) {
    router.push(`/chat?chatId=${latestMessage.value.chatId}`)
    showChatToast.value = false
    unreadChats.value = unreadChats.value.filter(c => c.chatId !== latestMessage.value.chatId)
  }
}

onMounted(() => {
  if (token.value) {
    socket = io(useRuntimeConfig().public.apiBaseUrl.replace('/api/v1', ''), {
      auth: { token: `Bearer ${token.value}` }
    })
    
    socket.on('chatNotification', (data) => {
      if (window.location.pathname.includes('/chat') && window.location.search.includes(data.chatId)) return;
      
      latestMessage.value = data
      showChatToast.value = true
      unreadChats.value.push(data)
      
      setTimeout(() => {
        showChatToast.value = false
      }, 5000)
    })
  }
})

onUnmounted(() => {
  if (socket) socket.disconnect()
})
</script>