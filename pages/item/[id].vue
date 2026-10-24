<template>
  <main class="min-h-screen bg-white pb-20 relative">
    
    <!-- 4D Zoom Lightbox (Teleported to body level effectively via fixed positioning) -->
    <div v-if="isZoomOpen && activeMedia.type === 'image'" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-crosshair" @click="isZoomOpen = false">
      <button class="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors z-[101]">
        <X class="w-6 h-6" />
      </button>
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold  uppercase pointer-events-none">
        Move mouse to inspect details
      </div>
      
      <!-- 4D Interactive Zoom Container -->
      <div 
        class="relative w-full h-full overflow-hidden flex items-center justify-center"
        @mousemove="handleZoomMove"
        @mouseleave="resetZoom"
      >
        <img 
          :src="activeMedia.src" 
          class="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out"
          :style="{
            transform: `scale(${zoomLevel})`,
            transformOrigin: `${zoomOriginX}% ${zoomOriginY}%`
          }"
        />
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <NuxtLink to="/explore" class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 font-bold mb-4 transition-colors">
        <ArrowLeft class="w-3.5 h-3.5" /> Back to Explore
      </NuxtLink>

      <div v-if="loading" class="text-center py-16 text-slate-500 font-bold">Loading item...</div>
      <div v-else-if="!item" class="text-center py-16 text-red-500 font-bold">Item not found.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        <!-- Media Gallery -->
        <div class="w-full flex flex-col gap-3">
          <!-- Main Display -->
          <div 
            class="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group cursor-pointer"
            @click="activeMedia?.type === 'image' ? isZoomOpen = true : null"
          >
            <!-- Image View -->
            <img v-if="activeMedia?.type === 'image'" :src="activeMedia.src" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            <!-- Video View -->
            <video v-if="activeMedia?.type === 'video'" :src="activeMedia.src" controls autoplay muted loop class="w-full h-full object-cover"></video>

            <!-- Overlays -->
            <div class="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
              <span class="bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-xs uppercase font-black border border-slate-200">
                {{ item.type === 'sell' ? 'For Sale' : item.type === 'swap' ? 'For Swap' : 'Service' }}
              </span>
              <span v-if="activeMedia?.is360" class="bg-brand-600 text-white px-2.5 py-1 rounded-md text-xs uppercase font-black shadow-sm flex items-center gap-1 animate-pulse">
                <RotateCcw class="w-3.5 h-3.5" /> 360° Walkaround View
              </span>
              <span v-if="item.status === 'sold'" class="bg-red-600 text-white px-2.5 py-1 rounded-md text-xs uppercase font-black shadow-sm">
                Sold Out ❌
              </span>
              <span v-else-if="item.status === 'pending'" class="bg-amber-500 text-white px-2.5 py-1 rounded-md text-xs uppercase font-black shadow-sm">
                In Escrow 🔒
              </span>
            </div>
            <div v-if="activeMedia?.type === 'image'" class="absolute bottom-3 right-3 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md text-white text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Maximize class="w-3.5 h-3.5" /> 4D Zoom
            </div>
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              v-for="(media, idx) in mediaGallery" 
              :key="idx" 
              @click="activeMedia = media"
              class="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border transition-all"
              :class="activeMedia?.src === media.src ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img v-if="media.type === 'image'" :src="media.src" class="w-full h-full object-cover" />
              <div v-if="media.type === 'video'" class="w-full h-full bg-slate-800 relative flex items-center justify-center">
                <PlayCircle v-if="!media.is360" class="w-5 h-5 text-white" />
                <RotateCcw v-else class="w-5 h-5 text-brand-400 animate-spin-slow" />
                <span v-if="media.is360" class="absolute bottom-0.5 inset-x-0 text-[8px] font-black uppercase text-center bg-black/70 text-brand-300">360°</span>
              </div>
            </button>
          </div>
          
          <!-- Play Video Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            <button v-if="has360Video" @click="play360Video" class="w-full py-2.5 bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-700 hover:to-orange-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all">
              <RotateCcw class="w-4 h-4" /> Play 360° Walkaround
            </button>
            <button v-if="hasVideo && (!has360Video || mediaGallery.filter(m => m.type === 'video').length > 1)" @click="playFirstVideo" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors">
              <PlayCircle class="w-4 h-4 text-brand-400" /> Play Product Video
            </button>
          </div>
        </div>
        
        <!-- Content Side -->
        <div class="flex flex-col justify-center">
          
          <div class="mb-5">
            <div class="flex items-center gap-2 mb-1.5">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                :class="item.status === 'sold' ? 'bg-red-100 text-red-700 border border-red-200' : item.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'"
              >
                {{ item.status === 'sold' ? '● Sold Out' : item.status === 'pending' ? '● Reserved in Escrow' : '● Available' }}
              </span>
              <span v-if="item.batchId" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                📦 Declutter Batch
              </span>
            </div>
            <h1 class="text-xl md:text-2xl font-extrabold text-slate-900 mb-2 leading-tight">{{ item.title }}</h1>
            <div class="flex items-center gap-3">
              <span v-if="item.type !== 'swap'" class="text-2xl md:text-3xl font-black text-brand-600">₦{{ Number(item.price || 0).toLocaleString() }}</span>
              <span v-if="item.type === 'swap' && item.swapPreference" class="px-2.5 py-0.5 bg-green-100 text-green-700 font-bold rounded-md text-xs">Swap: {{ item.swapPreference }}</span>
            </div>
          </div>
          
          <div class="space-y-4 mb-6">
            <!-- Location (Hidden before payment to prevent bypass of the web app) -->
            <!-- 1. Buyer has finalised payment: UNLOCKED -->
            <div v-if="hasFinalisedPayment" class="flex items-center justify-between text-emerald-800 font-medium text-sm bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
              <div class="flex items-center gap-2.5">
                <MapPin class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pickup Location: <strong class="text-emerald-950">{{ item.location }}</strong></span>
              </div>
              <span class="px-2 py-0.5 bg-emerald-200/80 text-emerald-800 text-[10px] font-black rounded uppercase">Unlocked</span>
            </div>

            <!-- 2. Seller viewing their own listing: SELLER PREVIEW with clear notice that exact address is hidden from buyers -->
            <div v-else-if="isOwner" class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700 font-medium text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div class="flex items-center gap-2.5">
                <MapPin class="w-4 h-4 text-brand-600 flex-shrink-0" />
                <div>
                  <span>Your Pickup Location: <strong class="text-slate-900">{{ item.location }}</strong></span>
                  <span class="block text-xs text-slate-500 font-normal mt-0.5">🔒 Hidden from buyers until payment is made in Escrow</span>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-slate-200 text-slate-700 text-[10px] font-black rounded-lg uppercase tracking-wider self-start sm:self-auto shrink-0">Seller Preview</span>
            </div>

            <!-- 3. Prospective Buyer (Item NOT paid for): Exact address locked -->
            <div v-else class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-700 font-medium text-sm bg-amber-50/70 p-4 rounded-2xl border border-amber-200/90 shadow-2xs">
              <div class="flex items-start sm:items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Lock class="w-4 h-4" />
                </div>
                <div>
                  <div class="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>Pickup Location:</span>
                    <span class="text-amber-800">{{ getGeneralCampusLocation(item.location) }}</span>
                  </div>
                  <p class="text-xs text-amber-800/90 font-medium mt-0.5 leading-snug">
                    🔒 You need to pay inside the app to see the exact pickup location of this item.
                  </p>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-amber-200/80 text-amber-900 text-[10px] font-black rounded-lg uppercase tracking-wider shrink-0 self-start sm:self-auto">
                Locked Until Payment
              </span>
            </div>
            
            <div>
              <h3 class="font-bold text-slate-900 mb-2">Description</h3>
              <p class="text-slate-600 leading-relaxed whitespace-pre-line">
                {{ item.description }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between mb-8 pb-8 border-b border-slate-200" v-if="item.sellerId">
            <NuxtLink :to="'/profile/' + (item.sellerId._id || item.sellerId)" class="flex items-center gap-4 group hover:opacity-90 transition-opacity">
              <div class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center font-black text-brand-700 text-xl border border-brand-200 relative overflow-hidden group-hover:border-brand-500 transition-colors">
                <span class="absolute">{{ item.sellerId.firstName?.[0] }}{{ item.sellerId.lastName?.[0] }}</span>
                <img v-if="item.sellerId.avatar" :src="item.sellerId.avatar" class="w-full h-full object-cover absolute inset-0 z-10" @error="$event.target.style.display='none'" />
              </div>
              <div>
                <p class="font-black text-slate-900 text-lg group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                  <span>{{ item.sellerId.firstName }} {{ item.sellerId.lastName?.[0] }}.</span>
                  <span class="text-xs text-brand-500 font-bold">view profile →</span>
                </p>
                <p class="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck v-if="item.sellerId.isVerified" class="w-4 h-4 text-green-500" /> {{ item.sellerId.isVerified ? 'Verified Student' : 'Student' }}
                </p>
              </div>
            </NuxtLink>
            <div class="text-right" v-if="hasFinalisedPayment && item.sellerId.hostel">
              <p class="text-xs font-bold text-slate-400 uppercase">Hostel</p>
              <p class="font-bold text-slate-900">{{ item.sellerId.hostel }}</p>
            </div>
            <div class="text-right" v-else-if="isOwner && item.sellerId.hostel">
              <p class="text-xs font-bold text-slate-400 uppercase">Hostel (Your Listing)</p>
              <p class="font-bold text-slate-900">{{ item.sellerId.hostel }}</p>
            </div>
            <div class="text-right" v-else>
              <p class="text-xs font-bold text-slate-400 uppercase">Exact Address</p>
              <p class="text-xs font-bold text-amber-700 flex items-center justify-end gap-1">
                <Lock class="w-3 h-3" /> Locked until payment
              </p>
            </div>
          </div>

          <!-- Unlocked Escrow Confirmation for Buyer -->
          <div v-if="hasFinalisedPayment" class="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="font-black text-emerald-900 text-sm flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-emerald-600" /> Payment Finalised in Escrow 🔒
              </span>
              <NuxtLink to="/escrow" class="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline">
                View in Escrow Dashboard →
              </NuxtLink>
            </div>
            <p class="text-xs text-emerald-800/90 mb-3">
              Your funds are safely held in escrow. Seller pickup location and contact details are unlocked:
            </p>
            <div class="bg-white/80 p-3 rounded-xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-slate-400 font-bold block uppercase text-[10px]">Pickup Location</span>
                <span class="font-black text-slate-900">{{ item.location }}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold block uppercase text-[10px]">Hostel</span>
                <span class="font-black text-slate-900">{{ item.sellerId?.hostel || 'Campus' }}</span>
              </div>
            </div>
          </div>

          <!-- Anti-Circumvention Student Safety Banner (When not paid) -->
          <div v-else-if="!isOwner" class="mb-6 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Lock class="w-4 h-4" />
            </div>
            <div class="text-xs text-amber-900 space-y-1">
              <p class="font-bold">Student Escrow Anti-Scam Notice</p>
              <p class="text-amber-800/90 leading-relaxed">
                Exact pickup room number and seller contact details are locked. You need to pay inside the app through Escrow to see the exact location of this item. This prevents scams and protects your money until you inspect your item.
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 mt-auto" v-if="!isOwner">
            <!-- Sold Out Notice -->
            <div v-if="item.status === 'sold'" class="w-full bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-center">
              <p class="font-black text-sm flex items-center justify-center gap-1.5 mb-1">
                <X class="w-4 h-4 text-red-600 stroke-[3]" /> This item has already been SOLD OUT
              </p>
              <p class="text-xs text-red-600 font-medium mb-3">Another student has completed payment for this item.</p>
              <button @click="startChat" class="px-4 py-2 bg-white border border-red-200 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100/50 transition-colors inline-flex items-center gap-1.5">
                <MessageCircle class="w-3.5 h-3.5" /> Message Seller for Similar Items
              </button>
            </div>

            <!-- In Escrow Notice -->
            <div v-else-if="item.status === 'pending'" class="w-full bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-center">
              <p class="font-black text-sm flex items-center justify-center gap-1.5 mb-1">
                <Lock class="w-4 h-4 text-amber-600 stroke-[2.5]" /> Reserved in Escrow
              </p>
              <p class="text-xs text-amber-700 font-medium mb-3">A trade is currently underway. If the trade is not completed, this item will reopen.</p>
              <button @click="startChat" class="px-4 py-2 bg-white border border-amber-200 text-amber-800 font-bold text-xs rounded-xl hover:bg-amber-100/50 transition-colors inline-flex items-center gap-1.5">
                <MessageCircle class="w-3.5 h-3.5" /> Chat Seller
              </button>
            </div>

            <!-- Available: Sell Type (Buy Flow) -->
            <template v-else-if="item.type === 'sell'">
              <button @click="startChat" class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-xs">
                <MessageCircle class="w-5 h-5 text-brand-600" /> Chat Seller
              </button>
              <NuxtLink :to="'/checkout?itemId=' + item._id" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors shadow-sm">
                <ShoppingCart class="w-5 h-5" /> Buy via Escrow
              </NuxtLink>
            </template>

            <!-- Available: Swap Type (Chat + Propose Swap) -->
            <template v-else-if="item.type === 'swap'">
              <button @click="startChat" class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-xs">
                <MessageCircle class="w-5 h-5 text-brand-600" /> Chat with Trader
              </button>
              <div v-if="hasPendingOffer" class="flex-1 bg-amber-50 border border-amber-200 text-amber-800 font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-center px-4 text-xs sm:text-sm">
                <AlertTriangle class="w-4 h-4 flex-shrink-0 text-amber-600" /> Offer Sent (Pending)
              </div>
              <button v-else @click="startSwapProposal" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors shadow-sm">
                <Repeat class="w-5 h-5" /> Propose Swap
              </button>
            </template>

            <!-- Available: Service Type -->
            <template v-else-if="item.type === 'service'">
              <button @click="startChat" class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-xs">
                <MessageCircle class="w-5 h-5 text-brand-600" /> Message Provider
              </button>
              <NuxtLink :to="'/checkout?itemId=' + item._id" class="flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors shadow-sm">
                <Briefcase class="w-5 h-5" /> Book via Escrow
              </NuxtLink>
            </template>
          </div>

          <!-- Owner View (Cannot propose swap on own listing) -->
          <div v-else class="mt-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2">
            <p class="font-black text-slate-900 flex items-center justify-center gap-2 text-base">
              <ShieldCheck class="w-5 h-5 text-brand-600" />
              This is your listing
            </p>
            <p class="text-xs text-slate-500 font-medium">You uploaded this item for swap. Propose swap is disabled for your own listing.</p>
            <div class="pt-2 flex items-center justify-center gap-2.5">
              <NuxtLink to="/dashboard/listings" class="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors">
                Manage Listing
              </NuxtLink>
              <NuxtLink to="/dashboard/offers?tab=received" class="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl transition-colors shadow-xs">
                View Received Offers
              </NuxtLink>
            </div>
          </div>
          
          <p v-if="item.type !== 'swap' && !isOwner" class="text-center mt-4 text-sm font-bold text-slate-400 flex items-center justify-center gap-1">
            <Lock class="w-3 h-3" /> Payments secured by Erranders Escrow
          </p>
          
        </div>
        
        
      </div>
      <button
        v-if="item"
        class="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors"
        @click="reportOpen = true"
      >
        <Flag class="w-3.5 h-3.5" /> Report this listing
      </button>

      <!-- Other Related Products Section (Keeps users engaged on platform to keep using declutter) -->
      <section v-if="relatedItems.length > 0" class="mt-14 pt-10 border-t border-slate-200">
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/60">
                Keep Exploring
              </span>
              <span class="text-xs font-bold text-slate-400">Campus Deals</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Other Related Products</span>
              <Sparkles class="w-5 h-5 text-brand-600 hidden sm:inline" />
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              More student declutter bargains, swaps, and campus listings you might like
            </p>
          </div>
          <NuxtLink to="/explore" class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 font-bold text-xs rounded-xl transition-all">
            <span>Explore All</span>
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- 2 Per Row on Mobile, 3 on Tablet, 4 on Desktop -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <NuxtLink 
            v-for="rel in relatedItems" 
            :key="rel._id" 
            :to="'/item/' + rel._id" 
            class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-500 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
          >
            <!-- Image Section -->
            <div class="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
              <img 
                :src="rel.images?.[0] || '/no-image.png'" 
                :alt="rel.title" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />

              <!-- Type Badge -->
              <div class="absolute top-2 left-2 flex items-center gap-1 z-10 flex-wrap">
                <span 
                  class="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-black border backdrop-blur"
                  :class="rel.type === 'swap' ? 'bg-amber-50/90 text-amber-700 border-amber-200' : 'bg-white/95 text-slate-800 border-slate-200 shadow-2xs'"
                >
                  {{ rel.type === 'swap' ? 'Swap' : 'Buy' }}
                </span>
                <span v-if="rel.batchId" class="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-brand-600 text-white shadow-2xs">
                  Declutter
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-3 sm:p-4">
              <div class="flex items-baseline justify-between gap-1 mb-1">
                <span class="font-black text-brand-600 text-xs sm:text-base">
                  {{ rel.type === 'swap' ? 'Swap Item' : '₦' + Number(rel.price || 0).toLocaleString() }}
                </span>
                <span v-if="rel.category" class="text-[10px] font-bold text-slate-400 truncate max-w-[80px]">
                  {{ rel.category?.name || rel.category }}
                </span>
              </div>

              <h4 class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-brand-600 transition-colors">
                {{ rel.title }}
              </h4>

              <div class="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1.5 truncate">
                <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
                <span class="truncate">{{ getGeneralCampusLocation(rel.location) }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Mobile Explore All Button -->
        <div class="mt-6 sm:hidden text-center">
          <NuxtLink to="/explore" class="inline-flex items-center justify-center gap-2 w-full py-3 bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs rounded-xl hover:bg-brand-100 transition-colors">
            <span>Explore All Campus Listings</span>
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </section>

      <ReportModal :target="reportTarget" @close="reportOpen = false" />

      <AuthModal :isOpen="isAuthModalOpen" @close="isAuthModalOpen = false" @success="handleAuthSuccess" />
      <ProposeSwapModal 
        v-if="item" 
        :isOpen="isSwapModalOpen" 
        :targetItem="item" 
        @close="isSwapModalOpen = false"
        @success="handleSwapSuccess"
      />
    </div>
  </main>
</template>
<script setup>
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  ShoppingCart, 
  Lock, 
  Maximize, 
  X, 
  PlayCircle, 
  Repeat, 
  Briefcase, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flag
} from 'lucide-vue-next'
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itemsApi, offersApi, escrowApi } from '~/composables/useApi'
import { optimizeVideoUrl, optimizeImageUrl } from '~/composables/useMediaOptimize'

import AuthModal from '~/components/AuthModal.vue'
import ProposeSwapModal from '~/components/ProposeSwapModal.vue'
import ReportModal from '~/components/ReportModal.vue'

import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, user } = useAuth()

const currentUserId = computed(() => user.value?._id || user.value?.id || '')
const itemSellerId = computed(() => {
  if (!item.value?.sellerId) return ''
  if (typeof item.value.sellerId === 'object') {
    return item.value.sellerId._id || item.value.sellerId.id || ''
  }
  return String(item.value.sellerId)
})
const isOwner = computed(() => {
  if (!currentUserId.value || !itemSellerId.value) return false
  return String(currentUserId.value) === String(itemSellerId.value)
})

const isAuthModalOpen = ref(false)
const isSwapModalOpen = ref(false)
const item = ref(null)
const hasFinalisedPayment = ref(false)
const userEscrowTx = ref(null)

const canViewSellerPickupAndContacts = computed(() => {
  return isOwner.value || hasFinalisedPayment.value
})

const getGeneralCampusLocation = (loc) => {
  if (!loc) return 'Campus Pickup';
  // Strip room numbers, flat numbers, block numbers, digits
  const cleaned = String(loc)
    .replace(/(?:room|rm|block|door|flat|no\.?|apt|apartment)\s*#?\d+[a-z]?/gi, '')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*$/g, '')
    .trim();

  if (!cleaned || /^\d+$/.test(cleaned)) {
    return 'Campus Pickup';
  }
  return `${cleaned} (Exact address locked)`;
}

const checkEscrowStatus = async () => {
  if (!isLoggedIn.value || !route.params.id) {
    hasFinalisedPayment.value = false
    userEscrowTx.value = null
    return
  }
  try {
    const { data } = await escrowApi.myTransactions()
    if (Array.isArray(data)) {
      const match = data.find(
        (tx) =>
          String(tx.itemId) === String(route.params.id) &&
          (tx.status === 'held_in_escrow' || tx.status === 'released') &&
          String(tx.buyerId) === String(currentUserId.value)
      )
      if (match) {
        hasFinalisedPayment.value = true
        userEscrowTx.value = match
      }
    }
  } catch (err) {
    console.error('Failed to check escrow status', err)
  }
}

const reportOpen = ref(false)
/** The report modal wants a plain target, so it is derived rather than passed around. */
const reportTarget = computed(() =>
  reportOpen.value && item.value
    ? { type: 'item', id: item.value._id, label: item.value.title }
    : null,
)
const loading = ref(true)

useSeoMeta({
  title: computed(() => item.value ? `${item.value.title} | Decluttered by Erranders` : 'Loading Item...'),
  description: computed(() => item.value ? item.value.description : 'View item details on Decluttered by Erranders.'),
  ogTitle: computed(() => item.value ? item.value.title : 'Decluttered by Erranders Item'),
  ogDescription: computed(() => item.value ? item.value.description : 'View item details on Decluttered by Erranders.'),
  ogImage: computed(() => item.value && item.value.images?.[0] ? item.value.images[0] : ''),
})

const mediaGallery = ref([])
const activeMedia = ref(null)
const isZoomOpen = ref(false)

const hasVideo = computed(() => mediaGallery.value.some(m => m.type === 'video'))
const has360Video = computed(() => mediaGallery.value.some(m => m.is360))

const playFirstVideo = () => {
  const videoMedia = mediaGallery.value.find(m => m.type === 'video' && !m.is360) || mediaGallery.value.find(m => m.type === 'video')
  if (videoMedia) {
    activeMedia.value = videoMedia
  }
}

const play360Video = () => {
  const vid360 = mediaGallery.value.find(m => m.is360)
  if (vid360) {
    activeMedia.value = vid360
  }
}

const startChat = () => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return
  }
  const sellerId = itemSellerId.value || item.value?.sellerId?._id || item.value?.sellerId
  router.push('/chat?sellerId=' + sellerId + '&itemId=' + item.value?._id)
}

const startSwapProposal = () => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return
  }
  isSwapModalOpen.value = true
}

const handleAuthSuccess = () => {
  isAuthModalOpen.value = false
  if (isLoggedIn.value) {
    fetchMyOffers()
    checkEscrowStatus()
  }
}

const handleSwapSuccess = () => {
  isSwapModalOpen.value = false
  router.push('/dashboard/offers')
}

const mySentOffers = ref([])
const hasPendingOffer = computed(() => {
  if (!mySentOffers.value || mySentOffers.value.length === 0) return false;
  return mySentOffers.value.some(offer => offer.targetItemId?._id === item.value?._id && offer.status === 'pending')
})

const fetchMyOffers = async () => {
  if (!isLoggedIn.value) return;
  try {
    const { data } = await offersApi.getMyOffers()
    if (data) mySentOffers.value = data
  } catch (err) {}
}

const fetchItem = async () => {
  try {
    const { data, error } = await itemsApi.getById(route.params.id)
    if (error) {
      console.error(error)
      return
    }
    
    item.value = data
    
    // Construct media gallery with intelligent type detection and aggressive optimization
    const gallery = []
    const rawImages = (data.images || []).filter(Boolean)
    const rawVideos = (data.videos || []).filter(Boolean)

    // Prepend 360 walkaround video if present
    if (data.video360) {
      gallery.push({
        type: 'video',
        is360: true,
        src: optimizeVideoUrl(data.video360),
        label: '360° Walkaround View'
      })
    }

    rawImages.forEach((img) => {
      const isVid = img.includes('/video/upload/') || /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(img)
      if (isVid) {
        gallery.push({ type: 'video', is360: false, src: optimizeVideoUrl(img) })
      } else {
        gallery.push({ type: 'image', is360: false, src: optimizeImageUrl(img) })
      }
    })

    rawVideos.forEach((vid) => {
      const optimizedVid = optimizeVideoUrl(vid)
      if (!gallery.some(g => g.src === optimizedVid || g.src === vid)) {
        gallery.push({ type: 'video', is360: false, src: optimizedVid })
      }
    })

    if (gallery.length === 0) {
      gallery.push({ type: 'image', src: '/no-image.png' })
    }

    mediaGallery.value = gallery
    activeMedia.value = gallery[0]

    // Fetch related products to keep user engaged on platform
    fetchRelatedItems()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const relatedItems = ref([])
const loadingRelated = ref(false)

const fetchRelatedItems = async () => {
  if (!item.value) return
  loadingRelated.value = true
  try {
    const currentId = String(item.value._id || route.params.id)
    const categoryParam = item.value.category?._id || (typeof item.value.category === 'string' ? item.value.category : null)
    
    let found = []
    if (categoryParam) {
      try {
        const { data } = await itemsApi.list({ category: categoryParam, limit: 10, status: 'active' })
        const list = data?.data || data || []
        found = list.filter(it => String(it._id) !== currentId)
      } catch (e) {
        // fallback
      }
    }

    if (found.length < 4) {
      try {
        const { data } = await itemsApi.list({ limit: 12, status: 'active' })
        const generalList = data?.data || data || []
        const combined = [...found]
        for (const it of generalList) {
          if (String(it._id) !== currentId && !combined.some(x => String(x._id) === String(it._id))) {
            combined.push(it)
          }
        }
        found = combined
      } catch (e) {
        // fallback
      }
    }

    relatedItems.value = found.slice(0, 8)
  } catch (err) {
    console.error('Failed to fetch related items:', err)
  } finally {
    loadingRelated.value = false
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    fetchItem()
    if (isLoggedIn.value) {
      fetchMyOffers()
      checkEscrowStatus()
    }
  }
})

onMounted(() => {
  fetchItem()
  if (isLoggedIn.value) {
    fetchMyOffers()
    checkEscrowStatus()
  }
})

// 4D Zoom Logic
const zoomLevel = ref(1)
const zoomOriginX = ref(50)
const zoomOriginY = ref(50)

const handleZoomMove = (e) => {
  zoomLevel.value = 2.5
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - left) / width) * 100
  const y = ((e.clientY - top) / height) * 100
  zoomOriginX.value = x
  zoomOriginY.value = y
}

const resetZoom = () => {
  zoomLevel.value = 1
  zoomOriginX.value = 50
  zoomOriginY.value = 50
}
</script>
<style>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>