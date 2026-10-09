<template>
  <div class="p-4 md:p-4 sm:p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-10">
        <h1 class="text-3xl font-black text-slate-900 mb-2">Escrow Wallet</h1>
        <p class="text-slate-500 font-medium">Manage your funds safely held in escrow.</p>
      </div>

      <div v-if="loading" class="animate-pulse">
        <div class="bg-slate-100 h-48 rounded-3xl mb-8"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-100 h-24 rounded-3xl"></div>
          <div class="bg-slate-100 h-24 rounded-3xl"></div>
        </div>
      </div>

      <div v-else>
        <!-- Balance Card -->
        <div class="bg-brand-600 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-xl shadow-brand-200 relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-brand-100 font-bold uppercase  text-sm mb-2 flex items-center gap-2">
              <Wallet class="w-5 h-5" /> Available Balance
            </p>
            <h2 class="text-5xl md:text-6xl font-black tracking-tight mb-8">
              ₦{{ (stats?.escrowBalance || 0).toLocaleString() }}
            </h2>
            <div class="flex gap-4">
              <button @click="handleWithdraw" class="bg-white text-brand-600 font-bold py-3 px-8 rounded-xl hover:bg-brand-50 transition-colors shadow-sm">
                Withdraw
              </button>
              <NuxtLink to="/escrow" class="inline-block bg-brand-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-800 transition-colors border border-brand-500">
                History
              </NuxtLink>
            </div>
          </div>
          <!-- Decorative Background -->
          <div class="absolute -right-20 -bottom-40 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-50"></div>
          <div class="absolute -right-10 -top-20 w-64 h-64 bg-brand-400 rounded-full blur-3xl opacity-40"></div>
        </div>

        <!-- Quick Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 mb-1">Secure Escrow</h3>
              <p class="text-sm text-slate-500 font-medium">Funds are held safely until both parties confirm the trade.</p>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
              <Clock class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 mb-1">Fast Withdrawals</h3>
              <p class="text-sm text-slate-500 font-medium">Withdraw to your local bank account instantly after a trade completes.</p>
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
