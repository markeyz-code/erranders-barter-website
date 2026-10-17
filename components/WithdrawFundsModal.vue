<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 sm:backdrop-blur-sm sm:p-4">
    <div class="bg-white absolute inset-0 sm:relative sm:inset-auto w-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:max-w-lg flex flex-col overflow-hidden sm:border border-slate-200">

      <!-- Header -->
      <div class="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0 pt-[max(env(safe-area-inset-top),1rem)] sm:pt-4">
        <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
          <ArrowDownToLine class="w-5 h-5 text-brand-600" /> Withdraw Funds
        </h2>
        <button
          type="button"
          @click="close"
          :disabled="submitting"
          class="p-2 bg-white hover:bg-slate-200 rounded-full transition-colors text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1">

        <!-- Success -->
        <div v-if="result" class="text-center">
          <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <h3 class="text-xl font-black text-slate-900 mb-1">Withdrawal submitted</h3>
          <p class="text-sm text-slate-500 font-medium mb-5">
            Your request was accepted. The status below is exactly what the server returned.
          </p>

          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
            <div class="flex items-start justify-between gap-4">
              <span class="text-sm font-semibold text-slate-500">Reference</span>
              <span class="text-sm font-bold text-slate-900 font-mono break-all text-right">{{ result.withdrawal.reference || '—' }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm font-semibold text-slate-500">Status</span>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize"
                :class="statusClass(result.withdrawal.status)"
              >
                {{ result.withdrawal.status || '—' }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm font-semibold text-slate-500">Amount</span>
              <span class="text-sm font-bold text-slate-900">₦{{ formatMoney(result.withdrawal.amount) }}</span>
            </div>
            <div v-if="hasAmount(result.withdrawal.fee)" class="flex items-center justify-between gap-4">
              <span class="text-sm font-semibold text-slate-500">Fee</span>
              <span class="text-sm font-bold text-slate-900">₦{{ formatMoney(result.withdrawal.fee) }}</span>
            </div>
            <div v-if="hasAmount(result.withdrawal.netAmount)" class="flex items-center justify-between gap-4">
              <span class="text-sm font-semibold text-slate-500">You receive</span>
              <span class="text-sm font-bold text-slate-900">₦{{ formatMoney(result.withdrawal.netAmount) }}</span>
            </div>
            <div class="flex items-center justify-between gap-4 border-t border-slate-200 pt-2.5">
              <span class="text-sm font-semibold text-slate-500">New balance</span>
              <span v-if="result.newBalance !== null" class="text-base font-black text-slate-900">
                ₦{{ formatMoney(result.newBalance) }}
              </span>
              <span v-else class="text-xs font-semibold text-slate-400">Not refreshed</span>
            </div>
          </div>

          <p v-if="result.withdrawal.failureReason" class="mt-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 text-left">
            {{ result.withdrawal.failureReason }}
          </p>

          <p v-if="result.balanceError" class="mt-3 text-xs font-medium text-amber-700 text-left">
            {{ result.balanceError }}
          </p>

          <button
            v-if="result.newBalance === null"
            type="button"
            @click="retryBalance"
            :disabled="refreshingBalance"
            class="mt-3 inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 disabled:opacity-50"
          >
            <Loader2 v-if="refreshingBalance" class="w-4 h-4 animate-spin" />
            <RefreshCw v-else class="w-4 h-4" />
            {{ refreshingBalance ? 'Checking…' : 'Check balance again' }}
          </button>
        </div>

        <!-- Loading saved payout details -->
        <div v-else-if="loadingBank" class="py-10 flex flex-col items-center gap-3">
          <Loader2 class="w-7 h-7 text-brand-500 animate-spin" />
          <p class="text-sm font-semibold text-slate-500">Loading your payout details…</p>
        </div>

        <!-- Saved payout details could not be loaded -->
        <div v-else-if="bankError" class="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <h3 class="font-bold text-red-700 mb-1">Could not load your payout account</h3>
          <p class="text-sm text-red-600 mb-4">{{ bankError }}</p>
          <button
            type="button"
            @click="loadBankDetails"
            class="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-brand-700 text-sm transition-colors"
          >
            Try again
          </button>
        </div>

        <div v-else class="space-y-5">

          <!-- Payout account on file -->
          <div v-if="bankDetails && !editingBank" class="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Payout account</p>
                <p class="text-sm font-black text-slate-900 truncate">{{ bankDetails.bankName }}</p>
                <p class="text-sm font-semibold text-slate-600">{{ maskedAccountNumber(bankDetails.accountNumber) }}</p>
                <p class="text-sm font-semibold text-slate-900 mt-0.5 truncate">{{ bankDetails.accountName }}</p>
              </div>
              <button
                type="button"
                @click="startChangeBank"
                :disabled="submitting"
                class="shrink-0 text-xs font-black text-brand-600 hover:text-brand-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                Change
              </button>
            </div>
            <p v-if="justSavedBank" class="text-xs font-semibold text-emerald-600 mt-2">Payout account saved.</p>
          </div>

          <!-- Payout account setup / change -->
          <div v-else class="space-y-4">
            <p class="text-xs font-medium text-slate-500">
              Payouts go to a Nigerian bank account in your name. Add it once — you can change it later.
            </p>

            <!-- Bank picker -->
            <div>
              <label class="block text-sm font-black text-slate-900 mb-2">Payout bank</label>
              <div class="relative" ref="bankPickerRef">
                <button
                  type="button"
                  @click="toggleBankList"
                  :disabled="savingBank"
                  class="w-full flex items-center justify-between gap-2 bg-white border rounded-xl pl-4 pr-3 py-3 text-left text-sm font-bold outline-none transition-all disabled:bg-slate-50 disabled:opacity-60"
                  :class="bankListOpen ? 'border-brand-600 ring-2 ring-brand-600/10' : 'border-slate-200 hover:border-slate-300'"
                >
                  <span class="flex items-center gap-2 min-w-0">
                    <Landmark class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="truncate" :class="selectedBank ? 'text-slate-900' : 'text-slate-400'">
                      {{ selectedBank ? selectedBank.name : 'Search for your bank' }}
                    </span>
                  </span>
                  <ChevronDown
                    class="w-4 h-4 text-slate-400 shrink-0 transition-transform"
                    :class="bankListOpen ? 'rotate-180' : ''"
                  />
                </button>

                <div
                  v-if="bankListOpen"
                  class="absolute z-30 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden"
                >
                  <div class="p-2 border-b border-slate-100">
                    <div class="relative">
                      <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref="bankSearchInput"
                        v-model="bankQuery"
                        type="search"
                        autocomplete="off"
                        placeholder="Type your bank name…"
                        class="w-full pl-9 pr-3 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div v-if="banksLoading" class="px-4 py-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
                    <Loader2 class="w-4 h-4 animate-spin" /> Loading banks…
                  </div>
                  <div v-else-if="banksError" class="px-4 py-5 text-center">
                    <p class="text-sm font-semibold text-red-600 mb-2">{{ banksError }}</p>
                    <button type="button" @click="loadBanks" class="text-sm font-bold text-brand-600 hover:text-brand-700">
                      Try again
                    </button>
                  </div>
                  <ul v-else-if="visibleBanks.length" class="max-h-56 overflow-y-auto py-1">
                    <li v-for="bank in visibleBanks" :key="bank.code">
                      <button
                        type="button"
                        @click="chooseBank(bank)"
                        class="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors"
                        :class="selectedBank?.code === bank.code ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'"
                      >
                        {{ bank.name }}
                      </button>
                    </li>
                  </ul>
                  <p v-else class="px-4 py-6 text-center text-sm font-medium text-slate-500">
                    No bank matches “{{ bankQuery }}”.
                  </p>
                  <p
                    v-if="filteredBanks.length > visibleBanks.length"
                    class="px-4 py-2 text-[11px] font-semibold text-slate-400 border-t border-slate-100"
                  >
                    Showing the first {{ visibleBanks.length }} of {{ filteredBanks.length }} matches — keep typing to narrow it down.
                  </p>
                </div>
              </div>
            </div>

            <!-- Account number -->
            <div>
              <label for="withdraw-account-number" class="block text-sm font-black text-slate-900 mb-2">Account number</label>
              <input
                id="withdraw-account-number"
                :value="accountNumber"
                @input="onAccountInput"
                type="text"
                inputmode="numeric"
                maxlength="10"
                autocomplete="off"
                placeholder="10-digit account number"
                :disabled="savingBank"
                class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold tracking-wide text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all disabled:bg-slate-50 disabled:opacity-60"
              />
              <p class="mt-1.5 text-xs font-medium text-slate-400">Nigerian bank account numbers are 10 digits.</p>
            </div>

            <!-- Verify -->
            <button
              type="button"
              @click="verifyAccount"
              :disabled="!canVerify"
              class="w-full flex items-center justify-center gap-2 border-2 rounded-xl py-2.5 text-sm font-black transition-colors disabled:cursor-not-allowed"
              :class="isAccountVerified
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-brand-600 text-brand-700 hover:bg-brand-50 disabled:opacity-50 disabled:hover:bg-transparent'"
            >
              <Loader2 v-if="resolving" class="w-4 h-4 animate-spin" />
              <CheckCircle2 v-else-if="isAccountVerified" class="w-4 h-4" />
              <ShieldCheck v-else class="w-4 h-4" />
              {{ resolving ? 'Verifying…' : isAccountVerified ? 'Account verified' : 'Verify account' }}
            </button>
            <p v-if="resolveError" class="text-xs font-semibold text-red-600">{{ resolveError }}</p>

            <!-- Resolved account name -->
            <div v-if="isAccountVerified" class="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <p class="text-[11px] font-black uppercase tracking-wider text-emerald-600 mb-0.5">Verified account name</p>
              <p class="text-sm font-black text-emerald-900">{{ resolvedAccountName }}</p>
              <p class="text-xs font-medium text-emerald-700 mt-1">Confirm this is the right recipient before saving.</p>
            </div>

            <p v-if="bankSaveError" class="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              {{ bankSaveError }}
            </p>

            <div class="flex gap-3">
              <button
                v-if="bankDetails"
                type="button"
                @click="cancelBankEdit"
                :disabled="savingBank"
                class="px-4 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="saveBankAccount"
                :disabled="!canSaveBank"
                class="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="savingBank" class="w-4 h-4 animate-spin" />
                <span>{{ savingBank ? 'Saving…' : 'Save payout account' }}</span>
              </button>
            </div>
          </div>

          <!-- Amount + summary, only once an account is saved -->
          <template v-if="bankDetails && !editingBank">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="withdraw-amount" class="text-sm font-black text-slate-900">Amount</label>
                <span class="text-xs font-semibold text-slate-500">Available ₦{{ formatMoney(availableBalance) }}</span>
              </div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₦</span>
                <input
                  id="withdraw-amount"
                  v-model="amountDisplay"
                  type="text"
                  inputmode="numeric"
                  placeholder="1,000"
                  :disabled="submitting"
                  class="w-full bg-white border border-slate-200 rounded-xl py-3 pl-9 pr-20 font-bold text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all disabled:bg-slate-50"
                />
                <button
                  type="button"
                  @click="setMaxAmount"
                  :disabled="submitting || availableBalance < MIN_WITHDRAWAL"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  Max
                </button>
              </div>
              <p v-if="amountError" class="mt-1.5 text-xs font-semibold text-red-600">{{ amountError }}</p>
              <p v-else class="mt-1.5 text-xs font-medium text-slate-400">Minimum withdrawal is ₦{{ formatMoney(MIN_WITHDRAWAL) }}.</p>

              <div
                v-if="availableBalance < MIN_WITHDRAWAL"
                class="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-semibold text-amber-800"
              >
                Your available balance (₦{{ formatMoney(availableBalance) }}) is below the ₦{{ formatMoney(MIN_WITHDRAWAL) }} minimum,
                so there is nothing to withdraw yet.
              </div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <p class="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Summary</p>
              <div class="flex justify-between gap-4 text-sm">
                <span class="font-semibold text-slate-600">Amount</span>
                <span class="font-bold text-slate-900">₦{{ formatMoney(amount) }}</span>
              </div>
              <div class="flex justify-between gap-4 text-sm">
                <span class="font-semibold text-slate-600">Payout fee</span>
                <span class="font-semibold text-slate-500 text-right">Confirmed when the payout is created</span>
              </div>
              <div class="flex justify-between gap-4 text-sm border-t border-slate-200 pt-2">
                <span class="font-semibold text-slate-600">You receive</span>
                <span class="font-black text-slate-900 text-right">₦{{ formatMoney(amount) }} minus any provider fee</span>
              </div>
              <p class="text-[11px] font-medium text-slate-500 leading-relaxed">
                The provider sets the fee, so the exact net amount is only known once the payout is created.
                It is shown on your confirmation and kept on the withdrawal record.
              </p>
            </div>

            <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm font-semibold text-red-700">
              {{ submitError }}
            </div>
          </template>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0 pb-[max(env(safe-area-inset-bottom),1rem)] sm:pb-4">
        <div v-if="result" class="flex justify-end">
          <button
            type="button"
            @click="close"
            class="w-full sm:w-auto bg-brand-600 text-white font-black px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors"
          >
            Done
          </button>
        </div>
        <div v-else class="flex items-center justify-end gap-3">
          <button
            type="button"
            @click="close"
            :disabled="submitting"
            class="px-5 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="submit"
            :disabled="!canSubmit"
            class="bg-brand-600 text-white font-black px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="submitting" class="w-5 h-5 animate-spin" />
            <ArrowDownToLine v-else class="w-5 h-5" />
            {{ submitting ? 'Submitting…' : amount > 0 ? `Withdraw ₦${formatMoney(amount)}` : 'Withdraw' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ArrowDownToLine,
  CheckCircle2,
  ChevronDown,
  Landmark,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-vue-next'
import { banksApi } from '~/api_factory/modules/banks'
import type { Bank } from '~/api_factory/modules/banks'
import { withdrawalsApi } from '~/api_factory/modules/withdrawals'
import type { BankDetails, Withdrawal } from '~/api_factory/modules/withdrawals'
import { usersApi } from '~/composables/useApi'

const props = defineProps<{
  isOpen: boolean
  balance: number
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'completed', payload: { withdrawal: Withdrawal; newBalance: number | null }): void
  (event: 'balance-updated', balance: number): void
}>()

const MIN_WITHDRAWAL = 1000
const ACCOUNT_NUMBER_LENGTH = 10
const BANK_RESULT_LIMIT = 50

type CompletionResult = {
  withdrawal: Withdrawal
  newBalance: number | null
  balanceError: string
}

const result = ref<CompletionResult | null>(null)

// Payout account
const bankDetails = ref<BankDetails | null>(null)
const loadingBank = ref(false)
const bankError = ref('')
const editingBank = ref(false)
const justSavedBank = ref(false)
const savingBank = ref(false)
const bankSaveError = ref('')

// Bank picker
const banks = ref<Bank[]>([])
const banksLoading = ref(false)
const banksError = ref('')
const bankQuery = ref('')
const bankListOpen = ref(false)
const selectedBank = ref<Bank | null>(null)
const bankPickerRef = ref<HTMLElement | null>(null)
const bankSearchInput = ref<HTMLInputElement | null>(null)

// Account verification
const accountNumber = ref('')
const resolvedAccountName = ref('')
const verifiedKey = ref('')
const resolving = ref(false)
const resolveError = ref('')

// Amount
const amountDigits = ref('')

// Submit
const submitting = ref(false)
const submitError = ref('')
const refreshingBalance = ref(false)

const availableBalance = computed(() => toFiniteNumber(props.balance) ?? 0)

const amount = computed(() => Number(amountDigits.value || 0))

const amountDisplay = computed({
  get: () => (amountDigits.value ? Number(amountDigits.value).toLocaleString('en-US') : ''),
  set: (value: string | number) => {
    const digits = String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+/, '')
    amountDigits.value = digits.slice(0, 9)
  },
})

const amountError = computed(() => {
  if (!amountDigits.value) return ''
  if (amount.value < MIN_WITHDRAWAL) return `Minimum withdrawal is ₦${formatMoney(MIN_WITHDRAWAL)}.`
  if (amount.value > availableBalance.value) {
    return `You can withdraw at most ₦${formatMoney(availableBalance.value)}.`
  }
  return ''
})

const verificationKey = computed(() =>
  selectedBank.value ? `${selectedBank.value.code}:${accountNumber.value}` : '',
)

const isAccountVerified = computed(
  () => !!resolvedAccountName.value && !!verifiedKey.value && verifiedKey.value === verificationKey.value,
)

const canVerify = computed(
  () =>
    !!selectedBank.value &&
    accountNumber.value.length === ACCOUNT_NUMBER_LENGTH &&
    !isAccountVerified.value &&
    !resolving.value &&
    !savingBank.value,
)

const canSaveBank = computed(
  () => isAccountVerified.value && !!selectedBank.value && !savingBank.value,
)

const canSubmit = computed(
  () =>
    !!bankDetails.value &&
    !editingBank.value &&
    !submitting.value &&
    amount.value >= MIN_WITHDRAWAL &&
    amount.value <= availableBalance.value &&
    !amountError.value,
)

const filteredBanks = computed(() => {
  const query = bankQuery.value.trim().toLowerCase()
  if (!query) return banks.value
  return banks.value.filter(
    (bank) => bank.name.toLowerCase().includes(query) || bank.code === query,
  )
})

const visibleBanks = computed(() => filteredBanks.value.slice(0, BANK_RESULT_LIMIT))

const close = () => {
  if (submitting.value) return
  emit('close')
}

const reset = () => {
  result.value = null
  bankDetails.value = null
  loadingBank.value = false
  bankError.value = ''
  editingBank.value = false
  justSavedBank.value = false
  savingBank.value = false
  bankSaveError.value = ''
  bankQuery.value = ''
  bankListOpen.value = false
  selectedBank.value = null
  accountNumber.value = ''
  resolvedAccountName.value = ''
  verifiedKey.value = ''
  resolving.value = false
  resolveError.value = ''
  amountDigits.value = ''
  submitting.value = false
  submitError.value = ''
  refreshingBalance.value = false
}

const openModal = async () => {
  reset()
  await loadBankDetails()
}

const loadBankDetails = async () => {
  loadingBank.value = true
  bankError.value = ''
  try {
    const { data } = await withdrawalsApi.getBankDetails()
    if (data && data.accountNumber && data.accountName) {
      bankDetails.value = data
      selectedBank.value = {
        name: data.bankName || '',
        code: data.bankCode || '',
      }
      accountNumber.value = String(data.accountNumber)
      resolvedAccountName.value = data.accountName
      verifiedKey.value = `${data.bankCode || ''}:${String(data.accountNumber)}`
      editingBank.value = false
    } else {
      bankDetails.value = null
      editingBank.value = true
      loadBanks()
    }
  } catch (error) {
    bankDetails.value = null
    bankError.value = errorMessage(error, 'Could not load your saved payout account.')
  } finally {
    loadingBank.value = false
  }
}

const loadBanks = async () => {
  if (banksLoading.value || banks.value.length) return
  banksLoading.value = true
  banksError.value = ''
  try {
    const { data } = await banksApi.list()
    const payload = data as unknown
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { data?: unknown })?.data)
        ? ((payload as { data: unknown[] }).data as unknown[])
        : null

    if (!list) throw new Error('The bank API returned an unexpected response.')

    banks.value = list
      .filter((entry): entry is { name: string; code: string } => {
        const bank = entry as { name?: unknown; code?: unknown }
        return typeof bank?.name === 'string' && typeof bank?.code === 'string'
      })
      .map((bank) => ({ name: bank.name, code: bank.code }))

    if (!banks.value.length) banksError.value = 'The bank API returned an empty list.'
  } catch (error) {
    banksError.value = errorMessage(error, 'Could not load the bank list.')
  } finally {
    banksLoading.value = false
  }
}

const toggleBankList = async () => {
  if (savingBank.value) return
  bankListOpen.value = !bankListOpen.value
  if (bankListOpen.value) {
    bankQuery.value = ''
    loadBanks()
    await nextTick()
    bankSearchInput.value?.focus()
  }
}

const chooseBank = (bank: Bank) => {
  selectedBank.value = { name: bank.name, code: bank.code }
  bankListOpen.value = false
  bankQuery.value = ''
}

const onAccountInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const digits = target.value.replace(/[^0-9]/g, '').slice(0, ACCOUNT_NUMBER_LENGTH)
  accountNumber.value = digits
  target.value = digits
}

const verifyAccount = async () => {
  if (!canVerify.value || !selectedBank.value) return
  resolving.value = true
  resolveError.value = ''
  resolvedAccountName.value = ''
  // Pin the request to the pair on screen right now. If the user edits the bank or the
  // number while the lookup is in flight, the result must not validate the new pair.
  const bankCode = selectedBank.value.code
  const accountNo = accountNumber.value
  try {
    const { data } = await banksApi.resolve(accountNo, bankCode)
    const name = data?.accountName
    if (typeof name === 'string' && name.trim()) {
      resolvedAccountName.value = name.trim()
      verifiedKey.value = `${bankCode}:${accountNo}`
    } else {
      resolveError.value = 'The bank did not return an account name for that number. Check it and try again.'
    }
  } catch (error) {
    resolveError.value = errorMessage(error, 'Could not verify that account. Check the bank and account number.')
  } finally {
    resolving.value = false
  }
}

const saveBankAccount = async () => {
  if (!canSaveBank.value || !selectedBank.value) return
  savingBank.value = true
  bankSaveError.value = ''
  const payload = {
    bankCode: selectedBank.value.code,
    bankName: selectedBank.value.name,
    accountNumber: accountNumber.value,
  }
  try {
    const { data } = await withdrawalsApi.saveBankDetails(payload)
    // Prefer the server's echo; fall back to the verified values we sent when a field is omitted.
    const saved: BankDetails = {
      bankCode: data?.bankCode || payload.bankCode,
      bankName: data?.bankName || payload.bankName,
      accountNumber: String(data?.accountNumber || payload.accountNumber),
      accountName: data?.accountName || resolvedAccountName.value,
    }
    bankDetails.value = saved
    selectedBank.value = { name: saved.bankName, code: saved.bankCode }
    accountNumber.value = saved.accountNumber
    resolvedAccountName.value = saved.accountName
    verifiedKey.value = `${saved.bankCode}:${saved.accountNumber}`
    editingBank.value = false
    justSavedBank.value = true
    bankListOpen.value = false
  } catch (error) {
    bankSaveError.value = errorMessage(error, 'Could not save your payout account.')
  } finally {
    savingBank.value = false
  }
}

const startChangeBank = () => {
  if (submitting.value) return
  editingBank.value = true
  justSavedBank.value = false
  bankSaveError.value = ''
  bankListOpen.value = false
  loadBanks()
}

const cancelBankEdit = () => {
  editingBank.value = false
  bankListOpen.value = false
  bankSaveError.value = ''
  bankQuery.value = ''
  if (bankDetails.value) {
    selectedBank.value = {
      name: bankDetails.value.bankName,
      code: bankDetails.value.bankCode,
    }
    accountNumber.value = String(bankDetails.value.accountNumber)
    resolvedAccountName.value = bankDetails.value.accountName
    verifiedKey.value = `${bankDetails.value.bankCode}:${bankDetails.value.accountNumber}`
  }
}

const setMaxAmount = () => {
  if (availableBalance.value < MIN_WITHDRAWAL) return
  amountDigits.value = String(Math.floor(availableBalance.value)).slice(0, 9)
}

/**
 * Reads the balance from the server after a withdrawal. Never derives it locally:
 * the number shown is always the one `GET /users/me/stats` returned.
 */
const refreshBalanceFromServer = async (): Promise<number | null> => {
  refreshingBalance.value = true
  try {
    const { data } = await usersApi.getMyStats()
    const nextBalance = toFiniteNumber(data?.walletBalance)
    if (nextBalance === null) throw new Error('No balance in the response')
    if (result.value) {
      result.value.newBalance = nextBalance
      result.value.balanceError = ''
    }
    return nextBalance
  } catch (error) {
    if (result.value) {
      result.value.balanceError =
        'The withdrawal was submitted, but the updated balance could not be fetched. Check the wallet again in a moment.'
    }
    return null
  } finally {
    refreshingBalance.value = false
  }
}

const retryBalance = async () => {
  if (!result.value || refreshingBalance.value) return
  const nextBalance = await refreshBalanceFromServer()
  if (nextBalance !== null) emit('balance-updated', nextBalance)
}

const submit = async () => {
  if (!canSubmit.value) return
  submitting.value = true
  submitError.value = ''
  try {
    const { data } = await withdrawalsApi.withdraw(amount.value)
    const withdrawal = data as Withdrawal | undefined

    if (!withdrawal || (!withdrawal._id && !withdrawal.reference)) {
      // Do not claim success without a record to show: the outcome is genuinely unknown.
      submitError.value =
        'The API accepted the request but did not return a withdrawal record. Check your withdrawal history before trying again, so you do not submit twice.'
      return
    }

    result.value = { withdrawal, newBalance: null, balanceError: '' }
    const newBalance = await refreshBalanceFromServer()
    emit('completed', { withdrawal, newBalance })
  } catch (error) {
    submitError.value = errorMessage(error, 'The withdrawal could not be submitted.')
  } finally {
    submitting.value = false
  }
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!bankListOpen.value) return
  const target = event.target as Node | null
  if (bankPickerRef.value && target && bankPickerRef.value.contains(target)) return
  bankListOpen.value = false
}

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

const hasAmount = (value: unknown) => toFiniteNumber(value) !== null

const formatMoney = (value: unknown) => Number(toFiniteNumber(value) ?? 0).toLocaleString('en-US')

const maskedAccountNumber = (value?: string) => {
  const digits = String(value ?? '').replace(/\s/g, '')
  if (!digits) return '—'
  if (digits.length <= 4) return digits
  return `${'•'.repeat(digits.length - 4)} ${digits.slice(-4)}`
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function errorMessage(error: unknown, fallback: string): string {
  const responseData = (error as { response?: { data?: unknown } })?.response?.data
  if (typeof responseData === 'string' && responseData.trim()) return responseData
  if (responseData && typeof responseData === 'object') {
    const payload = responseData as { message?: unknown; error?: unknown }
    if (Array.isArray(payload.message)) {
      const joined = payload.message.filter((item) => typeof item === 'string').join(' ')
      if (joined.trim()) return joined
    }
    if (typeof payload.message === 'string' && payload.message.trim()) return payload.message
    if (typeof payload.error === 'string' && payload.error.trim()) return payload.error
  }
  const message = (error as { message?: unknown })?.message
  if (typeof message === 'string' && message.trim() && !message.includes('status code')) return message
  return fallback
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) openModal()
  },
)

onMounted(() => {
  if (typeof document === 'undefined') return
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('click', handleDocumentClick)
})
</script>
