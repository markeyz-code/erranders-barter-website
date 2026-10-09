<template>
  <div v-if="isOpen" class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl relative" @click.stop>
      <button @click="$emit('close')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-10">
        <X class="w-5 h-5" />
      </button>

      <div class="p-4 sm:p-8">
        <h2 class="text-3xl font-black text-slate-900 mb-2">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
        <p class="text-slate-500 font-medium mb-8">
          {{ isLogin ? 'Log in to securely checkout via Escrow.' : 'Join Barter to buy, sell and swap securely.' }}
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">First Name</label>
              <input v-model="form.firstName" type="text" :required="!isLogin" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
              <input v-model="form.lastName" type="text" :required="!isLogin" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors" />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">WhatsApp Number</label>
              <input v-model="form.whatsappNumber" type="tel" :required="!isLogin" placeholder="e.g. 08012345678" pattern="^0[789][01]\d{8}$" title="Please enter a valid 11-digit Nigerian WhatsApp number starting with 0" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors" />
            </div>

            <div>
              <CustomFormSelect
                v-model="form.level"
                label="Level"
                :options="levelOptions"
                placeholder="Select level..."
              />
            </div>

            <div>
              <CustomFormSelect
                v-model="form.university"
                label="University"
                :options="uniOptions"
                placeholder="Select university..."
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Hostel/Residence</label>
              <input v-model="form.hostel" type="text" :required="!isLogin" placeholder="e.g. Moremi Hall" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input v-model="form.email" type="email" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors pr-12" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <p v-if="error" class="text-red-500 text-sm font-bold text-center mt-2">{{ error }}</p>

          <button type="submit" :disabled="loading" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-3 rounded-xl mt-6 transition-colors shadow-lg shadow-brand-200 disabled:opacity-50">
            {{ loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up') }}
          </button>
        </form>

        <div class="mt-8">
          <div class="relative flex items-center justify-center">
            <div class="border-t border-slate-200 w-full absolute"></div>
            <span class="bg-white px-4 text-sm font-bold text-slate-400 uppercase  relative z-10">Or continue with</span>
          </div>
          
          <div class="flex gap-4 mt-6">
            <button @click="socialAuth('Google')" class="w-full border border-slate-200 py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 font-bold text-slate-700 transition-colors shadow-sm">
              <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
              Continue with Google
            </button>
          </div>
        </div>

        <p class="text-center mt-8 text-sm font-medium text-slate-600">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button @click="isLogin = !isLogin; error = ''" class="text-brand-600 font-bold hover:underline">
            {{ isLogin ? 'Sign up' : 'Log in' }}
          </button>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { X, Eye, EyeOff } from 'lucide-vue-next'
import CustomFormSelect from '~/components/CustomFormSelect.vue'
import { ref } from 'vue'
import { authApi } from '~/composables/useApi'

import { useToast } from '~/composables/useToast'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'success'])

const { showToast } = useToast()
const { saveSession, firebaseLogin } = useAuth()
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

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

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    let res
    if (isLogin.value) {
      res = await authApi.login({ email: form.value.email, password: form.value.password })
    } else {
      res = await authApi.signup({
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        password: form.value.password,
        whatsappNumber: form.value.whatsappNumber,
        university: form.value.university,
        hostel: form.value.hostel,
        level: form.value.level
      })
    }

    saveSession(res.data)
    showToast('Success!', `Welcome back, ${res.data.user?.firstName || 'User'}!`, 'success')
    emit('success')
  } catch (err) {
    const errMsg = err.response?.data?.message || 'Authentication failed.'
    error.value = errMsg
    showToast('Login Failed', errMsg, 'error')
  } finally {
    loading.value = false
  }
}

const config = useRuntimeConfig()
const socialAuth = async (provider) => {
  if (provider === 'Google') {
    try {
      loading.value = true
      await firebaseLogin(!isLogin.value)
      showToast('Success!', 'Successfully authenticated with Google!', 'success')
      emit('success')
      emit('close')
    } catch (err) {
      error.value = err.message
      showToast('Authentication Failed', err.message, 'error')
    } finally {
      loading.value = false
    }
  } else {
    useCustomToast().showToast({ title: 'Notice', message: `${provider} authentication is coming soon!`, toastType: "info" })
  }
}
</script>
