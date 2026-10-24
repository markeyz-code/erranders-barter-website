<template>
  <div>
    <!-- Interactive Sticky Floating Banner (Top on mobile so it doesn't block bottom nav/chat, Bottom on desktop) -->
    <Transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="-translate-y-6 sm:translate-y-12 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-6 sm:translate-y-12 opacity-0"
    >
      <!-- State 1: Full Floating Alert Card (Top on Mobile, Bottom-Right on Desktop) -->
      <div
        v-if="hasMissedListings && !isCatchUpModalOpen && !isMinimized"
        class="fixed top-24 left-3 right-3 sm:top-auto sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-950/92 backdrop-blur-xl text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-500/35 flex items-center justify-between gap-3 animate-in fade-in relative overflow-hidden"
      >
        <!-- Golden Ambient Glow -->
        <div class="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex items-center gap-3 min-w-0 z-10">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-brand-500 flex items-center justify-center shrink-0 shadow-md text-slate-950 text-base font-black">
            ⚡
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.5 rounded-md">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                What you missed
              </span>
              <span class="text-[11px] text-slate-400 font-medium">· Since {{ formattedSinceTime }}</span>
            </div>
            <p class="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">
              <span class="text-amber-300 font-black">{{ missedCount }} new deals</span> just dropped!
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0 z-10">
          <!-- Catch Up Action Button -->
          <button
            type="button"
            @click="openCatchUpModal"
            class="px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-brand-500 hover:from-amber-300 hover:to-brand-400 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>Catch Up</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>

          <!-- Minimize to subtle micro pill -->
          <button
            type="button"
            @click="isMinimized = true"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-slate-300 hover:text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
            title="Minimize"
          >
            <Minimize2 class="w-3.5 h-3.5" />
          </button>

          <!-- High-Contrast Prominent Close Button (X) -->
          <button
            type="button"
            @click="dismissCatchUp"
            class="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 active:scale-90 text-red-300 hover:text-white border border-red-500/30 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Close and dismiss"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- State 2: Minimized Micro Floating Badge (Zero footprint on mobile!) -->
      <div
        v-else-if="hasMissedListings && !isCatchUpModalOpen && isMinimized"
        class="fixed top-24 right-3 sm:top-auto sm:bottom-6 sm:right-6 z-40 bg-slate-950/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-2xl border border-amber-500/40 flex items-center gap-2 hover:border-amber-400 transition-all animate-in fade-in"
      >
        <button
          type="button"
          @click="openCatchUpModal"
          class="flex items-center gap-1.5 text-xs font-black cursor-pointer group"
        >
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span class="text-amber-400 group-hover:text-amber-300">⚡ {{ missedCount }} new</span>
          <span class="text-[10px] text-slate-400 font-medium">Catch Up</span>
        </button>

        <button
          type="button"
          @click="isMinimized = false"
          class="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Expand"
        >
          <Maximize2 class="w-3 h-3" />
        </button>

        <button
          type="button"
          @click="dismissCatchUp"
          class="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/30 text-slate-400 hover:text-red-300 flex items-center justify-center transition-all cursor-pointer"
          title="Dismiss completely"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </Transition>

    <!-- Comprehensive Catch-Up Modal / Drawer -->
    <div
      v-if="isCatchUpModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeCatchUpModal"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Modal Header -->
        <div class="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase tracking-wider mb-1 border border-amber-400/30">
              <span>🆕</span> Catch Up On New Deals
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-white">
              Here is what was posted while you were away
            </h3>
            <p class="text-xs text-slate-300 font-medium mt-0.5">
              {{ missedCount }} items & services uploaded since {{ formattedSinceTime }}.
            </p>
          </div>

          <button
            type="button"
            @click="closeCatchUpModal"
            class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            @click="activeTab = 'all'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
            :class="activeTab === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
          >
            All Updates ({{ missedCount }})
          </button>
          <button
            type="button"
            @click="activeTab = 'items'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
            :class="activeTab === 'items' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
          >
            Items & Swaps ({{ newItems.length }})
          </button>
          <button
            type="button"
            @click="activeTab = 'services'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
            :class="activeTab === 'services' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
          >
            Services & Skills ({{ newServices.length }})
          </button>
        </div>

        <!-- Feed List -->
        <div class="p-5 overflow-y-auto flex-1 space-y-3">
          
          <!-- Items List -->
          <template v-if="activeTab === 'all' || activeTab === 'items'">
            <div v-if="newItems.length > 0" class="space-y-2.5">
              <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Newly Listed Marketplace Items</p>
              <NuxtLink
                v-for="item in newItems"
                :key="item._id"
                :to="'/item/' + item._id"
                @click="closeCatchUpModal"
                class="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/20 transition-all group bg-white shadow-2xs"
              >
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img :src="item.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400'" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-extrabold text-sm text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                      {{ item.title }}
                    </h4>
                    <span class="font-black text-brand-600 text-sm whitespace-nowrap">
                      {{ item.type === 'swap' ? 'Swap' : `₦${Number(item.price || 0).toLocaleString()}` }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                      {{ item.type === 'sell' ? 'For Sale' : item.type === 'swap' ? 'Swap' : 'Service' }}
                    </span>
                    <span class="truncate">📍 {{ item.location }}</span>
                    <span class="text-[11px] text-slate-400 ml-auto">Listed {{ formatTimeAgo(item.createdAt) }}</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>

          <!-- Services List -->
          <template v-if="activeTab === 'all' || activeTab === 'services'">
            <div v-if="newServices.length > 0" class="space-y-2.5 mt-4">
              <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Newly Offered Campus Services</p>
              <NuxtLink
                v-for="service in newServices"
                :key="service._id"
                :to="'/services/' + service._id"
                @click="closeCatchUpModal"
                class="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/20 transition-all group bg-white shadow-2xs"
              >
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img :src="service.images?.[0] || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400'" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-extrabold text-sm text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                      {{ service.title }}
                    </h4>
                    <span class="font-black text-purple-700 text-sm whitespace-nowrap">
                      {{ service.priceType === 'negotiable' ? 'Negotiable' : service.priceType === 'hourly' ? `₦${Number(service.price || 0).toLocaleString()}/hr` : `₦${Number(service.price || 0).toLocaleString()}` }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">
                      {{ service.isRemote ? 'Remote Video' : 'In-Person' }}
                    </span>
                    <span class="truncate">By {{ service.providerId?.firstName || 'Provider' }}</span>
                    <span class="text-[11px] text-slate-400 ml-auto">{{ formatTimeAgo(service.createdAt) }}</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>

          <div v-if="newItems.length === 0 && newServices.length === 0" class="text-center py-12 text-slate-400">
            <Clock class="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p class="font-bold text-sm text-slate-600">You're all caught up!</p>
            <p class="text-xs text-slate-400 mt-1">No new listings since your last session.</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <NuxtLink
            to="/explore"
            @click="closeCatchUpModal"
            class="text-xs font-bold text-brand-600 hover:underline"
          >
            Browse all marketplace listings →
          </NuxtLink>
          <button
            type="button"
            @click="closeCatchUpModal"
            class="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArrowRight, X, Clock, Minimize2, Maximize2 } from 'lucide-vue-next';
import { useSessionTracker } from '~/composables/useSessionTracker';

const isMinimized = ref(false);

const {
  hasMissedListings,
  missedCount,
  formattedSinceTime,
  newItems,
  newServices,
  isCatchUpModalOpen,
  initSession,
  dismissCatchUp,
  openCatchUpModal,
  closeCatchUpModal,
} = useSessionTracker();

const activeTab = ref<'all' | 'items' | 'services'>('all');

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMinutes = Math.round((Date.now() - date.getTime()) / (1000 * 60));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
};

onMounted(() => {
  void initSession();
});
</script>
