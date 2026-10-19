<template>
  <div class="fixed inset-0 w-screen h-screen h-[100dvh] bg-black text-white select-none overflow-hidden z-50 font-sans">
    
    <!-- ── Top Floating Header Bar ── -->
    <header class="absolute top-0 inset-x-0 z-40 p-2.5 sm:p-4 flex items-center justify-between gap-2 pointer-events-none bg-gradient-to-b from-black/90 via-black/50 to-transparent">
      
      <!-- Left: Back Button -->
      <div class="flex items-center pointer-events-auto shrink-0">
        <NuxtLink
          to="/explore"
          class="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/15 flex items-center justify-center hover:scale-105 active:scale-95 shrink-0 shadow-lg"
          title="Back to Explore"
        >
          <ChevronLeft class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- Center: Prominent Search Input & Trigger -->
      <div class="flex-1 max-w-md mx-1 sm:mx-3 pointer-events-auto">
        <div class="relative flex items-center">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search campus reels, items, hostels…"
            class="w-full h-10 pl-9 pr-9 rounded-full bg-black/65 hover:bg-black/80 focus:bg-black/90 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium transition-all shadow-xl"
            @focus="isSearchPanelOpen = true"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="clearSearch"
            class="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-white transition-colors"
            title="Clear Search"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Right: Action Buttons (Search Drawer Button & Sound Toggle) -->
      <div class="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
        
        <!-- Filter / Advanced Search Button -->
        <button
          type="button"
          @click="isSearchPanelOpen = !isSearchPanelOpen"
          class="h-10 px-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/15 flex items-center gap-1.5 text-xs font-bold active:scale-95 whitespace-nowrap shrink-0 shadow-lg"
          :class="searchQuery ? 'border-brand-500 text-brand-400' : ''"
          title="Campus Search & Categories"
        >
          <Search class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Filter</span>
        </button>

        <!-- Sound Toggle Button -->
        <button
          type="button"
          @click="isMuted = !isMuted"
          class="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all border border-white/15 flex items-center justify-center active:scale-95 shrink-0 shadow-lg"
          :title="isMuted ? 'Unmute Sound' : 'Mute Sound'"
        >
          <VolumeX v-if="isMuted" class="w-5 h-5 text-slate-300" />
          <Volume2 v-else class="w-5 h-5 text-brand-400 animate-pulse" />
        </button>
      </div>
    </header>

    <!-- Mobile Category Filter Bar (Horizontal scroll below top bar) -->
    <div class="absolute top-14 sm:top-16 inset-x-0 z-30 px-3 py-1 flex items-center gap-1.5 overflow-x-auto scrollbar-hide pointer-events-auto bg-gradient-to-b from-black/60 to-transparent">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        type="button"
        @click="selectFilter(tab.id)"
        class="h-7 sm:h-8 px-3 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 whitespace-nowrap shadow-sm"
        :class="selectedFilter === tab.id ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white'"
      >
        <span>{{ tab.label }}</span>
        <span v-if="tab.emoji" class="text-xs">{{ tab.emoji }}</span>
        <span class="text-[10px] opacity-75">({{ tabCount(tab.id) }})</span>
      </button>
    </div>

    <!-- Active Search Filter Pill (If Search is Active) -->
    <div
      v-if="searchQuery"
      class="absolute top-24 inset-x-0 z-30 flex items-center justify-center pointer-events-none"
    >
      <div class="pointer-events-auto px-3.5 py-1 rounded-full bg-brand-600/90 backdrop-blur-md text-white text-xs font-black shadow-xl flex items-center gap-2 border border-brand-400/40">
        <span>Found {{ filteredReels.length }} matching reels</span>
        <button type="button" @click="clearSearch" class="hover:opacity-75">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- ── Initial Loading State (Centered Decluttered Logo) ── -->
    <div v-if="loading" class="h-full w-full flex flex-col items-center justify-center space-y-4 bg-black">
      <div class="relative w-20 h-20 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
        <div class="w-14 h-14 rounded-full bg-slate-900 border border-white/20 p-2 shadow-2xl flex items-center justify-center overflow-hidden animate-pulse">
          <img src="/android-chrome-192x192.png" alt="Decluttered" class="w-full h-full object-contain" />
        </div>
      </div>
      <div class="text-center">
        <p class="text-sm font-black text-white tracking-wide">Decluttered Campus Reels</p>
        <p class="text-xs text-slate-400 mt-1">Connecting to campus marketplace feed…</p>
      </div>
    </div>

    <!-- ── Empty Search / Filter State ── -->
    <div v-else-if="filteredReels.length === 0" class="h-full w-full flex flex-col items-center justify-center px-6 text-center bg-black">
      <div class="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <VideoOff class="w-10 h-10 text-slate-500" />
      </div>
      <h3 class="text-xl sm:text-2xl font-black text-white">No Reels Match "{{ searchQuery || selectedFilter }}"</h3>
      <p class="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm">Try searching for other campus items like "blender", "fridge", "mover", "bedbug", or clear filters.</p>
      <div class="mt-6 flex gap-3 flex-wrap justify-center">
        <button
          @click="resetAllFilters"
          class="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-black text-xs hover:bg-brand-700 shadow-lg shadow-brand-600/30 active:scale-95"
        >
          Reset All & Show All ({{ allReels.length }})
        </button>
        <NuxtLink to="/sell" class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95">
          Post Your Listing
        </NuxtLink>
      </div>
    </div>

    <!-- ── Desktop Floating Vertical Navigation Arrows ── -->
    <div v-if="filteredReels.length > 1" class="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 pointer-events-auto">
      <button
        type="button"
        @click="goToPrevious"
        :disabled="activeIndex === 0"
        class="w-12 h-12 rounded-full bg-black/60 hover:bg-brand-600 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-black/60 active:scale-90 shadow-xl"
        title="Previous Reel (Up Arrow)"
      >
        <ChevronUp class="w-6 h-6" />
      </button>

      <span class="text-[11px] font-black text-slate-300 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
        {{ activeIndex + 1 }} / {{ filteredReels.length }}
      </span>

      <button
        type="button"
        @click="goToNext"
        :disabled="activeIndex >= filteredReels.length - 1"
        class="w-12 h-12 rounded-full bg-black/60 hover:bg-brand-600 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-black/60 active:scale-90 shadow-xl ring-2 ring-brand-500/40 animate-pulse"
        title="Next Reel (Down Arrow)"
      >
        <ChevronDown class="w-6 h-6" />
      </button>
    </div>

    <!-- ── Reels Vertical Snap Container ── -->
    <div
      v-show="filteredReels.length > 0"
      ref="containerRef"
      @scroll="handleScroll"
      class="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative"
    >
      <div
        v-for="(reel, idx) in filteredReels"
        :key="reel._id"
        class="h-full w-full snap-start relative flex items-center justify-center overflow-hidden bg-black"
      >
        
        <!-- Ambient Blurred Background (Edge-to-Edge immersion) -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40 blur-3xl scale-125">
          <img
            :src="getMediaSrc(reel, reel.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600')"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- Reel Media Stage (Click to Play/Pause, Double-click to Like) -->
        <div
          class="relative w-full max-w-lg md:max-w-xl h-full flex items-center justify-center cursor-pointer select-none"
          @click="togglePlayPause(idx)"
          @dblclick.prevent="handleDoubleTapLike(reel)"
        >
          
          <!-- ── Aggressive Network Resilience: Centered Decluttered Media Loader ── -->
          <div
            v-if="!isMediaLoaded(reel._id) && !hasMediaError(reel._id)"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-20 pointer-events-none transition-opacity duration-300"
          >
            <div class="relative w-20 h-20 flex items-center justify-center mb-3">
              <div class="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
              <div class="absolute inset-2 rounded-full border border-amber-400/40 border-b-transparent animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
              
              <!-- Decluttered logo centered in the loader -->
              <div class="w-13 h-13 rounded-full bg-slate-900 border border-white/20 p-2 shadow-2xl flex items-center justify-center overflow-hidden animate-pulse">
                <img src="/android-chrome-192x192.png" alt="Decluttered" class="w-full h-full object-contain" />
              </div>
            </div>

            <div class="flex items-center gap-1.5 text-xs font-black text-white tracking-wide">
              <span class="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
              <span>Loading Media…</span>
            </div>
            <p class="text-[10px] text-slate-400 mt-1">Connecting over campus network</p>
          </div>

          <!-- ── Network Error State with Tap to Retry ── -->
          <div
            v-if="hasMediaError(reel._id)"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6 text-center"
          >
            <div class="w-16 h-16 rounded-full bg-white/10 border border-white/20 p-2 flex items-center justify-center mb-3 shadow-lg">
              <img src="/android-chrome-192x192.png" alt="Decluttered" class="w-10 h-10 object-contain opacity-75" />
            </div>
            <p class="text-xs font-black text-white">Network connection slow or interrupted</p>
            <p class="text-[10px] text-slate-400 mt-1 max-w-xs">Could not load listing image/video. Tap below to retry.</p>
            
            <button
              type="button"
              @click.stop="retryMedia(reel)"
              class="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-lg active:scale-95 flex items-center gap-1.5 pointer-events-auto"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Tap to Reload</span>
            </button>
          </div>

          <!-- Video Format -->
          <video
            v-if="reel.videos && reel.videos.length > 0"
            :ref="el => setVideoRef(el, idx)"
            :src="getMediaSrc(reel, reel.videos[0])"
            :muted="isMuted"
            loop
            playsinline
            preload="metadata"
            class="w-full h-full object-contain md:object-cover shadow-2xl transition-opacity duration-300"
            :class="isMediaLoaded(reel._id) ? 'opacity-100' : 'opacity-0'"
            @loadeddata="markMediaLoaded(reel._id)"
            @canplay="markMediaLoaded(reel._id)"
            @waiting="onMediaWaiting(reel._id)"
            @error="onMediaError(reel._id)"
          ></video>

          <!-- Image Slideshow / Photo Format -->
          <div v-else class="w-full h-full relative flex items-center justify-center bg-black/50">
            <img
              :src="getMediaSrc(reel, reel.images?.[currentImageIndex(reel._id)] || reel.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800')"
              class="max-w-full max-h-full object-contain transition-all duration-500 ease-out"
              :class="isMediaLoaded(reel._id) ? 'opacity-100' : 'opacity-0'"
              loading="eager"
              @load="markMediaLoaded(reel._id)"
              @error="onMediaError(reel._id)"
            />
            
            <!-- Multi-Image Segment Indicators -->
            <div v-if="reel.images && reel.images.length > 1" class="absolute top-20 sm:top-24 left-4 right-4 flex gap-1 z-20">
              <span
                v-for="(img, i) in reel.images"
                :key="i"
                class="flex-1 h-1 rounded-full transition-all"
                :class="i === currentImageIndex(reel._id) ? 'bg-white shadow-sm' : 'bg-white/30'"
              ></span>
            </div>
          </div>

          <!-- Play/Pause Indicator Flash -->
          <div
            v-if="pausedStates[idx]"
            class="absolute inset-0 flex items-center justify-center bg-black/35 pointer-events-none z-20"
          >
            <div class="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white shadow-2xl border border-white/20">
              <Play class="w-8 h-8 ml-1 fill-white" />
            </div>
          </div>

          <!-- Double Tap Floating Heart Animation -->
          <div
            v-if="heartAnimations[reel._id]"
            class="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-out duration-700"
          >
            <Heart class="w-28 h-28 text-red-500 fill-red-500 drop-shadow-2xl animate-bounce" />
          </div>

          <!-- Deep Gradient Overlay on Bottom for readable text -->
          <div class="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10"></div>
        </div>

        <!-- ── Right Action Sidebar (Like, Comment, Repost, Share, Buy/Book) ── -->
        <div class="absolute right-3 sm:right-6 bottom-24 sm:bottom-28 z-30 flex flex-col items-center gap-4 sm:gap-5 pointer-events-auto">
          
          <!-- Like Button -->
          <button
            type="button"
            @click.stop="toggleLikeReel(reel)"
            class="flex flex-col items-center group transition-transform active:scale-90"
            title="Like this listing"
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 shadow-lg"
              :class="reel.isLiked ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-black/60 text-white hover:bg-black/80'"
            >
              <Heart
                class="w-6 h-6 transition-transform group-hover:scale-110"
                :class="reel.isLiked ? 'fill-red-500 text-red-500' : ''"
              />
            </div>
            <span class="text-xs font-black text-white mt-1 drop-shadow-md">
              {{ formatCount(reel.likesCount) }}
            </span>
          </button>

          <!-- Comment Button -->
          <button
            type="button"
            @click.stop="openCommentsDrawer(reel)"
            class="flex flex-col items-center group transition-transform active:scale-90"
            title="Comments"
          >
            <div class="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 shadow-lg">
              <MessageCircle class="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <span class="text-xs font-black text-white mt-1 drop-shadow-md">
              {{ formatCount(reel.commentsCount || reel.comments?.length || 0) }}
            </span>
          </button>

          <!-- Repost / Boost Button -->
          <button
            type="button"
            @click.stop="repostReel(reel)"
            class="flex flex-col items-center group transition-transform active:scale-90"
            title="Repost / Boost"
          >
            <div class="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 shadow-lg">
              <Repeat class="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <span class="text-xs font-black text-white mt-1 drop-shadow-md">
              {{ formatCount(reel.repostsCount) }}
            </span>
          </button>

          <!-- Share Button -->
          <button
            type="button"
            @click.stop="shareReel(reel)"
            class="flex flex-col items-center group transition-transform active:scale-90"
            title="Share with coursemates"
          >
            <div class="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 shadow-lg">
              <Share2 class="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <span class="text-xs font-black text-white mt-1 drop-shadow-md">Share</span>
          </button>

          <!-- Action Button: Buy / Book / Swap -->
          <NuxtLink
            :to="actionButtonRoute(reel)"
            @click.stop
            class="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white flex items-center justify-center shadow-xl shadow-brand-600/40 transition-transform active:scale-95 border border-white/20"
            :title="reel.isService ? 'Book Service' : (reel.type === 'swap' ? 'Swap Item' : 'Buy via Escrow')"
          >
            <Calendar v-if="reel.isService" class="w-6 h-6" />
            <ArrowRightLeft v-else-if="reel.type === 'swap'" class="w-6 h-6" />
            <ShoppingBag v-else class="w-6 h-6" />
          </NuxtLink>

        </div>

        <!-- ── Bottom Item Details Overlay ── -->
        <div class="absolute left-4 sm:left-8 right-20 sm:right-28 bottom-6 sm:bottom-8 z-30 text-white text-left pointer-events-auto max-w-xl">
          
          <!-- Seller / Student Profile Info (Clicking redirects to TikTok-style profile details page) -->
          <NuxtLink
            :to="'/profile/' + (reel.sellerId?._id || reel.sellerId?.id || reel.sellerId || 'campus-seller')"
            class="inline-flex items-center gap-2.5 mb-2.5 group cursor-pointer hover:opacity-90 transition-opacity"
            title="View Student Profile"
            @click.stop
          >
            <div class="w-10 h-10 rounded-full bg-brand-500 overflow-hidden border-2 border-white/30 shrink-0 shadow-md group-hover:border-brand-400 transition-colors">
              <img
                v-if="reel.sellerId?.avatar"
                :src="reel.sellerId.avatar"
                class="w-full h-full object-cover"
              />
              <span v-else class="w-full h-full flex items-center justify-center font-black text-sm text-white">
                {{ reel.sellerId?.firstName?.charAt(0) || 'S' }}
              </span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-black text-sm sm:text-base text-white truncate drop-shadow-sm group-hover:text-brand-300 transition-colors">
                  {{ reel.sellerId?.firstName || 'Campus Student' }} {{ reel.sellerId?.lastName?.[0] ? reel.sellerId.lastName[0] + '.' : '' }}
                </span>
                <span v-if="reel.sellerId?.isVerified" class="text-emerald-400 font-bold" title="Verified Campus Student">
                  ✓
                </span>
                <span class="text-[10px] text-brand-300 font-bold group-hover:underline">
                  profile →
                </span>
              </div>
              <p class="text-xs text-slate-300 font-medium truncate flex items-center gap-1 mt-0.5">
                <span>📍 {{ reel.location || reel.sellerId?.hostel || 'UNILAG Campus' }}</span>
              </p>
            </div>
          </NuxtLink>

          <!-- Price & Title Row -->
          <div class="flex items-baseline gap-2 mb-2 flex-wrap">
            <h2 class="text-lg sm:text-2xl font-black text-white leading-tight drop-shadow-md">
              {{ reel.title }}
            </h2>
            <span class="px-2.5 py-1 rounded-xl bg-brand-600 text-white font-black text-sm sm:text-base shadow-lg">
              {{ priceDisplay(reel) }}
            </span>
          </div>

          <!-- Badges: Condition, Category, Declutter -->
          <div class="flex items-center gap-1.5 mb-2.5 flex-wrap">
            <span v-if="reel.condition" class="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur text-[11px] font-black text-white">
              {{ reel.condition }}
            </span>
            <span class="px-2 py-0.5 rounded-lg bg-white/10 backdrop-blur text-[11px] font-black text-slate-200">
              {{ reel.category || 'General' }}
            </span>
            <span v-if="reel.batchId" class="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-brand-500 text-[11px] font-black text-white flex items-center gap-1 shadow-sm">
              <Sparkles class="w-3 h-3" /> Declutter Deal
            </span>
            <span v-if="reel.type === 'swap' && reel.swapPreference" class="px-2 py-0.5 rounded-lg bg-amber-500/30 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
              Wants: {{ reel.swapPreference }}
            </span>
          </div>

          <!-- Description (Expandable) -->
          <p
            class="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-lg transition-all"
            :class="expandedDescriptions[reel._id] ? '' : 'line-clamp-2'"
            @click.stop="expandedDescriptions[reel._id] = !expandedDescriptions[reel._id]"
          >
            {{ reel.description }}
            <span v-if="reel.description?.length > 70" class="text-brand-400 font-black ml-1 cursor-pointer">
              {{ expandedDescriptions[reel._id] ? 'show less' : '...more' }}
            </span>
          </p>

          <!-- Direct Instant Call-To-Action Button -->
          <div class="mt-3.5 flex items-center gap-2.5 flex-wrap">
            <NuxtLink
              :to="actionButtonRoute(reel)"
              class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm shadow-xl transition-all inline-flex items-center gap-2 active:scale-95"
            >
              <Calendar v-if="reel.isService" class="w-4 h-4" />
              <ArrowRightLeft v-else-if="reel.type === 'swap'" class="w-4 h-4" />
              <ShoppingBag v-else class="w-4 h-4" />
              <span>{{ actionButtonText(reel) }}</span>
            </NuxtLink>

            <NuxtLink
              :to="detailRoute(reel)"
              class="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur text-white font-bold text-xs sm:text-sm transition-colors active:scale-95"
            >
              Full Details →
            </NuxtLink>
          </div>

        </div>

      </div>
    </div>

    <!-- ── Search & Filter Drawer Interface ── -->
    <div
      v-if="isSearchPanelOpen"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      @click.self="isSearchPanelOpen = false"
    >
      <div class="bg-slate-900 text-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] h-auto flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom duration-300">
        
        <!-- Header -->
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Search class="w-4 h-4 text-brand-400" />
            <h3 class="text-base font-black text-white">Search Campus Reels</h3>
          </div>
          <button
            type="button"
            @click="isSearchPanelOpen = false"
            class="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 space-y-4 overflow-y-auto">
          
          <!-- Search input inside drawer -->
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1.5">Keywords, Item name, or Model</label>
            <div class="relative">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="e.g. Kenwood Blender, Mattress, Fridge, Bedbug..."
                class="w-full h-11 pl-9 pr-9 rounded-xl bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:border-brand-500 font-medium"
              />
              <button
                v-if="searchQuery"
                type="button"
                @click="searchQuery = ''"
                class="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Quick Category Suggestions -->
          <div>
            <p class="text-xs font-bold text-slate-400 mb-2">Popular Categories</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="cat in quickCategories"
                :key="cat.query"
                type="button"
                @click="applyQuickQuery(cat.query)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                :class="searchQuery.toLowerCase().includes(cat.query.toLowerCase()) ? 'bg-brand-600 text-white border-brand-500' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Quick Campus Hostels -->
          <div>
            <p class="text-xs font-bold text-slate-400 mb-2">Filter by Campus Hostel</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="hostel in campusHostels"
                :key="hostel"
                type="button"
                @click="applyQuickQuery(hostel)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                :class="searchQuery.toLowerCase().includes(hostel.toLowerCase()) ? 'bg-amber-600 text-white border-amber-500' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'"
              >
                📍 {{ hostel }}
              </button>
            </div>
          </div>

          <!-- Current Results Count -->
          <div class="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span class="text-slate-400 font-medium">Matching Reels:</span>
            <span class="font-black text-brand-400 text-sm">{{ filteredReels.length }} found</span>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            @click="clearSearch"
            class="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            Clear Search
          </button>
          <button
            type="button"
            @click="isSearchPanelOpen = false"
            class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-lg shadow-brand-600/30"
          >
            Watch Reels ({{ filteredReels.length }})
          </button>
        </div>

      </div>
    </div>

    <!-- ── Slide-up Comments Drawer / Sheet ── -->
    <div
      v-if="isCommentsDrawerOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
      @click.self="isCommentsDrawerOpen = false"
    >
      <div class="bg-white text-slate-900 w-full max-w-lg rounded-t-3xl max-h-[75vh] h-[75vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        <!-- Drawer Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <h4 class="font-black text-slate-900 text-base">Comments</h4>
            <span class="text-xs font-bold text-slate-400">
              ({{ activeReelComments.length }})
            </span>
          </div>
          <button
            type="button"
            @click="isCommentsDrawerOpen = false"
            class="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Comments List -->
        <div class="p-4 overflow-y-auto flex-1 space-y-4">
          <div
            v-for="(comment, cIdx) in activeReelComments"
            :key="cIdx"
            class="flex items-start gap-3"
          >
            <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              <img v-if="comment.userAvatar" :src="comment.userAvatar" class="w-full h-full object-cover" />
              <span v-else>{{ comment.userName?.charAt(0) || 'S' }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="font-extrabold text-xs text-slate-900">{{ comment.userName }}</span>
                <span class="text-[10px] text-slate-400">{{ formatCommentDate(comment.createdAt) }}</span>
              </div>
              <p class="text-xs text-slate-700 mt-0.5 leading-relaxed break-words font-medium">
                {{ comment.text }}
              </p>
            </div>
          </div>

          <div v-if="activeReelComments.length === 0" class="text-center py-12 text-slate-400">
            <MessageCircle class="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p class="text-sm font-bold text-slate-700">No comments yet</p>
            <p class="text-xs text-slate-400 mt-0.5">Be the first student to leave a comment or question!</p>
          </div>
        </div>

        <!-- Comment Input Bar -->
        <form @submit.prevent="submitComment" class="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2 shrink-0">
          <input
            v-model="newCommentText"
            type="text"
            placeholder="Add a comment for the campus listing…"
            maxlength="400"
            class="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-500 font-medium"
          />
          <button
            type="submit"
            :disabled="!newCommentText.trim() || submittingComment"
            class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs disabled:opacity-40 transition-colors shrink-0"
          >
            {{ submittingComment ? 'Posting…' : 'Post' }}
          </button>
        </form>

      </div>
    </div>

    <!-- Notification Toast -->
    <Transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/95 text-white text-xs font-black shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2"
      >
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Heart,
  MessageCircle,
  Repeat,
  Share2,
  ShoppingBag,
  Calendar,
  ArrowRightLeft,
  X,
  Sparkles,
  VideoOff,
  Search,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-vue-next';
import { itemsApi, servicesApi } from '~/composables/useApi';
import { useAuth } from '~/composables/useAuth';

// Full-Screen Layout: bypass default layout completely!
definePageMeta({ layout: false });

useSeoMeta({
  title: 'Campus Reels | Decluttered by Erranders',
  description: 'Explore campus buy, sell, swap, and declutter deals in an Instagram Reels-style full-screen feed.',
});

const { user, isLoggedIn } = useAuth();

const allReels = ref<any[]>([]);
const loading = ref(true);
const isMuted = ref(true);
const containerRef = ref<HTMLElement | null>(null);
const videoRefs = ref<HTMLVideoElement[]>([]);
const pausedStates = ref<Record<number, boolean>>({});
const heartAnimations = ref<Record<string, boolean>>({});
const expandedDescriptions = ref<Record<string, boolean>>({});
const activeImageIndices = ref<Record<string, number>>({});
const activeIndex = ref(0);

// Network Resilience & Media Load Tracking
const mediaLoadedMap = ref<Record<string, boolean>>({});
const mediaErrorMap = ref<Record<string, boolean>>({});
const retryKeys = ref<Record<string, number>>({});

const isMediaLoaded = (id: string) => Boolean(mediaLoadedMap.value[id]);
const hasMediaError = (id: string) => Boolean(mediaErrorMap.value[id]);

const markMediaLoaded = (id: string) => {
  mediaLoadedMap.value[id] = true;
  mediaErrorMap.value[id] = false;
};

const onMediaWaiting = (id: string) => {
  // If buffering on bad connection, keep spinner visible
  mediaLoadedMap.value[id] = false;
};

const onMediaError = (id: string) => {
  mediaLoadedMap.value[id] = false;
  mediaErrorMap.value[id] = true;
};

const retryMedia = (reel: any) => {
  const id = reel._id;
  mediaErrorMap.value[id] = false;
  mediaLoadedMap.value[id] = false;
  retryKeys.value[id] = (retryKeys.value[id] || 0) + 1;
};

const getMediaSrc = (reel: any, baseSrc: string) => {
  if (!baseSrc) return '/no-image.png';
  const count = retryKeys.value[reel._id] || 0;
  if (count > 0) {
    const sep = baseSrc.includes('?') ? '&' : '?';
    return `${baseSrc}${sep}retry=${count}`;
  }
  return baseSrc;
};

// Aggressively preload next upcoming reels in background
const preloadUpcomingMedia = (idx: number) => {
  const list = filteredReels.value;
  const nextList = list.slice(idx + 1, idx + 3);
  nextList.forEach((r) => {
    if (r.images && r.images.length > 0) {
      const img = new Image();
      img.src = r.images[0];
      img.onload = () => {
        mediaLoadedMap.value[r._id] = true;
      };
    }
  });
};

// Search & Filter State
const searchQuery = ref('');
const isSearchPanelOpen = ref(false);
const selectedFilter = ref<'all' | 'declutter' | 'movers' | 'fumigation' | 'items' | 'swap' | 'services'>('all');

const filterTabs = [
  { id: 'all', label: 'All', emoji: '' },
  { id: 'declutter', label: 'Declutter', emoji: '📦' },
  { id: 'movers', label: 'Movers & Lifting', emoji: '🚚' },
  { id: 'fumigation', label: 'Fumigation & Clean', emoji: '🧪' },
  { id: 'items', label: 'Buy & Sell', emoji: '🛍️' },
  { id: 'swap', label: 'Swap', emoji: '🔄' },
  { id: 'services', label: 'Services', emoji: '🛠️' },
] as const;

const quickCategories = [
  { label: '📦 Declutter Clearance', query: 'declutter' },
  { label: '⚡ Electronics', query: 'electronic' },
  { label: '🍳 Kitchen & Cooking', query: 'blender' },
  { label: '🛏️ Mattress & Bedding', query: 'mattress' },
  { label: '🚚 Hostel Movers', query: 'mover' },
  { label: '🧪 Bedbug Fumigation', query: 'fumigat' },
  { label: '📚 Study Books', query: 'book' },
];

const campusHostels = [
  'Mariere Hall',
  'Moremi Hall',
  'Jaja Hall',
  'Fagunwa Hall',
  'New Hall',
  'Eni Njoku Hall',
];

const campusTrendingSearches = [
  { label: 'Kenwood heavy duty blender Mariere', query: 'blender' },
  { label: 'Hostel Room 314 Bedbug & Fogging', query: 'fumigat' },
  { label: '2-Man fridge & bed hostel movers', query: 'mover' },
  { label: 'Orthopedic single bed mattress 4x6', query: 'mattress' },
  { label: 'Haier Thermocool mini bedside fridge', query: 'fridge' },
  { label: 'Room 434 graduation declutter bundle', query: 'declutter' },
  { label: 'Rechargeable study desk fan & lamp', query: 'fan' },
  { label: 'UNILAG campus room clearance deal', query: 'clearance' },
];

const applyQuickQuery = (q: string) => {
  searchQuery.value = q;
  isSearchPanelOpen.value = false;
};

const clearSearch = () => {
  searchQuery.value = '';
};

const resetAllFilters = () => {
  searchQuery.value = '';
  selectedFilter.value = 'all';
};

const selectFilter = (tabId: any) => {
  selectedFilter.value = tabId;
};

// Drawers
const isCommentsDrawerOpen = ref(false);
const activeReelForComments = ref<any | null>(null);
const newCommentText = ref('');
const submittingComment = ref(false);

// Toast
const toastMessage = ref('');
let toastTimer: any = null;
const showToast = (msg: string) => {
  toastMessage.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2500);
};

// Filtered reels computation with real-time keyword search
const filteredReels = computed(() => {
  let list = allReels.value;

  if (selectedFilter.value === 'declutter') {
    list = list.filter(r => Boolean(r.batchId));
  } else if (selectedFilter.value === 'movers') {
    list = list.filter(r => r.category === 'Hostel Movers' || r.isMover || r.title?.toLowerCase().includes('mover') || r.title?.toLowerCase().includes('lifting'));
  } else if (selectedFilter.value === 'fumigation') {
    list = list.filter(r => r.category === 'Hostel Fumigation' || r.isFumigation || r.title?.toLowerCase().includes('fumigat') || r.title?.toLowerCase().includes('bedbug') || r.title?.toLowerCase().includes('clean'));
  } else if (selectedFilter.value === 'items') {
    list = list.filter(r => !r.isService && r.type === 'sell');
  } else if (selectedFilter.value === 'swap') {
    list = list.filter(r => !r.isService && r.type === 'swap');
  } else if (selectedFilter.value === 'services') {
    list = list.filter(r => r.isService);
  }

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(r => {
      const titleMatch = r.title?.toLowerCase().includes(q);
      const descMatch = r.description?.toLowerCase().includes(q);
      const catMatch = r.category?.toLowerCase().includes(q);
      const locMatch = r.location?.toLowerCase().includes(q);
      const sellerMatch = `${r.sellerId?.firstName || ''} ${r.sellerId?.lastName || ''}`.toLowerCase().includes(q);
      const condMatch = r.condition?.toLowerCase().includes(q);
      return titleMatch || descMatch || catMatch || locMatch || sellerMatch || condMatch;
    });
  }

  return list;
});

const tabCount = (filterId: string) => {
  if (filterId === 'all') return allReels.value.length;
  if (filterId === 'declutter') return allReels.value.filter(r => Boolean(r.batchId)).length;
  if (filterId === 'movers') return allReels.value.filter(r => r.category === 'Hostel Movers' || r.isMover || r.title?.toLowerCase().includes('mover') || r.title?.toLowerCase().includes('lifting')).length;
  if (filterId === 'fumigation') return allReels.value.filter(r => r.category === 'Hostel Fumigation' || r.isFumigation || r.title?.toLowerCase().includes('fumigat') || r.title?.toLowerCase().includes('bedbug') || r.title?.toLowerCase().includes('clean')).length;
  if (filterId === 'items') return allReels.value.filter(r => !r.isService && r.type === 'sell').length;
  if (filterId === 'swap') return allReels.value.filter(r => !r.isService && r.type === 'swap').length;
  if (filterId === 'services') return allReels.value.filter(r => r.isService).length;
  return 0;
};

const currentImageIndex = (id: string) => activeImageIndices.value[id] || 0;

const setVideoRef = (el: any, idx: number) => {
  if (el) videoRefs.value[idx] = el;
};

// Pricing display helper
const priceDisplay = (reel: any) => {
  if (reel.isService) {
    return reel.priceType === 'hourly'
      ? `₦${Number(reel.price || 0).toLocaleString()}/hr`
      : `₦${Number(reel.price || 0).toLocaleString()}`;
  }
  if (reel.type === 'swap') return 'Swap Trade';
  return `₦${Number(reel.price || 0).toLocaleString()}`;
};

// Action route helper
const actionButtonRoute = (reel: any) => {
  if (reel.isFumigation) return '/fumigation';
  if (reel.isMover) return '/movers';
  if (reel.isService) return `/services/${reel._id}`;
  if (reel.type === 'swap') return `/item/${reel._id}`;
  return `/checkout?itemId=${reel._id}`;
};

const actionButtonText = (reel: any) => {
  if (reel.isFumigation) return 'Book Fumigation (₦14,000+) 🧪';
  if (reel.isMover) return 'Book Campus Mover (₦2,500+) 🚚';
  if (reel.isService) return `Book Session (${priceDisplay(reel)})`;
  if (reel.type === 'swap') return 'Propose Swap Offer';
  return `Buy via Escrow (${priceDisplay(reel)})`;
};

const detailRoute = (reel: any) => {
  if (reel.isFumigation) return '/fumigation';
  if (reel.isMover) return '/movers';
  if (reel.isService) return `/services/${reel._id}`;
  return `/item/${reel._id}`;
};

const formatCount = (num: number) => {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const formatCommentDate = (dateStr: string) => {
  if (!dateStr) return 'Just now';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// Load Reels from API
const loadReels = async () => {
  loading.value = true;
  try {
    const res = await itemsApi.getReels(user.value?._id);
    const data = res?.data?.data || res?.data;
    if (Array.isArray(data) && data.length > 0) {
      allReels.value = data;
    } else {
      throw new Error('Empty reels response');
    }
  } catch (err) {
    // Robust fallback: fetch from /items and /services if /items/reels is unavailable
    try {
      const [itemsRes, servicesRes] = await Promise.allSettled([
        itemsApi.list({ limit: 100 }),
        servicesApi.list({ limit: 40 }),
      ]);
      const rawItems = itemsRes.status === 'fulfilled' ? (itemsRes.value?.data?.data || itemsRes.value?.data || []) : [];
      const rawServices = servicesRes.status === 'fulfilled' ? (servicesRes.value?.data?.data || servicesRes.value?.data || []) : [];

      const formattedItems = (Array.isArray(rawItems) ? rawItems : []).map((item: any) => ({
        ...item,
        isLiked: false,
        likesCount: item.likesCount || 15,
        repostsCount: item.repostsCount || 3,
        commentsCount: item.comments?.length || 0,
        isService: false,
      }));

      const formattedServices = (Array.isArray(rawServices) ? rawServices : []).map((service: any) => ({
        _id: service._id,
        title: service.title,
        description: service.description,
        price: service.price,
        priceType: service.priceType,
        type: 'service',
        category: 'Campus Service',
        location: service.location || 'Campus Wide',
        images: service.images || [],
        videos: service.videos || [],
        sellerId: service.providerId,
        isService: true,
        condition: 'Verified Service',
        likesCount: service.totalBookings ? service.totalBookings * 2 + 5 : 5,
        commentsCount: 0,
        repostsCount: 0,
        isLiked: false,
      }));

      const specialMovementReels = [
        {
          _id: 'special-blender-reel',
          title: 'Kenwood 2-in-1 Heavy Duty Blender + 2L Stainless Electric Kettle',
          description: 'Tested working video with sound! Blends smoothies and beans effortlessly. Graduating and decluttering room in Mariere.',
          price: 38000,
          priceType: 'fixed',
          type: 'sell',
          category: 'Home & Appliances',
          location: 'Mariere Hall, Room 310',
          images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'],
          videos: [],
          sellerId: {
            _id: 'bob-b-seller',
            firstName: 'Bob',
            lastName: 'B.',
            hostel: 'Mariere Hall, Room 310',
            university: 'UNILAG',
            isVerified: true,
            avatar: '',
          },
          condition: 'Good Condition',
          likesCount: 15,
          commentsCount: 0,
          repostsCount: 3,
          isLiked: false,
        },
        {
          _id: 'special-fumigation-reel',
          title: 'Hostel Room 314 Bedbug & Fogging Makeover',
          description: 'Never sleep on infested mattresses! Certified human-safe chemical partner + trained student applicator hands. 100% Escrow protected eradication.',
          price: 14000,
          priceType: 'fixed',
          type: 'service',
          category: 'Hostel Fumigation',
          location: 'Moremi & Jaja Halls',
          images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800'],
          videos: [],
          sellerId: { _id: 'fumigation-partner-id', firstName: 'Decluttered', lastName: 'Pest Lab', hostel: 'Moremi & Jaja', isVerified: true },
          isService: true,
          isFumigation: true,
          condition: 'Hospital Grade',
          likesCount: 382,
          commentsCount: 29,
          repostsCount: 45,
          isLiked: false,
        },
        {
          _id: 'special-mover-reel',
          title: 'Moremi 4th Floor Fridge & Bed Stair Haul',
          description: '2-Man student muscle crew with heavy-duty hand trolley and stair climber straps. Zero broken items, zero wahala.',
          price: 3000,
          priceType: 'fixed',
          type: 'service',
          category: 'Hostel Movers',
          location: 'Moremi, Fagunwa & New Hall',
          images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'],
          videos: [],
          sellerId: { _id: 'mover-team-id', firstName: 'Campus', lastName: 'Movers Team', hostel: 'Campus Wide', isVerified: true },
          isService: true,
          isMover: true,
          condition: 'Verified Muscle',
          likesCount: 215,
          commentsCount: 14,
          repostsCount: 19,
          isLiked: false,
        }
      ];

      allReels.value = [...specialMovementReels, ...formattedItems, ...formattedServices];
    } catch {
      allReels.value = [];
    }
  } finally {
    loading.value = false;
    setTimeout(() => {
      syncActiveIndex();
      playActiveVideo();
      preloadUpcomingMedia(0);
    }, 250);
  }
};

// Scroll and Navigation handlers
const syncActiveIndex = () => {
  if (!containerRef.value) return;
  const container = containerRef.value;
  const scrollTop = container.scrollTop;
  const itemHeight = container.clientHeight || 1;
  const newIndex = Math.round(scrollTop / itemHeight);
  if (newIndex >= 0 && newIndex < filteredReels.value.length) {
    activeIndex.value = newIndex;
    preloadUpcomingMedia(newIndex);
  }
};

const handleScroll = () => {
  syncActiveIndex();
  playActiveVideo();
};

const scrollToIndex = (idx: number) => {
  if (!containerRef.value || idx < 0 || idx >= filteredReels.value.length) return;
  const container = containerRef.value;
  const targetTop = idx * container.clientHeight;
  container.scrollTo({ top: targetTop, behavior: 'smooth' });
  activeIndex.value = idx;
  preloadUpcomingMedia(idx);
};

const goToNext = () => {
  if (activeIndex.value < filteredReels.value.length - 1) {
    scrollToIndex(activeIndex.value + 1);
  }
};

const goToPrevious = () => {
  if (activeIndex.value > 0) {
    scrollToIndex(activeIndex.value - 1);
  }
};

// Video playback
const playActiveVideo = () => {
  videoRefs.value.forEach((video, index) => {
    if (!video) return;
    if (index === activeIndex.value) {
      if (!pausedStates.value[index]) {
        void video.play().catch(() => {});
      }
    } else {
      video.pause();
    }
  });
};

const togglePlayPause = (idx: number) => {
  const video = videoRefs.value[idx];
  if (!video) return;

  if (video.paused) {
    void video.play().catch(() => {});
    pausedStates.value[idx] = false;
  } else {
    video.pause();
    pausedStates.value[idx] = true;
  }
};

// Like & Double-Tap
const handleDoubleTapLike = (reel: any) => {
  heartAnimations.value[reel._id] = true;
  setTimeout(() => {
    heartAnimations.value[reel._id] = false;
  }, 750);

  if (!reel.isLiked) {
    toggleLikeReel(reel);
  }
};

const toggleLikeReel = async (reel: any) => {
  if (!isLoggedIn.value) {
    showToast('Please log in to like campus listings');
    return;
  }

  // Optimistic UI update
  reel.isLiked = !reel.isLiked;
  reel.likesCount = (reel.likesCount || 0) + (reel.isLiked ? 1 : -1);

  try {
    await itemsApi.toggleLike(reel._id);
  } catch (err) {
    reel.isLiked = !reel.isLiked;
    reel.likesCount += reel.isLiked ? 1 : -1;
  }
};

// Comments
const activeReelComments = computed(() => {
  if (!activeReelForComments.value) return [];
  return activeReelForComments.value.comments || [];
});

const openCommentsDrawer = (reel: any) => {
  activeReelForComments.value = reel;
  newCommentText.value = '';
  isCommentsDrawerOpen.value = true;
};

const submitComment = async () => {
  if (!newCommentText.value.trim() || !activeReelForComments.value) return;
  if (!isLoggedIn.value) {
    showToast('Please log in to comment');
    return;
  }

  const text = newCommentText.value.trim();
  const currentReel = activeReelForComments.value;
  submittingComment.value = true;

  try {
    const res = await itemsApi.addComment(currentReel._id, text);
    const addedComment = res.data?.comment || {
      userId: user.value?._id,
      userName: `${user.value?.firstName || 'Student'} ${user.value?.lastName || ''}`.trim(),
      userAvatar: user.value?.avatar,
      text,
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(currentReel.comments)) {
      currentReel.comments = [];
    }
    currentReel.comments.unshift(addedComment);
    currentReel.commentsCount = (currentReel.commentsCount || 0) + 1;
    newCommentText.value = '';
    showToast('Comment posted!');
  } catch (err: any) {
    showToast('Could not post comment. Please try again.');
  } finally {
    submittingComment.value = false;
  }
};

// Repost & Boost
const repostReel = async (reel: any) => {
  if (!isLoggedIn.value) {
    showToast('Please log in to boost listings');
    return;
  }

  reel.repostsCount = (reel.repostsCount || 0) + 1;
  showToast('🚀 Boosted to your hostel & campus feed!');

  try {
    await itemsApi.repost(reel._id);
  } catch (err) {
    // Silent fail
  }
};

// Native Web Share or Clipboard Copy
const shareReel = async (reel: any) => {
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${detailRoute(reel)}`
    : `https://decluttered.erranders.org${detailRoute(reel)}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${reel.title} on Decluttered Campus`,
        text: `Check out "${reel.title}" on Decluttered by Erranders! ${priceDisplay(reel)}`,
        url: shareUrl,
      });
      return;
    } catch {
      // Fallback to copy
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(shareUrl);
    showToast('📋 Link copied to clipboard!');
  } else {
    showToast(`Share link: ${shareUrl}`);
  }
};

// Keyboard Arrow Navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (isCommentsDrawerOpen.value || isSearchPanelOpen.value) return;
  if (e.key === 'ArrowDown' || e.key === 'j') {
    e.preventDefault();
    goToNext();
  } else if (e.key === 'ArrowUp' || e.key === 'k') {
    e.preventDefault();
    goToPrevious();
  } else if (e.key === 'm') {
    isMuted.value = !isMuted.value;
  } else if (e.key === ' ') {
    e.preventDefault();
    togglePlayPause(activeIndex.value);
  }
};

// Debounced wheel navigation for smooth desktop mouse wheel snapping
let wheelTimeout: any = null;
const handleWheel = (e: WheelEvent) => {
  if (isCommentsDrawerOpen.value || isSearchPanelOpen.value) return;
  if (Math.abs(e.deltaY) < 30) return;

  if (!wheelTimeout) {
    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 450);

    if (e.deltaY > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  }
};

onMounted(() => {
  loadReels();
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('wheel', handleWheel);
  }
});

watch([selectedFilter, searchQuery], () => {
  activeIndex.value = 0;
  if (containerRef.value) {
    containerRef.value.scrollTop = 0;
  }
  setTimeout(() => {
    playActiveVideo();
    preloadUpcomingMedia(0);
  }, 200);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
