<template>
  <div class="flex flex-col min-h-screen bg-white text-slate-900">
    <UiToast class="z-[9999999]" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
useSeoMeta({
  ogImage: '/logo.png',
  twitterImage: '/logo.png',
  twitterCard: 'summary_large_image',
})
</script>
<style>
body {
  font-family: 'Outfit', sans-serif !important;
}
</style>