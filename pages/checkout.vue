<template>
  <div class="min-h-screen bg-slate-50 py-20 px-4">
    <div class="bg-white p-6 rounded-3xl shadow-xl max-w-md mx-auto">
      <h2 class="text-2xl font-black text-slate-900 mb-6">Secure Checkout</h2>
      
      <div v-if="loading" class="text-center py-10 text-slate-500 font-bold">Loading item...</div>
      <div v-else-if="!item" class="text-center py-10 text-red-500 font-bold">Item not found.</div>
      
      <div v-else>
        <div class="flex justify-between items-center bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
          <div>
            <h3 class="font-bold text-slate-800">{{ item.title }}</h3>
            <p class="text-sm text-slate-500">Seller: {{ item.sellerId?.firstName || 'Unknown' }}</p>
          </div>
          <span class="font-black text-blue-600 text-lg">₦{{ item.price }}</span>
        </div>
        <div class="space-y-3 mb-6">
          <label class="font-bold text-slate-700 text-sm block">How are you getting this?</label>
          <div class="flex items-center gap-3 p-3 border-2 border-blue-600 rounded-xl bg-blue-50 cursor-pointer">
            <div class="flex-1">
              <h4 class="font-bold text-slate-900 text-sm">Self Pickup</h4>
              <p class="text-xs text-slate-500">Meet with the seller</p>
            </div>
            <span class="font-bold text-sm">Free</span>
          </div>
        </div>
        <div class="bg-green-50 border border-green-100 p-3 rounded-xl flex gap-3 items-start mb-6">
          <p class="text-xs text-green-800 font-medium">Your payment is held securely in Barter Escrow. The seller does not get paid until you confirm delivery.</p>
        </div>
        <button @click="initiateEscrow" :disabled="initiating" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 disabled:opacity-50">
          {{ initiating ? 'Processing...' : 'Pay ₦' + item.price + ' Securely' }}
        </button>
        <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const item = ref(null)
const loading = ref(true)
const initiating = ref(false)
const error = ref('')

const fetchItem = async () => {
  if (!route.query.itemId) {
    error.value = 'No item ID provided'
    loading.value = false
    return
  }
  
  try {
    const data = await $fetch(`http://localhost:3005/api/v1/items/${route.query.itemId}`)
    item.value = data
  } catch (err) {
    error.value = 'Failed to load item details.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const initiateEscrow = async () => {
  initiating.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('barter_token')
    if (!token) {
      router.push('/login')
      return
    }
    
    await $fetch('http://localhost:3005/api/v1/escrow/initiate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        sellerId: item.value.sellerId._id || item.value.sellerId,
        itemId: item.value._id,
        amount: item.value.price
      }
    })
    
    // Redirect to escrow dashboard or success page
    router.push('/escrow')
  } catch (err) {
    error.value = err.data?.message || 'Failed to initiate checkout.'
    console.error(err)
  } finally {
    initiating.value = false
  }
}

onMounted(() => {
  fetchItem()
})
</script>