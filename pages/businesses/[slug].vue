<template>
  <main class="min-h-screen bg-white">
    <div v-if="loading" class="max-w-5xl mx-auto px-4 py-10">
      <div class="h-40 rounded-2xl bg-slate-100 animate-pulse mb-5" />
      <div class="h-64 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else-if="error" class="max-w-5xl mx-auto px-4 py-24 text-center">
      <Building2 class="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <p class="text-xl font-extrabold text-slate-900">This business isn't on Declutter</p>
      <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
      <NuxtLink to="/become-a-business" class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
        List your business
      </NuxtLink>
    </div>

    <template v-else-if="business">
      <!-- Banner + identity -->
      <div class="relative">
        <div class="h-40 sm:h-56 bg-slate-900 overflow-hidden">
          <img v-if="business.banner" :src="business.banner" :alt="business.name" class="w-full h-full object-cover opacity-80" />
        </div>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="-mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
            <div class="w-24 h-24 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden shrink-0">
              <img v-if="business.logo" :src="business.logo" :alt="business.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-2xl font-black">
                {{ business.name.charAt(0) }}
              </div>
            </div>
            <div class="pb-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-2xl font-extrabold text-slate-900">{{ business.name }}</h1>
                <span v-if="business.isVerified" class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                  Verified
                </span>
              </div>
              <p class="text-sm font-semibold text-slate-500 capitalize">{{ business.category }}</p>
              <!-- Every business owns a subdomain, not a path. -->
              <a
                :href="`https://${business.slug}.erranders.org`"
                target="_blank"
                rel="noopener"
                class="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
              >
                <Globe class="w-3 h-3" /> {{ business.slug }}.erranders.org
              </a>
            </div>
          </div>

          <p v-if="business.description" class="mt-4 text-slate-600 leading-relaxed">{{ business.description }}</p>

          <div class="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <span v-if="business.address" class="inline-flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5" /> {{ business.address }}</span>
            <span v-if="business.phone" class="inline-flex items-center gap-1.5"><Phone class="w-3.5 h-3.5" /> {{ business.phone }}</span>
            <span v-if="business.email" class="inline-flex items-center gap-1.5"><Mail class="w-3.5 h-3.5" /> {{ business.email }}</span>
          </div>
        </div>
      </div>

      <!-- Open roles -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-lg font-extrabold text-slate-900 mb-1">Work with us</h2>
        <p class="text-sm text-slate-500 font-medium mb-4">Open roles at {{ business.name }}</p>

        <div v-if="openings.length === 0" class="py-10 text-center border border-dashed border-slate-200 rounded-2xl">
          <p class="text-sm font-semibold text-slate-500">No open roles right now.</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="role in openings" :key="role._id" class="rounded-2xl border border-slate-200 p-4">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-bold text-slate-900">{{ role.title }}</p>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold capitalize">
                {{ role.type.replace('_', ' ') }}
              </span>
              <span v-if="role.pay" class="text-xs font-bold text-brand-600">{{ role.pay }}</span>
            </div>
            <p v-if="role.description" class="mt-1.5 text-sm text-slate-600">{{ role.description }}</p>
          </div>
        </div>

        <p class="mt-6 text-xs text-slate-400">
          To apply, message {{ business.name }} on Declutter — they'll arrange the rest with you.
        </p>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Building2, MapPin, Phone, Mail, Globe } from 'lucide-vue-next';
import { businessesApi, type Business, type BusinessOpening } from '@/api_factory/modules/businesses';

/**
 * Public page for one business. Reachable directly, and also served as the
 * subdomain landing (see middleware/business-domain.ts).
 *
 * `?business=<slug>` is accepted as a fallback so this works on localhost and on
 * preview URLs where wildcard DNS is not available.
 */

definePageMeta({ layout: 'default' });

const route = useRoute();
const slug = computed(() =>
  String(route.params.slug || route.query.business || ''),
);

const business = ref<Business | null>(null);
const openings = ref<BusinessOpening[]>([]);
const loading = ref(true);
const error = ref('');

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await businessesApi.getBySlug(slug.value);
    business.value = data.business;
    openings.value = (data.openings ?? []).filter((o) => o.isOpen !== false);
    useSeoMeta({ title: `${data.business.name} — Declutter` });
  } catch (err: any) {
    error.value =
      err?.response?.status === 404
        ? 'No business has that address.'
        : err?.response?.data?.message || 'We could not load this business.';
    business.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>
