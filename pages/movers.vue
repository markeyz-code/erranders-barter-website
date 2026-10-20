<template>
  <BusinessDirectory
    category="logistics"
    eyebrow="Movers"
    title="Movers and logistics on campus"
    subtitle="Luggage porters and moving crews from verified businesses. Each one is bookable and has its own page."
  />
</template>

<script setup lang="ts">
import BusinessDirectory from '~/components/BusinessDirectory.vue';

/**
 * Same storefront as fumigation — the only difference is the category it reads.
 */
definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Movers and logistics — Declutter' });
</script>
