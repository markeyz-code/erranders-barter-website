<template>
  <div class="fixed top-6 left-0 w-full z-50 px-4 pointer-events-none">
    <div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full h-16 flex items-center justify-between px-2 shadow-sm pointer-events-auto">
      
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 pl-3">
        <div class="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border border-slate-200">
          <ArrowRightLeft class="w-4 h-4 text-white" />
        </div>
        <span class="font-black text-xl tracking-tighter text-slate-900 hidden sm:block">Barter.</span>
      </NuxtLink>

      <!-- Actions -->
      <div class="flex items-center gap-1 pr-1">
        <NuxtLink to="/login" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors rounded-full hover:bg-brand-50 hidden md:block">Log In</NuxtLink>
        <NuxtLink to="/sell" class="bg-slate-900 text-white font-black px-6 py-2.5 rounded-full hover:bg-brand-600 transition-colors text-sm">Start Trading</NuxtLink>
      </div>
      
    </div>
  </div>
</template>
<script setup>
import { ArrowRightLeft } from 'lucide-vue-next'
</script>