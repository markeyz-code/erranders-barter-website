<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">Become a provider</p>
      <h1 class="text-3xl font-extrabold text-slate-900">Sell your skills on campus</h1>
      <p class="mt-2 text-slate-500 font-medium">
        Offer what you're good at — barbing, tutoring, nails, laundry, photography — set your own
        prices, and let students book the slots that suit you.
      </p>

      <div v-if="applied" class="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 class="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <p class="font-extrabold text-slate-900">You're a provider</p>
        <p class="text-sm text-slate-600 mt-1">Next: add your first service and set your availability.</p>
        <NuxtLink
          to="/dashboard/services"
          class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
        >
          Set up my services
        </NuxtLink>
      </div>

      <form v-else class="mt-8 space-y-5" @submit.prevent="submit">
        <label class="block">
          <span class="text-xs font-bold text-slate-600">Headline</span>
          <input
            v-model="form.headline"
            type="text"
            maxlength="80"
            class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            placeholder="Mobile barber — campus wide"
          />
          <span class="text-[11px] text-slate-400">Shown on your profile and every service card.</span>
        </label>

        <label class="block">
          <span class="text-xs font-bold text-slate-600">About you</span>
          <textarea
            v-model="form.bio"
            rows="4"
            maxlength="600"
            class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            placeholder="What you do, how long you've done it, and what a student can expect."
          />
        </label>

        <div class="block">
          <span class="text-xs font-bold text-slate-600">Skills</span>
          <div class="mt-1.5 flex flex-wrap gap-2">
            <span
              v-for="(skill, i) in form.skills"
              :key="skill"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold"
            >
              {{ skill }}
              <button type="button" class="text-brand-500 hover:text-brand-700" @click="form.skills.splice(i, 1)">
                ×
              </button>
            </span>
          </div>
          <div class="mt-2 flex gap-2">
            <input
              v-model="skillInput"
              type="text"
              class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. Fades, Waist training, Maths tutoring"
              @keydown.enter.prevent="addSkill"
            />
            <button
              type="button"
              class="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
              @click="addSkill"
            >
              Add
            </button>
          </div>
        </div>

        <label class="block">
          <span class="text-xs font-bold text-slate-600">Where you work</span>
          <input
            v-model="form.serviceArea"
            type="text"
            class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            placeholder="e.g. Hostels around Akoka"
          />
        </label>

        <div v-if="error" class="p-3 rounded-xl bg-red-50 border border-red-200">
          <p class="text-xs font-bold text-red-700">{{ error }}</p>
        </div>

        <button
          type="submit"
          class="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-40"
          :disabled="!canSubmit"
        >
          {{ submitting ? 'Setting up…' : 'Become a provider' }}
        </button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { CheckCircle2 } from 'lucide-vue-next';
import { providersApi } from '@/api_factory/modules/providers';
import { getApiError } from '@/composables/modules/services/useServiceFormatting';

/**
 * Provider onboarding. Turns a normal account into a provider by attaching the
 * profile the design doc specifies — there is no separate account model.
 */

definePageMeta({ layout: 'default' });

const form = reactive({ headline: '', bio: '', skills: [] as string[], serviceArea: '' });
const skillInput = ref('');
const submitting = ref(false);
const error = ref('');
const applied = ref(false);

const addSkill = () => {
  const value = skillInput.value.trim();
  if (!value || form.skills.includes(value)) return;
  form.skills.push(value);
  skillInput.value = '';
};

const canSubmit = computed(
  () => form.headline.trim().length > 2 && form.skills.length > 0 && !submitting.value,
);

const submit = async () => {
  if (!canSubmit.value) return;
  submitting.value = true;
  error.value = '';
  try {
    await providersApi.apply({
      headline: form.headline.trim(),
      bio: form.bio.trim() || undefined,
      skills: form.skills,
      serviceArea: form.serviceArea.trim() || undefined,
    });
    applied.value = true;
  } catch (err) {
    error.value = getApiError(err).message;
  } finally {
    submitting.value = false;
  }
};
</script>
