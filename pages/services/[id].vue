<template>
  <main class="min-h-screen bg-slate-50/50 pb-28 lg:pb-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <!-- Breadcrumb navigation -->
      <NuxtLink
        to="/services"
        class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4 sm:mb-6 group"
      >
        <ChevronLeft class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to all services</span>
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div class="lg:col-span-7 space-y-4">
          <div class="h-64 sm:h-80 rounded-3xl bg-slate-200/70 animate-pulse" />
          <div class="h-8 w-3/4 rounded-xl bg-slate-200/70 animate-pulse" />
          <div class="h-4 w-1/2 rounded-lg bg-slate-200/70 animate-pulse" />
        </div>
        <div class="lg:col-span-5 h-96 rounded-3xl bg-slate-200/70 animate-pulse" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-16 sm:py-20 text-center max-w-lg mx-auto bg-white rounded-3xl border border-red-100 p-8 shadow-sm">
        <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
          <AlertTriangle class="w-7 h-7" />
        </div>
        <h2 class="text-xl font-extrabold text-slate-900">We couldn't load this service</h2>
        <p class="text-sm text-slate-500 mt-2">{{ error }}</p>
        <button
          type="button"
          class="mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm"
          @click="load"
        >
          Try again
        </button>
      </div>

      <!-- Main Service Content -->
      <div v-else-if="service" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- ── Left Column: Service Details & Provider ────────────────────────── -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Responsive Image Gallery -->
          <div class="space-y-3">
            <div class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
              <div class="aspect-[16/10] sm:aspect-[16/9] max-h-64 sm:max-h-80 md:max-h-96 w-full">
                <img
                  :src="activeImage || image"
                  :alt="service.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Badges over the image for clean mobile layout -->
              <div class="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                <span
                  v-if="categoryName"
                  class="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider shadow-sm"
                >
                  {{ categoryName }}
                </span>
                <span
                  v-if="service.isRemote"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider shadow-sm"
                >
                  <Video class="w-3 h-3" /> Remote
                </span>
              </div>

              <div
                v-if="service.location"
                class="absolute bottom-3 left-3 max-w-[85%] inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur text-slate-700 border border-slate-200/80 shadow-sm"
              >
                <MapPin class="w-3 h-3 text-brand-600 shrink-0" />
                <span class="truncate">{{ service.location }}</span>
              </div>
            </div>

            <!-- Multiple images thumbnail bar -->
            <div
              v-if="service.images && service.images.length > 1"
              class="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
            >
              <button
                v-for="(img, idx) in service.images"
                :key="idx"
                type="button"
                @click="activeImage = img"
                class="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0"
                :class="(activeImage || image) === img ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'"
              >
                <img :src="img" :alt="`Thumbnail ${idx + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Service Title & Core Meta -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {{ service.title }}
            </h1>

            <!-- Key attributes pills -->
            <div class="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <span class="font-black text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200/60 text-base sm:text-lg">
                {{ priceLabel }}
              </span>
              <span class="inline-flex items-center gap-1 text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                <Clock class="w-4 h-4 text-slate-500" /> {{ formatDuration(service.durationMinutes) }} session
              </span>
              <span v-if="service.totalBookings" class="text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                {{ service.totalBookings }} bookings completed
              </span>
            </div>

            <!-- Interactive Booking Hours Editor (Directly under image/title) -->
            <div class="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-brand-50/70 via-white to-slate-50 border border-brand-200/80 shadow-xs">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-brand-600 bg-brand-100/60 px-2 py-0.5 rounded-md">
                    Customize Your Session
                  </span>
                  <h3 class="text-sm sm:text-base font-black text-slate-900 mt-1">
                    {{ service.priceType === 'hourly' ? 'How many hours do you want to book for?' : 'Adjust session duration' }}
                  </h3>
                </div>
                <div class="text-left sm:text-right">
                  <span class="text-[10px] font-bold text-slate-400 block uppercase">Calculated Total</span>
                  <span class="text-lg sm:text-xl font-black text-brand-600">
                    {{ mobileTotalText }}
                  </span>
                </div>
              </div>

              <!-- Quick Hours Buttons & Stepper -->
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="hrs in [1, 2, 3, 4, 5, 6]"
                  :key="hrs"
                  type="button"
                  @click="durationMinutes = hrs * 60"
                  class="px-3 py-1.5 rounded-xl text-xs font-black transition-all"
                  :class="durationMinutes === hrs * 60 ? 'bg-brand-600 text-white shadow-xs scale-105' : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50/50'"
                >
                  {{ hrs }} {{ hrs === 1 ? 'Hour' : 'Hours' }}
                </button>

                <!-- Custom minutes stepper -->
                <div class="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 ml-auto">
                  <button
                    type="button"
                    :disabled="durationMinutes <= 30"
                    @click="durationMinutes = Math.max(30, durationMinutes - 30)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center font-black text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span class="px-2 text-xs font-bold text-slate-900">
                    {{ formatDuration(durationMinutes) }}
                  </span>
                  <button
                    type="button"
                    :disabled="durationMinutes >= 480"
                    @click="durationMinutes = Math.min(480, durationMinutes + 30)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center font-black text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="mt-3 pt-2.5 border-t border-brand-100/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>
                  Rate: <strong>{{ priceLabel }}</strong> · {{ formatDuration(durationMinutes) }} selected
                </span>
                <button
                  type="button"
                  @click="scrollToBooking"
                  class="text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Pick Open Slots ↓
                </button>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-6 pt-5 border-t border-slate-100">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">About This Service</h3>
              <p class="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {{ service.description }}
              </p>
            </div>

            <!-- Tags -->
            <div v-if="service.tags?.length" class="mt-5 flex flex-wrap gap-1.5">
              <span
                v-for="tag in service.tags"
                :key="tag"
                class="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Provider Card -->
          <div v-if="provider" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
            <p class="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">Service Provider</p>
            <div class="flex items-start gap-4">
              <NuxtLink :to="`/providers/${provider._id}`" class="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                <img v-if="provider.avatar" :src="provider.avatar" :alt="providerName" class="w-full h-full object-cover" />
                <span v-else class="w-full h-full flex items-center justify-center text-slate-500 font-black text-lg">
                  {{ providerName.charAt(0) }}
                </span>
              </NuxtLink>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <NuxtLink :to="`/providers/${provider._id}`" class="font-extrabold text-slate-900 truncate hover:text-brand-600 text-base">
                    {{ providerName }}
                  </NuxtLink>
                  <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    Verified Student
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium line-clamp-2 mt-0.5">
                  {{ provider.headline || 'Campus Service Provider' }}
                </p>
                <div class="flex items-center gap-3 text-xs mt-1.5 text-slate-500">
                  <span v-if="provider.rating" class="font-bold text-amber-600 flex items-center gap-1">
                    ★ {{ provider.rating.toFixed(1) }} rating
                  </span>
                  <span v-if="provider.hostel" class="font-medium truncate">
                    📍 {{ provider.hostel }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Skills preview if any -->
            <div v-if="provider.providerProfile?.skills?.length" class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
              <span
                v-for="skill in provider.providerProfile.skills.slice(0, 4)"
                :key="skill"
                class="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200"
              >
                {{ skill }}
              </span>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <NuxtLink
                :to="`/chat?sellerId=${provider._id}`"
                class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare class="w-3.5 h-3.5 text-brand-600" />
                <span>Message {{ providerName.split(' ')[0] }}</span>
              </NuxtLink>
              <NuxtLink :to="`/providers/${provider._id}`" class="text-xs font-bold text-brand-600 hover:text-brand-700">
                View Profile →
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- ── Right Column: Booking Card (Sticky on Desktop, Anchor on Mobile) ── -->
        <aside id="booking-section" class="lg:col-span-5 w-full">
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm lg:sticky lg:top-6">
            <div class="mb-4">
              <span class="text-[10px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                Direct Booking
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">
                Choose Date & Time Slot
              </h2>
              <p class="text-xs text-slate-500 font-medium">
                Select an open date on the calendar, then pick an available session window.
              </p>
            </div>

            <!-- Custom Calendar + Slot Picker Component -->
            <BookingSlotPicker
              v-model:date="date"
              v-model:startTime="startTime"
              v-model:durationMinutes="durationMinutes"
              :service="service"
              :service-id="serviceId"
              @loaded="slots = $event"
            />

            <!-- Notes Input -->
            <label class="block mt-5">
              <span class="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Special Instructions or Location</span>
                <span class="text-slate-400 font-normal text-[11px]">(Optional)</span>
              </span>
              <textarea
                v-model="notes"
                rows="2"
                class="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder:text-slate-400 resize-none"
                placeholder="e.g. Meet in front of Moremi hall porter's lodge, room 204..."
              />
            </label>

            <!-- Commitment Deposit & Balance Breakdown -->
            <div
              v-if="service && service.priceType !== 'negotiable'"
              class="mt-4 p-3.5 rounded-2xl bg-brand-50/80 border border-brand-100 space-y-2 text-left"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-600 font-semibold flex items-center gap-1.5">
                  <ShieldCheck class="w-3.5 h-3.5 text-brand-600" /> Total Service Price
                </span>
                <span class="font-extrabold text-slate-800">₦{{ calculatedTotal.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between text-xs pt-1.5 border-t border-brand-100">
                <div>
                  <span class="font-black text-brand-800">Commitment Deposit (Pay Now)</span>
                  <p class="text-[10px] text-brand-600 font-medium">Secures appointment & prevents no-shows</p>
                </div>
                <span class="font-black text-brand-700 text-sm">₦{{ calculatedCommitmentFee.toLocaleString() }}</span>
              </div>
              <div v-if="calculatedRemainingBalance > 0" class="flex items-center justify-between text-xs pt-1.5 border-t border-brand-100/70">
                <div>
                  <span class="font-bold text-slate-600">Remaining Balance</span>
                  <p class="text-[10px] text-slate-400 font-medium">Paid upon completion of service</p>
                </div>
                <span class="font-extrabold text-slate-700">₦{{ calculatedRemainingBalance.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Booking Error Alert -->
            <div v-if="bookingError" class="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertTriangle class="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p class="text-xs font-bold text-red-700">{{ bookingError }}</p>
            </div>

            <!-- Primary Booking Submit Button -->
            <button
              type="button"
              class="mt-5 w-full py-3.5 rounded-xl bg-brand-600 text-white font-extrabold text-sm sm:text-base hover:bg-brand-700 active:scale-[0.99] transition-all shadow-md shadow-brand-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="!canSubmit"
              @click="submit"
            >
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ submitting ? 'Securing Booking…' : (startTime ? (calculatedCommitmentFee > 0 ? `Pay Commitment (₦${calculatedCommitmentFee.toLocaleString()}) & Book` : 'Confirm & Request Booking') : 'Select a Time Slot Above') }}</span>
            </button>

            <!-- Price & Escrow terms notice -->
            <p class="mt-3 text-[11px] text-slate-400 text-center font-medium leading-relaxed">
              {{ priceLabel }} · Commitment fee held securely in Erranders Escrow until work is delivered.
            </p>
          </div>
        </aside>
      </div>

      <!-- Mobile Sticky Bottom Quick-Booking Bar -->
      <div
        v-if="service && !loading"
        class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg flex items-center justify-between gap-3"
      >
        <div class="min-w-0">
          <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Price</p>
          <div class="flex items-baseline gap-1">
            <span class="font-black text-brand-600 text-base truncate">{{ mobileTotalText }}</span>
            <span class="text-xs text-slate-500 font-semibold truncate">· {{ formatDuration(durationMinutes) }}</span>
          </div>
        </div>

        <button
          type="button"
          @click="scrollToBooking"
          class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-600/20 shrink-0 inline-flex items-center gap-1.5 transition-all"
        >
          <CalendarDays class="w-4 h-4" />
          <span>{{ startTime ? 'Proceed to Book' : 'Pick Date & Slot' }}</span>
        </button>
      </div>

      <!-- Booking Confirmation Modal -->
      <div v-if="confirmed" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-emerald-600 border border-emerald-100">
            <CheckCircle2 class="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900">Booking Requested!</h3>
          <p class="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Your booking request has been sent to <strong class="text-slate-800">{{ providerName }}</strong>. You can chat immediately to coordinate logistics.
          </p>

          <!-- Confirmed appointment slot recap -->
          <div class="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Date</span>
              <span class="font-extrabold text-slate-800">{{ formatDateLong(confirmed.date) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Time Window</span>
              <span class="font-extrabold text-brand-700">
                {{ formatTime12h(confirmed.startTime) }} – {{ formatTime12h(confirmed.endTime) }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
              <span class="text-slate-500 font-semibold">Total Price</span>
              <span class="font-black text-slate-900">₦{{ Number(confirmed.amount || 0).toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between text-xs bg-brand-50/90 p-2.5 rounded-xl border border-brand-100">
              <div>
                <span class="text-[11px] font-black text-brand-800">Commitment Fee (Paid)</span>
                <p class="text-[10px] text-brand-600 font-medium">Secured in Erranders escrow</p>
              </div>
              <span class="font-black text-brand-700 text-sm">₦{{ Number(confirmed.commitmentFee ?? confirmed.amount ?? 0).toLocaleString() }}</span>
            </div>
            <div v-if="Number(confirmed.remainingBalance || 0) > 0" class="flex items-center justify-between text-xs px-1 text-slate-600">
              <span class="text-[11px] font-semibold">Due at Completion</span>
              <span class="font-extrabold text-slate-800">₦{{ Number(confirmed.remainingBalance).toLocaleString() }}</span>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <NuxtLink
              v-if="confirmed.chatId || provider"
              :to="confirmed.chatId ? `/chat?chatId=${typeof confirmed.chatId === 'string' ? confirmed.chatId : (confirmed.chatId as any)._id}` : `/chat?sellerId=${provider?._id}`"
              class="flex-1 py-3 rounded-xl bg-slate-900 text-white font-extrabold text-xs sm:text-sm hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare class="w-4 h-4" /> Message Provider
            </NuxtLink>
            <NuxtLink
              to="/dashboard/bookings"
              class="flex-1 py-3 rounded-xl bg-brand-600 text-white font-extrabold text-xs sm:text-sm hover:bg-brand-700 flex items-center justify-center transition-colors shadow-sm"
            >
              View My Bookings
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
import {
  ChevronLeft,
  AlertTriangle,
  MapPin,
  Clock,
  Video,
  CheckCircle2,
  MessageSquare,
  CalendarDays,
  ShieldCheck,
} from 'lucide-vue-next';
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
  calculateServiceTotal,
  serviceImage,
  providerOf,
} from '@/composables/modules/services/useServiceFormatting';

definePageMeta({ layout: 'default' });

const route = useRoute();
const serviceId = computed(() => String(route.params.id || ''));

const service = ref<Service | null>(null);
const loading = ref(true);
const error = ref('');
const activeImage = ref('');

const date = ref('');
const startTime = ref('');
const durationMinutes = ref(60);
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

const calculatedTotal = computed(() => {
  if (!service.value) return 0;
  return calculateServiceTotal(
    service.value.priceType,
    service.value.price,
    durationMinutes.value,
  );
});

const calculatedCommitmentFee = computed(() => {
  const total = calculatedTotal.value;
  if (!total || total <= 0) return 0;
  if (total <= 1000) return total;
  // 30% commitment fee rounded to nearest 50, minimum 1,000
  const rawFee = Math.max(1000, Math.round((total * 0.3) / 50) * 50);
  return Math.min(rawFee, total);
});

const calculatedRemainingBalance = computed(() => {
  return Math.max(0, calculatedTotal.value - calculatedCommitmentFee.value);
});

const mobileTotalText = computed(() => {
  if (!service.value) return '—';
  if (service.value.priceType === 'negotiable') return 'Negotiable';
  return `₦${calculatedTotal.value.toLocaleString()}`;
});

const categoryName = computed(() =>
  service.value && typeof service.value.category === 'object'
    ? service.value.category?.name || ''
    : '',
);

const canSubmit = computed(
  () => !!date.value && !!startTime.value && !submitting.value && !confirmed.value,
);

const scrollToBooking = () => {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await servicesApi.getById(serviceId.value);
    service.value = data;
    if (data?.durationMinutes) {
      durationMinutes.value = data.durationMinutes;
    }
    if (data?.images?.length) {
      activeImage.value = data.images[0];
    }
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
      durationMinutes: durationMinutes.value,
      notes: notes.value.trim() || undefined,
    });
    confirmed.value = data;
  } catch (err) {
    const info = getApiError(err);
    bookingError.value =
      info.status === 409
        ? 'That slot was just taken. Please pick another available time.'
        : info.message;
    if (info.status === 409) startTime.value = '';
  } finally {
    submitting.value = false;
  }
};

useSeoMeta({
  title: computed(() => service.value ? `${service.value.title} | Decluttered Campus Services` : 'Service Details | Decluttered'),
  description: computed(() => service.value?.description?.slice(0, 160) || 'Book campus skills and services on Decluttered.'),
});

onMounted(load);
</script>
