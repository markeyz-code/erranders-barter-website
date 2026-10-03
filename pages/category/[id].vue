<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-slate-500 font-bold">Redirecting to Explore...</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const categoryId = route.params.id
  router.push(`/explore?category=${categoryId}`)
})
</script>