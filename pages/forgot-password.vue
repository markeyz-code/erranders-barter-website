<template>
  <div class="min-h-screen flex">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-md">
        <h1 class="text-4xl font-black text-slate-900 mb-2">Forgot Password</h1>
        <p class="text-slate-500 font-medium mb-8">Enter your email and we'll send you a reset link.</p>

        <form @submit.prevent="handleForgot" class="space-y-5">
          <CustomInput v-model="email" label="Email Address" type="email" placeholder="you@example.com" icon="Mail" />
          
          <button type="submit" :disabled="loading" class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors mt-4 disabled:opacity-50">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <p v-if="success" class="mt-4 text-green-600 font-bold text-sm text-center">Reset link sent successfully!</p>
        <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center">{{ error }}</p>

        <p class="text-center mt-8 text-slate-500 font-medium text-sm">
          Remembered? <NuxtLink to="/login" class="text-brand-600 font-bold hover:underline">Log in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '~/components/CustomInput.vue'
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleForgot = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const res = await fetch('http://localhost:3005/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed')
    
    success.value = true
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
