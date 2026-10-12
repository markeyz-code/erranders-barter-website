<template>
  <div class="p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">Escrow Wallet</h1>
        <p class="text-slate-500 font-medium text-xs sm:text-sm">Manage your funds safely held in escrow.</p>
      </div>

      <div v-if="loading" class="animate-pulse">
        <div class="bg-slate-100 h-36 rounded-xl mb-6"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-slate-100 h-20 rounded-xl"></div>
          <div class="bg-slate-100 h-20 rounded-xl"></div>
        </div>
      </div>

      <div v-else>
        <!-- Balance Card -->
        <div class="bg-brand-600 rounded-xl p-6 sm:p-7 text-white mb-6 relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-brand-100 font-semibold uppercase tracking-wider text-xs mb-1.5 flex items-center gap-1.5">
              <Wallet class="w-4 h-4" /> Available Balance
            </p>
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
              ₦{{ (stats?.escrowBalance || 0).toLocaleString() }}
            </h2>
            <div class="flex gap-3">
              <button @click="handleWithdraw" class="bg-white text-brand-600 font-bold py-2 px-5 rounded-lg hover:bg-brand-50 text-sm transition-colors">
                Withdraw
              </button>
              <NuxtLink to="/escrow" class="inline-block bg-brand-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-brand-800 text-sm transition-colors border border-brand-500">
                History
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Quick Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-sm mb-0.5">Secure Escrow</h3>
              <p class="text-xs text-slate-500 font-medium">Funds are held safely until both parties confirm the trade.</p>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div class="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
              <Clock class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-sm mb-0.5">Fast Withdrawals</h3>
              <p class="text-xs text-slate-500 font-medium">Withdraw to your local bank account instantly after trade completion.</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Withdraw Modal -->
    <div v-if="isWithdrawModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="isWithdrawModalOpen = false"></div>
      <div class="relative bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        <div class="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-6">
          <ArrowDownToLine class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-black text-slate-900 mb-2">Withdraw Funds</h2>
        <p class="text-slate-500 mb-6">Enter the amount you wish to withdraw to your bank account.</p>
        
        <div class="w-full text-left mb-6 relative">
          <label class="block text-sm font-bold text-slate-700 mb-2">Amount (₦)</label>
          <span class="absolute left-4 top-[38px] font-black text-slate-400">₦</span>
          <input 
            v-model="withdrawAmount" 
            type="number" 
            class="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-500" 
            placeholder="0"
          />
          <p class="text-xs text-slate-400 mt-2 font-medium flex justify-between">
            <span>Available: ₦{{ (stats?.walletBalance || 0).toLocaleString() }}</span>
            <button @click="withdrawAmount = stats?.walletBalance || 0" class="text-brand-600 font-bold hover:underline">Max</button>
          </p>
        </div>
        
        <div class="w-full flex gap-3">
          <button @click="isWithdrawModalOpen = false" class="flex-1 font-bold text-slate-500 py-3 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="submitWithdrawal" :disabled="isWithdrawing || !withdrawAmount || withdrawAmount <= 0 || withdrawAmount > (stats?.walletBalance || 0)" class="flex-1 bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50">
            {{ isWithdrawing ? 'Processing...' : 'Withdraw' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Wallet, ShieldCheck, Clock, ArrowDownToLine } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard' })

const { token } = useAuth()
const stats = ref(null)
const loading = ref(true)
const { showToast } = useToast()

const isWithdrawModalOpen = ref(false)
const withdrawAmount = ref('')
const isWithdrawing = ref(false)

const handleWithdraw = () => {
  isWithdrawModalOpen.value = true
}

const submitWithdrawal = async () => {
  if (withdrawAmount.value <= 0 || withdrawAmount.value > (stats.value?.walletBalance || 0)) return
  
  isWithdrawing.value = true
  try {
    const res = await fetch(`${useRuntimeConfig().public.apiBaseUrl}/users/me/withdraw`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: Number(withdrawAmount.value) })
    })
    
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Withdrawal failed')
    
    showToast('Success', `Successfully withdrew ₦${Number(withdrawAmount.value).toLocaleString()}`, 'success')
    isWithdrawModalOpen.value = false
    withdrawAmount.value = ''
    await fetchStats() // Refresh stats
  } catch (e) {
    showToast('Error', e.message, 'error')
  } finally {
    isWithdrawing.value = false
  }
}

const fetchStats = async () => {
  try {
    const res = await fetch(`${useRuntimeConfig().public.apiBaseUrl}/users/me/stats`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const data = await res.json()
    if (res.ok) {
      stats.value = data
    }
  } catch (err) {
    console.error('Failed to fetch wallet stats:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>
