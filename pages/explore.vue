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

      <!-- Declutter Mode Header & View Toggle (when filtering by declutter) -->
      <div v-if="route.query.declutter" class="mb-5 p-4 rounded-3xl bg-brand-50/70 border border-brand-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black text-slate-900 leading-tight">
              Hostel Declutter Clearance Sales
            </h3>
            <p class="text-[11px] text-slate-500 font-medium">
              Browse room packages grouped by student rooms (e.g. Room 434, Moremi Hall).
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-brand-200/90 self-start sm:self-auto text-xs font-bold shadow-2xs">
          <button
            type="button"
            @click="declutterViewMode = 'groups'"
            class="px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            :class="declutterViewMode === 'groups' ? 'bg-brand-600 text-white shadow-2xs' : 'text-slate-600 hover:text-brand-600'"
          >
            <Folder class="w-3.5 h-3.5" />
            <span>Room Groups (Album View)</span>
          </button>
          <button
            type="button"
            @click="declutterViewMode = 'items'"
            class="px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
            :class="declutterViewMode === 'items' ? 'bg-brand-600 text-white shadow-2xs' : 'text-slate-600 hover:text-brand-600'"
          >
            <Package class="w-3.5 h-3.5" />
            <span>Individual Items ({{ filteredItems.length }})</span>
          </button>
        </div>
      </div>

      <!-- 1. Google Photos Album-Style Grouped Declutter Grid -->
      <div 
        v-if="route.query.declutter && declutterViewMode === 'groups'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <div 
          v-for="group in batchGroups" 
          :key="group.batchId"
          @click="openBatchModal(group)"
          class="group cursor-pointer bg-white border border-slate-200 rounded-3xl p-3 sm:p-4 hover:border-brand-500 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 relative flex flex-col justify-between"
        >
          <!-- Stacked Photos Container (Google Photos Album Stack Style) -->
          <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-3 shadow-inner">
            
            <!-- 3+ Photos Collage Stack -->
            <div v-if="group.images.length >= 3" class="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full p-1 bg-slate-200/50">
              <div class="row-span-2 relative rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[0]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="relative rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[1]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="relative rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[2]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div v-if="group.items.length > 3" class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-black text-xs sm:text-sm">
                  +{{ group.items.length - 2 }}
                </div>
              </div>
            </div>

            <!-- 2 Photos Split -->
            <div v-else-if="group.images.length === 2" class="grid grid-cols-2 gap-1 w-full h-full p-1 bg-slate-200/50">
              <div class="relative rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[0]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="relative rounded-xl overflow-hidden bg-slate-300">
                <img :src="group.images[1]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            <!-- Single Photo with Stack Look -->
            <div v-else class="w-full h-full relative">
              <img :src="group.images[0] || '/no-image.png'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            <!-- Top Album Badge -->
            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 flex-wrap">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/85 backdrop-blur text-white flex items-center gap-1 shadow-xs">
                <Folder class="w-3 h-3 text-brand-400" />
                <span>Room Declutter Box</span>
              </span>
              <span v-if="group.bundleDiscountPercent > 0" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-600 text-white shadow-xs">
                {{ group.bundleDiscountPercent }}% Bundle Off
              </span>
            </div>

            <!-- Item Count Pill -->
            <div class="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur text-white px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 z-10 shadow-xs">
              <Package class="w-3.5 h-3.5 text-brand-400" />
              <span>{{ group.items.length }} Items</span>
            </div>
          </div>

          <!-- Group Meta Info -->
          <div>
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="font-black text-sm sm:text-base text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
                {{ group.groupName }}
              </h3>
            </div>

            <div class="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
              <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate">{{ group.hostel }}</span>
            </div>

            <!-- Price and Bundle action row -->
            <div class="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Box Value</span>
                <div class="flex items-baseline gap-1.5">
                  <span class="font-black text-brand-600 text-sm sm:text-base">
                    ₦{{ (group.discountedPrice || group.totalPrice).toLocaleString() }}
                  </span>
                  <span v-if="group.bundleDiscountPercent > 0" class="text-[11px] line-through text-slate-400 font-medium">
                    ₦{{ group.totalPrice.toLocaleString() }}
                  </span>
                </div>
              </div>

              <span class="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-black text-xs group-hover:bg-brand-600 group-hover:text-white transition-colors">
                Open Box →
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Standard Listings Grid (2 cols mobile, 3 tablet, 4 desktop) -->
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

      <!-- Google Photos-Style Declutter Box Modal (z-[200] to exceed navbar) -->
      <Teleport to="body">
        <div 
          v-if="selectedBatchGroup" 
          class="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          @click.self="selectedBatchGroup = null"
        >
          <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <!-- Modal Header -->
            <div class="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70 shrink-0">
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
            <div class="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50/30">
              <div 
                v-for="item in selectedBatchGroup.items" 
                :key="item._id"
                class="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/90 hover:border-brand-300 hover:bg-slate-50/50 transition-all bg-white shadow-2xs"
              >
                <!-- Thumbnail -->
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                  <img :src="item.images?.[0] || '/no-image.png'" class="w-full h-full object-cover" />
                  <span v-if="item.videos && item.videos.length > 0" class="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[8px] font-black px-1 rounded">VID</span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-xs sm:text-sm text-slate-900 truncate">{{ item.title }}</h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs sm:text-sm font-black text-brand-600">₦{{ Number(item.price).toLocaleString() }}</span>
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
  Package,
  Share2,
  CheckCircle2,
} from 'lucide-vue-next'
import CustomSelect from '~/components/CustomSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import { itemsApi, categoriesApi } from '~/composables/useApi'
import { useCustomToast } from '@/composables/core/useCustomToast'

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
  description: 'Discover pre-loved student gear, room declutter boxes, and verified campus skills on Decluttered.',
  ogTitle: 'Explore Decluttered',
  ogDescription: 'Discover amazing deals from students around you on the Decluttered network.',
})

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

const declutterViewMode = ref('groups') // 'groups' | 'items'
const selectedBatchGroup = ref(null)

const batchGroups = computed(() => {
  const map = new Map()

  items.value.forEach((item) => {
    if (!item.batchId) return
    const bId = item.batchId
    if (!map.has(bId)) {
      const gName = item.groupName || (item.location ? `${item.location} Declutter Sale` : 'Room Declutter Sale')
      map.set(bId, {
        batchId: bId,
        groupName: gName,
        hostel: item.location || 'Campus Hostel',
        bundleDiscountPercent: Number(item.bundleDiscountPercent || 0),
        seller: item.sellerId,
        items: [],
        totalPrice: 0,
        discountedPrice: 0,
        images: [],
      })
    }
    const group = map.get(bId)
    group.items.push(item)
    group.totalPrice += Number(item.price || 0)
    if (item.images && item.images.length) {
      item.images.forEach((img) => {
        if (!group.images.includes(img) && group.images.length < 6) {
          group.images.push(img)
        }
      })
    }
  })

  map.forEach((group) => {
    if (group.bundleDiscountPercent > 0) {
      group.discountedPrice = Math.round(group.totalPrice * (1 - group.bundleDiscountPercent / 100))
    } else {
      group.discountedPrice = group.totalPrice
    }
  })

  const list = Array.from(map.values())
  return list
})

const openBatchModal = (group) => {
  selectedBatchGroup.value = group
}

const shareBatchGroup = async (group) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    const url = `${window.location.origin}/explore?declutter=true&batchId=${group.batchId}`
    await navigator.clipboard.writeText(url)
    useCustomToast().showToast({
      title: 'Room Box Link Copied! 📋',
      message: `Share link for "${group.groupName}" copied to clipboard!`,
      toastType: 'success',
    })
  }
}

// Auto open batch modal if batchId in query
watch(() => route.query.batchId, (bId) => {
  if (bId && batchGroups.value.length > 0) {
    const found = batchGroups.value.find((g) => g.batchId === bId)
    if (found) selectedBatchGroup.value = found
  }
}, { immediate: true })
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