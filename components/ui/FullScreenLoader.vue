<template>
  <Transition name="fade">
    <div v-if="isGlobalLoading" class="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div class="relative flex flex-col items-center">
        <!-- Pulsing background circles -->
        <div class="absolute inset-0 w-32 h-32 bg-brand-100 rounded-full animate-ping opacity-75"></div>
        <div class="absolute -inset-4 w-40 h-40 bg-brand-50 rounded-full animate-pulse opacity-50 delay-75"></div>
        
        <!-- Logo -->
        <div class="relative z-10 bg-white p-4 rounded-3xl shadow-xl shadow-brand-100/50">
          <img src="@/assets/img/logo.png" alt="Barter" class="h-12 w-auto animate-bounce" style="animation-duration: 2s;" />
        </div>
        
        <!-- Loading Text -->
        <div class="mt-8 text-brand-600 font-black  uppercase text-sm animate-pulse">
          {{ loadingText }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useLoader } from '~/composables/useLoader'

const { isGlobalLoading, loadingText } = useLoader()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
