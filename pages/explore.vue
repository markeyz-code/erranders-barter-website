<template>
  <main class="min-h-screen bg-white pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-4xl font-black text-slate-900 mb-2">
            {{ searchQuery ? 'Search Results' : 'Explore' }}
          </h1>
          <p class="text-slate-500 font-medium">
            {{ searchQuery ? 'Found items matching "' + searchQuery + '"' : 'Discover everything available on the Erranders network.' }}
          </p>
        </div>
        <div class="flex gap-2">
          <select class="border border-slate-200 rounded-full px-4 py-2 bg-white font-bold text-sm outline-none focus:border-brand-600">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Books</option>
          </select>
          <select class="border border-slate-200 rounded-full px-4 py-2 bg-white font-bold text-sm outline-none focus:border-brand-600">
            <option>Newest First</option>
            <option>Price: Low to High</option>
          </select>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="py-20 text-center border border-slate-200 border-dashed rounded-3xl">
        <h2 class="text-2xl font-bold text-slate-400 mb-2">No items found for "{{ searchQuery }}"</h2>
        <NuxtLink to="/explore" class="text-brand-600 font-bold hover:underline">Clear Search</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
import { MapPin } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

const route = useRoute()
const searchQuery = computed(() => route.query.q || '')

const items = ref([])
const loading = ref(true)
const error = ref('')

const fetchItems = async () => {
  loading.value = true
  try {
    const data = await $fetch(`http://localhost:3005/api/v1/items${searchQuery.value ? '?q=' + searchQuery.value : ''}`)
    items.value = data
  } catch (err) {
    error.value = 'Failed to load items.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchItems()
})

const filteredItems = computed(() => items.value)
</script>