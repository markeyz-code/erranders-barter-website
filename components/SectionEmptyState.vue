<template>
  <div class="rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 sm:py-12 text-center">
    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400">
      <component :is="icon" class="h-5 w-5" />
    </div>

    <p class="mt-4 text-sm font-black text-slate-900">{{ title }}</p>
    <p class="mx-auto mt-1 max-w-sm text-xs sm:text-sm font-medium leading-relaxed text-slate-500">
      {{ message }}
    </p>

    <NuxtLink
      v-if="ctaTo && ctaLabel"
      :to="ctaTo"
      class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-600"
    >
      <span>{{ ctaLabel }}</span>
      <ArrowRight class="h-3.5 w-3.5" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';

/**
 * What a section shows when it has nothing to show.
 *
 * An empty grid leaves a heading with blank space under it, which reads as a broken page
 * rather than a quiet marketplace. This keeps the section shaped and points at the action
 * that would fill it.
 */
defineProps<{
  icon: any;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaTo?: string;
}>();
</script>
