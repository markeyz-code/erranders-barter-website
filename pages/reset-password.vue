<template>
  <div class="min-h-screen flex">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white">
      <div class="w-full max-w-md">
        <h1 class="text-4xl font-black text-slate-900 mb-2">Reset Password</h1>
        <p class="text-slate-500 font-medium mb-8">Enter your new secure password.</p>

        <form @submit.prevent="handleReset" class="space-y-5">
          <CustomInput v-model="password" label="New Password" type="password" placeholder="••••••••" icon="Lock" />
          
          <button type="submit" :disabled="loading" class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors mt-4 disabled:opacity-50">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <p v-if="success" class="mt-4 text-green-600 font-bold text-sm text-center">Password reset successfully! <NuxtLink to="/login" class="underline">Log in</NuxtLink></p>
        <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '~/components/CustomInput.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleReset = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const res = await fetch('http://localhost:3005/api/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: route.query.token || 'dummy', password: password.value })
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
