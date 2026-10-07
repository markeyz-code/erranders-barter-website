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
              <button class="bg-white text-brand-600 font-bold py-3 px-8 rounded-xl hover:bg-brand-50 transition-colors shadow-sm">
                Withdraw
              </button>
              <button class="bg-brand-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-800 transition-colors border border-brand-500">
                History
              </button>
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
  </div>
</template>

<script setup>
import { Wallet, ShieldCheck, Clock } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'


definePageMeta({ layout: 'dashboard' })

const { token } = useAuth()
const stats = ref(null)
const loading = ref(true)

onMounted(async () => {
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
})
</script>
