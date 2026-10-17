<template>
  <NuxtLink
    :to="`/services/${service._id}`"
    class="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-500 transition-colors"
  >
    <div class="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
      <img
        :src="serviceImage(service)"
        :alt="service.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <!-- Remote / on-site badge -->
      <span
        v-if="service.isRemote"
        class="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-black bg-slate-900/85 backdrop-blur text-white"
      >
        <Video class="w-3 h-3" /> Remote
      </span>
      <span
        v-else-if="service.location"
        class="absolute top-3 left-3 inline-flex items-center gap-1 max-w-[75%] px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-black bg-white/90 backdrop-blur text-slate-700 border border-slate-200"
      >
        <MapPin class="w-3 h-3 shrink-0" />
        <span class="truncate">{{ service.location }}</span>
      </span>

      <span
        class="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-white/90 backdrop-blur text-slate-700 border border-slate-200"
      >
        <Clock class="w-3 h-3" /> {{ formatDuration(service.durationMinutes) }}
      </span>
    </div>

    <div class="p-3.5 sm:p-4 flex flex-col flex-1">
      <p v-if="categoryName" class="text-[10px] uppercase tracking-wider font-black text-brand-600 mb-1 truncate">
        {{ categoryName }}
      </p>
      <h3 class="font-bold text-sm sm:text-base text-slate-900 truncate">{{ service.title }}</h3>

      <div class="flex items-center gap-2 mt-2 min-w-0">
        <span class="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[10px] font-black flex items-center justify-center shrink-0 overflow-hidden relative">
          <span>{{ initials(provider) }}</span>
          <img
            v-if="provider?.avatar"
            :src="provider.avatar"
            :alt="fullName(provider)"
            class="absolute inset-0 w-full h-full object-cover"
            @error="hideBrokenAvatar"
          />
        </span>
        <span class="text-xs text-slate-500 font-semibold truncate">{{ fullName(provider) }}</span>
        <span class="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 shrink-0">
          <Star class="w-3 h-3 fill-amber-500 text-amber-500" />
          {{ rating > 0 ? rating.toFixed(1) : 'New' }}
        </span>
      </div>

      <div class="mt-auto pt-3 flex items-end justify-between gap-2">
        <span class="font-black text-brand-600 text-sm sm:text-base">
          {{ formatPriceLabel(service.priceType, service.price) }}
        </span>
        <span v-if="service.totalBookings > 0" class="text-[11px] font-bold text-slate-400">
          {{ service.totalBookings }} booked
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { MapPin, Star, Clock, Video } from 'lucide-vue-next';
import type { Service, ServiceUser } from '@/api_factory/modules/services';
import {
  formatDuration,
  formatPriceLabel,
  fullName,
  initials,
  providerOf,
  providerRating,
  serviceImage,
} from '@/composables/modules/services/useServiceFormatting';

const props = defineProps<{ service: Service }>();

const provider = computed<ServiceUser | null>(() => providerOf(props.service));
const rating = computed(() => providerRating(provider.value));
const categoryName = computed(() =>
  typeof props.service.category === 'object' ? props.service.category?.name || '' : '',
);

/** Keep the initials visible when a stored avatar URL no longer resolves. */
const hideBrokenAvatar = (event: Event) => {
  const target = event.target as HTMLImageElement | null;
  if (target) target.style.display = 'none';
};
</script>
