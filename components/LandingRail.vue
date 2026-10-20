<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
    <div class="flex items-end justify-between mb-4">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-slate-500 font-medium">{{ subtitle }}</p>
      </div>
      <NuxtLink
        v-if="actionTo"
        :to="actionTo"
        class="text-sm font-bold text-brand-600 hover:underline shrink-0"
      >
        {{ actionLabel || 'See all' }}
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex gap-4 overflow-hidden">
      <div
        v-for="i in 6"
        :key="i"
        class="w-[190px] shrink-0 aspect-square rounded-2xl bg-slate-100 animate-pulse"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="empty"
      class="py-9 text-center border border-dashed border-slate-200 rounded-2xl"
    >
      <p class="text-sm font-semibold text-slate-500">{{ emptyMessage || 'Nothing here yet' }}</p>
    </div>

    <!-- Content: a horizontal rail on small screens, a single row that can scroll on any size -->
    <div v-else class="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * One horizontal content rail on the landing page.
 *
 * Kept deliberately dumb: it owns layout and the loading/empty states, and the
 * parent decides what the cards are. That keeps the landing page readable when
 * there are five different sections on it.
 */
defineProps<{
  title: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  actionTo?: string;
  actionLabel?: string;
}>();
</script>
