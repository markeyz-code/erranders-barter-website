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

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <NuxtLink to="/explore" class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 font-bold mb-4 transition-colors">
        <ArrowLeft class="w-3.5 h-3.5" /> Back to Explore
      </NuxtLink>

      <div v-if="loading" class="text-center py-16 text-slate-500 font-bold">Loading item...</div>
      <div v-else-if="!item" class="text-center py-16 text-red-500 font-bold">Item not found.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        <!-- Media Gallery -->
        <div class="w-full flex flex-col gap-3">
          <!-- Main Display -->
          <div 
            class="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group cursor-pointer"
            @click="activeMedia?.type === 'image' ? isZoomOpen = true : null"
          >
            <!-- Image View -->
            <img v-if="activeMedia?.type === 'image'" :src="activeMedia.src" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            <!-- Video View -->
            <video v-if="activeMedia?.type === 'video'" :src="activeMedia.src" controls autoplay muted loop class="w-full h-full object-cover"></video>

            <!-- Overlays -->
            <div class="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              <span class="bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-xs uppercase font-black border border-slate-200">
                {{ item.type === 'sell' ? 'For Sale' : item.type === 'swap' ? 'For Swap' : 'Service' }}
              </span>
              <span v-if="item.status === 'sold'" class="bg-red-600 text-white px-2.5 py-1 rounded-md text-xs uppercase font-black shadow-sm">
                Sold Out ❌
              </span>
              <span v-else-if="item.status === 'pending'" class="bg-amber-500 text-white px-2.5 py-1 rounded-md text-xs uppercase font-black shadow-sm">
                In Escrow 🔒
              </span>
            </div>
            <div v-if="activeMedia?.type === 'image'" class="absolute bottom-3 right-3 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md text-white text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Maximize class="w-3.5 h-3.5" /> 4D Zoom
            </div>
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              v-for="(media, idx) in mediaGallery" 
              :key="idx" 
              @click="activeMedia = media"
              class="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border transition-all"
              :class="activeMedia?.src === media.src ? 'border-brand-600' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img v-if="media.type === 'image'" :src="media.src" class="w-full h-full object-cover" />
              <div v-if="media.type === 'video'" class="w-full h-full bg-slate-800 relative flex items-center justify-center">
                <PlayCircle class="w-5 h-5 text-white" />
              </div>
            </button>
          </div>
          
          <!-- Play Video Button -->
          <button v-if="hasVideo" @click="playFirstVideo" class="mt-1 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
            <PlayCircle class="w-4 h-4 text-brand-400" /> Play Product Video
          </button>
        </div>
        
        <!-- Content Side -->
        <div class="flex flex-col justify-center">
          
          <div class="mb-5">
            <div class="flex items-center gap-2 mb-1.5">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                :class="item.status === 'sold' ? 'bg-red-100 text-red-700 border border-red-200' : item.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'"
              >
                {{ item.status === 'sold' ? '● Sold Out' : item.status === 'pending' ? '● Reserved in Escrow' : '● Available' }}
              </span>
              <span v-if="item.batchId" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                📦 Declutter Batch
              </span>
            </div>
            <h1 class="text-xl md:text-2xl font-extrabold text-slate-900 mb-2 leading-tight">{{ item.title }}</h1>
            <div class="flex items-center gap-3">
              <span v-if="item.type !== 'swap'" class="text-2xl md:text-3xl font-black text-brand-600">₦{{ Number(item.price || 0).toLocaleString() }}</span>
              <span v-if="item.type === 'swap' && item.swapPreference" class="px-2.5 py-0.5 bg-green-100 text-green-700 font-bold rounded-md text-xs">Swap: {{ item.swapPreference }}</span>
            </div>
          </div>
          
          <div class="space-y-4 mb-6">
            <div class="flex items-center gap-2.5 text-slate-600 font-medium text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
              <MapPin class="w-4 h-4 text-brand-500 flex-shrink-0" />
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
            <NuxtLink :to="'/profile/' + (item.sellerId._id || item.sellerId)" class="flex items-center gap-4 group hover:opacity-90 transition-opacity">
              <div class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center font-black text-brand-700 text-xl border border-brand-200 relative overflow-hidden group-hover:border-brand-500 transition-colors">
                <span class="absolute">{{ item.sellerId.firstName?.[0] }}{{ item.sellerId.lastName?.[0] }}</span>
                <img v-if="item.sellerId.avatar" :src="item.sellerId.avatar" class="w-full h-full object-cover absolute inset-0 z-10" @error="$event.target.style.display='none'" />
              </div>
              <div>
                <p class="font-black text-slate-900 text-lg group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                  <span>{{ item.sellerId.firstName }} {{ item.sellerId.lastName?.[0] }}.</span>
                  <span class="text-xs text-brand-500 font-bold">view profile →</span>
                </p>
                <p class="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck v-if="item.sellerId.isVerified" class="w-4 h-4 text-green-500" /> {{ item.sellerId.isVerified ? 'Verified Student' : 'Student' }}
                </p>
              </div>
            </NuxtLink>
            <div class="text-right" v-if="item.sellerId.hostel">
              <p class="text-sm font-bold text-slate-400 uppercase ">Hostel</p>
              <p class="font-bold text-slate-900">{{ item.sellerId.hostel }}</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 mt-auto" v-if="user?._id !== (item.sellerId?._id || item.sellerId)">
            <!-- Sold Out Notice -->
            <div v-if="item.status === 'sold'" class="w-full bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-center">
              <p class="font-black text-sm flex items-center justify-center gap-1.5 mb-1">
                <X class="w-4 h-4 text-red-600 stroke-[3]" /> This item has already been SOLD OUT
              </p>
              <p class="text-xs text-red-600 font-medium mb-3">Another student has completed payment for this item.</p>
              <button @click="startChat" class="px-4 py-2 bg-white border border-red-200 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100/50 transition-colors inline-flex items-center gap-1.5">
                <MessageCircle class="w-3.5 h-3.5" /> Message Seller for Similar Items
              </button>
            </div>

            <!-- In Escrow Notice -->
            <div v-else-if="item.status === 'pending'" class="w-full bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-center">
              <p class="font-black text-sm flex items-center justify-center gap-1.5 mb-1">
                <Lock class="w-4 h-4 text-amber-600 stroke-[2.5]" /> Reserved in Escrow
              </p>
              <p class="text-xs text-amber-700 font-medium mb-3">A trade is currently underway. If the trade is not completed, this item will reopen.</p>
              <button @click="startChat" class="px-4 py-2 bg-white border border-amber-200 text-amber-800 font-bold text-xs rounded-xl hover:bg-amber-100/50 transition-colors inline-flex items-center gap-1.5">
                <MessageCircle class="w-3.5 h-3.5" /> Chat Seller
              </button>
            </div>

            <!-- Available: Sell Type (Buy Flow) -->
            <template v-else-if="item.type === 'sell'">
              <button @click="startChat" class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <MessageCircle class="w-5 h-5" /> Chat Seller
              </button>
              <NuxtLink :to="'/checkout?itemId=' + item._id" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors">
                <ShoppingCart class="w-5 h-5" /> Buy via Escrow
              </NuxtLink>
            </template>

            <!-- Available: Swap Type -->
            <template v-else-if="item.type === 'swap'">
              <div v-if="hasPendingOffer" class="flex-1 bg-amber-50 border border-amber-200 text-amber-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-center px-4">
                <AlertTriangle class="w-5 h-5 flex-shrink-0" /> You have already sent an offer for this item
              </div>
              <button v-else @click="startSwapProposal" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors">
                <Repeat class="w-5 h-5" /> Propose Swap
              </button>
            </template>

            <!-- Available: Service Type -->
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
              This is your listing
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
  title: computed(() => item.value ? `${item.value.title} | Decluttered by Erranders` : 'Loading Item...'),
  description: computed(() => item.value ? item.value.description : 'View item details on Decluttered by Erranders.'),
  ogTitle: computed(() => item.value ? item.value.title : 'Decluttered by Erranders Item'),
  ogDescription: computed(() => item.value ? item.value.description : 'View item details on Decluttered by Erranders.'),
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