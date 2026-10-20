<template>
  <div class="fixed top-6 left-0 w-full z-[100] px-4 pointer-events-none">
    <div class="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200 rounded-full h-14 flex items-center justify-between px-3 pointer-events-auto relative">
      
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 pl-1 group">
        <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-8 w-8 rounded-xl object-contain transition-transform group-hover:scale-105 shadow-xs" />
        <span class="font-black text-slate-900 tracking-tight text-lg sm:text-xl">
          Decluttered<span class="text-[#FF5C1A]">.</span>
        </span>
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-6 text-sm font-bold">
        <NuxtLink
          to="/explore"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/explore') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-[#FF5C1A]'"
        >
          Buy
          <span v-if="isRouteActive('/explore')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/sell"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/sell') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-[#FF5C1A]'"
        >
          Sell
          <span v-if="isRouteActive('/sell')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/swap"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/swap') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-[#FF5C1A]'"
        >
          Swap
          <span v-if="isRouteActive('/swap')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/services"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/services') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-[#FF5C1A]'"
        >
          Services
          <span v-if="isRouteActive('/services')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/become-a-business"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/become-a-business') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-[#FF5C1A]'"
        >
          For businesses
          <span v-if="isRouteActive('/become-a-business')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/reels"
          class="transition-colors py-1 relative flex items-center gap-1"
          :class="isRouteActive('/reels') ? 'text-[#FF5C1A] font-black' : 'text-slate-800 hover:text-[#FF5C1A]'"
        >
          <span>Reels</span>
          <span class="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">Hot 🔥</span>
          <span v-if="isRouteActive('/reels')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/declutter"
          class="transition-colors py-1 relative flex items-center gap-1"
          :class="isRouteActive('/declutter') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-[#FF5C1A]'"
        >
          <span>Declutter</span>
          <span class="bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-black px-1.5 py-0.2 rounded-full">New</span>
          <span v-if="isRouteActive('/declutter')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/business"
          class="transition-colors py-1 relative flex items-center gap-1"
          :class="isRouteActive('/business') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-[#FF5C1A]'"
        >
          <span>Business Hub</span>
          <span class="bg-purple-100 text-purple-700 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">Vendor</span>
          <span v-if="isRouteActive('/business')" class="absolute -bottom-1.5 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>
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
        <div v-if="isMobileMenuOpen" class="absolute top-[120%] left-0 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden md:hidden flex flex-col p-2.5 gap-1 pointer-events-auto shadow-2xl">
          <NuxtLink
            to="/explore"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between"
            :class="isRouteActive('/explore')
              ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
              : 'font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'"
          >
            <span>Buy Items</span>
            <span v-if="isRouteActive('/explore')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
          </NuxtLink>

          <NuxtLink
            to="/sell"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between"
            :class="isRouteActive('/sell')
              ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
              : 'font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'"
          >
            <span>Sell Items</span>
            <span v-if="isRouteActive('/sell')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
          </NuxtLink>

          <NuxtLink
            to="/swap"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between"
            :class="isRouteActive('/swap')
              ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
              : 'font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'"
          >
            <span>Swap Items</span>
            <span v-if="isRouteActive('/swap')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
          </NuxtLink>

          <NuxtLink
            to="/services"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between"
            :class="isRouteActive('/services')
              ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
              : 'font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'"
          >
            <span>Book a Service</span>
            <span v-if="isRouteActive('/services')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
          </NuxtLink>

          <NuxtLink
            to="/reels"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between"
            :class="isRouteActive('/reels')
              ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
              : 'font-extrabold text-slate-800 hover:bg-slate-50 border border-transparent'"
          >
            <span class="flex items-center gap-2"><span>📱</span> Campus Reels</span>
            <div class="flex items-center gap-1.5">
              <span class="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Hot 🔥</span>
              <span v-if="isRouteActive('/reels')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/declutter"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between"
            :class="isRouteActive('/declutter')
              ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
              : 'font-bold text-slate-700 hover:bg-slate-50 border border-transparent'"
          >
            <span>Hostel Declutter</span>
            <div class="flex items-center gap-1.5">
              <span class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">Automated</span>
              <span v-if="isRouteActive('/declutter')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/business"
            @click="isMobileMenuOpen = false"
            class="px-3.5 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between"
            :class="isRouteActive('/business')
              ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
              : 'font-bold text-slate-700 hover:bg-slate-50 border border-transparent'"
          >
            <div class="flex items-center gap-2">
              <span>💼 Business Mini-Admin</span>
            </div>
            <span class="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full">Vendors</span>
          </NuxtLink>
          
          <div class="h-px bg-slate-100 my-2 mx-2"></div>
          
          <template v-if="!user">
            <NuxtLink
              to="/login"
              @click="isMobileMenuOpen = false"
              class="px-4 py-3.5 text-base rounded-2xl transition-all flex items-center justify-between"
              :class="isRouteActive('/login')
                ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
                : 'font-bold text-slate-700 hover:bg-slate-50 border border-transparent'"
            >
              <span>Log In</span>
              <span v-if="isRouteActive('/login')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
            </NuxtLink>
            <NuxtLink
              to="/signup"
              @click="isMobileMenuOpen = false"
              class="px-4 py-3.5 text-base font-bold text-white bg-slate-900 rounded-2xl text-center mt-2 hover:bg-slate-800 transition-colors"
            >
              Sign Up
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/messages"
              @click="isMobileMenuOpen = false"
              class="px-4 py-3.5 text-base rounded-2xl transition-all flex items-center justify-between"
              :class="isRouteActive('/messages')
                ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
                : 'font-bold text-slate-700 hover:bg-slate-50 border border-transparent'"
            >
              <div class="flex items-center gap-3">
                <MessageCircle class="w-5 h-5" :class="isRouteActive('/messages') ? 'text-[#FF5C1A]' : 'text-slate-600'" />
                <span>Messages</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="unreadChats.length > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ unreadChats.length }}</span>
                <span v-if="isRouteActive('/messages')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
              </div>
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              @click="isMobileMenuOpen = false"
              class="px-4 py-3.5 text-base rounded-2xl transition-all flex items-center justify-between"
              :class="isRouteActive('/dashboard')
                ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] font-black border border-[#FF5C1A]/25 shadow-xs'
                : 'font-bold text-slate-700 hover:bg-slate-50 border border-transparent'"
            >
              <div class="flex items-center gap-3">
                <User class="w-5 h-5" :class="isRouteActive('/dashboard') ? 'text-[#FF5C1A]' : 'text-slate-600'" />
                <span>Dashboard</span>
              </div>
              <span v-if="isRouteActive('/dashboard')" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0"></span>
            </NuxtLink>
          </template>
          
          <NuxtLink
            to="/sell"
            @click="isMobileMenuOpen = false"
            class="px-4 py-3.5 text-base font-bold text-white bg-[#FF5C1A] rounded-2xl text-center mt-2 hover:bg-[#FF7A45] transition-colors shadow-lg shadow-[#FF5C1A]/25"
          >
            Start Trading
          </NuxtLink>
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
import { useRouter, useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { notificationsApi } from '@/api_factory/modules/notifications'
import { playNotificationSound } from '@/composables/core/useSound'

const { user, token } = useAuth()
const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const isRouteActive = (target) => {
  const currentPath = route.path
  if (target === '/explore') {
    return currentPath === '/explore' && !route.query.declutter
  }
  if (target === '/declutter') {
    return currentPath === '/declutter' || (currentPath === '/explore' && Boolean(route.query.declutter))
  }
  if (target === '/sell') {
    return currentPath === '/sell'
  }
  if (target === '/swap') {
    return currentPath === '/swap'
  }
  if (target === '/services') {
    return currentPath.startsWith('/services')
  }
  if (target === '/reels') {
    return currentPath.startsWith('/reels')
  }
  if (target === '/messages') {
    return currentPath.startsWith('/messages')
  }
  if (target === '/dashboard') {
    return currentPath.startsWith('/dashboard')
  }
  if (target === '/login') {
    return currentPath === '/login'
  }
  if (target === '/signup') {
    return currentPath === '/signup'
  }
  if (target === '/') {
    return currentPath === '/'
  }
  return currentPath.startsWith(target)
}
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
    const newCount = Number(res.data?.unreadCount || 0)
    if (newCount > unreadNotificationsCount.value && unreadNotificationsCount.value >= 0) {
      playNotificationSound()
    }
    unreadNotificationsCount.value = newCount
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

  if (process.client && token.value) {
    try {
      socket = io(useRuntimeConfig().public.apiBaseUrl.replace('/api/v1', ''), {
        auth: { token: `Bearer ${token.value}` },
        transports: ['polling'],
      })
      
      socket.on('chatNotification', (data) => {
        if (typeof window !== 'undefined' && window.location.pathname.includes('/chat') && window.location.search.includes(data.chatId)) return;
        
        latestMessage.value = data
        showChatToast.value = true
        unreadChats.value.push(data)
        playNotificationSound()
        
        setTimeout(() => {
          showChatToast.value = false
        }, 5000)
      })
    } catch (err) {
      console.warn('Socket init failed:', err)
    }
  }
})

onUnmounted(() => {
  if (socket) socket.disconnect()
  if (notificationPollTimer) clearInterval(notificationPollTimer)
})
</script>