<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Back Link -->
      <NuxtLink to="/services" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6">
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Campus Services</span>
      </NuxtLink>

      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-12 shadow-2xl mb-12 border border-amber-800/40">
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl">🚚</div>

        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs mb-4 border border-amber-400/30">
            <span>📦 Dedicated Hostel Movement & Heavy Lifting</span>
            <span class="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">Stairs & Carts</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Campus Hostel Movers <br/>
            <span class="text-amber-400">& Heavy Lifters</span>
          </h1>

          <p class="text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-8">
            Moving to a new hostel or clearing your room? Don't break your back hauling foam mattresses, heavy fridges, and generator sets up 4 flights of stairs. Book verified student movers equipped with <strong>heavy-duty trolleys, moving straps, and 2-person lifting crews</strong>.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <button 
              @click="scrollToMovers"
              class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95"
            >
              <Truck class="w-4 h-4" />
              <span>Browse Available Movers</span>
            </button>

            <button 
              @click="openSignupModal"
              class="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20 flex items-center gap-2 backdrop-blur-md active:scale-95"
            >
              <Users class="w-4 h-4 text-amber-400" />
              <span>Sign Up as a Campus Mover</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Why Movers Are Different from Erranders -->
      <div class="mb-14">
        <div class="text-center max-w-xl mx-auto mb-10">
          <span class="text-xs font-black text-amber-600 uppercase tracking-wider block mb-1">Heavy Muscle vs Light Parcels</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Why Campus Movers?</h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">Erranders handle lightweight parcels. Movers are built for hostel relocation.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4 font-black text-xl">
              🛞
            </div>
            <h3 class="font-black text-slate-900 text-base mb-1.5">Trolleys & Stair Climbers</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Equipped with hand trucks, flatbed carts, and heavy-duty moving straps so your appliances and suitcases don't get damaged on stairs.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4 font-black text-xl">
              👥
            </div>
            <h3 class="font-black text-slate-900 text-base mb-1.5">2-Person Lifting Teams</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Book strong pairs of student lifters ready to carry bulky wardrobes, double bunk mattresses, and refrigerators directly into hostel rooms.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4 font-black text-xl">
              📅
            </div>
            <h3 class="font-black text-slate-900 text-base mb-1.5">Scheduled Slot Booking</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Reserve specific time slots (Morning, Midday, Afternoon) so movers arrive exactly when you are packed and ready to vacate or move in.
            </p>
          </div>
        </div>
      </div>

      <!-- Available Campus Movers Directory -->
      <div id="movers-directory" class="mb-14 scroll-mt-24">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span class="text-xs font-black text-amber-600 uppercase tracking-wider block mb-1">Verified Teams</span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Available Movers by Schedule</h2>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="filter in ['all', 'Moremi', 'Zik', 'New Hall']"
              :key="filter"
              @click="activeHallFilter = filter"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
              :class="activeHallFilter === filter ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'"
            >
              {{ filter === 'all' ? 'All Hostels' : filter }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="mover in filteredMovers" 
            :key="mover.id"
            class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-500 transition-all group"
          >
            <div>
              <div class="flex items-start gap-4 mb-4">
                <img :src="mover.avatar" :alt="mover.name" class="w-14 h-14 rounded-2xl object-cover border border-amber-200 shrink-0" />
                <div>
                  <h3 class="font-black text-slate-900 text-base leading-tight group-hover:text-amber-600 transition-colors">
                    {{ mover.name }}
                  </h3>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="text-amber-500 text-xs">★</span>
                    <span class="text-xs font-black text-slate-900">{{ mover.rating }}</span>
                    <span class="text-[11px] text-slate-400 font-medium">({{ mover.moves }} moves)</span>
                  </div>
                  <span class="inline-block mt-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    👥 {{ mover.crew }}
                  </span>
                </div>
              </div>

              <p class="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                {{ mover.bio }}
              </p>

              <div class="space-y-2 py-3 border-y border-slate-100 text-xs mb-4">
                <div class="flex items-center justify-between text-slate-600">
                  <span>Equipment:</span>
                  <span class="font-bold text-slate-800">{{ mover.equipment }}</span>
                </div>
                <div class="flex items-center justify-between text-slate-600">
                  <span>Halls:</span>
                  <span class="font-bold text-slate-800 truncate max-w-[180px]">{{ mover.halls }}</span>
                </div>
              </div>

              <!-- Available Schedule Slots -->
              <div class="mb-6">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Available Slots:</span>
                <div class="space-y-1.5">
                  <span 
                    v-for="slot in mover.slots.slice(0, 2)" 
                    :key="slot"
                    class="block text-[11px] font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60"
                  >
                    🕒 {{ slot }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-4 pt-2">
                <span class="text-xs font-bold text-slate-400">Base Moving Rate</span>
                <span class="text-xl font-black text-amber-700">₦{{ mover.baseFee.toLocaleString() }}</span>
              </div>
              <button
                @click="openDirectBooking(mover)"
                class="w-full py-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Book This Mover Team</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mover Registration Banner -->
      <div class="rounded-3xl bg-amber-500 text-slate-950 p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="max-w-xl">
          <span class="px-3 py-1 rounded-full bg-slate-950 text-white font-black text-[10px] uppercase tracking-wider mb-3 inline-block">
            Mover Recruitment Open
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
            Are You Strong & Reliable? Sign Up as a Mover!
          </h2>
          <p class="text-xs sm:text-sm font-semibold text-slate-900/80 leading-relaxed">
            Students on campus need helpers to haul goods every day during movement season. Set your own hours, bring a friend as your 2-man crew, and cash out ₦15,000 - ₦40,000 directly to your account.
          </p>
        </div>
        <button
          @click="openSignupModal"
          class="px-6 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs transition-colors shrink-0 shadow-lg active:scale-95"
        >
          Register as Campus Mover 🚚
        </button>
      </div>

    </div>

    <!-- Booking Modal -->
    <div v-if="isBookingOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button @click="isBookingOpen = false" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full">
          <X class="w-5 h-5" />
        </button>

        <h3 class="text-xl font-black text-slate-900 mb-1">Book {{ selectedMoverForBooking?.name }}</h3>
        <p class="text-xs text-slate-500 font-medium mb-6">Select your scheduled slot and route details.</p>

        <form @submit.prevent="confirmDirectBooking" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Pickup Hostel & Room *</label>
            <input 
              v-model="bookingForm.pickup" 
              required 
              type="text" 
              placeholder="e.g. Moremi Hall, 3rd Floor, Room 314" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Destination Hostel & Room *</label>
            <input 
              v-model="bookingForm.destination" 
              required 
              type="text" 
              placeholder="e.g. New Hall, Block B, Room 102" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Schedule Slot *</label>
            <select 
              v-model="bookingForm.slot" 
              required 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
            >
              <option v-for="slot in selectedMoverForBooking?.slots" :key="slot" :value="slot">
                {{ slot }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Items to Move (Fridges, Mattress, Suitcases) *</label>
            <textarea 
              v-model="bookingForm.items" 
              required 
              rows="2"
              placeholder="e.g. 1 Medium fridge, 1 double mattress, 2 large travel boxes" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:border-amber-500 text-slate-900"
            ></textarea>
          </div>

          <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
            🔒 <strong>Decluttered Escrow Protected</strong>: Base rate of ₦{{ selectedMoverForBooking?.baseFee.toLocaleString() }} is held securely until moving is complete and verified.
          </div>

          <button
            type="submit"
            :disabled="bookingSubmitting"
            class="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Loader2 v-if="bookingSubmitting" class="w-4 h-4 animate-spin" />
            <span v-else>Confirm Mover Booking & Schedule 🤝</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Mover Signup Modal -->
    <div v-if="isSignupOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button @click="isSignupOpen = false" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full">
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🚚</span>
          <h3 class="text-xl font-black text-slate-900">Sign Up as a Campus Mover</h3>
        </div>
        <p class="text-xs text-slate-500 font-medium mb-6">Earn daily income moving student hostel loads during movement season.</p>

        <form @submit.prevent="submitMoverSignup" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Mover / Team Name *</label>
            <input 
              v-model="signupForm.name" 
              required 
              type="text" 
              placeholder="e.g. David Stronghands or Victor & Mates" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Crew Size *</label>
              <select 
                v-model="signupForm.crew" 
                required 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
              >
                <option value="Solo Mover">Solo Mover</option>
                <option value="2-Person Crew">2-Person Crew (Recommended)</option>
                <option value="3+ Person Heavy Crew">3+ Person Heavy Crew</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Equipment Access *</label>
              <select 
                v-model="signupForm.equipment" 
                required 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
              >
                <option value="Heavy Trolley & Straps">Heavy Trolley & Straps</option>
                <option value="Flatbed Cart">Flatbed Cart</option>
                <option value="Manual Lifting Only">Manual Lifting Only</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Halls / Hostels Covered *</label>
            <input 
              v-model="signupForm.halls" 
              required 
              type="text" 
              placeholder="e.g. Moremi, New Hall, Fagunwa, Madam Tinubu" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Base Moving Rate (₦) *</label>
            <input 
              v-model="signupForm.baseFee" 
              required 
              type="number" 
              placeholder="3000" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
            <input 
              v-model="signupForm.whatsapp" 
              required 
              type="tel" 
              placeholder="e.g. 08012345678" 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500 text-slate-900"
            />
          </div>

          <button
            type="submit"
            :disabled="signupSubmitting"
            class="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Loader2 v-if="signupSubmitting" class="w-4 h-4 animate-spin" />
            <span v-else>Register as Campus Mover 🚀</span>
          </button>
        </form>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight, Truck, Users, X, Loader2 } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'

useSeoMeta({
  title: 'Campus Hostel Movers & Heavy Lifting | Decluttered by Erranders',
  description: 'Book verified student mover teams for fridges, foam mattresses, and heavy hostel room clearance.',
  ogTitle: 'Campus Hostel Movers & Heavy Lifting | Decluttered by Erranders',
})

const activeHallFilter = ref('all')
const isBookingOpen = ref(false)
const isSignupOpen = ref(false)
const bookingSubmitting = ref(false)
const signupSubmitting = ref(false)
const selectedMoverForBooking = ref(null)

const moversList = [
  {
    id: 'mover-emeka',
    name: 'Emeka & Campus Movers',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    moves: 184,
    crew: '2-Man Heavy Lift Team',
    equipment: 'Heavy-Duty Hand Trolley & Moving Straps',
    halls: 'Moremi, Fagunwa, Madam Tinubu & New Hall',
    baseFee: 3000,
    bio: 'Specialized in multi-floor stair lifting, refrigerators, and heavy hostel room pack-outs.',
    slots: [
      'Today: 9:00 AM - 12:00 PM (Morning Slot)',
      'Today: 1:30 PM - 4:30 PM (Afternoon Slot)',
      'Tomorrow: 8:30 AM - 11:30 AM (Morning Slot)',
      'Tomorrow: 2:00 PM - 5:00 PM (Afternoon Slot)',
    ]
  },
  {
    id: 'mover-victor',
    name: 'Victor Ade (Hostel Haulers)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 4.8,
    moves: 92,
    crew: 'Solo Lifter + Flatbed Cart',
    equipment: 'Flatbed Cart & Bungee Straps',
    halls: 'Zik, Independence & Queen Idia',
    baseFee: 2500,
    bio: 'Swift hostel cart transport for suitcases, gas cylinders, and study tables across campus.',
    slots: [
      'Today: 11:00 AM - 2:00 PM (Midday Slot)',
      'Today: 4:00 PM - 7:00 PM (Sunset Slot)',
      'Tomorrow: 9:00 AM - 12:00 PM (Morning Slot)',
    ]
  },
  {
    id: 'mover-samuel',
    name: 'Samuel & Strong Hands Crew',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    rating: 5.0,
    moves: 240,
    crew: '3-Man Full Room Relocation Crew',
    equipment: 'Stair Climber Dolly & Foam Wraps',
    halls: 'Campus-wide Hostels & Faculty Blocks',
    baseFee: 4500,
    bio: 'Complete hostel flat relocations. We dismantle beds, pack boxes, and load into campus cabs.',
    slots: [
      'Today: 2:00 PM - 5:00 PM (Afternoon Slot)',
      'Tomorrow: 8:00 AM - 11:00 AM (Early Rush Slot)',
      'Tomorrow: 1:00 PM - 4:00 PM (Afternoon Slot)',
    ]
  }
]

const filteredMovers = computed(() => {
  if (activeHallFilter.value === 'all') return moversList
  return moversList.filter(m => m.halls.toLowerCase().includes(activeHallFilter.value.toLowerCase()))
})

const scrollToMovers = () => {
  document.getElementById('movers-directory')?.scrollIntoView({ behavior: 'smooth' })
}

const openDirectBooking = (mover) => {
  selectedMoverForBooking.value = mover
  bookingForm.value.slot = mover.slots[0]
  isBookingOpen.value = true
}

const openSignupModal = () => {
  isSignupOpen.value = true
}

const bookingForm = ref({
  pickup: '',
  destination: '',
  slot: '',
  items: '',
})

const signupForm = ref({
  name: '',
  crew: '2-Person Crew',
  equipment: 'Heavy Trolley & Straps',
  halls: '',
  baseFee: 3000,
  whatsapp: '',
})

const confirmDirectBooking = () => {
  bookingSubmitting.value = true
  setTimeout(() => {
    bookingSubmitting.value = false
    isBookingOpen.value = false
    useCustomToast().showToast({
      title: 'Mover Booking Confirmed! 🚚',
      message: `${selectedMoverForBooking.value.name} is booked for ${bookingForm.value.slot}. Payment held in Decluttered Escrow!`,
      toastType: 'success',
    })
  }, 1200)
}

const submitMoverSignup = () => {
  signupSubmitting.value = true
  setTimeout(() => {
    signupSubmitting.value = false
    isSignupOpen.value = false
    useCustomToast().showToast({
      title: 'Mover Registration Submitted! 🤝',
      message: `Welcome, ${signupForm.value.name}! Your mover profile is registered. You will now receive heavy lift booking alerts on campus!`,
      toastType: 'success',
    })
  }, 1200)
}
</script>
