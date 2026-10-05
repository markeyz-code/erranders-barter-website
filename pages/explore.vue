<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
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
        <div class="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
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
        <NuxtLink v-for="item in filteredItems" :key="item._id" :to="'/item/' + item._id" class="group block bg-white border border-slate-200 rounded-[2rem] p-4 hover:border-brand-600 transition-colors">
          <div class="aspect-square bg-slate-100 rounded-3xl mb-4 overflow-hidden relative">
            <img :src="item.images?.[0] || 'https://via.placeholder.com/600'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border border-slate-200">
              {{ item.type }}
            </div>
          </div>
          <div class="px-2 pb-2">
            <div class="flex justify-between items-start mb-1 gap-2">
              <h3 class="font-bold text-lg truncate text-slate-900">{{ item.title }}</h3>
              <span class="font-black text-brand-600 text-lg flex-shrink-0">₦{{ item.price }}</span>
            </div>
            <p class="text-sm text-slate-500 flex items-center gap-1"><MapPin class="w-3.5 h-3.5" /> {{ item.location }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
<script setup>
import { MapPin, Search } from 'lucide-vue-next'
import CustomSelect from '~/components/CustomSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import { itemsApi } from '~/composables/useApi'

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

const selectedCategory = ref('')
const selectedSort = ref('newest')

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'services', label: 'Services' },
]

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

watch([searchQuery, selectedCategory, selectedSort], () => {
  fetchItems()
})

onMounted(() => {
  fetchItems()
})

const filteredItems = computed(() => {
  return items.value
})
</script>