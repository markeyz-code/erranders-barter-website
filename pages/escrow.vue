<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      <NuxtLink to="/" class="text-brand-600 font-bold mb-4 inline-block">← Back Home</NuxtLink>
      <h1 class="text-4xl font-extrabold text-slate-900 mb-4">My Escrow Transactions</h1>
      <p class="text-lg text-slate-600 mb-8 border-l-4 border-brand-600 pl-4">Manage your ongoing trades and payments.</p>
      
      <div v-if="loading" class="text-center py-20 text-slate-500 font-bold">Loading transactions...</div>
      
      <div v-else-if="transactions.length === 0" class="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
        <h2 class="text-2xl font-bold text-slate-400 mb-2">No active transactions</h2>
        <NuxtLink to="/explore" class="text-brand-600 font-bold hover:underline">Start Trading</NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="tx in transactions" :key="tx._id" class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID: {{ tx._id }}</p>
              <h3 class="font-bold text-slate-900 text-lg">Item ID: {{ tx.itemId }}</h3>
            </div>
            <div class="text-right">
              <span class="font-black text-xl text-brand-600">₦{{ Number(tx.amount || 0).toLocaleString() }}</span>
              <div v-if="tx.proposedDeliveryFee > 0" class="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <span class="text-xs font-bold text-amber-700">Current Offer: ₦{{ tx.proposedDeliveryFee.toLocaleString() }} (Delivery)</span>
              </div>
              <div class="mt-2">
                <span v-if="tx.status === 'held_in_escrow'" class="px-3 py-1 bg-yellow-100 text-yellow-700 font-bold rounded-full text-sm">Awaiting Delivery</span>
                <span v-else-if="tx.status === 'released'" class="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">Completed</span>
                <span v-else-if="tx.status === 'disputed'" class="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-sm">Disputed</span>
              </div>
            </div>
          </div>
          
          <!-- Negotiation Section -->
          <div v-if="tx.status === 'held_in_escrow' && tx.proposedDeliveryFee > 0" class="mt-4 pt-4 border-t border-amber-100 bg-amber-50/50 -mx-6 px-6 pb-4">
            <h4 class="text-xs font-bold text-amber-800 uppercase tracking-widest mb-3">Delivery Negotiation</h4>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="relative flex-1">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold">₦</span>
                <input v-model="counterAmounts[tx._id]" type="number" placeholder="Enter counter offer..." class="w-full bg-white border border-amber-200 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-bold text-gray-900 text-sm" />
              </div>
              <button @click="counterNegotiation(tx._id)" :disabled="actionLoading === tx._id || !counterAmounts[tx._id]" class="bg-amber-100 text-amber-800 border border-amber-200 font-bold px-6 py-3 rounded-xl hover:bg-amber-200 transition-colors disabled:opacity-50 text-sm flex-shrink-0">
                {{ actionLoading === tx._id ? '...' : 'Send Counter Offer' }}
              </button>
              <button @click="acceptNegotiation(tx._id)" :disabled="actionLoading === tx._id" class="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 shadow-sm text-sm flex-shrink-0">
                {{ actionLoading === tx._id ? '...' : 'Accept Offer' }}
              </button>
            </div>
          </div>

          <!-- Escrow Core Actions -->
          <div v-if="tx.status === 'held_in_escrow'" class="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-100">
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
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { escrowApi } from '~/composables/useApi'


const router = useRouter()
const { isLoggedIn } = useAuth()
const transactions = ref([])
const loading = ref(true)
const actionLoading = ref(null)
const counterAmounts = ref({})

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
      useCustomToast().showToast({ title: 'Notice', message: error, toastType: "error" })
    } else {
      await fetchTransactions()
    }
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: 'Failed to release funds.', toastType: "error" })
  } finally {
    actionLoading.value = null
  }
}

const acceptNegotiation = async (id) => {
  actionLoading.value = id
  try {
    const { error } = await escrowApi.acceptNegotiation(id)
    if (error) {
      useCustomToast().showToast({ title: 'Notice', message: error, toastType: "error" })
    } else {
      useCustomToast().showToast({ title: 'Success', message: 'Rider bid accepted!', toastType: "success" })
      await fetchTransactions()
    }
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: 'Failed to accept bid.', toastType: "error" })
  } finally {
    actionLoading.value = null
  }
}

const counterNegotiation = async (id) => {
  const amount = counterAmounts.value[id]
  if (!amount) return

  actionLoading.value = id
  try {
    const { error } = await escrowApi.counterNegotiation(id, Number(amount))
    if (error) {
      useCustomToast().showToast({ title: 'Notice', message: error, toastType: "error" })
    } else {
      useCustomToast().showToast({ title: 'Success', message: 'Counter offer sent to rider!', toastType: "success" })
      counterAmounts.value[id] = ''
      await fetchTransactions()
    }
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: 'Failed to send counter offer.', toastType: "error" })
  } finally {
    actionLoading.value = null
  }
}

const dispute = async (id) => {
  actionLoading.value = id
  try {
    const { error } = await escrowApi.dispute(id)
    if (error) {
      useCustomToast().showToast({ title: 'Notice', message: error, toastType: "error" })
    } else {
      await fetchTransactions()
    }
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: 'Failed to raise dispute.', toastType: "error" })
  } finally {
    actionLoading.value = null
  }
}

let pollingInterval;

onMounted(() => {
  fetchTransactions()
  // Poll every 3 seconds for live counter-offer updates
  pollingInterval = setInterval(() => {
    if (!actionLoading.value) fetchTransactions();
  }, 3000);
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
})
</script>