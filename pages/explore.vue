<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header Title Section -->
      <div class="mb-5 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {{ searchQuery ? 'Search Results' : 'Explore Campus Marketplace' }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {{ searchQuery ? `Found listings matching "${searchQuery}"` : 'Discover pre-loved student gear, room declutter batches, and verified campus services.' }}
            </p>
          </div>

          <!-- Active Filter Counter & Quick Reset (Header) -->
          <div v-if="activeFilterCount > 0" class="flex items-center gap-2 self-start sm:self-auto">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-brand-50 text-brand-700 border border-brand-200">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span>
              {{ activeFilterCount }} {{ activeFilterCount === 1 ? 'filter' : 'filters' }} active
            </span>
            <button
              type="button"
              @click="clearAllFilters"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-slate-600 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 transition-colors border border-slate-200/80 shadow-2xs"
            >
              <RotateCcw class="w-3 h-3" />
              <span>Reset all</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="mb-6 space-y-3 relative z-30">
        
        <!-- Row 1: Search Form + Mobile Filter Drawer Trigger -->
        <div class="flex items-center gap-2">
          <!-- Search Form (Takes remaining space) -->
          <form @submit.prevent="executeSearch" class="flex items-center gap-2 flex-1 min-w-0">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="localSearchQuery"
                type="text"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all shadow-2xs"
                placeholder="Search items, textbooks, appliances, hostels..."
              />
              <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                v-if="localSearchQuery"
                type="button"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                title="Clear search"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="submit"
              class="bg-brand-600 hover:bg-brand-500 active:scale-95 text-white px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-sm shadow-brand-600/20 shrink-0"
            >
              Search
            </button>
          </form>

          <!-- Mobile "Filters" Drawer Button (Visible on screens < md) -->
          <button
            type="button"
            @click="isFilterDrawerOpen = true"
            class="md:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border font-bold text-xs bg-slate-50 border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-600 hover:bg-white transition-all shadow-2xs shrink-0"
          >
            <SlidersHorizontal class="w-4 h-4 text-brand-600 shrink-0" />
            <span>Filters</span>
            <span
              v-if="activeFilterCount > 0"
              class="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-black shrink-0"
            >
              {{ activeFilterCount }}
            </span>
          </button>
        </div>

        <!-- Row 2: Top-Level Type Tabs (Touch-scrollable on mobile) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            @click="setQuickType('')"
            class="px-3.5 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            :class="[
              !selectedType && !route.query.declutter
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs scale-[1.02]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
          >
            <span>All Listings</span>
            <span class="text-[10px] opacity-75">({{ items.length }})</span>
          </button>

          <button
            type="button"
            @click="setQuickDeclutter"
            class="px-3.5 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            :class="[
              route.query.declutter
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-600/20 scale-[1.02]'
                : 'bg-brand-50/80 text-brand-700 border-brand-200/80 hover:bg-brand-100/60'
            ]"
          >
            <Sparkles class="w-3 h-3 text-brand-600" :class="route.query.declutter ? 'text-white' : 'text-brand-600'" />
            <span>Room Declutter</span>
            <span class="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full" :class="route.query.declutter ? 'bg-white text-brand-600' : 'bg-brand-600 text-white'">
              Hot
            </span>
          </button>

          <button
            type="button"
            @click="setQuickType('sell')"
            class="px-3.5 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            :class="[
              selectedType === 'sell' && !route.query.declutter
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs scale-[1.02]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
          >
            <span>🛍️ Buy & Sell</span>
          </button>

          <button
            type="button"
            @click="setQuickType('swap')"
            class="px-3.5 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            :class="[
              selectedType === 'swap' && !route.query.declutter
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs scale-[1.02]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
          >
            <span>🔄 Swaps</span>
          </button>

          <NuxtLink
            to="/services"
            class="px-3.5 py-1.5 rounded-full border transition-all shrink-0 flex items-center gap-1.5 bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <span>🛠️ Campus Services</span>
          </NuxtLink>
        </div>

        <!-- Row 3: Dropdowns Bar (Aggressively Responsive) -->
        <div>
          <!-- Mobile Screen Dropdowns: 2-Column Grid (Category + Sort) -->
          <div class="grid grid-cols-2 gap-2 md:hidden">
            <div class="min-w-0">
              <CustomSelect
                v-model="selectedCategory"
                :options="categoryOptions"
                placeholder="All Categories"
                variant="filter"
                :icon="Folder"
                align="left"
              />
            </div>
            <div class="min-w-0">
              <CustomSelect
                v-model="selectedSort"
                :options="sortOptions"
                placeholder="Sort By"
                variant="filter"
                :icon="ArrowUpDown"
                align="right"
              />
            </div>
          </div>

          <!-- Desktop / Tablet Dropdowns: Horizontal Row with Category, Hostel, Budget & Sort -->
          <div class="hidden md:flex items-center gap-2.5 flex-wrap">
            <div class="w-48">
              <CustomSelect
                v-model="selectedCategory"
                :options="categoryOptions"
                placeholder="All Categories"
                variant="filter"
                :icon="Folder"
                align="left"
              />
            </div>

            <div class="w-44">
              <CustomSelect
                v-model="selectedLocation"
                :options="locationOptions"
                placeholder="All Hostels"
                variant="filter"
                :icon="MapPin"
                align="left"
              />
            </div>

            <div class="w-40">
              <CustomSelect
                v-model="selectedBudget"
                :options="budgetOptions"
                placeholder="Any Budget"
                variant="filter"
                :icon="Wallet"
                align="left"
              />
            </div>

            <div class="w-44 ml-auto">
              <CustomSelect
                v-model="selectedSort"
                :options="sortOptions"
                placeholder="Sort By"
                variant="filter"
                :icon="ArrowUpDown"
                align="right"
              />
            </div>

            <!-- Desktop Reset Filters -->
            <button
              v-if="activeFilterCount > 0"
              type="button"
              @click="clearAllFilters"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200/90 transition-colors shadow-2xs"
              title="Reset all filters"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- Row 4: Active Filter Chips Bar (Tap X to dismiss individual filters) -->
        <div v-if="activeFilterCount > 0" class="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span class="text-slate-400 font-semibold text-[11px] mr-1">Active filters:</span>

          <span
            v-if="searchQuery"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200"
          >
            <span>Search: "{{ searchQuery }}"</span>
            <button @click="clearSearch" class="hover:text-red-600 p-0.5 rounded-full"><X class="w-3 h-3" /></button>
          </span>

          <span
            v-if="route.query.declutter"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 font-bold border border-brand-200"
          >
            <Sparkles class="w-3 h-3 text-brand-600" />
            <span>Room Declutter</span>
            <button @click="setQuickDeclutter" class="hover:text-red-600 p-0.5 rounded-full"><X class="w-3 h-3" /></button>
          </span>

          <span
            v-if="selectedType && !route.query.declutter"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200"
          >
            <span>Type: {{ selectedType === 'sell' ? 'Buy/Sell' : 'Swap' }}</span>
            <button @click="selectedType = ''" class="hover:text-red-600 p-0.5 rounded-full"><X class="w-3 h-3" /></button>
          </span>

          <span
            v-if="selectedCategory"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200"
          >
            <span>Category: {{ selectedCategory }}</span>
            <button @click="selectedCategory = ''" class="hover:text-red-600 p-0.5 rounded-full"><X class="w-3 h-3" /></button>
          </span>

          <span
            v-if="selectedLocation"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200"
          >
            <span>Hostel: {{ selectedLocation }}</span>
            <button @click="selectedLocation = ''" class="hover:text-red-600 p-0.5 rounded-full"><X class="w-3 h-3" /></button>
          </span>

          <span
            v-if="selectedBudget"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200"
          >
            <span>Max: ₦{{ Number(selectedBudget).toLocaleString() }}</span>
            <button @click="selectedBudget = ''" class="hover:text-red-600 p-0.5 rounded-full"><X class="w-3 h-3" /></button>
          </span>

          <span
            v-if="selectedSort && selectedSort !== 'newest'"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200"
          >
            <span>Sort: {{ selectedSort === 'price_asc' ? 'Low to High' : 'High to Low' }}</span>
            <button @click="selectedSort = 'newest'" class="hover:text-red-600 p-0.5 rounded-full"><X class="w-3 h-3" /></button>
          </span>

          <button
            @click="clearAllFilters"
            class="text-[11px] font-black text-brand-600 hover:text-brand-700 underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      </div>

      <!-- Declutter Notice Banner -->
      <div v-if="route.query.declutter" class="mb-5 p-3.5 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-between text-xs text-brand-900 font-bold">
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-brand-600 shrink-0" />
          <span>Showing Campus Hostel Room Declutter & Rapid-Clearance Listings</span>
        </div>
        <NuxtLink to="/explore" class="underline text-brand-700 hover:text-brand-950 font-black">
          View All Items
        </NuxtLink>
      </div>

      <!-- Google Photos Style Declutter Albums Section -->
      <div v-if="declutterBatches.length > 0" class="mb-8 p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Hostel Room Declutter Sales 📦</span>
              <span class="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-black border border-brand-200">
                {{ declutterBatches.length }} Room Group{{ declutterBatches.length === 1 ? '' : 's' }}
              </span>
            </h2>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Organized like Google Photos albums. Click any room sale card to open and inspect the full declutter box!
            </p>
          </div>
        </div>

        <!-- Google Photos 3-Image Collage Mosaic Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div
            v-for="batch in declutterBatches"
            :key="batch.batchId"
            @click="openBatchBox(batch)"
            class="group bg-white rounded-3xl border border-slate-200/90 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 p-3 sm:p-3.5 cursor-pointer flex flex-col justify-between"
          >
            <!-- 3-Image Mosaic Card -->
            <div class="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 grid grid-cols-12 gap-1 relative shadow-inner">
              <!-- Main Cover Photo (Left 7 cols) -->
              <div class="col-span-7 h-full overflow-hidden relative bg-slate-900">
                <img
                  :src="batch.images[0] || '/no-image.png'"
                  :alt="batch.batchTitle"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <!-- Stacked Sub-Photos (Right 5 cols) -->
              <div class="col-span-5 h-full flex flex-col gap-1">
                <div class="h-1/2 overflow-hidden relative bg-slate-800">
                  <img
                    :src="batch.images[1] || batch.images[0] || '/no-image.png'"
                    :alt="batch.batchTitle"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div class="h-1/2 overflow-hidden relative bg-slate-800 flex items-center justify-center">
                  <img
                    :src="batch.images[2] || batch.images[0] || '/no-image.png'"
                    :alt="batch.batchTitle"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <!-- More count badge overlay -->
                  <div
                    v-if="batch.items.length > 3"
                    class="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-black text-xs"
                  >
                    +{{ batch.items.length - 2 }} more
                  </div>
                </div>
              </div>

              <!-- Top Left Item Count Badge -->
              <div class="absolute top-2.5 left-2.5">
                <span class="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Package class="w-3 h-3 text-brand-400" />
                  <span>{{ batch.items.length }} Items</span>
                </span>
              </div>

              <!-- Bundle Discount Badge -->
              <div v-if="batch.bundleDiscountPercent > 0" class="absolute top-2.5 right-2.5">
                <span class="px-2.5 py-1 rounded-full bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Save {{ batch.bundleDiscountPercent }}%
                </span>
              </div>
            </div>

            <!-- Card Bottom Meta -->
            <div class="mt-3 space-y-2">
              <div class="min-w-0">
                <h3 class="font-black text-slate-900 text-sm sm:text-base group-hover:text-brand-600 transition-colors truncate">
                  {{ batch.batchTitle }}
                </h3>
                <p class="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin class="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span>{{ batch.hostel }}</span>
                  <span class="text-slate-300">•</span>
                  <span class="text-slate-600">Seller: {{ batch.seller?.firstName || 'Student' }}</span>
                </p>
              </div>

              <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span class="text-slate-400 font-bold uppercase text-[9px] block">Total Valuation</span>
                  <span class="font-black text-slate-900 text-sm">₦{{ batch.totalValuation.toLocaleString() }}</span>
                </div>

                <div v-if="batch.bundleDiscountPercent > 0" class="text-right">
                  <span class="text-brand-600 font-bold uppercase text-[9px] block">Full Bundle</span>
                  <span class="font-black text-brand-600 text-sm">₦{{ batch.discountedTotal.toLocaleString() }}</span>
                </div>
              </div>

              <div class="w-full py-2 rounded-xl bg-slate-50 group-hover:bg-brand-50 text-slate-700 group-hover:text-brand-700 text-xs font-black transition-colors flex items-center justify-center gap-1.5 border border-slate-100 group-hover:border-brand-200">
                <span>Open Declutter Box 📦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-500 font-bold">Loading marketplace listings...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-20 text-center border border-red-200 bg-red-50 rounded-3xl px-4">
        <h2 class="text-2xl font-bold text-red-700 mb-2">Could not load listings</h2>
        <p class="text-red-600 font-medium mb-5">{{ error }}</p>
        <button @click="fetchItems" class="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors">
          Try again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredItems.length === 0" class="py-20 text-center border border-slate-200 border-dashed rounded-3xl px-4">
        <h2 class="text-2xl font-bold text-slate-600 mb-2">
          {{ searchQuery ? `No items found matching "${searchQuery}"` : 'No listings matching your filters' }}
        </h2>
        <p class="text-slate-500 font-medium mb-5 text-sm">
          {{ activeFilterCount > 0 ? 'Try clearing some filters or searching for something else.' : 'Be the first to list student items or bookable services.' }}
        </p>
        <div class="flex items-center justify-center gap-3">
          <button v-if="activeFilterCount > 0" @click="clearAllFilters" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors text-xs">
            Clear all filters
          </button>
          <NuxtLink to="/sell" class="bg-brand-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-brand-500 transition-colors text-xs shadow-md shadow-brand-600/20">
            List an item
          </NuxtLink>
        </div>
      </div>

      <!-- Listings Grid (2 cols mobile, 3 tablet, 4 desktop) -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <NuxtLink 
          v-for="item in filteredItems" 
          :key="item._id" 
          :to="'/item/' + item._id" 
          class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-500 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
        >
          <!-- Image Section with Auto-Carousel -->
          <div class="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative" style="container-type: inline-size;">
            <!-- Single image -->
            <img 
              v-if="!item.images || item.images.length <= 1" 
              :src="item.images?.[0] || '/no-image.png'" 
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <!-- Multi-image auto-scrolling carousel -->
            <div 
              v-else 
              class="item-carousel w-full h-full"
            >
              <div 
                class="item-carousel-track flex h-full w-max" 
                :style="{ 
                  animation: `scroll-carousel ${item.images.length * 3}s linear infinite`
                }"
              >
                <div 
                  v-for="(img, idx) in [...item.images, ...item.images]" 
                  :key="idx" 
                  class="h-full flex-shrink-0 w-[100cqw]"
                >
                  <img :src="img" :alt="`${item.title} - ${idx + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>
              <!-- Dot indicators -->
              <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                <span 
                  v-for="(_, idx) in item.images" 
                  :key="idx" 
                  class="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm"
                ></span>
              </div>
            </div>

            <!-- Sold Out Overlay -->
            <div 
              v-if="item.status === 'sold'" 
              class="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center z-20"
            >
              <span class="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black tracking-wider uppercase shadow-md border border-red-400/40">
                Sold Out ❌
              </span>
            </div>

            <!-- Type & Status badge -->
            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 flex-wrap">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-black border"
                :class="item.type === 'swap' 
                  ? 'bg-amber-50/90 backdrop-blur text-amber-700 border-amber-200' 
                  : 'bg-white/95 backdrop-blur text-slate-800 border-slate-200 shadow-2xs'"
              >
                {{ item.type }}
              </span>

              <span
                v-if="item.status === 'pending'"
                class="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-black bg-amber-500 text-white shadow-sm"
              >
                In Escrow 🔒
              </span>

              <span
                v-else-if="item.batchId"
                class="px-2 py-0.5 rounded-full text-[9px] font-black bg-brand-600 text-white shadow-sm flex items-center gap-0.5"
              >
                <Sparkles class="w-2.5 h-2.5" /> Declutter
              </span>
            </div>

            <!-- Image count badge for multi-image -->
            <div 
              v-if="item.images && item.images.length > 1" 
              class="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 z-10"
            >
              <ImageIcon class="w-3 h-3" />
              {{ item.images.length }}
            </div>
          </div>

          <!-- Content Section -->
          <div class="p-3 sm:p-4">
            <div class="flex justify-between items-start gap-2 mb-1">
              <h3 class="font-bold text-xs sm:text-base truncate text-slate-900">{{ item.title }}</h3>
              <!-- Price tag -->
              <span v-if="item.type !== 'swap' && item.price" class="font-black text-brand-600 text-xs sm:text-base flex-shrink-0">
                ₦{{ Number(item.price).toLocaleString() }}
              </span>
            </div>

            <!-- Swap preference tag -->
            <div v-if="item.type === 'swap' && item.swapPreference" class="mb-2">
              <span class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full truncate max-w-full">
                <ArrowRightLeft class="w-3 h-3 flex-shrink-0" />
                <span class="truncate">Wants: {{ item.swapPreference }}</span>
              </span>
            </div>

            <!-- Description snippet -->
            <p v-if="item.description" class="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
              {{ item.description }}
            </p>

            <!-- Location -->
            <p class="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1 truncate">
              <MapPin class="w-3 h-3 flex-shrink-0 text-slate-400" />
              <span class="truncate">{{ item.location || 'Campus Wide' }}</span>
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- Mobile Filter Bottom Sheet / Modal Drawer -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isFilterDrawerOpen"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[200] flex flex-col justify-end"
            @click.self="isFilterDrawerOpen = false"
          >
            <!-- Drawer Content -->
            <div class="bg-white rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
              <!-- Drag Handle & Header -->
              <div class="px-5 pt-3 pb-4 border-b border-slate-100 flex-shrink-0">
                <div class="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3"></div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <SlidersHorizontal class="w-4 h-4 text-brand-600" />
                    <h3 class="text-base font-black text-slate-900">Filters</h3>
                    <span v-if="activeFilterCount > 0" class="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-extrabold text-xs">
                      {{ activeFilterCount }} active
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="activeFilterCount > 0"
                      type="button"
                      @click="clearAllFilters"
                      class="text-xs font-bold text-slate-500 hover:text-brand-600 underline"
                    >
                      Reset all
                    </button>
                    <button
                      type="button"
                      @click="isFilterDrawerOpen = false"
                      class="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Drawer Scrollable Body -->
              <div class="p-5 overflow-y-auto space-y-6">
                <!-- 1. Listing Type -->
                <div>
                  <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Listing Type</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      @click="drawerType = ''"
                      class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all"
                      :class="drawerType === '' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
                    >
                      All Types
                    </button>
                    <button
                      type="button"
                      @click="drawerType = 'sell'"
                      class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all"
                      :class="drawerType === 'sell' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
                    >
                      🛍️ Buy & Sell
                    </button>
                    <button
                      type="button"
                      @click="drawerType = 'swap'"
                      class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all"
                      :class="drawerType === 'swap' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
                    >
                      🔄 Swaps
                    </button>
                    <button
                      type="button"
                      @click="drawerDeclutter = !drawerDeclutter"
                      class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex items-center justify-center gap-1"
                      :class="drawerDeclutter ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200 bg-brand-50/50 text-brand-700'"
                    >
                      <Sparkles class="w-3.5 h-3.5" />
                      <span>Room Declutter</span>
                    </button>
                  </div>
                </div>

                <!-- 2. Category -->
                <div>
                  <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Category</label>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      @click="drawerCategory = ''"
                      class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                      :class="drawerCategory === '' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'"
                    >
                      All
                    </button>
                    <button
                      v-for="cat in categoryOptions.filter(c => c.value)"
                      :key="cat.value"
                      type="button"
                      @click="drawerCategory = cat.value"
                      class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                      :class="drawerCategory === cat.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'"
                    >
                      {{ cat.label }}
                    </button>
                  </div>
                </div>

                <!-- 3. Campus Hostel / Location -->
                <div>
                  <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Campus Location / Hostel</label>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="loc in locationOptions"
                      :key="loc.value"
                      type="button"
                      @click="drawerLocation = loc.value"
                      class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                      :class="drawerLocation === loc.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'"
                    >
                      {{ loc.label }}
                    </button>
                  </div>
                </div>

                <!-- 4. Maximum Budget -->
                <div>
                  <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Maximum Budget</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="bg in budgetOptions"
                      :key="bg.value"
                      type="button"
                      @click="drawerBudget = bg.value"
                      class="p-2 rounded-xl border text-xs font-bold text-center transition-all"
                      :class="drawerBudget === bg.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'"
                    >
                      {{ bg.label }}
                    </button>
                  </div>
                </div>

                <!-- 5. Sort Order -->
                <div>
                  <label class="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Sort By</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="s in sortOptions"
                      :key="s.value"
                      type="button"
                      @click="drawerSort = s.value"
                      class="p-2 rounded-xl border text-xs font-bold text-center transition-all"
                      :class="drawerSort === s.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'"
                    >
                      {{ s.label }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Drawer Sticky Apply Button -->
              <div class="p-4 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                <button
                  type="button"
                  @click="applyDrawerFilters"
                  class="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-3 rounded-2xl shadow-lg shadow-brand-600/25 transition-all text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Declutter Box Modal (Opens on Google Photos album card click) -->
      <div
        v-if="selectedBatchBox"
        class="fixed inset-0 z-[150] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <!-- Modal Header -->
          <div class="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-black uppercase tracking-wider">
                  Declutter Box
                </span>
                <span class="text-xs font-bold text-slate-500">{{ selectedBatchBox.hostel }}</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {{ selectedBatchBox.batchTitle }}
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                Listed by <strong class="text-slate-800">{{ selectedBatchBox.seller?.firstName || 'Student' }}</strong> • {{ selectedBatchBox.items.length }} items in this room sale
              </p>
            </div>

            <button
              type="button"
              @click="closeBatchBox"
              class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Bundle Discount Banner -->
          <div v-if="selectedBatchBox.bundleDiscountPercent > 0" class="px-5 py-3 bg-brand-50 border-b border-brand-100 flex items-center justify-between text-xs text-brand-950 font-bold">
            <div class="flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-brand-600 shrink-0" />
              <span>Take all items together and save <strong>{{ selectedBatchBox.bundleDiscountPercent }}% bundle discount!</strong></span>
            </div>
            <span class="text-brand-600 font-black">₦{{ selectedBatchBox.discountedTotal.toLocaleString() }}</span>
          </div>

          <!-- Items List inside the Declutter Box -->
          <div class="p-5 sm:p-6 overflow-y-auto space-y-3.5 divide-y divide-slate-100 flex-1">
            <div
              v-for="item in selectedBatchBox.items"
              :key="item._id"
              class="pt-3.5 first:pt-0 flex items-center gap-3.5 sm:gap-4 group"
            >
              <div class="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img :src="item.images?.[0] || '/no-image.png'" class="w-full h-full object-cover" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-1">
                  <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {{ item.category || 'Appliances' }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-500">
                    {{ item.condition || 'Good Condition' }}
                  </span>
                </div>
                <h4 class="font-bold text-slate-900 text-sm truncate">
                  {{ item.title }}
                </h4>
                <p class="text-xs font-black text-brand-600 mt-0.5">
                  ₦{{ Number(item.price || 0).toLocaleString() }}
                </p>
              </div>

              <NuxtLink
                :to="'/item/' + item._id"
                class="px-3.5 py-2 rounded-xl bg-slate-100 group-hover:bg-brand-600 group-hover:text-white text-slate-800 text-xs font-black transition-colors shrink-0"
              >
                View Item →
              </NuxtLink>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Box Valuation</span>
              <span class="text-base sm:text-lg font-black text-slate-900">₦{{ selectedBatchBox.totalValuation.toLocaleString() }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="closeBatchBox"
                class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              <NuxtLink
                :to="'/item/' + selectedBatchBox.items[0]?._id"
                class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs transition-colors shadow-sm"
              >
                Order From This Box
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { 
  MapPin, 
  Search, 
  ArrowRightLeft, 
  ImageIcon, 
  Sparkles, 
  RotateCcw, 
  X, 
  SlidersHorizontal,
  Folder,
  ArrowUpDown,
  Wallet,
  Package
} from 'lucide-vue-next'
import CustomSelect from '~/components/CustomSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import { itemsApi, categoriesApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const searchQuery = computed(() => route.query.q || '')
const localSearchQuery = ref(route.query.q || '')

const executeSearch = () => {
  router.push({
    path: '/explore',
    query: { ...route.query, q: localSearchQuery.value?.trim() || undefined }
  })
}

const clearSearch = () => {
  localSearchQuery.value = ''
  router.push({
    path: '/explore',
    query: { ...route.query, q: undefined }
  })
}

useSeoMeta({
  title: computed(() => searchQuery.value ? `Search Results for "${searchQuery.value}" | Decluttered` : 'Explore Campus Marketplace | Decluttered'),
  description: 'Discover everything available on the Decluttered student network. Buy, sell, and swap electronics, textbooks, room declutter batches, and more.',
  ogTitle: 'Explore Decluttered',
  ogDescription: 'Discover amazing room declutter sales and verified student listings on Decluttered.',
})

// Declutter Box modal and batches state
const selectedBatchBox = ref(null)
const openBatchBox = (batch) => {
  selectedBatchBox.value = batch
}
const closeBatchBox = () => {
  selectedBatchBox.value = null
}

// Active filters state
const selectedType = ref(route.query.type || '')
const selectedCategory = ref(route.query.category || '')
const selectedLocation = ref(route.query.location || '')
const selectedBudget = ref(route.query.budget || '')
const selectedSort = ref(route.query.sort || 'newest')

// Filter Drawer state
const isFilterDrawerOpen = ref(false)
const drawerType = ref(selectedType.value)
const drawerCategory = ref(selectedCategory.value)
const drawerLocation = ref(selectedLocation.value)
const drawerBudget = ref(selectedBudget.value)
const drawerSort = ref(selectedSort.value)
const drawerDeclutter = ref(Boolean(route.query.declutter))

// Sync drawer when opened
watch(isFilterDrawerOpen, (isOpen) => {
  if (isOpen) {
    drawerType.value = selectedType.value
    drawerCategory.value = selectedCategory.value
    drawerLocation.value = selectedLocation.value
    drawerBudget.value = selectedBudget.value
    drawerSort.value = selectedSort.value
    drawerDeclutter.value = Boolean(route.query.declutter)
  }
})

const applyDrawerFilters = () => {
  selectedType.value = drawerType.value
  selectedCategory.value = drawerCategory.value
  selectedLocation.value = drawerLocation.value
  selectedBudget.value = drawerBudget.value
  selectedSort.value = drawerSort.value

  const q = { ...route.query }
  if (drawerDeclutter.value) {
    q.declutter = 'true'
  } else {
    delete q.declutter
  }
  router.push({ path: '/explore', query: q })
  isFilterDrawerOpen.value = false
}

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'sell', label: 'Buy/Sell' },
  { value: 'swap', label: 'Swap' },
]

const categoryOptions = ref([
  { value: '', label: 'All Categories' }
])

const locationOptions = [
  { value: '', label: 'All Hostels' },
  { value: 'Kuti Hall', label: 'Kuti Hall' },
  { value: 'Moremi Hall', label: 'Moremi Hall' },
  { value: 'Jaja Hall', label: 'Jaja Hall' },
  { value: 'Fagunwa Hall', label: 'Fagunwa Hall' },
  { value: 'Awolowo Hall', label: 'Awolowo Hall' },
  { value: 'Campus Library', label: 'Campus Library' },
  { value: 'Student Union', label: 'Student Union' },
]

const budgetOptions = [
  { value: '', label: 'Any Budget' },
  { value: '5000', label: 'Under ₦5,000' },
  { value: '15000', label: 'Under ₦15,000' },
  { value: '30000', label: 'Under ₦30,000' },
  { value: '60000', label: 'Under ₦60,000' },
  { value: '100000', label: 'Under ₦100,000' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const items = ref([])
const loading = ref(true)
const error = ref('')

const activeFilterCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (route.query.declutter) count++
  if (selectedType.value) count++
  if (selectedCategory.value) count++
  if (selectedLocation.value) count++
  if (selectedBudget.value) count++
  if (selectedSort.value && selectedSort.value !== 'newest') count++
  return count
})

const clearAllFilters = () => {
  localSearchQuery.value = ''
  selectedType.value = ''
  selectedCategory.value = ''
  selectedLocation.value = ''
  selectedBudget.value = ''
  selectedSort.value = 'newest'
  router.push({ path: '/explore' })
}

const setQuickType = (typeVal) => {
  selectedType.value = typeVal
  if (route.query.declutter) {
    const q = { ...route.query }
    delete q.declutter
    router.push({ path: '/explore', query: q })
  }
}

const setQuickDeclutter = () => {
  selectedType.value = ''
  const isDeclutterActive = Boolean(route.query.declutter)
  const q = { ...route.query }
  if (isDeclutterActive) {
    delete q.declutter
  } else {
    q.declutter = 'true'
  }
  router.push({ path: '/explore', query: q })
}

const fetchItems = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (searchQuery.value) params.q = searchQuery.value
    if (route.query.declutter) params.declutter = route.query.declutter
    if (selectedType.value) params.type = selectedType.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (selectedLocation.value) params.location = selectedLocation.value
    if (selectedBudget.value) params.budget = selectedBudget.value
    if (selectedSort.value && selectedSort.value !== 'newest') params.sort = selectedSort.value

    const res = await itemsApi.list(params)
    const listData = res?.data?.data || res?.data || []
    if (Array.isArray(listData)) {
      items.value = listData
    } else {
      items.value = []
    }
  } catch (err) {
    console.error('Failed to load explore items:', err)
    error.value = 'Failed to load items. Please try again.'
  } finally {
    loading.value = false
  }
}

watch([searchQuery, () => route.query.declutter, selectedType, selectedCategory, selectedLocation, selectedBudget, selectedSort], () => {
  fetchItems()
})

onMounted(async () => {
  try {
    const { data } = await categoriesApi.fetch()
    if (data) {
      categoryOptions.value = [
        { value: '', label: 'All Categories' },
        ...data.map(c => ({ value: c.name, label: c.name }))
      ]
    }
  } catch (err) {
    console.error('Failed to load categories', err)
  }
  fetchItems()
})

const filteredItems = computed(() => {
  return items.value
})

const declutterBatches = computed(() => {
  const map = new Map()
  for (const item of items.value) {
    if (!item.batchId) continue
    const existing = map.get(item.batchId)
    if (!existing) {
      map.set(item.batchId, {
        batchId: item.batchId,
        batchTitle: item.batchTitle || (item.location ? `${item.location} Declutter Sale` : 'Room Declutter Sale'),
        hostel: item.location || 'Campus Hostel',
        seller: item.sellerId,
        items: [item],
        images: [...(item.images || [])],
        totalValuation: Number(item.price || 0),
        bundleDiscountPercent: Number(item.bundleDiscountPercent || 0),
        discountedTotal: 0,
      })
    } else {
      existing.items.push(item)
      if (item.images && item.images.length) {
        existing.images.push(...item.images)
      }
      existing.totalValuation += Number(item.price || 0)
      if (item.bundleDiscountPercent && !existing.bundleDiscountPercent) {
        existing.bundleDiscountPercent = Number(item.bundleDiscountPercent)
      }
    }
  }

  return Array.from(map.values()).map(b => {
    const uniqueImages = Array.from(new Set(b.images)).filter(Boolean)
    const discount = b.bundleDiscountPercent > 0 ? (b.totalValuation * b.bundleDiscountPercent) / 100 : 0
    return {
      ...b,
      images: uniqueImages.length ? uniqueImages : ['/no-image.png'],
      discountedTotal: Math.round(b.totalValuation - discount),
    }
  })
})
</script>

<style scoped>
.item-carousel {
  overflow: hidden;
}
.item-carousel:hover .item-carousel-track {
  animation-play-state: paused !important;
}
@keyframes scroll-carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>