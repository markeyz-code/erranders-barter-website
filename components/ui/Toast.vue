<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-start gap-4 cursor-pointer pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
          @click="handleToastClick(toast)"
        >
          <!-- Subtle color indicator strip on the left -->
          <div :class="[
            'absolute left-0 top-0 bottom-0 w-1 transition-colors',
            { 'bg-rose-500': toast.type === 'error', 'bg-emerald-500': toast.type === 'success', 'bg-amber-500': toast.type === 'warning', 'bg-brand-500': toast.type === 'info' }
          ]"></div>

          <!-- Status Icon container -->
          <div class="flex-shrink-0 mt-0.5 p-1.5 rounded-full" :class="{ 'bg-rose-50 text-rose-500': toast.type === 'error', 'bg-emerald-50 text-emerald-500': toast.type === 'success', 'bg-amber-50 text-amber-500': toast.type === 'warning', 'bg-brand-50 text-brand-500': toast.type === 'info' }">
            <CheckCircle v-if="toast.type === 'success'" :size="18" class="stroke-[2.5]" />
            <AlertCircle v-else-if="toast.type === 'error'" :size="18" class="stroke-[2.5]" />
            <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" class="stroke-[2.5]" />
            <Info v-else :size="18" class="stroke-[2.5]" />
          </div>
          
          <!-- Content Container -->
          <div class="flex-1 min-w-0 pt-0.5">
            <h4 class="font-black text-sm text-slate-900 leading-snug tracking-tight mb-1">
              {{ toast.title || (toast.type.charAt(0).toUpperCase() + toast.type.slice(1)) }}
            </h4>
            <p class="text-xs font-medium text-slate-500 leading-relaxed">
              {{ toast.message }}
            </p>
          </div>
          
          <!-- Close button -->
          <div class="flex-shrink-0 self-start text-slate-300 hover:text-slate-600 transition-colors ml-2 -mt-1 -mr-1 p-2 opacity-0 group-hover:opacity-100">
            <X :size="16" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const handleToastClick = (toast: any) => {
  if (toast.action) {
    toast.action()
  }
  removeToast(toast.id)
}
</script>

<style scoped>
/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}
</style>