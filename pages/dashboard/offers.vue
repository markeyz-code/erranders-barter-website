<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-0.5">Trade Hub</h1>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">Manage your incoming and outgoing swap offers here.</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 mb-4 border-b border-slate-200">
        <button 
          @click="activeTab = 'received'"
          class="pb-2.5 px-1 font-bold text-sm transition-colors border-b-2"
          :class="activeTab === 'received' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Received Offers
        </button>
        <button 
          @click="activeTab = 'sent'"
          class="pb-2.5 px-1 font-bold text-sm transition-colors border-b-2"
          :class="activeTab === 'sent' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Sent Offers
        </button>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-slate-100 p-5 rounded-xl animate-pulse h-24"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 class="font-bold text-red-700 mb-1">Could not load your offers</h2>
        <p class="text-sm text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchOffers" class="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-brand-700 text-sm transition-colors">
          Try again
        </button>
      </div>

      <div v-else-if="currentOffers.length === 0" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="flex flex-col items-center justify-center p-8 sm:p-10 text-center">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Repeat class="w-8 h-8 text-slate-300" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No Offers Found</h3>
          <p class="text-slate-500 text-sm max-w-sm mb-4">
            You don't have any {{ activeTab }} offers right now. Keep exploring to find great deals!
          </p>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div v-for="offer in currentOffers" :key="offer._id" class="bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-300 transition-colors relative overflow-hidden">
          
          <!-- Confetti Effect Layer (Shown only right after accepting) -->
          <div v-if="justAcceptedId === offer._id" class="absolute inset-0 pointer-events-none z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-out fade-out duration-1000 delay-2000 fill-mode-forwards">
             <div class="text-6xl animate-bounce">🎉 🤝 🎉</div>
             <p class="absolute bottom-1/4 font-black text-2xl text-emerald-600 animate-in slide-in-from-bottom-5">DEAL SEALED!</p>
          </div>

          <div class="flex items-center justify-between mb-4 relative z-20">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider" 
                  :class="{
                    'bg-yellow-50 text-yellow-600': offer.status === 'pending', 
                    'bg-amber-50 text-amber-700 border border-amber-200': offer.status === 'accepted_by_receiver',
                    'bg-emerald-50 text-emerald-600': offer.status === 'accepted', 
                    'bg-red-50 text-red-600': offer.status === 'declined',
                    'bg-blue-50 text-blue-600': offer.status === 'countered'
                  }">
              <template v-if="offer.status === 'accepted'">🤝 DEAL AGREED</template>
              <template v-else-if="offer.status === 'accepted_by_receiver'">
                {{ activeTab === 'sent' ? '🔔 REVIEW & CONFIRM SWAP' : '⏳ AWAITING INITIATOR CONFIRMATION' }}
              </template>
              <template v-else>{{ offer.status }}</template>
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

          <!-- Receiver's Item Swap Details Display -->
          <div v-if="offer.receiverSwapDetails" class="mt-3.5 p-3 bg-slate-50 border border-slate-200/90 rounded-xl relative z-20 text-left">
            <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
              <Repeat class="w-3.5 h-3.5 text-brand-600" />
              <span>Receiver's Agreed Item Details:</span>
            </div>
            <p class="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-medium bg-white p-2.5 rounded-lg border border-slate-100">
              {{ offer.receiverSwapDetails }}
            </p>
            <p v-if="offer.receiverHandoverNotes" class="text-[11px] text-slate-500 font-semibold mt-1.5 flex items-center gap-1">
              <MapPin class="w-3 h-3 text-brand-500" /> Handover Note: {{ offer.receiverHandoverNotes }}
            </p>
          </div>

          <!-- Initiator Review & Confirmation Callout (Sent Tab) -->
          <div v-if="activeTab === 'sent' && offer.status === 'accepted_by_receiver'" class="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl relative z-20 space-y-2 text-left">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs font-black text-amber-900">
                <Sparkles class="w-4 h-4 text-amber-600" />
                <span>Receiver Accepted! Please Review Details & Confirm</span>
              </div>
            </div>
            <p class="text-[11px] text-amber-800 leading-normal">
              The receiver provided their item details above. Once you confirm, the swap is finalized and both items are reserved.
            </p>
            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                @click="openDeclineModal(offer._id)"
                class="px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                Decline
              </button>
              <button
                @click="confirmSwapAsInitiator(offer._id)"
                :disabled="confirmSubmittingId === offer._id"
                class="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Loader2 v-if="confirmSubmittingId === offer._id" class="w-3.5 h-3.5 animate-spin" />
                <Check v-else class="w-3.5 h-3.5 stroke-[3]" />
                <span>{{ confirmSubmittingId === offer._id ? 'Confirming...' : 'Confirm Swap & Finalize' }}</span>
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2 relative z-20">
            <!-- Received Tab & Pending: Accept Swap with Modal -->
            <template v-if="activeTab === 'received' && offer.status === 'pending'">
              <button @click="openDeclineModal(offer._id)" class="px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition-colors border border-red-100">
                Decline
              </button>
              <button @click="openAcceptModal(offer)" class="px-4 py-2 text-sm bg-brand-600 text-white hover:bg-brand-700 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                <Repeat class="w-4 h-4" />
                <span>Accept Swap</span>
              </button>
            </template>

            <!-- Communication Buttons -->
            <template v-if="offer.status === 'accepted' || offer.status === 'accepted_by_receiver' || offer.status === 'pending'">
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

    <!-- Decline Offer Confirmation Modal -->
    <ConfirmActionModal
      :is-open="declineModalOpen"
      title="Decline Offer"
      message="Are you sure you want to decline this swap offer? This action cannot be undone."
      confirm-text="Decline Offer"
      tone="danger"
      :submitting="declineSubmitting"
      @close="declineModalOpen = false"
      @confirm="confirmDecline"
    />

    <!-- Accept Swap Modal (Receiver inputs item details) -->
    <div v-if="isAcceptModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div class="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
              <Repeat class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900">Accept Swap Offer</h3>
              <p class="text-xs text-slate-500">Specify details of the item you want to swap</p>
            </div>
          </div>
          <button @click="closeAcceptModal" class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
          <!-- Item Offered by Initiator -->
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
            <img :src="acceptingOffer?.offeredItemId?.images?.[0] || '/no-image.png'" class="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0" />
            <div class="min-w-0 flex-1">
              <span class="text-[10px] font-black uppercase tracking-wider text-brand-600">Offered by Initiator</span>
              <h4 class="font-bold text-sm text-slate-900 truncate">{{ acceptingOffer?.offeredItemId?.title }}</h4>
              <p class="text-xs text-slate-500 font-semibold mt-0.5">
                Valuation: ₦{{ Number(acceptingOffer?.offeredItemId?.price || 0).toLocaleString() }}
                <span v-if="acceptingOffer?.cashTopUp" class="ml-2 font-black text-emerald-600">
                  ({{ acceptingOffer.cashTopUp > 0 ? '+₦' + acceptingOffer.cashTopUp.toLocaleString() + ' Cash' : '-₦' + Math.abs(acceptingOffer.cashTopUp).toLocaleString() + ' Cash' }})
                </span>
              </p>
            </div>
          </div>

          <!-- Area to input item swap details -->
          <div>
            <label class="block text-xs font-black text-slate-800 mb-1.5 uppercase tracking-wide">
              Details of the item you want to swap <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="receiverSwapDetails"
              rows="3"
              placeholder="Describe condition, exact model, accessories included (e.g. In working condition with original power cord and remote. Minor scratches on side)..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 resize-none transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-black text-slate-800 mb-1.5 uppercase tracking-wide">
              Handover / Pickup Note (Optional)
            </label>
            <input
              v-model="receiverHandoverNotes"
              type="text"
              placeholder="e.g. Available for inspection and swap at Block 3 common room every evening"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
            />
          </div>

          <!-- Notice -->
          <div class="bg-blue-50 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-800">
            <Sparkles class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p class="text-[11px] leading-relaxed">
              Once submitted, the initiator will receive an instant notification to review your item details and give final confirmation before the swap occurs.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="closeAcceptModal"
            class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="submitAcceptSwap"
            :disabled="!receiverSwapDetails.trim() || acceptSubmitting"
            class="px-5 py-2.5 text-xs font-black bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Loader2 v-if="acceptSubmitting" class="w-4 h-4 animate-spin" />
            <span>{{ acceptSubmitting ? 'Submitting...' : 'Accept Swap & Send for Review' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { Repeat, MessageCircle, Phone, Video, X, MapPin, PlayCircle, Sparkles, Check, Loader2 } from 'lucide-vue-next'
import { ref, onMounted, computed, watch } from 'vue'
import { offersApi } from '~/composables/useApi'
import { useRouter, useRoute } from 'vue-router'
import ConfirmActionModal from '~/components/ConfirmActionModal.vue'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const route = useRoute()
const activeTab = ref(route.query.tab === 'sent' ? 'sent' : 'received')
const loading = ref(true)

const receivedOffers = ref([])
const sentOffers = ref([])
const error = ref('')

const justAcceptedId = ref(null)

// Accept Swap Modal State (Receiver item input)
const isAcceptModalOpen = ref(false)
const acceptingOffer = ref(null)
const receiverSwapDetails = ref('')
const receiverHandoverNotes = ref('')
const acceptSubmitting = ref(false)
const confirmSubmittingId = ref(null)

// Custom Decline Modal State
const declineModalOpen = ref(false)
const offerToDecline = ref(null)
const declineSubmitting = ref(false)

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
  error.value = ''
  try {
    const [recvRes, sentRes] = await Promise.all([
      offersApi.getReceivedOffers(),
      offersApi.getMyOffers()
    ])
    receivedOffers.value = Array.isArray(recvRes.data) ? recvRes.data : []
    sentOffers.value = Array.isArray(sentRes.data) ? sentRes.data : []
  } catch (e) {
    error.value = e?.response?.data?.message || 'The offers API did not respond.'
    receivedOffers.value = []
    sentOffers.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOffers()
})

const openDeclineModal = (offerId) => {
  offerToDecline.value = offerId
  declineModalOpen.value = true
}

const confirmDecline = async () => {
  if (!offerToDecline.value) return
  declineSubmitting.value = true
  try {
    await offersApi.updateStatus(offerToDecline.value, 'declined')
    declineModalOpen.value = false
    offerToDecline.value = null
    fetchOffers()
  } catch(e) {
    useCustomToast().showToast({ title: 'Notice', message: 'Failed to decline offer', toastType: "error" })
  } finally {
    declineSubmitting.value = false
  }
}

const openAcceptModal = (offer) => {
  acceptingOffer.value = offer
  receiverSwapDetails.value = ''
  receiverHandoverNotes.value = ''
  isAcceptModalOpen.value = true
}

const closeAcceptModal = () => {
  isAcceptModalOpen.value = false
  acceptingOffer.value = null
}

const submitAcceptSwap = async () => {
  if (!acceptingOffer.value || !receiverSwapDetails.value.trim()) return
  acceptSubmitting.value = true
  try {
    await offersApi.updateStatus(acceptingOffer.value._id, {
      status: 'accepted_by_receiver',
      receiverSwapDetails: receiverSwapDetails.value.trim(),
      receiverHandoverNotes: receiverHandoverNotes.value.trim(),
    })
    useCustomToast().showToast({
      title: 'Swap Accepted! 🤝',
      message: 'Item details submitted. The initiator has received a notification to review and confirm.',
      toastType: 'success',
    })
    closeAcceptModal()
    await fetchOffers()
  } catch (err) {
    useCustomToast().showToast({
      title: 'Action Failed',
      message: err?.response?.data?.message || 'Could not submit swap acceptance.',
      toastType: 'error',
    })
  } finally {
    acceptSubmitting.value = false
  }
}

const confirmSwapAsInitiator = async (offerId) => {
  confirmSubmittingId.value = offerId
  try {
    await offersApi.updateStatus(offerId, 'accepted')
    justAcceptedId.value = offerId
    useCustomToast().showToast({
      title: 'Swap Finalized! 🎉🤝',
      message: 'Deal confirmed! Both items are reserved. You can now chat or call to exchange.',
      toastType: 'success',
    })
    await fetchOffers()
    setTimeout(() => {
      justAcceptedId.value = null
    }, 3000)
  } catch (err) {
    useCustomToast().showToast({
      title: 'Confirmation Failed',
      message: err?.response?.data?.message || 'Could not confirm swap.',
      toastType: 'error',
    })
  } finally {
    confirmSubmittingId.value = null
  }
}

const updateStatus = async (offerId, status) => {
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
  const partnerId =
    activeTab.value === 'received'
      ? offer.proposerId?._id || offer.proposerId
      : offer.receiverId?._id || offer.receiverId

  if (!partnerId) {
    useCustomToast().showToast({ title: 'Notice', message: 'This offer has no counterpart to message.', toastType: 'error' })
    return
  }

  const query = new URLSearchParams()
  query.append('sellerId', partnerId)
  if (type !== 'chat') {
    query.append('call', type)
  }
  
  router.push(`/chat?${query.toString()}`)
}
</script>
