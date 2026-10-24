<template>
  <div v-if="target" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl max-w-md w-full p-5">
      <h3 class="text-lg font-extrabold text-slate-900">Report</h3>
      <p class="text-xs text-slate-500 mt-0.5">
        {{ target.label }} — the other person is never told who reported them.
      </p>

      <div v-if="sent" class="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
        <CheckCircle2 class="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-900">Report sent</p>
        <p class="text-xs text-slate-600 mt-1">
          Our team reviews it. If money is at stake, open a dispute so it stays in escrow.
        </p>
      </div>

      <form v-else class="mt-4 space-y-3" @submit.prevent="submit">
        <div class="relative">
          <span class="text-xs font-bold text-slate-600 block mb-1">What is wrong?</span>
          
          <!-- Dropdown Trigger -->
          <button
            type="button"
            @click="isDropdownOpen = !isDropdownOpen"
            class="w-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm flex items-center justify-between text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer text-left"
            :class="{ 'ring-2 ring-brand-500/20 border-brand-500 bg-white': isDropdownOpen }"
          >
            <span class="truncate">{{ selectedReasonLabel }}</span>
            <ChevronDown
              class="w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200"
              :class="{ 'rotate-180 text-brand-600': isDropdownOpen }"
            />
          </button>

          <!-- Backdrop to close dropdown on click outside -->
          <div
            v-if="isDropdownOpen"
            class="fixed inset-0 z-20"
            @click="isDropdownOpen = false"
          ></div>

          <!-- Dropdown Options Panel -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-1"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-1"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute left-0 right-0 z-30 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto ring-1 ring-black/5"
            >
              <button
                v-for="opt in reasons"
                :key="opt.value"
                type="button"
                @click="selectReason(opt.value)"
                class="w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors cursor-pointer"
                :class="reason === opt.value ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'"
              >
                <span>{{ opt.label }}</span>
                <Check v-if="reason === opt.value" class="w-4 h-4 text-brand-600 shrink-0 ml-2" />
              </button>
            </div>
          </Transition>
        </div>

        <label class="block">
          <span class="text-xs font-bold text-slate-600">What happened?</span>
          <textarea
            v-model="details"
            rows="4"
            placeholder="A sentence or two helps us act faster."
            class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
          />
        </label>

        <p v-if="error" class="text-xs font-bold text-red-600">{{ error }}</p>

        <div class="flex gap-2">
          <button
            type="submit"
            class="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold disabled:opacity-40"
            :disabled="details.trim().length < 10 || submitting"
          >
            {{ submitting ? 'Sending…' : 'Send report' }}
          </button>
          <button type="button" class="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold" @click="$emit('close')">
            Cancel
          </button>
        </div>

        <p class="text-[11px] text-slate-400">
          If you already paid, also open a dispute from your orders — that keeps the money in escrow.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { CheckCircle2, ChevronDown, Check } from 'lucide-vue-next';
import { supportApi } from '@/api_factory/modules/support';

/**
 * Report a listing or a person.
 *
 * Deliberately small: one reason, one sentence. A report tool nobody finishes is useless,
 * and a buyer who has just been misled will not fill in a form.
 */
const props = defineProps<{
  target: { type: 'item' | 'user' | 'business'; id: string; label: string } | null;
}>();

defineEmits<{ (e: 'close'): void }>();

const isDropdownOpen = ref(false);

const reasons = [
  { value: 'misrepresented', label: 'The item is not as described' },
  { value: 'scam', label: 'This looks like a scam' },
  { value: 'counterfeit', label: 'Counterfeit or fake' },
  { value: 'prohibited', label: 'Prohibited or illegal item' },
  { value: 'no_response', label: 'The seller is not responding' },
  { value: 'abusive', label: 'Abusive behaviour' },
  { value: 'other', label: 'Something else' },
];

const reason = ref('misrepresented');

const selectedReasonLabel = computed(() => {
  const match = reasons.find((r) => r.value === reason.value);
  return match ? match.label : 'Select a reason';
});

const selectReason = (val: string) => {
  reason.value = val;
  isDropdownOpen.value = false;
};

const details = ref('');
const error = ref('');
const submitting = ref(false);
const sent = ref(false);

watch(
  () => props.target?.id,
  () => {
    details.value = '';
    error.value = '';
    sent.value = false;
    reason.value = 'misrepresented';
    isDropdownOpen.value = false;
  },
);

const submit = async () => {
  if (!props.target || details.value.trim().length < 10) return;
  submitting.value = true;
  error.value = '';
  try {
    await supportApi.report({
      targetType: props.target.type,
      targetId: props.target.id,
      targetLabel: props.target.label,
      reason: reason.value,
      details: details.value.trim(),
    });
    sent.value = true;
  } catch (err: any) {
    error.value =
      err?.response?.status === 401
        ? 'Please sign in first so we can follow up with you.'
        : err?.response?.data?.message || 'Could not send that report.';
  } finally {
    submitting.value = false;
  }
};
</script>
