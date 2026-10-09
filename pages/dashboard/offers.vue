<template>
  <div class="p-4 md:p-4 sm:p-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 mb-1">Trade Hub</h1>
          <p class="text-sm text-slate-500 font-medium">Manage your incoming and outgoing swap offers here.</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-slate-200">
        <button 
          @click="activeTab = 'received'"
          class="pb-3 px-2 font-bold text-sm transition-colors border-b-2"
          :class="activeTab === 'received' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Received Offers
        </button>
        <button 
          @click="activeTab = 'sent'"
          class="pb-3 px-2 font-bold text-sm transition-colors border-b-2"
          :class="activeTab === 'sent' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Sent Offers
        </button>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-slate-100 p-6 rounded-3xl animate-pulse h-32"></div>
      </div>

      <div v-else-if="currentOffers.length === 0" class="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div class="flex flex-col items-center justify-center p-12 text-center">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Repeat class="w-10 h-10 text-slate-300" />
          </div>
          <h3 class="text-xl font-black text-slate-900 mb-2">No Offers Found</h3>
          <p class="text-slate-500 font-medium max-w-md mb-8">
            You don't have any {{ activeTab }} offers right now. Keep exploring to find great deals!
          </p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div v-for="offer in currentOffers" :key="offer._id" class="bg-white rounded-3xl border border-slate-200 p-6 hover:border-brand-300 transition-colors relative overflow-hidden">
          
          <!-- Confetti Effect Layer (Shown only right after accepting) -->
          <div v-if="justAcceptedId === offer._id" class="absolute inset-0 pointer-events-none z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-out fade-out duration-1000 delay-2000 fill-mode-forwards">
             <div class="text-6xl animate-bounce">🎉 🤝 🎉</div>
             <p class="absolute bottom-1/4 font-black text-2xl text-emerald-600 animate-in slide-in-from-bottom-5">DEAL SEALED!</p>
          </div>

          <div class="flex items-center justify-between mb-4 relative z-20">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider" 
                  :class="{
                    'bg-yellow-50 text-yellow-600': offer.status === 'pending', 
                    'bg-emerald-50 text-emerald-600': offer.status === 'accepted', 
                    'bg-red-50 text-red-600': offer.status === 'declined',
                    'bg-blue-50 text-blue-600': offer.status === 'countered'
                  }">
              {{ offer.status === 'accepted' ? '🤝 DEAL AGREED' : offer.status }}
            </span>
            <span class="text-xs font-bold text-slate-400">{{ new Date(offer.createdAt).toLocaleDateString() }}</span>
          </div>

          <div class="flex flex-col md:flex-row items-center gap-4 relative z-20">
            <!-- Target Item -->
            <button @click="openDrawer(offer.targetItemId, offer, activeTab === 'received')" class="text-left flex-1 w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-3 flex items-center gap-3 border" :class="offer.status === 'accepted' ? 'border-emerald-200' : 'border-slate-100'">
              <img :src="offer.targetItemId?.images?.[0] || '/no-image.png'" class="w-12 h-12 object-cover rounded-lg" />
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ activeTab === 'received' ? 'Your Item' : 'Their Item' }}</p>
                <h4 class="font-bold text-sm text-slate-900 truncate max-w-[150px] sm:max-w-[180px] leading-tight mt-0.5">{{ offer.targetItemId?.title }}</h4>
                <p class="text-[10px] text-brand-600 font-bold mt-1">View Details</p>
              </div>
            </button>

            <!-- Swap Icon & Cash -->
            <div class="flex flex-col items-center justify-center flex-shrink-0 px-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors" :class="offer.status === 'accepted' ? 'bg-emerald-100' : 'bg-brand-50'">
                <Repeat class="w-4 h-4" :class="offer.status === 'accepted' ? 'text-emerald-600 animate-spin-slow' : 'text-brand-600'" />
              </div>
              <div v-if="offer.cashTopUp !== 0" class="text-center">
                <span class="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 block whitespace-nowrap">
                  + ₦{{ Math.abs(offer.cashTopUp).toLocaleString() }} 
                </span>
              </div>
            </div>

            <!-- Offered Item -->
            <button @click="openDrawer(offer.offeredItemId, offer, activeTab === 'sent')" class="text-left flex-1 w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-3 flex items-center gap-3 border" :class="offer.status === 'accepted' ? 'border-emerald-200' : 'border-slate-100'">
              <img :src="offer.offeredItemId?.images?.[0] || '/no-image.png'" class="w-12 h-12 object-cover rounded-lg" />
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ activeTab === 'received' ? 'They Offered' : 'You Offered' }}</p>
                <h4 class="font-bold text-sm text-slate-900 truncate max-w-[150px] sm:max-w-[180px] leading-tight mt-0.5">{{ offer.offeredItemId?.title }}</h4>
                <p class="text-[10px] text-brand-600 font-bold mt-1">View Details</p>
              </div>
            </button>
          </div>

          <!-- Actions -->
          <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2 relative z-20">
            <template v-if="activeTab === 'received' && offer.status === 'pending'">
              <button @click="updateStatus(offer._id, 'declined')" class="px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition-colors border border-red-100">
                Decline
              </button>
              <button @click="updateStatus(offer._id, 'accepted')" class="px-4 py-2 text-sm bg-brand-600 text-white hover:bg-brand-700 font-bold rounded-lg transition-colors">
                Accept Deal
              </button>
            </template>
            <template v-else-if="offer.status === 'accepted' || offer.status === 'pending'">
              <button @click="startChat(offer, 'chat')" class="px-3 py-1.5 text-xs bg-brand-50 text-brand-600 hover:bg-brand-100 font-bold rounded-lg transition-colors flex items-center gap-1.5">
                <MessageCircle class="w-3.5 h-3.5" /> Chat
              </button>
              <button @click="startChat(offer, 'voice')" class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-lg transition-colors flex items-center gap-1.5">
                <Phone class="w-3.5 h-3.5" /> Call
              </button>
              <button @click="startChat(offer, 'video')" class="px-3 py-1.5 text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 font-bold rounded-lg transition-colors flex items-center gap-1.5">
                <Video class="w-3.5 h-3.5" /> Video Call
              </button>
            </template>
          </div>

        </div>
      </div>
    </div>

    <!-- Item Details Side Drawer -->
    <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] overflow-hidden flex justify-end">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeDrawer"></div>
      
      <!-- Drawer Panel -->
      <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <!-- Drawer Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <h2 class="text-base font-bold text-slate-900">Item Details</h2>
          <button @click="closeDrawer" class="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Drawer Content -->
        <div class="flex-1 overflow-y-auto p-6" v-if="selectedItem">
          <!-- Main Media -->
          <div class="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3 relative group">
             <img v-if="activeDrawerMedia?.type === 'image'" :src="activeDrawerMedia.src" class="w-full h-full object-cover" />
             <video v-else-if="activeDrawerMedia?.type === 'video'" :src="activeDrawerMedia.src" controls autoplay muted loop class="w-full h-full object-cover"></video>
             
             <div class="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded text-[10px] font-black uppercase text-slate-700 border border-slate-200 z-10">
               {{ selectedItem.type }}
             </div>
          </div>
          
          <!-- Thumbnails -->
          <div v-if="drawerMediaGallery.length > 1" class="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            <button 
              v-for="(media, idx) in drawerMediaGallery" 
              :key="idx" 
              @click="activeDrawerMedia = media" 
              class="w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all" 
              :class="activeDrawerMedia?.src === media.src ? 'border-brand-500' : 'border-transparent opacity-70 hover:opacity-100'"
            >
              <img v-if="media.type === 'image'" :src="media.src" class="w-full h-full object-cover" />
              <div v-if="media.type === 'video'" class="w-full h-full bg-slate-800 flex items-center justify-center">
                <PlayCircle class="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
          <div v-else class="mb-6"></div>
          
          <h3 class="text-xl font-black text-slate-900 mb-2 leading-tight">{{ selectedItem.title }}</h3>
          
          <div class="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <span v-if="selectedItem.price" class="text-lg font-black text-brand-600">₦{{ selectedItem.price.toLocaleString() }}</span>
            <span v-if="selectedItem.swapPreference" class="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Swap: {{ selectedItem.swapPreference }}</span>
          </div>
          
          <div class="mb-6">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
            <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{{ selectedItem.description || 'No description provided.' }}</p>
          </div>
          
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</h4>
            <div class="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <MapPin class="w-4 h-4 text-brand-500" /> {{ selectedItem.location || 'Not specified' }}
            </div>
          </div>
        </div>

        <!-- Sticky Footer for Actions -->
        <div class="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-2 flex-shrink-0" v-if="selectedOffer && selectedItem">
           <NuxtLink :to="'/item/' + selectedItem._id" class="col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-center text-sm transition-colors" :class="!isDrawerOwnItem ? 'mb-2' : ''">
             View Full Details Page
           </NuxtLink>
           <template v-if="!isDrawerOwnItem">
             <button @click="startChat(selectedOffer, 'chat'); closeDrawer()" class="col-span-2 px-4 py-3 bg-brand-50 text-brand-600 hover:bg-brand-100 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mb-2">
               <MessageCircle class="w-5 h-5" /> Chat with Peer
             </button>
             <button @click="startChat(selectedOffer, 'voice'); closeDrawer()" class="px-2 py-3 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5">
               <Phone class="w-4 h-4" /> Call
             </button>
             <button @click="startChat(selectedOffer, 'video'); closeDrawer()" class="px-2 py-3 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5">
               <Video class="w-4 h-4" /> Video Call
             </button>
           </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { Repeat, MessageCircle, Phone, Video, X, MapPin, PlayCircle } from 'lucide-vue-next'
import { ref, onMounted, computed, watch } from 'vue'
import { offersApi } from '~/composables/useApi'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const activeTab = ref('received')
const loading = ref(true)

const receivedOffers = ref([])
const sentOffers = ref([])

const justAcceptedId = ref(null)

// Drawer state
const isDrawerOpen = ref(false)
const selectedItem = ref(null)
const selectedOffer = ref(null)
const isDrawerOwnItem = ref(false)
const activeDrawerMedia = ref(null)
const drawerMediaGallery = ref([])

const openDrawer = (item, offer, isOwn) => {
  selectedItem.value = item
  selectedOffer.value = offer
  isDrawerOwnItem.value = isOwn
  
  // Construct media gallery
  const gallery = []
  if (item.images && item.images.length > 0) {
    item.images.forEach(img => gallery.push({ type: 'image', src: img }))
  } else {
    gallery.push({ type: 'image', src: '/no-image.png' })
  }
  if (item.videos && item.videos.length > 0) {
    item.videos.forEach(vid => gallery.push({ type: 'video', src: vid }))
  }
  
  drawerMediaGallery.value = gallery
  activeDrawerMedia.value = gallery[0]
  
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  setTimeout(() => { 
    selectedItem.value = null 
    selectedOffer.value = null
  }, 300) // Clear after animation
}

const currentOffers = computed(() => {
  return activeTab.value === 'received' ? receivedOffers.value : sentOffers.value
})

const fetchOffers = async () => {
  loading.value = true
  try {
    const [recvRes, sentRes] = await Promise.all([
      offersApi.getReceivedOffers(),
      offersApi.getMyOffers()
    ])
    receivedOffers.value = recvRes.data || []
    sentOffers.value = sentRes.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOffers()
})

const updateStatus = async (offerId, status) => {
  if (status === 'declined' && !confirm('Are you sure you want to decline this offer?')) return
  
  try {
    await offersApi.updateStatus(offerId, status)
    
    if (status === 'accepted') {
      justAcceptedId.value = offerId
      // Refresh silently without showing loading
      const recvRes = await offersApi.getReceivedOffers()
      receivedOffers.value = recvRes.data || []
      
      setTimeout(() => {
        justAcceptedId.value = null
      }, 3000)
    } else {
      fetchOffers()
    }
  } catch(e) {
    useCustomToast().showToast({ title: 'Notice', message: 'Failed to update status', toastType: "error" })
  }
}

const startChat = (offer, type = 'chat') => {
  // If it's a received offer, the person who proposed is the proposerId
  // If it's a sent offer, the person who owns the target is receiverId
  const partnerId = activeTab.value === 'received' ? offer.proposerId._id : offer.receiverId._id
  
  const query = new URLSearchParams()
  query.append('sellerId', partnerId)
  if (type !== 'chat') {
    query.append('call', type)
  }
  
  router.push(`/chat?${query.toString()}`)
}
</script>
