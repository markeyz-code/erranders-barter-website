<template>
  <div class="min-h-screen flex">
    <!-- Form Side -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-md">
        <NuxtLink to="/" class="flex items-center gap-2 mb-12">
          <div class="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
            <ArrowRightLeft class="w-6 h-6" />
          </div>
          <span class="text-2xl font-black tracking-tight text-slate-900">Barter.</span>
        </NuxtLink>

        <h1 class="text-4xl font-black text-slate-900 mb-2">Welcome Back</h1>
        <p class="text-slate-500 font-medium mb-8">Log in to your Erranders account to continue.</p>

        <button @click="googleLogin" class="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors mb-6 shadow-sm">
          <img src="https://www.google.com/favicon.ico" class="w-5 h-5" />
          Continue with Google
        </button>

        <div class="relative flex items-center justify-center mb-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
          <span class="relative bg-white px-4 text-xs font-black text-slate-300 uppercase tracking-widest">OR</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <CustomInput v-model="form.email" label="Email Address" type="email" placeholder="you@student.edu.ng" icon="Mail" />
          <CustomInput v-model="form.password" label="Secure Password" type="password" placeholder="••••••••" icon="Lock" />
          
          <button type="submit" :disabled="loading" class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors mt-4 disabled:opacity-50">
            {{ loading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center">{{ error }}</p>

        <p class="text-center mt-8 text-slate-500 font-medium text-sm">
          Don't have an account? <NuxtLink to="/signup" class="text-brand-600 font-bold hover:underline">Sign up</NuxtLink>
        </p>
      </div>
    </div>

    <!-- Image Side -->
    <div class="hidden lg:block lg:w-1/2 relative bg-slate-900">
      <img src="https://images.unsplash.com/photo-1571260899304-425dea57a228?w=1200" class="absolute inset-0 w-full h-full object-cover opacity-80" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
      <div class="absolute bottom-16 left-16 right-16">
        <h2 class="text-5xl font-black text-white mb-4 leading-tight">Trade smart.<br/>Move fast.</h2>
        <p class="text-lg text-slate-300 font-medium">The Erranders Barter network connects thousands of students daily.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightLeft } from 'lucide-vue-next'
import CustomInput from '~/components/CustomInput.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: false })

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = ref({ email: '', password: '' })

const googleLogin = () => {
  window.location.href = 'http://localhost:3005/api/v1/auth/google'
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:3005/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    
    // Save token
    if (data.access_token) {
      localStorage.setItem('barter_token', data.access_token)
    }
    
    // Success, route to explore
    router.push('/explore')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>