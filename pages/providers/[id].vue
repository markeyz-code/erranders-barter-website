<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <NuxtLink
        to="/services"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-5"
      >
        <ChevronLeft class="w-4 h-4" /> All services
      </NuxtLink>

      <div v-if="loading" class="space-y-4">
        <div class="h-32 rounded-2xl bg-slate-100 animate-pulse" />
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 3" :key="i" class="h-64 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>

      <div v-else-if="error" class="py-20 text-center">
        <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="text-lg font-bold text-slate-900">We couldn't load this provider</p>
        <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
        <NuxtLink
          to="/services"
          class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
        >
          Browse services
        </NuxtLink>
      </div>

      <template v-else-if="provider">
        <!-- Provider card -->
        <div class="rounded-2xl border border-slate-200 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center gap-5">
            <div class="w-20 h-20 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img v-if="provider.avatar" :src="provider.avatar" :alt="name" class="w-full h-full object-cover" />
              <span v-else class="w-full h-full flex items-center justify-center text-slate-500 font-black text-2xl">
                {{ name.charAt(0) }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <h1 class="text-2xl font-extrabold text-slate-900">{{ name }}</h1>
              <p class="text-sm font-semibold text-slate-500">{{ provider.headline || 'Service provider' }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                <span v-if="provider.rating" class="text-amber-600">{{ provider.rating.toFixed(1) }} rating</span>
                <span v-if="provider.totalBookings" class="text-slate-500">{{ provider.totalBookings }} bookings</span>
                <span v-if="provider.university" class="text-slate-400">{{ provider.university }}</span>
              </div>
            </div>

            <div class="sm:shrink-0 flex items-center">
              <NuxtLink
                :to="`/chat?sellerId=${provider._id}`"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-brand-600 transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare class="w-4 h-4 text-brand-400" />
                Message {{ name.split(' ')[0] || 'Provider' }}
              </NuxtLink>
            </div>
          </div>

          <p v-if="provider.bio" class="mt-4 text-slate-600 leading-relaxed">{{ provider.bio }}</p>

          <div v-if="provider.skills?.length" class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="skill in provider.skills"
              :key="skill"
              class="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600"
            >
              {{ skill }}
            </span>
          </div>

          <p v-if="provider.serviceArea" class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin class="w-3.5 h-3.5" /> Works around {{ provider.serviceArea }}
          </p>
        </div>

        <!-- Their services -->
        <h2 class="mt-8 mb-4 text-lg font-extrabold text-slate-900">Services by {{ name }}</h2>

        <div v-if="services.length === 0" class="py-14 text-center border border-dashed border-slate-200 rounded-2xl">
          <Briefcase class="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p class="font-bold text-slate-700">No services listed yet</p>
          <p class="text-sm text-slate-500 mt-1">This provider hasn't published anything to book.</p>
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <NuxtLink
            v-for="s in services"
            :key="s._id"
            :to="`/services/${s._id}`"
            class="group rounded-2xl border border-slate-200 overflow-hidden hover:border-brand-300 hover:shadow-sm transition-all"
          >
            <div class="aspect-[16/10] bg-slate-100 overflow-hidden">
              <img
                :src="serviceImage(s)"
                :alt="s.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <p class="font-bold text-slate-900 truncate">{{ s.title }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-sm font-black text-brand-600">
                  {{ formatPriceLabel(s.priceType, s.price) }}
                </span>
                <span class="text-xs font-semibold text-slate-400">
                  {{ formatDuration(s.durationMinutes) }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, AlertTriangle, MapPin, Briefcase, MessageSquare } from 'lucide-vue-next';
import { providersApi, type ProviderWithServices } from '@/api_factory/modules/providers';
import type { Service } from '@/api_factory/modules/services';
import {
  getApiError,
  formatPriceLabel,
  formatDuration,
  serviceImage,
} from '@/composables/modules/services/useServiceFormatting';

/** A provider's public card and the services they have published. */

definePageMeta({ layout: 'default' });

const route = useRoute();
const providerId = computed(() => String(route.params.id || ''));

const provider = ref<ProviderWithServices['provider'] | null>(null);
const services = ref<Service[]>([]);
const loading = ref(true);
const error = ref('');

const name = computed(() => {
  const p = provider.value;
  if (!p) return 'Provider';
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Provider';
});

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    // The endpoint returns the provider plus their active services together.
    const { data } = await providersApi.getById(providerId.value);
    provider.value = (data as any).provider ?? data;
    services.value = (data as any).services ?? [];
  } catch (err) {
    error.value = getApiError(err).message;
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>
