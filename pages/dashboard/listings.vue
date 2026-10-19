<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">My Active Listings</h1>
          <p class="text-slate-500 font-medium text-xs sm:text-sm">Manage all the items you've posted for sale or swap.</p>
        </div>
        <NuxtLink to="/sell" class="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
          <Plus class="w-4 h-4" /> Post New Item
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div v-for="i in 8" :key="i" class="bg-slate-100 rounded-xl h-52 animate-pulse"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 class="font-bold text-red-700 mb-1">Could not load your listings</h2>
        <p class="text-sm text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchListings" class="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-brand-700 text-sm transition-colors">
          Try again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && items.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div class="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageX class="w-7 h-7 text-brand-600" />
        </div>
        <h2 class="text-lg font-bold text-slate-900 mb-1">No active listings</h2>
        <p class="text-slate-500 text-sm mb-5 max-w-xs mx-auto">You haven't posted any items yet. Start selling or swapping to make some cash!</p>
        <NuxtLink to="/sell" class="inline-flex bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors items-center gap-2">
          <Plus class="w-4 h-4" /> Post Your First Item
        </NuxtLink>
      </div>

      <!-- Items Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <NuxtLink v-for="item in items" :key="item._id" :to="`/item/${item._id}`" class="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-brand-500 transition-colors">
          
          <!-- Image Container -->
          <div class="relative aspect-square bg-slate-100 overflow-hidden container-query-wrap">
            <div 
              class="w-full h-full flex item-carousel-track"
              :class="{ 'item-carousel': item.images && item.images.length > 1 }"
            >
              <!-- Single Image Fallback -->
              <img v-if="!item.images || item.images.length === 0" src="/no-image.png" class="w-full h-full object-cover" />
              <img v-else-if="item.images.length === 1" :src="item.images[0]" class="w-full h-full object-cover" />
              
              <!-- Multi-image Carousel -->
              <div 
                v-else 
                class="w-full h-full flex transition-transform duration-1000 ease-linear"
                :style="{ animation: `scroll-carousel ${item.images.length * 3}s linear infinite` }"
              >
                <div v-for="(img, idx) in [...item.images, ...item.images]" :key="idx" class="h-full flex-shrink-0 w-[100cqw]">
                  <img :src="img" :alt="`${item.title} - ${idx + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- Type badge -->
            <div 
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border"
              :class="item.type === 'swap' ? 'bg-amber-50/90 backdrop-blur text-amber-700 border-amber-200' : 'bg-white/90 backdrop-blur text-slate-700 border-slate-200'"
            >
              {{ item.type }}
            </div>
          </div>

          <!-- Content Section -->
          <div class="p-3 sm:p-4">
            <div class="flex justify-between items-start gap-2 mb-1">
              <h3 class="font-bold text-sm sm:text-base truncate text-slate-900">{{ item.title }}</h3>
              <span v-if="item.type !== 'swap' && item.price" class="font-black text-brand-600 text-sm sm:text-base flex-shrink-0">
                ₦{{ Number(item.price).toLocaleString() }}
              </span>
            </div>
            
            <div v-if="item.type === 'swap' && item.swapPreference" class="mb-2">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full truncate max-w-full">
                <ArrowRightLeft class="w-3 h-3 shrink-0" />
                {{ item.swapPreference }}
              </span>
            </div>
            
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-2">
              <MapPin class="w-3 h-3 flex-shrink-0" /> {{ item.location }}
            </p>
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Plus, PackageX, MapPin, ArrowRightLeft } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { itemsApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'My Active Listings | Decluttered by Erranders' })

const items = ref([])
const loading = ref(true)
const error = ref('')

const fetchListings = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await itemsApi.myListings()
    items.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value =
      err?.response?.data?.message || 'The listings API did not respond. Nothing is shown as a placeholder.'
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchListings)
</script>

<style scoped>
.container-query-wrap { container-type: inline-size; }
.item-carousel { overflow: hidden; }
.item-carousel:hover .item-carousel-track > div { animation-play-state: paused; }
@keyframes scroll-carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
