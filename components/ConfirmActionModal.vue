<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-full max-w-md rounded-2xl border border-slate-200 overflow-hidden">
      <div class="p-6">
        <div
          class="w-11 h-11 rounded-full flex items-center justify-center mb-4"
          :class="tone === 'danger' ? 'bg-red-50 text-red-500' : 'bg-brand-50 text-brand-600'"
        >
          <AlertTriangle v-if="tone === 'danger'" class="w-5 h-5" />
          <CheckCircle2 v-else class="w-5 h-5" />
        </div>

        <h3 class="text-lg font-black text-slate-900">{{ title }}</h3>
        <p class="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{{ message }}</p>

        <div v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <p class="text-sm font-bold text-red-700">{{ error }}</p>
        </div>

        <div v-if="showReason" class="mt-4">
          <label class="block text-sm font-bold text-slate-700 mb-1.5">{{ reasonLabel }}</label>
          <textarea
            v-model="reason"
            rows="3"
            :placeholder="reasonPlaceholder"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors resize-none"
          ></textarea>
          <p class="text-[11px] font-semibold text-slate-400 mt-1">
            {{ requireReason ? 'Required — the other party will see this.' : 'Optional.' }}
          </p>
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          :disabled="submitting"
          @click="$emit('close')"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl text-white font-black text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="tone === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-600 hover:bg-brand-700'"
          :disabled="submitting || (requireReason && !reason.trim())"
          @click="confirm"
        >
          <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
          {{ submitting ? 'Working…' : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-vue-next';

/**
 * Confirmation dialog for destructive or irreversible booking/service actions.
 * The reason box is used by cancel (required) and decline (optional).
 */

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    tone?: 'danger' | 'brand';
    showReason?: boolean;
    requireReason?: boolean;
    reasonLabel?: string;
    reasonPlaceholder?: string;
    submitting?: boolean;
    error?: string;
  }>(),
  {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    tone: 'danger',
    showReason: false,
    requireReason: false,
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Tell the other party what changed…',
    submitting: false,
    error: '',
  },
);

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'confirm', reason: string): void;
}>();

const reason = ref('');

watch(
  () => props.isOpen,
  (open) => {
    if (open) reason.value = '';
  },
);

const confirm = () => {
  if (props.submitting) return;
  if (props.requireReason && !reason.value.trim()) return;
  emit('confirm', reason.value.trim());
};
</script>
