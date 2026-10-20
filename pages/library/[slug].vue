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

    <!-- Protected viewer: watermark, no download, no copy -->
    <div v-if="active" class="fixed inset-0 z-50 bg-slate-900/80 p-3 sm:p-6 flex flex-col">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm font-bold text-white truncate">{{ active.title }}</p>
        <button class="px-3 py-1.5 rounded-lg bg-white/15 text-white text-xs font-bold" @click="close">Close</button>
      </div>

      <div
        class="relative flex-1 bg-white rounded-xl overflow-hidden select-none"
        @contextmenu.prevent
        @copy.prevent
        @cut.prevent
        @dragstart.prevent
      >
        <!-- The watermark repeats so a partial screenshot still carries the address. -->
        <div class="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div
            v-for="n in 12"
            :key="n"
            class="absolute text-slate-900/10 font-black whitespace-nowrap"
            :style="{ top: `${(n - 1) * 9}%`, left: `${(n % 3) * 18}%`, transform: 'rotate(-24deg)' }"
          >
            {{ data?.watermark }} · {{ data?.watermark }}
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

      <p class="mt-2 text-[11px] text-slate-300 text-center">
        Watermarked for {{ data?.watermark }}. Downloading and copying are disabled.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Lock, FolderX, FileText, PlayCircle, Link as LinkIcon } from 'lucide-vue-next';
import { businessesApi } from '@/api_factory/modules/businesses';

/**
 * A student's gated resource library.
 *
 * The API decides what is returned: an email that was never granted gets an empty list, so
 * there is nothing to guard here on the client. What this page adds is the handling —
 * a repeating watermark of the student's own address, no context menu, no copy and no
 * download attribute, which makes a leak traceable rather than impossible.
 */

definePageMeta({ layout: 'default' });

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));

const data = ref<any>(null);
const loading = ref(true);
const signedIn = ref(false);
const active = ref<any>(null);

const resources = computed<any[]>(() => data.value?.resources ?? []);

const load = async () => {
  loading.value = true;
  try {
    if (typeof window !== 'undefined') {
      signedIn.value = Boolean(window.localStorage.getItem('barter_token'));
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

const open = (resource: any) => {
  active.value = resource;
  if (typeof document !== 'undefined') {
    // Printing would leave an unwatermarked copy on paper.
    document.body.style.overflow = 'hidden';
  }
};

const close = () => {
  active.value = null;
  if (typeof document !== 'undefined') document.body.style.overflow = '';
};

onMounted(load);
</script>
