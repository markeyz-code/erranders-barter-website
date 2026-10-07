<template>
  <div class="flex flex-col min-h-screen bg-white text-slate-900">
    <UiToast class="z-[9999999]" />
    <UiFullScreenLoader />
    <AuthModal :isOpen="isGlobalAuthModalOpen" @close="isGlobalAuthModalOpen = false" class="z-[999999]" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import AuthModal from '~/components/AuthModal.vue'
import { useAuth } from '~/composables/useAuth'

const { isGlobalAuthModalOpen } = useAuth()

onMounted(() => {
  const openModal = () => { isGlobalAuthModalOpen.value = true }
  window.addEventListener('open-auth-modal', openModal)
  onUnmounted(() => {
    window.removeEventListener('open-auth-modal', openModal)
  })
})

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