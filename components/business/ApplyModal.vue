<template>
  <div v-if="role" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl max-w-md w-full p-5">
      <h3 class="text-lg font-extrabold text-slate-900">Apply · {{ role.title }}</h3>
      <p class="text-xs text-slate-500 mt-0.5">{{ businessName }}</p>

      <div v-if="applied" class="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
        <CheckCircle2 class="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-900">Application sent</p>
        <p class="text-xs text-slate-600 mt-1">{{ businessName }} will review it and contact you.</p>
      </div>

      <form v-else class="mt-4 space-y-3" @submit.prevent="submit">
        <input v-model="form.name" placeholder="Your name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <input v-model="form.email" type="email" placeholder="Email" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <input v-model="form.phone" placeholder="Phone (optional)" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <textarea v-model="form.message" rows="3" placeholder="Why you're a good fit (optional)" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <p v-if="error" class="text-xs font-bold text-red-600">{{ error }}</p>
        <div class="flex gap-2">
          <button type="submit" class="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold disabled:opacity-40" :disabled="!canSubmit">
            {{ submitting ? 'Sending…' : 'Send application' }}
          </button>
          <button type="button" class="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { CheckCircle2 } from 'lucide-vue-next';
import { businessesApi } from '@/api_factory/modules/businesses';

/**
 * Public job application.
 *
 * No account required — requiring one would quietly kill recruitment. The API refuses a
 * duplicate application and that message is shown verbatim.
 */
const props = defineProps<{
  role: { _id: string; title: string } | null;
  businessName: string;
  slug: string;
}>();

const emit = defineEmits<{ (e: 'close'): void; (e: 'applied'): void }>();

const form = reactive({ name: '', email: '', phone: '', message: '' });
const error = ref('');
const submitting = ref(false);
const applied = ref(false);

const canSubmit = computed(
  () => form.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(form.email.trim()) && !submitting.value,
);

// Reset each time a different role is opened.
watch(
  () => props.role?._id,
  () => {
    error.value = '';
    applied.value = false;
    form.name = form.email = form.phone = form.message = '';
  },
);

const submit = async () => {
  if (!canSubmit.value || !props.role) return;
  submitting.value = true;
  error.value = '';
  try {
    await businessesApi.applyToOpening(props.slug, props.role._id, {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      message: form.message.trim() || undefined,
    });
    applied.value = true;
    emit('applied');
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Could not send your application.';
  } finally {
    submitting.value = false;
  }
};
</script>
