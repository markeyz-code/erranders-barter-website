<template>
  <div class="min-h-screen flex">
    <!-- Image Side (Left) -->
    <div class="hidden lg:block lg:w-1/2 relative bg-slate-950 overflow-hidden">
      <img src="/img/student_business_auth.jpg" alt="Nigerian campus students" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40"></div>
      <div class="absolute bottom-16 left-16 right-16">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold mb-3">
          Campus Network
        </span>
        <h2 class="text-4xl font-black text-white mb-3 leading-tight">Trade smart.<br/>Move fast.</h2>
        <p class="text-base text-slate-300 font-medium">Decluttered by Erranders connects thousands of verified Nigerian students daily for decluttering, campus services and student businesses.</p>
      </div>
    </div>

    <!-- Form Side (Right) -->
    <div class="w-full lg:w-1/2 flex justify-center p-4 sm:p-8 lg:p-12 bg-white min-h-screen">
      <div class="w-full max-w-md py-8 my-auto">
        <NuxtLink to="/" class="flex justify-center items-center gap-2 mb-6">
          <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-10 w-10 rounded-xl object-contain shadow-xs" />
          <span class="text-3xl font-black tracking-tight text-slate-900">Decluttered<span class="text-[#FF5C1A]">.</span></span>
        </NuxtLink>

        <h1 class="text-3xl text-center font-black text-slate-900 mb-2">Welcome Back</h1>
        <p class="text-slate-500 text-center font-medium mb-8">Log in to your Erranders account to continue.</p>

        <button @click="googleLogin" class="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors mb-6 shadow-xs cursor-pointer">
          <img src="https://www.google.com/favicon.ico" class="w-5 h-5" />
          Continue with Google
        </button>

        <div class="relative flex items-center justify-center mb-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
          <span class="relative bg-white px-4 text-xs font-black text-slate-400 uppercase tracking-wider">OR</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <CustomInput v-model="form.email" label="Email Address" type="email" placeholder="you@student.edu.ng" icon="Mail" />
          <CustomInput v-model="form.password" label="Secure Password" type="password" placeholder="••••••••" icon="Lock" />
          <div class="flex justify-end">
            <NuxtLink to="/forgot-password" class="text-xs font-bold text-brand-600 hover:underline">Forgot Password?</NuxtLink>
          </div>
          
          <button type="submit" :disabled="loading || !form.email || !form.password" class="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 cursor-pointer">
            {{ loading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center">{{ error }}</p>

        <p class="text-center mt-8 text-slate-500 font-medium text-xs">
          Don't have an account? <NuxtLink to="/signup" class="text-brand-600 font-bold hover:underline">Sign up</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightLeft } from 'lucide-vue-next'
import CustomInput from '~/components/CustomInput.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Log In | Decluttered by Erranders',
  description: 'Log in to your Decluttered campus account to manage listings, declutter batches, and escrow orders.',
  ogTitle: 'Log In | Decluttered by Erranders'
})

const router = useRouter()
const { saveSession, firebaseLogin } = useAuth()
const { showToast } = useToast()
const loading = ref(false)
const error = ref('')
const form = ref({ email: '', password: '' })

const config = useRuntimeConfig()
const googleLogin = async () => {
  try {
    loading.value = true
    await firebaseLogin(false)
    showToast('Success!', 'Successfully authenticated with Google!', 'success')
    router.push('/explore')
  } catch (err) {
    error.value = err.message
    showToast('Login Failed', err.message, 'error')
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${config.public.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    
    // Save token and user
    saveSession(data)
    
    // Success, route to explore
    showToast('Success!', `Welcome back, ${data.user?.firstName || 'User'}!`, 'success')
    router.push('/explore')
  } catch (err) {
    error.value = err.message
    showToast('Login Failed', err.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>