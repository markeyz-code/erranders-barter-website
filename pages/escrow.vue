<template>
  <main class="min-h-screen bg-white pt-24 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      <NuxtLink to="/" class="text-brand-600 font-bold mb-4 inline-block">← Back Home</NuxtLink>
      <h1 class="text-4xl font-extrabold text-slate-900 mb-4">My Escrow Transactions</h1>
      <p class="text-lg text-slate-600 mb-8 border-l-4 border-brand-600 pl-4">Manage your ongoing trades and payments.</p>
      
      <div v-if="loading" class="text-center py-20 text-slate-500 font-bold">Loading transactions...</div>
      
      <div v-else-if="transactions.length === 0" class="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
        <h2 class="text-2xl font-bold text-slate-400 mb-2">No active transactions</h2>
        <NuxtLink to="/explore" class="text-brand-600 font-bold hover:underline">Start Trading</NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="tx in transactions" :key="tx._id" class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID: {{ tx._id }}</p>
              <h3 class="font-bold text-slate-900 text-lg">Item ID: {{ tx.itemId }}</h3>
            </div>
            <div class="text-right">
              <span class="font-black text-xl text-brand-600">₦{{ tx.amount }}</span>
              <div class="mt-1">
                <span v-if="tx.status === 'held_in_escrow'" class="px-3 py-1 bg-yellow-100 text-yellow-700 font-bold rounded-full text-xs">Awaiting Delivery</span>
                <span v-else-if="tx.status === 'released'" class="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-xs">Completed</span>
                <span v-else-if="tx.status === 'disputed'" class="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs">Disputed</span>
              </div>
            </div>
          </div>
          
          <div v-if="tx.status === 'held_in_escrow'" class="flex gap-3 mt-6 pt-6 border-t border-slate-100">
            <button @click="releaseFunds(tx._id)" :disabled="actionLoading === tx._id" class="flex-1 bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50">
              {{ actionLoading === tx._id ? 'Processing...' : 'Confirm Delivery & Release Funds' }}
            </button>
            <button @click="dispute(tx._id)" :disabled="actionLoading === tx._id" class="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50">
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { escrowApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { isLoggedIn } = useAuth()
const transactions = ref([])
const loading = ref(true)
const actionLoading = ref(null)

const fetchTransactions = async () => {
  try {
    if (!isLoggedIn.value) {
      router.push('/login')
      return
    }
    const { data, error } = await escrowApi.myTransactions()
    if (!error) {
       transactions.value = data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const releaseFunds = async (id) => {
  actionLoading.value = id
  try {
    const { error } = await escrowApi.release(id)
    if (error) {
      alert(error)
    } else {
      await fetchTransactions()
    }
  } catch (err) {
    alert('Failed to release funds.')
  } finally {
    actionLoading.value = null
  }
}

const dispute = async (id) => {
  actionLoading.value = id
  try {
    const { error } = await escrowApi.dispute(id)
    if (error) {
      alert(error)
    } else {
      await fetchTransactions()
    }
  } catch (err) {
    alert('Failed to raise dispute.')
  } finally {
    actionLoading.value = null
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>