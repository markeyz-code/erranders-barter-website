<template>
  <footer class="bg-slate-900 text-slate-400 py-10 mt-20 border-t-[6px] border-brand-600 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
        
        <!-- Brand & Newsletter -->
        <div class="flex-1 w-full lg:max-w-md">
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-brand-600 rounded flex items-center justify-center">
              <ArrowRightLeft class="w-4 h-4 text-white" />
            </div>
            <span class="font-black text-2xl tracking-tighter text-white">Barter.</span>
          </NuxtLink>
          <p class="text-sm font-medium leading-relaxed mb-4">
            The smartest way to trade, sell, and swap on campus. Backed by Erranders logistics.
          </p>
          <div class="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <input type="email" placeholder="Enter email for updates..." class="bg-transparent border-none outline-none text-white text-sm px-4 py-2 w-full" />
            <button class="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-md transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <!-- Tight Grid Links -->
        <div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-8 lg:justify-end lg:gap-16">
          <div>
            <h4 class="font-black text-white mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
              <ShoppingBag class="w-4 h-4 text-brand-500" /> Market
            </h4>
            <ul class="space-y-2 text-sm font-medium">
              <li><NuxtLink to="/category/electronics" class="hover:text-brand-400 transition-colors">Electronics</NuxtLink></li>
              <li><NuxtLink to="/category/textbooks" class="hover:text-brand-400 transition-colors">Textbooks</NuxtLink></li>
              <li><NuxtLink to="/category/furniture" class="hover:text-brand-400 transition-colors">Furniture</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-black text-white mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-green-500" /> Trust
            </h4>
            <ul class="space-y-2 text-sm font-medium">
              <li><NuxtLink to="/escrow" class="hover:text-green-400 transition-colors">How Escrow Works</NuxtLink></li>
              <li><NuxtLink to="/trust" class="hover:text-green-400 transition-colors">Safety Guidelines</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-green-400 transition-colors">Terms of Service</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-black text-white mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
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
      <div class="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800 text-xs font-bold tracking-widest uppercase">
        <p>© 2026 Erranders Inc.</p>
        <div class="flex gap-4 mt-4 sm:mt-0">
          <a href="#" class="hover:text-white transition-colors">Twitter</a>
          <a href="#" class="hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
      
    </div>
  </footer>
</template>
<script setup>
import { ArrowRightLeft, ShoppingBag, ShieldCheck, LifeBuoy } from 'lucide-vue-next'
</script>