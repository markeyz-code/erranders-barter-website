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

      <!-- Provider Suite Banner or Status -->
      <div v-if="user?.isServiceProvider" class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 mb-6 border border-slate-800 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-base text-white">Campus Service Provider</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Manage your services, client appointments, and booking schedule.</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink to="/dashboard/services" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5">
              <Briefcase class="w-3.5 h-3.5" /> My Services
            </NuxtLink>
            <NuxtLink to="/dashboard/availability" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5">
              <CalendarClock class="w-3.5 h-3.5" /> Availability
            </NuxtLink>
            <NuxtLink to="/dashboard/bookings" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5">
              <CalendarDays class="w-3.5 h-3.5" /> Bookings
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-bold text-base text-slate-900">Offer your skills on campus</h3>
            <p class="text-xs text-slate-600 mt-0.5">Hair styling, phone repairs, photography, tutoring. Set your prices and get booked directly by students.</p>
          </div>
        </div>
        <NuxtLink to="/become-a-provider" class="shrink-0 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm">
          Become a Provider →
        </NuxtLink>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <h2 class="text-base font-bold text-slate-900 mb-3.5">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <NuxtLink to="/sell" class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-white transition-all group flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus class="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-900 mb-0.5">List New Item</h3>
              <p class="text-xs text-slate-500">Sell or swap an item fast.</p>
            </div>
          </NuxtLink>

          <NuxtLink to="/services" class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-white transition-all group flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase class="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-900 mb-0.5">Campus Services</h3>
              <p class="text-xs text-slate-500">Book student skills & help.</p>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/dashboard/bookings" class="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-white transition-all group flex items-center gap-3">
            <div class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CalendarDays class="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-slate-900 mb-0.5">My Appointments</h3>
              <p class="text-xs text-slate-500">Check calls & bookings.</p>
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
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { MapPin, Package, CheckCircle, Wallet, Star, Plus, ArrowDownToLine, Search, Briefcase, CalendarClock, CalendarDays, Sparkles } from 'lucide-vue-next'
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
