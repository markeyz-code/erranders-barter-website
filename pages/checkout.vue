<template>
  <div class="min-h-screen bg-slate-50 py-8 sm:py-12">
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
                    placeholder="e.g. Moremi Hall, Block B Room 204 or New Hall Room 12" 
                    class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors font-medium text-slate-900" 
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
                    rows="2"
                    placeholder="e.g. 3rd floor stairs; call when outside porter's lodge; handle with care..." 
                    class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-brand-500 transition-colors font-medium text-slate-900 resize-none" 
                  ></textarea>
                </div>
              </div>

              <!-- Proposed Fee Input -->
              <div>
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
                <p class="text-[11px] text-slate-400 mt-1">Offer a fair fee for stairs, heavy load, or distance to ensure rapid acceptance by Errand Ninjas.</p>
              </div>

              <!-- Live Dispatch Network Info Banner -->
              <div class="p-3.5 rounded-xl border border-brand-200 bg-brand-50/70 text-slate-700 space-y-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p class="text-xs font-bold text-brand-900">
                    Connected live to Errand Ninja Dispatch Web App
                  </p>
                </div>
                <p class="text-[11px] text-brand-800 leading-relaxed font-medium">
                  Your delivery is dispatched directly to active student Errand Ninjas on campus as a <strong>Custom Errand</strong>. 
                  Full negotiation is supported: if a Ninja submits a counter-offer for stairs or distance, you can accept or counter in real time right from your Escrow Dashboard.
                </p>
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
            
            <!-- Primary Paystack Checkout Button -->
            <button
              @click="handleCheckoutAction"
              :disabled="item.status !== 'active' || initiating || (deliveryMethod === 'errander' && !deliveryAddress.trim())"
              class="w-full bg-brand-600 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-base"
            >
              <Loader2 v-if="initiating" class="w-5 h-5 animate-spin" />
              <Lock v-else class="w-5 h-5" />
              <span>
                {{ item.status !== 'active' ? (item.status === 'sold' ? 'Item Sold Out' : 'Item Reserved') : initiating ? 'Connecting to Paystack...' : (isLoggedIn ? `Pay ₦${totalAmount.toLocaleString()} via Paystack` : 'Log in to Checkout') }}
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
  FileText
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

const escrowFeeAmount = computed(() => {
  if (!item.value || !item.value.price) return 0
  const perc = escrowFeePercentage.value || 2.5
  return Math.max(100, Math.round((item.value.price * perc) / 100))
})

const totalAmount = computed(() => {
  if (!item.value) return 0
  const deliveryFee = deliveryMethod.value === 'errander' ? Number(customErranderFee.value) || 0 : 0
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
  
  if (deliveryMethod.value === 'errander' && !deliveryAddress.value.trim()) {
    error.value = 'Please provide your delivery address (hostel name, block & room).'
    return
  }
  
  initiating.value = true
  error.value = ''
  
  const runtimeConfig = useRuntimeConfig()
  const paystackKey = runtimeConfig.public.paystackPublicKey || 'pk_test_e3bcb144aaf2804f21581969dffaa563ae467ed4'

  const handler = window.PaystackPop.setup({
    key: paystackKey, 
    email: user.value?.email || 'customer@erranders.org',
    amount: Math.round(totalAmount.value * 100), // Paystack uses kobo
    currency: 'NGN',
    ref: 'ESCROW_' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      initiateEscrow(response.reference)
    },
    onClose: function(){
      initiating.value = false
    }
  });
  
  handler.openIframe();
}

const initiateEscrow = async (paymentRef) => {
  try {
    const feeToCharge = deliveryMethod.value === 'errander' ? Number(customErranderFee.value) || 0 : 0

    const payload = {
      sellerId: item.value.sellerId?._id || item.value.sellerId,
      itemId: item.value._id,
      batchId: route.query.batchId ? String(route.query.batchId) : undefined,
      amount: totalAmount.value,
      deliveryMethod: deliveryMethod.value,
      deliveryAddress: deliveryAddress.value,
      deliveryFee: feeToCharge,
      notes: deliveryNotes.value || undefined,
      paymentReference: paymentRef
    }
    
    const { data, error: apiError } = await escrowApi.initiate(payload)
    
    if (apiError) {
      error.value = apiError
      initiating.value = false
    } else {
      useCustomToast().showToast({
        title: 'Payment Confirmed! 🚀',
        message: deliveryMethod.value === 'errander' 
          ? 'Custom Errand dispatched to campus Errand Ninjas! Track delivery in Escrow.'
          : 'Payment held in Escrow. Contact seller for campus pickup.',
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
</script>