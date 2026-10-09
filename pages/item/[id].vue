<template>
  <main class="min-h-screen bg-white pb-20 relative">
    
    <!-- 4D Zoom Lightbox (Teleported to body level effectively via fixed positioning) -->
    <div v-if="isZoomOpen && activeMedia.type === 'image'" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-crosshair" @click="isZoomOpen = false">
      <button class="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors z-[101]">
        <X class="w-6 h-6" />
      </button>
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold  uppercase pointer-events-none">
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

    <div class="max-w-6xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      
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
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm uppercase  font-black border border-slate-200 z-10">
              {{ item.type === 'sell' ? 'For Sale' : item.type === 'swap' ? 'For Swap' : 'Service' }}
            </div>
            <div v-if="activeMedia?.type === 'image'" class="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-white text-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Maximize class="w-4 h-4" /> Click for 4D Zoom
            </div>
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              v-for="(media, idx) in mediaGallery" 
              :key="idx"
              @click="activeMedia = media"
              class="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border transition-all"
              :class="activeMedia?.src === media.src ? 'border-brand-600' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img v-if="media.type === 'image'" :src="media.src" class="w-full h-full object-cover" />
              <div v-if="media.type === 'video'" class="w-full h-full bg-slate-800 relative flex items-center justify-center">
                <PlayCircle class="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
          
          <!-- Play Video Button -->
          <button v-if="hasVideo" @click="playFirstVideo" class="mt-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <PlayCircle class="w-5 h-5 text-brand-400" /> Play Product Video
          </button>
        </div>
        
        <!-- Content Side (Unchanged) -->
        <div class="flex flex-col justify-center">
          
          <div class="mb-8">
            <h1 class="text-2xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{{ item.title }}</h1>
            <div class="flex items-center gap-4">
              <span v-if="item.type !== 'swap'" class="text-3xl md:text-4xl font-black text-brand-600">₦{{ Number(item.price || 0).toLocaleString() }}</span>
              <span v-if="item.type === 'swap' && item.swapPreference" class="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">Swap: {{ item.swapPreference }}</span>
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
              <div class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center font-black text-brand-700 text-xl border border-brand-200 relative overflow-hidden">
                <span class="absolute">{{ item.sellerId.firstName?.[0] }}{{ item.sellerId.lastName?.[0] }}</span>
                <img v-if="item.sellerId.avatar" :src="item.sellerId.avatar" class="w-full h-full object-cover absolute inset-0 z-10" @error="$event.target.style.display='none'" />
              </div>
              <div>
                <p class="font-black text-slate-900 text-lg">{{ item.sellerId.firstName }} {{ item.sellerId.lastName?.[0] }}.</p>
                <p class="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck v-if="item.sellerId.isVerified" class="w-4 h-4 text-green-500" /> {{ item.sellerId.isVerified ? 'Verified Student' : 'Student' }}
                </p>
              </div>
            </div>
            <div class="text-right" v-if="item.sellerId.hostel">
              <p class="text-sm font-bold text-slate-400 uppercase ">Hostel</p>
              <p class="font-bold text-slate-900">{{ item.sellerId.hostel }}</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 mt-auto" v-if="user?._id !== (item.sellerId?._id || item.sellerId)">
            <!-- Sell Type (Buy Flow) -->
            <template v-if="item.type === 'sell'">
              <button @click="startChat" class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <MessageCircle class="w-5 h-5" /> Chat Seller
              </button>
              <NuxtLink :to="'/checkout?itemId=' + item._id" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors">
                <ShoppingCart class="w-5 h-5" /> Buy via Escrow
              </NuxtLink>
            </template>

            <!-- Swap Type -->
            <template v-else-if="item.type === 'swap'">
              <div v-if="hasPendingOffer" class="flex-1 bg-amber-50 border border-amber-200 text-amber-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-center px-4">
                <AlertTriangle class="w-5 h-5 flex-shrink-0" /> You have already sent an offer for this item
              </div>
              <button v-else @click="startSwapProposal" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors">
                <Repeat class="w-5 h-5" /> Propose Swap
              </button>
            </template>

            <!-- Service Type -->
            <template v-else-if="item.type === 'service'">
              <button @click="startChat" class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <MessageCircle class="w-5 h-5" /> Message Provider
              </button>
              <NuxtLink :to="'/checkout?itemId=' + item._id" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors">
                <Briefcase class="w-5 h-5" /> Book via Escrow
              </NuxtLink>
            </template>
          </div>
          <div v-else class="mt-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <p class="font-bold text-slate-500 flex items-center justify-center gap-2">
              <ShieldCheck class="w-5 h-5 text-brand-600" />
              This is your item
            </p>
          </div>
          
          <p v-if="item.type !== 'swap' && user?._id !== (item.sellerId?._id || item.sellerId)" class="text-center mt-4 text-sm font-bold text-slate-400 flex items-center justify-center gap-1">
            <Lock class="w-3 h-3" /> Payments secured by Erranders Escrow
          </p>
          
        </div>
        
        
      </div>
      <AuthModal :isOpen="isAuthModalOpen" @close="isAuthModalOpen = false" @success="handleAuthSuccess" />
      <ProposeSwapModal 
        v-if="item" 
        :isOpen="isSwapModalOpen" 
        :targetItem="item" 
        @close="isSwapModalOpen = false"
        @success="handleSwapSuccess"
      />
    </div>
  </main>
</template>
<script setup>
import { ArrowLeft, MapPin, ShieldCheck, MessageCircle, ShoppingCart, Lock, Maximize, X, PlayCircle, Repeat, Briefcase, AlertTriangle } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itemsApi, offersApi } from '~/composables/useApi'

import AuthModal from '~/components/AuthModal.vue'
import ProposeSwapModal from '~/components/ProposeSwapModal.vue'

import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, user } = useAuth()
const isAuthModalOpen = ref(false)
const isSwapModalOpen = ref(false)
const item = ref(null)
const loading = ref(true)

useSeoMeta({
  title: computed(() => item.value ? `${item.value.title} | Erranders Barter` : 'Loading Item...'),
  description: computed(() => item.value ? item.value.description : 'View item details on Erranders Barter.'),
  ogTitle: computed(() => item.value ? item.value.title : 'Erranders Barter Item'),
  ogDescription: computed(() => item.value ? item.value.description : 'View item details on Erranders Barter.'),
  ogImage: computed(() => item.value && item.value.images?.[0] ? item.value.images[0] : ''),
})

const mediaGallery = ref([])
const activeMedia = ref(null)
const isZoomOpen = ref(false)

const hasVideo = computed(() => item.value?.videos?.length > 0)

const playFirstVideo = () => {
  const videoMedia = mediaGallery.value.find(m => m.type === 'video')
  if (videoMedia) {
    activeMedia.value = videoMedia
  }
}

const startChat = () => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return
  }
  router.push('/chat?sellerId=' + item.value?.sellerId?._id + '&itemId=' + item.value?._id)
}

const startSwapProposal = () => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return
  }
  isSwapModalOpen.value = true
}

const handleAuthSuccess = () => {
  isAuthModalOpen.value = false
  if (isLoggedIn.value) fetchMyOffers()
}

const handleSwapSuccess = () => {
  isSwapModalOpen.value = false
  router.push('/dashboard/offers')
}

const mySentOffers = ref([])
const hasPendingOffer = computed(() => {
  if (!mySentOffers.value || mySentOffers.value.length === 0) return false;
  return mySentOffers.value.some(offer => offer.targetItemId?._id === item.value?._id && offer.status === 'pending')
})

const fetchMyOffers = async () => {
  if (!isLoggedIn.value) return;
  try {
    const { data } = await offersApi.getMyOffers()
    if (data) mySentOffers.value = data
  } catch (err) {}
}

const fetchItem = async () => {
  try {
    const { data, error } = await itemsApi.getById(route.params.id)
    if (error) {
      console.error(error)
      return
    }
    
    item.value = data
    
    // Construct media gallery
    const gallery = []
    if (data.images && data.images.length > 0) {
      data.images.forEach(img => gallery.push({ type: 'image', src: img }))
    } else {
      gallery.push({ type: 'image', src: '/no-image.png' })
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
  if (isLoggedIn.value) fetchMyOffers()
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