<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 relative z-50">
        <div class="w-full sm:w-auto">
          <h1 class="text-4xl font-black text-slate-900 mb-2">
            {{ searchQuery ? 'Search Results' : 'Explore' }}
          </h1>
          <p class="text-slate-500 font-medium mb-4">
            {{ searchQuery ? 'Found items matching "' + searchQuery + '"' : 'Discover everything available on the Erranders network.' }}
          </p>
          <form @submit.prevent="executeSearch" class="flex items-center w-full max-w-md">
            <div class="relative w-full">
              <input
                v-model="localSearchQuery"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                placeholder="Search items, books, electronics..."
              />
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button type="submit" class="ml-2 bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-700 transition-colors">
              Search
            </button>
          </form>
        </div>
        <div class="flex flex-wrap gap-3 w-full sm:w-auto relative z-20">
          <CustomSelect
            v-model="selectedType"
            :options="typeOptions"
            placeholder="All Types"
          />
          <CustomSelect
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="All Categories"
          />
          <CustomSelect
            v-model="selectedSort"
            :options="sortOptions"
            placeholder="Sort By"
            align="right"
          />
        </div>
      </div>

      <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-500 font-bold">Loading items...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="py-20 text-center border border-slate-200 border-dashed rounded-3xl">
        <h2 class="text-2xl font-bold text-slate-400 mb-2">No items found for "{{ searchQuery }}"</h2>
        <NuxtLink to="/explore" class="text-brand-600 font-bold hover:underline">Clear Search</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <NuxtLink 
          v-for="item in filteredItems" 
          :key="item._id" 
          :to="'/item/' + item._id" 
          class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-500 transition-all duration-300"
        >
          <!-- Image Section with Auto-Carousel -->
          <div class="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative" style="container-type: inline-size;">
            <!-- Single image -->
            <img 
              v-if="!item.images || item.images.length <= 1"
              :src="item.images?.[0] || '/no-image.png'" 
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <!-- Multi-image auto-scrolling carousel -->
            <div 
              v-else 
              class="item-carousel w-full h-full"
            >
              <div 
                class="item-carousel-track flex h-full w-max" 
                :style="{ 
                  animation: `scroll-carousel ${item.images.length * 3}s linear infinite`
                }"
              >
                <div 
                  v-for="(img, idx) in [...item.images, ...item.images]" 
                  :key="idx" 
                  class="h-full flex-shrink-0 w-[100cqw]"
                >
                  <img :src="img" :alt="`${item.title} - ${idx + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>
              <!-- Dot indicators -->
              <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                <span 
                  v-for="(_, idx) in item.images" 
                  :key="idx" 
                  class="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm"
                ></span>
              </div>
            </div>
            <!-- Type badge -->
            <div 
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border"
              :class="item.type === 'swap' 
                ? 'bg-amber-50/90 backdrop-blur text-amber-700 border-amber-200' 
                : 'bg-white/90 backdrop-blur text-slate-700 border-slate-200'"
            >
              {{ item.type }}
            </div>
            <!-- Image count badge for multi-image -->
            <div 
              v-if="item.images && item.images.length > 1" 
              class="absolute top-3 right-3 bg-black/50 backdrop-blur text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
            >
              <ImageIcon class="w-3 h-3" />
              {{ item.images.length }}
            </div>
          </div>

          <!-- Content Section -->
          <div class="p-3 sm:p-4">
            <div class="flex justify-between items-start gap-2 mb-1">
              <h3 class="font-bold text-sm sm:text-base truncate text-slate-900">{{ item.title }}</h3>
              <!-- Show price only for non-swap items -->
              <span v-if="item.type !== 'swap' && item.price" class="font-black text-brand-600 text-sm sm:text-base flex-shrink-0">
                ₦{{ Number(item.price).toLocaleString() }}
              </span>
            </div>
            <!-- Swap preference tag -->
            <div v-if="item.type === 'swap' && item.swapPreference" class="mb-2">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                <ArrowRightLeft class="w-3 h-3" />
                Wants: {{ item.swapPreference.length > 30 ? item.swapPreference.slice(0, 30) + '...' : item.swapPreference }}
              </span>
            </div>
            <!-- Description snippet -->
            <p v-if="item.description" class="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
              {{ item.description }}
            </p>
            <p class="text-xs text-slate-500 flex items-center gap-1">
              <MapPin class="w-3 h-3 flex-shrink-0" /> {{ item.location }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
<script setup>
import { MapPin, Search, ArrowRightLeft, ImageIcon } from 'lucide-vue-next'
import CustomSelect from '~/components/CustomSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import { itemsApi, categoriesApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const searchQuery = computed(() => route.query.q || '')
const localSearchQuery = ref(route.query.q || '')

const executeSearch = () => {
  router.push({
    path: '/explore',
    query: { ...route.query, q: localSearchQuery.value || undefined }
  })
}

useSeoMeta({
  title: computed(() => searchQuery.value ? `Search Results for "${searchQuery.value}" | Erranders Barter` : 'Explore Items | Erranders Barter'),
  description: 'Discover everything available on the Erranders network. Buy, sell, and swap electronics, textbooks, and more.',
  ogTitle: 'Explore Erranders Barter',
  ogDescription: 'Discover amazing deals from students around you on the Erranders network.',
})

const selectedType = ref('')
const selectedCategory = ref('')
const selectedSort = ref('newest')

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'sell', label: 'Buy/Sell' },
  { value: 'swap', label: 'Swap' },
  { value: 'service', label: 'Services' },
]

const categoryOptions = ref([
  { value: '', label: 'All Categories' }
])

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const items = ref([])
const loading = ref(true)
const error = ref('')

const fetchItems = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchQuery.value) params.q = searchQuery.value
    if (selectedType.value) params.type = selectedType.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (selectedSort.value && selectedSort.value !== 'newest') params.sort = selectedSort.value

    const { data, error: apiError } = await itemsApi.list(params)
    if (apiError) {
      error.value = apiError
    } else {
      items.value = data
    }
  } catch (err) {
    error.value = 'Failed to load items.'
  } finally {
    loading.value = false
  }
}

watch([searchQuery, selectedType, selectedCategory, selectedSort], () => {
  fetchItems()
})

onMounted(async () => {
  try {
    const { data } = await categoriesApi.fetch()
    if (data) {
      categoryOptions.value = [
        { value: '', label: 'All Categories' },
        ...data.map(c => ({ value: c.name, label: c.name }))
      ]
    }
  } catch (err) {
    console.error('Failed to load categories', err)
  }
  fetchItems()
})

const filteredItems = computed(() => {
  return items.value
})
</script>

<style scoped>
.item-carousel {
  overflow: hidden;
}
.item-carousel:hover .item-carousel-track {
  animation-play-state: paused !important;
}
@keyframes scroll-carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>