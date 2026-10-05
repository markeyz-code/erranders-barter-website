<template>
  <div class="flex flex-col min-h-screen">
    <AppNavbar />
    <main class="flex-grow pt-28">
      <slot />
    </main>
    <AppFooter v-if="route.path === '/'" />
    <ChatWidget />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ChatWidget from '~/components/ChatWidget.vue'

const route = useRoute()
</script>