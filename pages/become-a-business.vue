<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">For student businesses & hustles</p>
      <h1 class="text-3xl font-extrabold text-slate-900">Run your student business on Declutter</h1>
      <p class="mt-2 text-slate-500 font-medium">
        Tutorial centers, nail techs, jewelry sellers, barbers, campus bakers, tech repair — get an instant branded storefront, your own subdomain, DRM protected resource vault, Study Guard, and business dashboard.
      </p>

      <!-- The three things this actually gives them, not marketing fluff -->
      <div class="mt-6 grid sm:grid-cols-3 gap-3">
        <div v-for="b in BENEFITS" :key="b.title" class="p-3 rounded-xl border border-slate-200">
          <component :is="b.icon" class="w-4 h-4 text-brand-600 mb-1.5" />
          <p class="text-xs font-bold text-slate-900">{{ b.title }}</p>
          <p class="text-[11px] text-slate-500 mt-0.5">{{ b.body }}</p>
        </div>
      </div>

      <div v-if="created" class="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 class="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <p class="font-extrabold text-slate-900">{{ created.name }} is set up</p>
        <p class="text-sm text-slate-600 mt-1">
          Your page is live at
          <a :href="`https://${created.slug}.erranders.org`" target="_blank" rel="noopener" class="font-bold text-brand-600 hover:underline">{{ created.slug }}.erranders.org</a>
        </p>
        <div class="mt-5 flex gap-3 justify-center">
          <a :href="adminUrl" target="_blank" rel="noopener" class="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
            Open my business dashboard
          </a>
        </div>
      </div>

      <form v-else class="mt-8 space-y-5" @submit.prevent="submit">
        <label class="block">
          <span class="text-xs font-bold text-slate-600">Business name</span>
          <input
            v-model="form.name"
            type="text"
            class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            placeholder="FumigPro Services"
            @input="suggestSlug"
          />
        </label>

        <label class="block">
          <span class="text-xs font-bold text-slate-600">Your web address</span>
          <div class="mt-1.5 flex items-stretch rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <input
              v-model="form.slug"
              type="text"
              class="flex-1 bg-transparent px-3 py-2.5 text-sm font-semibold text-right focus:outline-none"
              placeholder="your-business"
            />
            <span class="px-3 py-2.5 text-xs font-semibold text-slate-500 border-l border-slate-200 bg-white select-none">
              .erranders.org
            </span>
          </div>
          <span class="text-[11px] text-slate-400">
            Letters, numbers and hyphens — this becomes
            <span class="font-semibold text-slate-600">{{ slugPreview }}.erranders.org</span>
          </span>
        </label>

        <label class="block">
          <span class="text-xs font-bold text-slate-600">Category / Type of Hustle</span>
          <input
            v-model="form.category"
            type="text"
            class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            placeholder="e.g. nail tech, tutorial center, jewelry, barbing…"
          />
          <div class="mt-2 flex flex-wrap gap-1.5">
            <button
              v-for="h in POPULAR_HUSTLES"
              :key="h.value"
              type="button"
              class="px-2 py-0.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer"
              :class="form.category.toLowerCase() === h.value ? 'bg-brand-50 border-brand-400 text-brand-700 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
              @click="form.category = h.value"
            >
              {{ h.label }}
            </button>
          </div>
        </label>

        <label class="block">
          <span class="text-xs font-bold text-slate-600">What you do</span>
          <textarea
            v-model="form.description"
            rows="4"
            class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            placeholder="What you offer, who you serve, and how a student books you."
          />
        </label>

        <div class="grid sm:grid-cols-2 gap-4">
          <label class="block">
            <span class="text-xs font-bold text-slate-600">Phone</span>
            <input v-model="form.phone" type="tel" class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
          </label>
          <label class="block">
            <span class="text-xs font-bold text-slate-600">Email</span>
            <input v-model="form.email" type="email" class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" />
          </label>
        </div>

        <label class="block">
          <span class="text-xs font-bold text-slate-600">Address</span>
          <input v-model="form.address" type="text" class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500" placeholder="12 Ogunlana Drive, Akoka" />
        </label>

        <div v-if="error" class="p-3 rounded-xl bg-red-50 border border-red-200">
          <p class="text-xs font-bold text-red-700">{{ error }}</p>
        </div>

        <button
          type="submit"
          class="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-40"
          :disabled="!canSubmit"
        >
          {{ submitting ? 'Setting up…' : 'Create my business' }}
        </button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { CheckCircle2, Users, Briefcase, Wallet } from 'lucide-vue-next';
import { businessesApi, type Business } from '@/api_factory/modules/businesses';

/**
 * Business onboarding. Turns an ordinary account into a business owner — the
 * business record is what the mini-admin, the subdomain and the commission hang off.
 */

definePageMeta({ layout: 'default' });

const BENEFITS = [
  { icon: Users, title: 'Staff', body: 'Add the people who work for you.' },
  { icon: Briefcase, title: 'Recruitment', body: 'Post open roles on your page.' },
  { icon: Wallet, title: 'Payouts', body: 'See gross, commission and net.' },
];

const POPULAR_HUSTLES = [
  { label: '📚 Tutorial Center', value: 'tutorial center' },
  { label: '💅 Nail Tech / Lashes', value: 'nail tech' },
  { label: '💍 Jewelry & Beads', value: 'jewelry' },
  { label: '✂️ Barbing & Grooming', value: 'barbing' },
  { label: '🍰 Campus Baker / Food', value: 'baking' },
  { label: '📱 Tech & Gadget Repair', value: 'tech repairs' },
  { label: '👗 Fashion Design / Thrift', value: 'fashion' },
  { label: '💇‍♀️ Hair Styling & Braids', value: 'hair styling' },
  { label: '🧺 Laundry & Ironing', value: 'laundry' },
  { label: '📸 Photography & Media', value: 'photography' },
  { label: '🧹 Cleaning & Moving', value: 'cleaning' },
];

const form = reactive({
  name: '', slug: '', category: '', description: '', phone: '', email: '', address: '',
});
const adminUrl = String(useRuntimeConfig().public.businessAdminUrl || 'https://business.erranders.org');
const submitting = ref(false);
const error = ref('');
const created = ref<Business | null>(null);

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const suggestSlug = () => {
  // Only auto-fill while the user has not typed their own address.
  if (!form.slug || form.slug === slugify(form.name.slice(0, form.slug.length))) {
    form.slug = slugify(form.name);
  }
};

const slugPreview = computed(() => slugify(form.slug) || 'your-business');

const canSubmit = computed(
  () => form.name.trim().length > 1 && slugify(form.slug).length > 1 && form.category.trim().length > 1 && !submitting.value,
);

const submit = async () => {
  if (!canSubmit.value) return;
  submitting.value = true;
  error.value = '';
  try {
    const { data } = await businessesApi.apply({
      name: form.name.trim(),
      slug: slugify(form.slug),
      category: form.category.trim().toLowerCase(),
      description: form.description.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
    });
    created.value = data;
  } catch (err: any) {
    error.value =
      err?.response?.status === 409
        ? 'That address is already taken — try another.'
        : err?.response?.data?.message || 'We could not create your business.';
  } finally {
    submitting.value = false;
  }
};
</script>
