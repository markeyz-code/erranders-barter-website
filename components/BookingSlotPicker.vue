<template>
  <div>
    <!-- Date picker: the next 14 days -->
    <div>
      <p class="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Pick a day</p>

      <div v-if="days.length === 0" class="flex gap-2 overflow-hidden">
        <div v-for="i in 6" :key="i" class="h-16 w-14 shrink-0 rounded-xl bg-slate-100 animate-pulse"></div>
      </div>

      <div v-else class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
        <button
          v-for="day in days"
          :key="day.iso"
          type="button"
          :disabled="disabled"
          @click="selectDate(day.iso)"
          class="w-14 shrink-0 rounded-xl border py-2 flex flex-col items-center transition-colors disabled:opacity-50"
          :class="
            modelDate === day.iso
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:border-brand-400'
          "
        >
          <span class="text-[10px] font-black uppercase tracking-wider" :class="modelDate === day.iso ? 'text-white/80' : 'text-slate-400'">
            {{ day.isToday ? 'Today' : day.weekday }}
          </span>
          <span class="text-lg font-black leading-tight">{{ day.day }}</span>
          <span class="text-[10px] font-bold" :class="modelDate === day.iso ? 'text-white/80' : 'text-slate-400'">
            {{ day.month }}
          </span>
        </button>
      </div>
    </div>

    <!-- Slots for the selected day -->
    <div class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Available times</p>
        <button
          v-if="modelDate && !loading"
          type="button"
          @click="loadSlots"
          class="text-[11px] font-bold text-brand-600 hover:underline flex items-center gap-1"
        >
          <RefreshCw class="w-3 h-3" /> Refresh
        </button>
      </div>

      <div v-if="!modelDate" class="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
        <CalendarDays class="w-6 h-6 text-slate-300 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-500">Choose a day to see its slots</p>
      </div>

      <div v-else-if="loading" class="grid grid-cols-3 gap-2">
        <div v-for="i in 6" :key="i" class="h-10 rounded-lg bg-slate-100 animate-pulse"></div>
      </div>

      <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-3">
        <p class="text-xs font-bold text-red-700 mb-2">{{ error }}</p>
        <button
          type="button"
          @click="loadSlots"
          class="text-xs font-black text-red-700 underline underline-offset-2"
        >
          Try again
        </button>
      </div>

      <div v-else-if="slots.length === 0" class="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
        <Clock class="w-6 h-6 text-slate-300 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-600">No bookable slots on this day</p>
        <p class="text-xs text-slate-400 font-medium mt-0.5">
          The provider is either fully booked, closed, or has blocked this date.
        </p>
      </div>

      <div v-else class="grid grid-cols-3 gap-2">
        <button
          v-for="slot in slots"
          :key="slot.startTime"
          type="button"
          :disabled="!slot.available || disabled"
          :title="slot.available ? 'Select this slot' : 'Already booked or blocked'"
          @click="selectSlot(slot.startTime)"
          class="rounded-lg border px-2 py-2 text-center transition-colors disabled:cursor-not-allowed"
          :class="
            !slot.available
              ? 'bg-slate-50 border-slate-200 text-slate-300 line-through'
              : modelStart === slot.startTime
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-700'
          "
        >
          <span class="block text-sm font-black">{{ formatTime12h(slot.startTime) }}</span>
          <span
            v-if="!slot.available"
            class="block text-[9px] font-black uppercase tracking-wider text-slate-400 no-underline"
          >
            Taken
          </span>
          <span
            v-else-if="modelStart === slot.startTime"
            class="block text-[9px] font-black uppercase tracking-wider text-white/70"
          >
            Selected
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarDays, Clock, RefreshCw } from 'lucide-vue-next';
import type { AvailabilitySlot } from '@/api_factory/modules/availability';
import { servicesApi } from '@/api_factory/modules/services';
import {
  buildUpcomingDays,
  formatTime12h,
  getApiError,
  type DayOption,
} from '@/composables/modules/services/useServiceFormatting';

/**
 * Date + slot picker backed by `GET /services/:id/availability?date=…`.
 *
 * Unavailable slots stay in the list (disabled and struck through) so a busy day reads as
 * busy rather than broken. The parent owns the selected values through `v-model:date` and
 * `v-model:startTime`; `reload()` is exposed so a parent can refresh after a 409.
 */

const props = withDefaults(
  defineProps<{
    serviceId: string;
    date: string;
    startTime: string;
    days?: number;
    disabled?: boolean;
  }>(),
  { days: 14, disabled: false },
);

const emit = defineEmits<{
  (event: 'update:date', value: string): void;
  (event: 'update:startTime', value: string): void;
  (event: 'loaded', slots: AvailabilitySlot[]): void;
}>();

const days = ref<DayOption[]>([]);
const slots = ref<AvailabilitySlot[]>([]);
const loading = ref(false);
const error = ref('');

const modelDate = computed(() => props.date);
const modelStart = computed(() => props.startTime);

const selectDate = (iso: string) => {
  if (iso === props.date) return;
  emit('update:date', iso);
  emit('update:startTime', '');
  void loadSlots(iso);
};

const selectSlot = (startTime: string) => {
  if (!props.disabled) emit('update:startTime', startTime);
};

const loadSlots = async (dateOverride?: string) => {
  const date = dateOverride || props.date;
  if (!date || !props.serviceId) {
    slots.value = [];
    return;
  }

  loading.value = true;
  error.value = '';
  try {
    const response = await servicesApi.availability(props.serviceId, date);
    slots.value = Array.isArray(response.data) ? response.data : [];
    emit('loaded', slots.value);
  } catch (err) {
    slots.value = [];
    error.value = getApiError(err).message;
  } finally {
    loading.value = false;
  }
};

watch(
  () => [props.serviceId, props.date] as const,
  ([serviceId, date]) => {
    if (!serviceId) return;
    if (!date) {
      slots.value = [];
      return;
    }
    void loadSlots();
  },
  { immediate: true },
);

onMounted(() => {
  // Built on the client only: the server may sit in a different timezone, and the day list
  // must match the student's calendar. A one-tick skeleton is the honest trade.
  days.value = buildUpcomingDays(props.days);
});

defineExpose({ reload: () => loadSlots() });
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}
</style>
