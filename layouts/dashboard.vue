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
        <NuxtLink to="/dashboard/trades" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/trades') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <ArrowRightLeft class="w-5 h-5" /> Active Trades
        </NuxtLink>
        <NuxtLink to="/dashboard/wallet" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/wallet') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <Wallet class="w-5 h-5" /> Escrow Wallet
        </NuxtLink>
        <NuxtLink to="/dashboard/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors" exact-active-class="bg-brand-50 text-brand-600" :class="isActive('/dashboard/settings') ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50'">
          <Settings class="w-5 h-5" /> Settings
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
      <button @click="mobileMenu = !mobileMenu" class="p-2 text-slate-500">
        <Menu v-if="!mobileMenu" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </header>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenu" class="md:hidden fixed inset-0 bg-white z-[35] pt-20 px-4 flex flex-col">
      <nav class="flex-1 space-y-4">
        <NuxtLink @click="mobileMenu = false" to="/dashboard" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg transition-colors bg-brand-50 text-brand-600">
          <LayoutDashboard class="w-6 h-6" /> Overview
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/trades" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowRightLeft class="w-6 h-6" /> Active Trades
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/wallet" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Wallet class="w-6 h-6" /> Escrow Wallet
        </NuxtLink>
        <NuxtLink @click="mobileMenu = false" to="/dashboard/settings" class="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Settings class="w-6 h-6" /> Settings
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

  </div>
</template>

<script setup>
import { LayoutDashboard, ArrowRightLeft, Wallet, Settings, LogOut, HeartCrack, Menu, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

const mobileMenu = ref(false)
const showLogoutModal = ref(false)

const isActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const handleLogout = () => {
  showLogoutModal.value = false
  logout()
  router.push('/login')
}
</script>
