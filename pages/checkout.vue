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
                <span>Delivery Fee ({{ deliveryMethod === 'errander' ? (erranderLockStatus === 'locked' ? `Errander: ${lockedRider?.name}` : 'Errander Delivery') : 'Pickup' }})</span>
                <span class="text-slate-900 font-bold">
                  {{ deliveryMethod === 'errander' ? (erranderLockStatus === 'locked' ? `₦${customErranderFee.toLocaleString()} (Locked)` : `Est. ₦${customErranderFee.toLocaleString()}`) : 'Free' }}
                </span>
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
              <h4 class="font-bold text-green-900 mb-1">Secure Escrow Payment</h4>
              <p class="text-sm text-green-800 font-medium leading-relaxed">
                Your money is held securely in Decluttered Escrow. The seller and errander do not get paid until you receive the item, inspect it, and confirm you are satisfied.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Right Side: Delivery & Payment Actions -->
        <div class="lg:col-span-7">
          <div class="bg-white p-4 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-2xl font-black text-slate-900 mb-6">Delivery Details</h2>
            
            <div class="space-y-4 mb-8">
              <label class="block text-sm font-bold text-slate-700 ">How do you want this?</label>
              <div class="flex flex-col gap-4">
                
                <!-- Self Pickup -->
                <div 
                  @click="deliveryMethod = 'pickup'"
                  class="flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-colors"
                  :class="deliveryMethod === 'pickup' ? 'border-brand-600 bg-brand-50' : 'border-slate-100 hover:border-brand-300'"
                >
                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                       :class="deliveryMethod === 'pickup' ? 'border-brand-600' : 'border-slate-300'">
                    <div v-if="deliveryMethod === 'pickup'" class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900">Self Pickup</h4>
                    <p class="text-sm text-slate-500 mt-1 font-medium leading-relaxed">Meet with the seller on campus to inspect and collect.</p>
                    <span class="inline-block mt-3 px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded uppercase ">Free</span>
                  </div>
                </div>
                
                <!-- Errander Delivery -->
                <div 
                  @click="deliveryMethod = 'errander'"
                  class="flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-colors"
                  :class="deliveryMethod === 'errander' ? 'border-brand-600 bg-brand-50' : 'border-slate-100 hover:border-brand-300'"
                >
                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                       :class="deliveryMethod === 'errander' ? 'border-brand-600' : 'border-slate-300'">
                    <div v-if="deliveryMethod === 'errander'" class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900">Errander Delivery</h4>
                    <p class="text-sm text-slate-500 mt-1 font-medium leading-relaxed">Get it delivered directly to your hostel by an Errander.</p>
                    <span class="inline-block mt-3 px-2 py-1 bg-brand-100 text-brand-700 text-[10px] font-bold rounded uppercase ">Negotiable</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="deliveryMethod === 'errander'" class="mb-8 p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
              <!-- Hostel Address -->
              <div>
                <label class="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Delivery Address (Hostel & Room)</label>
                <div class="relative">
                  <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    v-model="deliveryAddress"
                    type="text"
                    placeholder="e.g. Moremi Hall, Room 204 or Zik Hall Block C"
                    class="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-500 transition-colors font-bold text-slate-900 text-sm"
                  />
                </div>
              </div>

              <!-- Negotiation & Fee Lock Stage -->
              <div class="p-4 rounded-2xl border transition-all" :class="erranderLockStatus === 'locked' ? 'bg-emerald-50/80 border-emerald-300' : 'bg-white border-slate-200'">
                <!-- Locked State -->
                <div v-if="erranderLockStatus === 'locked'" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
                        ✓
                      </div>
                      <div>
                        <h4 class="font-black text-emerald-950 text-sm">Errander Delivery Fee Locked!</h4>
                        <p class="text-xs text-emerald-700 font-medium">
                          Agreed with <strong class="font-bold text-emerald-900">{{ lockedRider?.name }}</strong> ({{ lockedRider?.rating }}⭐ • {{ lockedRider?.deliveries }} campus runs)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="resetErranderLock"
                      class="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      Renegotiate
                    </button>
                  </div>

                  <div class="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-bold">
                    <span class="text-slate-600">Locked Delivery Fee:</span>
                    <span class="text-emerald-700 font-black text-base">₦{{ Number(customErranderFee).toLocaleString() }} (Guaranteed)</span>
                  </div>

                  <p class="text-[11px] text-emerald-800 font-medium leading-relaxed">
                    🛡️ This fee is fixed into your single total below. You will <strong>never be asked to pay twice</strong>. Both item and delivery funds are safely held in Escrow until delivery is completed.
                  </p>
                </div>

                <!-- Unmatched / Broadcasting / Counter State -->
                <div v-else class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        <Sparkles class="w-4 h-4 text-brand-600" />
                        <span>Step 2: Match & Agree Delivery Fee Before Paying</span>
                      </h4>
                      <p class="text-xs text-slate-500 mt-0.5">
                        Avoid paying twice. Agree on the errand fee with a verified student errander first.
                      </p>
                    </div>
                  </div>

                  <!-- Offer Input -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                      <span>Your Proposed Errand Fee</span>
                      <span class="text-brand-600 font-black text-xs">Base: ₦{{ baseErranderFee.toLocaleString() }}</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">₦</span>
                      <input
                        v-model="formattedErranderFee"
                        type="text"
                        inputmode="numeric"
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-brand-500 transition-colors font-black text-slate-900 text-base"
                      />
                    </div>
                  </div>

                  <!-- Broadcasting Animation -->
                  <div v-if="erranderLockStatus === 'broadcasting'" class="p-3.5 rounded-xl bg-brand-50 border border-brand-200 flex items-center gap-3 text-xs text-brand-900 font-bold animate-pulse">
                    <Loader2 class="w-4 h-4 animate-spin text-brand-600 shrink-0" />
                    <span>Broadcasting your ₦{{ Number(customErranderFee).toLocaleString() }} offer to active student Erranders nearby…</span>
                  </div>

                  <!-- Counter Offer State -->
                  <div v-else-if="erranderLockStatus === 'counter_offered'" class="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-2.5">
                    <div class="text-xs font-bold text-amber-900">
                      {{ negotiationMessage }}
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="acceptCounterOffer(650)"
                        class="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 transition-colors"
                      >
                        Accept ₦650 & Lock In ✓
                      </button>
                      <button
                        type="button"
                        @click="acceptCounterOffer(600)"
                        class="py-2 px-3 rounded-lg bg-amber-200 text-amber-900 font-bold text-xs hover:bg-amber-300 transition-colors"
                      >
                        Counter ₦600
                      </button>
                    </div>
                  </div>

                  <!-- Available Erranders Nearby -->
                  <div v-else class="space-y-2">
                    <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Active Student Erranders Nearby
                    </label>

                    <div class="space-y-1.5">
                      <div
                        v-for="rider in nearbyErranders"
                        :key="rider.id"
                        class="p-2.5 rounded-xl border border-slate-200 hover:border-brand-400 bg-white flex items-center justify-between gap-2 transition-all"
                      >
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-1.5">
                            <span class="font-bold text-xs text-slate-900">{{ rider.name }}</span>
                            <span class="text-[11px] font-bold text-amber-600">★ {{ rider.rating }}</span>
                            <span class="text-[10px] text-slate-400 font-medium">({{ rider.deliveries }} runs)</span>
                          </div>
                          <p class="text-[11px] text-slate-500 truncate">{{ rider.location }} • {{ rider.vehicle }}</p>
                        </div>

                        <button
                          type="button"
                          @click="selectRiderInstantMatch(rider)"
                          class="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-black text-xs border border-brand-200/80 transition-all shrink-0"
                        >
                          Lock ₦{{ rider.preferredFee.toLocaleString() }}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      @click="broadcastOffer"
                      class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Broadcast My ₦{{ formattedErranderFee }} Offer to All Riders 📡</span>
                    </button>
                  </div>
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

            <hr class="border-slate-100 mb-8" />
            
            <button
              @click="handleCheckoutAction"
              :disabled="item.status !== 'active' || initiating || (deliveryMethod === 'errander' && (!deliveryAddress || erranderLockStatus !== 'locked'))"
              class="w-full bg-brand-600 text-white font-black py-3.5 rounded-xl flex justify-center items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-base sm:text-lg cursor-pointer"
            >
              <Loader2 v-if="initiating" class="w-5 h-5 animate-spin" />
              <Lock v-else class="w-5 h-5" />
              <span>
                {{
                  item.status !== 'active'
                    ? (item.status === 'sold' ? 'Item Sold Out' : 'Item Reserved')
                    : initiating
                    ? 'Processing…'
                    : !isLoggedIn
                    ? 'Log in to Checkout'
                    : deliveryMethod === 'errander' && erranderLockStatus !== 'locked'
                    ? 'Lock In Errander Fee Above First 🛵'
                    : `Pay ₦${totalAmount.toLocaleString()} Securely (Single Escrow Payment)`
                }}
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

import { ArrowLeft, ShoppingBag, User, ShieldCheck, MapPin, Lock, Loader2, Sparkles } from 'lucide-vue-next'

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
  description: 'Secure checkout via Decluttered Escrow.',
})
const loading = ref(true)
const initiating = ref(false)
const error = ref('')

const deliveryMethod = ref('pickup')
const deliveryAddress = ref('')
const baseErranderFee = ref(500)
const customErranderFee = ref(500)
const escrowFeePercentage = ref(0) // dynamic from settings

// Errander Negotiation & Fee Lock State
const erranderLockStatus = ref('unmatched') // 'unmatched' | 'broadcasting' | 'counter_offered' | 'locked'
const lockedRider = ref(null)
const negotiationMessage = ref('')

const nearbyErranders = ref([
  {
    id: 'rider-1',
    name: 'Chinedu M.',
    rating: 4.9,
    deliveries: 112,
    location: 'Near Campus Gate & Moremi',
    vehicle: 'Campus Bicycle',
    phone: '08123456780',
    preferredFee: 500,
  },
  {
    id: 'rider-2',
    name: 'Tomiwa A.',
    rating: 5.0,
    deliveries: 84,
    location: 'Near Student Union & Zik Hall',
    vehicle: 'Hostel Runner',
    phone: '08123456781',
    preferredFee: 650,
  },
  {
    id: 'rider-3',
    name: 'Emmanuel K.',
    rating: 4.8,
    deliveries: 62,
    location: 'Near Faculty of Tech',
    vehicle: 'Campus Rider',
    phone: '08123456782',
    preferredFee: 600,
  },
])

const selectRiderInstantMatch = (rider) => {
  if (!deliveryAddress.value.trim()) {
    error.value = 'Please enter your delivery hostel & room address first.'
    return
  }
  error.value = ''
  customErranderFee.value = rider.preferredFee
  lockedRider.value = { ...rider, agreedFee: rider.preferredFee }
  erranderLockStatus.value = 'locked'
  useCustomToast().showToast({
    title: 'Errander Fee Locked! 🛵',
    message: `${rider.name} agreed to deliver for ₦${rider.preferredFee.toLocaleString()}. Single escrow payment ready.`,
    toastType: 'success',
  })
}

const broadcastOffer = () => {
  if (!deliveryAddress.value.trim()) {
    error.value = 'Please enter your delivery hostel & room address first.'
    return
  }
  error.value = ''
  erranderLockStatus.value = 'broadcasting'
  negotiationMessage.value = 'Broadcasting your delivery offer to active student Erranders nearby…'

  setTimeout(() => {
    const respondingRider = nearbyErranders.value[1]
    if (Number(customErranderFee.value) >= 600) {
      lockedRider.value = { ...respondingRider, agreedFee: Number(customErranderFee.value) }
      erranderLockStatus.value = 'locked'
      useCustomToast().showToast({
        title: 'Offer Accepted! 🎉',
        message: `${respondingRider.name} accepted your ₦${Number(customErranderFee.value).toLocaleString()} delivery offer.`,
        toastType: 'success',
      })
    } else {
      erranderLockStatus.value = 'counter_offered'
      negotiationMessage.value = `${respondingRider.name} (5.0★) responded: "Hostel has multiple stair flights. I can do ₦650 for guaranteed delivery."`
    }
  }, 1600)
}

const acceptCounterOffer = (fee) => {
  customErranderFee.value = fee
  const rider = nearbyErranders.value[1]
  lockedRider.value = { ...rider, agreedFee: fee }
  erranderLockStatus.value = 'locked'
  useCustomToast().showToast({
    title: 'Counter Accepted! 🤝',
    message: `Delivery fee locked at ₦${fee.toLocaleString()} with ${rider.name}. Proceed to checkout.`,
    toastType: 'success',
  })
}

const resetErranderLock = () => {
  erranderLockStatus.value = 'unmatched'
  lockedRider.value = null
  negotiationMessage.value = ''
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
  
  if (deliveryMethod.value === 'errander') {
    if (!deliveryAddress.value.trim()) {
      error.value = 'Please provide a delivery address for the Errander.'
      return
    }
    if (erranderLockStatus.value !== 'locked') {
      error.value = 'Please match with an Errander and lock in the agreed fee above first to avoid duplicate charges.'
      return
    }
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
      riderName: lockedRider.value?.name,
      riderPhone: lockedRider.value?.phone,
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