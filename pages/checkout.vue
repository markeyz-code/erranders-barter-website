<template>
  <div class="min-h-screen bg-slate-50 py-16 px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
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
                <span>Escrow Fee</span>
                <span class="text-slate-900 font-bold">Free</span>
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
                Your money is held securely in Barter Escrow. The seller does not get paid until you receive the item and confirm you are satisfied.
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
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
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
            
            <div v-if="deliveryMethod === 'errander'" class="mb-8 p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Delivery Address (Hostel/Room)</label>
                <div class="relative">
                  <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input v-model="deliveryAddress" type="text" placeholder="e.g. Zik Hall, Room C34" class="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900" />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1 flex justify-between">
                  <span>Your Errander Fee Offer</span>
                  <span class="text-brand-600 font-black">Base: ₦{{ baseErranderFee.toLocaleString() }}</span>
                </label>
                <p class="text-sm text-slate-500 mb-3 font-medium">Offer a fair amount to get a faster response from erranders.</p>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">₦</span>
                  <input v-model.number="customErranderFee" type="number" :min="baseErranderFee" class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3.5 outline-none focus:border-brand-500 transition-colors font-black text-slate-900 text-lg" />
                </div>
              </div>
            </div>
            
            <hr class="border-slate-100 mb-8" />
            
            <button @click="handleCheckoutAction" :disabled="initiating || (deliveryMethod === 'errander' && !deliveryAddress)" class="w-full bg-brand-600 text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-lg">
              <Loader2 v-if="initiating" class="w-5 h-5 animate-spin" />
              <Lock v-else class="w-5 h-5" />
              {{ initiating ? 'Processing...' : (isLoggedIn ? `Pay ₦${totalAmount.toLocaleString()} Securely` : 'Log in to Checkout') }}
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

import { ArrowLeft, ShoppingBag, User, ShieldCheck, MapPin, Lock, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, isGlobalAuthModalOpen } = useAuth()
const item = ref(null)

useSeoMeta({
  title: computed(() => item.value ? `Checkout: ${item.value.title} | Erranders` : 'Checkout | Erranders'),
  description: 'Secure checkout via Erranders Escrow.',
})
const loading = ref(true)
const initiating = ref(false)
const error = ref('')

const deliveryMethod = ref('pickup')
const deliveryAddress = ref('')
const baseErranderFee = ref(500)
const customErranderFee = ref(500)

const totalAmount = computed(() => {
  if (!item.value) return 0
  const deliveryFee = deliveryMethod.value === 'errander' ? customErranderFee.value : 0
  return item.value.price + deliveryFee
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
  initiateEscrow()
}

const initiateEscrow = async () => {
  if (deliveryMethod.value === 'errander' && !deliveryAddress.value) {
    error.value = 'Please provide a delivery address for the Errander.'
    return
  }

  initiating.value = true
  error.value = ''
  try {
    const payload = {
        sellerId: item.value.sellerId._id || item.value.sellerId,
        itemId: item.value._id,
        amount: totalAmount.value,
        deliveryMethod: deliveryMethod.value,
        deliveryAddress: deliveryAddress.value
    }
    
    const { data, error: apiError } = await escrowApi.initiate(payload)
    
    if (apiError) {
      error.value = apiError
    } else {
      router.push('/escrow')
    }
  } catch (err) {
    error.value = 'Failed to initiate checkout.'
    console.error(err)
  } finally {
    initiating.value = false
  }
}

const fetchSettings = async () => {
  try {
    const { data, error } = await settingsApi.get('base_errander_fee')
    if (!error && data && data.value) {
      baseErranderFee.value = Number(data.value)
      customErranderFee.value = Number(data.value)
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