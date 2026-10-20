<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <h1 class="text-3xl font-extrabold text-slate-900">Contact support</h1>
      <p class="text-slate-500 mt-1 text-sm font-medium">
        Every message creates a real ticket with a reference you can quote.
      </p>

      <!-- Success -->
      <div v-if="reference" class="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 class="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <p class="font-extrabold text-slate-900">Message received</p>
        <p class="text-sm text-slate-600 mt-1">Your reference is</p>
        <p class="mt-1 text-lg font-black font-mono text-emerald-700">{{ reference }}</p>
        <p class="text-xs text-slate-500 mt-3">
          Keep it — quote it if you follow up. We reply to the email you gave us.
        </p>
        <button class="mt-5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700" @click="reset">
          Send another message
        </button>
      </div>

      <form v-else class="mt-6 space-y-4" @submit.prevent="submit">
        <label class="block">
          <span class="text-sm font-bold text-slate-700">Your name</span>
          <input v-model="form.name" required class="mt-1 w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:outline-none focus:border-brand-500" />
        </label>
        <label class="block">
          <span class="text-sm font-bold text-slate-700">Email</span>
          <input v-model="form.email" type="email" required class="mt-1 w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:outline-none focus:border-brand-500" />
        </label>
        <label class="block">
          <span class="text-sm font-bold text-slate-700">Subject</span>
          <input v-model="form.subject" required placeholder="e.g. My payout is pending" class="mt-1 w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:outline-none focus:border-brand-500" />
        </label>
        <label class="block">
          <span class="text-sm font-bold text-slate-700">Message</span>
          <textarea v-model="form.message" required rows="5" class="mt-1 w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm focus:outline-none focus:border-brand-500" />
        </label>

        <p v-if="error" class="text-xs font-bold text-red-600">{{ error }}</p>

        <button
          type="submit"
          class="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-40"
          :disabled="!canSubmit"
        >
          {{ submitting ? 'Sending…' : 'Send message' }}
        </button>
      </form>

      <!-- Real people, real numbers -->
      <div class="mt-8 rounded-2xl border border-slate-200 p-5 bg-slate-50">
        <p class="text-sm font-extrabold text-slate-900">Prefer to call?</p>
        <p class="text-xs text-slate-500 mt-1">The support team answers during the day.</p>
        <div class="mt-3 grid sm:grid-cols-2 gap-2">
          <a
            v-for="person in SUPPORT"
            :key="person.phone"
            :href="`tel:${person.phone}`"
            class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-brand-300"
          >
            <Phone class="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>{{ person.name }}</span>
            <span class="ml-auto font-mono text-slate-500">{{ person.phone }}</span>
          </a>
        </div>
        <NuxtLink to="/help" class="mt-4 inline-block text-xs font-bold text-brand-600 hover:underline">
          Most answers are in the help centre
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { CheckCircle2, Phone } from 'lucide-vue-next';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { supportApi } from '@/api_factory/modules/support';

/**
 * Contact support.
 *
 * This used to show a success toast and send nothing — the worst possible behaviour for a
 * support form, because the user believes they have been heard. It now creates a real
 * ticket and shows the reference number.
 */

definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Contact support — Decluttered' });

const SUPPORT = [
  { name: 'Ruth', phone: '+2348106600919' },
  { name: 'Ife', phone: '+2348179495795' },
  { name: 'Kim', phone: '+2348052854256' },
  { name: 'Brandy', phone: '+2348139908262' },
];

const form = reactive({ name: '', email: '', subject: '', message: '' });
const submitting = ref(false);
const error = ref('');
const reference = ref('');

const canSubmit = computed(
  () =>
    !submitting.value &&
    form.name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(form.email.trim()) &&
    form.subject.trim().length > 2 &&
    form.message.trim().length > 9,
);

const submit = async () => {
  if (!canSubmit.value) return;
  submitting.value = true;
  error.value = '';
  try {
    const { data } = await supportApi.createTicket({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    reference.value = data.reference;
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Could not send your message. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const reset = () => {
  reference.value = '';
  form.subject = '';
  form.message = '';
};
</script>
