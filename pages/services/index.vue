<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">Services</p>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">Book a student pro</h1>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Barbers, tutors, nail techs, laundry and photographers — pick a service, then pick a slot.
          </p>
        </div>

        <form class="flex items-center w-full lg:max-w-md" @submit.prevent="submitSearch">
          <div class="relative w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="searchInput"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-medium focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="Search services, skills or tags…"
            />
          </div>
          <button
            type="submit"
            class="ml-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <!-- Hostel Movement Season Spotlight (Commented out) -->
      <!--
      <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          to="/fumigation"
          class="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white border border-emerald-500/30 flex items-center justify-between gap-4 group hover:shadow-xl hover:shadow-emerald-950/20 transition-all"
        >
          <div class="space-y-1">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase tracking-wider inline-block">
              🧪 Pest Free Guarantee
            </span>
            <h3 class="text-base sm:text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
              Hostel Room Fumigation & Bedbug Eradication
            </h3>
            <p class="text-xs text-slate-300 font-medium">
              Certified human-safe chemicals + trained student crew. From ₦14,000.
            </p>
          </div>
          <div class="shrink-0 w-10 h-10 rounded-2xl bg-emerald-50 text-slate-950 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform shadow-md">
            →
          </div>
        </NuxtLink>

        <NuxtLink
          to="/movers"
          class="p-5 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white border border-amber-500/30 flex items-center justify-between gap-4 group hover:shadow-xl hover:shadow-amber-950/20 transition-all"
        >
          <div class="space-y-1">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] uppercase tracking-wider inline-block">
              🚚 Heavy Lifting & Stairs
            </span>
            <h3 class="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors">
              Campus Hostel Movers & Haulers
            </h3>
            <p class="text-xs text-slate-300 font-medium">
              2-man student lifting crews with trolleys & scheduled slots. From ₦2,500.
            </p>
          </div>
          <div class="shrink-0 w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform shadow-md">
            →
          </div>
        </NuxtLink>

        <NuxtLink
          to="/become-a-business"
          class="p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white border border-purple-500/30 flex items-center justify-between gap-4 group hover:shadow-xl hover:shadow-purple-950/20 transition-all"
        >
          <div class="space-y-1">
            <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-black text-[10px] uppercase tracking-wider inline-block">
               Vendor Operations
            </span>
            <h3 class="text-base sm:text-lg font-black text-white group-hover:text-purple-400 transition-colors">
              Service Business Mini-Admin
            </h3>
            <p class="text-xs text-slate-300 font-medium">
              Manage dispatch, recruit campus crew, track payouts & configure domain.
            </p>
          </div>
          <div class="shrink-0 w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform shadow-md">
            ⚙️
          </div>
        </NuxtLink>
      </div>
      -->

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <CustomSelect
          v-model="filters.category"
          :options="categoryOptions"
          placeholder="All categories"
        />

        <button
          type="button"
          class="inline-flex items-center gap-2 border rounded-full px-4 py-2.5 bg-white text-sm font-bold transition-colors"
          :class="filters.isRemote ? 'border-brand-600 text-brand-700 bg-brand-50' : 'border-slate-200 text-slate-700 hover:border-slate-300'"
          :aria-pressed="filters.isRemote"
          @click="filters.isRemote = !filters.isRemote"
        >
          <Video class="w-4 h-4" />
          Remote only
          <span
            class="relative w-8 h-4 rounded-full transition-colors"
            :class="filters.isRemote ? 'bg-brand-600' : 'bg-slate-300'"
          >
            <span
              class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform"
              :class="filters.isRemote ? 'translate-x-4' : 'translate-x-0'"
            ></span>
          </span>
        </button>

        <div class="inline-flex items-center gap-2 border border-slate-200 rounded-full pl-3 pr-1.5 py-1.5 bg-white">
          <span class="text-xs font-black text-slate-400">₦</span>
          <input
            v-model="filters.minPrice"
            type="number"
            min="0"
            inputmode="numeric"
            placeholder="Min"
            class="w-14 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
            @keyup.enter="applyPrice"
          />
          <span class="text-slate-300">–</span>
          <input
            v-model="filters.maxPrice"
            type="number"
            min="0"
            inputmode="numeric"
            placeholder="Max"
            class="w-14 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
            @keyup.enter="applyPrice"
          />
          <button
            type="button"
            class="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-full hover:bg-brand-600 transition-colors"
            @click="applyPrice"
          >
            Apply
          </button>
        </div>

        <button
          v-if="hasActiveFilters"
          type="button"
          class="text-xs font-bold text-slate-500 hover:text-brand-600 underline underline-offset-2 transition-colors"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <p v-if="!loading && !error" class="text-xs font-bold text-slate-400 mb-4">
        {{ meta.total }} {{ meta.total === 1 ? 'service' : 'services' }} available
      </p>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div class="aspect-[4/3] bg-slate-100 animate-pulse"></div>
          <div class="p-4 space-y-2">
            <div class="h-2.5 w-16 bg-slate-100 rounded animate-pulse"></div>
            <div class="h-4 w-3/4 bg-slate-100 rounded animate-pulse"></div>
            <div class="h-3 w-1/2 bg-slate-100 rounded animate-pulse"></div>
            <div class="flex justify-between pt-2">
              <div class="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
              <div class="h-3 w-12 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-20 text-center border border-red-200 bg-red-50 rounded-3xl px-4">
        <AlertTriangle class="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h2 class="text-2xl font-bold text-red-700 mb-2">Could not load services</h2>
        <p class="text-red-600 font-medium mb-5">{{ error }}</p>
        <button
          class="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
          @click="fetchServices"
        >
          Try again
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="services.length === 0" class="py-20 text-center border border-slate-200 border-dashed rounded-3xl px-4">
        <div class="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Briefcase class="w-7 h-7 text-brand-600" />
        </div>
        <h2 class="text-2xl font-bold text-slate-700 mb-2">
          {{ hasActiveFilters ? 'No services match — try a different search' : 'No services listed yet' }}
        </h2>
        <p class="text-slate-500 font-medium mb-5 max-w-md mx-auto">
          {{
            hasActiveFilters
              ? 'Widen the price range, turn off “remote only”, or search for another skill.'
              : 'Student providers are still setting up shop. Check back soon, or be the first to offer yours.'
          }}
        </p>
        <div class="flex items-center justify-center gap-3">
          <button
            v-if="hasActiveFilters"
            class="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm"
            @click="clearFilters"
          >
            Clear filters
          </button>
          <NuxtLink
            to="/become-a-provider"
            class="text-brand-600 font-bold text-sm hover:underline"
          >
            Become a provider
          </NuxtLink>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ServiceCard v-for="service in services" :key="service._id" :service="service" />
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && meta.totalPages > 1" class="flex items-center justify-center gap-3 mt-8">
        <button
          type="button"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:border-brand-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="meta.page <= 1"
          @click="goToPage(meta.page - 1)"
        >
          <ChevronLeft class="w-4 h-4" /> Previous
        </button>
        <span class="text-sm font-bold text-slate-500">
          Page {{ meta.page }} of {{ meta.totalPages }}
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:border-brand-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="meta.page >= meta.totalPages"
          @click="goToPage(meta.page + 1)"
        >
          Next <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Search, Video, ChevronLeft, ChevronRight, AlertTriangle, Briefcase } from 'lucide-vue-next';
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CustomSelect from '~/components/CustomSelect.vue';
import ServiceCard from '~/components/ServiceCard.vue';
import { servicesApi, type Paginated, type Service, type ServiceBrowseQuery } from '@/api_factory/modules/services';
import { categoriesApi } from '@/api_factory/modules/categories';
import { getApiError, type CategoryOption } from '@/composables/modules/services/useServiceFormatting';

/**
 * Public services marketplace. Everything on this page comes from GET /services; there is no
 * local sample content. Filters map 1:1 onto the query the backend accepts.
 */

definePageMeta({ layout: 'default' });

useSeoMeta({
  title: 'Services & Skills | Decluttered by Erranders',
  description: 'Book student barbers, tutors, nail techs, laundry and photographers by the slot.',
});

const route = useRoute();

const services = ref<Service[]>([]);
const loading = ref(true);
const error = ref('');
const searchInput = ref('');
const categories = ref<CategoryOption[]>([]);

const filters = reactive({
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  isRemote: false,
  page: 1,
});

const limit = 12;
const meta = ref<Paginated<Service>['meta']>({ total: 0, page: 1, limit, totalPages: 1 });

const categoryOptions = computed(() => [
  { value: '', label: 'All categories' },
  ...categories.value.map((category) => ({ value: category._id, label: category.name })),
]);

const hasActiveFilters = computed(
  () =>
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice) ||
    filters.isRemote,
);

const fetchServices = async () => {
  loading.value = true;
  error.value = '';

  const params: ServiceBrowseQuery = { page: filters.page, limit };

  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.isRemote) params.isRemote = true;

  const minPrice = Number(filters.minPrice);
  if (filters.minPrice !== '' && Number.isFinite(minPrice) && minPrice >= 0) {
    params.minPrice = minPrice;
  }
  const maxPrice = Number(filters.maxPrice);
  if (filters.maxPrice !== '' && Number.isFinite(maxPrice) && maxPrice >= 0) {
    params.maxPrice = maxPrice;
  }

  try {
    const response = await servicesApi.browse(params);
    const payload = response.data;
    services.value = Array.isArray(payload?.data) ? payload.data : [];
    meta.value = payload?.meta ?? { total: 0, page: filters.page, limit, totalPages: 1 };
  } catch (err) {
    services.value = [];
    meta.value = { total: 0, page: 1, limit, totalPages: 1 };
    error.value = getApiError(err).message;
  } finally {
    loading.value = false;
  }
};

const reloadFromFirstPage = () => {
  filters.page = 1;
  void fetchServices();
};

const submitSearch = () => {
  filters.search = searchInput.value.trim();
  reloadFromFirstPage();
};

const applyPrice = () => {
  reloadFromFirstPage();
};

const clearFilters = () => {
  filters.search = '';
  filters.category = '';
  filters.minPrice = '';
  filters.maxPrice = '';
  filters.isRemote = false;
  searchInput.value = '';
  reloadFromFirstPage();
};

const goToPage = (page: number) => {
  if (page < 1 || page > meta.value.totalPages) return;
  filters.page = page;
  void fetchServices();
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Category and the remote switch apply immediately; free-text price waits for Apply/Enter.
const filtersReady = ref(false);
watch(
  () => [filters.category, filters.isRemote],
  () => {
    if (filtersReady.value) reloadFromFirstPage();
  },
);

const loadCategories = async () => {
  const { data } = await categoriesApi.fetch();
  if (Array.isArray(data)) {
    categories.value = data.map((category: CategoryOption) => ({
      _id: category._id,
      name: category.name,
    }));
  }
};

onMounted(async () => {
  if (typeof route.query.q === 'string') {
    searchInput.value = route.query.q;
    filters.search = route.query.q;
  }
  if (typeof route.query.category === 'string') {
    filters.category = route.query.category;
  }
  if (route.query.remote === 'true') {
    filters.isRemote = true;
  }

  await Promise.all([loadCategories(), fetchServices()]);
  filtersReady.value = true;
});
</script>
