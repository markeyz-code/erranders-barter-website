<template>
  <div class="h-screen w-full overflow-hidden flex bg-white">
    <!-- Form Side (Self-contained scroll, page never scrolls) -->
    <div class="w-full lg:w-1/2 h-full overflow-y-auto flex justify-center p-4 sm:p-8 lg:p-10 bg-white">
      <div class="w-full max-w-lg my-auto py-6">
        <NuxtLink to="/" class="flex justify-center items-center gap-2 mb-6">
          <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-9 w-9 rounded-xl object-contain shadow-xs" />
          <span class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Decluttered<span class="text-[#FF5C1A]">.</span></span>
        </NuxtLink>

        <h1 class="text-2xl sm:text-3xl text-center font-black text-slate-900 mb-1.5">Create Account</h1>
        <p class="text-xs sm:text-sm text-slate-500 text-center font-medium mb-6">Join the Decluttered student network to start trading & decluttering.</p>

        <button @click="googleLogin" class="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors mb-5 shadow-2xs text-xs sm:text-sm">
          <img src="https://www.google.com/favicon.ico" class="w-4 h-4" />
          Sign up with Google
        </button>

        <div class="relative flex items-center justify-center mb-5">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
          <span class="relative bg-white px-3 text-xs font-black text-slate-300 uppercase tracking-wider">OR</span>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-3.5">
          <!-- Name Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomInput v-model="form.firstName" label="First Name" placeholder="John" :required="true" />
            <CustomInput v-model="form.lastName" label="Last Name" placeholder="Doe" :required="true" />
          </div>

          <!-- Academic & Contact Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="relative group">
              <label class="block text-xs font-black text-slate-400 mb-1.5 group-focus-within:text-brand-600 transition-colors">WhatsApp Number</label>
              <input v-model="form.whatsappNumber" type="tel" placeholder="e.g. 08012345678" pattern="^0[789][01]\d{8}$" title="Valid 11-digit Nigerian WhatsApp number starting with 0" required class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600" />
            </div>

            <CustomFormSelect
              v-model="form.level"
              label="Level"
              :options="levelOptions"
              placeholder="Select level..."
            />
          </div>

          <!-- Campus Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomFormSelect
              v-model="form.university"
              label="University"
              :options="uniOptions"
              placeholder="Select university..."
            />
            
            <div class="relative group">
              <label class="block text-xs font-black text-slate-400 mb-1.5 group-focus-within:text-brand-600 transition-colors">Hostel/Residence</label>
              <input v-model="form.hostel" type="text" placeholder="e.g. Moremi Hall" required class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600" />
            </div>
          </div>

          <!-- Account Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomInput v-model="form.email" label="Email Address" type="email" placeholder="you@example.com" icon="Mail" :required="true" />
            <CustomInput v-model="form.password" label="Create Password" type="password" placeholder="••••••••" icon="Lock" :required="true" />
          </div>
          
          <button type="submit" :disabled="loading || !form.firstName || !form.lastName || !form.whatsappNumber || !form.level || !form.university || !form.hostel || !form.email || !form.password" class="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 text-sm">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <p v-if="error" class="mt-3 text-red-500 font-bold text-xs text-center">{{ error }}</p>

        <p class="text-center mt-5 text-slate-500 font-medium text-xs">
          Already have an account? <NuxtLink to="/login" class="text-brand-600 font-bold hover:underline">Log in</NuxtLink>
        </p>
      </div>
    </div>

    <!-- Image Side (Fixed to full viewport, does not move or shift) -->
    <div class="hidden lg:block lg:w-1/2 h-full relative bg-brand-900 shrink-0 overflow-hidden">
      <img src="~/assets/img/campus.jpg" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent"></div>
      <div class="absolute bottom-16 left-12 right-12">
        <h2 class="text-4xl xl:text-5xl font-black text-white mb-3 leading-tight">Join the<br/>Movement.</h2>
        <p class="text-base text-brand-100 font-medium">Over 5,000 Nigerian students have successfully traded on our network.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '~/components/CustomInput.vue'
import CustomFormSelect from '~/components/CustomFormSelect.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useToast } from '~/composables/useToast'

definePageMeta({ layout: false })

const router = useRouter()
const { saveSession, firebaseLogin } = useAuth()
const { showToast } = useToast()
const loading = ref(false)
const error = ref('')

const form = ref({ 
  firstName: '', 
  lastName: '', 
  email: '', 
  password: '', 
  whatsappNumber: '', 
  university: '', 
  hostel: '', 
  level: '' 
})

const levelOptions = [
  { value: '100L', label: '100 Level' },
  { value: '200L', label: '200 Level' },
  { value: '300L', label: '300 Level' },
  { value: '400L', label: '400 Level' },
  { value: '500L', label: '500 Level' },
  { value: '600L', label: '600 Level' },
  { value: 'Postgraduate', label: 'Postgrad' },
]

const uniOptions = [
  { value: 'UNILAG', label: 'UNILAG' },
  { value: 'CMUL', label: 'CMUL' },
  { value: 'LASU', label: 'LASU' },
  { value: 'YABATECH', label: 'YABATECH' },
  { value: 'UI', label: 'UI' },
  { value: 'OAU', label: 'OAU' },
  { value: 'Other', label: 'Other' },
]

const config = useRuntimeConfig()
const googleLogin = async () => {
  try {
    loading.value = true
    await firebaseLogin(true)
    showToast('Account Created!', 'Successfully signed up with Google!', 'success')
    router.push('/explore')
  } catch (err) {
    error.value = err.message
    showToast('Signup Failed', err.message, 'error')
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${config.public.apiBaseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Signup failed')
    
    // Save token and user
    saveSession(data)
    
    // Success, route to explore
    showToast('Account Created!', `Welcome to Decluttered, ${data.user?.firstName || 'User'}!`, 'success')
    router.push('/explore')
  } catch (err) {
    error.value = err.message
    showToast('Signup Failed', err.message, 'error')
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Sign Up | Decluttered by Erranders',
  description: 'Create an account on Decluttered by Erranders. Buy, sell, and clear hostel gear with campus escrow.',
  ogTitle: 'Sign Up | Decluttered by Erranders'
})
</script>