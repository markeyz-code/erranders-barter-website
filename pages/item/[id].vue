<template>
  <main class="min-h-screen bg-white pt-24 pb-20 relative">
    
    <!-- 4D Zoom Lightbox (Teleported to body level effectively via fixed positioning) -->
    <div v-if="isZoomOpen && activeMedia.type === 'image'" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-crosshair" @click="isZoomOpen = false">
      <button class="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors z-[101]">
        <X class="w-6 h-6" />
      </button>
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold tracking-widest uppercase pointer-events-none">
        Move mouse to inspect details
      </div>
      
      <!-- 4D Interactive Zoom Container -->
      <div 
        class="relative w-full h-full overflow-hidden flex items-center justify-center"
        @mousemove="handleZoomMove"
        @mouseleave="resetZoom"
      >
        <img 
          :src="activeMedia.src" 
          class="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out"
          :style="{
            transform: `scale(${zoomLevel})`,
            transformOrigin: `${zoomOriginX}% ${zoomOriginY}%`
          }"
        />
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <NuxtLink to="/explore" class="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold mb-6 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to Explore
      </NuxtLink>

      <div v-if="loading" class="text-center py-20 text-slate-500 font-bold">Loading item...</div>
      <div v-else-if="!item" class="text-center py-20 text-red-500 font-bold">Item not found.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- Sophisticated Media Gallery -->
        <div class="w-full flex flex-col gap-4">
          <!-- Main Display -->
          <div 
            class="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 relative group cursor-pointer"
            @click="activeMedia?.type === 'image' ? isZoomOpen = true : null"
          >
            <!-- Image View -->
            <img v-if="activeMedia?.type === 'image'" :src="activeMedia.src" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            
            <!-- Video View -->
            <video v-if="activeMedia?.type === 'video'" :src="activeMedia.src" controls autoplay muted loop class="w-full h-full object-cover"></video>

            <!-- Overlays -->
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-black border border-slate-200 shadow-sm z-10">
              {{ item.type === 'sell' ? 'For Sale' : item.type === 'swap' ? 'For Swap' : 'Service' }}
            </div>
            <div v-if="activeMedia?.type === 'image'" class="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Maximize class="w-4 h-4" /> Click for 4D Zoom
            </div>
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              v-for="(media, idx) in mediaGallery" 
              :key="idx"
              @click="activeMedia = media"
              class="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all"
              :class="activeMedia?.src === media.src ? 'border-brand-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img v-if="media.type === 'image'" :src="media.src" class="w-full h-full object-cover" />
              <div v-if="media.type === 'video'" class="w-full h-full bg-slate-800 relative">
                <img :src="media.thumb || media.src" class="w-full h-full object-cover opacity-50" />
                <PlayCircle class="absolute inset-0 m-auto w-6 h-6 text-white" />
              </div>
            </button>
          </div>
        </div>
        
        <!-- Content Side (Unchanged) -->
        <div class="flex flex-col justify-center">
          
          <div class="mb-8">
            <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">{{ item.title }}</h1>
            <div class="flex items-center gap-4">
              <span class="text-3xl md:text-4xl font-black text-brand-600">₦{{ item.price }}</span>
              <span v-if="item.swapPreference" class="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">Swap: {{ item.swapPreference }}</span>
            </div>
          </div>
          
          <div class="space-y-6 mb-8">
            <div class="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <MapPin class="w-5 h-5 text-brand-500 flex-shrink-0" />
              <span>Location: <strong>{{ item.location }}</strong></span>
            </div>
            
            <div>
              <h3 class="font-bold text-slate-900 mb-2">Description</h3>
              <p class="text-slate-600 leading-relaxed whitespace-pre-line">
                {{ item.description }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between mb-8 pb-8 border-b border-slate-200" v-if="item.sellerId">
            <div class="flex items-center gap-4">
              <div v-if="item.sellerId.avatar" class="w-14 h-14 bg-brand-100 rounded-full overflow-hidden border border-brand-200">
                <img :src="item.sellerId.avatar" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center font-black text-brand-700 text-xl border border-brand-200">
                {{ item.sellerId.firstName?.[0] }}{{ item.sellerId.lastName?.[0] }}
              </div>
              <div>
                <p class="font-black text-slate-900 text-lg">{{ item.sellerId.firstName }} {{ item.sellerId.lastName?.[0] }}.</p>
                <p class="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck v-if="item.sellerId.isVerified" class="w-4 h-4 text-green-500" /> {{ item.sellerId.isVerified ? 'Verified Student' : 'Student' }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Hostel</p>
              <p class="font-bold text-slate-900">{{ item.sellerId.hostel || 'N/A' }}</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 mt-auto">
            <button class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <MessageCircle class="w-5 h-5" /> Chat Seller
            </button>
            <NuxtLink :to="'/checkout?itemId=' + item._id" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:bg-brand-700 transition-colors">
              <ShoppingCart class="w-5 h-5" /> Buy via Escrow
            </NuxtLink>
          </div>
          <p class="text-center mt-4 text-xs font-bold text-slate-400 flex items-center justify-center gap-1">
            <Lock class="w-3 h-3" /> Payments secured by Erranders Escrow
          </p>
          
        </div>
        
      </div>
    </div>
  </main>
</template>
<script setup>
import { ArrowLeft, MapPin, ShieldCheck, MessageCircle, ShoppingCart, Lock, Maximize, X, PlayCircle } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const item = ref(null)
const loading = ref(true)

const mediaGallery = ref([])
const activeMedia = ref(null)
const isZoomOpen = ref(false)

const fetchItem = async () => {
  try {
    const data = await $fetch(`http://localhost:3005/api/v1/items/${route.params.id}`)
    item.value = data
    
    // Construct media gallery
    const gallery = []
    if (data.images && data.images.length > 0) {
      data.images.forEach(img => gallery.push({ type: 'image', src: img }))
    } else {
      gallery.push({ type: 'image', src: 'https://via.placeholder.com/1000' })
    }
    if (data.videos && data.videos.length > 0) {
      data.videos.forEach(vid => gallery.push({ type: 'video', src: vid }))
    }
    mediaGallery.value = gallery
    activeMedia.value = gallery[0]
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchItem()
})

// 4D Zoom Logic
const zoomLevel = ref(1)
const zoomOriginX = ref(50)
const zoomOriginY = ref(50)

const handleZoomMove = (e) => {
  zoomLevel.value = 2.5
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - left) / width) * 100
  const y = ((e.clientY - top) / height) * 100
  zoomOriginX.value = x
  zoomOriginY.value = y
}

const resetZoom = () => {
  zoomLevel.value = 1
  zoomOriginX.value = 50
  zoomOriginY.value = 50
}
</script>
<style>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>