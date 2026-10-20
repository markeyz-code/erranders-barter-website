<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Back Link -->
      <NuxtLink to="/services" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6">
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Campus Services</span>
      </NuxtLink>

      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-12 shadow-2xl mb-12 border border-emerald-800/40">
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl">🧪</div>

        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs mb-4 border border-emerald-400/30">
            <span>🛡️ 100% Bedbug & Pest Eradication Guarantee</span>
            <span class="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">Escrow Protected</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Hostel Room Fumigation <br/>
            <span class="text-emerald-400">& Deep Cleaning</span>
          </h1>

          <p class="text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-8">
            Never move your mattress into bedbug-infested hostel rooms. We pair <strong>hospital-grade, odorless chemicals</strong> from certified pest partners with trained <strong>campus student hands</strong>. Safe, fast, and held in Escrow.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <button 
              @click="openBookingModal"
              class="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 active:scale-95"
            >
              <Sparkles class="w-4 h-4" />
              <span>Book Room Fumigation</span>
            </button>

            <button 
              @click="openGigModal"
              class="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20 flex items-center gap-2 backdrop-blur-md active:scale-95"
            >
              <Briefcase class="w-4 h-4 text-emerald-400" />
              <span>Join as Student Fumigation Crew</span>
            </button>

            <NuxtLink 
              to="/business"
              class="px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs transition-all border border-emerald-500/40 flex items-center gap-2 backdrop-blur-md active:scale-95"
            >
              <LayoutDashboard class="w-4 h-4 text-emerald-400" />
              <span>Business Mini-Admin ⚙️</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- How The Agency & Student Hands Model Works -->
      <div class="mb-14">
        <div class="text-center max-w-xl mx-auto mb-10">
          <span class="text-xs font-black text-emerald-600 uppercase tracking-wider block mb-1">How It Works</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Hospital-Grade Safety. Campus Speed.</h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">Our managed partnership ensures both spotless rooms and lucrative student earnings.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 font-black text-lg">
              1
            </div>
            <h3 class="font-black text-slate-900 text-base mb-1.5">Certified Formulations</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Our partner chemical agency supplies certified, human-safe, low-odor pest control concentrates and automated sprayers to campus hubs.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 font-black text-lg">
              2
            </div>
            <h3 class="font-black text-slate-900 text-base mb-1.5">Trained Student Crew</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Verified campus students pick up gear and thoroughly treat mattress frames, wall crevices, vents, and wardrobes in 45 minutes.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 font-black text-lg">
              3
            </div>
            <h3 class="font-black text-slate-900 text-base mb-1.5">24h Escrow Protection</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Your payment is locked in Decluttered Escrow. Funds are released only after you inspect the room and confirm complete pest eradication.
            </p>
          </div>
        </div>
      </div>

      <!-- Transparent Room Packages -->
      <div class="mb-14">
        <div class="text-center max-w-xl mx-auto mb-10">
          <span class="text-xs font-black text-emerald-600 uppercase tracking-wider block mb-1">Standardized Pricing</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Hostel Room Packages</h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">No hidden fees. Free chemical equipment & certified applicator crew included.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Package 1: Single Room -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Single Room</span>
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">Standard</span>
              </div>
              <h3 class="text-xl font-black text-slate-900 mb-2">Hostel Single Fumigation</h3>
              <p class="text-xs text-slate-500 font-medium leading-relaxed mb-6">Ideal for 1-person private or studio hostel rooms.</p>
              
              <div class="mb-6 pb-6 border-b border-slate-100">
                <span class="text-3xl font-black text-slate-900">₦14,000</span>
                <span class="text-xs text-slate-500 font-medium ml-1">/ room</span>
              </div>

              <ul class="space-y-3 text-xs font-medium text-slate-700 mb-8">
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Full bedbug & cockroach spray</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Mattress frame & headboard fogging</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Wardrobe & baseboard treatment</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> 24-hour pest-free warranty</li>
              </ul>
            </div>

            <button
              @click="selectPackage({ name: 'Hostel Single Fumigation', price: 14000 })"
              class="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
            >
              Book Single Room
            </button>
          </div>

          <!-- Package 2: Double Room (Popular) -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 flex flex-col justify-between relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
              Most Popular On Campus ⚡
            </span>

            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-emerald-600 uppercase tracking-wider">Shared Room</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">2 - 4 Bedders</span>
              </div>
              <h3 class="text-xl font-black text-slate-900 mb-2">Double / Shared Room Knockout</h3>
              <p class="text-xs text-slate-500 font-medium leading-relaxed mb-6">Designed for standard shared halls (Moremi, Zik, Jaja, etc.).</p>
              
              <div class="mb-6 pb-6 border-b border-slate-100">
                <span class="text-3xl font-black text-slate-900">₦20,000</span>
                <span class="text-xs text-slate-500 font-medium ml-1">/ room</span>
              </div>

              <ul class="space-y-3 text-xs font-medium text-slate-700 mb-8">
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Up to 4 bunk beds & double mattresses</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Ceiling, vent & window frame spraying</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Balcony & doorway barrier shield</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> 2-person trained student applicator crew</li>
              </ul>
            </div>

            <button
              @click="selectPackage({ name: 'Double / Shared Room Knockout', price: 20000 })"
              class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-sm"
            >
              Book Shared Room (₦20,000)
            </button>
          </div>

          <!-- Package 3: Move-In Deep Clean Combo -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-500 uppercase tracking-wider">Complete Turnkey</span>
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">Clean + Spray</span>
              </div>
              <h3 class="text-xl font-black text-slate-900 mb-2">Move-In Fumigation + Deep Clean</h3>
              <p class="text-xs text-slate-500 font-medium leading-relaxed mb-6">Full chemical fumigation plus floor scrubbing and stain removal.</p>
              
              <div class="mb-6 pb-6 border-b border-slate-100">
                <span class="text-3xl font-black text-slate-900">₦28,000</span>
                <span class="text-xs text-slate-500 font-medium ml-1">/ room combo</span>
              </div>

              <ul class="space-y-3 text-xs font-medium text-slate-700 mb-8">
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Intensive pest fumigation & fogging</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Floor scrubbing & stain degreasing</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Mirror, fan & window wiping</li>
                <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" /> Fragrance sanitization after spray</li>
              </ul>
            </div>

            <button
              @click="selectPackage({ name: 'Move-In Fumigation + Deep Clean', price: 28000 })"
              class="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
            >
              Book Full Combo (₦28,000)
            </button>
          </div>

        </div>
      </div>

      <!-- Student Gig Hands Recruitment Card -->
      <div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div class="max-w-2xl">
          <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider mb-3 inline-block">
            Student Gig Crew Opportunity
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Earn ₦8,000 - ₦25,000 Weekly On Campus
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
            Are you a student looking for flexible daily earnings? Sign up as part of the <strong>Decluttered Campus Fumigation & Cleaning Crew</strong>. We provide chemical safety training, protective gear, and send scheduled room bookings directly to your phone. Get paid into your wallet as soon as the student approves!
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="openGigModal"
              class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors shadow-sm"
            >
              Apply as Fumigation Crew Member 💼
            </button>
            <span class="text-xs font-bold text-slate-400">No prior experience needed • Safety gear provided</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Booking Modal -->
    <div v-if="isBookingModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button @click="isBookingModalOpen = false" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full">
          <X class="w-5 h-5" />
        </button>

        <h3 class="text-xl font-black text-slate-900 mb-1">Book Room Fumigation</h3>
        <p class="text-xs text-slate-500 font-medium mb-6">Choose your hostel details and schedule slot.</p>

        <form @submit.prevent="submitBooking" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Selected Package</label>
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-900 flex justify-between">
              <span>{{ selectedPkg.name }}</span>
              <span>₦{{ selectedPkg.price.toLocaleString() }}</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Hostel / Hall Name & Room Number *</label>
            <input 
              v-model="bookingForm.hostelRoom" 
              required 
              type="text" 
              placeholder="e.g. Moremi Hall, Block B Room 304" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Preferred Date *</label>
            <input 
              v-model="bookingForm.date" 
              required 
              type="date" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
            <select 
              v-model="bookingForm.timeSlot" 
              required 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
            >
              <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
              <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
              <option value="Evening (4:30 PM - 7:00 PM)">Evening (4:30 PM - 7:00 PM)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
            <input 
              v-model="bookingForm.whatsappNumber" 
              required 
              type="tel" 
              placeholder="e.g. 08012345678" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
            />
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
            🔒 <strong>Protected by Decluttered Escrow</strong>: Payment is held securely until room spraying is completed and verified.
          </div>

          <button
            type="submit"
            :disabled="bookingSubmitting"
            class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Loader2 v-if="bookingSubmitting" class="w-4 h-4 animate-spin" />
            <span v-else>Confirm & Pay ₦{{ selectedPkg.price.toLocaleString() }} via Escrow</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Student Gig Crew Application Modal -->
    <div v-if="isGigModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button @click="isGigModalOpen = false" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full">
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">💼</span>
          <h3 class="text-xl font-black text-slate-900">Join Fumigation Crew</h3>
        </div>
        <p class="text-xs text-slate-500 font-medium mb-6">Earn flexible income fumigating hostel rooms during movement season.</p>

        <form @submit.prevent="submitGigApplication" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input 
              v-model="gigForm.name" 
              required 
              type="text" 
              placeholder="e.g. Samuel Adekunle" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">University / Campus *</label>
              <input 
                v-model="gigForm.university" 
                required 
                type="text" 
                placeholder="e.g. UNILAG" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Hostel / Current Hall *</label>
              <input 
                v-model="gigForm.hostel" 
                required 
                type="text" 
                placeholder="e.g. Jaja Hall" 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
            <input 
              v-model="gigForm.whatsapp" 
              required 
              type="tel" 
              placeholder="e.g. 08012345678" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Available Days *</label>
            <select 
              v-model="gigForm.availability" 
              required 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900"
            >
              <option value="Weekdays & Weekends (Full Flexible)">Weekdays & Weekends (Full Flexible)</option>
              <option value="Weekends Only">Weekends Only</option>
              <option value="Mornings (Before Lectures)">Mornings (Before Lectures)</option>
              <option value="Afternoons (After Lectures)">Afternoons (After Lectures)</option>
            </select>
          </div>

          <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium leading-relaxed">
            ✨ Free 15-minute chemical safety training & equipment orientation provided on campus before your first booking.
          </div>

          <button
            type="submit"
            :disabled="gigSubmitting"
            class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Loader2 v-if="gigSubmitting" class="w-4 h-4 animate-spin" />
            <span v-else>Submit Application 🚀</span>
          </button>
        </form>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Sparkles, Briefcase, CheckCircle2, X, Loader2, LayoutDashboard } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'

useSeoMeta({
  title: 'Hostel Room Fumigation & Cleaning | Decluttered by Erranders',
  description: 'Book certified bedbug and pest fumigation for campus hostel rooms. Protected by Decluttered Escrow.',
  ogTitle: 'Hostel Room Fumigation & Cleaning | Decluttered by Erranders',
})

const isBookingModalOpen = ref(false)
const isGigModalOpen = ref(false)
const bookingSubmitting = ref(false)
const gigSubmitting = ref(false)

const selectedPkg = ref({
  name: 'Double / Shared Room Knockout',
  price: 20000,
})

const bookingForm = ref({
  hostelRoom: '',
  date: new Date().toISOString().split('T')[0],
  timeSlot: 'Morning (9:00 AM - 12:00 PM)',
  whatsappNumber: '',
})

const gigForm = ref({
  name: '',
  university: '',
  hostel: '',
  whatsapp: '',
  availability: 'Weekdays & Weekends (Full Flexible)',
})

const openBookingModal = () => {
  isBookingModalOpen.value = true
}

const selectPackage = (pkg) => {
  selectedPkg.value = pkg
  isBookingModalOpen.value = true
}

const openGigModal = () => {
  isGigModalOpen.value = true
}

const submitBooking = () => {
  bookingSubmitting.value = true
  setTimeout(() => {
    bookingSubmitting.value = false
    isBookingModalOpen.value = false
    useCustomToast().showToast({
      title: 'Fumigation Booking Reserved! 🧪',
      message: `Your booking for ${selectedPkg.value.name} at ${bookingForm.value.hostelRoom} is secured in Escrow. An applicator crew has been scheduled!`,
      toastType: 'success',
    })
  }, 1200)
}

const submitGigApplication = () => {
  gigSubmitting.value = true
  setTimeout(() => {
    gigSubmitting.value = false
    isGigModalOpen.value = false
    useCustomToast().showToast({
      title: 'Application Received! 🤝',
      message: `Welcome aboard, ${gigForm.value.name}! We will contact you via WhatsApp for equipment orientation and first gig matches.`,
      toastType: 'success',
    })
  }, 1200)
}
</script>
