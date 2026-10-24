<template>
  <main class="min-h-screen bg-slate-50/60 pb-20 pt-4 sm:pt-6">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Top Navigation & Badge Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3.5">
          <NuxtLink to="/explore?type=swap" class="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-all">
            <ArrowLeft class="w-5 h-5" />
          </NuxtLink>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">List Item for Swap</h1>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-600 border border-brand-200">
                Peer-to-Peer
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 font-medium">Trade what you have for what you need with verified campus peers. No cash required.</p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs self-start sm:self-auto">
          <ShieldCheck class="w-4 h-4 text-emerald-500" />
          <span>Verified Student Trade Network</span>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="success" class="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg text-center animate-in zoom-in-95 duration-200">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Check class="w-8 h-8 stroke-[3]" />
        </div>
        <h2 class="text-xl font-black text-slate-900 mb-1">Swap Listing Published! 🚀</h2>
        <p class="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
          Your swap item is now live in the marketplace with photos, functional video, and verified 360° walkaround inspection.
        </p>
        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink to="/explore?type=swap" class="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2">
            <Sparkles class="w-4 h-4" /> Browse Swap Feed
          </NuxtLink>
          <NuxtLink to="/dashboard/listings" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center">
            Manage in Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Main Layout: 2 Columns (Form on left, Live Marketplace Preview & Trust Guide on right) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left: Form Section (7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <form @submit.prevent="submitListing" class="space-y-6">
            
            <!-- Section 1: Item Identification -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div class="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-black">1</div>
                <h2 class="text-sm font-black text-slate-900 uppercase tracking-wide">Item Details & Swap Wishlist</h2>
              </div>

              <!-- Title -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  What item do you have to offer? <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  required
                  type="text"
                  placeholder="e.g. Single Bunk (Solid Wood) or PlayStation 5"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              <!-- Swap Wishlist (Highlighted) -->
              <div class="bg-gradient-to-br from-brand-50/70 to-orange-50/50 p-4 rounded-2xl border border-brand-200 space-y-1.5">
                <label class="block text-xs font-black text-brand-900 uppercase tracking-wide flex items-center gap-1.5">
                  <ArrowRightLeft class="w-4 h-4 text-brand-600" />
                  What specific item do you want in return? <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.swapPreference"
                  required
                  type="text"
                  placeholder="e.g. Double Bunk, Standing Fan, or iPhone 13"
                  class="w-full bg-white border border-brand-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-brand-950 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
                />
                <p class="text-[11px] font-semibold text-brand-800">
                  Tip: Be specific! The clearer your swap wishlist is, the faster prospective campus peers match with you.
                </p>
              </div>

              <!-- Estimated Valuation Benchmark & Category -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    Estimated Valuation Benchmark (₦)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₦</span>
                    <input
                      v-model.number="form.price"
                      type="number"
                      min="0"
                      step="500"
                      placeholder="e.g. 25,000"
                      class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
                    />
                  </div>
                  <span class="text-[10px] text-slate-400 font-medium">Helps both parties gauge fair deal balance</span>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.category"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-brand-600 transition-all"
                  >
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
              </div>

              <!-- Description & Details -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  Item Condition & Inclusions
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Describe physical condition, any scratches, how long used, and any accessories included with the swap..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all resize-none placeholder:text-slate-400 font-medium leading-relaxed"
                />
              </div>

              <!-- Location -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Campus Location / Hostel <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-600" />
                  <input
                    v-model="form.location"
                    required
                    type="text"
                    placeholder="e.g. Block 3 room 321, Moremi Hall, or Silver Hostel"
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Section 2: Compulsory Media Inspection (Photos, Standard Video, 360° Walkaround) -->
            <div class="space-y-4 pt-2 border-t border-slate-100">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-black">2</div>
                  <h2 class="text-sm font-black text-slate-900 uppercase tracking-wide">Compulsory Media Inspection</h2>
                </div>
                <span class="text-[11px] font-black uppercase text-amber-700 bg-amber-100/70 border border-amber-300 px-2.5 py-0.5 rounded-full self-start">
                  All 3 Formats Required 🛡️
                </span>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed font-medium">
                To eliminate trade fraud and mismatched conditions on campus, every swap listing requires <strong>photos</strong>, a <strong>working video</strong>, and a <strong>360° walkaround video</strong>.
              </p>

              <!-- Media Upload Grid: 3 Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                <!-- 1. Photos Card (Compulsory) -->
                <div class="bg-slate-50/70 border-2 rounded-2xl p-3.5 flex flex-col justify-between transition-all"
                     :class="form.images.length > 0 ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <Camera class="w-3.5 h-3.5 text-brand-600" />
                        Photos
                      </span>
                      <span v-if="form.images.length > 0" class="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check class="w-3 h-3 stroke-[3]" /> {{ form.images.length }}/6
                      </span>
                      <span v-else class="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                        Required
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-500 font-medium leading-snug mb-3">
                      High-res photos from front and back.
                    </p>

                    <!-- Thumbnail strip -->
                    <div v-if="form.images.length > 0" class="grid grid-cols-3 gap-1.5 mb-2">
                      <div v-for="(img, idx) in form.images" :key="idx" class="aspect-square rounded-lg border border-slate-200 overflow-hidden relative group">
                        <img :src="img" class="w-full h-full object-cover" />
                        <button
                          type="button"
                          @click="form.images.splice(idx, 1)"
                          class="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Upload Trigger -->
                  <label v-if="form.images.length < 6" class="w-full py-2.5 px-3 rounded-xl border border-dashed border-brand-400 bg-white hover:bg-brand-50/60 text-brand-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center mt-2">
                    <Loader2 v-if="uploadingPhoto" class="w-3.5 h-3.5 animate-spin" />
                    <Upload v-else class="w-3.5 h-3.5" />
                    <span>{{ uploadingPhoto ? 'Uploading...' : 'Add Photos' }}</span>
                    <input type="file" accept="image/*" multiple class="hidden" @change="uploadPhotos" :disabled="uploadingPhoto" />
                  </label>
                </div>

                <!-- 2. Product Video Card (Compulsory) -->
                <div class="bg-slate-50/70 border-2 rounded-2xl p-3.5 flex flex-col justify-between transition-all"
                     :class="form.video ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <Video class="w-3.5 h-3.5 text-brand-600" />
                        Working Video
                      </span>
                      <span v-if="form.video" class="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check class="w-3 h-3 stroke-[3]" /> Added
                      </span>
                      <span v-else class="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                        Required
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-500 font-medium leading-snug mb-3">
                      Clip proving functionality and working state.
                    </p>

                    <!-- Video Preview -->
                    <div v-if="form.video" class="aspect-video rounded-lg overflow-hidden bg-black relative mb-2 group">
                      <video :src="form.video" controls class="w-full h-full object-cover"></video>
                      <button
                        type="button"
                        @click="form.video = ''"
                        class="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
                        title="Remove Video"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <!-- Upload Trigger -->
                  <label v-if="!form.video" class="w-full py-2.5 px-3 rounded-xl border border-dashed border-brand-400 bg-white hover:bg-brand-50/60 text-brand-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center mt-2">
                    <Loader2 v-if="uploadingVideo" class="w-3.5 h-3.5 animate-spin" />
                    <Upload v-else class="w-3.5 h-3.5" />
                    <span>{{ uploadingVideo ? 'Uploading...' : 'Upload Video' }}</span>
                    <input type="file" accept="video/*" class="hidden" @change="uploadStandardVideo" :disabled="uploadingVideo" />
                  </label>
                </div>

                <!-- 3. 360° Walkaround Video Card (Compulsory) -->
                <div class="bg-slate-50/70 border-2 rounded-2xl p-3.5 flex flex-col justify-between transition-all"
                     :class="form.video360 ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <RotateCcw class="w-3.5 h-3.5 text-brand-600" />
                        360° Walkaround
                      </span>
                      <span v-if="form.video360" class="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check class="w-3 h-3 stroke-[3]" /> Verified
                      </span>
                      <span v-else class="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                        Compulsory
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-500 font-medium leading-snug mb-3">
                      Slow 360° rotation showing all corners & edges.
                    </p>

                    <!-- 360 Video Preview -->
                    <div v-if="form.video360" class="aspect-video rounded-lg overflow-hidden bg-black relative mb-2 group">
                      <video :src="form.video360" controls class="w-full h-full object-cover"></video>
                      <span class="absolute top-1.5 left-1.5 bg-brand-600/90 backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                        360° View
                      </span>
                      <button
                        type="button"
                        @click="form.video360 = ''"
                        class="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors"
                        title="Remove 360 Video"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <!-- Upload Trigger -->
                  <label v-if="!form.video360" class="w-full py-2.5 px-3 rounded-xl border border-dashed border-brand-400 bg-white hover:bg-brand-50/60 text-brand-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center mt-2">
                    <Loader2 v-if="uploading360" class="w-3.5 h-3.5 animate-spin" />
                    <RotateCcw v-else class="w-3.5 h-3.5" />
                    <span>{{ uploading360 ? 'Uploading 360°...' : 'Record / Upload 360°' }}</span>
                    <input type="file" accept="video/*" class="hidden" @change="upload360Video" :disabled="uploading360" />
                  </label>
                </div>

              </div>

              <!-- Live Inspection Validation Banner -->
              <div v-if="!isMediaValid" class="p-3 bg-amber-50 border border-amber-200/90 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p class="text-[11px] leading-relaxed">
                  <strong>Compulsory inspection media incomplete:</strong> Please attach
                  <span class="font-extrabold underline">{{ missingMediaLabels.join(', ') }}</span> before publishing your swap item.
                </p>
              </div>
            </div>

            <!-- Optional Promotion Toggle -->
            <div v-if="promotedFee > 0" class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-100/70 transition-colors" @click="form.promote = !form.promote">
              <div class="mt-1">
                <div class="w-5 h-5 rounded-md border flex items-center justify-center transition-colors"
                     :class="form.promote ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'">
                  <Check v-if="form.promote" class="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-xs font-black text-slate-900">Pin to Top of Swap Feed</h4>
                  <span class="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">Boosted</span>
                </div>
                <p class="text-[11px] text-slate-500 font-medium mt-0.5">
                  Get 4x more trade inquiries by featuring your listing at the top of the campus feed. Fee: ₦{{ promotedFee.toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Submit Button with Reactive Status -->
            <div>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md"
                :class="isFormValid ? 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/25 cursor-pointer' : 'bg-slate-300 cursor-not-allowed text-slate-500'"
              >
                <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
                <ArrowRightLeft v-else class="w-5 h-5" />
                <span v-if="!isFormValid">
                  Attach Compulsory Media to Publish
                </span>
                <span v-else>
                  {{ loading ? 'Publishing Swap Listing...' : `Publish Swap Listing ${form.promote ? '(₦' + promotedFee.toLocaleString() + ')' : 'Free 🚀'}` }}
                </span>
              </button>
            </div>

          </form>
        </div>

        <!-- Right: Live Marketplace Preview & Trust Guide (5 cols) -->
        <div class="lg:col-span-5 space-y-5 sticky top-24">
          
          <!-- Live Preview Card (What other students see) -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <span class="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles class="w-4 h-4 text-brand-600" /> Live Feed Preview
              </span>
              <span class="text-[10px] font-extrabold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                Peer View
              </span>
            </div>

            <!-- Preview Card Box -->
            <div class="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 shadow-2xs">
              <!-- Visual Media Area -->
              <div class="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                <!-- Video or 360 preview if uploaded -->
                <video v-if="form.video360" :src="form.video360" autoplay muted loop playsinline class="w-full h-full object-cover"></video>
                <video v-else-if="form.video" :src="form.video" autoplay muted loop playsinline class="w-full h-full object-cover"></video>
                <img v-else-if="form.images.length > 0" :src="form.images[0]" class="w-full h-full object-cover" />
                <div v-else class="text-center p-4 text-slate-500">
                  <Camera class="w-8 h-8 mx-auto mb-1 opacity-40 text-white" />
                  <p class="text-xs text-slate-400 font-bold">Media Preview Window</p>
                </div>

                <!-- Overlays -->
                <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span class="bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-slate-800 shadow-xs">
                    FOR SWAP
                  </span>
                  <span v-if="form.video360" class="bg-brand-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-xs flex items-center gap-1">
                    <RotateCcw class="w-3 h-3" /> 360° Walkaround
                  </span>
                </div>

                <div v-if="form.images.length > 1" class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-white">
                  +{{ form.images.length - 1 }} more photo(s)
                </div>
              </div>

              <!-- Content Area -->
              <div class="p-4 bg-white space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-extrabold text-sm text-slate-900 truncate">
                    {{ form.title || 'Your Item Title (e.g. Single Bunk)' }}
                  </h3>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    {{ form.category }}
                  </span>
                </div>

                <!-- Swap Wishlist Box -->
                <div class="p-2.5 rounded-xl bg-brand-50/70 border border-brand-100 flex items-start gap-2">
                  <Repeat class="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <div class="min-w-0 flex-1">
                    <span class="text-[9px] font-black uppercase tracking-wider text-brand-700 block">Wants in exchange:</span>
                    <p class="text-xs font-black text-slate-900 truncate">
                      {{ form.swapPreference || 'Specify desired swap item...' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs pt-1 text-slate-500 font-semibold">
                  <span class="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin class="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    {{ form.location || 'Your campus location' }}
                  </span>
                  <span v-if="form.price" class="font-black text-slate-900">
                    ₦{{ Number(form.price).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Preview Notice -->
            <p class="text-[11px] text-slate-400 font-medium text-center">
              Peers can initiate in-app chat or propose an official trade offer with their items.
            </p>
          </div>

          <!-- Swap Flow Explained Card -->
          <div class="bg-gradient-to-br from-brand-50 to-orange-50/60 rounded-3xl p-5 sm:p-6 border border-brand-100 space-y-4">
            <h3 class="text-sm font-black text-brand-950 flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-brand-600" />
              How Campus Swapping Works
            </h3>

            <div class="space-y-3.5 text-xs">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 shrink-0 text-xs shadow-2xs">
                  1
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">List with 360° Media</h4>
                  <p class="text-slate-600 mt-0.5">Your photos, function video, and 360° walkaround prove genuine condition.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 shrink-0 text-xs shadow-2xs">
                  2
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">Receive & Review Offers</h4>
                  <p class="text-slate-600 mt-0.5">Peers propose items from their inventory with cash balancing if values differ.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 shrink-0 text-xs shadow-2xs">
                  3
                </div>
                <div>
                  <h4 class="font-bold text-slate-900">Chat & Confirm Handover</h4>
                  <p class="text-slate-600 mt-0.5">Use in-app chat to inspect, agree terms, and complete swap on campus.</p>
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-brand-200/60 flex items-center gap-2 text-[11px] font-bold text-emerald-800">
              <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Campus Security Tip: Always swap in designated hostel halls or campus common areas.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </main>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import {
  ArrowLeft,
  ArrowRightLeft,
  Upload,
  X,
  Check,
  Loader2,
  Sparkles,
  ShieldCheck,
  MapPin,
  Camera,
  Video,
  RotateCcw,
  Repeat,
  AlertCircle,
} from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { upload_api, itemsApi, settingsApi } from '~/composables/useApi';
import { optimizeVideoUrl, optimizeImageUrl } from '~/composables/useMediaOptimize';
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const { user } = useAuth();

useSeoMeta({
  title: 'List Item for Swap | Decluttered by Erranders',
  description: 'Trade what you have for what you need with verified campus peers. 360 inspection verified.',
  ogTitle: 'List Item for Swap | Decluttered by Erranders',
});

const categories = [
  'Furniture',
  'Appliances',
  'Electronics',
  'Academics',
  'Kitchen',
  'Fashion',
  'General',
];

const form = ref({
  title: '',
  description: '',
  swapPreference: '',
  price: 0,
  category: 'Furniture',
  location: user.value?.hostel || '',
  type: 'swap',
  images: [],
  video: '',
  video360: '',
  promote: false,
});

const loading = ref(false);
const uploadingPhoto = ref(false);
const uploadingVideo = ref(false);
const uploading360 = ref(false);
const success = ref(false);
const promotedFee = ref(0);

onMounted(async () => {
  if (typeof window !== 'undefined' && !window.PaystackPop) {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    document.head.appendChild(script);
  }

  try {
    const { data } = await settingsApi.get('promoted_listing_fee');
    if (data && data.value) promotedFee.value = Number(data.value);
  } catch (e) {
    // Non-blocking
  }
});

// Media validation requirements
const isMediaValid = computed(() => {
  return form.value.images.length > 0 && !!form.value.video && !!form.value.video360;
});

const missingMediaLabels = computed(() => {
  const missing = [];
  if (form.value.images.length === 0) missing.push('Photos (min 1)');
  if (!form.value.video) missing.push('Working Video');
  if (!form.value.video360) missing.push('360° Walkaround Video');
  return missing;
});

const isFormValid = computed(() => {
  return (
    form.value.title.trim().length > 0 &&
    form.value.swapPreference.trim().length > 0 &&
    form.value.location.trim().length > 0 &&
    isMediaValid.value
  );
});

// Upload Handlers
const uploadPhotos = async (e) => {
  const target = e.target;
  const files = target.files ? Array.from(target.files) : [];
  if (!files.length) return;

  uploadingPhoto.value = true;
  try {
    for (const file of files) {
      if (form.value.images.length >= 6) break;
      const res = await upload_api.uploadFile(file, 'image');
      const url = res.data?.url || res.data?.data?.url;
      if (url) {
        form.value.images.push(optimizeImageUrl(url));
      }
    }
    useCustomToast().showToast({
      title: 'Photos Uploaded! 📸',
      message: `${form.value.images.length} photo(s) attached.`,
      toastType: 'success',
    });
  } catch (err) {
    useCustomToast().showToast({
      title: 'Upload Failed',
      message: 'Could not upload photo. Please try again.',
      toastType: 'error',
    });
  } finally {
    uploadingPhoto.value = false;
    target.value = '';
  }
};

const uploadStandardVideo = async (e) => {
  const target = e.target;
  const file = target.files?.[0];
  if (!file) return;

  uploadingVideo.value = true;
  try {
    const res = await upload_api.uploadFile(file, 'video');
    const url = res.data?.url || res.data?.data?.url;
    if (url) {
      form.value.video = optimizeVideoUrl(url);
      useCustomToast().showToast({
        title: 'Working Video Uploaded! 🎥',
        message: 'Product functionality video verified.',
        toastType: 'success',
      });
    }
  } catch (err) {
    useCustomToast().showToast({
      title: 'Upload Failed',
      message: 'Could not upload video. Please ensure file is valid video format.',
      toastType: 'error',
    });
  } finally {
    uploadingVideo.value = false;
    target.value = '';
  }
};

const upload360Video = async (e) => {
  const target = e.target;
  const file = target.files?.[0];
  if (!file) return;

  uploading360.value = true;
  try {
    const res = await upload_api.uploadFile(file, 'video');
    const url = res.data?.url || res.data?.data?.url;
    if (url) {
      form.value.video360 = optimizeVideoUrl(url);
      useCustomToast().showToast({
        title: '360° Walkaround Uploaded! 🔄',
        message: '360-degree inspection video attached.',
        toastType: 'success',
      });
    }
  } catch (err) {
    useCustomToast().showToast({
      title: 'Upload Failed',
      message: 'Could not upload 360° video. Please try again.',
      toastType: 'error',
    });
  } finally {
    uploading360.value = false;
    target.value = '';
  }
};

const createItemOnBackend = async () => {
  loading.value = true;
  try {
    const allVideos = [];
    if (form.value.video) allVideos.push(form.value.video);
    if (form.value.video360 && !allVideos.includes(form.value.video360)) {
      allVideos.push(form.value.video360);
    }

    const payload = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      swapPreference: form.value.swapPreference.trim(),
      price: Number(form.value.price || 0),
      category: form.value.category,
      location: form.value.location.trim(),
      type: 'swap',
      images: form.value.images,
      videos: allVideos,
      video360: form.value.video360,
      isPromoted: form.value.promote,
    };

    const { data, error } = await itemsApi.create(payload);
    if (error) {
      useCustomToast().showToast({ title: 'Error', message: error, toastType: 'error' });
      loading.value = false;
    } else {
      success.value = true;
      setTimeout(() => router.push('/explore?type=swap'), 1500);
    }
  } catch (err) {
    useCustomToast().showToast({
      title: 'Listing Failed',
      message: 'Failed to list item for swap. Please check all fields.',
      toastType: 'error',
    });
    loading.value = false;
  }
};

const submitListing = async () => {
  if (!user.value) {
    router.push('/login');
    return;
  }

  if (!isFormValid.value) {
    useCustomToast().showToast({
      title: 'Compulsory Media Missing',
      message: `Please upload: ${missingMediaLabels.value.join(', ')}`,
      toastType: 'error',
    });
    return;
  }

  loading.value = true;

  if (form.value.promote && promotedFee.value > 0) {
    if (!window.PaystackPop) {
      useCustomToast().showToast({
        title: 'Notice',
        message: 'Payment system is loading. Please try again.',
        toastType: 'error',
      });
      loading.value = false;
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      email: user.value?.email || 'user@example.com',
      amount: promotedFee.value * 100,
      currency: 'NGN',
      callback: function () {
        createItemOnBackend();
      },
      onClose: function () {
        useCustomToast().showToast({
          title: 'Payment Cancelled',
          message: 'Item was not listed.',
          toastType: 'error',
        });
        loading.value = false;
      },
    });
    handler.openIframe();
  } else {
    await createItemOnBackend();
  }
};
</script>
