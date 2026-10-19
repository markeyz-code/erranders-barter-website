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

            <div class="text-right shrink-0 space-y-1">
              <p class="text-lg font-black text-slate-900">{{ formatNaira(b.amount) }}</p>
              <div v-if="b.commitmentFee" class="text-xs">
                <span class="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Deposit: {{ formatNaira(b.commitmentFee) }}
                </span>
              </div>
              <div v-if="b.remainingBalance && b.remainingBalance > 0" class="text-[11px] font-semibold">
                <span v-if="b.remainingBalancePaid" class="text-emerald-600 font-bold">✓ Balance Paid</span>
                <span v-else class="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  Balance: {{ formatNaira(b.remainingBalance) }}
                </span>
              </div>
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

            <!-- Student Action: Pay Remaining Balance & Release Escrow -->
            <button
              v-if="activeTab === 'mine' && b.status === 'completed' && !b.remainingBalancePaid && (b.remainingBalance || 0) > 0"
              class="px-3.5 py-1.5 rounded-lg text-xs font-black bg-brand-600 text-white hover:bg-brand-700 shadow-sm flex items-center gap-1.5 transition-all"
              :disabled="busyId === b._id"
              @click="openPayBalanceModal(b)"
            >
              <span>Pay Balance ({{ formatNaira(b.remainingBalance) }}) & Release Escrow</span>
            </button>
            <span
              v-else-if="b.status === 'completed' && b.payoutReleased"
              class="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
            >
              <CheckCircle2 class="w-3.5 h-3.5" /> Escrow Released
            </span>

            <!-- Both sides -->
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1.5"
              @click="openChat(b)"
            >
              <MessageSquare class="w-3.5 h-3.5" /> Chat
            </button>

            <!-- Video Call (Remote Appointments) -->
            <button
              v-if="b.status === 'confirmed' && b.meetingUrl"
              @click="openVideoCall(b)"
              class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-1.5 shadow-sm"
            >
              <Video class="w-3.5 h-3.5" /> Join Video Call
            </button>
            <button
              v-if="b.status === 'confirmed' && b.meetingUrl"
              @click="copyMeetingUrl(b)"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <Check v-if="copiedId === b._id" class="w-3.5 h-3.5 text-emerald-600" />
              <Copy v-else class="w-3.5 h-3.5 text-slate-500" />
              <span>{{ copiedId === b._id ? 'Copied link!' : 'Copy link' }}</span>
            </button>

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
              @click="openCancelModal(b)"
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

      <VideoCallModal
        :is-open="videoModalOpen"
        :meeting-url="activeVideoMeetingUrl"
        :title="activeVideoTitle"
        @close="videoModalOpen = false"
      />

      <!-- Cancel Confirmation Modal with Reason (Custom Modal, no prompt) -->
      <ConfirmActionModal
        :is-open="cancelModalOpen"
        title="Cancel Appointment"
        message="Are you sure you want to cancel this booking? This will notify the other party and free up the time slot."
        confirm-text="Cancel Booking"
        tone="danger"
        :show-reason="true"
        :require-reason="true"
        reason-label="Reason for Cancellation"
        reason-placeholder="e.g. Scheduling conflict, emergency, etc."
        :submitting="cancelSubmitting"
        :error="cancelError"
        @close="cancelModalOpen = false"
        @confirm="confirmCancel"
      />

      <!-- Pay Balance & Release Escrow Modal (Custom Modal) -->
      <ConfirmActionModal
        :is-open="payBalanceModalOpen"
        title="Pay Remaining Balance & Release Escrow"
        :message="bookingToPay ? `Pay the remaining balance of ${formatNaira(bookingToPay.remainingBalance)} for '${serviceTitle(bookingToPay)}'. This marks the service fully settled and releases escrow funds to the provider.` : ''"
        confirm-text="Pay & Release Funds"
        tone="brand"
        :submitting="paySubmitting"
        :error="payError"
        @close="payBalanceModalOpen = false"
        @confirm="confirmPayBalance"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { AlertTriangle, CalendarDays, MessageSquare, Video, Copy, Check, CheckCircle2 } from 'lucide-vue-next';
import BookingStatusPill from '~/components/BookingStatusPill.vue';
import RescheduleBookingModal from '~/components/RescheduleBookingModal.vue';
import VideoCallModal from '~/components/VideoCallModal.vue';
import ConfirmActionModal from '~/components/ConfirmActionModal.vue';
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
const copiedId = ref('');
const rescheduleOpen = ref(false);
const rescheduling = ref<Booking | null>(null);

// Custom Cancel Modal State
const cancelModalOpen = ref(false);
const bookingToCancel = ref<Booking | null>(null);
const cancelSubmitting = ref(false);
const cancelError = ref('');

// Pay Balance Modal State
const payBalanceModalOpen = ref(false);
const bookingToPay = ref<Booking | null>(null);
const paySubmitting = ref(false);
const payError = ref('');

// Video Call Modal State
const videoModalOpen = ref(false);
const activeVideoMeetingUrl = ref('');
const activeVideoTitle = ref('');

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

const openCancelModal = (b: Booking) => {
  bookingToCancel.value = b;
  cancelError.value = '';
  cancelModalOpen.value = true;
};

const confirmCancel = async (reason: string) => {
  if (!bookingToCancel.value) return;
  cancelSubmitting.value = true;
  cancelError.value = '';
  try {
    const { data } = await bookingsApi.cancel(bookingToCancel.value._id, reason || 'Cancelled');
    replaceRow(data);
    cancelModalOpen.value = false;
    bookingToCancel.value = null;
  } catch (err) {
    cancelError.value = getApiError(err).message;
  } finally {
    cancelSubmitting.value = false;
  }
};

const openPayBalanceModal = (b: Booking) => {
  bookingToPay.value = b;
  payError.value = '';
  payBalanceModalOpen.value = true;
};

const confirmPayBalance = async () => {
  if (!bookingToPay.value) return;
  paySubmitting.value = true;
  payError.value = '';
  try {
    const { data } = await bookingsApi.payBalance(bookingToPay.value._id);
    replaceRow(data);
    payBalanceModalOpen.value = false;
    bookingToPay.value = null;
  } catch (err) {
    payError.value = getApiError(err).message;
  } finally {
    paySubmitting.value = false;
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

const openVideoCall = (b: Booking) => {
  if (!b.meetingUrl) return;
  activeVideoMeetingUrl.value = b.meetingUrl;
  activeVideoTitle.value = `${serviceTitle(b)} (${otherPartyName(b)})`;
  videoModalOpen.value = true;
};

const copyMeetingUrl = async (b: Booking) => {
  if (!b.meetingUrl) return;
  try {
    await navigator.clipboard.writeText(b.meetingUrl);
    copiedId.value = b._id;
    setTimeout(() => {
      if (copiedId.value === b._id) copiedId.value = '';
    }, 2000);
  } catch {
    const el = document.createElement('textarea');
    el.value = b.meetingUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    copiedId.value = b._id;
    setTimeout(() => {
      if (copiedId.value === b._id) copiedId.value = '';
    }, 2000);
  }
};

const openChat = (b: Booking) => {
  const chatId = typeof b.chatId === 'string' ? b.chatId : (b.chatId as any)?._id;
  if (chatId) {
    navigateTo(`/chat?chatId=${chatId}`);
    return;
  }
  const other = activeTab.value === 'mine' ? b.providerId : b.customerId;
  const otherId = typeof other === 'object' && other ? (other as any)._id : other;
  if (otherId) {
    navigateTo(`/chat?sellerId=${otherId}`);
  }
};

onMounted(load);
</script>
