<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden text-white"
    >
      <!-- Header -->
      <div class="px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Video class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm sm:text-base font-bold truncate">{{ title || 'Virtual Appointment' }}</h3>
            <p class="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Room via Jitsi Meet
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <a
            :href="meetingUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Open in New Tab</span>
          </a>
          <button
            @click="emit('close')"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close call modal"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Video Call Iframe -->
      <div class="flex-1 bg-black relative">
        <div v-if="iframeLoading" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 class="w-8 h-8 animate-spin text-brand-500" />
          <p class="text-xs font-medium">Connecting to secure video room...</p>
        </div>
        <iframe
          v-if="embedUrl"
          :src="embedUrl"
          class="w-full h-full border-0"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          @load="iframeLoading = false"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Video, ExternalLink, X, Loader2 } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  meetingUrl?: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const iframeLoading = ref(true);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      iframeLoading.value = true;
    }
  }
);

/**
 * Configure clean in-app iframe URL for Jitsi Meet
 */
const embedUrl = computed(() => {
  if (!props.meetingUrl) return '';
  try {
    const url = new URL(props.meetingUrl);
    if (!url.hash) {
      url.hash = 'config.prejoinPageEnabled=false&config.disableDeepLinking=true';
    }
    return url.toString();
  } catch {
    return props.meetingUrl;
  }
});
</script>
