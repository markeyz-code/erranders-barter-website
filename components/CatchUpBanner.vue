<template>
  <div>
    <!-- Interactive Sticky Floating Banner -->
    <Transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-12 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-12 opacity-0"
    >
      <div
        v-if="hasMissedListings && !isCatchUpModalOpen"
        class="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-24 sm:max-w-md z-40 bg-white/95 backdrop-blur-md text-slate-900 p-4 rounded-3xl shadow-2xl border-2 border-brand-500/40 flex items-center justify-between gap-3 animate-in fade-in"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 shadow-sm text-2xl">
            🙋‍♂️
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-full border border-brand-200/80">
                What you missed
              </span>
              <span class="text-xs text-slate-500 font-medium">· Since {{ formattedSinceTime }}</span>
            </div>
            <p class="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
              <strong class="text-brand-600">{{ missedCount }} new listings</strong> just dropped!
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            @click="openCatchUpModal"
            class="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md shadow-brand-600/30 transition-all active:scale-95 flex items-center gap-1"
          >
            <span>Catch Up</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            @click="dismissCatchUp"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Dismiss"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Comprehensive Catch-Up Modal / Drawer -->
    <div
      v-if="isCatchUpModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeCatchUpModal"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Modal Header with Brand Styling -->
        <div class="p-5 sm:p-6 bg-gradient-to-r from-brand-600 via-brand-500 to-amber-600 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] uppercase tracking-wider mb-1 border border-white/30 backdrop-blur-xs">
              <span>🙋‍♂️</span> Catch Up On New Deals
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-white">
              Here is what was posted while you were away
            </h3>
            <p class="text-xs text-amber-100 font-medium mt-0.5">
              {{ missedCount }} items & services uploaded since {{ formattedSinceTime }}.
            </p>
          </div>

          <button
            type="button"
            @click="closeCatchUpModal"
            class="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors relative z-10"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            @click="activeTab = 'all'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
            :class="activeTab === 'all' ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
          >
            All Updates ({{ missedCount }})
          </button>
          <button
            type="button"
            @click="activeTab = 'items'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
            :class="activeTab === 'items' ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
          >
            Items & Swaps ({{ newItems.length }})
          </button>
          <button
            type="button"
            @click="activeTab = 'services'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
            :class="activeTab === 'services' ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
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
            
            <!-- Category Empty State for Items -->
            <div v-else-if="activeTab === 'items'" class="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span class="text-3xl block mb-2">🛍️</span>
              <p class="font-bold text-sm text-slate-800">No new marketplace items or swaps</p>
              <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">No student listings were added since your last visit. Explore all listings to find what you need.</p>
              <NuxtLink to="/explore" @click="closeCatchUpModal" class="mt-4 inline-block px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-500 transition-colors">
                Browse Marketplace
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
                class="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/20 transition-all group bg-white shadow-2xs"
              >
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img :src="service.images?.[0] || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400'" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-extrabold text-sm text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                      {{ service.title }}
                    </h4>
                    <span class="font-black text-brand-600 text-sm whitespace-nowrap">
                      {{ service.priceType === 'negotiable' ? 'Negotiable' : service.priceType === 'hourly' ? `₦${Number(service.price || 0).toLocaleString()}/hr` : `₦${Number(service.price || 0).toLocaleString()}` }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700">
                      {{ service.isRemote ? 'Remote Video' : 'In-Person' }}
                    </span>
                    <span class="truncate">By {{ service.providerId?.firstName || 'Provider' }}</span>
                    <span class="text-[11px] text-slate-400 ml-auto">{{ formatTimeAgo(service.createdAt) }}</span>
                  </div>
                </div>
              </NuxtLink>
            </div>

            <!-- Category Empty State for Services -->
            <div v-else-if="activeTab === 'services'" class="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span class="text-3xl block mb-2">⚡</span>
              <p class="font-bold text-sm text-slate-800">No new campus services or skills</p>
              <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">No student barbers, tutors, or repairers posted since your last visit.</p>
              <NuxtLink to="/services" @click="closeCatchUpModal" class="mt-4 inline-block px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-500 transition-colors">
                Explore All Services
              </NuxtLink>
            </div>
          </template>

          <div v-if="newItems.length === 0 && newServices.length === 0" class="text-center py-12 text-slate-400">
            <span class="text-4xl block mb-2">🙋‍♂️</span>
            <p class="font-bold text-sm text-slate-700">You're all caught up!</p>
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
import { ArrowRight, X, Clock } from 'lucide-vue-next';
import { useSessionTracker } from '~/composables/useSessionTracker';

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
