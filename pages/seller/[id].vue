<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const id = route.params.id;
  router.replace(`/profile/${id}`);
});
</script>

<template>
  <div class="min-h-screen bg-black flex items-center justify-center text-white text-xs">
    Redirecting to profile...
  </div>
</template>
