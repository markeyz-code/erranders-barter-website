<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex sticky top-0 h-screen shrink-0">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-10 w-auto" />
        </NuxtLink>
      </div>
      <nav class="p-4 flex-1 space-y-2">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <LayoutDashboard class="w-5 h-5" /> Overview
        </NuxtLink>
        <NuxtLink to="/dashboard/listings" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/listings') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <Package class="w-5 h-5" /> My Listings
        </NuxtLink>
        <NuxtLink to="/dashboard/trades" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/trades') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <ArrowRightLeft class="w-5 h-5" /> Escrow Trades
        </NuxtLink>
        <NuxtLink to="/dashboard/offers" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/offers') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <Repeat class="w-5 h-5" /> Trade Hub
        </NuxtLink>
        <NuxtLink to="/dashboard/wallet" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/wallet') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <Wallet class="w-5 h-5" /> Escrow Wallet
        </NuxtLink>
        <NuxtLink to="/dashboard/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/settings') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <Settings class="w-5 h-5" /> Settings
        </NuxtLink>
        <NuxtLink to="/messages" class="flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/messages') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <div class="flex items-center gap-3"><MessageCircle class="w-5 h-5" /> Messages</div>
          <span v-if="unreadChats.length > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ unreadChats.length }}</span>
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-slate-100">
        <button @click="showLogoutModal = true" class="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors">
          <LogOut class="w-5 h-5" /> Sign Out
        </button>
      </div>
    </aside>

    <!-- Mobile Topbar -->
    <header class="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-40">
      <NuxtLink to="/">
        <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-8 w-auto" />
      </NuxtLink>
      <div class="flex items-center gap-3">
        <NuxtLink to="/messages" class="relative text-slate-500">
          <MessageCircle class="w-6 h-6" />
          <span v-if="unreadChats.length > 0" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        </NuxtLink>
        <button @click="mobileMenu = !mobileMenu" class="p-2 text-slate-500">
          <Menu v-if="!mobileMenu" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenu" class="md:hidden fixed inset-0 bg-white z-[35] pt-20 px-4 flex flex-col">
      <nav class="flex-1 space-y-4">
        <NuxtLink @click="mobileMenu = false" to="/dashboard" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg transition-colors bg-brand-50 text-brand-600">
          <LayoutDashboard class="w-6 h-6" /> Overview
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/listings" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Package class="w-6 h-6" /> My Listings
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/trades" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowRightLeft class="w-6 h-6" /> Escrow Trades
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/offers" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Repeat class="w-6 h-6" /> Trade Hub
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/wallet" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Wallet class="w-6 h-6" /> Escrow Wallet
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/settings" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Settings class="w-6 h-6" /> Settings
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/messages" class="flex items-center justify-between px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3"><MessageCircle class="w-6 h-6" /> Messages</div>
          <span v-if="unreadChats.length > 0" class="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full">{{ unreadChats.length }}</span>
        </NuxtLink>
      </nav>
      <div class="pb-8 pt-4">
        <button @click="mobileMenu = false; showLogoutModal = true" class="flex items-center gap-3 px-4 py-4 w-full rounded-xl font-bold text-lg text-red-500 hover:bg-red-50 transition-colors">
          <LogOut class="w-6 h-6" /> Sign Out
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl relative">
        <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <HeartCrack class="w-8 h-8" />
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">Leaving so soon?</h3>
        <p class="text-slate-500 font-medium mb-8">We'll keep your listings safe while you're away. Come back soon!</p>
        <div class="flex gap-3">
          <button @click="showLogoutModal = false" class="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
          <button @click="handleLogout" class="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200">Sign Out</button>
        </div>
      </div>
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
      <div v-if="showChatToast && latestMessage" class="z-[200] pointer-events-auto fixed top-20 right-4 max-w-sm w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors" @click="navigateToChat">
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
import { LayoutDashboard, ArrowRightLeft, Wallet, Settings, LogOut, HeartCrack, Menu, X, MessageCircle, Repeat, Package } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { io } from 'socket.io-client'

const route = useRoute()
const router = useRouter()
const { logout, token, user } = useAuth()

const mobileMenu = ref(false)
const showLogoutModal = ref(false)

const unreadChats = ref([])
const showChatToast = ref(false)
const latestMessage = ref(null)
let socket = null

const isActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const handleLogout = () => {
  showLogoutModal.value = false
  logout()
  router.push('/login')
}

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
