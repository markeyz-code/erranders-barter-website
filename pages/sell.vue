
<template>
  <main class="min-h-screen bg-white pb-10">
    <div class="p-4 flex items-center gap-3 border-b border-gray-100">
      <NuxtLink to="/" class="text-gray-600 font-bold">← Back</NuxtLink>
      <h1 class="text-xl font-black">List an Item</h1>
    </div>
    
    <div v-if="success" class="m-4 bg-green-50 text-green-700 p-4 rounded-xl font-bold border border-green-200">
      Item listed successfully! Redirecting...
    </div>

    <form @submit.prevent="submitListing" class="p-4 space-y-4 max-w-md mx-auto">
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1">Title</label>
        <input v-model="form.title" required type="text" placeholder="e.g. Mini Fridge" class="w-full border rounded-xl p-3 bg-slate-50" />
      </div>
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1">Description</label>
        <textarea v-model="form.description" rows="3" class="w-full border rounded-xl p-3 bg-slate-50"></textarea>
      </div>
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1">Price (₦)</label>
        <input v-model="form.price" type="number" placeholder="Leave blank if Swap" class="w-full border rounded-xl p-3 bg-slate-50" />
      </div>
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1">Location</label>
        <input v-model="form.location" required type="text" placeholder="e.g. Mellanby Hall" class="w-full border rounded-xl p-3 bg-slate-50" />
      </div>
      
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1">Images</label>
        <input type="file" accept="image/*" @change="uploadImage" class="w-full border rounded-xl p-3 bg-slate-50" />
        <div v-if="uploading" class="text-sm text-blue-500 font-bold mt-1">Uploading...</div>
        <div v-if="form.images.length" class="flex gap-2 mt-2">
          <img v-for="img in form.images" :key="img" :src="img" class="w-16 h-16 object-cover rounded-xl border" />
        </div>
      </div>
      
      <button type="submit" :disabled="loading || uploading" class="w-full py-4 rounded-xl text-white font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors mt-6">
        {{ loading ? 'Posting...' : 'Post Item Securely' }}
      </button>
    </form>
  </main>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadApi, itemsApi } from '~/composables/useApi'

const router = useRouter()
const form = ref({ title: '', description: '', price: null, location: '', type: 'sell', images: [] })
const loading = ref(false)
const uploading = ref(false)
const success = ref(false)

const uploadImage = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  uploading.value = true
  try {
    const { data, error } = await uploadApi.image(file)
    
    if (error) {
      alert(error)
    } else if (data && data.url) {
      form.value.images.push(data.url)
    }
  } catch (err) {
    alert('Failed to upload image')
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

const submitListing = async () => {
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
    alert('Failed to list item. Are you logged in?')
  } finally {
    loading.value = false
  }
}
</script>
