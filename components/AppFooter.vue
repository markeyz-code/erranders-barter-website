<template>
  <footer class="bg-white text-slate-500 py-10 mt-14 border-t border-slate-200 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
        
        <!-- Brand & Newsletter -->
        <div class="flex-1 w-full lg:max-w-md">
          <NuxtLink to="/" class="flex items-center gap-2 mb-3 group">
            <div class="w-8 h-8 rounded-full bg-[#FF5C1A] flex items-center justify-center text-white shadow-sm shadow-[#FF5C1A]/30 shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m16 3 4 4-4 4"/>
                <path d="M20 7H9a4 4 0 0 0-4 4v1"/>
                <path d="m8 21-4-4 4-4"/>
                <path d="M4 17h11a4 4 0 0 0 4-4v-1"/>
              </svg>
            </div>
            <div class="flex flex-col leading-none">
              <span class="text-xl font-black tracking-tight text-slate-900">Decluttered<span class="text-[#FF5C1A]">.</span></span>
              <span class="text-[7.5px] font-black uppercase tracking-wider text-slate-400">Campus Marketplace</span>
            </div>
          </NuxtLink>
          <p class="text-sm font-medium leading-relaxed mb-4">
            The smartest way to trade, sell, and automate room declutters on campus. Backed by Erranders escrow & logistics.
          </p>
          <div class="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
            <input type="email" placeholder="Enter email for updates..." class="bg-transparent border-none outline-none text-slate-900 text-sm px-4 py-2 w-full" />
            <button class="bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm px-4 py-2 rounded-md transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <!-- Tight Grid Links -->
        <div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-8 lg:justify-end lg:gap-16">
          <div>
            <h4 class="font-black text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              <ShoppingBag class="w-4 h-4 text-brand-500" /> Market
            </h4>
            <ul class="space-y-2 text-sm font-medium">
              <li><NuxtLink to="/category/electronics" class="hover:text-brand-400 transition-colors">Electronics</NuxtLink></li>
              <li><NuxtLink to="/category/textbooks" class="hover:text-brand-400 transition-colors">Textbooks</NuxtLink></li>
              <li><NuxtLink to="/category/furniture" class="hover:text-brand-400 transition-colors">Furniture</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-black text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-green-500" /> Trust
            </h4>
            <ul class="space-y-2 text-sm font-medium">
              <li><NuxtLink to="/about-escrow" class="hover:text-green-400 transition-colors">How Escrow Works</NuxtLink></li>
              <li><NuxtLink to="/trust" class="hover:text-green-400 transition-colors">Safety Guidelines</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-green-400 transition-colors">Terms of Service</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-black text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              <LifeBuoy class="w-4 h-4 text-blue-500" /> Help
            </h4>
            <ul class="space-y-2 text-sm font-medium">
              <li><NuxtLink to="/faq" class="hover:text-blue-400 transition-colors">FAQ</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-blue-400 transition-colors">Contact Support</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200 text-sm font-bold  uppercase text-slate-500">
        <p>© 2026 Erranders Inc.</p>
        <div class="flex gap-4 mt-4 sm:mt-0">
          <a href="#" class="hover:text-brand-600 transition-colors">Twitter</a>
          <a href="#" class="hover:text-brand-600 transition-colors">Instagram</a>
        </div>
      </div>
      
    </div>
  </footer>
</template>
<script setup>
import { ArrowRightLeft, ShoppingBag, ShieldCheck, LifeBuoy } from 'lucide-vue-next'
</script>