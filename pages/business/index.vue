<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <p class="text-sm font-semibold text-slate-500">Opening your business dashboard…</p>
  </div>
</template>

<script setup lang="ts">
/**
 * `/business` used to be a standalone demo dashboard built entirely from hardcoded
 * values — a fake company, a fake subdomain and a fake ₦284,000 revenue figure.
 *
 * The real, API-driven dashboard lives at /dashboard/business, so this route now
 * simply forwards there and the mock is gone. Kept as a route because the navbar
 * and several pages link to `/business`.
 */
definePageMeta({ layout: 'dashboard' });

onMounted(() => navigateTo('/dashboard/business', { replace: true }));
</script>
