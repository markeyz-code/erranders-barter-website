<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black"
    :class="meta.pill"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="meta.dot"></span>
    {{ meta.label }}
  </span>
</template>

<script setup lang="ts">
import type { BookingStatus } from '@/api_factory/modules/bookings';
import { bookingStatusMeta } from '@/composables/modules/services/useServiceFormatting';

const props = defineProps<{ status: BookingStatus }>();
const meta = computed(() => bookingStatusMeta(props.status));
</script>
