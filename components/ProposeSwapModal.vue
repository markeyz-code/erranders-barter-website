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
        <!-- Target Item Card -->
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

        <!-- Step 1: Select or Upload Item -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2.5">
            <label class="block text-sm font-black text-slate-900">
              1. {{ offerMode === 'upload' ? 'List the item you want to swap with:' : 'Select an item from your inventory:' }}
            </label>
            <!-- Toggle between Upload & Inventory -->
            <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                @click="offerMode = 'upload'"
                class="px-2.5 py-1 text-[11px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                :class="offerMode === 'upload' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
              >
                <Plus class="w-3 h-3" /> List Item to Swap
              </button>
              <button
                v-if="myItems.length > 0"
                type="button"
                @click="offerMode = 'inventory'"
                class="px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer"
                :class="offerMode === 'inventory' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
              >
                My Inventory ({{ myItems.length }})
              </button>
            </div>
          </div>

          <!-- Section A: List the Item You Want to Swap (In-Modal Form) -->
          <div v-if="offerMode === 'upload'" class="space-y-4 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-xs font-black text-slate-900 uppercase tracking-wide">
                  List Item to Swap
                </span>
              </div>
              <span class="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
                Swap Listing Only (Not for Sale)
              </span>
            </div>
            <p class="text-xs text-slate-600 font-medium -mt-1">
              Enter your item details below. This will list it for swap and immediately submit your offer to {{ targetItem?.sellerId?.firstName || 'the trader' }} — no need to leave this page!
            </p>

            <!-- Item Title -->
            <div>
              <label class="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">
                Item Title / Model You're Offering <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newItem.title"
                type="text"
                placeholder="e.g. iPhone 14 Pro (128GB) or Standing Rechargeable Fan"
                class="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all placeholder:font-normal placeholder:text-slate-400"
              />
            </div>

            <!-- Estimated Value & Condition -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">
                  Estimated Valuation (₦) <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₦</span>
                  <input
                    v-model="formattedNewItemPrice"
                    type="text"
                    inputmode="numeric"
                    placeholder="e.g. 50,000"
                    class="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">
                  Item Condition
                </label>
                <select
                  v-model="newItem.condition"
                  class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
                >
                  <option value="Brand New">Brand New (Sealed)</option>
                  <option value="Like New">Like New (Mint)</option>
                  <option value="Good Condition">Good Condition (Used)</option>
                  <option value="Fair Condition">Fair Condition (Minor Flaws)</option>
                </select>
              </div>
            </div>

            <!-- Item Photos Upload -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-black text-slate-700 uppercase tracking-wide">
                  Item Photos <span class="text-slate-400 font-normal">({{ newItem.images.length }}/4)</span>
                </label>
                <span v-if="newItem.images.length === 0" class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Photo Recommended
                </span>
              </div>

              <!-- Thumbnails -->
              <div class="grid grid-cols-4 gap-2 mb-2" v-if="newItem.images.length > 0">
                <div v-for="(img, idx) in newItem.images" :key="idx" class="aspect-square rounded-xl border border-slate-200 overflow-hidden relative group bg-white shadow-2xs">
                  <img :src="img" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="newItem.images.splice(idx, 1)"
                    class="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>

              <!-- Upload Trigger -->
              <label v-if="newItem.images.length < 4" class="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-brand-300 bg-white hover:bg-brand-50/50 text-brand-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                <Loader2 v-if="uploadingPhoto" class="w-4 h-4 animate-spin text-brand-600" />
                <Upload v-else class="w-4 h-4 text-brand-600" />
                <span>{{ uploadingPhoto ? 'Uploading photo...' : 'Take or Upload Photo of Your Item' }}</span>
                <input type="file" accept="image/*" multiple class="hidden" @change="handlePhotoUpload" :disabled="uploadingPhoto" />
              </label>
            </div>

            <!-- Description / Condition Notes -->
            <div>
              <label class="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">
                Condition Notes & Handover Details
              </label>
              <textarea
                v-model="newItem.description"
                rows="2"
                placeholder="Describe working state, accessories included, or where on campus you can meet to swap..."
                class="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 resize-none transition-all placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          <!-- Section B: Choose From My Inventory -->
          <div v-else class="space-y-3">
            <div v-if="loadingItems" class="py-8 flex justify-center">
              <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
            </div>

            <!-- Empty Inventory State with Direct Button to List Item to Swap -->
            <div v-else-if="myItems.length === 0" class="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <Repeat class="w-6 h-6" />
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-900">You don't have any items listed yet</h4>
                <p class="text-xs text-slate-500 font-medium mt-1 max-w-sm mx-auto">
                  No need to leave this page! Click the button below to list the item you want to swap right here (for swap only, not for sale).
                </p>
              </div>
              <button
                type="button"
                @click="offerMode = 'upload'"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus class="w-4 h-4" /> List Item to Swap
              </button>
            </div>

            <!-- Inventory Grid -->
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
                  <p class="text-xs text-slate-500 truncate">₦{{ Number(myItem.price || 0).toLocaleString() }}</p>
                </div>
                <div v-if="selectedItemId === myItem._id" class="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                  <Check class="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Cash Balancing -->
        <div class="mb-6" v-if="hasItemDetails">
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
        <div class="mb-4 bg-brand-50 text-slate-900 p-4 rounded-2xl border border-brand-200" v-if="hasItemDetails">
          <h4 class="text-xs font-black uppercase tracking-wider text-brand-600 mb-3">Trade Evaluation</h4>
          
          <div class="flex justify-between items-center mb-2 text-sm font-bold">
            <div class="text-left w-1/3 truncate">{{ activeItemTitle }}</div>
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
        <div class="mt-4 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs" v-if="hasItemDetails">
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
          :disabled="!canSubmit || submitting"
          class="bg-brand-600 text-white font-black px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-brand-600/20"
        >
          <Loader2 v-if="submitting" class="w-5 h-5 animate-spin" />
          <Repeat v-else class="w-5 h-5" />
          {{ submitting ? 'Submitting Swap Offer...' : (offerMode === 'upload' ? 'List Item & Send Swap Offer' : 'Send Official Offer') }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { X, Check, Repeat, Loader2, ArrowRightLeft, ThumbsUp, AlertTriangle, Sparkles, MapPin, User as UserIcon, ShieldCheck, Upload, Plus } from 'lucide-vue-next'
import CustomSelect from '~/components/CustomSelect.vue'
import { ref, watch, computed } from 'vue'
import { itemsApi, offersApi } from '~/composables/useApi'
import { upload_api } from '@/api_factory/modules/upload'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  isOpen: Boolean,
  targetItem: Object
})
const emit = defineEmits(['close', 'success'])

const loadingItems = ref(false)
const myItems = ref([])
const selectedItemId = ref(null)
const offerMode = ref('upload') // 'upload' | 'inventory'

// Direct Item Upload Form state
const newItem = ref({
  title: '',
  price: '',
  condition: 'Good Condition',
  description: '',
  images: []
})
const uploadingPhoto = ref(false)

const formattedNewItemPrice = computed({
  get: () => {
    if (!newItem.value.price) return ''
    const num = Number(String(newItem.value.price).replace(/,/g, ''))
    return isNaN(num) ? '' : num.toLocaleString('en-US')
  },
  set: (val) => {
    const stripped = String(val).replace(/[^0-9]/g, '')
    newItem.value.price = stripped ? Number(stripped) : ''
  }
})

const handlePhotoUpload = async (e) => {
  const files = e.target.files ? Array.from(e.target.files) : []
  if (!files.length) return
  uploadingPhoto.value = true
  try {
    for (const file of files) {
      if (newItem.value.images.length >= 4) break
      const res = await upload_api.uploadFile(file, 'image')
      const url = res.data?.url || res.data?.data?.url
      if (url) {
        newItem.value.images.push(url)
      }
    }
  } catch (err) {
    useCustomToast().showToast({
      title: 'Photo Upload Failed',
      message: 'Could not upload photo. Please check image format.',
      toastType: 'error'
    })
  } finally {
    uploadingPhoto.value = false
    e.target.value = ''
  }
}

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

const hasItemDetails = computed(() => {
  if (offerMode.value === 'upload') {
    return Boolean(newItem.value.title.trim() && Number(newItem.value.price) > 0)
  }
  return Boolean(selectedItemId.value)
})

const activeItemTitle = computed(() => {
  if (offerMode.value === 'upload') {
    return newItem.value.title.trim() || 'Your Offered Item'
  }
  return mySelectedItemObj.value?.title || 'Your Item'
})

// Gamification Metrics
const mySelectedItemObj = computed(() => {
  return myItems.value.find(i => i._id === selectedItemId.value)
})

const myValue = computed(() => {
  let val = 0
  if (offerMode.value === 'upload') {
    val = Number(newItem.value.price || 0)
  } else {
    val = Number(mySelectedItemObj.value?.price || 0)
  }
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

const canSubmit = computed(() => {
  if (submitting.value || uploadingPhoto.value) return false
  if (offerMode.value === 'upload') {
    return Boolean(newItem.value.title.trim() && Number(newItem.value.price) > 0)
  }
  return Boolean(selectedItemId.value)
})

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    // Reset form
    selectedItemId.value = null
    topUpDirection.value = 'none'
    cashAmount.value = ''
    myItems.value = []
    newItem.value = {
      title: '',
      price: '',
      condition: 'Good Condition',
      description: '',
      images: []
    }
    
    // Always default to upload mode so users can instantly offer their item
    offerMode.value = 'upload'
    
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
      // If user has existing listings, they can switch between upload or select from inventory
      if (myItems.value.length > 0) {
        offerMode.value = 'inventory'
        selectedItemId.value = myItems.value[0]._id
      }
    } catch (e) {
      console.error('Failed to load user listings for swap proposal:', e)
      myItems.value = []
      offerMode.value = 'upload'
    } finally {
      loadingItems.value = false
    }
  }
})

const submitOffer = async () => {
  if (!canSubmit.value) return
  submitting.value = true
  
  let finalCash = 0
  if (topUpDirection.value === 'pay' && cashAmount.value) {
    finalCash = Number(cashAmount.value)
  } else if (topUpDirection.value === 'receive' && cashAmount.value) {
    finalCash = -Math.abs(Number(cashAmount.value))
  }

  let itemToOfferId = selectedItemId.value

  try {
    // If in upload mode, create the item first
    if (offerMode.value === 'upload') {
      const createPayload = {
        title: newItem.value.title.trim(),
        price: Number(newItem.value.price || 0),
        condition: newItem.value.condition || 'Good Condition',
        description: newItem.value.description.trim() || `Offered in swap for ${props.targetItem?.title || 'item'}`,
        images: newItem.value.images.length > 0 ? newItem.value.images : (props.targetItem?.images || []),
        category: props.targetItem?.category || 'General',
        location: user.value?.hostel || user.value?.homeAddress || props.targetItem?.location || 'Campus Wide',
        swapPreference: props.targetItem?.title || 'Open to fair swaps',
        type: 'swap',
        status: 'active'
      }

      const createRes = await itemsApi.create(createPayload)
      itemToOfferId = createRes?.data?._id || createRes?.data?.id
      if (!itemToOfferId) {
        throw new Error('Could not create swap item listing.')
      }
    }

    await offersApi.create({
      receiverId: props.targetItem.sellerId._id || props.targetItem.sellerId,
      targetItemId: props.targetItem._id,
      offeredItemId: itemToOfferId,
      cashTopUp: finalCash
    })

    useCustomToast().showToast({
      title: 'Swap Offer Sent! 🤝',
      message: 'Your item and official swap proposal were submitted successfully.',
      toastType: 'success'
    })
    emit('success')
    emit('close')
  } catch(e) {
    console.error('Offer failed:', e)
    useCustomToast().showToast({
      title: 'Swap Proposal Error',
      message: e?.response?.data?.message || 'Could not send swap offer. Please check your inputs.',
      toastType: 'error'
    })
  } finally {
    submitting.value = false
  }
}
</script>
