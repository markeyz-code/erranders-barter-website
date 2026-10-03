<template>
  <main class="min-h-screen bg-slate-50 py-20 px-4">
    <div class="max-w-md mx-auto bg-white p-4 sm:p-6 rounded-3xl shadow-xl">
      <div class="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
        <NuxtLink to="/" class="text-gray-600 font-bold">← Back</NuxtLink>
        <h1 class="text-2xl font-black">Listings</h1>
      </div>
      
      <div class="text-center py-10">
        <h2 class="font-bold text-slate-800 mb-2">Category Listings</h2>
        <p class="text-sm text-slate-500 mb-6">Browse all available items in this category.</p>
        
        <NuxtLink to="/explore" class="inline-block bg-brand-600 text-white font-bold py-3 px-4 sm:px-6 rounded-xl hover:bg-brand-700 transition-colors shadow-lg">
          Browse All Items
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
<script setup>
</script>
