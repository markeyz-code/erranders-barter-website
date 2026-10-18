<template>
  <div class="fixed top-6 left-0 w-full z-[100] px-4 pointer-events-none">
    <div class="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200 rounded-full h-14 flex items-center justify-between px-3 pointer-events-auto relative">
      
      <!-- Logo -->
       <a href="/" class="flex items-center gap-2 pl-1">
        <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-8 sm:h-9 w-auto object-contain" />
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600">
         <a href="/explore" class="hover:text-[#FF5C1A] transition-colors">Buy</a>
         <a href="/sell" class="hover:text-[#FF5C1A] transition-colors">Sell</a>
         <a href="/swap" class="hover:text-[#FF5C1A] transition-colors">Swap</a>
         <a href="/services" class="hover:text-[#FF5C1A] transition-colors">Services</a>
         <a href="/reels" class="hover:text-[#FF5C1A] transition-colors flex items-center gap-1 font-black text-slate-800">
           <span>Reels</span>
           <span class="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">Hot 🔥</span>
         </a>
         <a href="/declutter" class="hover:text-[#FF5C1A] transition-colors flex items-center gap-1">
           <span>Declutter</span>
           <span class="bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-black px-1.5 py-0.2 rounded-full">New</span>
         </a>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 pr-1">
        
        <!-- Notifications Bell (Desktop) -->
        <div v-if="user" class="relative hidden md:block">
          <button
            type="button"
            @click="toggleNotifications"
            class="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF5C1A]/10 text-slate-700 hover:text-[#FF5C1A] transition-colors"
            title="Notifications"
          >
            <Bell class="w-5 h-5" />
            <span
              v-if="unreadNotificationsCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs"
            >
              {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 pointer-events-auto"
            >
              <div class="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-black text-slate-900">Notifications</h4>
                  <span
                    v-if="unreadNotificationsCount > 0"
                    class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700"
                  >
                    {{ unreadNotificationsCount }} new
                  </span>
                </div>
                <button
                  v-if="unreadNotificationsCount > 0"
                  type="button"
                  @click="markAllNotificationsRead"
                  class="text-xs font-bold text-[#FF5C1A] hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <!-- Notifications List -->
              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
                <div
                  v-if="notificationsLoading"
                  class="p-6 text-center text-xs text-slate-400"
                >
                  Loading notifications...
                </div>
                <div
                  v-else-if="notifications.length === 0"
                  class="p-6 text-center text-xs text-slate-400"
                >
                  No notifications yet. You're all caught up!
                </div>
                <div
                  v-else
                  v-for="notif in notifications"
                  :key="notif._id"
                  @click="handleNotificationClick(notif)"
                  class="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 text-left"
                  :class="!notif.isRead ? 'bg-orange-50/40' : ''"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    :class="!notif.isRead ? 'bg-[#FF5C1A]/10 text-[#FF5C1A]' : 'bg-slate-100 text-slate-500'"
                  >
                    <Package v-if="notif.type && notif.type.includes('declutter')" class="w-4 h-4" />
                    <Calendar v-else-if="notif.type && notif.type.includes('booking')" class="w-4 h-4" />
                    <DollarSign v-else-if="notif.type && notif.type.includes('escrow')" class="w-4 h-4" />
                    <Bell v-else class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-1">
                      <p class="text-xs font-extrabold text-slate-900 truncate">
                        {{ notif.title }}
                      </p>
                      <span v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0 mt-1"></span>
                    </div>
                    <p class="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                      {{ notif.message }}
                    </p>
                    <p class="text-[10px] text-slate-400 font-semibold mt-1">
                      {{ formatTimeAgo(notif.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <a
                  href="/dashboard"
                  class="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  View Activity in Dashboard →
                </a>
              </div>
            </div>
          </Transition>
        </div>

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
        <div v-if="isMobileMenuOpen" class="absolute top-[120%] left-0 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden md:hidden flex flex-col p-2.5 gap-1 pointer-events-auto">
           <a @click="isMobileMenuOpen = false" href="/explore" class="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">Buy Items</a>
           <a @click="isMobileMenuOpen = false" href="/sell" class="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">Sell Items</a>
           <a @click="isMobileMenuOpen = false" href="/swap" class="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">Swap Items</a>
          <a @click="isMobileMenuOpen = false" href="/services" class="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">Book a Service</a>
          <a @click="isMobileMenuOpen = false" href="/reels" class="px-3.5 py-2.5 text-sm font-extrabold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between">
            <span class="flex items-center gap-2"><span>📱</span> Campus Reels</span>
            <span class="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Hot 🔥</span>
          </a>
          <a @click="isMobileMenuOpen = false" href="/declutter" class="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between">
            <span>Hostel Declutter</span>
            <span class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">Automated</span>
          </a>
          
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
      <div v-if="showChatToast && latestMessage" class="pointer-events-auto absolute top-20 right-4 max-w-sm w-full bg-white rounded-xl border border-slate-200 p-3.5 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors" @click="navigateToChat">
        <div class="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
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
import {
  ArrowRightLeft,
  User,
  Menu,
  X,
  MessageCircle,
  Bell,
  Package,
  Calendar,
  DollarSign,
} from 'lucide-vue-next'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'
import { notificationsApi } from '@/api_factory/modules/notifications'

const { user, token } = useAuth()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const unreadChats = ref([])
const showChatToast = ref(false)
const latestMessage = ref(null)

// Notifications state
const isNotificationsOpen = ref(false)
const notifications = ref([])
const unreadNotificationsCount = ref(0)
const notificationsLoading = ref(false)

let socket = null
let notificationPollTimer = null

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const loadNotifications = async () => {
  if (!user.value) return
  notificationsLoading.value = true
  try {
    const res = await notificationsApi.list(15)
    notifications.value = res.data?.data || []
    unreadNotificationsCount.value = Number(res.data?.unreadCount || 0)
  } catch (err) {
    // silent fallback
  } finally {
    notificationsLoading.value = false
  }
}

const toggleNotifications = async () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    await loadNotifications()
  }
}

const markAllNotificationsRead = async () => {
  try {
    await notificationsApi.markAllRead()
    unreadNotificationsCount.value = 0
    notifications.value.forEach((n) => (n.isRead = true))
  } catch (err) {}
}

const handleNotificationClick = async (notif) => {
  if (!notif.isRead) {
    try {
      await notificationsApi.markRead(notif._id)
      notif.isRead = true
      unreadNotificationsCount.value = Math.max(0, unreadNotificationsCount.value - 1)
    } catch (err) {}
  }
  isNotificationsOpen.value = false
  if (notif.link) {
    router.push(notif.link)
  }
}

const navigateToChat = () => {
  if (latestMessage.value) {
    router.push(`/chat?chatId=${latestMessage.value.chatId}`)
    showChatToast.value = false
    unreadChats.value = unreadChats.value.filter(c => c.chatId !== latestMessage.value.chatId)
  }
}

onMounted(() => {
  if (user.value) {
    loadNotifications()
    notificationPollTimer = setInterval(loadNotifications, 60000)
  }

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
  if (notificationPollTimer) clearInterval(notificationPollTimer)
})
</script>