<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">My Trades</h1>
          <p class="text-slate-500 font-medium text-xs sm:text-sm">Track your active, pending, and completed transactions.</p>
        </div>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-slate-100 p-5 rounded-xl animate-pulse h-24"></div>
      </div>

      <div v-else-if="!trades || trades.length === 0" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="flex flex-col items-center justify-center p-8 sm:p-10 text-center">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <RefreshCcw class="w-8 h-8 text-slate-300" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No Trades Found</h3>
          <p class="text-slate-500 text-sm max-w-sm mb-6">
            You haven't initiated any trades yet. Start exploring items or list something to get started!
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink to="/explore" class="bg-brand-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-brand-700 text-sm transition-colors">
              Explore Deals
            </NuxtLink>
            <NuxtLink to="/sell" class="bg-slate-100 text-slate-700 font-bold py-2.5 px-5 rounded-lg hover:bg-slate-200 text-sm transition-colors">
              List an Item
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div v-for="trade in trades" :key="trade._id" class="bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-300 transition-colors">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider" 
                      :class="{'bg-yellow-50 text-yellow-600': trade.status === 'held_in_escrow', 'bg-emerald-50 text-emerald-600': trade.status === 'released', 'bg-red-50 text-red-600': trade.status === 'disputed'}">
                  {{ trade.status.replace(/_/g, ' ') }}
                </span>
                <span class="text-xs font-medium text-slate-400">{{ new Date(trade.createdAt).toLocaleDateString() }}</span>
              </div>
              <h4 class="font-bold text-base text-slate-900 mb-0.5">Trade #{{ trade._id.slice(-6).toUpperCase() }}</h4>
              <p class="text-xs font-medium text-slate-500">Amount: ₦{{ trade.amount.toLocaleString() }}</p>
            </div>
            <NuxtLink to="/escrow" class="text-brand-600 font-bold hover:text-brand-700 bg-brand-50 hover:bg-brand-100 py-1.5 px-3.5 rounded-lg text-sm transition-colors self-start sm:self-auto">
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RefreshCcw } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'


definePageMeta({ layout: 'dashboard' })

const { token } = useAuth()
const trades = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`${useRuntimeConfig().public.apiBaseUrl}/escrow/my-transactions`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const data = await res.json()
    if (res.ok) {
      trades.value = data
    }
  } catch (err) {
    console.error('Failed to fetch trades:', err)
  } finally {
    loading.value = false
  }
})
</script>
