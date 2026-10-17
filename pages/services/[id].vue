<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <NuxtLink
        to="/services"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-5"
      >
        <ChevronLeft class="w-4 h-4" /> All services
      </NuxtLink>

      <!-- Loading -->
      <div v-if="loading" class="grid lg:grid-cols-5 gap-8">
        <div class="lg:col-span-3 space-y-4">
          <div class="h-72 rounded-2xl bg-slate-100 animate-pulse" />
          <div class="h-8 w-2/3 rounded-lg bg-slate-100 animate-pulse" />
          <div class="h-4 w-1/3 rounded bg-slate-100 animate-pulse" />
        </div>
        <div class="lg:col-span-2 h-96 rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-20 text-center">
        <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="text-lg font-bold text-slate-900">We couldn't load this service</p>
        <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
        <button
          class="mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
          @click="load"
        >
          Try again
        </button>
      </div>

      <div v-else-if="service" class="grid lg:grid-cols-5 gap-8">
        <!-- ── Left: the service ─────────────────────────────────────── -->
        <div class="lg:col-span-3">
          <div class="rounded-2xl overflow-hidden bg-slate-100 aspect-[16/10]">
            <img :src="image" :alt="service.title" class="w-full h-full object-cover" />
          </div>

          <div class="mt-5 flex flex-wrap items-center gap-2">
            <span v-if="categoryName" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
              {{ categoryName }}
            </span>
            <span
              v-if="service.isRemote"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold"
            >
              <Video class="w-3.5 h-3.5" /> Remote
            </span>
            <span v-if="service.location" class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
              <MapPin class="w-3.5 h-3.5" /> {{ service.location }}
            </span>
          </div>

          <h1 class="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">{{ service.title }}</h1>

          <div class="mt-2 flex flex-wrap items-center gap-4 text-sm">
            <span class="font-black text-brand-600 text-lg">{{ priceLabel }}</span>
            <span class="inline-flex items-center gap-1 text-slate-500 font-semibold">
              <Clock class="w-4 h-4" /> {{ formatDuration(service.durationMinutes) }}
            </span>
            <span v-if="service.totalBookings" class="text-slate-400 font-semibold">
              {{ service.totalBookings }} booked
            </span>
          </div>

          <p class="mt-5 text-slate-600 leading-relaxed whitespace-pre-line">{{ service.description }}</p>

          <div v-if="service.tags?.length" class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="tag in service.tags"
              :key="tag"
              class="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Provider card -->
          <NuxtLink
            v-if="provider"
            :to="`/providers/${provider._id}`"
            class="mt-8 flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors"
          >
            <div class="w-14 h-14 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img v-if="provider.avatar" :src="provider.avatar" :alt="providerName" class="w-full h-full object-cover" />
              <span v-else class="w-full h-full flex items-center justify-center text-slate-500 font-black text-lg">
                {{ providerName.charAt(0) }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-bold text-slate-900 truncate">{{ providerName }}</p>
              <p class="text-xs text-slate-500 font-medium truncate">{{ provider.headline || 'Service provider' }}</p>
              <p v-if="provider.rating" class="text-xs font-bold text-amber-600 mt-0.5">
                {{ provider.rating.toFixed(1) }} rating
              </p>
            </div>
            <span class="text-sm font-bold text-brand-600">View profile</span>
          </NuxtLink>
        </div>

        <!-- ── Right: booking ────────────────────────────────────────── -->
        <aside class="lg:col-span-2">
          <div class="lg:sticky lg:top-6 rounded-2xl border border-slate-200 p-5">
            <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">Book this service</p>
            <h2 class="text-lg font-extrabold text-slate-900 mb-4">Pick a day and a slot</h2>

            <!-- Slot picker handles dates + slots + availability itself -->
            <BookingSlotPicker
              v-model:date="date"
              v-model:startTime="startTime"
              :service-id="serviceId"
              @loaded="slots = $event"
            />

            <label class="block mt-4">
              <span class="text-xs font-bold text-slate-600">Anything they should know?</span>
              <textarea
                v-model="notes"
                rows="3"
                class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="Optional — where to meet, what you need…"
              />
            </label>

            <div v-if="bookingError" class="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
              <p class="text-xs font-bold text-red-700">{{ bookingError }}</p>
            </div>

            <button
              class="mt-4 w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!canSubmit"
              @click="submit"
            >
              {{ submitting ? 'Requesting…' : 'Request booking' }}
            </button>
            <p class="mt-2 text-[11px] text-slate-400 text-center font-medium">
              {{ priceLabel }} · you pay after the provider accepts
            </p>
          </div>
        </aside>
      </div>

      <!-- ── Confirmation ─────────────────────────────────────────────── -->
      <div v-if="confirmed" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div class="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 class="w-7 h-7 text-emerald-600" />
          </div>
          <h3 class="text-xl font-extrabold text-slate-900">Booking requested</h3>
          <p class="text-sm text-slate-500 mt-2">
            {{ providerName }} will confirm your slot. You'll be able to chat with them from your bookings.
          </p>
          <p class="mt-3 text-sm font-bold text-slate-700">
            {{ formatDateLong(confirmed.date) }} · {{ formatTime12h(confirmed.startTime) }}
          </p>
          <div class="mt-6 flex gap-3">
            <NuxtLink
              to="/dashboard/bookings"
              class="flex-1 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700"
            >
              View bookings
            </NuxtLink>
            <NuxtLink
              to="/services"
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
            >
              Keep browsing
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, AlertTriangle, MapPin, Clock, Video, CheckCircle2 } from 'lucide-vue-next';
import BookingSlotPicker from '~/components/BookingSlotPicker.vue';
import { servicesApi, type Service } from '@/api_factory/modules/services';
import { bookingsApi, type Booking } from '@/api_factory/modules/bookings';
import type { AvailabilitySlot } from '@/api_factory/modules/availability';
import {
  getApiError,
  formatDateLong,
  formatTime12h,
  formatPriceLabel,
  formatDuration,
  serviceImage,
  providerOf,
} from '@/composables/modules/services/useServiceFormatting';

/**
 * Service detail + booking. Every value comes from the API — there is no local
 * sample content. Slot availability is owned by `BookingSlotPicker`, which calls
 * `GET /services/:id/availability?date=…`; this page just reacts to the choice.
 */

definePageMeta({ layout: 'default' });

const route = useRoute();
const serviceId = computed(() => String(route.params.id || ''));

const service = ref<Service | null>(null);
const loading = ref(true);
const error = ref('');

const date = ref('');
const startTime = ref('');
const notes = ref('');
const slots = ref<AvailabilitySlot[]>([]);
const submitting = ref(false);
const bookingError = ref('');
const confirmed = ref<Booking | null>(null);

const provider = computed(() => providerOf(service.value));
const providerName = computed(() => {
  const p = provider.value;
  if (!p) return 'Provider';
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Provider';
});

const image = computed(() => serviceImage(service.value));

const priceLabel = computed(() =>
  formatPriceLabel(service.value?.priceType, service.value?.price),
);

const categoryName = computed(() =>
  service.value && typeof service.value.category === 'object'
    ? service.value.category?.name || ''
    : '',
);

const canSubmit = computed(
  () => !!date.value && !!startTime.value && !submitting.value && !confirmed.value,
);

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await servicesApi.getById(serviceId.value);
    service.value = data;
  } catch (err) {
    const info = getApiError(err);
    error.value = info.message;
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  if (!canSubmit.value) return;
  submitting.value = true;
  bookingError.value = '';
  try {
    const { data } = await bookingsApi.create({
      serviceId: serviceId.value,
      date: date.value,
      startTime: startTime.value,
      notes: notes.value.trim() || undefined,
    });
    confirmed.value = data;
  } catch (err) {
    const info = getApiError(err);
    // A 409 means someone took the slot while this page was open — say so plainly
    // and let the picker refetch rather than leaving a stale slot selected.
    bookingError.value =
      info.status === 409
        ? 'That slot was just taken. Please pick another.'
        : info.message;
    if (info.status === 409) startTime.value = '';
  } finally {
    submitting.value = false;
  }
};

onMounted(load);
</script>
