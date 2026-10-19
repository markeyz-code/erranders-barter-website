<template>
  <div class="min-h-screen  py-16 px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
    <div class="max-w-5xl mx-auto">
      
      <div class="mb-8">
        <NuxtLink to="/explore" class="inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">
          <ArrowLeft class="w-4 h-4 mr-2" /> Back to Explore
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-20 text-slate-500 font-bold">Loading secure checkout...</div>
      <div v-else-if="!item" class="text-center py-20 text-red-500 font-bold">Item not found.</div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Left Side: Item Summary -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <h2 class="text-3xl font-black text-slate-900 tracking-tight">Order Summary</h2>
          
          <div class="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
            <div class="flex gap-4 items-start mb-6 pb-6 border-b border-slate-100">
              <div class="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                <img v-if="item.images && item.images.length > 0" :src="item.images[0]" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                  <ShoppingBag class="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-lg leading-tight mb-1">{{ item.title }}</h3>
                <p class="text-sm font-medium text-brand-600 mb-2">₦{{ item.price.toLocaleString() }}</p>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-sm font-bold text-slate-600">
                  <User class="w-3.5 h-3.5" /> Seller: {{ item.sellerId?.firstName || 'Student' }}
                </div>
              </div>
            </div>

            <div class="space-y-3 text-sm font-medium text-slate-600">
              <div class="flex justify-between">
                <span>Item Price</span>
                <span class="text-slate-900 font-bold">₦{{ item.price.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Delivery Fee ({{ deliveryMethod === 'errander' ? 'Errander' : 'Pickup' }})</span>
                <span class="text-slate-900 font-bold">{{ deliveryMethod === 'errander' ? `₦${customErranderFee.toLocaleString()}` : 'Free' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Escrow Fee <span v-if="escrowFeePercentage > 0" class="text-xs font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">({{ escrowFeePercentage }}%)</span></span>
                <span class="text-slate-900 font-bold">
                  {{ escrowFeePercentage > 0 ? '₦' + escrowFeeAmount.toLocaleString() : 'Free' }}
                </span>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
              <span class="font-bold text-slate-900 text-lg">Total</span>
              <span class="font-black text-3xl text-brand-600">₦{{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>

          <div class="bg-green-50 border border-green-200 p-5 rounded-2xl flex gap-4 items-start">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 class="font-bold text-green-900 mb-1">Secure Decluttered Escrow</h4>
              <p class="text-sm text-green-800 font-medium leading-relaxed">
                Your money is held securely in Decluttered Escrow. The seller and errander do not receive payout until you inspect, receive the item, and confirm satisfaction.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Right Side: Delivery & Payment Actions -->
        <div class="lg:col-span-7">
          <div class="bg-white p-4 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-2xl font-black text-slate-900 mb-6">Delivery Details</h2>
            
            <div class="space-y-4 mb-6">
              <label class="block text-sm font-bold text-slate-700">How do you want this?</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <!-- Self Pickup -->
                <div 
                  @click="deliveryMethod = 'pickup'"
                  class="flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all"
                  :class="deliveryMethod === 'pickup' ? 'border-brand-600 bg-brand-50 shadow-xs' : 'border-slate-200 hover:border-brand-300 bg-white'"
                >
                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                       :class="deliveryMethod === 'pickup' ? 'border-brand-600' : 'border-slate-300'">
                    <div v-if="deliveryMethod === 'pickup'" class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Self Pickup</h4>
                    <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Meet with seller on campus.</p>
                    <span class="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded uppercase">Free</span>
                  </div>
                </div>
                
                <!-- Errander Delivery -->
                <div 
                  @click="deliveryMethod = 'errander'"
                  class="flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all"
                  :class="deliveryMethod === 'errander' ? 'border-brand-600 bg-brand-50 shadow-xs' : 'border-slate-200 hover:border-brand-300 bg-white'"
                >
                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                       :class="deliveryMethod === 'errander' ? 'border-brand-600' : 'border-slate-300'">
                    <div v-if="deliveryMethod === 'errander'" class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Errander Delivery</h4>
                    <p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Door-to-door hostel dispatch.</p>
                    <span class="inline-block mt-2 px-2 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-black rounded uppercase">Agreed Before Pay</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Errander Section with Pre-Payment Negotiation -->
            <div v-if="deliveryMethod === 'errander'" class="mb-8 p-4 sm:p-6 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
              
              <!-- Address -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Delivery Address (Hostel / Hall & Room) <span class="text-brand-600">*</span></label>
                <div class="relative">
                  <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    v-model="deliveryAddress" 
                    type="text" 
                    placeholder="e.g. Moremi Hall, Room 204 or Block C Room 12" 
                    class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors font-medium text-slate-900" 
                  />
                </div>
              </div>

              <!-- Available Campus Erranders Selection -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Choose Verified Campus Errander</span>
                  <span class="text-[10px] text-brand-600 font-bold">3 active nearby</span>
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    v-for="errander in availableErranders"
                    :key="errander.id"
                    type="button"
                    @click="selectErrander(errander)"
                    class="p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between"
                    :class="selectedErrander.id === errander.id ? 'bg-white border-brand-500 ring-2 ring-brand-500/15 shadow-2xs' : 'bg-white/80 border-slate-200 hover:border-slate-300'"
                  >
                    <div class="flex items-center gap-2 mb-1.5">
                      <img :src="errander.avatar" class="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200" />
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-900 truncate">{{ errander.name }}</p>
                        <p class="text-[10px] text-slate-400 font-semibold">⭐ {{ errander.rating }} ({{ errander.trips }} trips)</p>
                      </div>
                    </div>
                    <span class="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded text-center">
                      {{ errander.distance }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Proposed Fee Input -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                  <span>Proposed Errander Fee Offer</span>
                  <span class="text-brand-600 font-black">Base: ₦{{ baseErranderFee.toLocaleString() }}</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₦</span>
                  <input 
                    v-model="formattedErranderFee" 
                    type="text" 
                    inputmode="numeric" 
                    :disabled="negotiationStatus === 'agreed'"
                    class="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-brand-500 transition-colors font-black text-slate-900 text-sm disabled:bg-slate-100 disabled:text-slate-600" 
                  />
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Offer a fair fee to guarantee immediate errander acceptance.</p>
              </div>

              <!-- Live Negotiation Status Panel -->
              <div class="p-3.5 rounded-xl border transition-all" :class="negotiationStatus === 'agreed' ? 'bg-green-50 border-green-200 text-green-900' : negotiationStatus === 'negotiating' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-slate-200 text-slate-700'">
                
                <!-- State 1: Idle (Prompt to negotiate) -->
                <div v-if="negotiationStatus === 'idle'" class="flex items-start justify-between gap-3">
                  <div class="space-y-0.5">
                    <p class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock class="w-3.5 h-3.5 text-brand-600" />
                      <span>Delivery Fee Not Yet Confirmed</span>
                    </p>
                    <p class="text-[11px] text-slate-500 leading-relaxed">
                      To prevent double charging, agree on the delivery fee with {{ selectedErrander.name }} first before paying.
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="startNegotiation"
                    :disabled="!deliveryAddress.trim()"
                    class="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shrink-0 transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Agree Fee First 🤝
                  </button>
                </div>

                <!-- State 2: Negotiating / Counter Offer -->
                <div v-else-if="negotiationStatus === 'negotiating'" class="space-y-2.5">
                  <div v-if="isNegotiatingLoading" class="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <Loader2 class="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                    <span>Connecting with {{ selectedErrander.name }} to confirm route & item size…</span>
                  </div>

                  <div v-else-if="negotiationStep === 'counter_offered'" class="space-y-2">
                    <div class="flex items-start gap-2">
                      <MessageSquare class="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p class="text-xs font-bold text-amber-900">
                          {{ selectedErrander.name }} proposed a counter-fee of <strong>₦{{ erranderCounterFee?.toLocaleString() }}</strong>
                        </p>
                        <p class="text-[11px] text-amber-700 mt-0.5">
                          "I am ready to deliver directly to your hostel room. With stairs / distance, I can do ₦{{ erranderCounterFee }}."
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        @click="acceptErranderFee(erranderCounterFee)"
                        class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black transition-colors"
                      >
                        Accept ₦{{ erranderCounterFee?.toLocaleString() }} & Lock Price
                      </button>
                      <button
                        type="button"
                        @click="acceptErranderFee(customErranderFee || 500)"
                        class="px-3 py-1.5 rounded-xl border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
                      >
                        Insist on ₦{{ Number(customErranderFee || 500).toLocaleString() }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- State 3: Agreed & Locked -->
                <div v-else-if="negotiationStatus === 'agreed'" class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4 text-green-600 shrink-0" />
                    <div>
                      <p class="text-xs font-black text-green-900">
                        Delivery Fee Locked at ₦{{ customErranderFee.toLocaleString() }}
                      </p>
                      <p class="text-[11px] text-green-700 font-medium">
                        Assigned to {{ selectedErrander.name }} • All-inclusive single payment!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="renegotiate"
                    class="text-[11px] font-bold text-green-800 hover:underline shrink-0"
                  >
                    Change / Re-negotiate
                  </button>
                </div>

              </div>

            </div>
            
            <!-- Sold Out / Reserved Alert -->
            <div v-if="item.status !== 'active'" class="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900">
              <div class="flex items-center gap-2 font-black text-sm">
                <span>⚠️</span>
                <span>{{ item.status === 'sold' ? 'This item has already been SOLD OUT!' : 'This item is currently RESERVED in an ongoing trade.' }}</span>
              </div>
              <p class="text-xs font-medium text-amber-700 mt-1">
                You cannot pay for an item that is already sold or reserved. Please browse other active campus listings.
              </p>
              <NuxtLink to="/explore" class="inline-block mt-3 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors">
                Explore Available Items →
              </NuxtLink>
            </div>

            <hr class="border-slate-100 mb-6" />
            
            <!-- Primary Action Button -->
            <button
              v-if="deliveryMethod === 'errander' && negotiationStatus !== 'agreed'"
              type="button"
              @click="startNegotiation"
              :disabled="item.status !== 'active' || !deliveryAddress.trim() || isNegotiatingLoading"
              class="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-3.5 rounded-2xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-base"
            >
              <Loader2 v-if="isNegotiatingLoading" class="w-5 h-5 animate-spin" />
              <MessageSquare v-else class="w-5 h-5" />
              <span>Agree Fee with {{ selectedErrander.name }} (₦{{ customErranderFee.toLocaleString() }} Proposed)</span>
            </button>

            <button
              v-else
              @click="handleCheckoutAction"
              :disabled="item.status !== 'active' || initiating || (deliveryMethod === 'errander' && !deliveryAddress)"
              class="w-full bg-brand-600 text-white font-black py-3.5 rounded-2xl flex justify-center items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-base"
            >
              <Loader2 v-if="initiating" class="w-5 h-5 animate-spin" />
              <Lock v-else class="w-5 h-5" />
              <span>
                {{ item.status !== 'active' ? (item.status === 'sold' ? 'Item Sold Out' : 'Item Reserved') : initiating ? 'Processing Payment...' : (isLoggedIn ? `Pay ₦${totalAmount.toLocaleString()} Securely (Locked Total)` : 'Log in to Checkout') }}
              </span>
            </button>
            <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center bg-red-50 p-3 rounded-lg">{{ error }}</p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itemsApi, escrowApi, settingsApi } from '~/composables/useApi'
import { useCustomToast } from '@/composables/core/useCustomToast'

import { 
  ArrowLeft, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Loader2,
  Clock,
  MessageSquare,
  CheckCircle2,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { user, isLoggedIn, isGlobalAuthModalOpen } = useAuth()
const item = ref(null)

useHead({
  script: [
    { src: 'https://js.paystack.co/v1/inline.js', async: true }
  ]
})

useSeoMeta({
  title: computed(() => item.value ? `Checkout: ${item.value.title} | Decluttered` : 'Checkout | Decluttered'),
  description: 'Secure checkout via Decluttered Escrow with agreed delivery fees.',
  ogTitle: 'Decluttered Secure Checkout',
})
const loading = ref(true)
const initiating = ref(false)
const error = ref('')

const deliveryMethod = ref('pickup')
const deliveryAddress = ref('')
const baseErranderFee = ref(500)
const customErranderFee = ref(500)
const escrowFeePercentage = ref(0) // dynamic from settings

// Errander Selection & Negotiation State
const negotiationStatus = ref('idle') // 'idle' | 'negotiating' | 'agreed'
const negotiationStep = ref('offer_sent') // 'offer_sent' | 'counter_offered' | 'confirmed'
const isNegotiatingLoading = ref(false)
const erranderCounterFee = ref(null)

const availableErranders = [
  {
    id: 'errander-chidi',
    name: 'Chidi Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    trips: 142,
    distance: '~8 mins away',
    hostelZone: 'Moremi & New Hall Zone',
  },
  {
    id: 'errander-tobi',
    name: 'Tobi Adebayo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 4.8,
    trips: 89,
    distance: '~12 mins away',
    hostelZone: 'Zik & Indep Hall Zone',
  },
  {
    id: 'errander-blessing',
    name: 'Blessing Eze',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    rating: 5.0,
    trips: 210,
    distance: '~5 mins away',
    hostelZone: 'Campus Wide Rapid Dispatch',
  },
]

const selectedErrander = ref(availableErranders[0])

const selectErrander = (errander) => {
  selectedErrander.value = errander
  if (negotiationStatus.value !== 'idle') {
    negotiationStatus.value = 'idle'
  }
}

const startNegotiation = () => {
  if (!deliveryAddress.value.trim()) {
    error.value = 'Please provide your hostel delivery address first.'
    return
  }
  error.value = ''
  negotiationStatus.value = 'negotiating'
  isNegotiatingLoading.value = true
  negotiationStep.value = 'offer_sent'

  // Simulate errander real-time evaluation
  setTimeout(() => {
    isNegotiatingLoading.value = false
    const proposed = Number(customErranderFee.value || 500)
    if (proposed >= 700) {
      negotiationStep.value = 'confirmed'
      negotiationStatus.value = 'agreed'
      useCustomToast().showToast({
        title: 'Offer Accepted! 🤝',
        message: `${selectedErrander.value.name} accepted your delivery fee of ₦${proposed.toLocaleString()}!`,
        toastType: 'success',
      })
    } else {
      erranderCounterFee.value = 700
      negotiationStep.value = 'counter_offered'
      useCustomToast().showToast({
        title: 'Errander Counter-Offer',
        message: `${selectedErrander.value.name} reviewed your route: "I can deliver directly to your hostel room for ₦700."`,
        toastType: 'info',
      })
    }
  }, 1000)
}

const acceptErranderFee = (feeAmount) => {
  customErranderFee.value = Number(feeAmount)
  negotiationStatus.value = 'agreed'
  negotiationStep.value = 'confirmed'
  useCustomToast().showToast({
    title: 'Delivery Fee Locked! 🔒',
    message: `Delivery fee locked at ₦${Number(feeAmount).toLocaleString()} with ${selectedErrander.value.name}. Single payment ready!`,
    toastType: 'success',
  })
}

const renegotiate = () => {
  negotiationStatus.value = 'idle'
  negotiationStep.value = 'offer_sent'
}

const formattedErranderFee = computed({
  get: () => {
    if (!customErranderFee.value) return ''
    const num = Number(String(customErranderFee.value).replace(/,/g, ''))
    return isNaN(num) ? '' : num.toLocaleString('en-US')
  },
  set: (val) => {
    const stripped = String(val).replace(/[^0-9]/g, '')
    customErranderFee.value = stripped ? Number(stripped) : ''
  }
})

const totalAmount = computed(() => {
  if (!item.value) return 0
  const deliveryFee = deliveryMethod.value === 'errander' ? customErranderFee.value : 0
  const baseTotal = item.value.price + deliveryFee
  const escrowFee = (baseTotal * escrowFeePercentage.value) / 100
  return baseTotal + escrowFee
})

const escrowFeeAmount = computed(() => {
  if (!item.value) return 0
  const deliveryFee = deliveryMethod.value === 'errander' ? customErranderFee.value : 0
  const baseTotal = item.value.price + deliveryFee
  return (baseTotal * escrowFeePercentage.value) / 100
})

const fetchItem = async () => {
  if (!route.query.itemId) {
    error.value = 'No item ID provided'
    loading.value = false
    return
  }
  
  try {
    const { data, error: apiError } = await itemsApi.getById(route.query.itemId)
    if (apiError) {
       error.value = apiError
    } else {
       item.value = data
    }
  } catch (err) {
    error.value = 'Failed to load item details.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleCheckoutAction = () => {
  if (!isLoggedIn.value) {
    isGlobalAuthModalOpen.value = true
    return
  }
  
  if (deliveryMethod.value === 'errander' && !deliveryAddress.value) {
    error.value = 'Please provide a delivery address for the Errander.'
    return
  }
  
  initiating.value = true
  error.value = ''
  
  const handler = window.PaystackPop.setup({
    key: useRuntimeConfig().public.paystackPublicKey || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 
    email: user.value?.email || 'user@example.com',
    amount: totalAmount.value * 100, // Paystack uses kobo
    currency: 'NGN',
    ref: 'ESCROW_' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      // Payment successful, now initiate escrow
      initiateEscrow(response.reference)
    },
    onClose: function(){
      // User closed the modal
      initiating.value = false
    }
  });
  
  handler.openIframe();
}

const initiateEscrow = async (paymentRef) => {
  try {
    const payload = {
        sellerId: item.value.sellerId._id || item.value.sellerId,
        itemId: item.value._id,
        amount: totalAmount.value,
        deliveryMethod: deliveryMethod.value,
        deliveryAddress: deliveryAddress.value,
        deliveryFee: deliveryMethod.value === 'errander' ? customErranderFee.value : 0,
        paymentReference: paymentRef
    }
    
    const { data, error: apiError } = await escrowApi.initiate(payload)
    
    if (apiError) {
      error.value = apiError
      initiating.value = false
    } else {
      router.push('/escrow')
    }
  } catch (err) {
    error.value = 'Failed to initiate checkout.'
    console.error(err)
    initiating.value = false
  }
}

const fetchSettings = async () => {
  try {
    const [baseErranderRes, escrowFeeRes] = await Promise.all([
      settingsApi.get('base_errander_fee'),
      settingsApi.get('escrow_fee_percentage')
    ])
    
    if (baseErranderRes.data && baseErranderRes.data.value) {
      baseErranderFee.value = Number(baseErranderRes.data.value)
      customErranderFee.value = Number(baseErranderRes.data.value)
    }
    
    if (escrowFeeRes.data && escrowFeeRes.data.value) {
      escrowFeePercentage.value = Number(escrowFeeRes.data.value)
    }
  } catch (err) {
    console.error('Failed to fetch settings', err)
  }
}

onMounted(() => {
  fetchItem()
  fetchSettings()
})
</script>