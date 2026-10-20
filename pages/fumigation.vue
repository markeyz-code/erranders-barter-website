<template>
  <BusinessDirectory
    category="fumigation"
    eyebrow="Fumigation"
    title="Fumigation crews on campus"
    subtitle="Pest control and room fumigation from verified businesses. Each one is bookable and has its own page."
  />
</template>

<script setup lang="ts">
import BusinessDirectory from '~/components/BusinessDirectory.vue';

/**
 * Fumigation is one example of a business category, not a special case — this page
 * is just the `fumigation` slice of the business directory.
 */
definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Fumigation on campus — Declutter' });
</script>
