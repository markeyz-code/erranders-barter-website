<template>
  <div class="fixed top-6 left-0 w-full z-[100] px-4 pointer-events-none">
    <div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full h-16 flex items-center justify-between px-2 shadow-sm pointer-events-auto relative">
      
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 pl-3">
        <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-14 w-auto" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
        <NuxtLink to="/buy" class="hover:text-[#FF5C1A] transition-colors">Buy</NuxtLink>
        <NuxtLink to="/sell" class="hover:text-[#FF5C1A] transition-colors">Sell</NuxtLink>
        <NuxtLink to="/swap" class="hover:text-[#FF5C1A] transition-colors">Swap</NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 pr-1">
        <!-- Desktop Auth -->
        <div v-if="!user" class="hidden md:flex items-center gap-1">
          <NuxtLink to="/login" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#FF5C1A] transition-colors rounded-full hover:bg-[#FF5C1A]/10">Log In</NuxtLink>
          <NuxtLink to="/signup" class="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-full">Sign Up</NuxtLink>
        </div>
        <NuxtLink v-else to="/dashboard" class="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF5C1A]/10 text-slate-700 hover:text-[#FF5C1A] transition-colors mr-2">
          <User class="w-5 h-5" />
        </NuxtLink>
        
        <NuxtLink to="/sell" class="hidden md:block bg-slate-900 text-white font-black px-4 sm:px-6 py-2.5 rounded-full hover:bg-[#FF5C1A] transition-colors text-sm">Start Trading</NuxtLink>

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
          <NuxtLink @click="isMobileMenuOpen = false" to="/buy" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Buy Items</NuxtLink>
          <NuxtLink @click="isMobileMenuOpen = false" to="/sell" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Sell Items</NuxtLink>
          <NuxtLink @click="isMobileMenuOpen = false" to="/swap" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Swap Items</NuxtLink>
          
          <div class="h-px bg-slate-100 my-2 mx-2"></div>
          
          <template v-if="!user">
            <NuxtLink @click="isMobileMenuOpen = false" to="/login" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors">Log In</NuxtLink>
            <NuxtLink @click="isMobileMenuOpen = false" to="/signup" class="px-4 py-3.5 text-base font-bold text-white bg-slate-900 rounded-2xl text-center mt-2 hover:bg-slate-800 transition-colors">Sign Up</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink @click="isMobileMenuOpen = false" to="/dashboard" class="px-4 py-3.5 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors flex items-center gap-3">
              <User class="w-5 h-5"/> Dashboard
            </NuxtLink>
          </template>
          
          <NuxtLink @click="isMobileMenuOpen = false" to="/sell" class="px-4 py-3.5 text-base font-bold text-white bg-[#FF5C1A] rounded-2xl text-center mt-2 hover:bg-[#FF7A45] transition-colors">Start Trading</NuxtLink>
        </div>
      </Transition>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRightLeft, User, Menu, X } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()
const isMobileMenuOpen = ref(false)
</script>