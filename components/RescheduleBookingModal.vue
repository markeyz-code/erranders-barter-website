<template>
  <div
    v-if="isOpen && booking"
    class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-full max-w-xl max-h-[92vh] rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h3 class="text-lg font-black text-slate-900">Reschedule booking</h3>
          <p class="text-xs font-semibold text-slate-500 mt-0.5">
            Currently {{ formatDateLong(booking.date) }} at {{ formatTime12h(booking.startTime) }}
          </p>
        </div>
        <button
          type="button"
          class="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
          @click="$emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-5 overflow-y-auto flex-1">
        <BookingSlotPicker
          ref="pickerRef"
          :service-id="serviceId"
          :date="date"
          :start-time="startTime"
          :disabled="submitting"
          @update:date="date = $event"
          @update:start-time="startTime = $event"
        />

        <div class="mt-4">
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Notes for the provider</label>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Anything they should know about the new time…"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors resize-none"
          ></textarea>
        </div>

        <div v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <p class="text-sm font-bold text-red-700">{{ error }}</p>
        </div>
      </div>

      <div class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          :disabled="submitting"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-black text-sm hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="submitting || !date || !startTime"
          @click="submit"
        >
          <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
          {{ submitting ? 'Moving…' : 'Move booking' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Loader2 } from 'lucide-vue-next';
import type { Booking } from '@/api_factory/modules/bookings';
import { bookingsApi } from '@/api_factory/modules/bookings';
import {
  formatDateLong,
  formatTime12h,
  getApiError,
} from '@/composables/modules/services/useServiceFormatting';

interface SlotPickerHandle {
  reload: () => Promise<void>;
}

const props = defineProps<{ isOpen: boolean; booking: Booking | null }>();

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'rescheduled', booking: Booking): void;
}>();

const date = ref('');
const startTime = ref('');
const notes = ref('');
const submitting = ref(false);
const error = ref('');
const pickerRef = ref<SlotPickerHandle | null>(null);

const serviceId = computed(() => {
  const service = props.booking?.serviceId;
  if (!service) return '';
  return typeof service === 'string' ? service : service._id;
});

watch(
  () => props.isOpen,
  (open) => {
    if (!open) return;
    date.value = '';
    startTime.value = '';
    notes.value = props.booking?.notes || '';
    error.value = '';
  },
);

const submit = async () => {
  if (!props.booking) return;
  if (!date.value || !startTime.value) {
    error.value = 'Pick a new date and time first.';
    return;
  }

  submitting.value = true;
  error.value = '';
  try {
    const response = await bookingsApi.reschedule(props.booking._id, {
      date: date.value,
      startTime: startTime.value,
      notes: notes.value,
    });
    emit('rescheduled', response.data);
    emit('close');
  } catch (err) {
    const info = getApiError(err);
    error.value =
      info.status === 409
        ? `${info.message} The slot list has been refreshed — pick another time.`
        : info.message;
    if (info.status === 409) await pickerRef.value?.reload();
  } finally {
    submitting.value = false;
  }
};
</script>
