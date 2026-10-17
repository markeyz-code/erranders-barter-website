<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white text-lg font-black shrink-0">
            {{ initials }}
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 leading-tight">Welcome, {{ user?.firstName || 'Trader' }}!</h1>
            <p v-if="user?.university || user?.hostel" class="text-slate-500 font-medium text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
              <MapPin class="w-3.5 h-3.5 text-brand-600" /> {{ [user?.university, user?.hostel].filter(Boolean).join(' • ') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Grid (Pulled from Backend) -->
      <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div v-for="i in 4" :key="i" class="bg-slate-100 p-4 rounded-xl animate-pulse h-24"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p class="font-bold">Could not load your dashboard</p>
          <p class="text-sm mt-0.5">{{ error }}</p>
        </div>
        <button @click="fetchStats" class="shrink-0 bg-white border border-red-200 rounded-lg px-4 py-2 text-sm font-bold hover:bg-red-100 transition-colors">
          Try again
        </button>
      </div>
      
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div class="bg-white p-4 rounded-xl border border-slate-200">
          <div class="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-2.5">
            <Package class="w-4 h-4" />
          </div>
          <p class="text-slate-500 font-semibold text-xs mb-0.5">Active Listings</p>
          <p class="text-2xl font-black text-slate-900">{{ stats?.activeListings || 0 }}</p>
        </div>
        
        <div class="bg-white p-4 rounded-xl border border-slate-200">
          <div class="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-2.5">
            <CheckCircle class="w-4 h-4" />
          </div>
          <p class="text-slate-500 font-semibold text-xs mb-0.5">Completed Trades</p>
          <p class="text-2xl font-black text-slate-900">{{ stats?.completedTrades || 0 }}</p>
        </div>
        
        <div class="bg-white p-4 rounded-xl border border-slate-200">
          <div class="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-2.5">
            <Wallet class="w-4 h-4" />
          </div>
          <p class="text-slate-500 font-semibold text-xs mb-0.5">Escrow Balance</p>
          <p class="text-2xl font-black text-slate-900">₦{{ (stats?.escrowBalance || 0).toLocaleString() }}</p>
        </div>
        
        <div class="bg-white p-4 rounded-xl border border-slate-200">
          <div class="w-9 h-9 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-2.5">
            <Star class="w-4 h-4" />
          </div>
          <p class="text-slate-500 font-semibold text-xs mb-0.5">Seller Rating</p>
          <p class="text-2xl font-black text-slate-900">{{ Number(stats?.sellerRating || 0).toFixed(1) }}<span class="text-xs text-slate-400">/5</span></p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <h2 class="text-base font-bold text-slate-900 mb-3.5">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NuxtLink to="/sell" class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-white transition-all group flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus class="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-900 mb-0.5">List New Item</h3>
              <p class="text-xs text-slate-500">Sell or swap something fast.</p>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/wallet" class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-white transition-all group flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ArrowDownToLine class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-900 mb-0.5">Withdraw Funds</h3>
              <p class="text-xs text-slate-500">Move escrow balance to bank.</p>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/explore" class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-white transition-all group flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Search class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-900 mb-0.5">Explore Deals</h3>
              <p class="text-xs text-slate-500">Find the best student trades.</p>
            </div>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { MapPin, Package, CheckCircle, Wallet, Star, Plus, ArrowDownToLine, Search } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { usersApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard' })

const { user } = useAuth()
const stats = ref(null)
const loading = ref(true)
const error = ref('')

const initials = computed(() => {
  if (!user.value) return 'U'
  return `${user.value.firstName?.[0] || ''}${user.value.lastName?.[0] || ''}`.toUpperCase() || 'U'
})

const fetchStats = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await usersApi.getMyStats()
    stats.value = data
  } catch (err) {
    error.value =
      err?.response?.data?.message || 'The stats API did not respond. No numbers were assumed.'
    stats.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>
