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
        <label class="block">
          <span class="text-xs font-bold text-slate-600">What is wrong?</span>
          <select v-model="reason" class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm">
            <option value="misrepresented">The item is not as described</option>
            <option value="scam">This looks like a scam</option>
            <option value="counterfeit">Counterfeit or fake</option>
            <option value="prohibited">Prohibited or illegal item</option>
            <option value="no_response">The seller is not responding</option>
            <option value="abusive">Abusive behaviour</option>
            <option value="other">Something else</option>
          </select>
        </label>

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
import { reactive, ref, watch } from 'vue';
import { CheckCircle2 } from 'lucide-vue-next';
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

const reason = ref('misrepresented');
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
