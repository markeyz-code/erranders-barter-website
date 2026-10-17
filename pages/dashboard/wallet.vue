<template>
  <div class="p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">Escrow Wallet</h1>
        <p class="text-slate-500 font-medium text-xs sm:text-sm">Your available balance, bank withdrawals, and the funds currently held in escrow.</p>
      </div>

      <div v-if="loading" class="animate-pulse">
        <div class="bg-slate-100 h-40 rounded-xl mb-6"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div class="bg-slate-100 h-20 rounded-xl"></div>
          <div class="bg-slate-100 h-20 rounded-xl"></div>
        </div>
        <div class="bg-slate-100 h-24 rounded-xl"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 class="font-bold text-red-700 mb-1">Could not load your wallet</h2>
        <p class="text-sm text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchStats" class="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-brand-700 text-sm transition-colors">
          Try again
        </button>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <!-- Available balance -->
          <div class="bg-brand-600 rounded-xl p-6 text-white relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-brand-100 font-semibold uppercase tracking-wider text-xs mb-1.5 flex items-center gap-1.5">
                <Wallet class="w-4 h-4" /> Available Balance
              </p>
              <h2 class="text-3xl font-extrabold tracking-tight mb-4">
                ₦{{ Number(stats?.walletBalance || 0).toLocaleString() }}
              </h2>
              <button
                @click="openWithdraw"
                class="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors text-sm"
              >
                <ArrowDownToLine class="w-4 h-4" /> Withdraw
              </button>
            </div>
          </div>

          <!-- Held in escrow -->
          <div class="bg-white rounded-xl p-6 border border-slate-200">
            <p class="text-slate-500 font-semibold uppercase tracking-wider text-xs mb-1.5 flex items-center gap-1.5">
              <ShieldCheck class="w-4 h-4 text-brand-600" /> Held in Escrow
            </p>
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">
              ₦{{ Number(stats?.escrowBalance || 0).toLocaleString() }}
            </h2>
            <p class="text-xs text-slate-500 font-medium mt-2">Released to your balance when buyers confirm delivery.</p>
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
              <ArrowDownToLine class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-sm mb-0.5">Bank Payouts</h3>
              <p class="text-xs text-slate-500 font-medium">
                Withdraw to a Nigerian bank account in your name. Minimum withdrawal is ₦1,000.
              </p>
            </div>
          </div>
        </div>

        <!-- Withdrawal history -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-bold text-slate-900">Withdrawal history</h2>
            <button
              v-if="!historyLoading"
              @click="fetchHistory"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <RefreshCw class="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div v-if="historyLoading" class="space-y-2">
            <div v-for="i in 3" :key="i" class="bg-slate-100 h-20 rounded-xl animate-pulse"></div>
          </div>

          <div v-else-if="historyError" class="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <p class="font-bold text-red-700 mb-1">Could not load your withdrawals</p>
            <p class="text-sm text-red-600 mb-3">{{ historyError }}</p>
            <button @click="fetchHistory" class="bg-brand-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-brand-700 text-sm transition-colors">
              Try again
            </button>
          </div>

          <div v-else-if="withdrawals.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowDownToLine class="w-6 h-6 text-slate-300" />
            </div>
            <p class="font-bold text-slate-900 text-sm">No withdrawals yet</p>
            <p class="text-xs text-slate-500 font-medium mt-1">Payouts you request will appear here with their reference and status.</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(withdrawal, index) in withdrawals"
              :key="withdrawal._id || withdrawal.reference || index"
              class="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize" :class="statusClass(withdrawal.status)">
                    {{ withdrawal.status || '—' }}
                  </span>
                  <span class="text-[11px] font-medium text-slate-400">{{ formatDate(withdrawal.createdAt) }}</span>
                </div>
                <p class="font-bold text-slate-900">₦{{ formatMoney(withdrawal.amount) }}</p>
                <p class="text-xs font-medium text-slate-500 truncate">
                  Ref {{ withdrawal.reference || '—' }}
                  <template v-if="withdrawal.bankName"> · {{ withdrawal.bankName }}</template>
                  <template v-if="withdrawal.accountNumber"> · ••••{{ last4(withdrawal.accountNumber) }}</template>
                </p>
                <p v-if="withdrawal.failureReason" class="text-xs font-semibold text-red-600 mt-1">{{ withdrawal.failureReason }}</p>
              </div>
              <div v-if="hasAmount(withdrawal.netAmount)" class="text-left sm:text-right shrink-0">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">You receive</p>
                <p class="font-bold text-slate-900">₦{{ formatMoney(withdrawal.netAmount) }}</p>
                <p v-if="hasAmount(withdrawal.fee)" class="text-[11px] font-medium text-slate-500">Fee ₦{{ formatMoney(withdrawal.fee) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <WithdrawFundsModal
      :is-open="showWithdraw"
      :balance="availableBalance"
      @close="showWithdraw = false"
      @completed="onWithdrawalCompleted"
      @balance-updated="onBalanceUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowDownToLine, RefreshCw, ShieldCheck, Wallet } from 'lucide-vue-next'
import { usersApi } from '~/composables/useApi'
import { withdrawalsApi } from '~/api_factory/modules/withdrawals'
import type { Withdrawal } from '~/api_factory/modules/withdrawals'
import WithdrawFundsModal from '~/components/WithdrawFundsModal.vue'

definePageMeta({ layout: 'dashboard' })

interface WalletStats {
  walletBalance?: number
  escrowBalance?: number
  activeListings?: number
  completedTrades?: number
  sellerRating?: number
}

const stats = ref<WalletStats | null>(null)
const loading = ref(true)
const error = ref('')

const withdrawals = ref<Withdrawal[]>([])
const historyLoading = ref(true)
const historyError = ref('')

const showWithdraw = ref(false)

const availableBalance = computed(() => Number(stats.value?.walletBalance || 0))

const fetchStats = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await usersApi.getMyStats()
    stats.value = (data || null) as WalletStats | null
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'The stats API did not respond.'
    stats.value = null
  } finally {
    loading.value = false
  }
}

const fetchHistory = async () => {
  historyLoading.value = true
  historyError.value = ''
  try {
    const { data } = await withdrawalsApi.history()
    const payload = data as unknown
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { data?: unknown })?.data)
        ? ((payload as { data: unknown[] }).data as unknown[])
        : null

    if (!list) throw new Error('The withdrawals API returned an unexpected response.')
    withdrawals.value = list as Withdrawal[]
  } catch (err: any) {
    historyError.value = err?.response?.data?.message || err?.message || 'The withdrawals API did not respond.'
    withdrawals.value = []
  } finally {
    historyLoading.value = false
  }
}

const openWithdraw = () => {
  showWithdraw.value = true
}

const onWithdrawalCompleted = async (payload: { withdrawal: Withdrawal; newBalance: number | null }) => {
  // The modal read this from GET /users/me/stats after the payout was accepted. Never
  // subtract locally: only show a balance the server returned.
  if (payload.newBalance !== null && stats.value) {
    stats.value = { ...stats.value, walletBalance: payload.newBalance }
  } else {
    await fetchStats()
  }
  await fetchHistory()
}

const onBalanceUpdated = (balance: number) => {
  if (stats.value) stats.value = { ...stats.value, walletBalance: balance }
}

const hasAmount = (value: unknown) => toFiniteNumber(value) !== null

const last4 = (value?: string) => String(value ?? '').slice(-4)

const statusClass = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-600'
    case 'processing':
      return 'bg-blue-50 text-blue-600'
    case 'completed':
      return 'bg-emerald-50 text-emerald-600'
    case 'failed':
      return 'bg-red-50 text-red-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const formatDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function formatMoney(value: unknown) {
  return Number(toFiniteNumber(value) ?? 0).toLocaleString('en-US')
}

onMounted(() => {
  fetchStats()
  fetchHistory()
})
</script>
