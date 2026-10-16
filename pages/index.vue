<template>
  <main class="min-h-screen bg-white font-sans">
    
    <!-- Hero Section -->
    <div class="pt-10 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-white relative overflow-hidden border-b border-slate-100">
      
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 font-bold text-xs mb-5 border border-brand-200 shadow-sm">
        <span class="animate-pulse">📦</span> Stress-Free Hostel Movement
      </div>

      <h1 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] mb-4">
        Automate Your Hostel Movement. <br/>
        <span class="text-brand-600 transition-all duration-300">{{ currentPhrase }}</span>
      </h1>
      
      <p class="text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto mb-6 leading-relaxed">
        Why stress with heavy loads? Automate your <strong>hostel movement</strong> on <strong>Barter</strong> — turn your room items into instant cash or swap with verified students.
      </p>

      <!-- Multilingual Student Chips -->
      <!-- <div class="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-8 text-[11px] sm:text-xs font-bold">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
          <span>🇳🇬</span> <strong class="text-slate-900">Pidgin:</strong> Barter am sharp-sharp!
        </span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          <span>⚡</span> <strong class="text-amber-900">Yorùbá:</strong> Kò sí wàhálà, ṣe Barter!
        </span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span>🎒</span> <strong class="text-emerald-900">Igbo:</strong> Gbanwee ya na Barter!
        </span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
          <span>🚀</span> <strong class="text-blue-900">Hausa:</strong> Babu wahala, yi Barter!
        </span>
      </div> -->

      <!-- Smart Omnibox Search -->
      <div class="max-w-2xl mx-auto w-full mb-8 relative group z-50 text-left">
        <form @submit.prevent="handleSearch" class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search class="w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          </div>
          <input 
            v-model="searchQuery" 
            @focus="isDropdownOpen = true"
            type="text" 
            placeholder="Search for fridges, textbooks, or services..." 
            class="w-full bg-white border border-slate-300 focus:border-brand-600 rounded-xl py-3 pl-12 pr-28 transition-all outline-none font-medium text-base text-slate-900" 
          />
          <button type="submit" class="absolute inset-y-1.5 right-1.5 bg-brand-600 text-white font-bold px-4 rounded-lg hover:bg-brand-700 transition-colors text-sm">
            Search
          </button>
        </form>

        <!-- Live Dropdown -->
        <div v-if="isDropdownOpen && searchQuery.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[60vh] z-50">
          
          <div class="flex-1 overflow-y-auto p-4">
            
            <!-- Room Completion AI -->
            <div class="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <h4 class="font-black text-indigo-900 mb-2 flex items-center gap-2"><Sparkles class="w-4 h-4" /> Room Completer AI</h4>
              <p class="text-sm text-indigo-700 font-medium mb-3">Tell us what you already have, and we'll suggest what you're missing for a perfect room.</p>
              <div class="flex gap-2">
                <input v-model="roomItems" placeholder="e.g. Bed, Fan, Laptop..." class="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500" />
                <button @click="generateSuggestions" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700">Suggest</button>
              </div>
              <div v-if="aiSuggestions.length > 0" class="mt-4 flex flex-wrap gap-2">
                <span v-for="sug in aiSuggestions" :key="sug" @click="searchQuery = sug" class="px-3 py-1 bg-white text-indigo-700 text-sm font-bold rounded-full border border-indigo-200 cursor-pointer hover:bg-indigo-100 shadow-sm">
                  + {{ sug }}
                </span>
              </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-100">
              <span class="text-sm font-black text-slate-400 uppercase  flex items-center mr-2">Budget:</span>
              <button @click="budget = 10000" :class="budget === 10000 ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-600'" class="px-4 py-1.5 rounded-full text-sm font-bold border transition-colors">Under ₦10k</button>
              <button @click="budget = 50000" :class="budget === 50000 ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-600'" class="px-4 py-1.5 rounded-full text-sm font-bold border transition-colors">Under ₦50k</button>
              <button @click="budget = null" class="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold border border-transparent hover:bg-slate-200 transition-colors">Any Price</button>
            </div>

            <!-- Results List -->
            <div>
              <h4 class="text-sm font-black text-slate-400 uppercase  mb-4">Matching Items & Services</h4>
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
                      <span class="text-sm text-slate-500 truncate">{{ item.loc }}</span>
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-3xl mx-auto">
        <NuxtLink to="/explore" class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3.5 hover:border-brand-600 transition-all group">
          <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0"><ShoppingCart class="w-5 h-5" /></div>
          <div class="text-left"><h3 class="font-bold text-base text-slate-900">Buy Items</h3><p class="text-xs text-slate-500 font-medium">Find what you need.</p></div>
        </NuxtLink>
        <NuxtLink to="/sell" class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3.5 hover:border-green-500 transition-all group">
          <div class="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0"><Tag class="w-5 h-5" /></div>
          <div class="text-left"><h3 class="font-bold text-base text-slate-900">Sell Items</h3><p class="text-xs text-slate-500 font-medium">Turn it into cash.</p></div>
        </NuxtLink>
        <NuxtLink to="/swap" class="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3.5 hover:border-orange-500 transition-all group">
          <div class="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0"><ArrowRightLeft class="w-5 h-5" /></div>
          <div class="text-left"><h3 class="font-bold text-base text-slate-900">Swap Items</h3><p class="text-xs text-slate-500 font-medium">Trade for something else.</p></div>
        </NuxtLink>
      </div>
    </div>

    <!-- SECTION: The Problem We Solve -->
    <section class="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="relative">
            <div class="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200">
              <img src="/img/nigerian_students_packing_hostel_1790990458873.jpg" alt="Students packing up hostel room" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-3 -right-3 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-xs">
              ₦2M+ wasted yearly 😱
            </div>
          </div>
          <div>
            <span class="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">The Problem</span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-snug">Every session, students throw away perfectly good stuff.</h2>
            <p class="text-sm md:text-base text-slate-600 font-medium leading-relaxed mb-5">
              End of semester? Everybody is rushing out of the hostel. Fans, fridges, textbooks, extension boxes — all abandoned. Meanwhile, freshers resuming next session will buy these same things brand new at full price.
            </p>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><X class="w-3.5 h-3.5 text-red-500" /></div>
                <p class="text-sm text-slate-700 font-medium">Graduating students dump items worth thousands</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><X class="w-3.5 h-3.5 text-red-500" /></div>
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
    <section class="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-100">
      <div class="max-w-5xl mx-auto text-center">
        <span class="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">How It Works</span>
        <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Three steps. Zero wahala.</h2>
        <p class="text-sm md:text-base text-slate-500 font-medium max-w-lg mx-auto mb-10">No long talk. List it, sell it, get paid. Simple.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl p-5 border border-slate-200 text-left relative overflow-hidden group hover:border-brand-500 transition-colors">
            <div class="aspect-video rounded-lg overflow-hidden mb-4 border border-slate-100">
              <img src="/img/nigerian_student_snapping_item_1790990467827.jpg" alt="Student taking photo of item" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span class="text-3xl font-black text-slate-200 absolute top-4 right-5">01</span>
            <h3 class="text-lg font-bold text-slate-900 mb-1.5">Snap & List</h3>
            <p class="text-sm text-slate-600 font-medium">Take a photo or video of what you're selling. Add a price. Done in 30 seconds.</p>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 text-left relative overflow-hidden group hover:border-brand-500 transition-colors">
            <div class="aspect-video rounded-lg overflow-hidden mb-4 border border-slate-100">
              <img src="/img/nigerian_students_exchanging_1790990477525.jpg" alt="Students exchanging items" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span class="text-3xl font-black text-slate-200 absolute top-4 right-5">02</span>
            <h3 class="text-lg font-bold text-slate-900 mb-1.5">Match & Chat</h3>
            <p class="text-sm text-slate-600 font-medium">A buyer or swapper finds your item. Chat them directly inside Barter. No random DMs.</p>
          </div>

          <div class="bg-white rounded-xl p-5 border border-slate-200 text-left relative overflow-hidden group hover:border-brand-500 transition-colors">
            <div class="aspect-video rounded-lg overflow-hidden mb-4 border border-slate-100">
              <img src="/img/nigerian_student_phone_payment_1790990486294.jpg" alt="Secure payment" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span class="text-3xl font-black text-slate-200 absolute top-4 right-5">03</span>
            <h3 class="text-lg font-bold text-slate-900 mb-1.5">Pay & Deliver</h3>
            <p class="text-sm text-slate-600 font-medium">Funds go into Erranders Escrow. You get paid only after the buyer confirms delivery. No scam.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Escrow Trust -->
    <section class="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="order-2 md:order-1">
            <span class="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 block">Built on Trust</span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-snug">Your money is safe. Always.</h2>
            <p class="text-sm md:text-base text-slate-600 font-medium leading-relaxed mb-6">
              Every single transaction on Barter is protected by Erranders Escrow. The buyer's money is held securely until they confirm they received exactly what was listed. No "I don pay, abeg send am" stories.
            </p>
            <div class="grid grid-cols-2 gap-3.5">
              <div class="bg-green-50 rounded-xl p-4 border border-green-100">
                <ShieldCheck class="w-6 h-6 text-green-600 mb-2" />
                <h4 class="font-bold text-slate-900 text-sm mb-0.5">Escrow Protected</h4>
                <p class="text-xs text-slate-600">Funds held until delivery is confirmed</p>
              </div>
              <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <Truck class="w-6 h-6 text-blue-600 mb-2" />
                <h4 class="font-bold text-slate-900 text-sm mb-0.5">Campus Delivery</h4>
                <p class="text-xs text-slate-600">Erranders handles logistics</p>
              </div>
              <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <Camera class="w-6 h-6 text-purple-600 mb-2" />
                <h4 class="font-bold text-slate-900 text-sm mb-0.5">4D Item Zoom</h4>
                <p class="text-xs text-slate-600">Inspect every detail before buying</p>
              </div>
              <div class="bg-brand-50 rounded-xl p-4 border border-brand-100">
                <TrendingUp class="w-6 h-6 text-brand-600 mb-2" />
                <h4 class="font-bold text-slate-900 text-sm mb-0.5">Fair Pricing</h4>
                <p class="text-xs text-slate-600">See market prices before you offer</p>
              </div>
            </div>
          </div>
          <div class="order-1 md:order-2 relative">
            <div class="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200">
              <img src="/img/nigerian_students_campus_1790990496794.jpg" alt="Nigerian students working together on campus" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Services Marketplace -->
    <section class="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-100">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-10">
          <span class="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 block">Not Just Items</span>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Got skills? Sell them too.</h2>
          <p class="text-sm md:text-base text-slate-500 font-medium max-w-lg mx-auto">Barter isn't just for physical items. Students can offer services like braiding, repairs, tutoring, and more.</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div class="bg-white rounded-xl overflow-hidden border border-slate-200 group hover:border-brand-500 transition-colors">
            <div class="aspect-square overflow-hidden">
              <img src="/img/nigerian_hair_braiding_1790990545939.jpg" alt="Hair braiding service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-3.5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-200">Service</span>
              <h3 class="font-bold text-slate-900 mt-1.5 text-sm">Hair Braiding</h3>
              <p class="text-xs text-slate-500 mt-0.5">From ₦5k · Comes to hostel</p>
            </div>
          </div>
          <div class="bg-white rounded-xl overflow-hidden border border-slate-200 group hover:border-brand-500 transition-colors">
            <div class="aspect-square overflow-hidden">
              <img src="/img/nigerian_laptop_repair_1790990557474.jpg" alt="Laptop repair service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-3.5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-200">Service</span>
              <h3 class="font-bold text-slate-900 mt-1.5 text-sm">Laptop Repair</h3>
              <p class="text-xs text-slate-500 mt-0.5">From ₦3k · HW & SW</p>
            </div>
          </div>
          <div class="bg-white rounded-xl overflow-hidden border border-slate-200 group hover:border-brand-500 transition-colors">
            <div class="aspect-square overflow-hidden">
              <img src="/img/nigerian_tutoring_1790990568804.jpg" alt="Tutoring service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-3.5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-200">Service</span>
              <h3 class="font-bold text-slate-900 mt-1.5 text-sm">Private Tutoring</h3>
              <p class="text-xs text-slate-500 mt-0.5">From ₦2k · Any course</p>
            </div>
          </div>
          <div class="bg-white rounded-xl overflow-hidden border border-slate-200 group hover:border-brand-500 transition-colors">
            <div class="aspect-square overflow-hidden">
              <img src="/img/nigerian_room_cleaning_1790990576715.jpg" alt="Room cleaning service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-3.5">
              <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-200">Service</span>
              <h3 class="font-bold text-slate-900 mt-1.5 text-sm">Room Cleaning</h3>
              <p class="text-xs text-slate-500 mt-0.5">₦3k per room · Any hostel</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Testimonials -->
    <section class="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div class="max-w-5xl mx-auto text-center">
        <span class="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">Students Love It</span>
        <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10">Don't take our word for it.</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="bg-slate-50 rounded-xl p-5 text-left border border-slate-200">
            <p class="text-sm text-slate-700 font-medium leading-relaxed mb-4">"I was about to throw my fan away during hostel clearance. Listed it on Barter, sold it in 2 hours. ₦8k straight to my account. Mad o!"</p>
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center font-bold text-xs text-brand-700 border border-brand-200">CF</div>
              <div><p class="font-bold text-xs text-slate-900">Chioma F.</p><p class="text-[11px] text-slate-500">300L, Biochemistry</p></div>
            </div>
          </div>
          <div class="bg-slate-50 rounded-xl p-5 text-left border border-slate-200">
            <p class="text-sm text-slate-700 font-medium leading-relaxed mb-4">"I needed a fridge badly when I resumed. Found one on Barter for ₦15k instead of buying new for ₦50k. The escrow thing gave me confidence."</p>
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-xs text-blue-700 border border-blue-200">DA</div>
              <div><p class="font-bold text-xs text-slate-900">Damilare A.</p><p class="text-[11px] text-slate-500">100L, Medicine</p></div>
            </div>
          </div>
          <div class="bg-slate-50 rounded-xl p-5 text-left border border-slate-200">
            <p class="text-sm text-slate-700 font-medium leading-relaxed mb-4">"I do hair braiding on campus. Barter helped me get steady customers. The in-app chat is so smooth, I don't even need WhatsApp again."</p>
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center font-bold text-xs text-purple-700 border border-purple-200">AO</div>
              <div><p class="font-bold text-xs text-slate-900">Amara O.</p><p class="text-[11px] text-slate-500">200L, Mass Comm</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION: Final CTA -->
    <section class="py-14 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <img src="/img/nigerian_students_campus_1790990496794.jpg" class="w-full h-full object-cover" />
      </div>
      <div class="max-w-2xl mx-auto text-center relative z-10">
        <h2 class="text-3xl md:text-4xl font-black mb-4 leading-tight">Stop wasting. Start trading.</h2>
        <p class="text-sm md:text-base text-slate-400 font-medium max-w-lg mx-auto mb-8 leading-relaxed">
          Join thousands of students already buying, selling, and swapping on the Erranders Barter network.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/signup" class="bg-brand-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors text-sm">
            Start Trading Now
          </NuxtLink>
          <NuxtLink to="/explore" class="bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors text-sm backdrop-blur border border-white/10">
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
import { itemsApi } from '~/composables/useApi'

useSeoMeta({
  title: 'Erranders Barter - Stress-Free Campus Hostel Movement',
  description: 'Automate your hostel movement. Buy, sell, and swap room items seamlessly on campus with zero stress.',
  ogTitle: 'Erranders Barter - Automate Your Hostel Movement',
  ogDescription: 'Simplify your hostel movement. Sell off room items or swap on Barter with verified campus students.',
})

const router = useRouter()

// Carousel Logic - Multilingual hostel movement phrases
const phrases = [
  "Hostel movement without wahala! 📦",
  "Barter am sharp-sharp, cash out! ⚡",
  "Kò sí wàhálà — Ṣe Barter kọ́rọ̀! 🎒",
  "Zụta, Ree, Gbanwee na Barter! ✨",
  "Babu wahala — Yi Barter yanzu! 🚀",
  "Pack light, move easy, no stress! 🛋️",
  "Ta á, Rà á, Ṣe pàṣípààrọ̀! 🤝",
  "Kwaga hostel n'udo — Barter am! 💸",
  "Sauƙaƙa ƙaura da Barter! 🎓"
]
const currentPhrase = ref(phrases[0])
let currentIndex = 0
let intervalId

const itemsList = ref([])

onMounted(async () => {
  try {
    const { data, error } = await itemsApi.list({})
    if (!error && data) {
      itemsList.value = data
    }
  } catch (err) {
    console.error(err)
  }

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

// Dynamic search results from API items
const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  return itemsList.value.filter((item) => {
    const matchesSearch = (item.title || '').toLowerCase().includes(q) || (item.category || '').toLowerCase().includes(q)
    const matchesBudget = budget.value ? (item.price || 0) <= budget.value : true
    return matchesSearch && matchesBudget
  }).map(item => ({
    id: item._id,
    name: item.title,
    priceText: item.price ? `₦${item.price.toLocaleString()}` : 'Swap',
    category: item.type === 'service' ? 'Service' : 'Item',
    loc: item.location,
    img: item.images?.[0] || 'https://via.placeholder.com/200'
  }))
})
</script>