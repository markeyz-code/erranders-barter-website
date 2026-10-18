<template>
  <div class="space-y-5">
    <!-- Custom Calendar Header -->
    <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Select Date</p>
          <h3 class="text-base sm:text-lg font-black text-slate-900 capitalize">
            {{ monthNames[viewMonth] }} {{ viewYear }}
          </h3>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="jumpToToday"
            class="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-brand-600 hover:bg-white border border-slate-200 transition-colors"
            title="Jump to today"
          >
            Today
          </button>
          <button
            type="button"
            :disabled="!canPrevMonth"
            @click="prevMonth"
            class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous month"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button
            type="button"
            @click="nextMonth"
            class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Days of Week Header -->
      <div class="grid grid-cols-7 gap-1 text-center mb-2">
        <span
          v-for="name in weekdayNames"
          :key="name"
          class="text-[11px] font-black uppercase tracking-wider text-slate-400 py-1"
        >
          {{ name }}
        </span>
      </div>

      <!-- Calendar Days Grid -->
      <div class="grid grid-cols-7 gap-1 sm:gap-1.5">
        <template v-for="(day, idx) in daysInViewMonth" :key="day ? day.iso : `blank-${idx}`">
          <!-- Empty cell padding -->
          <div v-if="!day" class="aspect-square"></div>

          <!-- Day Button -->
          <button
            v-else
            type="button"
            :disabled="day.isPast || disabled"
            @click="selectDate(day.iso)"
            class="aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm font-bold transition-all relative"
            :class="[
              day.isPast
                ? 'text-slate-300 opacity-40 cursor-not-allowed'
                : modelDate === day.iso
                  ? 'bg-brand-600 text-white font-black shadow-md shadow-brand-600/30 scale-105 z-10'
                  : 'bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 border border-slate-200/80',
              day.isToday && modelDate !== day.iso ? 'ring-2 ring-brand-500/50 font-black text-brand-700' : ''
            ]"
            :title="day.isPast ? 'Past date' : day.iso"
          >
            <span>{{ day.date }}</span>
            <span
              v-if="day.isToday && modelDate !== day.iso"
              class="w-1 h-1 rounded-full bg-brand-600 absolute bottom-1"
            ></span>
          </button>
        </template>
      </div>

      <!-- Friendly selected date indicator -->
      <div v-if="modelDate" class="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
        <span class="text-slate-500 font-medium">
          Selected: <strong class="text-slate-900 font-bold">{{ formattedSelectedDate }}</strong>
        </span>
        <span v-if="isSelectedToday" class="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px]">
          Today
        </span>
      </div>
    </div>

    <!-- Booking Duration / Hours Selector Section -->
    <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Booking Duration</p>
          <h4 class="text-sm sm:text-base font-black text-slate-900">
            Select or Edit Hours
          </h4>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="px-2.5 py-1 rounded-full text-xs font-black bg-brand-50 text-brand-700 border border-brand-200">
            {{ formatDuration(selectedDuration) }}
          </span>
        </div>
      </div>

      <!-- Stepper Controls & Quick Presets -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <!-- Stepper (Minus / Current / Plus) -->
        <div class="flex items-center justify-between bg-white border border-slate-200/90 rounded-xl p-1 shrink-0 shadow-xs">
          <button
            type="button"
            :disabled="selectedDuration <= minDurationMinutes || disabled"
            @click="adjustDuration(-30)"
            class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base"
            aria-label="Decrease hours"
            title="Decrease duration"
          >
            <Minus class="w-4 h-4" />
          </button>
          <span class="px-3 text-xs sm:text-sm font-black text-slate-900 text-center min-w-[72px]">
            {{ formatDuration(selectedDuration) }}
          </span>
          <button
            type="button"
            :disabled="selectedDuration >= maxDurationMinutes || disabled"
            @click="adjustDuration(30)"
            class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base"
            aria-label="Increase hours"
            title="Increase duration"
          >
            <Plus class="w-4 h-4" />
          </button>
        </div>

        <!-- Quick Preset Chips -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="preset in durationPresets"
            :key="preset.minutes"
            type="button"
            :disabled="disabled"
            @click="setDuration(preset.minutes)"
            class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            :class="[
              selectedDuration === preset.minutes
                ? 'bg-slate-900 text-white font-black shadow-xs ring-1 ring-slate-900'
                : 'bg-white text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 border border-slate-200/90'
            ]"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Realtime Rate & Duration Info -->
      <div v-if="service" class="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-1 text-xs">
        <span class="text-slate-500 font-medium">
          Rate: <strong class="text-slate-800 font-bold">{{ formatPriceLabel(service.priceType, service.price) }}</strong>
        </span>
        <span class="text-brand-700 font-extrabold">
          Estimated: {{ formatPriceBreakdown(service.priceType, service.price, selectedDuration) }}
        </span>
      </div>
    </div>

    <!-- Available Time Slots Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Available Time Slots</p>
          <p class="text-xs text-slate-500 font-medium">
            Slots are calculated for your selected <strong>{{ formatDuration(selectedDuration) }}</strong> session.
          </p>
        </div>
        <button
          v-if="modelDate && !loading"
          type="button"
          @click="loadSlots()"
          class="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 transition-colors"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" />
          <span>Refresh</span>
        </button>
      </div>

      <!-- No date chosen state -->
      <div v-if="!modelDate" class="rounded-2xl border border-dashed border-slate-200 p-6 text-center bg-slate-50/50">
        <CalendarDays class="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-600">Pick a calendar date above</p>
        <p class="text-xs text-slate-400 mt-1">Available start and end times will appear here.</p>
      </div>

      <!-- Loading skeleton -->
      <div v-else-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div v-for="i in 4" :key="i" class="h-16 rounded-xl bg-slate-100 animate-pulse"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
        <AlertCircle class="w-6 h-6 text-red-500 mx-auto mb-1.5" />
        <p class="text-xs font-bold text-red-700">{{ error }}</p>
        <button
          type="button"
          @click="loadSlots()"
          class="mt-2 text-xs font-black text-red-700 underline underline-offset-2 hover:text-red-900"
        >
          Try loading slots again
        </button>
      </div>

      <!-- Zero slots available -->
      <div v-else-if="slots.length === 0" class="rounded-2xl border border-dashed border-slate-200 p-6 text-center bg-slate-50/50">
        <Clock class="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-700">No open slots on this date</p>
        <p class="text-xs text-slate-500 max-w-xs mx-auto mt-1">
          The provider is fully booked or has closed their schedule for {{ formattedSelectedDate }}. Please choose another date above or adjust your duration.
        </p>
      </div>

      <!-- Time Slot Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          v-for="slot in slots"
          :key="slot.startTime"
          type="button"
          :disabled="!slot.available || disabled"
          @click="selectSlot(slot.startTime)"
          class="p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2"
          :class="[
            !slot.available
              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
              : modelStart === slot.startTime
                ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-900/10'
                : 'bg-white border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-slate-800'
          ]"
        >
          <div class="min-w-0">
            <!-- Full Start Time to End Time Range -->
            <div class="flex items-center gap-1.5">
              <Clock
                class="w-3.5 h-3.5 shrink-0"
                :class="!slot.available ? 'text-slate-300' : modelStart === slot.startTime ? 'text-brand-400' : 'text-brand-600'"
              />
              <span
                class="text-xs sm:text-sm font-black tracking-tight"
                :class="!slot.available ? 'line-through text-slate-400' : ''"
              >
                {{ formatTimeRange(slot.startTime, slot.endTime) }}
              </span>
            </div>
            <p
              class="text-[11px] font-medium mt-0.5"
              :class="!slot.available ? 'text-slate-400' : modelStart === slot.startTime ? 'text-white/80' : 'text-slate-500'"
            >
              {{ formatDuration(selectedDuration) }} session
            </p>
          </div>

          <!-- Status badge -->
          <div class="shrink-0">
            <span
              v-if="!slot.available"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200/80 text-slate-600"
            >
              <Lock class="w-2.5 h-2.5" /> Booked
            </span>
            <span
              v-else-if="modelStart === slot.startTime"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500 text-white"
            >
              <Check class="w-3 h-3 stroke-[3]" /> Selected
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              Available
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Executive Selection Summary Card -->
    <div
      v-if="selectedSlotInfo"
      class="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 sm:p-5 space-y-3"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="text-[10px] font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-2 py-0.5 rounded-md inline-block mb-1">
            Booking Summary
          </span>
          <h4 class="text-sm sm:text-base font-extrabold text-slate-900">
            {{ formattedSelectedDate }}
          </h4>
          <p class="text-xs font-bold text-brand-700 flex items-center gap-1.5 mt-0.5">
            <Clock class="w-3.5 h-3.5" />
            From {{ formatTime12h(selectedSlotInfo.startTime) }} to {{ formatTime12h(selectedSlotInfo.endTime) }} ({{ formatDuration(selectedDuration) }})
          </p>
        </div>

        <div class="text-right shrink-0">
          <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Price</p>
          <p class="text-base sm:text-lg font-black text-slate-900">
            {{ calculatedPriceText }}
          </p>
        </div>
      </div>

      <!-- Price Breakdown explanation -->
      <div class="pt-2.5 border-t border-brand-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-600">
        <span class="font-medium">
          Pricing structure: <strong class="text-slate-800 font-bold">{{ priceBreakdownExplanation }}</strong>
        </span>
        <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Erranders Escrow Protected
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  CalendarDays,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  Lock,
  ShieldCheck,
  AlertCircle,
  Minus,
  Plus,
} from 'lucide-vue-next';
import type { AvailabilitySlot } from '@/api_factory/modules/availability';
import { servicesApi, type Service } from '@/api_factory/modules/services';
import {
  formatTime12h,
  formatTimeRange,
  formatDuration,
  formatPriceLabel,
  formatPriceBreakdown,
  calculateServiceTotal,
  formatDateLong,
  getApiError,
} from '@/composables/modules/services/useServiceFormatting';

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  iso: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  weekday: number;
}

const props = withDefaults(
  defineProps<{
    serviceId: string;
    service?: Service | null;
    date: string;
    startTime: string;
    durationMinutes?: number;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{
  (event: 'update:date', value: string): void;
  (event: 'update:startTime', value: string): void;
  (event: 'update:durationMinutes', value: number): void;
  (event: 'loaded', slots: AvailabilitySlot[]): void;
}>();

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekdayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Clock references
const now = new Date();
const todayYear = now.getFullYear();
const todayMonth = now.getMonth();
const todayDate = now.getDate();
const todayIso = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;

const viewYear = ref(todayYear);
const viewMonth = ref(todayMonth);

const slots = ref<AvailabilitySlot[]>([]);
const loading = ref(false);
const error = ref('');

// Dynamic Duration Controls
const minDurationMinutes = 15;
const maxDurationMinutes = 480;

const durationPresets = [
  { label: '30m', minutes: 30 },
  { label: '1 hr', minutes: 60 },
  { label: '2 hrs', minutes: 120 },
  { label: '3 hrs', minutes: 180 },
  { label: '4 hrs', minutes: 240 },
];

const selectedDuration = ref<number>(
  props.durationMinutes || props.service?.durationMinutes || 60,
);

watch(
  () => props.durationMinutes,
  (val) => {
    if (val && val !== selectedDuration.value) {
      selectedDuration.value = val;
    }
  },
);

watch(
  () => props.service?.durationMinutes,
  (val) => {
    if (val && !props.durationMinutes) {
      selectedDuration.value = val;
    }
  },
);

const setDuration = (minutes: number) => {
  if (props.disabled) return;
  const clamped = Math.max(minDurationMinutes, Math.min(maxDurationMinutes, minutes));
  if (selectedDuration.value === clamped) return;
  selectedDuration.value = clamped;
  emit('update:durationMinutes', clamped);
  emit('update:startTime', '');
  void loadSlots(undefined, clamped);
};

const adjustDuration = (delta: number) => {
  if (props.disabled) return;
  const next = Math.max(
    minDurationMinutes,
    Math.min(maxDurationMinutes, selectedDuration.value + delta),
  );
  setDuration(next);
};

const modelDate = computed(() => props.date);
const modelStart = computed(() => props.startTime);

const isSelectedToday = computed(() => modelDate.value === todayIso);

const formattedSelectedDate = computed(() => {
  if (!modelDate.value) return '';
  return formatDateLong(modelDate.value);
});

// Month navigation limits
const canPrevMonth = computed(() => {
  return (
    viewYear.value > todayYear ||
    (viewYear.value === todayYear && viewMonth.value > todayMonth)
  );
});

const prevMonth = () => {
  if (!canPrevMonth.value) return;
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
};

const nextMonth = () => {
  // Allow browsing up to 4 months in advance
  const diff = (viewYear.value - todayYear) * 12 + (viewMonth.value - todayMonth);
  if (diff >= 4) return;
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
};

const jumpToToday = () => {
  viewYear.value = todayYear;
  viewMonth.value = todayMonth;
  selectDate(todayIso);
};

// Compute days in the month (with Monday as first day of week)
const daysInViewMonth = computed(() => {
  const y = viewYear.value;
  const m = viewMonth.value;
  const numDays = new Date(y, m + 1, 0).getDate();
  const firstDayOfWeek = new Date(y, m, 1).getDay(); // 0=Sun, 1=Mon...
  // Convert Sunday=0 to Monday=0: (firstDayOfWeek + 6) % 7
  const offset = (firstDayOfWeek + 6) % 7;

  const result: Array<CalendarDay | null> = [];

  for (let i = 0; i < offset; i++) {
    result.push(null);
  }

  for (let d = 1; d <= numDays; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = iso < todayIso;
    const isToday = iso === todayIso;
    const weekday = new Date(y, m, d).getDay();
    result.push({
      date: d,
      month: m,
      year: y,
      iso,
      isCurrentMonth: true,
      isToday,
      isPast,
      weekday,
    });
  }

  return result;
});

const selectDate = (iso: string) => {
  if (iso < todayIso) return;
  emit('update:date', iso);
  emit('update:startTime', '');
  void loadSlots(iso);
};

const selectSlot = (startTime: string) => {
  if (!props.disabled) emit('update:startTime', startTime);
};

const loadSlots = async (dateOverride?: string, durationOverride?: number) => {
  const targetDate = dateOverride || props.date;
  const targetDuration = durationOverride ?? selectedDuration.value;
  if (!targetDate || !props.serviceId) {
    slots.value = [];
    return;
  }

  loading.value = true;
  error.value = '';
  try {
    const response = await servicesApi.availability(
      props.serviceId,
      targetDate,
      targetDuration,
    );
    slots.value = Array.isArray(response.data) ? response.data : [];
    emit('loaded', slots.value);
  } catch (err) {
    slots.value = [];
    error.value = getApiError(err).message;
  } finally {
    loading.value = false;
  }
};

const selectedSlotInfo = computed(() => {
  if (!modelStart.value) return null;
  return slots.value.find((s) => s.startTime === modelStart.value) || null;
});

const calculatedPriceText = computed(() => {
  const s = props.service;
  if (!s) return '—';
  if (s.priceType === 'negotiable') return 'Negotiable';
  const total = calculateServiceTotal(s.priceType, s.price, selectedDuration.value);
  return `₦${total.toLocaleString()}`;
});

const priceBreakdownExplanation = computed(() => {
  const s = props.service;
  if (!s) return '';
  return formatPriceBreakdown(s.priceType, s.price, selectedDuration.value);
});

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
);

onMounted(() => {
  if (!props.date) {
    selectDate(todayIso);
  } else {
    const parts = props.date.split('-');
    if (parts.length === 3) {
      viewYear.value = Number(parts[0]);
      viewMonth.value = Number(parts[1]) - 1;
    }
    void loadSlots(props.date);
  }
});

defineExpose({ reload: () => loadSlots() });
</script>
