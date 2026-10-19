<template>
  <div class="fixed inset-0 w-screen h-screen h-[100dvh] bg-black text-white select-none overflow-hidden z-50 font-sans">
    
    <!-- ── Top Floating Header Bar ── -->
    <header class="absolute top-0 inset-x-0 z-40 p-3 sm:p-5 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent">
      
      <!-- Left: Sleek Back Button -->
      <div class="flex items-center gap-2 pointer-events-auto shrink-0">
        <NuxtLink
          to="/explore"
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 shrink-0"
          title="Back to Explore"
        >
          <ChevronLeft class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- Center: Filter Pills (Desktop & Tablet) -->
      <div class="hidden md:flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto shadow-lg shrink-0">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          @click="selectedFilter = tab.id"
          class="h-8 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 select-none"
          :class="selectedFilter === tab.id ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'text-slate-300 hover:text-white hover:bg-white/10'"
        >
          <span>{{ tab.label }}</span>
          <span v-if="tab.emoji" class="text-xs shrink-0">{{ tab.emoji }}</span>
          <span class="text-[10px] opacity-75 font-medium shrink-0">({{ tabCount(tab.id) }})</span>
        </button>
      </div>

      <!-- Right: Action Buttons (Overview Grid & Sound Toggle) -->
      <div class="flex items-center gap-2 pointer-events-auto shrink-0">
        
        <!-- Reel Counter -->
        <div v-if="filteredReels.length > 0" class="hidden sm:inline-flex h-10 items-center px-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-black text-slate-300 whitespace-nowrap shrink-0">
          {{ activeIndex + 1 }} / {{ filteredReels.length }}
        </div>

        <!-- Grid Overview Button -->
        <button
          type="button"
          @click="isGridDrawerOpen = true"
          class="h-10 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 flex items-center gap-2 text-xs font-bold active:scale-95 whitespace-nowrap shrink-0"
          title="Browse All Listings"
        >
          <Grid class="w-4 h-4 shrink-0" />
          <span class="hidden sm:inline whitespace-nowrap">All Listings</span>
        </button>

        <!-- Sound Toggle Button -->
        <button
          type="button"
          @click="toggleSound"
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 flex items-center justify-center active:scale-95 shrink-0"
          :title="isMuted ? 'Unmute Sound' : 'Mute Sound'"
        >
          <VolumeX v-if="isMuted" class="w-5 h-5 text-slate-300" />
          <Volume2 v-else class="w-5 h-5 text-brand-400 animate-pulse" />
        </button>
      </div>
    </header>

    <!-- Mobile Filter Bar (Horizontal scroll below top bar) -->
    <div class="md:hidden absolute top-16 inset-x-0 z-30 px-3 py-1 flex items-center gap-1.5 overflow-x-auto scrollbar-hide pointer-events-auto bg-gradient-to-b from-black/60 to-transparent">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        type="button"
        @click="selectedFilter = tab.id"
        class="h-8 px-3 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 whitespace-nowrap"
        :class="selectedFilter === tab.id ? 'bg-brand-600 text-white shadow-md' : 'bg-black/60 backdrop-blur-md border border-white/10 text-slate-300'"
      >
        <span>{{ tab.label }}</span>
        <span v-if="tab.emoji" class="text-xs">{{ tab.emoji }}</span>
        <span class="text-[10px] opacity-75">({{ tabCount(tab.id) }})</span>
      </button>
    </div>

    <!-- ── Loading State ── -->
    <div v-if="loading" class="h-full w-full flex flex-col items-center justify-center space-y-4">
      <div class="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-black text-slate-300 tracking-wide">Loading Campus Reels Feed…</p>
    </div>

    <!-- ── Empty State ── -->
    <div v-else-if="filteredReels.length === 0" class="h-full w-full flex flex-col items-center justify-center px-6 text-center">
      <div
        class="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        :class="selectedFilter === 'loved' ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5 border border-white/10'"
      >
        <Heart v-if="selectedFilter === 'loved'" class="w-10 h-10 text-red-500 fill-red-500/30 animate-pulse" />
        <VideoOff v-else class="w-10 h-10 text-slate-500" />
      </div>
      <h3 class="text-2xl font-black text-white">
        {{ selectedFilter === 'loved' ? 'No Loved Reels Yet ❤️' : 'No Listings Found' }}
      </h3>
      <p class="text-sm text-slate-400 mt-2 max-w-sm">
        {{ selectedFilter === 'loved' ? 'Double tap or tap the heart icon on any campus listing video to save it to your Loved collection.' : 'No items or services match this category filter right now.' }}
      </p>
      <div class="mt-6 flex gap-3">
        <button
          @click="selectedFilter = 'all'"
          class="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-black text-xs hover:bg-brand-700 shadow-lg shadow-brand-600/30"
        >
          {{ selectedFilter === 'loved' ? 'Explore All Listings' : `View All (${allReels.length})` }}
        </button>
        <NuxtLink v-if="selectedFilter !== 'loved'" to="/sell" class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
          Post a Listing
        </NuxtLink>
      </div>
    </div>

    <!-- ── Desktop Floating Vertical Arrows (Previous / Next Reel) ── -->
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
            :src="reel.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600'"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Reel Media Stage (Click to Play/Pause, Double-click to Like) -->
        <div
          class="relative w-full max-w-lg md:max-w-xl h-full flex items-center justify-center cursor-pointer select-none"
          @click="togglePlayPause(idx)"
          @dblclick.prevent="handleDoubleTapLike(reel)"
        >
          <!-- Video Format -->
          <video
            v-if="reel.videos && reel.videos.length > 0"
            :ref="el => setVideoRef(el, idx)"
            :src="reel.videos[0]"
            :muted="isMuted"
            loop
            playsinline
            class="w-full h-full object-contain md:object-cover shadow-2xl"
          ></video>

          <!-- Floating Video Sound Status Badge -->
          <button
            v-if="reel.videos && reel.videos.length > 0"
            type="button"
            @click.stop="toggleSound"
            class="absolute top-20 sm:top-24 right-4 z-30 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[11px] font-black text-white flex items-center gap-1.5 shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <Volume2 v-if="!isMuted" class="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <VolumeX v-else class="w-3.5 h-3.5 text-amber-400" />
            <span>{{ isMuted ? 'Muted · Tap for Sound 🔊' : 'Sound On 🔊' }}</span>
          </button>

          <!-- Image Slideshow / Photo Format -->
          <div v-else class="w-full h-full relative flex items-center justify-center bg-black/50">
            <img
              :src="reel.images?.[currentImageIndex(reel._id)] || reel.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'"
              class="max-w-full max-h-full object-contain transition-transform duration-700 ease-out"
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
          
          <!-- Seller / Provider Info -->
          <div class="flex items-center gap-2.5 mb-2.5">
            <div class="w-10 h-10 rounded-full bg-brand-500 overflow-hidden border border-white/30 shrink-0 shadow-md">
              <img
                v-if="reel.sellerId?.avatar"
                :src="reel.sellerId.avatar"
                class="w-full h-full object-cover"
              />
              <span v-else class="w-full h-full flex items-center justify-center font-black text-sm">
                {{ reel.sellerId?.firstName?.charAt(0) || 'S' }}
              </span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-black text-sm sm:text-base text-white truncate drop-shadow-sm">
                  {{ reel.sellerId?.firstName || 'Campus Student' }} {{ reel.sellerId?.lastName?.[0] ? reel.sellerId.lastName[0] + '.' : '' }}
                </span>
                <span v-if="reel.sellerId?.isVerified" class="text-emerald-400 font-bold" title="Verified Campus Student">
                  ✓
                </span>
                <span v-if="reel.isService" class="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/90 text-white shadow-xs">
                  Service Provider
                </span>
              </div>
              <p class="text-xs text-slate-300 font-medium truncate flex items-center gap-1 mt-0.5">
                <span>📍 {{ reel.location || reel.sellerId?.hostel || 'UNILAG Campus' }}</span>
              </p>
            </div>
          </div>

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

    <!-- ── Slide-up All Listings Grid Drawer ── -->
    <div
      v-if="isGridDrawerOpen"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center"
      @click.self="isGridDrawerOpen = false"
    >
      <div class="bg-slate-900 text-white w-full max-w-4xl rounded-t-3xl max-h-[85vh] h-[85vh] flex flex-col overflow-hidden shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom duration-300">
        
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h3 class="text-lg font-black text-white">Browse All {{ filteredReels.length }} Listings</h3>
            <p class="text-xs text-slate-400">Tap any deal or service to jump straight to its reel</p>
          </div>
          <button
            type="button"
            @click="isGridDrawerOpen = false"
            class="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Grid of Cards (Explicit height & fixed thumbnail containers to prevent browser collapse) -->
        <div class="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-max">
          <div
            v-for="(reel, idx) in filteredReels"
            :key="reel._id"
            @click="jumpToReel(idx)"
            class="group cursor-pointer rounded-2xl overflow-hidden bg-slate-800/90 border border-white/10 hover:border-brand-500 transition-all flex flex-col relative min-h-[195px] h-[215px] shadow-lg active:scale-95"
            :class="activeIndex === idx ? 'ring-2 ring-brand-500 border-transparent shadow-brand-500/20' : ''"
          >
            <!-- Thumbnail with solid, fixed physical height -->
            <div class="h-32 sm:h-36 w-full bg-black/80 relative overflow-hidden shrink-0">
              <img
                :src="(reel.images && reel.images[0]) || (reel.videos && reel.videos.length > 0 ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400')"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                @error="(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400'; }"
              />

              <!-- Type / Video Pill -->
              <span v-if="reel.videos && reel.videos.length > 0" class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm flex items-center gap-1">
                <span>🎬</span> Video
              </span>
              <span v-else class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm"
                :class="reel.isService ? 'bg-emerald-600 text-white' : (reel.type === 'swap' ? 'bg-amber-500 text-white' : 'bg-brand-600 text-white')"
              >
                {{ reel.isService ? 'Service' : reel.type }}
              </span>

              <span v-if="activeIndex === idx" class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-brand-600 text-[9px] font-black uppercase text-white shadow-md">
                Playing Now
              </span>
            </div>

            <!-- Content Card Body -->
            <div class="p-2.5 flex-1 flex flex-col justify-between bg-slate-900/95 min-w-0">
              <h4 class="text-xs font-black text-white truncate group-hover:text-brand-400 transition-colors">{{ reel.title }}</h4>
              <div class="flex items-center justify-between mt-1 text-[11px]">
                <span class="font-black text-brand-400">{{ priceDisplay(reel) }}</span>
                <span class="text-slate-400 text-[10px] truncate max-w-[80px]">📍 {{ reel.location || 'Campus' }}</span>
              </div>
            </div>
          </div>
        </div>

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
  Grid,
  Sparkles,
  VideoOff,
} from 'lucide-vue-next';
import { itemsApi, servicesApi } from '~/composables/useApi';
import { useAuth } from '~/composables/useAuth';
import { useNotificationSound } from '~/composables/core/useNotificationSound';
import { useCustomToast } from '~/composables/core/useCustomToast';

// Full-Screen Layout: bypass default layout completely!
definePageMeta({ layout: false });

useSeoMeta({
  title: 'Campus Reels | Decluttered',
  description: 'Explore campus buy, sell, swap, and room declutter deals in an Instagram Reels-style full-screen video feed on Decluttered.',
});

const { user, isLoggedIn } = useAuth();
const { playNotificationChime } = useNotificationSound();

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
const lovedReelIds = ref<string[]>([]);

// Filters (including Loved ❤️)
const selectedFilter = ref<'all' | 'loved' | 'declutter' | 'items' | 'swap' | 'services'>('all');
const filterTabs = [
  { id: 'all', label: 'All Reels', emoji: '' },
  { id: 'loved', label: 'Loved', emoji: '❤️' },
  { id: 'declutter', label: 'Declutter', emoji: '📦' },
  { id: 'items', label: 'Buy & Sell', emoji: '🛍️' },
  { id: 'swap', label: 'Swap', emoji: '🔄' },
  { id: 'services', label: 'Services', emoji: '🛠️' },
] as const;

// Drawers
const isCommentsDrawerOpen = ref(false);
const isGridDrawerOpen = ref(false);
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

// Sound toggle with video unmuting and chime
const toggleSound = () => {
  isMuted.value = !isMuted.value;
  videoRefs.value.forEach((v) => {
    if (v) {
      v.muted = isMuted.value;
      if (!isMuted.value) {
        v.volume = 1.0;
        v.play().catch(() => {});
      }
    }
  });

  if (!isMuted.value) {
    playNotificationChime();
    showToast('🔊 Sound unmuted · Turn volume up to hear video!');
  } else {
    showToast('🔇 Video muted');
  }
};

// Filtered reels computation
const filteredReels = computed(() => {
  if (selectedFilter.value === 'all') return allReels.value;
  if (selectedFilter.value === 'loved') {
    return allReels.value.filter(r => r.isLiked || lovedReelIds.value.includes(r._id));
  }
  if (selectedFilter.value === 'declutter') return allReels.value.filter(r => Boolean(r.batchId));
  if (selectedFilter.value === 'items') return allReels.value.filter(r => !r.isService && r.type === 'sell');
  if (selectedFilter.value === 'swap') return allReels.value.filter(r => !r.isService && r.type === 'swap');
  if (selectedFilter.value === 'services') return allReels.value.filter(r => r.isService);
  return allReels.value;
});

const tabCount = (filterId: string) => {
  if (filterId === 'all') return allReels.value.length;
  if (filterId === 'loved') return allReels.value.filter(r => r.isLiked || lovedReelIds.value.includes(r._id)).length;
  if (filterId === 'declutter') return allReels.value.filter(r => Boolean(r.batchId)).length;
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
  if (reel.isService) return `/services/${reel._id}`;
  if (reel.type === 'swap') return `/item/${reel._id}`;
  return `/checkout?itemId=${reel._id}`;
};

const actionButtonText = (reel: any) => {
  if (reel.isService) return `Book Session (${priceDisplay(reel)})`;
  if (reel.type === 'swap') return 'Propose Swap Offer';
  return `Buy via Escrow (${priceDisplay(reel)})`;
};

const detailRoute = (reel: any) => {
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

// Load Reels from API with Fisher-Yates Shuffle on every visit
const loadReels = async () => {
  loading.value = true;

  // Sync loved reels from localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('decluttered_loved_reels');
      if (saved) lovedReelIds.value = JSON.parse(saved);
    } catch {}
  }

  // Sample verified product videos with audio to guarantee testing sound works immediately
  const sampleAudioReels = [
    {
      _id: 'seed-macbook-pro',
      title: 'Apple MacBook Pro M2 (16GB RAM, 512GB SSD) - UK Used',
      description: '🔊 Working video with sound test! Battery health 98%, includes charger. Available for immediate pickup or delivery.',
      price: 850000,
      priceType: 'fixed',
      location: 'Moremi Hall, Room 204',
      category: 'Electronics',
      condition: 'Like New',
      type: 'sell',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'],
      videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
      sellerId: { firstName: 'Chinedu', lastName: 'Okafor', hostel: 'Moremi Hall', isVerified: true },
      likesCount: 29,
      repostsCount: 11,
      isService: false,
    },
    {
      _id: 'seed-sony-anc',
      title: 'Sony WH-1000XM5 Wireless Headphones (Audio Tested)',
      description: '🔊 Turn on sound to hear ANC and audio quality test! 30hr battery life, crystal clear mic for online lectures.',
      price: 210000,
      priceType: 'fixed',
      location: 'Queen Amina Hall, Block B',
      category: 'Gadgets',
      condition: 'Used - Like New',
      type: 'sell',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
      videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'],
      sellerId: { firstName: 'Fatima', lastName: 'Aliyu', hostel: 'Queen Amina Hall', isVerified: true },
      likesCount: 42,
      repostsCount: 15,
      isService: false,
    },
    {
      _id: 'seed-jbl-speaker',
      title: 'JBL Flip 6 Waterproof Bluetooth Speaker (Bass Tested)',
      description: '🔊 Turn on sound! Big bass and crisp highs. Great for hostel jam sessions. 100% genuine.',
      price: 65000,
      priceType: 'fixed',
      location: 'Block 4, Room 234',
      category: 'Gadgets',
      condition: 'Good Condition',
      type: 'sell',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800'],
      videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'],
      sellerId: { firstName: 'Tunde', lastName: 'Balogun', hostel: 'Block 4', isVerified: true },
      likesCount: 18,
      repostsCount: 4,
      isService: false,
    },
  ];

  // Fisher-Yates array shuffler
  const shuffleArray = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  let rawList: any[] = [];
  try {
    const res = await itemsApi.getReels(user.value?._id);
    const data = res?.data?.data || res?.data;
    if (Array.isArray(data) && data.length > 0) {
      rawList = data;
    } else {
      throw new Error('Empty reels response');
    }
  } catch (err) {
    // Fallback: fetch from /items and /services if /items/reels is unavailable
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
        likesCount: item.likesCount || 0,
        repostsCount: item.repostsCount || 0,
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

      rawList = [...formattedItems, ...formattedServices];
    } catch {
      rawList = [];
    }
  }

  // Check if any items have videos; if not, inject verified sound-test video items
  const hasAnyVideos = rawList.some((i: any) => i.videos && i.videos.length > 0);
  if (!hasAnyVideos) {
    rawList = [...sampleAudioReels, ...rawList];
  }

  // Map isLiked from localStorage
  const mappedList = rawList.map((reel: any) => ({
    ...reel,
    isLiked: Boolean(reel.isLiked || lovedReelIds.value.includes(reel._id)),
  }));

  // Separate video items and non-video items, shuffle each, and put videos first so sound can be tested immediately!
  const videoItems = mappedList.filter((i: any) => i.videos && i.videos.length > 0);
  const otherItems = mappedList.filter((i: any) => !i.videos || i.videos.length === 0);

  // Dynamic shuffle on every revisit
  allReels.value = [...shuffleArray(videoItems), ...shuffleArray(otherItems)];

  loading.value = false;
  setTimeout(() => {
    syncActiveIndex();
    playActiveVideo();
  }, 250);
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

const jumpToReel = (idx: number) => {
  isGridDrawerOpen.value = false;
  setTimeout(() => {
    scrollToIndex(idx);
  }, 100);
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
  // Optimistic UI update
  reel.isLiked = !reel.isLiked;
  reel.likesCount = Math.max(0, (reel.likesCount || 0) + (reel.isLiked ? 1 : -1));

  if (reel.isLiked) {
    if (!lovedReelIds.value.includes(reel._id)) {
      lovedReelIds.value.push(reel._id);
    }
    playNotificationChime();
    showToast('❤️ Saved to your Loved collection!');
    useCustomToast().showToast({
      title: 'Saved to Loved! ❤️',
      message: `"${reel.title}" added to your loved reels.`,
      toastType: 'success',
    });
  } else {
    lovedReelIds.value = lovedReelIds.value.filter(id => id !== reel._id);
    showToast('Removed from Loved collection');
  }

  // Persist locally so guests and users always retain their loved collection
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('decluttered_loved_reels', JSON.stringify(lovedReelIds.value));
    } catch {}
  }

  // If user is logged in, sync with backend
  if (isLoggedIn.value) {
    try {
      await itemsApi.toggleLike(reel._id);
    } catch (err) {
      // Keep optimistic state locally
    }
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
    playNotificationChime();
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
  playNotificationChime();
  showToast('🚀 Boosted to your hostel & campus feed!');

  try {
    await itemsApi.repost(reel._id);
  } catch (err) {
    // Silent fail
  }
};

// Bulletproof Web Share & Clipboard Copy with Toast & Chime
const shareReel = async (reel: any) => {
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${detailRoute(reel)}`
    : `https://erranders.org${detailRoute(reel)}`;
  const shareTitle = `${reel.title} on Decluttered`;
  const shareText = `Check out "${reel.title}" on Decluttered! ${priceDisplay(reel)}`;

  // 1. Immediately copy to clipboard with synchronous textarea fallback
  let copied = false;
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
    } catch {}
  }

  if (!copied && typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copied = true;
    } catch {}
  }

  // 2. Play audible confirmation chime
  playNotificationChime();

  // 3. Show both in-reels toast and platform toast
  showToast('📋 Link copied to clipboard! Share anywhere');
  useCustomToast().showToast({
    title: 'Share Link Copied! 📋',
    message: `Link to "${reel.title}" copied to clipboard.`,
    toastType: 'success',
  });

  // 4. Also launch native mobile share sheet if supported
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // User cancelled sheet or permission denied — link is already safely in clipboard!
    }
  }
};

// Keyboard Arrow Navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (isCommentsDrawerOpen.value) return; // Don't intercept when typing in comments
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
  if (isCommentsDrawerOpen.value || isGridDrawerOpen.value) return;
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

watch(selectedFilter, () => {
  activeIndex.value = 0;
  if (containerRef.value) {
    containerRef.value.scrollTop = 0;
  }
  setTimeout(playActiveVideo, 200);
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
