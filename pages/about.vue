<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-4 sm:px-8">
      <NuxtLink to="/" class="text-brand-600 font-bold mb-4 inline-block">← Back Home</NuxtLink>
      <h1 class="text-4xl font-extrabold text-slate-900 mb-4">About Us</h1>
      <p class="text-lg text-slate-600 mb-8 border-l-4 border-brand-600 pl-4">Decluttered by Erranders is built for students by students.</p>
      
      <div class="prose prose-slate max-w-none">
        <p>Decluttered empowers students across Nigerian tertiary campuses to clear their hostel rooms with zero stress, buy quality student goods with escrow safety, and trade effortlessly.</p>
      </div>
    </div>
  </main>
</template>
<script setup>
useSeoMeta({
  title: 'About Us | Decluttered by Erranders',
  description: 'The student-first campus marketplace for room decluttering and peer-to-peer commerce.'
})
</script>