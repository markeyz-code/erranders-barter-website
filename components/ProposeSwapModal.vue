<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 sm:backdrop-blur-sm sm:p-4">
    <div class="bg-white absolute inset-0 sm:relative sm:inset-auto w-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:max-w-xl flex flex-col overflow-hidden sm:border border-slate-200 animate-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0 pt-[max(env(safe-area-inset-top),1rem)] sm:pt-4">
        <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
          <Repeat class="w-6 h-6 text-brand-600" /> Propose Swap
        </h2>
        <button @click="$emit('close')" class="p-2 bg-white hover:bg-slate-200 rounded-full transition-colors text-slate-500">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1">
        <div class="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div class="flex gap-4">
            <img :src="targetItem?.images?.[0] || '/no-image.png'" class="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0" />
            <div class="flex-1 overflow-hidden flex flex-col justify-center">
              <h3 class="font-black text-slate-900 text-base truncate">{{ targetItem?.title }}</h3>
              <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ targetItem?.description || 'No description available.' }}</p>
              <div class="flex items-center gap-3 mt-1.5 text-[11px] font-bold text-slate-500">
                <span class="flex items-center gap-1"><MapPin class="w-3 h-3 text-brand-600" /> {{ targetItem?.location || 'No location' }}</span>
                <span v-if="targetItem?.sellerId?.firstName" class="flex items-center gap-1"><UserIcon class="w-3 h-3 text-brand-600" /> {{ targetItem.sellerId.firstName }}</span>
              </div>
            </div>
          </div>

          <!-- What it is looking to be swapped with -->
          <div class="mt-3 pt-3 border-t border-slate-200/80 bg-white rounded-xl p-3 border border-slate-200/90 flex items-start gap-2.5 shadow-xs">
            <div class="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 border border-brand-100">
              <Repeat class="w-4 h-4 text-brand-600" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[10px] font-black uppercase tracking-wider text-brand-600 block">Looking to swap with:</span>
              <p class="text-xs font-black text-slate-900 mt-0.5 leading-snug break-words">
                {{ targetItem?.swapPreference || targetItem?.description || 'Open to fair items & reasonable trade offers' }}
              </p>
              <div v-if="targetItem?.price" class="mt-1 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                <span>Benchmark Valuation:</span>
                <span class="font-black text-brand-600">₦{{ Number(targetItem.price).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1: Select Your Item -->
        <div class="mb-6">
          <label class="block text-sm font-black text-slate-400 mb-2">1. Select an item from your inventory to offer:</label>
          
          <div v-if="loadingItems" class="py-8 flex justify-center">
            <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
          </div>
          
          <div v-else-if="myItems.length === 0" class="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <Repeat class="w-6 h-6" />
            </div>
            <h4 class="text-sm font-black text-slate-900 mb-1">No items in your inventory</h4>
            <p class="text-xs text-slate-500 font-medium mb-4 max-w-xs mx-auto">
              You haven't posted any items yet to offer for this swap. List an item on Decluttered first to propose trades!
            </p>
            <NuxtLink to="/swap" class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors">
              <Repeat class="w-3.5 h-3.5" /> Post an Item to Swap
            </NuxtLink>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
            <div 
              v-for="myItem in myItems" 
              :key="myItem._id"
              @click="selectedItemId = myItem._id"
              class="border-2 rounded-xl p-3 cursor-pointer transition-all flex items-center gap-3"
              :class="selectedItemId === myItem._id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'"
            >
              <img :src="myItem.images?.[0] || '/no-image.png'" class="w-12 h-12 object-cover rounded-lg" />
              <div class="flex-1 overflow-hidden">
                <p class="text-sm font-bold text-slate-900 truncate">{{ myItem.title }}</p>
                <p class="text-xs text-slate-500 truncate">₦{{ myItem.price || 0 }}</p>
              </div>
              <div v-if="selectedItemId === myItem._id" class="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                <Check class="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Cash Balancing -->
        <div class="mb-6" v-if="selectedItemId">
          <label class="block text-sm font-black text-slate-400 mb-2">2. Cash Top-up (Optional)</label>
          <p class="text-xs text-slate-500 mb-3 font-medium">If the items have unequal value, you can offer cash or request cash to balance the deal.</p>
          
          <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <CustomSelect 
              v-model="topUpDirection" 
              :options="[
                { value: 'none', label: 'No Cash' },
                { value: 'pay', label: 'I will pay' },
                { value: 'receive', label: 'They must pay me' }
              ]"
              placeholder="Select Option"
              class="w-48 flex-shrink-0"
            />
            
            <div class="relative flex-1" v-if="topUpDirection !== 'none'">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400">₦</span>
              <input 
                v-model="formattedCashAmount" 
                type="text" 
                inputmode="numeric"
                class="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-500" 
                placeholder="Amount" 
              />
            </div>
          </div>
        </div>

        <!-- Trade Fairness Meter (Gamification) -->
        <div class="mb-4 bg-brand-50 text-slate-900 p-4 rounded-2xl border border-brand-200" v-if="selectedItemId">
          <h4 class="text-xs font-black uppercase tracking-wider text-brand-600 mb-3">Trade Evaluation</h4>
          
          <div class="flex justify-between items-center mb-2 text-sm font-bold">
            <div class="text-left w-1/3 truncate">{{ mySelectedItemObj?.title || 'Your Item' }}</div>
            <div class="text-center w-1/3 text-brand-500"><ArrowRightLeft class="w-4 h-4 mx-auto" /></div>
            <div class="text-right w-1/3 truncate">{{ targetItem?.title }}</div>
          </div>
          
          <div class="flex justify-between items-center mb-4 text-xs font-medium text-slate-500">
            <div>Value: ₦{{ myValue.toLocaleString() }}</div>
            <div>Value: ₦{{ targetValue.toLocaleString() }}</div>
          </div>

          <!-- The Meter Bar -->
          <div class="relative h-3 bg-brand-200 rounded-full overflow-hidden">
            <div class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500" :style="{ width: `${fairnessPercentage}%` }"></div>
            <div class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white -translate-x-1/2 z-10"></div>
          </div>
          
          <div class="mt-3 text-center">
            <span class="px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1" :class="fairnessBadge.class">
              <component :is="fairnessBadge.icon" class="w-3 h-3" />
              {{ fairnessBadge.text }}
            </span>
          </div>
        </div>

        <!-- Swap Protection & Escrow Fee Note -->
        <div class="mt-4 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs" v-if="selectedItemId">
          <div class="flex items-center gap-2 text-emerald-900 font-medium">
            <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Student Swap Protection & Verification</span>
          </div>
          <span class="font-extrabold text-emerald-800">₦250 <span class="text-[10px] font-normal text-emerald-600">(Escrow Safe)</span></span>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 pb-[max(env(safe-area-inset-bottom),1rem)] sm:pb-4">
        <button @click="$emit('close')" class="px-6 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">
          Cancel
        </button>
        <button 
          @click="submitOffer" 
          :disabled="!selectedItemId || submitting"
          class="bg-brand-600 text-white font-black px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Loader2 v-if="submitting" class="w-5 h-5 animate-spin" />
          <Repeat v-else class="w-5 h-5" />
          {{ submitting ? 'Sending Offer...' : 'Send Official Offer' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { X, Check, Repeat, Loader2, ArrowRightLeft, ThumbsUp, AlertTriangle, Sparkles, MapPin, User as UserIcon, ShieldCheck } from 'lucide-vue-next'
import CustomSelect from '~/components/CustomSelect.vue'
import { ref, watch, computed } from 'vue'
import { itemsApi, offersApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  isOpen: Boolean,
  targetItem: Object
})
const emit = defineEmits(['close', 'success'])

const loadingItems = ref(false)
const myItems = ref([])
const selectedItemId = ref(null)

const topUpDirection = ref('none')
const cashAmount = ref('')
const formattedCashAmount = computed({
  get: () => {
    if (!cashAmount.value) return ''
    const num = Number(String(cashAmount.value).replace(/,/g, ''))
    return isNaN(num) ? '' : num.toLocaleString('en-US')
  },
  set: (val) => {
    const stripped = String(val).replace(/[^0-9]/g, '')
    cashAmount.value = stripped ? Number(stripped) : ''
  }
})
const submitting = ref(false)

const { user, token, isLoggedIn } = useAuth()

// Gamification Metrics
const mySelectedItemObj = computed(() => {
  return myItems.value.find(i => i._id === selectedItemId.value)
})

const myValue = computed(() => {
  let val = Number(mySelectedItemObj.value?.price || 0)
  if (topUpDirection.value === 'pay' && cashAmount.value) {
    val += Number(cashAmount.value)
  } else if (topUpDirection.value === 'receive' && cashAmount.value) {
    val -= Number(cashAmount.value)
  }
  return val
})

const targetValue = computed(() => {
  return Number(props.targetItem?.price || 0)
})

const fairnessPercentage = computed(() => {
  const total = myValue.value + targetValue.value
  if (total === 0) return 50
  let perc = (myValue.value / total) * 100
  // Bound it between 10% and 90% so the bar doesn't completely disappear
  return Math.min(Math.max(perc, 10), 90)
})

const fairnessBadge = computed(() => {
  const diff = myValue.value - targetValue.value
  const threshold = targetValue.value * 0.15 // 15% margin
  
  if (diff > threshold) {
    return { text: 'Great Deal for Them', class: 'bg-blue-100 text-blue-700', icon: Sparkles }
  } else if (diff < -threshold) {
    return { text: 'Massive Steal for You!', class: 'bg-amber-100 text-amber-700', icon: AlertTriangle }
  } else {
    return { text: 'Fair Trade', class: 'bg-emerald-100 text-emerald-700', icon: ThumbsUp }
  }
})

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    // Reset form
    selectedItemId.value = null
    topUpDirection.value = 'none'
    cashAmount.value = ''
    myItems.value = []
    
    // Fetch logged-in user's own items using the authenticated myListings API
    loadingItems.value = true
    try {
      const { data } = await itemsApi.myListings()
      const list = Array.isArray(data) ? data : (data?.items || [])
      // Filter only active items and exclude the target item itself
      myItems.value = list.filter(item => 
        item && 
        (item.status === 'active' || !item.status) &&
        String(item._id) !== String(props.targetItem?._id)
      )
    } catch (e) {
      console.error('Failed to load user listings for swap proposal:', e)
      myItems.value = []
    } finally {
      loadingItems.value = false
    }
  }
})

const submitOffer = async () => {
  if (!selectedItemId.value) return
  submitting.value = true
  
  let finalCash = 0
  if (topUpDirection.value === 'pay' && cashAmount.value) {
    finalCash = Number(cashAmount.value)
  } else if (topUpDirection.value === 'receive' && cashAmount.value) {
    finalCash = -Math.abs(Number(cashAmount.value))
  }
  
  try {
    await offersApi.create({
      receiverId: props.targetItem.sellerId._id || props.targetItem.sellerId,
      targetItemId: props.targetItem._id,
      offeredItemId: selectedItemId.value,
      cashTopUp: finalCash
    })
    useCustomToast().showToast({ title: 'Notice', message: 'Offer sent successfully! The user will be notified.', toastType: "success" })
    emit('success')
    emit('close')
  } catch(e) {
    console.error('Offer failed:', e)
  } finally {
    submitting.value = false
  }
}
</script>
