<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">Inventory</p>
          <h1 class="text-2xl font-extrabold text-slate-900">My services</h1>
          <p class="text-sm text-slate-500 font-medium">
            Everything you offer, with the price and slot length students will see.
          </p>
        </div>
        <button
          class="px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 inline-flex items-center gap-2"
          @click="openCreate"
        >
          <Plus class="w-4 h-4" /> New service
        </button>
      </div>

      <!-- Not a provider yet -->
      <div v-if="!isProvider && !loading" class="py-16 text-center border border-dashed border-slate-200 rounded-2xl">
        <Briefcase class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="font-extrabold text-slate-900">You're not a provider yet</p>
        <p class="text-sm text-slate-500 mt-1">Set up a provider profile to start listing services.</p>
        <NuxtLink
          to="/become-a-provider"
          class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
        >
          Become a provider
        </NuxtLink>
      </div>

      <div v-else-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-24 rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <div v-else-if="error" class="py-16 text-center">
        <AlertTriangle class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p class="font-bold text-slate-900">Could not load your services</p>
        <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
        <button class="mt-4 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <div v-else-if="services.length === 0" class="py-16 text-center border border-dashed border-slate-200 rounded-2xl">
        <Sparkles class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="font-extrabold text-slate-900">No services yet</p>
        <p class="text-sm text-slate-500 mt-1">Add your first one — it takes about a minute.</p>
        <button
          class="mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
          @click="openCreate"
        >
          Create a service
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="s in services"
          :key="s._id"
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-slate-200"
        >
          <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            <img :src="serviceImage(s)" :alt="s.title" class="w-full h-full object-cover" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-bold text-slate-900 truncate">{{ s.title }}</p>
              <span
                class="px-2 py-0.5 rounded-md text-[11px] font-bold"
                :class="s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ s.isActive ? 'Active' : 'Hidden' }}
              </span>
            </div>
            <div class="mt-1 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span class="text-brand-600 font-black text-sm">{{ formatPriceLabel(s.priceType, s.price) }}</span>
              <span>{{ formatDuration(s.durationMinutes) }}</span>
              <span v-if="s.totalBookings">{{ s.totalBookings }} booked</span>
              <span v-if="s.isRemote">Remote</span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50"
              :disabled="busyId === s._id"
              @click="toggleActive(s)"
            >
              {{ s.isActive ? 'Hide' : 'Publish' }}
            </button>
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50"
              @click="openEdit(s)"
            >
              Edit
            </button>
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50"
              :disabled="busyId === s._id"
              @click="remove(s)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Modal handles create + edit and its own validation -->
      <ServiceFormModal
        :is-open="formOpen"
        :service="editing"
        :categories="categories"
        @close="formOpen = false"
        @saved="onSaved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Plus, Briefcase, Sparkles, AlertTriangle } from 'lucide-vue-next';
import ServiceFormModal from '~/components/ServiceFormModal.vue';
import { servicesApi, type Service } from '@/api_factory/modules/services';
import { categoriesApi } from '@/api_factory/modules/categories';
import type { CategoryOption } from '@/composables/modules/services/useServiceFormatting';
import {
  getApiError,
  formatPriceLabel,
  formatDuration,
  serviceImage,
} from '@/composables/modules/services/useServiceFormatting';

/**
 * The provider's service inventory. Everything is read from and written to the
 * API — no local sample rows. Creation and editing live in `ServiceFormModal`
 * so the validation rules only exist once.
 */

definePageMeta({ layout: 'dashboard' });

const services = ref<Service[]>([]);
const categories = ref<CategoryOption[]>([]);
const loading = ref(true);
const error = ref('');
const busyId = ref('');
const formOpen = ref(false);
const editing = ref<Service | null>(null);

const isProvider = computed(() => providerFlag.value);
const providerFlag = ref(true);

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await servicesApi.myListings();
    services.value = Array.isArray(data) ? data : [];
  } catch (err) {
    const info = getApiError(err);
    // A brand-new account is simply not a provider yet — that is an empty state,
    // not an error.
    if (info.status === 403 || info.status === 404) {
      providerFlag.value = false;
      services.value = [];
    } else {
      error.value = info.message;
    }
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const { data } = await categoriesApi.list();
    const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
    categories.value = list.map((c: any) => ({ _id: c._id, name: c.name }));
  } catch {
    categories.value = [];
  }
};

const openCreate = () => {
  editing.value = null;
  formOpen.value = true;
};
const openEdit = (s: Service) => {
  editing.value = s;
  formOpen.value = true;
};
const onSaved = () => {
  formOpen.value = false;
  void load();
};

const toggleActive = async (s: Service) => {
  busyId.value = s._id;
  try {
    const { data } = await servicesApi.update(s._id, { isActive: !s.isActive });
    const idx = services.value.findIndex((x) => x._id === s._id);
    if (idx >= 0) services.value[idx] = data;
  } catch (err) {
    error.value = getApiError(err).message;
  } finally {
    busyId.value = '';
  }
};

const remove = async (s: Service) => {
  // The backend refuses while an upcoming confirmed booking exists and returns a
  // clear message — surface it rather than pretending it worked.
  if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
  busyId.value = s._id;
  try {
    await servicesApi.remove(s._id);
    services.value = services.value.filter((x) => x._id !== s._id);
  } catch (err) {
    error.value = getApiError(err).message;
  } finally {
    busyId.value = '';
  }
};

onMounted(() => {
  void load();
  void loadCategories();
});
</script>
