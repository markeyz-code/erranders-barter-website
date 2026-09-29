<template>
  <main class="min-h-screen bg-white pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <NuxtLink to="/" class="text-brand-600 font-bold mb-4 inline-block">← Back Home</NuxtLink>
        <h1 class="text-4xl font-extrabold text-slate-900 capitalize">{{ categoryId }} Category</h1>
        <p class="text-slate-500 font-medium mt-2">Browse all available items in {{ categoryId }}.</p>
      </div>
      
      <div class="p-12 border-2 border-slate-200 border-dashed rounded-3xl text-center">
        <h2 class="text-2xl font-bold text-slate-400 mb-2">No items found</h2>
        <p class="text-slate-500">Be the first to list an item in this category!</p>
        <NuxtLink to="/list" class="inline-block mt-4 bg-brand-600 text-white font-bold px-6 py-3 rounded-lg">List an Item</NuxtLink>
      </div>
    </div>
  </main>
</template>
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const categoryId = route.params.id
</script>