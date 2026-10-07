<template>
  <div class="p-4 md:p-4 sm:p-8">
    <div class="max-w-3xl mx-auto">
      
      <div class="mb-10">
        <h1 class="text-3xl font-black text-slate-900 mb-2">Account Settings</h1>
        <p class="text-slate-500 font-medium">Manage your profile details and preferences.</p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-8">
        <form @submit.prevent="updateProfile" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-black text-slate-400 mb-2">First Name</label>
              <input v-model="form.firstName" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-black text-slate-400 mb-2">Last Name</label>
              <input v-model="form.lastName" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-black text-slate-400 mb-2">Email Address</label>
            <input :value="user?.email" disabled class="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-500 cursor-not-allowed" />
            <p class="text-sm text-slate-400 mt-2 font-medium">Email address cannot be changed.</p>
          </div>

          <div>
            <label class="block text-sm font-black text-slate-400 mb-2">WhatsApp Number</label>
            <input v-model="form.whatsappNumber" type="tel" pattern="^0[789][01]\d{8}$" title="Valid 11-digit Nigerian WhatsApp number" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors" />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-black text-slate-400 mb-2">University</label>
              <select v-model="form.university" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors appearance-none">
                <option value="UNILAG">UNILAG</option>
                <option value="CMUL">CMUL</option>
                <option value="LASU">LASU</option>
                <option value="YABATECH">YABATECH</option>
                <option value="UI">UI</option>
                <option value="OAU">OAU</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-black text-slate-400 mb-2">Hostel / Residence</label>
              <input v-model="form.hostel" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors" />
            </div>
          </div>

          <div v-if="successMsg" class="p-4 bg-green-50 text-green-600 rounded-xl font-bold text-sm">
            {{ successMsg }}
          </div>
          <div v-if="errorMsg" class="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm">
            {{ errorMsg }}
          </div>

          <div class="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" :disabled="loading" class="px-4 sm:px-8 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-brand-600 transition-colors shadow-lg disabled:opacity-50">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard' })

const { user, token, saveSession } = useAuth()
const { showToast } = useToast()

const loading = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  whatsappNumber: '',
  university: '',
  hostel: ''
})

onMounted(async () => {
  if (user.value) {
    form.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      whatsappNumber: user.value.whatsappNumber || '',
      university: user.value.university || 'UNILAG',
      hostel: user.value.hostel || ''
    }
  }

  try {
    const res = await fetch(`${useRuntimeConfig().public.apiBaseUrl}/users/me`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const data = await res.json()
    if (res.ok && data) {
      form.value = {
        firstName: data.firstName || form.value.firstName,
        lastName: data.lastName || form.value.lastName,
        whatsappNumber: data.whatsappNumber || form.value.whatsappNumber,
        university: data.university || form.value.university,
        hostel: data.hostel || form.value.hostel
      }
    }
  } catch (err) {
    console.error('Failed to fetch user settings:', err)
  }
})

const updateProfile = async () => {
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  
  try {
    const res = await fetch(`${useRuntimeConfig().public.apiBaseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(form.value)
    })
    
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to update profile')
    
    // Update local user state
    saveSession({ access_token: token.value, user: data })
    showToast('Profile Updated', 'Your profile details have been saved successfully.', 'success')
  } catch (err) {
    showToast('Update Failed', err.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>
