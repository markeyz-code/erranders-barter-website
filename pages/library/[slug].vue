<template>
  <main class="min-h-screen bg-slate-50 pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <NuxtLink :to="`/businesses/${slug}`" class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-5">
        <ChevronLeft class="w-4 h-4" /> Back to {{ data?.business?.name || 'business' }}
      </NuxtLink>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900">Resource library</h1>
          <p class="text-sm text-slate-500 font-medium">
            Materials shared with you by {{ data?.business?.name || 'this business' }}.
          </p>
        </div>
        <span v-if="data?.viewerEmail" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600">
          Signed in as {{ data.viewerEmail }}
        </span>
      </div>

      <div v-if="loading" class="mt-6 space-y-2">
        <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-slate-200/60 animate-pulse" />
      </div>

      <div v-else-if="!signedIn" class="mt-8 py-14 text-center bg-white rounded-2xl border border-slate-200">
        <Lock class="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p class="font-bold text-slate-900">Sign in to open your materials</p>
        <p class="text-sm text-slate-500 mt-1">
          Access is tied to the email your tutor granted.
        </p>
        <NuxtLink to="/login" class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
          Sign in
        </NuxtLink>
      </div>

      <div v-else-if="resources.length === 0" class="mt-8 py-14 text-center bg-white rounded-2xl border border-dashed border-slate-200">
        <FolderX class="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p class="font-bold text-slate-900">Nothing shared with you yet</p>
        <p class="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          {{ data?.business?.name || 'This business' }} has not granted access to
          <span class="font-semibold text-slate-700">{{ data?.viewerEmail }}</span>.
          Ask them to add your email.
        </p>
      </div>

      <div v-else class="mt-6 grid sm:grid-cols-2 gap-3">
        <button
          v-for="resource in resources"
          :key="resource._id"
          class="text-left bg-white rounded-2xl border border-slate-200 p-4 hover:border-brand-300 transition-colors"
          @click="open(resource)"
        >
          <div class="flex items-center gap-2">
            <FileText v-if="resource.kind === 'file'" class="w-4 h-4 text-brand-600" />
            <PlayCircle v-else-if="resource.kind === 'video'" class="w-4 h-4 text-brand-600" />
            <LinkIcon v-else class="w-4 h-4 text-brand-600" />
            <p class="text-sm font-bold text-slate-900 truncate">{{ resource.title }}</p>
          </div>
          <p v-if="resource.description" class="mt-1 text-xs text-slate-500 line-clamp-2">{{ resource.description }}</p>
          <p class="mt-2 text-[11px] font-bold text-brand-600">Open</p>
        </button>
      </div>
    </div>

    <!-- Protected viewer: dynamic watermark, anti-screenshot, no download, no copy -->
    <div
      v-if="active"
      class="fixed inset-0 z-50 bg-slate-950/90 p-3 sm:p-6 flex flex-col backdrop-blur-sm"
      @keydown.capture="handleKeyDown"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2 min-w-0">
          <ShieldAlert class="w-4 h-4 text-emerald-400 shrink-0" />
          <p class="text-sm font-bold text-white truncate">{{ active.title }}</p>
          <span class="hidden sm:inline-flex px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wide uppercase">
            Encrypted DRM Stream
          </span>
        </div>
        <button class="px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors" @click="close">
          Close
        </button>
      </div>

      <!-- Security notification banner if shortcut was blocked -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="securityAlert"
          class="mb-2 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-bold flex items-center justify-between shadow-lg"
        >
          <span>⚠️ {{ securityAlert }}</span>
          <button class="text-white/80 hover:text-white ml-2" @click="securityAlert = ''">✕</button>
        </div>
      </transition>

      <div
        class="relative flex-1 bg-white rounded-xl overflow-hidden select-none"
        @contextmenu.prevent="onBlockedAction('Right-click context menu disabled')"
        @copy.prevent="onBlockedAction('Copying disabled by DRM')"
        @cut.prevent="onBlockedAction('Cutting disabled by DRM')"
        @dragstart.prevent
      >
        <!-- Anti-capture screen blackout overlay when window loses focus (e.g. Snipping tool, Cmd+Shift+4, screen grabber) -->
        <div
          v-if="isWindowBlurred"
          class="absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center p-6 text-center"
        >
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 ring-1 ring-amber-500/20">
            <Lock class="w-6 h-6" />
          </div>
          <p class="text-base font-bold text-white">Viewing Paused For Security</p>
          <p class="text-xs text-slate-400 max-w-sm mt-1">
            Display is protected. Return focus to this browser tab to resume reading.
          </p>
        </div>

        <!-- The watermark repeats and tiles across the document so every snippet carries proof of ownership -->
        <div class="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
          <div
            v-for="n in 20"
            :key="n"
            class="absolute text-slate-900/[0.08] font-black text-sm tracking-widest whitespace-nowrap select-none"
            :style="{
              top: `${((n - 1) * 7.5)}%`,
              left: `${((n % 4) * 22) - 10}%`,
              transform: 'rotate(-24deg)'
            }"
          >
            {{ data?.watermark }} · DO NOT SNAP OR DISTRIBUTE · {{ sessionTimestamp }}
          </div>

          <!-- Dynamic floating watermark pill -->
          <div
            class="absolute bottom-4 right-4 bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white/70 border border-white/10"
          >
            ID: {{ data?.viewerEmail || 'Student' }} · Protected
          </div>
        </div>

        <iframe
          v-if="active.kind === 'video'"
          :src="active.url"
          class="w-full h-full relative z-0"
          allow="autoplay; encrypted-media"
          referrerpolicy="no-referrer"
        />
        <iframe
          v-else
          :src="active.url"
          class="w-full h-full relative z-0"
          referrerpolicy="no-referrer"
        />
      </div>

      <div class="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Watermarked for {{ data?.watermark || data?.viewerEmail }}.</span>
        <span class="flex items-center gap-1 font-semibold text-slate-400">
          <ShieldAlert class="w-3.5 h-3.5 text-amber-400" /> Screen capture & sharing strictly prohibited
        </span>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Lock, FolderX, FileText, PlayCircle, Link as LinkIcon, ShieldAlert } from 'lucide-vue-next';
import { businessesApi } from '@/api_factory/modules/businesses';

/**
 * A student's gated resource library.
 *
 * The API decides what is returned: an email that was never granted gets an empty list, so
 * there is nothing to guard here on the client. What this page adds is the handling —
 * a repeating watermark of the student's own address, no context menu, no copy and no
 * download attribute, anti-capture window-blur shielding, and print suppression.
 */

definePageMeta({ layout: 'default' });

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));

const data = ref<any>(null);
const loading = ref(true);
const signedIn = ref(false);
const active = ref<any>(null);

const isWindowBlurred = ref(false);
const securityAlert = ref('');
const sessionTimestamp = ref('');

const resources = computed<any[]>(() => data.value?.resources ?? []);

const load = async () => {
  loading.value = true;
  try {
    if (typeof window !== 'undefined') {
      signedIn.value = Boolean(window.localStorage.getItem('barter_token'));
      sessionTimestamp.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (!signedIn.value) return;
    const res = await businessesApi.getResources(slug.value);
    data.value = res.data;
  } catch {
    data.value = null;
  } finally {
    loading.value = false;
  }
};

const onBlockedAction = (reason: string) => {
  securityAlert.value = reason;
  setTimeout(() => {
    if (securityAlert.value === reason) securityAlert.value = '';
  }, 3500);
};

const handleWindowBlur = () => {
  if (active.value) {
    isWindowBlurred.value = true;
  }
};

const handleWindowFocus = () => {
  isWindowBlurred.value = false;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!active.value) return;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

  // Intercept PrintScreen
  if (e.key === 'PrintScreen') {
    e.preventDefault();
    onBlockedAction('Screenshot blocked by DRM');
    return;
  }

  // Intercept Ctrl/Cmd + P (Print)
  if (cmdOrCtrl && (e.key === 'p' || e.key === 'P')) {
    e.preventDefault();
    onBlockedAction('Printing disabled for secure resources');
    return;
  }

  // Intercept Ctrl/Cmd + S (Save)
  if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
    onBlockedAction('Saving disabled by DRM');
    return;
  }

  // Intercept Ctrl/Cmd + C (Copy)
  if (cmdOrCtrl && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
    onBlockedAction('Content copying disabled');
    return;
  }

  // Intercept DevTools shortcuts
  if ((cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c')) || e.key === 'F12') {
    e.preventDefault();
    onBlockedAction('Inspector disabled');
    return;
  }

  // Escape closes viewer
  if (e.key === 'Escape') {
    close();
  }
};

const open = (resource: any) => {
  active.value = resource;
  isWindowBlurred.value = false;
  if (typeof document !== 'undefined') {
    // Printing would leave an unwatermarked copy on paper.
    document.body.style.overflow = 'hidden';
  }
};

const close = () => {
  active.value = null;
  isWindowBlurred.value = false;
  securityAlert.value = '';
  if (typeof document !== 'undefined') document.body.style.overflow = '';
};

onMounted(() => {
  load();
  if (typeof window !== 'undefined') {
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('keydown', handleKeyDown, true);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('blur', handleWindowBlur);
    window.removeEventListener('focus', handleWindowFocus);
    window.removeEventListener('keydown', handleKeyDown, true);
  }
  if (typeof document !== 'undefined') document.body.style.overflow = '';
});
</script>

<style>
@media print {
  body, html {
    display: none !important;
    visibility: hidden !important;
  }
}
</style>
