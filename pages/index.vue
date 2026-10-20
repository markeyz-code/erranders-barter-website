<template>
  <div class="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20 selection:bg-brand-500 selection:text-white">
    
    <!-- Top Catch-Up Announcement (New items since last visit) -->
    <CatchUpBanner />

    <!-- ── Dynamic Hero: Search First, Visual Feed, Zero Long Reading ── -->
    <section class="bg-white border-b border-slate-200/80 pt-6 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Soft dot background grid -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        
        <!-- Live Campus Ticker Badge -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Campus Market</span>
            <span class="text-slate-400">•</span>
            <span class="font-normal">{{ campusStats.activeListings }} items active</span>
          </div>

          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-800 text-xs font-bold">
            <ShieldCheck class="w-3.5 h-3.5 text-purple-600" />
            <span>Escrow Protected</span>
          </div>
        </div>

        <!-- Punchy Action Header -->
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Buy, swap and book <br class="hidden sm:inline" />
              <span class="text-brand-600">straight from students</span> on your campus.
            </h1>
            <p class="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              No long talk. Grab room items before they sell out, trade what you have, or book hostel helpers.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2.5 shrink-0">
            <NuxtLink
              to="/sell"
              class="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-brand-600/20 active:scale-95 flex items-center gap-2"
            >
              <Tag class="w-4 h-4" />
              <span>Sell Room Items</span>
            </NuxtLink>

            <NuxtLink
              to="/declutter"
              class="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <Package class="w-4 h-4 text-brand-400" />
              <span>1-Click Declutter</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Live Omnibox Search -->
        <div class="max-w-4xl relative">
          <form class="flex items-center gap-2" @submit.prevent="submitSearch">
            <div class="relative flex-1">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="searchInput"
                type="text"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-brand-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-600/10 transition-all shadow-sm"
                placeholder="Search mini-fridges, fans, textbooks, hot plates, hostel movers..."
              />
            </div>
            <button
              type="submit"
              class="bg-slate-900 hover:bg-brand-600 text-white font-black px-6 py-3.5 rounded-2xl text-sm transition-all shrink-0 active:scale-95 shadow-sm"
            >
              Search Market
            </button>
          </form>

          <!-- Quick Discovery Pills -->
          <div class="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Popular:</span>
            <button
              v-for="pill in popularSearches"
              :key="pill"
              @click="quickSearch(pill)"
              class="px-3 py-1 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-bold transition-colors whitespace-nowrap border border-slate-200/60"
            >
              {{ pill }}
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- ── Live Fast Filter Tabs (Sticky/Quick-jump) ── -->
    <div class="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            @click="activeCategory = tab.id"
            class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            :class="activeCategory === tab.id
              ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25 scale-[1.02]'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'"
          >
            <component :is="tab.icon" class="w-3.5 h-3.5" />
            <span>{{ tab.label }}</span>
            <span v-if="tab.count" class="text-[10px] opacity-80">({{ tab.count }})</span>
          </button>
        </div>

        <!-- Quick Jump Links -->
        <div class="hidden md:flex items-center gap-3 shrink-0 text-xs font-bold">
          <a href="#buy-section" class="text-slate-500 hover:text-brand-600">Items to Buy</a>
          <span class="text-slate-300">•</span>
          <a href="#sold-section" class="text-slate-500 hover:text-brand-600">Just Sold</a>
          <span class="text-slate-300">•</span>
          <a href="#swap-section" class="text-slate-500 hover:text-brand-600">Swap Items</a>
          <span class="text-slate-300">•</span>
          <a href="#reels-section" class="text-red-500 hover:text-red-600 flex items-center gap-1">
            <Flame class="w-3.5 h-3.5 fill-current" /> Reels
          </a>
          <span class="text-slate-300">•</span>
          <a href="#services-section" class="text-slate-500 hover:text-brand-600">Services</a>
        </div>
      </div>
    </div>

    <!-- ── SECTION 1: ITEMS MAPPED TO BUY (Hot Deals Feed) ── -->
    <section id="buy-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <ShoppingBag class="w-4 h-4" />
            <span>Ready for Instant Purchase</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Items Mapped to Buy
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Pre-inspected items currently listed by students in your campus hostels.
          </p>
        </div>

        <NuxtLink
          to="/explore"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline shrink-0"
        >
          <span>Browse All {{ displayToBuy.length }} Items</span>
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading.items" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <div v-for="i in 8" :key="i" class="rounded-3xl bg-white border border-slate-200 p-3 h-72 animate-pulse" />
      </div>

      <!-- Items Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink
          v-for="item in displayToBuy"
          :key="item._id"
          :to="`/item/${item._id}`"
          class="group rounded-3xl bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col overflow-hidden relative"
        >
          <!-- Image Container -->
          <div class="aspect-[4/3] bg-slate-100 overflow-hidden relative">
            <img
              :src="imageOf(item)"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <!-- Condition / Campus Badge -->
            <div class="absolute top-2.5 left-2.5 flex items-center gap-1">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/95 text-slate-800 shadow-sm backdrop-blur-md">
                {{ item.condition || 'Verified' }}
              </span>
            </div>
            <!-- Escrow Badge -->
            <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-900/80 text-white backdrop-blur-md">
              <ShieldCheck class="w-2.5 h-2.5 inline -mt-0.5" /> Escrow
            </span>
          </div>

          <!-- Item Body -->
          <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-baseline justify-between gap-1 mb-1">
                <span class="text-base sm:text-lg font-black text-brand-600">
                  {{ naira(item.price) }}
                </span>
                <span v-if="item.originalPrice" class="text-xs text-slate-400 line-through">
                  {{ naira(item.originalPrice) }}
                </span>
              </div>
              <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                {{ item.title }}
              </h3>
            </div>

            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span class="flex items-center gap-1 truncate font-medium">
                <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
                <span class="truncate">{{ item.location || 'Campus Hostels' }}</span>
              </span>
              <span class="text-brand-600 font-extrabold group-hover:translate-x-0.5 transition-transform shrink-0">
                Buy →
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ── SECTION 2: JUST SOLD OUT (Real-Time Social Proof Ticker) ── -->
    <section id="sold-section" class="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white py-10 my-8 relative overflow-hidden border-y border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-black text-base border border-red-500/30">
              <Zap class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">Just Sold Out</h3>
                <span class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider border border-red-500/30">
                  Live Campus Activity
                </span>
              </div>
              <p class="text-xs text-slate-400">
                Deals snatched up by students in the last 24 hours. Don't snooze on hot listings!
              </p>
            </div>
          </div>

          <NuxtLink to="/sell" class="text-xs font-bold text-brand-400 hover:text-brand-300 hover:underline">
            Have similar items? Sell for instant cash →
          </NuxtLink>
        </div>

        <!-- Sold Items Horizontal Carousel -->
        <div class="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x">
          <div
            v-for="item in displayJustSold"
            :key="item._id"
            class="w-56 sm:w-64 shrink-0 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 relative group overflow-hidden"
          >
            <div class="aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 relative mb-3">
              <img
                :src="imageOf(item)"
                :alt="item.title"
                class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-300"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <span class="px-3 py-1 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg transform -rotate-3">
                  Sold Out
                </span>
              </div>
            </div>

            <h4 class="font-bold text-xs sm:text-sm text-slate-200 truncate mb-1">{{ item.title }}</h4>
            <div class="flex items-center justify-between text-xs">
              <span class="font-black text-emerald-400">{{ naira(item.price) }}</span>
              <span class="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Clock class="w-3 h-3 text-slate-500" />
                {{ item.soldAgo || 'Recently' }}
              </span>
            </div>
            <p class="text-[10px] text-slate-500 mt-1 truncate"><MapPin class="w-3 h-3 inline -mt-0.5" /> {{ item.location || 'Campus Wide' }}</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ── SECTION 3: ITEMS TO SWAP (Active Barter Exchanges) ── -->
    <section id="swap-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <ArrowRightLeft class="w-4 h-4" />
            <span>Direct Student Exchanges</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Items Up for Swap
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Trade what you have in your room for what you need — zero cash required.
          </p>
        </div>

        <NuxtLink
          to="/swap"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline shrink-0"
        >
          <span>View All Swaps</span>
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Swap Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="swap in displayToSwap"
          :key="swap._id"
          :to="`/item/${swap._id}`"
          class="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col justify-between"
        >
          <div class="flex gap-4 items-start">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
              <img
                :src="imageOf(swap)"
                :alt="swap.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <span class="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-black uppercase">
                Has
              </span>
            </div>

            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Student Offers</span>
              <h3 class="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                {{ swap.title }}
              </h3>
              
              <div class="mt-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <ArrowRightLeft class="w-3 h-3 text-amber-600" /> Wants in Exchange:
                </span>
                <p class="text-xs font-bold text-amber-950 truncate mt-0.5">
                  {{ swap.swapPreference || 'Open to fair trades' }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-[11px] text-slate-400 font-medium"><MapPin class="w-3 h-3 inline -mt-0.5" /> {{ swap.location || 'Campus Wide' }}</span>
            <span class="px-3 py-1 rounded-xl bg-amber-500/15 group-hover:bg-amber-500 text-amber-700 group-hover:text-white font-black text-xs transition-colors">
              Propose Trade ⇄
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ── SECTION 4: INTERACTIVE CAMPUS REELS SHOWCASE ── -->
    <section id="reels-section" class="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-slate-800">
      <div class="max-w-7xl mx-auto relative z-10">
        
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-1.5 text-xs font-black text-red-400 uppercase tracking-wider mb-1">
              <Flame class="w-4 h-4 fill-current animate-pulse" />
              <span>Campus Video Experience</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Watch & Buy in 15 Seconds
            </h2>
            <p class="text-xs sm:text-sm text-slate-400 font-medium max-w-xl">
              Real video walk-throughs: see fridge chilling power, mattress thickness, and room clearance unboxings before paying.
            </p>
          </div>

          <NuxtLink
            to="/reels"
            class="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 shrink-0 active:scale-95"
          >
            <PlayIcon class="w-4 h-4 fill-current" />
            <span>Open full reels feed</span>
          </NuxtLink>
        </div>

        <!-- Vertical Reels Cards Grid / Slider -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <NuxtLink
            v-for="reel in displayReels"
            :key="reel._id"
            :to="`/reels?reelId=${reel._id}`"
            class="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative aspect-[9/16] hover:border-red-500/80 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 flex flex-col justify-between p-3.5"
          >
            <!-- Background Video / Image Preview -->
            <div class="absolute inset-0 bg-slate-900">
              <video
                v-if="reel.videos?.length"
                :src="reel.videos[0]"
                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                muted
                playsinline
                preload="metadata"
              />
              <img
                v-else
                :src="imageOf(reel)"
                :alt="reel.title"
                class="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/60 pointer-events-none"></div>
            </div>

            <!-- Top Overlay: Creator & Views -->
            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-200">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>{{ reel.author || '@student' }}</span>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                <Heart class="w-3 h-3 inline" /> {{ reel.likesCount || 0 }}
              </span>
            </div>

            <!-- Center: Big Play Icon on Hover -->
            <div class="relative z-10 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <div class="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/50 backdrop-blur-sm">
                <PlayIcon class="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>

            <!-- Bottom: Product Card Overlay -->
            <div class="relative z-10 space-y-1 bg-black/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
              <h4 class="font-bold text-xs text-white line-clamp-1">{{ reel.title }}</h4>
              <div class="flex items-center justify-between">
                <span class="font-black text-emerald-400 text-xs">{{ naira(reel.price) }}</span>
                <span class="text-[10px] font-black text-red-400 group-hover:underline">Watch Reel →</span>
              </div>
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ── SECTION 5: CAMPUS SERVICES & SKILLS ── -->
    <section id="services-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Wrench class="w-4 h-4" />
            <span>Verified Campus Help</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Book Services & Skills
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            From hostel room fumigation and moving crews to laptop repairs and haircut bookings.
          </p>
        </div>

        <NuxtLink
          to="/services"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 hover:underline shrink-0"
        >
          <span>All Campus Services</span>
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Services Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <NuxtLink
          v-for="service in displayServices"
          :key="service._id"
          :to="`/services/${service._id}`"
          class="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Wrench class="w-6 h-6 text-brand-600" />
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                {{ service.badge || 'Verified' }}
              </span>
            </div>
            
            <div>
              <h3 class="font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                {{ service.title }}
              </h3>
              <p class="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                {{ service.description }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="font-black text-sm text-slate-900">{{ service.priceText || servicePriceLabel(service) }}</span>
            <span class="px-3 py-1 rounded-xl bg-slate-900 group-hover:bg-purple-600 text-white text-xs font-bold transition-colors">
              Book Slot
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ── SECTION 6: PARTNER BUSINESS SPOTLIGHT (Fumigation, Movers & Business Mini-Admin) ── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-10">
      <div class="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div class="max-w-2xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black">
              <span>Commercial services and vendor ecosystem</span>
              <span class="text-slate-500">•</span>
              <span>Unique Subdomain Included</span>
            </div>

            <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hostel Room Fumigation & Business Vendor Portal
            </h3>

            <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Operating a service business on campus? Businesses like <strong>Hostel Room Fumigation Partners</strong> and <strong>Luggage Movers</strong> get their own dedicated storefront (e.g. <span class="font-mono text-emerald-400">fumigation.erranders.org</span>), recruit campus student staff, and manage dispatches & escrow payouts from their private Mini-Admin.
            </p>

            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span class="flex items-center gap-1.5"><CheckCircle2 class="w-4 h-4 text-emerald-400" /> Hospital-grade chemical guarantee</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 class="w-4 h-4 text-emerald-400" /> Dispatch student crew members</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 class="w-4 h-4 text-emerald-400" /> Instant Escrow payouts</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <NuxtLink
              to="/fumigation"
              class="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm text-center transition-all shadow-lg shadow-emerald-500/30 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Book a fumigation</span>
            </NuxtLink>

            <NuxtLink
              to="/business"
              class="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm text-center transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <span>Manage your business mini-admin</span>
              <ExternalLink class="w-4 h-4 text-slate-400" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search, ShoppingBag, Tag, Package, ShieldCheck, MapPin, Clock, ArrowRight, ArrowRightLeft, Flame, Play as PlayIcon, Wrench, CheckCircle2, ExternalLink, Heart, Sparkles, Zap
} from 'lucide-vue-next';
import CatchUpBanner from '~/components/CatchUpBanner.vue';
import { itemsApi } from '@/api_factory/modules/items';
import { servicesApi, type Service } from '@/api_factory/modules/services';
import { formatPriceLabel } from '@/composables/modules/services/useServiceFormatting';

useSeoMeta({
  title: 'Decluttered by Erranders - Instant Campus Marketplace, Deals & Gigs',
  description:
    'Discover items mapped to buy, live sold out deals, swaps, interactive reels, and campus services like room fumigation and moving porters.',
});

const router = useRouter();
const searchInput = ref('');
const activeCategory = ref('all');

const campusStats = ref({
  activeListings: 142,
  tradesToday: 38,
});

const popularSearches = [
  'Mini Fridge', 'Standing Fan', 'Textbooks', 'Gas Cylinder', 'Hot Plate', 'Mattress', 'Fumigation', 'Luggage Movers'
];

/** Tab counts are the real number of rows each rail is showing, never a guess. */
const filterTabs = computed(() => [
  { id: 'all', label: 'All Marketplace', icon: Sparkles },
  { id: 'buy', label: 'Items to Buy', icon: ShoppingBag, count: toBuy.value.length },
  { id: 'sold', label: 'Just Sold Out', icon: Flame, count: justSold.value.length },
  { id: 'swap', label: 'Swaps', icon: ArrowRightLeft, count: toSwap.value.length },
  { id: 'reels', label: 'Reels', icon: PlayIcon, count: reels.value.length },
  { id: 'services', label: 'Services & Skills', icon: Wrench, count: services.value.length },
]);

// State arrays from API
const toBuy = ref<any[]>([]);
const justSold = ref<any[]>([]);
const toSwap = ref<any[]>([]);
const services = ref<any[]>([]);
const reels = ref<any[]>([]);

const loading = reactive({ items: true, sold: true, swaps: true, services: true, reels: true });

const unwrap = (res: any): any[] => {
  const body = res?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(res)) return res;
  return [];
};

const imageOf = (item: any): string => {
  const first = Array.isArray(item?.images) && item.images.length ? item.images[0] : item?.image;
  // A listing without a photo gets a neutral placeholder, never a stock image of
  // some other product.
  return first || 'https://placehold.co/600x600/f1f5f9/94a3b8?text=No+photo';
};

/** Service cards show the real price from the API; only the (deleted) sample rows had priceText. */
const servicePriceLabel = (service: any): string =>
  formatPriceLabel(service?.priceType, service?.price);

const naira = (n?: number) => (typeof n === 'number' && !isNaN(n) ? `₦${Number(n).toLocaleString('en-NG')}` : '₦0');

// Every rail renders exactly what the API returned. No sample inventory is ever
// substituted: a student must never see an item that nobody is actually selling,
// because it cannot be opened or bought.
const displayToBuy = computed(() => toBuy.value);
const displayJustSold = computed(() => justSold.value);
const displayToSwap = computed(() => toSwap.value);
const displayReels = computed(() => reels.value);
const displayServices = computed(() => services.value);

const submitSearch = () => {
  const q = searchInput.value.trim();
  router.push(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
};

const quickSearch = (term: string) => {
  searchInput.value = term;
  router.push(`/explore?q=${encodeURIComponent(term)}`);
};

onMounted(() => {
  // Fetch Items to Buy
  itemsApi
    .list({ type: 'sell', status: 'active', limit: 12 })
    .then((r) => {
      const data = unwrap(r);
      if (data.length) toBuy.value = data;
    })
    .catch(() => { toBuy.value = []; })
    .finally(() => { loading.items = false; });

  // Fetch Just Sold Items
  itemsApi
    .list({ status: 'sold', limit: 8 })
    .then((r) => {
      const data = unwrap(r);
      if (data.length) justSold.value = data;
    })
    .catch(() => { justSold.value = []; })
    .finally(() => { loading.sold = false; });

  // Fetch Swap Items
  itemsApi
    .list({ type: 'swap', status: 'active', limit: 6 })
    .then((r) => {
      const data = unwrap(r);
      if (data.length) toSwap.value = data;
    })
    .catch(() => { toSwap.value = []; })
    .finally(() => { loading.swaps = false; });

  // Fetch Campus Services
  servicesApi
    .browse({ limit: 4 } as any)
    .then((r: any) => {
      const body = r?.data;
      const list = Array.isArray(body) ? body : (body?.data ?? []);
      if (list.length) services.value = list;
    })
    .catch(() => { services.value = []; })
    .finally(() => { loading.services = false; });

  // Fetch Reels
  itemsApi
    .getReels()
    .then((r: any) => {
      const body = r?.data;
      const list = Array.isArray(body) ? body : (body?.data ?? body?.reels ?? []);
      if (list.length) reels.value = list.slice(0, 8);
    })
    .catch(() => { reels.value = []; })
    .finally(() => { loading.reels = false; });
});
</script>
