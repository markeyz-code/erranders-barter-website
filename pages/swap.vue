<template>
  <main class="min-h-screen bg-slate-50 py-20 px-4">
    <div class="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-xl">
      <div class="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
        <NuxtLink to="/" class="text-gray-600 font-bold">← Back</NuxtLink>
        <h1 class="text-2xl font-black">Swap Items</h1>
      </div>
      <p class="text-slate-500 font-medium mb-6">Select an item you want to swap and an item you want in return.</p>
      
      <div class="bg-yellow-50 text-yellow-800 p-4 rounded-xl font-bold border border-yellow-200 mb-6 text-sm">
        Swap requests are currently being processed manually. Please check back later for automated swapping.
      </div>
      
      <NuxtLink to="/explore" class="block text-center w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
        Go to Explore
      </NuxtLink>
    </div>
  </main>
</template>
<script setup>
</script>
