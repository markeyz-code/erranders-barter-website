<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">{{ eyebrow }}</p>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">{{ title }}</h1>
      <p class="mt-1.5 text-sm text-slate-500 font-medium max-w-2xl">{{ subtitle }}</p>

      <div v-if="loading" class="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-52 rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <div v-else-if="error" class="mt-10 py-14 text-center border border-dashed border-slate-200 rounded-2xl">
        <AlertTriangle class="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p class="font-bold text-slate-900">Could not load businesses</p>
        <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
        <button class="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <div v-else-if="rows.length === 0" class="mt-10 py-14 text-center border border-dashed border-slate-200 rounded-2xl">
        <Building2 class="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p class="font-bold text-slate-900">No businesses here yet</p>
        <p class="text-sm text-slate-500 mt-1">
          Nobody has listed {{ category }} on Declutter yet. A business can claim this space.
        </p>
        <NuxtLink to="/become-a-business" class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
          List your business
        </NuxtLink>
      </div>

      <div v-else class="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="biz in rows"
          :key="biz._id"
          :to="`/businesses/${biz.slug}`"
          class="group rounded-2xl border border-slate-200 overflow-hidden hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div class="h-28 bg-slate-100 overflow-hidden">
            <img v-if="biz.banner" :src="biz.banner" :alt="biz.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div class="p-4">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-bold text-slate-900 truncate">{{ biz.name }}</p>
              <span v-if="biz.isVerified" class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Verified</span>
            </div>
            <p class="text-xs font-semibold text-slate-500 capitalize mt-0.5">{{ biz.category }}</p>
            <p v-if="biz.description" class="text-xs text-slate-500 mt-1.5 line-clamp-2">{{ biz.description }}</p>
            <p class="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600">
              <Globe class="w-3 h-3" /> {{ biz.slug }}.erranders.org
            </p>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <p class="text-sm font-bold text-slate-900">Run a {{ category }} business?</p>
        <p class="text-xs text-slate-500 mt-1">
          Get your own page, a {{ 'your-business' }}.erranders.org address, staff management, recruitment
          and a payout ledger.
        </p>
        <NuxtLink to="/become-a-business" class="inline-block mt-2 text-xs font-bold text-brand-600 hover:underline">
          Get started
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Building2, AlertTriangle, Globe } from 'lucide-vue-next';
import { businessesApi, type Business } from '@/api_factory/modules/businesses';

/**
 * A category storefront.
 *
 * These pages used to be hand-written marketing pages with invented prices. They
 * are now a real view of `GET /businesses?category=…`, so adding a business to the
 * database fills the page and removing one empties it.
 */
const props = defineProps<{
  category: string;
  title: string;
  subtitle: string;
  eyebrow: string;
}>();

const rows = ref<Business[]>([]);
const loading = ref(true);
const error = ref('');

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await businessesApi.list({ category: props.category, limit: 24 });
    rows.value = data.data ?? [];
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'The directory did not respond.';
    rows.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>
