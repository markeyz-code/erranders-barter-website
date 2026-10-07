<template>
  <div class="p-4 md:p-4 sm:p-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-900 mb-1">My Trades</h1>
          <p class="text-slate-500 font-medium">Track your active, pending, and completed transactions.</p>
        </div>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-slate-100 p-6 rounded-3xl animate-pulse h-32"></div>
      </div>

      <div v-else-if="!trades || trades.length === 0" class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex flex-col items-center justify-center p-12 text-center">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <RefreshCcw class="w-10 h-10 text-slate-300" />
          </div>
          <h3 class="text-xl font-black text-slate-900 mb-2">No Trades Found</h3>
          <p class="text-slate-500 font-medium max-w-md mb-8">
            You haven't initiated any trades yet. Start exploring items or list something to get started!
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink to="/explore" class="bg-brand-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-700 transition-colors">
              Explore Deals
            </NuxtLink>
            <NuxtLink to="/sell" class="bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors">
              List an Item
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div v-for="trade in trades" :key="trade._id" class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:border-brand-300 transition-colors">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 rounded-full text-sm font-black uppercase tracking-wider" 
                      :class="{'bg-yellow-50 text-yellow-600': trade.status === 'held_in_escrow', 'bg-emerald-50 text-emerald-600': trade.status === 'released', 'bg-red-50 text-red-600': trade.status === 'disputed'}">
                  {{ trade.status.replace(/_/g, ' ') }}
                </span>
                <span class="text-sm font-bold text-slate-400">{{ new Date(trade.createdAt).toLocaleDateString() }}</span>
              </div>
              <h4 class="font-black text-lg text-slate-900 mb-1">Trade #{{ trade._id.slice(-6).toUpperCase() }}</h4>
              <p class="text-sm font-medium text-slate-500">Amount: ₦{{ trade.amount.toLocaleString() }}</p>
            </div>
            <button class="text-brand-600 font-bold hover:text-brand-700 bg-brand-50 hover:bg-brand-100 py-2 px-4 rounded-xl transition-colors">
              View Details
            </button>
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
