<template>
  <main class="min-h-screen bg-slate-50 pb-20">
    <div class="max-w-5xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/" class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">List Item for Swap</h1>
          <p class="text-slate-500 font-medium">Trade what you have for what you need. No cash required.</p>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Form Section -->
        <div class="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-4 sm:p-6 sm:p-4 sm:p-8">
          <div v-if="success" class="mb-8 bg-green-50 text-green-700 p-4 sm:p-6 rounded-2xl font-bold border border-green-200 flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-lg">Item listed successfully!</p>
              <p class="text-sm font-medium opacity-80">Taking you to the explore page to find matches...</p>
            </div>
          </div>

          <form v-else @submit.prevent="submitListing" class="space-y-6">
            <!-- Basic Details -->
            <div class="space-y-4">
              <div class="relative group">
                <label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">What do you have?</label>
                <input v-model="form.title" required type="text" placeholder="e.g. MacBook Air M1, 256GB" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 focus:" />
              </div>

              <div class="relative group">
                <label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">What do you want in return?</label>
                <input v-model="form.swapPreference" required type="text" placeholder="e.g. Gaming PC, iPhone 13, or equivalent value" class="w-full bg-orange-50 border border-orange-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-orange-900 focus:bg-white focus:border-orange-500 focus:placeholder:text-orange-300" />
                <p class="text-xs font-medium text-slate-500 mt-2 ml-1">Be specific! The better you describe what you want, the faster you'll match.</p>
              </div>
            </div>

            <!-- Description -->
            <div class="relative group">
              <label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">Item Condition & Details</label>
              <textarea v-model="form.description" rows="4" placeholder="Describe any scratches, how long you've used it, and why you're swapping..." class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:resize-none"></textarea>
            </div>

            <!-- Location -->
            <div class="relative group">
              <label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">Your Location</label>
              <input v-model="form.location" required type="text" placeholder="e.g. Moremi Hall, Room 102" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 focus:" />
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-xs font-black text-slate-400 mb-2">Upload Clear Photos</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div v-for="(img, idx) in form.images" :key="idx" class="aspect-square rounded-2xl border border-slate-200 overflow-hidden relative group">
                  <img :src="img" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button @click.prevent="form.images.splice(idx, 1)" class="w-8 h-8 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center text-white backdrop-blur transition-colors">
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <label v-if="form.images.length < 4" class="aspect-square rounded-2xl border border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                  <div class="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-brand-100 flex items-center justify-center text-slate-500 group-hover:text-brand-600 transition-colors">
                    <Upload v-if="!uploading" class="w-5 h-5" />
                    <Loader2 v-else class="w-5 h-5 animate-spin" />
                  </div>
                  <span class="text-xs font-bold text-slate-500 group-hover:text-brand-600">{{ uploading ? 'Uploading...' : 'Add Photos' }}</span>
                  <input type="file" accept="image/*" multiple class="hidden" @change="uploadImage" :disabled="uploading" />
                </label>
              </div>
            </div>

            <button type="submit" :disabled="loading || uploading || !form.title || !form.swapPreference" class="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200/50 disabled:opacity-50 flex justify-center items-center gap-2">
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <ArrowRightLeft v-else class="w-5 h-5" />
              {{ loading ? 'Listing Item...' : 'List Item for Swap' }}
            </button>
          </form>
        </div>

        <!-- How It Works Sidebar Section -->
        <div class="w-full lg:w-1/3">
          <div class="bg-brand-50 rounded-[2rem] p-4 sm:p-8 text-slate-900 sticky top-28 border border-brand-100">
            <h3 class="text-xl font-black mb-2 flex items-center gap-2 text-brand-900">
              <Sparkles class="w-5 h-5 text-brand-600" /> Swap Flow Explained
            </h3>
            <p class="text-slate-600 font-medium mb-8 text-sm leading-relaxed">
              Don't have cash? No problem. Barter lets you trade what you don't need for what you want.
            </p>

            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 flex-shrink-0 shadow-sm">1</div>
                <div>
                  <h4 class="font-bold text-slate-900 mb-1">List Your Item</h4>
                  <p class="text-sm text-slate-600 font-medium">Upload photos of what you have and explicitly state what you want in exchange.</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 flex-shrink-0 shadow-sm">2</div>
                <div>
                  <h4 class="font-bold text-slate-900 mb-1">Get Matched</h4>
                  <p class="text-sm text-slate-600 font-medium">Other users will see your listing. If they have what you want, they'll initiate a chat.</p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 flex-shrink-0 shadow-sm">3</div>
                <div>
                  <h4 class="font-bold text-slate-900 mb-1">Chat & Trade</h4>
                  <p class="text-sm text-slate-600 font-medium">Discuss the condition of both items securely in-app and agree on a meeting point on campus to swap!</p>
                </div>
              </div>
            </div>

            <div class="mt-8 p-4 bg-white rounded-2xl border border-brand-100 shadow-sm">
              <div class="flex items-start gap-3">
                <ShieldCheck class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p class="text-xs font-medium text-slate-600">Always meet in open, public places on campus (like faculty hubs or halls) when exchanging physical items.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ArrowLeft, ArrowRightLeft, Upload, X, Check, Loader2, Sparkles, ShieldCheck } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadApi, itemsApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { user } = useAuth()
const form = ref({ title: '', description: '', swapPreference: '', price: 0, location: '', type: 'swap', images: [] })

useSeoMeta({
  title: 'Swap an Item | Erranders Barter',
  description: 'List your items to swap securely on the Erranders Barter network.',
  ogTitle: 'Swap an Item | Erranders Barter',
})

const loading = ref(false)
const uploading = ref(false)
const success = ref(false)

const uploadImage = async (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return
  
  uploading.value = true
  try {
    for (const file of files) {
      if (form.value.images.length >= 4) break
      const { data, error } = await uploadApi.image(file)
      if (error) {
        alert(error)
      } else if (data && data.url) {
        form.value.images.push(data.url)
      }
    }
  } catch (err) {
    alert('Failed to upload image')
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

const submitListing = async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const { data, error } = await itemsApi.create(form.value)
    
    if (error) {
      alert(error)
    } else {
      success.value = true
      setTimeout(() => router.push('/explore'), 1500)
    }
  } catch (err) {
    alert('Failed to list item for swap.')
  } finally {
    loading.value = false
  }
}
</script>
