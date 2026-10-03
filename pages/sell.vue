<template>
  <main class="min-h-screen bg-slate-50 pt-16 pb-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      
      <!-- Back Link -->
      <div class="mb-8">
        <NuxtLink to="/" class="inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">
          <ArrowLeft class="w-4 h-4 mr-2" /> Back to Explore
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <!-- Left Side: Context / Instructions -->
        <div class="lg:col-span-2 space-y-8">
          <div>
            <h1 class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              List an Item
            </h1>
            <p class="text-lg text-slate-600 font-medium leading-relaxed">
              Join thousands of students trading safely on campus. Sell for cash or swap for something you need.
            </p>
          </div>
          
          <div class="space-y-6">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                <ShieldCheck class="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 mb-1">Escrow Protected</h3>
                <p class="text-sm text-slate-500 font-medium">Your funds are held securely until both parties are satisfied. No scams, no worries.</p>
              </div>
            </div>
            
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Truck class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 mb-1">Optional Errander Delivery</h3>
                <p class="text-sm text-slate-500 font-medium">Buyers can opt to use an Errander to pick up and deliver the item directly to their hostel.</p>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Repeat class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 mb-1">Sell or Swap</h3>
                <p class="text-sm text-slate-500 font-medium">Leave the price blank if you're open to swapping for something else of equal value.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Form Card -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
            <div class="p-4 sm:p-8 sm:p-10">
              
              <div v-if="success" class="mb-8 bg-green-50 border border-green-200 text-green-700 p-4 sm:p-6 rounded-2xl flex items-center gap-4">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Check class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 class="font-bold text-lg mb-1">Item Listed Successfully!</h3>
                  <p class="text-sm font-medium">Taking you to the marketplace...</p>
                </div>
              </div>

              <form v-else @submit.prevent="submitListing" class="space-y-6">
                <!-- Title -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-2">Item Title</label>
                  <input v-model="form.title" required type="text" placeholder="e.g. Mini Fridge, barely used" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900" />
                </div>
                
                <!-- Category & Condition Custom Dropdowns -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-20">
                  <!-- Custom Category Dropdown -->
                  <div class="relative">
                    <label class="block text-xs font-bold text-slate-700 mb-2">Category</label>
                    <div @click="catOpen = !catOpen; condOpen = false" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center transition-colors hover:border-brand-500">
                      <span class="font-medium text-slate-900">{{ form.category || 'Select Category...' }}</span>
                      <ChevronDown class="w-4 h-4 text-slate-400" />
                    </div>
                    <div v-if="catOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30">
                      <div v-for="c in categories" :key="c.name" @click="form.category = c.name; catOpen = false" class="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium border-b last:border-b-0 border-slate-100 flex items-center gap-3">
                        <span>{{ c.name }}</span>
                      </div>
                      <div @click="form.category = 'Other'; catOpen = false" class="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium">Other</div>
                    </div>
                  </div>
                  
                  <!-- Condition Dropdown -->
                  <div class="relative">
                    <label class="block text-xs font-bold text-slate-700 mb-2">Condition</label>
                    <div @click="condOpen = !condOpen; catOpen = false" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center transition-colors hover:border-brand-500">
                      <span class="font-medium text-slate-900">{{ form.condition || 'Select Condition...' }}</span>
                      <ChevronDown class="w-4 h-4 text-slate-400" />
                    </div>
                    <div v-if="condOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-30">
                      <div v-for="c in conditions" :key="c" @click="form.condition = c; condOpen = false" class="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium border-b last:border-b-0 border-slate-100">
                        {{ c }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="form.category === 'Other'" class="mt-4">
                  <label class="block text-xs font-bold text-slate-700 mb-2">Custom Category</label>
                  <input v-model="form.customCategory" required type="text" placeholder="e.g. Vintage Collectibles" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900" />
                </div>

                <!-- Price & Location -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-2">Price (₦)</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>
                      <input v-model.number="form.price" type="number" placeholder="Leave blank to swap" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-2">Location</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <MapPin class="w-4 h-4" />
                      </span>
                      <input v-model="form.location" required type="text" placeholder="e.g. Mellanby Hall" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900" />
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-2">Description</label>
                  <textarea v-model="form.description" rows="4" placeholder="Describe the item, any flaws, why you're selling..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900 resize-none"></textarea>
                </div>
                
                <!-- Images & Video -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-2 flex justify-between">
                    <span>Media (Photos/Videos)</span>
                  </label>
                  
                  <div class="flex gap-4 flex-wrap">
                    <div v-for="(media, idx) in form.images" :key="idx" class="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 group bg-slate-900 flex items-center justify-center">
                      <img v-if="!media.isVideo" :src="media.url" class="w-full h-full object-cover" />
                      <video v-else :src="media.url" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                      <button type="button" @click="form.images.splice(idx, 1)" class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X class="w-6 h-6" />
                      </button>
                    </div>

                    <!-- Upload Files Button -->
                    <label class="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">
                      <ImagePlus class="w-6 h-6 text-slate-400 mb-1" />
                      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight" v-if="!uploading">Upload<br>Files</span>
                      <span class="text-[10px] font-bold text-brand-500 uppercase tracking-widest animate-pulse" v-else>Wait...</span>
                      <input type="file" accept="image/*,video/*" multiple @change="uploadMultiple" class="hidden" :disabled="uploading" />
                    </label>

                    <!-- Record Video Button -->
                    <button type="button" @click="openCamera" class="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">
                      <Video class="w-6 h-6 text-slate-400 mb-1" />
                      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">Record<br>Video</span>
                    </button>
                  </div>
                </div>
                
                <hr class="border-slate-100" />
                
                <!-- Submit -->
                <button type="submit" :disabled="loading || uploading || !form.title || !form.location" class="w-full py-4 rounded-xl text-white font-bold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:bg-slate-400 transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center text-lg">
                  <Loader2 v-if="loading" class="w-6 h-6 animate-spin mr-2" />
                  <span v-if="loading">Securing Listing...</span>
                  <span v-else>Post Item Securely</span>
                </button>
                <p class="text-xs text-center text-slate-500 font-medium mt-4">By posting, you agree to our <NuxtLink to="/terms" class="text-brand-600 hover:underline">Terms of Service</NuxtLink></p>
              </form>
            </div>
            
            <!-- Camera Modal -->
            <div v-if="cameraOpen" class="absolute inset-0 bg-black z-50 flex flex-col">
              <div class="p-4 flex justify-between items-center bg-black/50 absolute top-0 left-0 right-0 z-10">
                <button type="button" @click="closeCamera" class="text-white p-2 rounded-full bg-black/50 hover:bg-black/80">
                  <X class="w-6 h-6" />
                </button>
                <button type="button" @click="flipCamera" class="text-white p-2 rounded-full bg-black/50 hover:bg-black/80 flex items-center gap-2 text-sm font-bold">
                  <SwitchCamera class="w-5 h-5" /> Flip
                </button>
              </div>
              <video ref="videoEl" autoplay playsinline muted class="flex-1 object-cover w-full h-full"></video>
              
              <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-8 flex justify-center items-center bg-gradient-to-t from-black/80 to-transparent">
                <button v-if="!isRecording" @click="startRecording" type="button" class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-500/80 hover:bg-red-500 transition-colors">
                  <div class="w-6 h-6 bg-white rounded-full"></div>
                </button>
                <button v-else @click="stopRecording" type="button" class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-500 animate-pulse">
                  <div class="w-6 h-6 bg-white rounded-md"></div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Auth Prompt Modal -->
    <div v-if="showAuthPrompt" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-3xl p-4 sm:p-8 text-center shadow-2xl relative" @click.stop>
        <h3 class="text-2xl font-black text-slate-900 mb-4">Almost there!</h3>
        <p class="text-slate-600 font-medium mb-8">Please, we know you want to list your item to get it sold, but to help you track and easily manage your items, you need to sign up or log in first.</p>
        <div class="flex gap-4 justify-center">
          <button @click="showAuthPrompt = false" class="px-4 sm:px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
          <button @click="showAuthPrompt = false; showAuthModal = true" class="px-4 sm:px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-lg transition-colors">Login / Sign up</button>
        </div>
      </div>
    </div>

    <AuthModal :isOpen="showAuthModal" @close="showAuthModal = false" @success="handleAuthSuccess" />

  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ShieldCheck, Truck, Repeat, Check, MapPin, ImagePlus, Video, X, Loader2, ChevronDown, SwitchCamera } from 'lucide-vue-next'
import { uploadApi, itemsApi, categoriesApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import AuthModal from '~/components/AuthModal.vue'

const router = useRouter()
const { isLoggedIn } = useAuth()

const showAuthPrompt = ref(false)
const showAuthModal = ref(false)
const pendingAction = ref(null)
const pendingEvent = ref(null)

const checkAuth = (actionName, event = null) => {
  if (!isLoggedIn.value) {
    pendingAction.value = actionName
    if (event) pendingEvent.value = event
    showAuthPrompt.value = true
    return false
  }
  return true
}

const handleAuthSuccess = () => {
  showAuthModal.value = false
  if (pendingAction.value === 'submit') submitListing()
  if (pendingAction.value === 'upload') uploadMultiple(pendingEvent.value)
  if (pendingAction.value === 'camera') openCamera()
  pendingAction.value = null
  pendingEvent.value = null
}

const categories = ref([])
const catOpen = ref(false)
const condOpen = ref(false)
const conditions = ['Brand New', 'Like New', 'Good', 'Fair']

const form = ref({ 
  title: '', 
  description: '', 
  price: null, 
  location: '', 
  category: '',
  customCategory: '',
  condition: 'Good',
  type: 'sell', 
  images: [] 
})

useSeoMeta({
  title: 'List an Item | Erranders Barter',
  description: 'Sell or swap your items securely on the Erranders Barter network.',
  ogTitle: 'List an Item | Erranders Barter',
})

const loading = ref(false)
const uploading = ref(false)
const success = ref(false)

onMounted(async () => {
  const { data } = await categoriesApi.fetch()
  if (data) {
    categories.value = data
  }
})

const uploadMultiple = async (e) => {
  if (!checkAuth('upload', e)) return
  const files = Array.from(e.target.files)
  if (!files.length) return
  
  uploading.value = true
  try {
    const promises = files.map(file => uploadApi.image(file))
    const results = await Promise.all(promises)
    
    results.forEach((res, i) => {
      if (res.data?.url) {
        form.value.images.push({
          url: res.data.url,
          isVideo: files[i].type.startsWith('video/')
        })
      }
    })
  } catch (err) {
    alert('Failed to upload some files')
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

// Camera / Video Recording Logic
const cameraOpen = ref(false)
const isRecording = ref(false)
const videoEl = ref(null)
const mediaRecorder = ref(null)
const recordedChunks = ref([])
const currentFacingMode = ref('environment')
let currentStream = null

const openCamera = async () => {
  if (!checkAuth('camera')) return
  cameraOpen.value = true
  await initCamera()
}

const initCamera = async () => {
  try {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop())
    }
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentFacingMode.value },
      audio: true
    })
    if (videoEl.value) {
      videoEl.value.srcObject = currentStream
    }
  } catch (err) {
    alert('Could not access camera/microphone. Please allow permissions.')
    cameraOpen.value = false
  }
}

const flipCamera = async () => {
  currentFacingMode.value = currentFacingMode.value === 'user' ? 'environment' : 'user'
  await initCamera()
}

const closeCamera = () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop())
    currentStream = null
  }
  cameraOpen.value = false
  isRecording.value = false
}

const startRecording = () => {
  recordedChunks.value = []
  mediaRecorder.value = new MediaRecorder(currentStream)
  mediaRecorder.value.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.value.push(e.data)
  }
  mediaRecorder.value.onstop = async () => {
    const blob = new Blob(recordedChunks.value, { type: 'video/webm' })
    const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' })
    
    // Upload the recorded video automatically
    uploading.value = true
    closeCamera()
    
    try {
      const { data, error } = await uploadApi.image(file) // Reusing the same upload endpoint
      if (data && data.url) {
        form.value.images.push({ url: data.url, isVideo: true })
      } else {
        alert(error || 'Video upload failed')
      }
    } catch (err) {
      alert('Error uploading video')
    } finally {
      uploading.value = false
    }
  }
  mediaRecorder.value.start()
  isRecording.value = true
  
  // Auto stop after 15 seconds to keep it short
  setTimeout(() => {
    if (isRecording.value) stopRecording()
  }, 15000)
}

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
  }
}

onBeforeUnmount(() => {
  closeCamera()
})

const submitListing = async () => {
  if (!checkAuth('submit')) return

  loading.value = true
  try {
    if (!form.value.price) {
      form.value.type = 'swap'
    } else {
      form.value.type = 'sell'
    }
    
    const finalCategory = form.value.category === 'Other' ? form.value.customCategory : form.value.category

    const { data, error } = await itemsApi.create({
      ...form.value,
      category: finalCategory,
      images: form.value.images.map(m => m.url) // Just send urls to backend
    })
    
    if (error) {
      alert(error)
    } else {
      success.value = true
      setTimeout(() => router.push('/explore'), 2000)
    }
  } catch (err) {
    alert('Failed to list item. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
