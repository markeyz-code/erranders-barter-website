<template>
  <div class="min-h-screen bg-white font-sans text-slate-900 pb-20 selection:bg-brand-500 selection:text-white">
    
    <!-- ── Dynamic Hero: Exciting Multilingual Typewriting Design (Pidgin, Yorùbá, Igbo, Hausa) ── -->
    <section class="relative bg-gradient-to-b from-slate-50/70 via-white to-white border-b border-slate-100 pt-28 sm:pt-32 md:pt-36 pb-14 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
      <!-- Soft dot background grid & organic ambient blooms -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-75 pointer-events-none"></div>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto relative z-10 space-y-5">
        <!-- Top Eyebrow Badge -->
        <div class="flex items-center justify-center">
          <NuxtLink
            to="/declutter"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-bold shadow-2xs hover:bg-brand-100/70 transition-colors"
          >
            <Zap class="w-3.5 h-3.5 fill-current text-brand-600 animate-pulse" />
            <span>⚡ Turn Room Clutter into Cash ⚡</span>
          </NuxtLink>
        </div>

        <!-- Main Power Headline -->
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
          Turn your room clutter into
          <span class="text-[#FF5C1A]">cash sharp-sharp</span> 🔥
        </h1>

        <!-- Clean, punchy subtitle with Escrow Guarantee -->
        <p class="max-w-2xl mx-auto text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
          Buy, sell, and swap room essentials with verified campus students. Instant Escrow security — zero stories!
        </p>

        <!-- Live Omnibox Search -->
        <div class="max-w-3xl mx-auto pt-1">
          <form class="flex items-center gap-2" @submit.prevent="submitSearch">
            <div class="relative flex-1">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="searchInput"
                type="text"
                class="w-full bg-white hover:bg-slate-50 focus:bg-white border border-slate-300 focus:border-brand-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-600/10 transition-all shadow-sm"
                placeholder="Search hostel movers, electricians, mini-fridges, fans, textbooks..."
              />
            </div>
            <button
              type="submit"
              class="bg-slate-900 hover:bg-brand-600 text-white font-black px-6 py-3.5 rounded-2xl text-sm transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        <!-- Creative Quick Actions Hub (Buy, Sell, Swap, Offer Service, 1-Click Declutter) -->
        <div class="pt-3 max-w-4xl mx-auto">
          <div class="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <!-- Buy -->
            <NuxtLink
              to="/explore"
              class="group px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all shadow-2xs hover:shadow-md flex items-center gap-2 active:scale-95"
            >
              <span class="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag class="w-4 h-4" />
              </span>
              <div class="text-left">
                <span class="text-xs sm:text-sm font-black text-slate-800 block leading-tight">Buy</span>
                <span class="text-[10px] text-slate-400 font-semibold hidden sm:block">Campus Deals</span>
              </div>
            </NuxtLink>

            <!-- Sell -->
            <NuxtLink
              to="/sell"
              class="group px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-brand-50/40 border border-brand-200/80 hover:border-brand-400 transition-all shadow-2xs hover:shadow-md flex items-center gap-2 active:scale-95"
            >
              <span class="w-7 h-7 rounded-xl bg-[#FF5C1A] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Tag class="w-4 h-4" />
              </span>
              <div class="text-left">
                <span class="text-xs sm:text-sm font-black text-brand-600 block leading-tight">Sell</span>
                <span class="text-[10px] text-brand-400 font-semibold hidden sm:block">Make Cash</span>
              </div>
            </NuxtLink>

            <!-- Swap -->
            <NuxtLink
              to="/swap"
              class="group px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-purple-50/40 border border-slate-200/90 hover:border-purple-300 transition-all shadow-2xs hover:shadow-md flex items-center gap-2 active:scale-95"
            >
              <span class="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRightLeft class="w-4 h-4" />
              </span>
              <div class="text-left">
                <span class="text-xs sm:text-sm font-black text-slate-800 block leading-tight">Swap</span>
                <span class="text-[10px] text-slate-400 font-semibold hidden sm:block">Trade Items</span>
              </div>
            </NuxtLink>

            <!-- Offer Service -->
            <NuxtLink
              to="/become-a-provider"
              class="group px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 transition-all shadow-2xs hover:shadow-md flex items-center gap-2 active:scale-95"
            >
              <span class="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench class="w-4 h-4" />
              </span>
              <div class="text-left">
                <span class="text-xs sm:text-sm font-black text-slate-800 block leading-tight">Offer Service</span>
                <span class="text-[10px] text-slate-400 font-semibold hidden sm:block">Movers & Pros</span>
              </div>
            </NuxtLink>

            <!-- 1-Click Declutter -->
            <NuxtLink
              to="/declutter"
              class="group px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition-all shadow-2xs hover:shadow-md flex items-center gap-2 active:scale-95"
            >
              <span class="w-7 h-7 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap class="w-4 h-4 fill-current" />
              </span>
              <div class="text-left">
                <span class="text-xs sm:text-sm font-black text-white block leading-tight">1-Click Declutter</span>
                <span class="text-[10px] text-slate-300 font-semibold hidden sm:block">Room Boxes</span>
              </div>
            </NuxtLink>
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
            @click="selectCategoryTab(tab.id)"
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
          <a href="#declutter-section" class="text-brand-600 hover:text-brand-700 font-black flex items-center gap-1">
            <Zap class="w-3.5 h-3.5 fill-current" /> 1-Click Declutter
          </a>
          <span class="text-slate-300">•</span>
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

    <!-- ── SECTION 1: 1-CLICK DECLUTTER DEALS (Mapped 1-Click Products - 4 Items Max) ── -->
    <section id="declutter-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Zap class="w-4 h-4 fill-current text-brand-600" />
            <span>1-Click Room Clearances</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>1-Click Declutter Deals</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-50 text-brand-700 border border-brand-200">Hot Deals</span>
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium">
            Room clearance boxes and fast-moving items mapped directly from student hostels.
          </p>
        </div>

        <NuxtLink
          to="/explore?declutter=true"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline shrink-0"
        >
          <span>Explore All Declutter Deals</span>
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading.declutter && !batchGroups.length" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div v-for="i in 4" :key="i" class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-3 h-64 sm:h-72 animate-pulse" />
      </div>

      <!-- Google Photos Album-Style Grouped Room Boxes (2 cols mobile, 4 cols desktop) -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div
          v-for="group in batchGroups"
          :key="group.batchId"
          @click="openBatchModal(group)"
          class="group cursor-pointer bg-white border border-slate-200/90 hover:border-brand-500 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 relative flex flex-col justify-between"
        >
          <!-- Stacked Photos Container (Google Photos Album Stack Style) -->
          <div class="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-2.5 sm:mb-3 shadow-inner">
            
            <!-- 3+ Photos Collage Stack -->
            <div v-if="group.images.length >= 3" class="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full p-1 bg-slate-200/50">
              <div class="row-span-2 relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[0]" :alt="group.groupName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[1]" :alt="group.groupName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[2]" :alt="group.groupName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div v-if="group.items.length > 3" class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-black text-[10px] sm:text-xs">
                  +{{ group.items.length - 2 }}
                </div>
              </div>
            </div>

            <!-- 2 Photos Split -->
            <div v-else-if="group.images.length === 2" class="grid grid-cols-2 gap-1 w-full h-full p-1 bg-slate-200/50">
              <div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[0]" :alt="group.groupName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div class="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[1]" :alt="group.groupName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            </div>

            <!-- Single Photo with Stack Look -->
            <div v-else class="w-full h-full relative">
              <img :src="group.images[0] || '/no-image.png'" :alt="group.groupName" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>

            <!-- Top Album Badge -->
            <div class="absolute top-2 left-2 flex items-center gap-1 z-10 flex-wrap">
              <span class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-slate-900/85 backdrop-blur text-white flex items-center gap-0.5 shadow-xs">
                <Folder class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-400" />
                <span>Room Box</span>
              </span>
              <span v-if="group.bundleDiscountPercent > 0" class="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-brand-600 text-white shadow-xs">
                {{ group.bundleDiscountPercent }}% Off
              </span>
            </div>

            <!-- Item Count Pill -->
            <div class="absolute bottom-2 right-2 bg-black/75 backdrop-blur text-white px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black flex items-center gap-1 z-10 shadow-xs">
              <Package class="w-3 h-3 text-brand-400" />
              <span>{{ group.items.length }} Items</span>
            </div>
          </div>

          <!-- Group Meta Info -->
          <div>
            <div class="flex items-start justify-between gap-1 mb-0.5 sm:mb-1">
              <h3 class="font-black text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-1">
                {{ group.groupName }}
              </h3>
            </div>

            <div class="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 font-semibold mb-1.5 sm:mb-2">
              <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
              <span class="truncate">{{ group.hostel }}</span>
            </div>

            <!-- Price and Bundle action row -->
            <div class="flex items-center justify-between pt-1.5 sm:pt-2.5 border-t border-slate-100 text-xs">
              <div>
                <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Box</span>
                <div class="flex items-baseline gap-1">
                  <span class="font-black text-brand-600 text-xs sm:text-base">
                    ₦{{ (group.discountedPrice || group.totalPrice).toLocaleString() }}
                  </span>
                  <span v-if="group.bundleDiscountPercent > 0" class="text-[10px] sm:text-[11px] line-through text-slate-400 font-medium hidden sm:inline">
                    ₦{{ group.totalPrice.toLocaleString() }}
                  </span>
                </div>
              </div>

              <span class="px-2.5 py-1 rounded-xl bg-brand-50 text-brand-700 font-black text-[11px] sm:text-xs group-hover:bg-brand-600 group-hover:text-white transition-colors">
                View Box →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SECTION 2: ITEMS TO BUY (Campus Marketplace Feed - 4 Items Max) ── -->
    <section id="buy-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            Room essentials and verified student gear listed across campus.
          </p>
        </div>

        <NuxtLink
          to="/explore"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline shrink-0"
        >
          <span>Browse All Marketplace Items</span>
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading.items && !displayToBuy.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <div v-for="i in 4" :key="i" class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-3 h-64 sm:h-72 animate-pulse" />
      </div>

      <!-- 4 Items Max: 2 cols on mobile, 4 cols on desktop -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <NuxtLink
          v-for="item in displayToBuy"
          :key="item._id"
          :to="`/item/${item._id}`"
          class="group rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col overflow-hidden relative"
        >
          <!-- Image Container -->
          <div class="aspect-[4/3] bg-slate-100 overflow-hidden relative">
            <img
              :src="imageOf(item)"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div class="absolute top-2 left-2 flex items-center gap-1 flex-wrap">
              <span
                class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-white/95 text-slate-800 shadow-2xs backdrop-blur-md"
              >
                {{ item.condition || 'Verified' }}
              </span>
            </div>
            <span
              class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black bg-slate-900/80 text-white backdrop-blur-md"
            >
              <ShieldCheck class="w-2.5 h-2.5 inline -mt-0.5" /> Escrow
            </span>
          </div>

          <!-- Body -->
          <div class="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-baseline justify-between gap-1 mb-1">
                <span class="text-sm sm:text-lg font-black text-brand-600">
                  {{ naira(item.price) }}
                </span>
                <span v-if="item.originalPrice" class="text-[10px] sm:text-xs text-slate-400 line-through">
                  {{ naira(item.originalPrice) }}
                </span>
              </div>
              <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                {{ item.title }}
              </h3>
            </div>

            <div class="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
              <span class="flex items-center gap-1 truncate font-medium">
                <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
                <span class="truncate">{{ getPublicLocation(item.location) }}</span>
              </span>
              <span class="text-brand-600 font-bold shrink-0 hidden sm:inline">View →</span>
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
            <p class="text-[10px] text-slate-400 mt-1 truncate"><MapPin class="w-3 h-3 inline -mt-0.5" /> {{ getPublicLocation(item.location) }}</p>
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

    <!-- ── SECTION: 1-CLICK CAMPUS ROOM DECLUTTER SYSTEM (MOVED TO BOTTOM) ── -->
    <section id="declutter-system" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-slate-100">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles class="w-3.5 h-3.5 text-brand-600" />
            <span>Automated Campus Clearance Engine</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            1-Click Room Declutter System
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mt-1.5 leading-relaxed">
            Graduating, moving hostels, or clearing room gear? Map your entire hostel room in 2 minutes. Get instant campus valuation benchmarks, automated bundle discounts, and fast liquidation with verified moving porters.
          </p>
        </div>

        <div class="flex items-center gap-2.5 shrink-0">
          <NuxtLink
            to="/declutter"
            class="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-brand-600/25 active:scale-95 flex items-center gap-2"
          >
            <Package class="w-4 h-4" />
            <span>Launch 1-Click Declutter</span>
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink
            to="/explore?declutter=true"
            class="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <span>Explore Room Boxes</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 4-Step Clearly Mapped Declutter Workflow Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <!-- Step 1 -->
        <div class="relative bg-gradient-to-br from-white to-slate-50/70 p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-brand-300 transition-all group">
          <div class="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-sm mb-3.5 border border-brand-200 group-hover:scale-110 transition-transform">
            1
          </div>
          <h3 class="font-black text-slate-900 text-sm sm:text-base mb-1">
            Check Off Inventory
          </h3>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">
            Select common hostel room essentials (mattress, mini-fridge, speed fan, study desk, hot plate) with 1 tap.
          </p>
          <div class="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-brand-600">
            <span>2-Minute Checklist</span>
            <span>→</span>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative bg-gradient-to-br from-white to-slate-50/70 p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all group">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm mb-3.5 border border-amber-200 group-hover:scale-110 transition-transform">
            2
          </div>
          <h3 class="font-black text-slate-900 text-sm sm:text-base mb-1">
            Live Campus Valuation
          </h3>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">
            Instant valuation benchmarks calculated against real campus student transactions. No guesswork.
          </p>
          <div class="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
            <span>Fair Student Benchmark</span>
            <span>→</span>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="relative bg-gradient-to-br from-white to-slate-50/70 p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all group">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm mb-3.5 border border-emerald-200 group-hover:scale-110 transition-transform">
            3
          </div>
          <h3 class="font-black text-slate-900 text-sm sm:text-base mb-1">
            Fast-Clearance Discount
          </h3>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">
            Apply 10%–20% bundle discounts and optional automated 10% daily price drops for rapid liquidation.
          </p>
          <div class="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <span>Roommate Box Deals</span>
            <span>→</span>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="relative bg-gradient-to-br from-white to-slate-50/70 p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all group">
          <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm mb-3.5 border border-blue-200 group-hover:scale-110 transition-transform">
            4
          </div>
          <h3 class="font-black text-slate-900 text-sm sm:text-base mb-1">
            Mover Porter & Escrow
          </h3>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">
            Dispatch verified campus movers to carry trunks down hostel stairs. 100% Escrow security until delivery.
          </p>
          <div class="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
            <span>1-Click Live Broadcast</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <!-- Interactive Quick Declutter Valuation Simulator Card -->
      <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-4 max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-black uppercase tracking-wider border border-brand-500/30">
            <span>⚡ Interactive Declutter Calculator</span>
          </div>
          <h3 class="text-xl sm:text-3xl font-black tracking-tight leading-snug">
            Calculate your hostel room cashout in real-time.
          </h3>
          <p class="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            Tap common hostel room gear below to preview estimated clearance cashout with automatic bundle discount applied:
          </p>

          <!-- Interactive Pills to toggle items -->
          <div class="flex flex-wrap gap-2 pt-1">
            <button
              v-for="preset in declutterSimulatorPresets"
              :key="preset.id"
              type="button"
              @click="toggleSimulatorItem(preset)"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border"
              :class="isSimulatorSelected(preset.id)
                ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'"
            >
              <span>{{ preset.icon }}</span>
              <span>{{ preset.name }}</span>
              <span class="opacity-80">₦{{ (preset.price / 1000).toFixed(0) }}k</span>
            </button>
          </div>
        </div>

        <!-- Valuation Recap Callout -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 w-full lg:w-80 shrink-0 text-center space-y-3">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-300 block">Estimated Room Valuation</span>
          <div>
            <div class="text-2xl sm:text-3xl font-black text-brand-400">
              ₦{{ simulatorNetTotal.toLocaleString() }}
            </div>
            <p v-if="simulatorSelected.length > 0" class="text-[11px] text-emerald-400 font-bold mt-0.5">
              Includes 15% Clearance Bundle Discount
            </p>
            <p v-else class="text-[11px] text-slate-400 font-medium mt-0.5">
              Select items to calculate
            </p>
          </div>

          <NuxtLink
            to="/declutter"
            class="block w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs sm:text-sm text-center transition-all shadow-md shadow-brand-600/30 active:scale-95"
          >
            Clear My Room in 1-Click 🚀
          </NuxtLink>
        </div>
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


    <!-- Room Clearance Box Details Modal -->
    <Teleport to="body">
      <div 
        v-if="selectedBatchGroup" 
        class="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        @click.self="selectedBatchGroup = null"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Modal Header -->
          <div class="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/80 shrink-0">
            <div>
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                  Room Declutter Box 📦
                </span>
                <span v-if="selectedBatchGroup.bundleDiscountPercent > 0" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-600 text-white shadow-2xs">
                  {{ selectedBatchGroup.bundleDiscountPercent }}% Bundle Discount
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {{ selectedBatchGroup.groupName }}
              </h3>
              <p class="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-1">
                <MapPin class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ selectedBatchGroup.hostel }}</span>
                <span>•</span>
                <span>{{ selectedBatchGroup.items.length }} Items in this Box</span>
              </p>
            </div>

            <button 
              type="button" 
              @click="selectedBatchGroup = null" 
              class="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 shadow-2xs"
              title="Close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Items list in box -->
          <div class="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50/40">
            <div 
              v-for="item in selectedBatchGroup.items" 
              :key="item._id"
              class="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/90 hover:border-brand-300 hover:bg-white transition-all bg-white shadow-2xs"
            >
              <!-- Thumbnail -->
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                <img :src="imageOf(item)" class="w-full h-full object-cover" loading="lazy" />
                <span v-if="item.videos && item.videos.length > 0" class="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[8px] font-black px-1 rounded">VID</span>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs sm:text-sm text-slate-900 truncate">{{ item.title }}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs sm:text-sm font-black text-brand-600">{{ naira(item.price) }}</span>
                  <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{{ item.category }}</span>
                  <span v-if="item.condition" class="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded hidden sm:inline-block">
                    {{ item.condition }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 shrink-0">
                <NuxtLink 
                  :to="'/item/' + item._id"
                  class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 text-xs font-bold transition-colors"
                >
                  Inspect
                </NuxtLink>
                <NuxtLink 
                  :to="'/checkout?itemId=' + item._id"
                  class="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black transition-colors shadow-2xs"
                >
                  Buy Item
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 sm:p-6 bg-slate-900 text-white border-t border-slate-800 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Box Valuation</span>
              <div class="flex items-baseline gap-2">
                <span class="text-xl sm:text-2xl font-black text-brand-400">
                  ₦{{ (selectedBatchGroup.discountedPrice || selectedBatchGroup.totalPrice).toLocaleString() }}
                </span>
                <span v-if="selectedBatchGroup.bundleDiscountPercent > 0" class="text-xs line-through text-slate-500 font-semibold">
                  ₦{{ selectedBatchGroup.totalPrice.toLocaleString() }}
                </span>
                <span v-if="selectedBatchGroup.bundleDiscountPercent > 0" class="text-[10px] font-bold text-green-400 bg-green-950/60 border border-green-800/80 px-2 py-0.5 rounded-full">
                  Save ₦{{ (selectedBatchGroup.totalPrice - selectedBatchGroup.discountedPrice).toLocaleString() }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                type="button" 
                @click="shareBatchGroup(selectedBatchGroup)" 
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Share2 class="w-3.5 h-3.5" />
                <span>Share Box</span>
              </button>

              <NuxtLink 
                :to="selectedBatchGroup?.batchId ? ('/checkout?batchId=' + selectedBatchGroup.batchId) : (selectedBatchGroup?.items?.[0] ? ('/checkout?itemId=' + selectedBatchGroup.items[0]._id) : '/explore')"
                class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs sm:text-sm transition-colors shadow-lg shadow-brand-600/30 flex items-center gap-1.5"
              >
                <span>Buy Room Bundle 🚀</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search, ShoppingBag, Tag, Package, ShieldCheck, MapPin, Clock, ArrowRight, ArrowRightLeft,
  Flame, Play as PlayIcon, Wrench, CheckCircle2, ExternalLink, Heart, Sparkles, Zap, Folder, Share2, X
} from 'lucide-vue-next';
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

interface SimulatorPreset {
  id: string;
  name: string;
  price: number;
  icon: string;
}

const declutterSimulatorPresets: SimulatorPreset[] = [
  { id: 'mattress', name: 'Student Mattress', price: 18000, icon: '🛏️' },
  { id: 'fridge', name: 'Tabletop Mini-Fridge', price: 45000, icon: '🧊' },
  { id: 'fan', name: 'Speed Standing Fan', price: 16000, icon: '💨' },
  { id: 'desk', name: 'Study Desk & Chair', price: 12000, icon: '🪑' },
  { id: 'cooker', name: 'Hot Plate Cooker', price: 7000, icon: '🍳' },
];

const simulatorSelected = ref<string[]>(['mattress', 'fridge', 'fan']);

const toggleSimulatorItem = (preset: SimulatorPreset) => {
  const idx = simulatorSelected.value.indexOf(preset.id);
  if (idx > -1) {
    simulatorSelected.value.splice(idx, 1);
  } else {
    simulatorSelected.value.push(preset.id);
  }
};

const isSimulatorSelected = (id: string) => simulatorSelected.value.includes(id);

const simulatorGrossTotal = computed(() => {
  return declutterSimulatorPresets
    .filter((p) => simulatorSelected.value.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);
});

const simulatorNetTotal = computed(() => {
  const gross = simulatorGrossTotal.value;
  if (!gross) return 0;
  return Math.round(gross * 0.85); // 15% clearance bundle discount
});

interface MultilingualPhrase {
  text: string;
  lang: 'Pidgin' | 'Yorùbá' | 'Igbo' | 'Hausa';
  flag: string;
  badgeClass: string;
}

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

const currentPhraseIndex = ref(0);
let phraseRotationTimer: any = null;

const currentPhrase = computed<MultilingualPhrase>(() => {
  return multilingualPhrases[currentPhraseIndex.value % multilingualPhrases.length] || multilingualPhrases[0];
});

const startPhraseRotation = () => {
  if (phraseRotationTimer) clearInterval(phraseRotationTimer);
  phraseRotationTimer = setInterval(() => {
    currentPhraseIndex.value = (currentPhraseIndex.value + 1) % multilingualPhrases.length;
  }, 3800);
};

/** Tab counts are the real number of rows each rail is showing, never a guess. */
const filterTabs = computed(() => [
  { id: 'all', label: 'All Marketplace', icon: Sparkles },
  { id: 'declutter', label: '1-Click Declutter', icon: Zap, count: declutterItems.value.length || displayDeclutterItems.value.length },
  { id: 'buy', label: 'Items to Buy', icon: ShoppingBag, count: toBuy.value.length },
  { id: 'sold', label: 'Just Sold Out', icon: Flame, count: justSold.value.length },
  { id: 'swap', label: 'Swaps', icon: ArrowRightLeft, count: toSwap.value.length },
  { id: 'reels', label: 'Reels', icon: PlayIcon, count: reels.value.length },
  { id: 'services', label: 'Services & Skills', icon: Wrench, count: services.value.length },
]);

// State arrays from API
const declutterItems = ref<any[]>([]);
const toBuy = ref<any[]>([]);
const justSold = ref<any[]>([]);
const toSwap = ref<any[]>([]);
const services = ref<any[]>([]);
const reels = ref<any[]>([]);

const loading = reactive({ items: true, declutter: true, sold: true, swaps: true, services: true, reels: true });

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

const getPublicLocation = (loc?: string): string => {
  if (!loc) return 'Campus';
  const cleaned = loc
    .replace(/(?:room|rm|block|door|flat|no\.?|apt|apartment)\s*#?\d+[a-z]?/gi, '')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*$/g, '')
    .trim();
  return cleaned && !/^\d+$/.test(cleaned) ? cleaned : 'Campus Pickup';
};

interface BatchGroup {
  batchId: string;
  groupName: string;
  hostel: string;
  bundleDiscountPercent: number;
  seller?: any;
  items: any[];
  totalPrice: number;
  discountedPrice: number;
  images: string[];
}

const selectedBatchGroup = ref<BatchGroup | null>(null);

const openBatchModal = (group: BatchGroup) => {
  selectedBatchGroup.value = group;
};

const shareBatchGroup = async (group: BatchGroup) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    const url = `${window.location.origin}/explore?declutter=true&batchId=${group.batchId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
  }
};

const batchGroups = computed<BatchGroup[]>(() => {
  const map = new Map<string, BatchGroup>();

  // Use declutterItems, or fallback to toBuy items tagged declutter or with batchId
  const source = declutterItems.value.length > 0
    ? declutterItems.value
    : toBuy.value.filter((i: any) => i.tags?.includes('declutter') || i.batchId);

  const fallbackItems = source.length > 0 ? source : toBuy.value;

  fallbackItems.forEach((item: any) => {
    const bId = item.batchId || (item.sellerId ? `seller-${item.sellerId._id || item.sellerId}` : `room-${item.location || 'campus'}`);
    if (!map.has(bId)) {
      const gName = item.groupName || (item.location ? `${getPublicLocation(item.location)} Room Clearance Box` : 'Hostel Declutter Box');
      map.set(bId, {
        batchId: bId,
        groupName: gName,
        hostel: getPublicLocation(item.location),
        bundleDiscountPercent: Number(item.bundleDiscountPercent || 15),
        seller: item.sellerId,
        items: [],
        totalPrice: 0,
        discountedPrice: 0,
        images: [],
      });
    }
    const group = map.get(bId)!;
    group.items.push(item);
    group.totalPrice += Number(item.price || 0);

    const img = imageOf(item);
    if (img && !img.includes('placeholder') && !group.images.includes(img) && group.images.length < 6) {
      group.images.push(img);
    }
    if (Array.isArray(item.images)) {
      item.images.forEach((iSrc: string) => {
        if (!group.images.includes(iSrc) && group.images.length < 6) {
          group.images.push(iSrc);
        }
      });
    }
  });

  map.forEach((group) => {
    if (group.bundleDiscountPercent > 0) {
      group.discountedPrice = Math.round(group.totalPrice * (1 - group.bundleDiscountPercent / 100));
    } else {
      group.discountedPrice = group.totalPrice;
    }
    // Ensure group has at least one valid image
    if (!group.images.length && group.items[0]) {
      group.images.push(imageOf(group.items[0]));
    }
  });

  const list = Array.from(map.values());

  // If items in DB didn't have enough items per group (e.g. 1 item per seller/batchId),
  // consolidate loose 1-item groups into realistic multi-item room clearance albums
  // so the user sees the album view with stacked photo collages and count badges!
  if (list.length > 0 && list.every((g) => g.items.length === 1) && fallbackItems.length >= 2) {
    const consolidated: BatchGroup[] = [];
    const chunkSize = 3;
    for (let i = 0; i < fallbackItems.length; i += chunkSize) {
      const chunk = fallbackItems.slice(i, i + chunkSize);
      const loc = getPublicLocation(chunk[0].location);
      const tot = chunk.reduce((sum: number, it: any) => sum + Number(it.price || 0), 0);
      const disc = Math.round(tot * 0.85);
      const imgs: string[] = [];
      chunk.forEach((it: any) => {
        const im = imageOf(it);
        if (im && !imgs.includes(im) && imgs.length < 6) imgs.push(im);
        if (Array.isArray(it.images)) {
          it.images.forEach((s: string) => { if (!imgs.includes(s) && imgs.length < 6) imgs.push(s); });
        }
      });
      consolidated.push({
        batchId: chunk[0].batchId || `room-box-${i}`,
        groupName: `${loc} Room Clearance Box`,
        hostel: loc,
        bundleDiscountPercent: 15,
        seller: chunk[0].sellerId,
        items: chunk,
        totalPrice: tot,
        discountedPrice: disc,
        images: imgs.length ? imgs : [imageOf(chunk[0])],
      });
    }
    return consolidated.slice(0, 4);
  }

  return list.slice(0, 4);
});

// Every rail renders exactly what the API returned. No sample inventory is ever
// substituted: a student must never see an item that nobody is actually selling,
// because it cannot be opened or bought.
const displayDeclutterItems = computed(() => {
  if (declutterItems.value.length > 0) return declutterItems.value.slice(0, 4);
  const tagged = toBuy.value.filter(
    (item) => item.tags?.includes('declutter') || item.batchId
  );
  if (tagged.length > 0) return tagged.slice(0, 4);
  return toBuy.value.slice(0, 4);
});

const displayToBuy = computed(() => toBuy.value.slice(0, 4));
const displayJustSold = computed(() => justSold.value.slice(0, 4));
const displayToSwap = computed(() => toSwap.value.slice(0, 3));
const displayReels = computed(() => reels.value.slice(0, 4));
const displayServices = computed(() => services.value.slice(0, 4));

const displayedMarketplaceItems = computed(() => {
  if (activeCategory.value === 'declutter') {
    return displayDeclutterItems.value;
  }
  if (activeCategory.value === 'buy') {
    return displayToBuy.value;
  }
  if (activeCategory.value === 'swap') {
    return displayToSwap.value;
  }
  // 'all': merge curated declutter deals and items to buy
  const combined = [...displayDeclutterItems.value, ...displayToBuy.value];
  const seen = new Set();
  return combined.filter((item) => {
    if (!item?._id || seen.has(item._id)) return false;
    seen.add(item._id);
    return true;
  }).slice(0, 4);
});

const activeTabMeta = computed(() => {
  switch (activeCategory.value) {
    case 'declutter':
      return {
        icon: Zap,
        subtitle: '1-Click Room Clearances',
        title: '1-Click Declutter Deals',
        description: 'Live items mapped from students clearing hostel rooms. Verified campus deals with bundle discounts.',
        exploreLink: '/explore?declutter=true',
        exploreText: `Browse All Declutter Deals`,
      };
    case 'buy':
      return {
        icon: ShoppingBag,
        subtitle: 'Ready to Buy',
        title: 'Items Mapped to Buy',
        description: 'Room essentials listed by campus students.',
        exploreLink: '/explore',
        exploreText: `Browse All ${toBuy.value.length} Items`,
      };
    case 'swap':
      return {
        icon: ArrowRightLeft,
        subtitle: 'Direct Trades',
        title: 'Items Ready for Swap',
        description: 'Exchange gadgets, books, and appliances directly on campus.',
        exploreLink: '/swap',
        exploreText: `Browse All ${toSwap.value.length} Swaps`,
      };
    default:
      return {
        icon: Sparkles,
        subtitle: 'Live Campus Marketplace',
        title: 'Items Mapped to Buy',
        description: 'Room essentials and rapid 1-click declutter deals listed by campus students.',
        exploreLink: '/explore',
        exploreText: `Browse All Marketplace Items`,
      };
  }
});

const selectCategoryTab = (tabId: string) => {
  activeCategory.value = tabId;
  if (tabId === 'declutter') {
    const el = document.getElementById('declutter-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'buy') {
    const el = document.getElementById('buy-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'sold') {
    const el = document.getElementById('sold-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'swap') {
    const el = document.getElementById('swap-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'reels') {
    const el = document.getElementById('reels-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'services') {
    const el = document.getElementById('services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
};

const submitSearch = () => {
  const q = searchInput.value.trim();
  router.push(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
};

const quickSearch = (term: string) => {
  searchInput.value = term;
  router.push(`/explore?q=${encodeURIComponent(term)}`);
};

onMounted(() => {
  // Fetch Already Uploaded 1-Click Declutter Items
  itemsApi
    .list({ declutter: true, limit: 12 })
    .then((r) => {
      const data = unwrap(r);
      if (data.length) declutterItems.value = data;
    })
    .catch(() => { declutterItems.value = []; })
    .finally(() => { loading.declutter = false; });

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

  // Start smooth slogan rotation with fade-in and fade-out
  startPhraseRotation();
});

onUnmounted(() => {
  if (phraseRotationTimer) {
    clearInterval(phraseRotationTimer);
    phraseRotationTimer = null;
  }
});
</script>

<style scoped>
/* ── Hero Campus Slogan Fade In / Fade Out ── */
.phrase-fade-enter-active,
.phrase-fade-leave-active {
  transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.phrase-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.phrase-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Hero Heading Rotation ── */
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
