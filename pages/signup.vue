<template>
  <div class="min-h-screen flex">
    <!-- Form Side -->
    <div class="w-full lg:w-1/2 flex justify-center p-4 sm:p-8 lg:p-12 bg-white min-h-screen">
      <div class="w-full max-w-md py-8 my-auto">
       <NuxtLink to="/" class="flex justify-center items-center gap-2 mb-8">
        <img src="@/assets/img/logo.png" alt="Erranders Barter" class="h-14 w-auto" />
      </NuxtLink>

        <h1 class="text-4xl text-center font-black text-slate-900 mb-2">Create Account</h1>
        <p class="text-slate-500 text-center font-medium mb-8">Join the Erranders network to start trading.</p>

        <button @click="googleLogin" class="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors mb-6 shadow-sm">
          <img src="https://www.google.com/favicon.ico" class="w-5 h-5" />
          Sign up with Google
        </button>

        <div class="relative flex items-center justify-center mb-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
          <span class="relative bg-white px-4 text-xs font-black text-slate-300 uppercase tracking-widest">OR</span>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-4">
          <CustomInput v-model="form.firstName" label="First Name" placeholder="John" :required="true" />
          <CustomInput v-model="form.lastName" label="Last Name" placeholder="Doe" :required="true" />

          <div class="relative group mb-4">
            <label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">WhatsApp Number</label>
            <input v-model="form.whatsappNumber" type="tel" placeholder="e.g. 08012345678" pattern="^0[789][01]\d{8}$" title="Valid 11-digit Nigerian WhatsApp number starting with 0" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600" />
          </div>

          <CustomFormSelect
            v-model="form.level"
            label="Level"
            :options="levelOptions"
            placeholder="Select level..."
          />

          <CustomFormSelect
            v-model="form.university"
            label="University"
            :options="uniOptions"
            placeholder="Select university..."
          />
          
          <div class="relative group mb-4">
            <label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">Hostel/Residence</label>
            <input v-model="form.hostel" type="text" placeholder="e.g. Moremi Hall" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600" />
          </div>

          <CustomInput v-model="form.email" label="Email Address" type="email" placeholder="you@example.com" icon="Mail" :required="true" />
          <CustomInput v-model="form.password" label="Create Password" type="password" placeholder="••••••••" icon="Lock" :required="true" />
          
          <button type="submit" :disabled="loading || !form.firstName || !form.lastName || !form.whatsappNumber || !form.level || !form.university || !form.hostel || !form.email || !form.password" class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-200">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <p v-if="error" class="mt-4 text-red-500 font-bold text-sm text-center">{{ error }}</p>

        <p class="text-center mt-8 text-slate-500 font-medium text-sm pb-8">
          Already have an account? <NuxtLink to="/login" class="text-brand-600 font-bold hover:underline">Log in</NuxtLink>
        </p>
      </div>
    </div>

    <!-- Image Side -->
    <div class="hidden lg:block lg:w-1/2 relative bg-brand-900">
      <img src="~/assets/img/campus.jpg" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent"></div>
      <div class="absolute bottom-16 left-16 right-16">
        <h2 class="text-5xl font-black text-white mb-4 leading-tight">Join the<br/>Movement.</h2>
        <p class="text-lg text-brand-100 font-medium">Over 5,000 Nigerian students have successfully traded on our network.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '~/components/CustomInput.vue'
import CustomFormSelect from '~/components/CustomFormSelect.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: false })

const router = useRouter()
const { saveSession } = useAuth()
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

const googleLogin = () => {
  window.location.href = 'http://localhost:3005/api/v1/auth/google'
}

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('http://localhost:3005/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Signup failed')
    
    // Save token and user
    saveSession(data)
    
    // Success, route to explore
    router.push('/explore')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>