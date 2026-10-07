<template>
  <div class="min-h-screen flex">
    <!-- Form Side -->
    <div class="w-full lg:w-1/2 flex justify-center p-4 sm:p-8 lg:p-12 bg-white min-h-screen">
      <div class="w-full max-w-md py-8 my-auto">
            <NuxtLink to="/" class="flex justify-center items-center gap-2">
        <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-14 w-auto" />
      </NuxtLink>
        <!-- <NuxtLink to="/" class="flex items-center gap-2 mb-12">
          <div class="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
            <ArrowRightLeft class="w-6 h-6" />
          </div>
          <span class="text-2xl font-black tracking-tight text-slate-900">Barter.</span>
        </NuxtLink> -->

        <h1 class="text-4xl text-center font-black text-slate-900 mb-2">Welcome Back</h1>
        <p class="text-slate-500 text-center font-medium mb-8">Log in to your Erranders account to continue.</p>

        <button @click="googleLogin" class="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors mb-6">
          <img src="https://www.google.com/favicon.ico" class="w-5 h-5" />
          Continue with Google
        </button>

        <div class="relative flex items-center justify-center mb-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
          <span class="relative bg-white px-4 text-sm font-black text-slate-300 uppercase ">OR</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <CustomInput v-model="form.email" label="Email Address" type="email" placeholder="" icon="Mail" />
          <CustomInput v-model="form.password" label="Secure Password" type="password" placeholder="••••••••" icon="Lock" />
          <div class="flex justify-end">
            <NuxtLink to="/forgot-password" class="text-sm font-bold text-brand-600 hover:underline">Forgot Password?</NuxtLink>
          </div>
          
          <button type="submit" :disabled="loading || !form.email || !form.password" class="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
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
      <img src="~/assets/img/exchange.jpg" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
      <div class="absolute bottom-16 left-16 right-16">
        <h2 class="text-5xl font-black text-white mb-4 leading-tight">Trade smart.<br/>Move fast.</h2>
        <p class="text-lg text-slate-300 font-medium">The Erranders Barter network connects thousands of Nigerian students daily.</p>
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