<template>
  <div class="fixed top-6 left-0 w-full z-[100] px-4 pointer-events-none">
    <div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full h-16 flex items-center justify-between px-2 shadow-sm pointer-events-auto">
      
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 pl-3">
        <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-14 w-auto" />
      </NuxtLink>

      <!-- Actions -->
      <div class="flex items-center gap-1 pr-1">
        <NuxtLink v-if="!user" to="/login" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors rounded-full hover:bg-brand-50 hidden md:block">Log In</NuxtLink>
        <NuxtLink v-else to="/dashboard" class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-100 text-slate-700 hover:text-brand-600 transition-colors mr-2">
          <User class="w-5 h-5" />
        </NuxtLink>
        <NuxtLink to="/sell" class="bg-slate-900 text-white font-black px-6 py-2.5 rounded-full hover:bg-brand-600 transition-colors text-sm">Start Trading</NuxtLink>
      </div>
      
    </div>
  </div>
</template>
<script setup>
import { ArrowRightLeft, User } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()
</script>