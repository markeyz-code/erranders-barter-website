<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Back Button -->
      <button 
        @click="router.back()" 
        class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold mb-6 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" /> Back
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white p-12 rounded-3xl shadow-sm text-center">
        <Loader2 class="w-8 h-8 animate-spin text-brand-600 mx-auto mb-3" />
        <p class="text-sm font-bold text-slate-600">Loading item details...</p>
      </div>

      <!-- Item Not Found / Error -->
      <div v-else-if="!item" class="bg-white p-12 rounded-3xl shadow-sm text-center">
        <ShoppingBag class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 class="text-lg font-bold text-slate-800 mb-1">Item Not Found</h3>
        <p class="text-sm text-slate-500 mb-4">{{ error || 'Could not load the item for checkout.' }}</p>
        <NuxtLink to="/explore" class="inline-block px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm">
          Browse Marketplace
        </NuxtLink>
      </div>

      <!-- Checkout Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Side: Order Summary & Item Info -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 class="font-bold text-slate-900 mb-4">Order Summary</h3>
            
            <div class="flex gap-4 pb-6 border-b border-slate-100">
              <img 
                :src="item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=300'" 
                :alt="item.title"
                class="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-100"
              />
              <div class="flex-1 min-w-0">
                <span class="inline-block px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-black rounded uppercase tracking-wider mb-1">
                  {{ item.category?.name || item.category || 'Declutter Item' }}
                </span>
                <h4 class="font-bold text-slate-900 text-sm truncate mb-1">{{ item.title }}</h4>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                  <User class="w-3.5 h-3.5" /> Seller: {{ item.sellerId?.firstName || 'Student' }}
                </div>
              </div>
            </div>

            <div class="space-y-3 text-sm font-medium text-slate-600 mt-4">
              <div v-if="bundleData && bundleData.totalValuation" class="flex justify-between text-xs">
                <span>Total Items Valuation</span>
                <span class="text-slate-500 line-through">₦{{ Number(bundleData.totalValuation).toLocaleString() }}</span>
              </div>
              <div v-if="bundleData && bundleData.bundleDiscountPercent > 0" class="flex justify-between text-xs text-emerald-600 font-bold">
                <span>Bundle Discount ({{ bundleData.bundleDiscountPercent }}%)</span>
                <span>-₦{{ Number(bundleData.totalValuation - (bundleData.discountedTotal || item.price)).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ bundleData ? 'Discounted Bundle Price' : 'Item Price' }}</span>
                <span class="text-slate-900 font-bold">₦{{ item.price.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Delivery Fee</span>
                <span class="text-slate-900 font-bold">
                  {{ deliveryMethod === 'errander' ? '₦' + customErranderFee.toLocaleString() : 'Free (Self Pickup)' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="flex items-center gap-1">
                  <span>Student Buyer Protection</span>
                  <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">2.5%</span>
                </span>
                <span class="text-slate-900 font-bold">
                  ₦{{ escrowFeeAmount.toLocaleString() }}
                </span>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
              <span class="font-bold text-slate-900 text-lg">Total</span>
              <span class="font-black text-3xl text-brand-600">₦{{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>

          <div class="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex gap-4 items-start">
            <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 class="font-bold text-emerald-950 mb-1">Student Escrow & Buyer Protection</h4>
              <p class="text-xs text-emerald-800 font-medium leading-relaxed">
                Your payment is held safely in escrow. The seller and Errand Ninja are only paid after you inspect and confirm receipt of the item.
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
                  :class="deliveryMethod === 'pickup' ? 'border-brand-600 bg-brand-50/70 shadow-xs ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300 bg-white'"
                >
                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                       :class="deliveryMethod === 'pickup' ? 'border-brand-600' : 'border-slate-300'">
                    <div v-if="deliveryMethod === 'pickup'" class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-xs sm:text-sm">Self Pickup</h4>
                    <p class="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">Meet the seller on campus.</p>
                    <span class="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded uppercase">Free</span>
                  </div>
                </div>
                
                <!-- Erranders Delivery -->
                <div 
                  @click="deliveryMethod = 'errander'"
                  class="flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all"
                  :class="deliveryMethod === 'errander' ? 'border-brand-600 bg-brand-50/70 shadow-xs ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300 bg-white'"
                >
                  <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                       :class="deliveryMethod === 'errander' ? 'border-brand-600' : 'border-slate-300'">
                    <div v-if="deliveryMethod === 'errander'" class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>Erranders Delivery</span>
                      <span class="bg-brand-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase">Live Dispatch</span>
                    </h4>
                    <p class="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">Campus Errand Ninja dispatch direct to your room.</p>
                    <span class="inline-block mt-2 px-2 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-black rounded uppercase">Custom Errand</span>
                  </div>
                </div>

              </div>
            </div>
            
            <!-- Erranders Delivery Configuration -->
            <div v-if="deliveryMethod === 'errander'" class="mb-8 p-4 sm:p-6 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
              
              <!-- Address -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Delivery Address (Hostel / Hall, Block & Room) <span class="text-brand-600">*</span></label>
                <div class="relative">
                  <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    v-model="deliveryAddress" 
                    type="text" 
                    :disabled="!!activeNegotiationTx"
                    placeholder="e.g. Moremi Hall, Block B Room 204 or New Hall Room 12" 
                    class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-500" 
                  />
                </div>
              </div>

              <!-- Special Instructions -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Special Delivery Instructions / Notes (Optional)</label>
                <div class="relative">
                  <FileText class="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea 
                    v-model="deliveryNotes" 
                    :disabled="!!activeNegotiationTx"
                    rows="2"
                    placeholder="e.g. 3rd floor stairs; call when outside porter's lodge; handle with care..." 
                    class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors font-medium text-slate-900 resize-none disabled:bg-slate-100 disabled:text-slate-500" 
                  ></textarea>
                </div>
              </div>

              <!-- Proposed Fee Input (Before negotiation is dispatched) -->
              <div v-if="!activeNegotiationTx">
                <label class="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                  <span>Proposed Runner Fee Offer</span>
                  <span class="text-brand-600 font-black">Base: ₦{{ baseErranderFee.toLocaleString() }} (Min ₦300)</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₦</span>
                  <input 
                    v-model="formattedErranderFee" 
                    type="text" 
                    inputmode="numeric" 
                    class="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-brand-500 transition-colors font-black text-slate-900 text-sm" 
                  />
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Offer a fair fee for stairs, heavy load, or distance. Request will be sent for negotiation first before payment.</p>
              </div>

              <!-- Live Dispatch Network Info Banner -->
              <div v-if="!activeNegotiationTx" class="p-3.5 rounded-xl border border-brand-200 bg-brand-50/70 text-slate-700 space-y-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p class="text-xs font-bold text-brand-900">
                    Negotiation Dispatched to Errand Ninja Web App
                  </p>
                </div>
                <p class="text-[11px] text-brand-800 leading-relaxed font-medium">
                  Because this is a <strong>Custom Errand</strong>, your request is dispatched directly to active student Errand Ninjas on campus for negotiation.
                  <strong>Payment is not taken upfront</strong> — once the delivery fee is agreed, Paystack is automatically triggered for you to pay.
                </p>
              </div>

              <!-- Active Negotiation Card (Live on Errand Ninja Web App) -->
              <div v-else class="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div class="flex items-center justify-between border-b border-amber-200/80 pb-3">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span class="text-xs font-black uppercase tracking-wider text-amber-950">
                      Negotiation Dispatched to Errand Ninja
                    </span>
                  </div>
                  <span class="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    ID: #{{ String(activeNegotiationTx._id).slice(-6) }}
                  </span>
                </div>

                <div class="space-y-1">
                  <h4 class="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Handshake class="w-4 h-4 text-amber-600" />
                    <span>Price Negotiation in Progress</span>
                  </h4>
                  <p class="text-xs text-slate-600 font-medium">
                    The Errand Ninja web app has received your delivery request. You can accept the current delivery fee or submit a counter offer.
                  </p>
                </div>

                <!-- Ninja's counter-offer received -->
                <div v-if="activeNegotiationTx.proposedDeliveryFee" class="p-3.5 bg-white rounded-xl border border-amber-300 shadow-xs space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-700">Ninja's Proposed Delivery Fee:</span>
                    <span class="text-base font-black text-brand-600">₦{{ activeNegotiationTx.proposedDeliveryFee.toLocaleString() }}</span>
                  </div>
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₦</span>
                      <input 
                        v-model="counterFeeInput" 
                        type="number" 
                        placeholder="Counter fee offer" 
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 text-xs font-black outline-none focus:border-brand-500 text-slate-900"
                      />
                    </div>
                    <button 
                      @click="sendCounterNegotiation" 
                      :disabled="counterLoading || !counterFeeInput"
                      class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <Loader2 v-if="counterLoading" class="w-3.5 h-3.5 animate-spin" />
                      <span v-else>Send Counter</span>
                    </button>
                  </div>
                </div>

                <!-- Current offer fee display -->
                <div v-else class="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                  <span class="font-bold text-slate-700">Agreed / Proposed Delivery Fee:</span>
                  <span class="font-black text-brand-600 text-sm">₦{{ currentConcludedFee.toLocaleString() }}</span>
                </div>

                <div class="text-[11px] text-amber-900/80 font-medium flex items-center gap-1.5">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                  <span>Concluding will finalize the fee and trigger Paystack for payment.</span>
                </div>
              </div>

            </div>
            
            <!-- Sold Out / Reserved Alert -->
            <div v-if="item.status !== 'active' && (!activeNegotiationTx || item.status === 'sold')" class="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900">
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
            
            <!-- Primary Action Buttons based on delivery method & negotiation stage -->
            <!-- 1. Custom Errand: Initial state (Send Request for Negotiation) -->
            <div v-if="deliveryMethod === 'errander' && !activeNegotiationTx" class="space-y-2">
              <button
                @click="startCustomErrandNegotiation"
                :disabled="(item.status !== 'active' && item.status !== 'pending') || initiating || !deliveryAddress.trim()"
                class="w-full bg-brand-600 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-base"
              >
                <Loader2 v-if="initiating" class="w-5 h-5 animate-spin" />
                <Send v-else class="w-5 h-5" />
                <span>
                  {{ initiating ? 'Dispatching to Errand Ninja...' : (isLoggedIn ? 'Send Request for Errand Ninja Negotiation' : 'Log in to Request Errand') }}
                </span>
              </button>
              <p class="text-[11px] text-slate-400 text-center font-medium">
                ⚡ Errand Ninjas will review your request. Paystack payment is triggered once negotiation concludes.
              </p>
            </div>

            <!-- 2. Custom Errand: Conclude Negotiation & Trigger Paystack -->
            <div v-else-if="deliveryMethod === 'errander' && activeNegotiationTx" class="space-y-2">
              <button
                @click="concludeNegotiationAndTriggerPaystack"
                :disabled="initiating"
                class="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 text-base"
              >
                <Loader2 v-if="initiating" class="w-5 h-5 animate-spin" />
                <Lock v-else class="w-5 h-5" />
                <span>
                  {{ initiating ? 'Connecting to Paystack...' : `Conclude & Pay ₦${totalAmount.toLocaleString()} via Paystack` }}
                </span>
              </button>
              <p class="text-[11px] text-emerald-700 text-center font-bold">
                🔒 Includes Item (₦{{ item.price.toLocaleString() }}) + Negotiated Delivery (₦{{ currentConcludedFee.toLocaleString() }}) + Escrow Fee (₦{{ escrowFeeAmount.toLocaleString() }})
              </p>
            </div>

            <!-- 3. Self Pickup: Direct Paystack Escrow Checkout -->
            <div v-else class="space-y-2">
              <button
                @click="handleDirectPaystackCheckout"
                :disabled="item.status !== 'active' || initiating"
                class="w-full bg-brand-600 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-base"
              >
                <Loader2 v-if="initiating" class="w-5 h-5 animate-spin" />
                <Lock v-else class="w-5 h-5" />
                <span>
                  {{ item.status !== 'active' ? (item.status === 'sold' ? 'Item Sold Out' : 'Item Reserved') : initiating ? 'Connecting to Paystack...' : (isLoggedIn ? `Pay ₦${totalAmount.toLocaleString()} via Paystack` : 'Log in to Checkout') }}
                </span>
              </button>
              <p class="text-[11px] text-slate-400 text-center font-medium">
                🔒 Free self pickup on campus. Payment is held in Escrow until confirmed.
              </p>
            </div>

            <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center bg-red-50 p-3 rounded-lg">{{ error }}</p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
  FileText,
  Send,
  Handshake,
  CheckCircle2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { user, isLoggedIn, isGlobalAuthModalOpen } = useAuth()
const item = ref(null)
const bundleData = ref(null)
const bundleItems = ref([])

useHead({
  script: [
    { src: 'https://js.paystack.co/v1/inline.js', async: true }
  ]
})

useSeoMeta({
  title: computed(() => item.value ? `Checkout: ${item.value.title} | Decluttered` : 'Checkout | Decluttered'),
  description: 'Secure checkout via Decluttered Escrow with live Errand Ninja campus delivery dispatch.',
  ogTitle: 'Decluttered Secure Checkout',
})
const loading = ref(true)
const initiating = ref(false)
const error = ref('')

const deliveryMethod = ref('pickup') // 'pickup' | 'errander'
const deliveryAddress = ref('')
const deliveryNotes = ref('')
const baseErranderFee = ref(500)
const customErranderFee = ref(500)
const escrowFeePercentage = ref(2.5) // 2.5% Student Buyer Protection & Escrow

const activeNegotiationTx = ref(null)
const counterFeeInput = ref('')
const counterLoading = ref(false)
let pollTimer = null

const formattedErranderFee = computed({
  get: () => {
    if (!customErranderFee.value) return ''
    const num = Number(String(customErranderFee.value).replace(/,/g, ''))
    return isNaN(num) ? '' : num.toLocaleString('en-US')
  },
  set: (val) => {
    const stripped = String(val).replace(/[^0-9]/g, '')
    customErranderFee.value = stripped ? Math.max(300, Number(stripped)) : 300
  }
})

const currentConcludedFee = computed(() => {
  if (activeNegotiationTx.value) {
    const fee = activeNegotiationTx.value.proposedDeliveryFee || activeNegotiationTx.value.deliveryFee
    return Number(fee) || Number(customErranderFee.value) || 500
  }
  return Number(customErranderFee.value) || 500
})

const escrowFeeAmount = computed(() => {
  if (!item.value || !item.value.price) return 0
  const perc = escrowFeePercentage.value || 2.5
  const deliveryFee = deliveryMethod.value === 'errander' ? currentConcludedFee.value : 0
  const baseTotal = item.value.price + deliveryFee
  return Math.max(100, Math.round((baseTotal * perc) / 100))
})

const totalAmount = computed(() => {
  if (!item.value) return 0
  const deliveryFee = deliveryMethod.value === 'errander' ? currentConcludedFee.value : 0
  return item.value.price + deliveryFee + escrowFeeAmount.value
})

const fetchItem = async () => {
  if (route.query.batchId) {
    try {
      const { data, error: apiError } = await itemsApi.getDeclutterBatch(String(route.query.batchId))
      const batchRes = data?.data || data
      if (apiError || !batchRes) {
        error.value = apiError || 'Room declutter bundle not found'
      } else {
        bundleData.value = batchRes
        bundleItems.value = batchRes.items || []
        const primaryItem = batchRes.items?.[0] || {}
        item.value = {
          _id: primaryItem._id || 'bundle',
          title: batchRes.groupName || `${batchRes.hostel || 'Hostel'} Room Clearance Box (${batchRes.items?.length || 0} Items)`,
          price: batchRes.discountedTotal || batchRes.totalValuation || 0,
          images: primaryItem.images || [],
          sellerId: batchRes.seller || primaryItem.sellerId || { firstName: 'Room Declutter Seller' },
          condition: 'Room Clearance Bundle',
          category: 'Declutter Box',
        }
      }
    } catch (err) {
      error.value = 'Failed to load room declutter bundle.'
      console.error(err)
    } finally {
      loading.value = false
    }
    return
  }

  if (!route.query.itemId) {
    error.value = 'No item or declutter bundle specified.'
    loading.value = false
    return
  }
  
  try {
    const { data, error: apiError } = await itemsApi.getById(route.query.itemId)
    if (apiError) {
       error.value = apiError
    } else {
       item.value = data
       checkExistingNegotiation()
    }
  } catch (err) {
    error.value = 'Failed to load item details.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const checkExistingNegotiation = async () => {
  if (!isLoggedIn.value || !item.value) return
  try {
    const { data } = await escrowApi.myTransactions()
    const list = data?.data || data || []
    const existing = list.find(tx => 
      String(tx.itemId?._id || tx.itemId) === String(item.value._id) && 
      (tx.status === 'pending_negotiation' || (tx.status === 'held_in_escrow' && tx.proposedDeliveryFee > 0))
    )
    if (existing) {
      activeNegotiationTx.value = existing
      deliveryMethod.value = 'errander'
      if (existing.deliveryAddress) deliveryAddress.value = existing.deliveryAddress
      if (existing.proposedDeliveryFee) customErranderFee.value = existing.proposedDeliveryFee
      startNegotiationPolling(existing._id)
    }
  } catch (err) {
    // optional check
  }
}

// 1. Dispatch Custom Errand Request for Negotiation (No upfront payment!)
const startCustomErrandNegotiation = async () => {
  if (!isLoggedIn.value) {
    isGlobalAuthModalOpen.value = true
    return
  }
  if (!deliveryAddress.value.trim()) {
    error.value = 'Please provide your delivery address (hostel name, block & room).'
    return
  }

  initiating.value = true
  error.value = ''

  try {
    const payload = {
      sellerId: item.value.sellerId?._id || item.value.sellerId,
      itemId: item.value._id,
      batchId: route.query.batchId ? String(route.query.batchId) : undefined,
      deliveryAddress: deliveryAddress.value.trim(),
      proposedDeliveryFee: Number(customErranderFee.value) || 500,
      notes: deliveryNotes.value || undefined,
    }

    const { data, error: apiError } = await escrowApi.initiateNegotiation(payload)
    if (apiError) {
      error.value = apiError
      initiating.value = false
      return
    }

    const createdTx = data?.data || data
    activeNegotiationTx.value = createdTx
    initiating.value = false

    useCustomToast().showToast({
      title: 'Errand Request Dispatched! 🚀',
      message: 'Sent to campus Errand Ninjas. Once the fee is agreed, Paystack will be triggered.',
      toastType: 'success'
    })

    startNegotiationPolling(createdTx._id)
  } catch (err) {
    error.value = 'Failed to dispatch custom errand negotiation.'
    console.error(err)
    initiating.value = false
  }
}

// Polling for negotiation updates from Errand Ninja dispatch
const startNegotiationPolling = (txId) => {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    if (!txId) return
    try {
      const { data } = await escrowApi.getTransaction(txId)
      const fresh = data?.data || data
      if (fresh) {
        activeNegotiationTx.value = fresh
        // If already paid or released
        if (fresh.status === 'held_in_escrow' && fresh.paymentReference) {
          clearInterval(pollTimer)
          router.push('/escrow')
        }
      }
    } catch (e) {
      // ignore transient poll errors
    }
  }, 4000)
}

// Counter offer from buyer during negotiation
const sendCounterNegotiation = async () => {
  if (!activeNegotiationTx.value || !counterFeeInput.value) return
  counterLoading.value = true
  try {
    const { error: apiError } = await escrowApi.counterNegotiation(activeNegotiationTx.value._id, Number(counterFeeInput.value))
    if (apiError) {
      useCustomToast().showToast({ title: 'Error', message: apiError, toastType: 'error' })
    } else {
      activeNegotiationTx.value.proposedDeliveryFee = Number(counterFeeInput.value)
      customErranderFee.value = Number(counterFeeInput.value)
      counterFeeInput.value = ''
      useCustomToast().showToast({ title: 'Counter Offer Sent!', message: 'Errand Ninja web app notified.', toastType: 'success' })
    }
  } catch (err) {
    console.error(err)
  } finally {
    counterLoading.value = false
  }
}

// 2. Conclude Negotiation & Trigger Paystack for payment
const concludeNegotiationAndTriggerPaystack = async () => {
  if (!activeNegotiationTx.value) return
  initiating.value = true
  error.value = ''

  try {
    // Conclude negotiation
    const { data: acceptData, error: acceptError } = await escrowApi.acceptNegotiation(activeNegotiationTx.value._id)
    if (acceptError) {
      // If no negotiation existed to accept, fallback to current agreed fee
      console.warn('Accept negotiation notice:', acceptError)
    }

    const finalFee = acceptData?.concludedFee || currentConcludedFee.value
    const finalAmount = totalAmount.value

    const runtimeConfig = useRuntimeConfig()
    const paystackKey = runtimeConfig.public.paystackPublicKey || 'pk_test_e3bcb144aaf2804f21581969dffaa563ae467ed4'

    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: user.value?.email || 'customer@erranders.org',
      amount: Math.round(finalAmount * 100), // in kobo
      currency: 'NGN',
      ref: 'ESCROW_' + Math.floor((Math.random() * 1000000000) + 1),
      callback: async (response) => {
        try {
          const { error: confirmErr } = await escrowApi.confirmPayment(activeNegotiationTx.value._id, {
            paymentReference: response.reference,
            negotiatedFee: finalFee
          })
          if (confirmErr) {
            error.value = confirmErr
            initiating.value = false
          } else {
            useCustomToast().showToast({
              title: 'Payment Confirmed! 🚀',
              message: 'Custom Errand delivery is active! Track progress in Escrow.',
              toastType: 'success'
            })
            router.push('/escrow')
          }
        } catch (err) {
          error.value = 'Failed to confirm payment on escrow.'
          initiating.value = false
        }
      },
      onClose: () => {
        initiating.value = false
      }
    })

    handler.openIframe()
  } catch (err) {
    error.value = 'Failed to finalize negotiation.'
    console.error(err)
    initiating.value = false
  }
}

// 3. Direct Paystack Checkout for Self Pickup (No delivery negotiation needed)
const handleDirectPaystackCheckout = () => {
  if (!isLoggedIn.value) {
    isGlobalAuthModalOpen.value = true
    return
  }

  initiating.value = true
  error.value = ''

  const runtimeConfig = useRuntimeConfig()
  const paystackKey = runtimeConfig.public.paystackPublicKey || 'pk_test_e3bcb144aaf2804f21581969dffaa563ae467ed4'

  const handler = window.PaystackPop.setup({
    key: paystackKey,
    email: user.value?.email || 'customer@erranders.org',
    amount: Math.round(totalAmount.value * 100),
    currency: 'NGN',
    ref: 'ESCROW_' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      initiateEscrow(response.reference)
    },
    onClose: function(){
      initiating.value = false
    }
  })

  handler.openIframe()
}

const initiateEscrow = async (paymentRef) => {
  try {
    const isErrander = deliveryMethod.value === 'errander'
    const fee = isErrander ? (currentConcludedFee.value || customErranderFee.value || 500) : 0
    const payload = {
      sellerId: item.value.sellerId?._id || item.value.sellerId,
      itemId: item.value._id,
      batchId: route.query.batchId ? String(route.query.batchId) : undefined,
      amount: totalAmount.value,
      deliveryMethod: isErrander ? 'errander' : 'pickup',
      deliveryAddress: isErrander ? (deliveryAddress.value.trim() || 'Campus Delivery') : 'Self Pickup on Campus',
      deliveryFee: fee,
      notes: deliveryNotes.value || undefined,
      paymentReference: paymentRef
    }
    
    const { error: apiError } = await escrowApi.initiate(payload)
    
    if (apiError) {
      error.value = apiError
      initiating.value = false
    } else {
      useCustomToast().showToast({
        title: 'Payment Confirmed! 🚀',
        message: isErrander
          ? 'Payment held safely in Escrow. Errand Ninja delivery dispatched!'
          : 'Payment held safely in Escrow. Contact seller for campus pickup.',
        toastType: 'success'
      })
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

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>