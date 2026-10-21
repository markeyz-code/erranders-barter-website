<template>
  <div class="min-h-screen bg-white font-sans text-slate-900 pb-20 selection:bg-brand-500 selection:text-white">
    
    <!-- Top Catch-Up Announcement (New items since last visit) -->
    <CatchUpBanner />

    <!-- ── Dynamic Hero: Exciting Multilingual Typewriting Design (Pidgin, Yorùbá, Igbo, Hausa) ── -->
    <section class="relative bg-gradient-to-b from-slate-50/70 via-white to-white border-b border-slate-100 py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
      <!-- Soft dot background grid & organic ambient blooms -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-75 pointer-events-none"></div>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- ═══ DESKTOP-ONLY FLOATING ORGANIC HERO IMAGES (Strictly hidden on Mobile) ═══ -->
      <!-- Card 1: Top Right Floating Photo (Students decluttering fridge and books) -->
      <div class="hidden lg:block absolute top-10 right-4 xl:right-12 z-20 group cursor-pointer transition-all duration-500 hover:scale-105">
        <div class="relative w-44 h-44 xl:w-52 xl:h-52 drop-shadow-2xl">
          <div class="w-full h-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl bg-slate-100">
            <img
              src="/img/hero_declutter_room.jpg"
              alt="Students decluttering hostel room on campus"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
            />
          </div>
          <!-- Cute Top Badge -->
          <div class="absolute -top-3 -right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md flex items-center gap-1">
            <span>✨</span> Verified Deal
          </div>
          <!-- Micro Caption Pill -->
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-xs font-black text-slate-800 flex items-center gap-1.5 transition-transform group-hover:scale-105">
            <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span>📦 Hostel Clearance Cashout</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Bottom Left Floating Photo (Instant Escrow Deals) -->
      <div class="hidden lg:block absolute bottom-8 left-4 xl:left-12 z-20 group cursor-pointer transition-all duration-500 hover:scale-105">
        <div class="relative w-36 h-36 xl:w-44 xl:h-44 drop-shadow-xl">
          <div class="w-full h-full overflow-hidden rounded-[2.2rem] border-3 border-white shadow-lg bg-slate-100">
            <img
              src="/img/hero_declutter_room.jpg"
              alt="Declutter appliances and books"
              class="w-full h-full object-cover object-bottom transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>
          <!-- Micro Caption Pill -->
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-[11px] font-black text-slate-800 flex items-center gap-1.5">
            <span class="text-amber-500">💰</span>
            <span>Instant Escrow Payout</span>
          </div>
        </div>
      </div>

      <div class="max-w-5xl mx-auto relative z-10 space-y-6">
        <!-- Top Eyebrow Badge & Language Switcher -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink
            to="/declutter"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-bold shadow-2xs hover:bg-brand-100/70 transition-colors"
          >
            <Zap class="w-3.5 h-3.5 fill-current text-brand-600 animate-pulse" />
            <span>⚡ Turn Clutter into Cash ⚡</span>
          </NuxtLink>

          <!-- Interactive Language Tabs -->
          <div class="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 backdrop-blur-xs">
            <button
              v-for="lang in languageOptions"
              :key="lang.id"
              @click="selectLanguage(lang.id)"
              :class="[
                activeLangFilter === lang.id
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/60'
              ]"
              class="px-2.5 py-1 rounded-full text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          </div>
        </div>

        <!-- Main Power Headline -->
        <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-black tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto">
          Turn your room clutter into
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-[#FF5C1A] to-amber-500">
            cash sharp-sharp
          </span> 🔥
        </h1>

        <!-- High-Impact Multilingual Typewriter Text Container -->
        <div class="max-w-3xl mx-auto py-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors mb-2.5 shadow-2xs" :class="currentPhrase.badgeClass">
            <span>{{ currentPhrase.flag }}</span>
            <span class="uppercase tracking-wider font-mono text-[10px]">{{ currentPhrase.lang }}</span>
            <span class="opacity-40">•</span>
            <span class="text-[11px] font-semibold">Campus Vibe</span>
          </div>

          <div class="min-h-[4.25rem] sm:min-h-[3.75rem] flex items-center justify-center px-4">
            <p class="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight font-heading leading-snug">
              <span>{{ typedText }}</span>
              <span class="inline-block w-0.5 sm:w-1 h-6 sm:h-7 bg-brand-600 ml-1.5 animate-pulse align-middle"></span>
            </p>
          </div>
        </div>

        <!-- Campus Subtitle with Escrow Guarantee -->
        <p class="max-w-2xl mx-auto text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
          Why keep wetin you no dey use? Sell your mattress, fridge, fan, gadgets or textbooks to verified students on campus with instant Escrow security.
          <strong class="text-slate-800 font-bold block sm:inline"> Kò sí wàhálà, no stories!</strong>
        </p>

        <!-- Quick Action CTA Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <NuxtLink
            to="/sell"
            class="group px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-sm transition-all shadow-md shadow-brand-600/25 active:scale-95 flex items-center gap-2.5"
          >
            <Tag class="w-4 h-4" />
            <span>Sell Room Items</span>
            <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>

          <NuxtLink
            to="/declutter"
            class="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2.5"
          >
            <Package class="w-4 h-4 text-brand-400" />
            <span>1-Click Declutter</span>
          </NuxtLink>

          <a
            href="#swap-section"
            class="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all border border-slate-200 flex items-center gap-2"
          >
            <ArrowRightLeft class="w-4 h-4 text-slate-500" />
            <span>Swap Essentials</span>
          </a>
        </div>

        <!-- Live Omnibox Search -->
        <div class="max-w-3xl mx-auto pt-4">
          <form class="flex items-center gap-2" @submit.prevent="submitSearch">
            <div class="relative flex-1">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="searchInput"
                type="text"
                class="w-full bg-white hover:bg-slate-50 focus:bg-white border border-slate-300 focus:border-brand-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-600/10 transition-all shadow-sm"
                placeholder="Search hostel movers, electricians, painters, mini-fridges, fans, textbooks..."
              />
            </div>
            <button
              type="submit"
              class="bg-slate-900 hover:bg-brand-600 text-white font-black px-6 py-3.5 rounded-2xl text-sm transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer"
            >
              Search
            </button>
          </form>

          <!-- Quick Discovery Pills (Fumigation removed) -->
          <div class="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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

        <!-- Social Proof & Trust Strip -->
        <div class="mt-10 pt-8 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="p-2">
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">₦4.8M+</p>
            <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Cashed Out by Students</p>
          </div>
          <div class="p-2">
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">1,950+</p>
            <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Room Items Traded</p>
          </div>
          <div class="p-2">
            <p class="text-xl sm:text-2xl font-black text-emerald-600 font-mono tracking-tight">100%</p>
            <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Escrow Safe (No Stories)</p>
          </div>
          <div class="p-2">
            <p class="text-xl sm:text-2xl font-black text-brand-600 font-mono tracking-tight">&lt; 2 Hours</p>
            <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Average Deal Speed</p>
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
    <section id="buy-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <ShoppingBag class="w-4 h-4" />
            <span>Ready to Buy</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Items Mapped to Buy
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Room essentials listed by campus students.
          </p>
        </div>

        <NuxtLink
          to="/explore"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline shrink-0"
        >
          <span>Browse All {{ toBuy.length }} Items</span>
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
    <section id="sold-section" class="bg-white border-y border-slate-200/80 py-10 my-8 relative overflow-hidden">
      <!-- Soft dot pattern matching hero -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-base border border-slate-200 shadow-2xs">
              <Zap class="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Just Sold Out</h3>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200/80">
                  Live
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium">
                Deals snatched up by campus students today.
              </p>
            </div>
          </div>

          <NuxtLink to="/sell" class="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline">
            Sell similar items →
          </NuxtLink>
        </div>

        <!-- Sold Items Horizontal Carousel -->
        <div class="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x">
          <div
            v-for="item in displayJustSold"
            :key="item._id"
            class="w-56 sm:w-64 shrink-0 rounded-2xl bg-white border border-slate-200 p-3 relative group overflow-hidden shadow-xs hover:shadow-md transition-all"
          >
            <div class="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative mb-3 border border-slate-100">
              <img
                :src="imageOf(item)"
                :alt="item.title"
                class="w-full h-full object-cover opacity-65 grayscale group-hover:grayscale-0 group-hover:opacity-85 transition-all duration-300"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                <span class="px-3 py-1 rounded-full bg-slate-900/90 text-white font-black text-[11px] uppercase tracking-wider shadow-sm">
                  Sold Out
                </span>
              </div>
            </div>

            <h4 class="font-bold text-xs sm:text-sm text-slate-900 truncate mb-1">{{ item.title }}</h4>
            <div class="flex items-center justify-between text-xs">
              <span class="font-black text-slate-900">{{ naira(item.price) }}</span>
              <span class="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Clock class="w-3 h-3 text-slate-400" />
                {{ item.soldAgo || 'Recently' }}
              </span>
            </div>
            <p class="text-[10px] text-slate-400 mt-1 truncate"><MapPin class="w-3 h-3 inline -mt-0.5" /> {{ item.location || 'Campus Wide' }}</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ── SECTION 3: ITEMS TO SWAP (Active Barter Exchanges - 2 Rows Max) ── -->
    <section id="swap-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <ArrowRightLeft class="w-4 h-4" />
            <span>Direct Trades</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Items Up for Swap
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Trade what you have for what you need — zero cash required.
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
    <section id="reels-section" class="bg-white border-y border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Soft dot pattern matching hero -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-2">
              <Flame class="w-3.5 h-3.5 text-brand-600 fill-brand-600" />
              <span>Reels</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Watch & Buy
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mt-1">
              Video previews before you pay.
            </p>
          </div>

          <NuxtLink
            to="/reels"
            class="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 shrink-0 active:scale-95"
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
            class="group rounded-3xl bg-white border border-slate-200 overflow-hidden relative aspect-[3/4] hover:border-brand-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-3.5 shadow-xs"
          >
            <!-- Background Video / Image Preview (Autoplay loop muted for live preview) -->
            <div class="absolute inset-0 bg-slate-900 overflow-hidden">
              <video
                v-if="reel.videos?.length"
                :src="reel.videos[0]"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                autoplay
                loop
                muted
                playsinline
                preload="auto"
              />
              <img
                v-else
                :src="imageOf(reel)"
                :alt="reel.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>
            </div>

            <!-- Top Overlay: Creator & Views -->
            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
                <span class="truncate max-w-[80px]">{{ reel.sellerId?.firstName || reel.author || '@student' }}</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 shadow-xs flex items-center gap-1">
                <Heart class="w-3 h-3 text-red-500 fill-red-500 inline" /> {{ reel.likesCount || 0 }}
              </span>
            </div>

            <!-- Center: Big Play Icon on Hover -->
            <div class="relative z-10 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <div class="w-11 h-11 rounded-full bg-white/95 text-slate-900 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all">
                <PlayIcon class="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>

            <!-- Bottom: Product Card Overlay -->
            <div class="relative z-10 space-y-1 bg-black/75 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 shadow-md">
              <h4 class="font-bold text-xs text-white line-clamp-1">{{ reel.title }}</h4>
              <div class="flex items-center justify-between">
                <span class="font-black text-brand-400 text-xs">{{ naira(reel.price) }}</span>
                <span class="text-[10px] font-black text-slate-300 group-hover:text-brand-400 flex items-center gap-0.5">
                  Watch →
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ── SECTION 5: CAMPUS SERVICES & SKILLS ── -->
    <section id="services-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <Wrench class="w-4 h-4 text-brand-600" />
            <span>Campus Help</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Book Services & Skills
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Hostel moving porters, electricians, painters, repairs & campus gigs.
          </p>
        </div>

        <NuxtLink
          to="/services"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline shrink-0"
        >
          <span>All Campus Services</span>
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Services Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <NuxtLink
          v-for="service in displayServices"
          :key="service._id"
          :to="`/services/${service._id}`"
          class="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/80">
                <Wrench class="w-5 h-5 text-brand-600" />
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {{ service.badge || 'Verified' }}
              </span>
            </div>
            
            <div>
              <h3 class="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                {{ service.title }}
              </h3>
              <p class="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                {{ service.description }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="font-black text-sm text-slate-900">{{ service.priceText || servicePriceLabel(service) }}</span>
            <span class="px-3 py-1 rounded-xl bg-slate-900 group-hover:bg-brand-600 text-white text-xs font-bold transition-colors">
              Book Slot
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ── SECTION 6: PARTNER BUSINESS SPOTLIGHT (Hostel Fumigation & Move Partners) - COMMENTED OUT AS REQUESTED ── -->
    <!--
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-10">
      <div class="p-6 sm:p-8 rounded-3xl bg-white text-slate-900 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60 pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="max-w-2xl space-y-2.5">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Commercial Partners</span>
              <span class="text-slate-300">•</span>
              <span>Custom Subdomains</span>
            </div>

            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Hostel Fumigation & Move Partners
            </h3>

            <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Campus businesses get custom storefronts (e.g. <span class="font-mono text-brand-600 font-bold">fumigation.erranders.org</span>) with student dispatch crews and instant escrow payouts.
            </p>

            <div class="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
              <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Hospital-grade chemical guarantee</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Dispatch student crews</span>
              <span class="flex items-center gap-1.5"><CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" /> Instant Escrow payouts</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <NuxtLink
              to="/fumigation"
              class="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm text-center transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Book Room Fumigation</span>
            </NuxtLink>

            <NuxtLink
              to="/become-a-business"
              class="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm text-center transition-colors border border-slate-200 flex items-center justify-center gap-2"
            >
              <span>Manage Business Mini-Admin</span>
              <ExternalLink class="w-3.5 h-3.5 text-slate-500" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    -->


  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search, ShoppingBag, Tag, Package, ShieldCheck, MapPin, Clock, ArrowRight, ArrowRightLeft,
  Flame, Play as PlayIcon, Wrench, CheckCircle2, ExternalLink, Heart, Sparkles, Zap
} from 'lucide-vue-next';
import CatchUpBanner from '~/components/CatchUpBanner.vue';
import { itemsApi } from '@/api_factory/modules/items';
import { servicesApi, type Service } from '@/api_factory/modules/services';
import { formatPriceLabel } from '@/composables/modules/services/useServiceFormatting';

useSeoMeta({
  title: 'Decluttered by Erranders - Instant Campus Marketplace, Deals & Gigs',
  description:
    'Discover items mapped to buy, live sold out deals, swaps, interactive reels, and campus services like hostel moving porters, electricians, and painters.',
});

const router = useRouter();
const searchInput = ref('');
const activeCategory = ref('all');

const campusStats = ref({
  activeListings: 142,
  tradesToday: 38,
});

const popularSearches = [
  'Hostel Movers', 'Hostel Electrician', 'Room Painter', 'Mini Fridge', 'Standing Fan', 'Study Desk', 'Hot Plate', 'Gas Cylinder', 'Mattress'
];

interface MultilingualPhrase {
  text: string;
  lang: 'Pidgin' | 'Yorùbá' | 'Igbo' | 'Hausa';
  flag: string;
  badgeClass: string;
}

const languageOptions = [
  { id: 'all', label: 'All Vibes', flag: '🇳🇬' },
  { id: 'Pidgin', label: 'Pidgin', flag: '🇳🇬' },
  { id: 'Yorùbá', label: 'Yorùbá', flag: '🟢' },
  { id: 'Igbo', label: 'Igbo', flag: '🟡' },
  { id: 'Hausa', label: 'Hausa', flag: '🔵' },
];

const activeLangFilter = ref<'all' | 'Pidgin' | 'Yorùbá' | 'Igbo' | 'Hausa'>('all');

const multilingualPhrases: MultilingualPhrase[] = [
  // Pidgin
  {
    text: "No dey carry old fridge enter new semester! Sell am sharp-sharp, chop life! 🇳🇬",
    lang: "Pidgin",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  {
    text: "Turn your room clutter to urgent 2k and raw cash within 2 hours! 💸",
    lang: "Pidgin",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  {
    text: "Why you go dey keep wetin you no dey use? Sell am, flex campus! ⚡",
    lang: "Pidgin",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  {
    text: "Graduating or moving hostel? Cash out ₦50,000+ from room items today! 📦",
    lang: "Pidgin",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  {
    text: "Escrow dey protect every kobo — 100% safe, zero stories, zero scam! 🛡️",
    lang: "Pidgin",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  // Yorùbá
  {
    text: "Kò sí wàhálà rárá — ta àwọn nǹkan yàrá rẹ lẹ́sẹ̀kẹsẹ̀ kí o gba owó! 💰",
    lang: "Yorùbá",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
  },
  {
    text: "Ẹ gbọ́ o! Mattress, fan, fridge — ta gbogbo rẹ fún students lónìí! ✨",
    lang: "Yorùbá",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
  },
  {
    text: "Oya na! Declutter room ẹ kíákíá, kí o chop life lórí campus láìsí stress! 🚀",
    lang: "Yorùbá",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
  },
  {
    text: "Owo nlá ń bọ̀! Ra àti ta nǹkan hostel pẹ̀lú ìbàlẹ̀ ọkàn tó péye! 🤝",
    lang: "Yorùbá",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
  },
  {
    text: "Awa campus hustlers kò ní give up — sell your room items, gba alert! 🔥",
    lang: "Yorùbá",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
  },
  // Igbo
  {
    text: "Nwanne, mee ego sharp sharp! Ere ihe na ime room gị taa n'enweghị nsogbu! 🚀",
    lang: "Igbo",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
  },
  {
    text: "Kedu ihe ị na-eche? Turn old textbooks & electronics into direct bank alert! 📱",
    lang: "Igbo",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
  },
  {
    text: "Onye ọbụla na-eme cash out — zụta ma ree ihe hostel n'udo na nchekwa! 💰",
    lang: "Igbo",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
  },
  {
    text: "Ego mbata dị ọsọ ọsọ — swap ihe ị na-adịghị eji maka ihe ị chọrọ taa! 🔄",
    lang: "Igbo",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
  },
  {
    text: "Ihe anyị na-ekwu bụ ego ziri ezi — no stories, safe escrow payment! 🛡️",
    lang: "Igbo",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
  },
  // Hausa
  {
    text: "Ba wahala ko kadan! Sayar da kayan dakin ka ka samu kudi yanzu nan! 🏃‍♂️",
    lang: "Hausa",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
  },
  {
    text: "Kudi a hannu nan da nan! Share daki, samun kudi mai kyau a campus! 💰",
    lang: "Hausa",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
  },
  {
    text: "Kasuwanci mai sauki da riba tsakanin dalibai — sayarwa ba damuwa ko kadan! 🤝",
    lang: "Hausa",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
  },
  {
    text: "Duk abin da baka bukata a daki, mayar dashi kudi cikin gaggawa yau! ⚡",
    lang: "Hausa",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
  },
  {
    text: "Tabbataccen tsaro da escrow — babu asara ko yaudara ko kadan a Erranders! 🛡️",
    lang: "Hausa",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
  },
];

const activePhrases = computed(() => {
  if (activeLangFilter.value === 'all') return multilingualPhrases;
  return multilingualPhrases.filter(p => p.lang === activeLangFilter.value);
});

const currentPhraseIndex = ref(0);
const typedText = ref('');
const isDeleting = ref(false);
let typewriterTimeout: any = null;

const currentPhrase = computed<MultilingualPhrase>(() => {
  const list = activePhrases.value;
  return list[currentPhraseIndex.value % list.length] || multilingualPhrases[0];
});

const selectLanguage = (langId: any) => {
  activeLangFilter.value = langId;
  currentPhraseIndex.value = 0;
  typedText.value = '';
  isDeleting.value = false;
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  runTypewriter();
};

const runTypewriter = () => {
  const phrase = currentPhrase.value.text;
  const currentLength = typedText.value.length;

  if (!isDeleting.value) {
    if (currentLength < phrase.length) {
      typedText.value = phrase.slice(0, currentLength + 1);
      typewriterTimeout = setTimeout(runTypewriter, 35);
    } else {
      // Completed typing, pause to let user read
      typewriterTimeout = setTimeout(() => {
        isDeleting.value = true;
        runTypewriter();
      }, 2600);
    }
  } else {
    if (currentLength > 0) {
      typedText.value = phrase.slice(0, currentLength - 1);
      typewriterTimeout = setTimeout(runTypewriter, 18);
    } else {
      // Completed deleting, move to next phrase
      isDeleting.value = false;
      currentPhraseIndex.value = (currentPhraseIndex.value + 1) % activePhrases.value.length;
      typewriterTimeout = setTimeout(runTypewriter, 400);
    }
  }
};

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
const displayToBuy = computed(() => toBuy.value.slice(0, 8));
const displayJustSold = computed(() => justSold.value);
const displayToSwap = computed(() => toSwap.value.slice(0, 6));
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

  // Start typewriter engine with multilingual excitement
  runTypewriter();
});

onUnmounted(() => {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }
});
</script>

<style scoped>
/* ── Hero Heading Rotation (Exact smooth ease-in / ease-out from student web app) ── */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: all 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-slide-enter-from {
  opacity: 0;
  transform: translateY(35px);
}

.hero-slide-leave-to {
  opacity: 0;
  transform: translateY(-35px);
}

.fade-sub-enter-active,
.fade-sub-leave-active {
  transition: all 0.35s ease;
}

.fade-sub-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-sub-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
