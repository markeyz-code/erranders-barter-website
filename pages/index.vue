<template>
  <main class="min-h-screen bg-white font-sans">
    
    <!-- Hero Section -->
    <div class="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center bg-white relative overflow-hidden border-b border-slate-100">
      
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 font-bold text-sm mb-8 border border-brand-100 shadow-sm">
        <span class="animate-pulse">🚀</span> Hostel movement just got easy
      </div>

      <h1 class="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
        Don't throw it away. <br/>
        <span class="text-brand-600 transition-all duration-300">{{ currentPhrase }}</span>
      </h1>
      
      <p class="text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-10">
        Turn your old fan, textbooks, or fridge into cash instead of leaving them behind! Or offer your skills as a service.
      </p>

      <!-- Smart Omnibox Search -->
      <div class="max-w-3xl mx-auto w-full mb-12 relative group z-50 text-left">
        <form @submit.prevent="handleSearch" class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <Search class="w-6 h-6 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          </div>
          <input 
            v-model="searchQuery" 
            @focus="isDropdownOpen = true"
            type="text" 
            placeholder="Search for fridges, textbooks, or services (e.g., hair styling)..." 
            class="w-full bg-white border border-slate-300 focus:border-brand-600 rounded-full py-4 pl-16 pr-32 transition-all outline-none font-bold text-lg text-slate-900 shadow-sm focus:shadow-xl" 
          />
          <button type="submit" class="absolute inset-y-2 right-2 bg-brand-600 text-white font-bold px-6 rounded-full hover:bg-brand-700 transition-colors">
            Search
          </button>
        </form>

        <!-- Live Dropdown -->
        <div v-if="isDropdownOpen && searchQuery.length > 0" class="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col max-h-[70vh]">
          
          <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            
            <!-- Room Completion AI -->
            <div class="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <h4 class="font-black text-indigo-900 mb-2 flex items-center gap-2"><Sparkles class="w-4 h-4" /> Room Completer AI</h4>
              <p class="text-sm text-indigo-700 font-medium mb-3">Tell us what you already have, and we'll suggest what you're missing for a perfect room.</p>
              <div class="flex gap-2">
                <input v-model="roomItems" placeholder="e.g. Bed, Fan, Laptop..." class="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500" />
                <button @click="generateSuggestions" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700">Suggest</button>
              </div>
              <div v-if="aiSuggestions.length > 0" class="mt-4 flex flex-wrap gap-2">
                <span v-for="sug in aiSuggestions" :key="sug" @click="searchQuery = sug" class="px-3 py-1 bg-white text-indigo-700 text-xs font-bold rounded-full border border-indigo-200 cursor-pointer hover:bg-indigo-100 shadow-sm">
                  + {{ sug }}
                </span>
              </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-100">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center mr-2">Budget:</span>
              <button @click="budget = 10000" :class="budget === 10000 ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-600'" class="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors">Under ₦10k</button>
              <button @click="budget = 50000" :class="budget === 50000 ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-600'" class="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors">Under ₦50k</button>
              <button @click="budget = null" class="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-transparent hover:bg-slate-200 transition-colors">Any Price</button>
            </div>

            <!-- Results List -->
            <div>
              <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Matching Items & Services</h4>
              <div v-if="filteredResults.length === 0" class="py-8 text-center text-slate-500 font-medium text-sm">
                No items or services found under ₦{{ budget ? budget.toLocaleString() : 'Any' }} matching "{{ searchQuery }}".
              </div>
              <div v-else class="space-y-2">
                <NuxtLink v-for="item in filteredResults" :key="item.id" :to="'/item/' + item.id" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
                  <img :src="item.img" class="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white" />
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                      <h5 class="font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{{ item.name }}</h5>
                      <span class="font-black text-brand-600 whitespace-nowrap ml-2">{{ item.priceText }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <span :class="item.category === 'Service' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'" class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border">
                        {{ item.category }}
                      </span>
                      <span class="text-xs text-slate-500 truncate">{{ item.loc }}</span>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>

          </div>
          <!-- Close Dropdown -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <button @click="isDropdownOpen = false" class="text-sm font-bold text-slate-500 hover:text-slate-900">Close Search</button>
          </div>
        </div>
      </div>

      <!-- Action Cards (Buy, Sell, Swap) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <NuxtLink to="/explore" class="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-brand-600 transition-all group">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><ShoppingCart class="w-6 h-6" /></div>
          <div class="text-left"><h3 class="font-black text-lg text-slate-900">Buy Items</h3><p class="text-sm text-slate-500 font-medium">Find what you need.</p></div>
        </NuxtLink>
        <NuxtLink to="/sell" class="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-green-500 transition-all group">
          <div class="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Tag class="w-6 h-6" /></div>
          <div class="text-left"><h3 class="font-black text-lg text-slate-900">Sell Items</h3><p class="text-sm text-slate-500 font-medium">Turn it into cash.</p></div>
        </NuxtLink>
        <NuxtLink to="/swap" class="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-orange-500 transition-all group">
          <div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowRightLeft class="w-6 h-6" /></div>
          <div class="text-left"><h3 class="font-black text-lg text-slate-900">Swap Items</h3><p class="text-sm text-slate-500 font-medium">Trade for something else.</p></div>
        </NuxtLink>
      </div>
    </div>

    <!-- SECTION: The Problem We Solve -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div class="relative">
            <div class="aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-200">
              <img src="https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800" alt="Students packing up hostel room" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-4 -right-4 bg-brand-600 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-lg">
              ₦2M+ wasted yearly 😱
            </div>
          </div>
          <div>
            <span class="text-xs font-black text-brand-600 uppercase tracking-widest mb-4 block">The Problem</span>
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">Every session, students throw away perfectly good stuff.</h2>
            <p class="text-lg text-slate-600 font-medium leading-relaxed mb-6">
              End of semester? Everybody is rushing out of the hostel. Fans, fridges, textbooks, extension boxes — all abandoned. Meanwhile, freshers resuming next session will buy these same things brand new at full price.
            </p>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><X class="w-4 h-4 text-red-500" /></div>
                <p class="text-slate-700 font-medium">Graduating students dump items worth thousands</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><X class="w-4 h-4 text-red-500" /></div>
                <p class="text-slate-700 font-medium">No trusted way to sell or swap on campus</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Check class="w-4 h-4 text-green-600" /></div>
                <p class="text-slate-700 font-bold">Barter fixes all of this. Instantly. Securely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: How Barter Works -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-6xl mx-auto text-center">
        <span class="text-xs font-black text-brand-600 uppercase tracking-widest mb-4 block">How It Works</span>
        <h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-4">Three steps. Zero wahala.</h2>
        <p class="text-lg text-slate-500 font-medium max-w-xl mx-auto mb-16">No long talk. List it, sell it, get paid. Simple.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-[2rem] p-8 border border-slate-200 text-left relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div class="aspect-video rounded-2xl overflow-hidden mb-6 border border-slate-100">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" alt="Student taking photo of item" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span class="text-6xl font-black text-slate-100 absolute top-6 right-8">01</span>
            <h3 class="text-xl font-black text-slate-900 mb-2">Snap & List</h3>
            <p class="text-slate-600 font-medium">Take a photo or video of what you're selling. Add a price. Done in 30 seconds.</p>
          </div>

          <div class="bg-white rounded-[2rem] p-8 border border-slate-200 text-left relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div class="aspect-video rounded-2xl overflow-hidden mb-6 border border-slate-100">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600" alt="Students exchanging items" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span class="text-6xl font-black text-slate-100 absolute top-6 right-8">02</span>
            <h3 class="text-xl font-black text-slate-900 mb-2">Match & Chat</h3>
            <p class="text-slate-600 font-medium">A buyer or swapper finds your item. Chat them directly inside Barter. No random DMs.</p>
          </div>

          <div class="bg-white rounded-[2rem] p-8 border border-slate-200 text-left relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div class="aspect-video rounded-2xl overflow-hidden mb-6 border border-slate-100">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600" alt="Secure payment" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span class="text-6xl font-black text-slate-100 absolute top-6 right-8">03</span>
            <h3 class="text-xl font-black text-slate-900 mb-2">Pay & Deliver</h3>
            <p class="text-slate-600 font-medium">Funds go into Erranders Escrow. You get paid only after the buyer confirms delivery. No scam.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Escrow Trust -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div class="order-2 md:order-1">
            <span class="text-xs font-black text-green-600 uppercase tracking-widest mb-4 block">Built on Trust</span>
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">Your money is safe. Always.</h2>
            <p class="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              Every single transaction on Barter is protected by Erranders Escrow. The buyer's money is held securely until they confirm they received exactly what was listed. No "I don pay, abeg send am" stories.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-green-50 rounded-2xl p-5 border border-green-100">
                <ShieldCheck class="w-8 h-8 text-green-600 mb-3" />
                <h4 class="font-black text-slate-900 mb-1">Escrow Protected</h4>
                <p class="text-sm text-slate-600">Funds held until delivery is confirmed</p>
              </div>
              <div class="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <Truck class="w-8 h-8 text-blue-600 mb-3" />
                <h4 class="font-black text-slate-900 mb-1">Campus Delivery</h4>
                <p class="text-sm text-slate-600">Erranders handles logistics</p>
              </div>
              <div class="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <Camera class="w-8 h-8 text-purple-600 mb-3" />
                <h4 class="font-black text-slate-900 mb-1">4D Item Zoom</h4>
                <p class="text-sm text-slate-600">Inspect every detail before buying</p>
              </div>
              <div class="bg-brand-50 rounded-2xl p-5 border border-brand-100">
                <TrendingUp class="w-8 h-8 text-brand-600 mb-3" />
                <h4 class="font-black text-slate-900 mb-1">Fair Pricing</h4>
                <p class="text-sm text-slate-600">See market prices before you offer</p>
              </div>
            </div>
          </div>
          <div class="order-1 md:order-2 relative">
            <div class="aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-200">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800" alt="Nigerian students working together on campus" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Services Marketplace -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-xs font-black text-purple-600 uppercase tracking-widest mb-4 block">Not Just Items</span>
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-4">Got skills? Sell them too.</h2>
          <p class="text-lg text-slate-500 font-medium max-w-xl mx-auto">Barter isn't just for physical items. Students can offer services like braiding, repairs, tutoring, and more.</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-[2rem] overflow-hidden border border-slate-200 group hover:-translate-y-1 transition-transform">
            <div class="aspect-square overflow-hidden">
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400" alt="Hair braiding service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-purple-200">Service</span>
              <h3 class="font-black text-slate-900 mt-2">Hair Braiding</h3>
              <p class="text-sm text-slate-500 mt-1">From ₦5k · Comes to your hostel</p>
            </div>
          </div>
          <div class="bg-white rounded-[2rem] overflow-hidden border border-slate-200 group hover:-translate-y-1 transition-transform">
            <div class="aspect-square overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400" alt="Laptop repair service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-purple-200">Service</span>
              <h3 class="font-black text-slate-900 mt-2">Laptop Repair</h3>
              <p class="text-sm text-slate-500 mt-1">From ₦3k · Software & Hardware</p>
            </div>
          </div>
          <div class="bg-white rounded-[2rem] overflow-hidden border border-slate-200 group hover:-translate-y-1 transition-transform">
            <div class="aspect-square overflow-hidden">
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400" alt="Tutoring service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-purple-200">Service</span>
              <h3 class="font-black text-slate-900 mt-2">Private Tutoring</h3>
              <p class="text-sm text-slate-500 mt-1">From ₦2k · Any course level</p>
            </div>
          </div>
          <div class="bg-white rounded-[2rem] overflow-hidden border border-slate-200 group hover:-translate-y-1 transition-transform">
            <div class="aspect-square overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400" alt="Room cleaning service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-purple-200">Service</span>
              <h3 class="font-black text-slate-900 mt-2">Room Cleaning</h3>
              <p class="text-sm text-slate-500 mt-1">₦3k per room · Any hostel</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Testimonials -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-6xl mx-auto text-center">
        <span class="text-xs font-black text-brand-600 uppercase tracking-widest mb-4 block">Students Love It</span>
        <h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-16">Don't take our word for it.</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-slate-50 rounded-[2rem] p-8 text-left border border-slate-200">
            <p class="text-slate-700 font-medium leading-relaxed mb-6">"I was about to throw my fan away during hostel clearance. Listed it on Barter, sold it in 2 hours. ₦8k straight to my account. Mad o!"</p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center font-black text-brand-700 border border-brand-200">CF</div>
              <div><p class="font-black text-slate-900">Chioma F.</p><p class="text-xs text-slate-500">300L, Biochemistry</p></div>
            </div>
          </div>
          <div class="bg-slate-50 rounded-[2rem] p-8 text-left border border-slate-200">
            <p class="text-slate-700 font-medium leading-relaxed mb-6">"I needed a fridge badly when I resumed. Found one on Barter for ₦15k instead of buying new for ₦50k. The escrow thing gave me confidence."</p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-700 border border-blue-200">DA</div>
              <div><p class="font-black text-slate-900">Damilare A.</p><p class="text-xs text-slate-500">100L, Medicine</p></div>
            </div>
          </div>
          <div class="bg-slate-50 rounded-[2rem] p-8 text-left border border-slate-200">
            <p class="text-slate-700 font-medium leading-relaxed mb-6">"I do hair braiding on campus. Barter helped me get steady customers. The in-app chat is so smooth, I don't even need WhatsApp again."</p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-black text-purple-700 border border-purple-200">AO</div>
              <div><p class="font-black text-slate-900">Amara O.</p><p class="text-xs text-slate-500">200L, Mass Comm</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Final CTA -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600" class="w-full h-full object-cover" />
      </div>
      <div class="max-w-3xl mx-auto text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-black mb-6 leading-tight">Stop wasting. Start trading.</h2>
        <p class="text-lg text-slate-400 font-medium max-w-xl mx-auto mb-10">
          Join thousands of students already buying, selling, and swapping on the Erranders Barter network. Your hostel movement starts here.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/signup" class="bg-brand-600 text-white font-bold px-8 py-4 rounded-full hover:bg-brand-700 transition-colors text-lg">
            Start Trading Now
          </NuxtLink>
          <NuxtLink to="/explore" class="bg-white/10 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-colors text-lg backdrop-blur border border-white/10">
            Explore Market
          </NuxtLink>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ArrowRightLeft, Search, ShoppingCart, Tag, Truck, ShieldCheck, Camera, TrendingUp, MapPin, Sparkles, X, Check } from 'lucide-vue-next'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Carousel Logic
const phrases = [
  "Buy, Sell & Swap.",
  "Ta, Ra, & Ṣepaṣipaaro.",
  "Buy, Sell, & Swap am!",
  "Zụta, Ree, & Gbanwee.",
  "Saya, Sayar & Canza."
]
const currentPhrase = ref(phrases[0])
let currentIndex = 0
let intervalId

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % phrases.length
    currentPhrase.value = phrases[currentIndex]
  }, 2500)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

// Advanced Omnibox Logic
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const budget = ref(null)
const roomItems = ref('')
const aiSuggestions = ref([])

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    isDropdownOpen.value = false
    router.push({ path: '/explore', query: { q: searchQuery.value, budget: budget.value } })
  }
}

const generateSuggestions = () => {
  if (!roomItems.value) return
  const input = roomItems.value.toLowerCase()
  let suggestions = []
  
  if (!input.includes('fridge')) suggestions.push('Mini Fridge')
  if (!input.includes('fan')) suggestions.push('Standing Fan')
  if (!input.includes('lamp')) suggestions.push('Reading Lamp')
  if (!input.includes('extension')) suggestions.push('Extension Box')
  if (!input.includes('pot')) suggestions.push('Hotplate / Pot')
  
  aiSuggestions.value = suggestions.length > 0 ? suggestions : ['Laundry Service', 'Cleaning Service']
}

// Marketplace & Services Mock Data
const dbItems = [
  { id: 1, name: 'Mini Fridge (Haier)', price: 35000, priceText: '₦35k', category: 'Appliance', loc: 'Block C, Mellanby', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200' },
  { id: 2, name: 'Intro to Engineering Textbook', price: 5000, priceText: '₦5k', category: 'Books', loc: 'Zik Hall', img: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=200' },
  { id: 4, name: 'Reading Lamp', price: 2000, priceText: '₦2k', category: 'Appliance', loc: 'Kuti Hall', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200' },
  { id: 5, name: 'Standing Fan (Century)', price: 12000, priceText: '₦12k', category: 'Appliance', loc: 'Awo Hall', img: 'https://images.unsplash.com/photo-1570776595562-ab16327b8761?w=200' },
  { id: 101, name: 'Hair Braiding (Knotless)', price: 8000, priceText: '₦8k / style', category: 'Service', loc: 'Idia Hall (Will come to you)', img: 'https://images.unsplash.com/photo-1595959223746-81532f1cb7ed?w=200' },
  { id: 102, name: 'Laptop Repair & Software', price: 5000, priceText: 'From ₦5k', category: 'Service', loc: 'Zik Hall (Tech Hub)', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200' },
  { id: 103, name: 'Hostel Cleaning Service', price: 3000, priceText: '₦3k / room', category: 'Service', loc: 'Any Hall', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200' }
]

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  return dbItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    const matchesBudget = budget.value ? item.price <= budget.value : true
    return matchesSearch && matchesBudget
  })
})
</script>