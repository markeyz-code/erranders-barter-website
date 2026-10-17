<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      <div class="mb-5">
        <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">Bookings</p>
        <h1 class="text-2xl font-extrabold text-slate-900">Appointments</h1>
        <p class="text-sm text-slate-500 font-medium">
          Bookings you've made, and bookings students have made with you.
        </p>
      </div>

      <!-- Tabs -->
      <div class="inline-flex rounded-xl border border-slate-200 p-1 mb-5">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          class="px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          :class="activeTab === tab.key ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-28 rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <div v-else-if="error" class="py-16 text-center">
        <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="font-bold text-slate-900">Could not load bookings</p>
        <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
        <button class="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <div v-else-if="bookings.length === 0" class="py-16 text-center border border-dashed border-slate-200 rounded-2xl">
        <CalendarDays class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="font-extrabold text-slate-900">
          {{ activeTab === 'mine' ? 'No bookings yet' : 'Nothing booked with you yet' }}
        </p>
        <p class="text-sm text-slate-500 mt-1">
          {{ activeTab === 'mine'
            ? 'Find a service and pick a slot — it takes a minute.'
            : 'When a student books one of your services it will appear here.' }}
        </p>
        <NuxtLink
          v-if="activeTab === 'mine'"
          to="/services"
          class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
        >
          Browse services
        </NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="b in bookings"
          :key="b._id"
          class="rounded-2xl border border-slate-200 p-4"
        >
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-bold text-slate-900 truncate">{{ serviceTitle(b) }}</p>
                <BookingStatusPill :status="b.status" />
              </div>
              <p class="text-sm text-slate-500 font-semibold mt-0.5">
                with {{ otherPartyName(b) }}
              </p>
              <p class="mt-1.5 text-sm font-bold text-slate-700">
                {{ formatDateLong(b.date) }} · {{ formatTimeRange(b.startTime, b.endTime) }}
              </p>
              <p v-if="b.notes" class="mt-1 text-xs text-slate-500 italic">“{{ b.notes }}”</p>
              <p v-if="b.meetingUrl" class="mt-1 text-xs font-bold text-blue-600">Video call</p>
            </div>

            <div class="text-right shrink-0">
              <p class="text-lg font-black text-brand-600">{{ formatNaira(b.amount) }}</p>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <!-- Provider actions -->
            <template v-if="activeTab === 'received'">
              <button
                v-if="b.status === 'pending'"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
                :disabled="busyId === b._id"
                @click="act(b, 'accept')"
              >
                Accept
              </button>
              <button
                v-if="b.status === 'pending'"
                class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                :disabled="busyId === b._id"
                @click="act(b, 'decline')"
              >
                Decline
              </button>
              <button
                v-if="b.status === 'confirmed'"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
                :disabled="busyId === b._id"
                @click="act(b, 'complete')"
              >
                Mark complete
              </button>
            </template>

            <!-- Both sides -->
            <button
              v-if="b.chatId"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1.5"
              @click="openChat(b)"
            >
              <MessageSquare class="w-3.5 h-3.5" /> Chat
            </button>
            <a
              v-if="b.status === 'confirmed' && b.meetingUrl"
              :href="b.meetingUrl"
              target="_blank"
              rel="noopener"
              class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-1.5"
            >
              <Video class="w-3.5 h-3.5" /> Join video call
            </a>

            <button
              v-if="canReschedule(b)"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50"
              @click="openReschedule(b)"
            >
              Reschedule
            </button>
            <button
              v-if="canCancel(b)"
              class="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-40"
              :disabled="busyId === b._id"
              @click="cancel(b)"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <RescheduleBookingModal
        :is-open="rescheduleOpen"
        :booking="rescheduling"
        @close="rescheduleOpen = false"
        @rescheduled="onRescheduled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { AlertTriangle, CalendarDays, MessageSquare, Video } from 'lucide-vue-next';
import BookingStatusPill from '~/components/BookingStatusPill.vue';
import RescheduleBookingModal from '~/components/RescheduleBookingModal.vue';
import { bookingsApi, type Booking, type BookingStatus } from '@/api_factory/modules/bookings';
import { getApiError, formatDateLong, formatTimeRange } from '@/composables/modules/services/useServiceFormatting';

/**
 * Bookings for both sides of the marketplace. The two lists come from two real
 * endpoints; actions are shown only when they are valid for that status, so a
 * button never fires a request the backend will reject.
 */

definePageMeta({ layout: 'dashboard' });

const TABS = [
  { key: 'mine' as const, label: 'Bookings I made' },
  { key: 'received' as const, label: 'Bookings for me' },
];

const activeTab = ref<'mine' | 'received'>('mine');
const bookings = ref<Booking[]>([]);
const loading = ref(true);
const error = ref('');
const busyId = ref('');
const rescheduleOpen = ref(false);
const rescheduling = ref<Booking | null>(null);

const formatNaira = (n?: number) =>
  typeof n === 'number' ? `₦${n.toLocaleString('en-NG')}` : '—';

const nameOf = (u: any) => {
  if (!u || typeof u !== 'object') return 'User';
  return `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User';
};

const serviceTitle = (b: Booking) =>
  typeof b.serviceId === 'object' && b.serviceId ? b.serviceId.title || 'Service' : 'Service';

const otherPartyName = (b: Booking) =>
  activeTab.value === 'mine'
    ? nameOf(typeof b.providerId === 'object' ? b.providerId : null)
    : nameOf(typeof b.customerId === 'object' ? b.customerId : null);

/** No point offering to cancel something already finished. */
const canCancel = (b: Booking) =>
  ['pending', 'confirmed'].includes(b.status);

const canReschedule = (b: Booking) =>
  ['pending', 'confirmed'].includes(b.status);

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } =
      activeTab.value === 'mine' ? await bookingsApi.mine() : await bookingsApi.received();
    bookings.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = getApiError(err).message;
    bookings.value = [];
  } finally {
    loading.value = false;
  }
};

const switchTab = (key: 'mine' | 'received') => {
  activeTab.value = key;
  void load();
};

const replaceRow = (updated: Booking) => {
  const idx = bookings.value.findIndex((x) => x._id === updated._id);
  if (idx >= 0) bookings.value[idx] = updated;
};

const act = async (b: Booking, action: 'accept' | 'decline' | 'complete') => {
  busyId.value = b._id;
  try {
    const { data } =
      action === 'accept'
        ? await bookingsApi.accept(b._id)
        : action === 'decline'
          ? await bookingsApi.decline(b._id)
          : await bookingsApi.complete(b._id);
    replaceRow(data);
  } catch (err) {
    error.value = getApiError(err).message;
  } finally {
    busyId.value = '';
  }
};

const cancel = async (b: Booking) => {
  const reason = prompt('Why are you cancelling? (shown to the other person)');
  if (reason === null) return;
  busyId.value = b._id;
  try {
    const { data } = await bookingsApi.cancel(b._id, reason || 'Cancelled');
    replaceRow(data);
  } catch (err) {
    error.value = getApiError(err).message;
  } finally {
    busyId.value = '';
  }
};

const openReschedule = (b: Booking) => {
  rescheduling.value = b;
  rescheduleOpen.value = true;
};

const onRescheduled = (updated: Booking) => {
  rescheduleOpen.value = false;
  replaceRow(updated);
};

const openChat = (b: Booking) => {
  const chatId = typeof b.chatId === 'string' ? b.chatId : (b.chatId as any)?._id;
  if (chatId) navigateTo(`/chat?chat=${chatId}`);
};

onMounted(load);
</script>
