<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
      <LifeBuoy class="w-12 h-12 text-brand-600 mx-auto mb-4" />
      <h1 class="text-2xl font-extrabold text-slate-900">The FAQ has moved</h1>
      <p class="text-sm text-slate-500 mt-2">
        Every question — selling, buying, delivery, swaps, safety and business accounts — is
        now answered in one searchable place.
      </p>
      <NuxtLink to="/help" class="inline-block mt-6 px-6 py-3 rounded-xl bg-brand-600 text-white text-sm font-bold">
        Open the help centre
      </NuxtLink>
    </div>
  </main>
</template>

<script setup>
import { LifeBuoy } from 'lucide-vue-next';

/**
 * The old FAQ answered three questions and left the rest to guesswork. The help centre
 * replaces it; this page stays only so existing links do not dead-end.
 */
definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'FAQ — Decluttered' });
</script>
