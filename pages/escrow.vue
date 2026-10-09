<template>
  <main class="min-h-screen bg-slate-50 pb-16 font-sans">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Escrow Dashboard</h1>
            <p class="text-sm font-medium text-slate-500">Secure trades & safe deliveries</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="grid gap-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-3xl p-6 h-48 animate-pulse shadow-sm border border-slate-100">
          <div class="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div class="h-8 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div class="flex gap-4">
            <div class="h-10 bg-slate-200 rounded w-1/3"></div>
            <div class="h-10 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="transactions.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert class="w-10 h-10 text-brand-500" />
        </div>
        <h2 class="text-3xl font-black text-slate-900 mb-3 tracking-tight">No Active Trades</h2>
        <p class="text-slate-500 text-lg mb-8 max-w-md">Your escrow dashboard is clean. Start a new trade to see it protected here.</p>
        <NuxtLink to="/explore" class="bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-brand-700 transition-all hover:scale-105 hover:shadow-xl hover:shadow-brand-500/20 active:scale-95">
          Explore Marketplace
        </NuxtLink>
      </div>

      <!-- Transactions List -->
      <div v-else class="grid gap-6">
        <TransitionGroup name="list">
          <div v-for="tx in transactions" :key="tx._id" class="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            
            <!-- Header Section -->
            <div class="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100">
              <div class="flex items-start gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center shrink-0 border border-brand-200/50">
                  <Package class="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" :class="getStatusBadge(tx).class">
                      <component :is="getStatusBadge(tx).icon" class="w-3 h-3 inline-block mr-1 -mt-0.5" />
                      {{ getStatusBadge(tx).text }}
                    </span>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {{ tx._id.slice(-6) }}</span>
                  </div>
                  <h3 class="text-xl font-black text-slate-900">Item: {{ tx.itemId.slice(-6) }}</h3>
                </div>
              </div>
              <div class="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none">
                <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                <span class="font-black text-4xl tracking-tighter text-slate-900">₦{{ Number(tx.amount || 0).toLocaleString() }}</span>
              </div>
            </div>

            <!-- Body Section -->
            <div class="p-6 sm:p-8 bg-slate-50/50">
              
              <!-- State: Negotiation -->
              <div v-if="tx.status === 'held_in_escrow' && tx.proposedDeliveryFee > 0" class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-3xl p-6 sm:p-8 shadow-inner relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                <div class="absolute -left-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
                
                <div class="relative z-10">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Handshake class="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 class="text-lg font-black text-amber-900 tracking-tight">Delivery Offer Received!</h4>
                      <p class="text-sm font-bold text-amber-700/80">An errand ninja wants to negotiate the delivery fee.</p>
                    </div>
                  </div>
                  
                  <div class="flex flex-col sm:flex-row items-center gap-4 bg-white/60 p-4 rounded-2xl border border-amber-100 mb-6 backdrop-blur-sm">
                    <div class="flex-1 text-center sm:text-left">
                      <span class="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">Ninja's Offer</span>
                      <span class="text-3xl font-black text-amber-900">₦{{ tx.proposedDeliveryFee.toLocaleString() }}</span>
                    </div>
                    <div class="hidden sm:block w-px h-12 bg-amber-200/50"></div>
                    <div class="flex-1 w-full relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-black">₦</span>
                      <input v-model="counterAmounts[tx._id]" type="number" placeholder="Your counter offer" class="w-full bg-white border-2 border-amber-100 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 font-black text-amber-900 text-lg transition-all" />
                    </div>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3">
                    <button @click="acceptNegotiation(tx._id)" :disabled="actionLoading === tx._id" class="flex-1 bg-amber-500 text-white font-black px-6 py-4 rounded-xl hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 active:scale-95 text-center flex items-center justify-center gap-2">
                      <CheckCircle2 class="w-5 h-5" v-if="actionLoading !== tx._id" />
                      <Loader2 class="w-5 h-5 animate-spin" v-else />
                      Accept Offer
                    </button>
                    <button @click="counterNegotiation(tx._id)" :disabled="actionLoading === tx._id || !counterAmounts[tx._id]" class="flex-1 bg-white text-amber-600 border-2 border-amber-200 font-black px-6 py-4 rounded-xl hover:bg-amber-50 transition-all hover:-translate-y-0.5 disabled:opacity-50 active:scale-95 text-center flex items-center justify-center">
                      <Loader2 class="w-5 h-5 animate-spin mr-2" v-if="actionLoading === tx._id" />
                      {{ actionLoading === tx._id ? 'Sending...' : 'Send Counter' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- State: Delivery Active (Ninja Accepted) -->
              <div v-else-if="tx.status === 'held_in_escrow' && tx.proposedDeliveryFee === 0 && tx.erranderOrderId" class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-inner relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Navigation class="w-48 h-48 text-blue-500" />
                </div>
                
                <div class="relative z-10 flex-1">
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-black text-sm mb-4">
                    <MapPin class="w-4 h-4 animate-bounce" /> Active Delivery
                  </div>
                  <h4 class="text-2xl font-black text-slate-900 tracking-tight mb-2">Ninja is on the way!</h4>
                  <p class="text-slate-600 font-medium text-lg max-w-md">Your delivery offer has been accepted. The errand ninja is currently executing this delivery.</p>
                </div>

                <div class="relative z-10 w-full md:w-auto shrink-0 flex flex-col gap-3">
                  <button @click="releaseFunds(tx._id)" :disabled="actionLoading === tx._id" class="w-full md:w-auto bg-brand-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-brand-700 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3">
                    <Unlock class="w-5 h-5" v-if="actionLoading !== tx._id" />
                    <Loader2 class="w-5 h-5 animate-spin" v-else />
                    Confirm Receipt & Release Funds
                  </button>
                  <button @click="dispute(tx._id)" :disabled="actionLoading === tx._id" class="w-full md:w-auto bg-white text-red-500 border-2 border-red-100 font-bold px-8 py-3 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50 active:scale-95 flex items-center justify-center">
                    <AlertOctagon class="w-4 h-4 mr-2" v-if="actionLoading !== tx._id" />
                    Report Issue
                  </button>
                </div>
              </div>

              <!-- State: Standard / Default Escrow (No negotiation yet, or no errander) -->
              <div v-else-if="tx.status === 'held_in_escrow'" class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 class="text-lg font-black text-slate-900 mb-1">Funds are safely held in escrow</h4>
                  <p class="text-slate-500 font-medium">Wait until you receive the item to release the payment.</p>
                </div>
                <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <button @click="releaseFunds(tx._id)" :disabled="actionLoading === tx._id" class="flex-1 md:flex-none bg-brand-600 text-white font-black px-8 py-4 rounded-xl hover:bg-brand-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2">
                    <Unlock class="w-5 h-5" v-if="actionLoading !== tx._id" />
                    <Loader2 class="w-5 h-5 animate-spin" v-else />
                    Release Funds
                  </button>
                  <button @click="dispute(tx._id)" :disabled="actionLoading === tx._id" class="flex-1 md:flex-none bg-white text-slate-600 border border-slate-200 font-bold px-6 py-4 rounded-xl hover:bg-slate-50 hover:text-red-600 transition-colors disabled:opacity-50 active:scale-95">
                    Dispute
                  </button>
                </div>
              </div>

              <!-- State: Completed -->
              <div v-else-if="tx.status === 'released'" class="bg-green-50 border border-green-100 rounded-3xl p-6 sm:p-8 flex items-center gap-6">
                <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 class="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4 class="text-xl font-black text-green-900 tracking-tight mb-1">Transaction Completed</h4>
                  <p class="text-green-700/80 font-medium">Funds have been successfully released to the seller.</p>
                </div>
              </div>

              <!-- State: Disputed -->
              <div v-else-if="tx.status === 'disputed'" class="bg-red-50 border border-red-100 rounded-3xl p-6 sm:p-8 flex items-center gap-6">
                <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertOctagon class="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h4 class="text-xl font-black text-red-900 tracking-tight mb-1">Transaction Disputed</h4>
                  <p class="text-red-700/80 font-medium">This transaction is currently under review by support.</p>
                </div>
              </div>

            </div>
          </div>
        </TransitionGroup>
      </div>

    </div>
  </main>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { escrowApi } from '~/composables/useApi'
import { 
  ArrowLeft, ShieldAlert, Package, Lock, CheckCircle2, AlertOctagon, 
  Handshake, Navigation, MapPin, Unlock, Loader2 
} from 'lucide-vue-next'

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

const getStatusBadge = (tx) => {
  if (tx.status === 'held_in_escrow') {
    if (tx.proposedDeliveryFee > 0) return { text: 'Negotiating', class: 'bg-amber-100 text-amber-700', icon: Handshake }
    if (tx.erranderOrderId) return { text: 'In Transit', class: 'bg-blue-100 text-blue-700', icon: Navigation }
    return { text: 'Secured', class: 'bg-yellow-100 text-yellow-700', icon: Lock }
  }
  if (tx.status === 'released') return { text: 'Completed', class: 'bg-green-100 text-green-700', icon: CheckCircle2 }
  if (tx.status === 'disputed') return { text: 'Disputed', class: 'bg-red-100 text-red-700', icon: AlertOctagon }
  return { text: tx.status, class: 'bg-slate-100 text-slate-700', icon: Package }
}

const releaseFunds = async (id) => {
  actionLoading.value = id
  try {
    const { error } = await escrowApi.release(id)
    if (error) {
      useCustomToast().showToast({ title: 'Notice', message: error, toastType: "error" })
    } else {
      useCustomToast().showToast({ title: 'Success', message: 'Funds released successfully!', toastType: "success" })
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
      useCustomToast().showToast({ title: 'Notice', message: 'Dispute raised.', toastType: "info" })
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

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
