<template>
  <div class="p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-5">
        <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">Availability</p>
        <h1 class="text-2xl font-extrabold text-slate-900">When can students book you?</h1>
        <p class="text-sm text-slate-500 font-medium">
          These windows produce the bookable slots on every one of your services. Anything outside
          them shows as unavailable.
        </p>
      </div>

      <div v-if="loading" class="space-y-2">
        <div v-for="i in 7" :key="i" class="h-14 rounded-xl bg-slate-100 animate-pulse" />
      </div>

      <div v-else-if="error" class="py-14 text-center">
        <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="font-bold text-slate-900">Could not load your availability</p>
        <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
        <button class="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <template v-else>
        <!-- Weekly windows -->
        <div class="rounded-2xl border border-slate-200 divide-y divide-slate-100">
          <div
            v-for="day in days"
            :key="day.dayOfWeek"
            class="flex flex-wrap items-center gap-3 p-3.5"
          >
            <label class="flex items-center gap-2.5 w-36 shrink-0">
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                :checked="day.isActive"
                @change="day.isActive = ($event.target as HTMLInputElement).checked"
              />
              <span class="text-sm font-bold" :class="day.isActive ? 'text-slate-900' : 'text-slate-400'">
                {{ day.label }}
              </span>
            </label>

            <div class="flex items-center gap-2" :class="{ 'opacity-40 pointer-events-none': !day.isActive }">
              <input
                v-model="day.startTime"
                type="time"
                class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:border-brand-500"
              />
              <span class="text-slate-400 text-xs font-bold">to</span>
              <input
                v-model="day.endTime"
                type="time"
                class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div v-if="saveError" class="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
          <p class="text-xs font-bold text-red-700">{{ saveError }}</p>
        </div>

        <div class="mt-4 flex items-center gap-3">
          <button
            class="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-40"
            :disabled="saving"
            @click="save"
          >
            {{ saving ? 'Saving…' : 'Save availability' }}
          </button>
          <span v-if="savedAt" class="text-xs font-bold text-emerald-600">Saved</span>
        </div>

        <!-- Blackout dates -->
        <div class="mt-10">
          <h2 class="text-lg font-extrabold text-slate-900">Days off</h2>
          <p class="text-sm text-slate-500 font-medium mb-3">
            Block a specific date — a trip, an exam, a rest day. It overrides the weekly windows.
          </p>

          <div class="flex flex-wrap items-end gap-2">
            <label class="block">
              <span class="text-xs font-bold text-slate-600">Date</span>
              <input
                v-model="newException.date"
                type="date"
                class="mt-1 block bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
            </label>
            <label class="block flex-1 min-w-[180px]">
              <span class="text-xs font-bold text-slate-600">Note (optional)</span>
              <input
                v-model="newException.note"
                type="text"
                class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="e.g. Travelling"
              />
            </label>
            <button
              class="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              :disabled="!newException.date || addingException"
              @click="addException"
            >
              Block date
            </button>
          </div>

          <div v-if="exceptions.length === 0" class="mt-4 p-6 text-center border border-dashed border-slate-200 rounded-xl">
            <p class="text-sm font-semibold text-slate-500">No blocked dates</p>
          </div>

          <div v-else class="mt-4 space-y-2">
            <div
              v-for="ex in exceptions"
              :key="ex._id || ex.date"
              class="flex items-center justify-between p-3 rounded-xl border border-slate-200"
            >
              <div>
                <p class="text-sm font-bold text-slate-900">{{ formatDateLong(ex.date) }}</p>
                <p v-if="ex.note" class="text-xs text-slate-500">{{ ex.note }}</p>
              </div>
              <button
                class="text-xs font-bold text-red-600 hover:underline"
                @click="removeException(ex)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { AlertTriangle } from 'lucide-vue-next';
import {
  availabilityApi,
  type AvailabilityException,
  type WeeklyWindowPayload,
} from '@/api_factory/modules/availability';
import { getApiError, formatDateLong, toIsoDate } from '@/composables/modules/services/useServiceFormatting';

/**
 * Weekly availability + blackout dates. `PUT /availability/me` REPLACES the whole
 * weekly set, so this page always sends all seven days.
 */

definePageMeta({ layout: 'dashboard' });

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type DayRow = WeeklyWindowPayload & { label: string; isActive: boolean };

const days = ref<DayRow[]>(
  DAY_LABELS.map((label, dayOfWeek) => ({
    label,
    dayOfWeek,
    startTime: '09:00',
    endTime: '17:00',
    isActive: false,
  })),
);

const exceptions = ref<AvailabilityException[]>([]);
const loading = ref(true);
const saving = ref(false);
const savedAt = ref(false);
const error = ref('');
const saveError = ref('');
const addingException = ref(false);
const newException = reactive({ date: '', note: '' });

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await availabilityApi.getMine();
    const existing = data?.weeklyWindows ?? [];
    days.value = DAY_LABELS.map((label, dayOfWeek) => {
      const found = existing.find((w) => w.dayOfWeek === dayOfWeek);
      return {
        label,
        dayOfWeek,
        startTime: found?.startTime || '09:00',
        endTime: found?.endTime || '17:00',
        isActive: !!found && found.isActive !== false,
      };
    });
    exceptions.value = data?.exceptions ?? [];
  } catch (err) {
    error.value = getApiError(err).message;
  } finally {
    loading.value = false;
  }
};

const validDays = computed(() =>
  days.value.filter((d) => d.isActive && d.startTime && d.endTime && d.startTime < d.endTime),
);

const save = async () => {
  saving.value = true;
  saveError.value = '';
  savedAt.value = false;
  try {
    await availabilityApi.replaceWeekly(
      validDays.value.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        startTime: d.startTime,
        endTime: d.endTime,
      })),
    );
    savedAt.value = true;
  } catch (err) {
    saveError.value = getApiError(err).message;
  } finally {
    saving.value = false;
  }
};

const addException = async () => {
  if (!newException.date) return;
  addingException.value = true;
  saveError.value = '';
  try {
    await availabilityApi.addException({
      date: newException.date,
      isBlocked: true,
      note: newException.note.trim() || undefined,
    });
    newException.date = todayIso();
    newException.note = '';
    await load();
  } catch (err) {
    saveError.value = getApiError(err).message;
  } finally {
    addingException.value = false;
  }
};

const removeException = async (ex: AvailabilityException) => {
  const id = (ex as any)._id;
  if (!id) return;
  try {
    await availabilityApi.removeException(id);
    exceptions.value = exceptions.value.filter((e) => (e as any)._id !== id);
  } catch (err) {
    saveError.value = getApiError(err).message;
  }
};

const todayIso = () => toIsoDate(new Date());

onMounted(() => {
  newException.date = todayIso();
  void load();
});
</script>
