<template>
  <main class="min-h-screen bg-white pt-24 pb-16">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-black text-slate-900 mb-2">Contact Support</h1>
      <p class="text-slate-500 mb-8">We usually respond within 24 hours.</p>
      
      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
          <input required type="text" class="w-full border rounded-xl p-3 bg-slate-50" />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
          <input required type="email" class="w-full border rounded-xl p-3 bg-slate-50" />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">Message</label>
          <textarea required rows="5" class="w-full border rounded-xl p-3 bg-slate-50"></textarea>
        </div>
        <button type="submit" class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors">
          Send Message
        </button>
      </form>
    </div>
  </main>
</template>
<script setup>
const submit = () => {
  alert('Support message sent successfully! We will get back to you soon.')
}
useSeoMeta({
  title: 'Contact Support | Erranders Barter',
})
</script>