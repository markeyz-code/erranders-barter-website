<template>
  <div class="min-h-screen flex flex-col bg-white font-sans">
    <header class="border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-8 w-8 rounded-lg object-contain" />
          <span class="text-lg font-black tracking-tight text-slate-900">
            Decluttered<span class="text-brand-600">.</span>
          </span>
        </NuxtLink>
        <NuxtLink to="/" class="text-sm font-bold text-slate-600 hover:text-brand-600">Back to home</NuxtLink>
      </div>
    </header>

    <main class="flex-1 flex items-center justify-center px-4 py-20">
      <div class="text-center max-w-md">
        <div class="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Compass class="h-7 w-7 text-slate-400" />
        </div>

        <p class="text-sm font-black uppercase tracking-wider text-brand-600">{{ statusCode }}</p>
        <h1 class="mt-1 text-2xl font-extrabold text-slate-900">{{ heading }}</h1>
        <p class="mt-2 text-sm text-slate-500">{{ message }}</p>

        <div class="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <NuxtLink
            to="/"
            class="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Go to the homepage
          </NuxtLink>
          <NuxtLink
            to="/businesses"
            class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Browse businesses
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Compass } from 'lucide-vue-next';

/**
 * A branded page for anything that does not exist.
 *
 * Without this, an unknown path rendered Nuxt's default error, which reads like a crash
 * rather than a wrong link — the worst impression for someone who followed a stale share.
 */
const props = defineProps<{
  error: { statusCode?: number; statusMessage?: string; message?: string };
}>();

const statusCode = computed(() => props.error?.statusCode || 500);

const heading = computed(() =>
  statusCode.value === 404 ? 'We could not find that page' : 'Something went wrong',
);

const message = computed(() =>
  statusCode.value === 404
    ? 'The link may be out of date, or the page has moved. Everything else is still here.'
    : props.error?.message || 'Please try again in a moment.',
);
</script>
