<template>
  <div class="p-4 md:p-4 sm:p-8">
    <div class="max-w-5xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-brand-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-brand-200 shrink-0">
            {{ initials }}
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-slate-900 mb-1">Welcome, {{ user?.firstName || 'Trader' }}!</h1>
            <p class="text-slate-500 font-medium flex items-center gap-2">
              <MapPin class="w-4 h-4" /> {{ user?.university || 'University' }} • {{ user?.hostel || 'Hostel' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Grid (Pulled from Backend) -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div v-for="i in 4" :key="i" class="bg-slate-100 p-4 sm:p-6 rounded-3xl animate-pulse h-36"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Package class="w-6 h-6" />
          </div>
          <p class="text-slate-500 font-bold text-sm  mb-1">Active Listings</p>
          <p class="text-3xl font-black text-slate-900">{{ stats?.activeListings || 0 }}</p>
        </div>
        
        <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle class="w-6 h-6" />
          </div>
          <p class="text-slate-500 font-bold text-sm  mb-1">Completed Trades</p>
          <p class="text-3xl font-black text-slate-900">{{ stats?.completedTrades || 0 }}</p>
        </div>
        
        <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Wallet class="w-6 h-6" />
          </div>
          <p class="text-slate-500 font-bold text-sm  mb-1">Escrow Balance</p>
          <p class="text-3xl font-black text-slate-900">₦{{ (stats?.escrowBalance || 0).toLocaleString() }}</p>
        </div>
        
        <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
            <Star class="w-6 h-6" />
          </div>
          <p class="text-slate-500 font-bold text-sm  mb-1">Seller Rating</p>
          <p class="text-3xl font-black text-slate-900">{{ stats?.sellerRating || '0.0' }}<span class="text-lg text-slate-400">/5</span></p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm">
        <h2 class="text-xl font-black text-slate-900 mb-6">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NuxtLink to="/sell" class="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 hover:bg-white transition-all group flex flex-col items-center text-center">
            <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Plus class="w-6 h-6 text-brand-600" />
            </div>
            <h3 class="font-bold text-slate-900 mb-1">List New Item</h3>
            <p class="text-sm text-slate-500 font-medium">Sell or swap something fast.</p>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/wallet" class="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 hover:bg-white transition-all group flex flex-col items-center text-center">
            <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <ArrowDownToLine class="w-6 h-6 text-emerald-600" />
            </div>
            <h3 class="font-bold text-slate-900 mb-1">Withdraw Funds</h3>
            <p class="text-sm text-slate-500 font-medium">Move escrow balance to bank.</p>
          </NuxtLink>
          
          <NuxtLink to="/explore" class="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 hover:bg-white transition-all group flex flex-col items-center text-center">
            <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Search class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-bold text-slate-900 mb-1">Explore Deals</h3>
            <p class="text-sm text-slate-500 font-medium">Find the best student trades.</p>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { MapPin, Package, CheckCircle, Wallet, Star, Plus, ArrowDownToLine, Search } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'dashboard' })

const { user, token } = useAuth()
const stats = ref(null)
const loading = ref(true)

const initials = computed(() => {
  if (!user.value) return 'U'
  return `${user.value.firstName?.[0] || ''}${user.value.lastName?.[0] || ''}`.toUpperCase() || 'U'
})

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
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>
