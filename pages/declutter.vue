<template>
  <main class="min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-12 font-sans">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      
      <!-- Back Link & Header -->
      <div class="mb-6">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors mb-3"
        >
          <ChevronLeft class="w-4 h-4" />
          <span>Back to Home</span>
        </NuxtLink>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-black uppercase tracking-wider mb-2 border border-brand-200/80 shadow-2xs">
              <Sparkles class="w-3.5 h-3.5 text-brand-600" />
              <span>Automated Hostel Declutter System</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Clear Your Room in 2 Minutes.
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mt-1 leading-relaxed">
              Moving out or graduating? Don't stress or dump valuable appliances. Check off your room inventory, get instant campus valuations, activate rapid-clearance discounts, and publish your room batch in 1-click!
            </p>
          </div>

          <!-- Quick Stats Pill -->
          <div class="flex sm:flex-col items-center sm:items-end justify-between bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-4 sm:py-3 shadow-xs shrink-0">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Room Valuation</span>
            <span class="text-lg sm:text-2xl font-black text-brand-600">
              ₦{{ calculatedValuation.toLocaleString() }}
            </span>
            <span class="text-[11px] font-bold text-slate-500">
              {{ activeItems.length }} item{{ activeItems.length === 1 ? '' : 's' }} selected
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- ── Left Column: Inventory Checklist & Customizer (7 cols) ── -->
        <div class="lg:col-span-7 space-y-6">

          <!-- 1. Room Inventory Checklist -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package class="w-5 h-5 text-brand-600" />
                  <span>1. Check Off Your Room Items</span>
                </h3>
                <p class="text-xs text-slate-400 font-medium">
                  Tap to add common campus hostel items with instant pricing benchmarks.
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="selectAll"
                  class="text-[11px] font-bold text-brand-600 hover:underline"
                >
                  Select All
                </button>
                <span class="text-slate-300">|</span>
                <button
                  type="button"
                  @click="deselectAll"
                  class="text-[11px] font-bold text-slate-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <!-- Preset Inventory Cards Grid -->
            <!-- Preset Inventory Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="preset in presets"
                :key="preset.id"
                @click="togglePreset(preset)"
                class="p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 relative group cursor-pointer"
                :class="[
                  isPresetSelected(preset.id)
                    ? 'bg-brand-50/70 border-brand-500 shadow-xs ring-2 ring-brand-500/20'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                ]"
              >
                <div
                  class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                  :class="[
                    isPresetSelected(preset.id)
                      ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  ]"
                >
                  <Check v-if="isPresetSelected(preset.id)" class="w-4 h-4 stroke-[3]" />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-1">
                    <p class="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                      {{ preset.title }}
                    </p>
                  </div>

                  <!-- Price & Category with Inline Edit Option -->
                  <div class="flex items-center flex-wrap gap-2 mt-1.5">
                    <!-- Editing Mode -->
                    <div
                      v-if="editingPresetId === preset.id"
                      class="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-brand-500 shadow-xs"
                      @click.stop
                    >
                      <span class="text-xs font-black text-brand-600">₦</span>
                      <input
                        type="number"
                        :value="preset.price"
                        @input="updatePresetPrice(preset, ($event.target as HTMLInputElement).value)"
                        @click.stop
                        @keydown.enter.stop="editingPresetId = null"
                        class="w-20 px-1 py-0.5 text-xs font-black text-slate-900 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-brand-600"
                        placeholder="Price"
                        min="0"
                        step="500"
                        autofocus
                      />
                      <button
                        type="button"
                        @click.stop="editingPresetId = null"
                        class="px-2 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded hover:bg-brand-700 transition-colors"
                        title="Done editing price"
                      >
                        Done
                      </button>
                    </div>

                    <!-- Normal Display with Edit Price Option -->
                    <div v-else class="flex items-center gap-1.5">
                      <span class="text-xs font-black text-brand-600">
                        ₦{{ preset.price.toLocaleString() }}
                      </span>
                      <button
                        type="button"
                        @click.stop="startEditPresetPrice(preset.id)"
                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-brand-100 text-slate-600 hover:text-brand-700 text-[10px] font-bold transition-colors"
                        title="Edit price if your item's value differs"
                      >
                        <Pencil class="w-2.5 h-2.5" />
                        <span>Edit Price</span>
                      </button>
                    </div>

                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {{ preset.category }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Custom Item Button -->
            <button
              type="button"
              @click="addCustomItem"
              class="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-500 text-slate-600 hover:text-brand-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors bg-slate-50/50 hover:bg-brand-50/40"
            >
              <Plus class="w-4 h-4" />
              <span>Add Custom Item (e.g. Shoe Rack, Mirror, Curtains)</span>
            </button>
          </div>

          <!-- 2. Selected Items Fine-Tuning & Pricing Details -->
          <div v-if="activeItems.length > 0" class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal class="w-5 h-5 text-brand-600" />
                  <span>2. Review & Adjust Prices</span>
                </h3>
                <p class="text-xs text-slate-400 font-medium">
                  Edit prices or conditions to attract quick campus buyers.
                </p>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100">
                {{ activeItems.length }} item{{ activeItems.length === 1 ? '' : 's' }}
              </span>
            </div>

            <div class="space-y-3.5">
              <div
                v-for="(item, idx) in activeItems"
                :key="item.tempId"
                class="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3 relative"
                :style="{ zIndex: activeItems.length - idx + 10 }"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Item #{{ idx + 1 }} Title
                    </label>
                    <input
                      v-model="item.title"
                      type="text"
                      class="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    @click="removeItem(item.tempId)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 mt-4"
                    title="Remove item"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <!-- Price (3 cols) -->
                  <div class="sm:col-span-3">
                    <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Price (₦)
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-xs font-black text-slate-400">₦</span>
                      <input
                        v-model.number="item.price"
                        type="number"
                        min="500"
                        step="500"
                        class="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-2.5 py-2 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
                      />
                    </div>
                  </div>

                  <!-- Category (4 cols) -->
                  <div class="sm:col-span-4">
                    <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Category
                    </label>
                    <CustomSelect
                      v-model="item.category"
                      :options="categoryOptions"
                      variant="form"
                    />
                  </div>

                  <!-- Condition (5 cols) -->
                  <div class="sm:col-span-5">
                    <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Condition
                    </label>
                    <CustomSelect
                      v-model="item.condition"
                      :options="conditionOptions"
                      variant="form"
                    />
                  </div>
                </div>

                <!-- Photos & Video Upload for Item -->
                <div class="pt-2 border-t border-slate-200/70">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Camera class="w-3 h-3 text-brand-600" />
                      <span>Item Photos & Videos ({{ (item.images?.length || 0) + (item.videos?.length || 0) }})</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium">Real photos sell 3x faster</span>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    <!-- Images -->
                    <div
                      v-for="(imgUrl, imgIdx) in item.images"
                      :key="'img-' + imgIdx"
                      class="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 shrink-0 shadow-2xs"
                    >
                      <img :src="imgUrl" class="w-full h-full object-cover" />
                      <button
                        type="button"
                        @click="item.images.splice(imgIdx, 1)"
                        class="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X class="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <!-- Videos -->
                    <div
                      v-for="(vidUrl, vidIdx) in item.videos"
                      :key="'vid-' + vidIdx"
                      class="relative w-14 h-14 rounded-xl overflow-hidden border border-brand-300 group bg-slate-900 shrink-0 shadow-2xs"
                    >
                      <video :src="vidUrl" class="w-full h-full object-cover" muted playsinline></video>
                      <span class="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-black px-1 rounded">VID</span>
                      <button
                        type="button"
                        @click="item.videos.splice(vidIdx, 1)"
                        class="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove video"
                      >
                        <X class="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <!-- Add Media Button -->
                    <label
                      class="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-500 bg-white hover:bg-brand-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 text-slate-400 hover:text-brand-600"
                      :class="{ 'opacity-50 pointer-events-none': uploadingItemId === item.tempId }"
                    >
                      <Loader2 v-if="uploadingItemId === item.tempId" class="w-4 h-4 animate-spin text-brand-600" />
                      <template v-else>
                        <ImagePlus class="w-4 h-4 mb-0.5" />
                        <span class="text-[9px] font-black leading-tight text-center">Add</span>
                      </template>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        class="hidden"
                        :disabled="uploadingItemId === item.tempId"
                        @change="uploadItemMedia($event, item)"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right Column: Hostel Info & Automation Engine (5 cols) ── -->
        <div class="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          
          <!-- Hostel Location & Clearance Timeline -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin class="w-5 h-5 text-brand-600" />
              <span>3. Hostel & Pickup Details</span>
            </h3>

            <div class="space-y-3.5">
              <!-- Hostel / Campus Name -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  Hostel / Hall of Residence <span class="text-brand-600">*</span>
                </label>
                <input
                  v-model="hostelName"
                  type="text"
                  placeholder="e.g. Moremi Hall, Room 204 or off-campus lodge"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
                />
              </div>

              <!-- Group / Room Declutter Sale Name -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Group Declutter Sale Name</span>
                  <span class="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">Google Photos Album View</span>
                </label>
                <input
                  v-model="groupName"
                  type="text"
                  placeholder="e.g. Room 434 Declutter Sale"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 transition-all"
                />
                <p class="text-[10px] text-slate-400 mt-1 font-medium">
                  Roommates can combine items under one group name. Displays like a stacked Google Photos album on Explore!
                </p>
              </div>

              <!-- Urgency / Clearance Deadline -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  Clearance Urgency
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="u in urgencies"
                    :key="u.id"
                    type="button"
                    @click="urgency = u.id"
                    class="p-2.5 rounded-xl border text-center transition-all text-xs font-bold"
                    :class="[
                      urgency === u.id
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-600/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    ]"
                  >
                    {{ u.label }}
                  </button>
                </div>
              </div>

              <!-- Notes / Description -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  Pickup Instructions
                </label>
                <textarea
                  v-model="batchNotes"
                  rows="2"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10 resize-none transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Automated Rapid-Clearance & Mover Features -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 class="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Zap class="w-5 h-5 text-brand-600" />
              <span>4. Smart Automation Features</span>
            </h3>

            <!-- 48-Hour Bundle Clearance Discount -->
            <div class="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-extrabold text-slate-900">48-Hour Room Bundle Discount</p>
                  <p class="text-[11px] text-slate-500 font-medium">Encourage buyers to buy multiple items at once.</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    v-for="pct in [0, 10, 15, 20]"
                    :key="pct"
                    type="button"
                    @click="bundleDiscount = pct"
                    class="px-2.5 py-1 rounded-lg text-xs font-black transition-all"
                    :class="[
                      bundleDiscount === pct
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200'
                    ]"
                  >
                    {{ pct === 0 ? 'Off' : `${pct}%` }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Automated Daily Liquidation Price Drop -->
            <div class="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
              <input
                id="auto-price-drop-checkbox"
                v-model="autoPriceDrop"
                type="checkbox"
                class="w-4 h-4 mt-1 rounded accent-[#FF5C1A] text-brand-600 focus:ring-brand-600 border-slate-300 cursor-pointer"
              />
              <label for="auto-price-drop-checkbox" class="text-xs text-slate-700 cursor-pointer flex-1">
                <span class="font-black text-slate-900 block">Automated Fast-Liquidation (10% drop / 24h)</span>
                <span class="text-slate-500 font-medium block mt-0.5">
                  Automatically lower remaining item prices by 10% each day if unsold, guaranteeing rapid room clearance before move-out day.
                </span>
              </label>
            </div>

            <!-- Mover & Heavy Lifting Addon -->
            <div class="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
              <input
                id="mover-checkbox"
                v-model="includeMover"
                type="checkbox"
                class="w-4 h-4 mt-1 rounded accent-[#FF5C1A] text-brand-600 focus:ring-brand-600 border-slate-300 cursor-pointer"
              />
              <label for="mover-checkbox" class="text-xs text-slate-700 cursor-pointer flex-1">
                <span class="font-black text-slate-900 block">Dispatch Verified Hostel Moving Porter</span>
                <span class="text-slate-500 font-medium block mt-0.5">
                  Request a verified campus logistics mover to assist with lifting trunks and transporting furniture down hostel stairs.
                </span>
              </label>
            </div>
          </div>

          <!-- Executive Valuation Summary & Submit Button -->
          <div class="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 border border-slate-800">
            <span class="text-[10px] font-black uppercase tracking-wider text-brand-400 bg-brand-500/15 border border-brand-500/30 px-2.5 py-1 rounded-md inline-block">
              Clearance Valuation Summary
            </span>

            <div class="space-y-2 border-b border-slate-800 pb-3 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-400">Total Item Count:</span>
                <span class="font-bold text-white">{{ activeItems.length }} Items</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Gross Room Valuation:</span>
                <span class="font-bold text-white">₦{{ calculatedValuation.toLocaleString() }}</span>
              </div>
              <div v-if="bundleDiscount > 0" class="flex justify-between text-brand-400 font-bold">
                <span>Bundle Discount ({{ bundleDiscount }}%):</span>
                <span>-₦{{ discountAmount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-base font-black pt-1 text-white">
                <span>Estimated Fast-Cash Payout:</span>
                <span class="text-brand-400 font-black text-xl sm:text-2xl">₦{{ netValuation.toLocaleString() }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck class="w-4 h-4 text-brand-400 shrink-0" />
              <span>100% Escrow protected. Automatic buyer notification emails dispatched.</span>
            </div>

            <!-- Error message if any -->
            <div v-if="publishError" class="p-3 rounded-xl bg-red-900/60 border border-red-700 text-xs text-red-200 font-bold">
              {{ publishError }}
            </div>

            <!-- Primary Submit Button -->
            <button
              type="button"
              :disabled="!canPublish || publishing"
              @click="publishBatch"
              class="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-98 text-white font-black text-sm sm:text-base transition-all shadow-lg shadow-brand-600/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="publishing" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ publishing ? 'Publishing Batch & Notifying Buyers…' : 'Publish Automated Declutter Batch 🚀' }}</span>
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- Success Modal with z-[200] to exceed navbar -->
    <div v-if="publishedBatch" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-600 border border-brand-200">
          <CheckCircle2 class="w-8 h-8 stroke-[2.5]" />
        </div>
        <h3 class="text-xl sm:text-2xl font-black text-slate-900">
          {{ groupName ? `${groupName} Published!` : 'Room Declutter Published!' }} 📦
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Your batch of <strong class="text-slate-900">{{ publishedBatch.batchSize }} items</strong> is now live for verified campus buyers in <strong class="text-slate-900">{{ publishedBatch.hostel }}</strong>.
        </p>

        <div class="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Valuation</span>
            <span class="font-black text-brand-600">₦{{ Number(publishedBatch.totalValuation || 0).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Notifications</span>
            <span class="font-bold text-slate-700">Dispatched via In-App & Email</span>
          </div>
          <div v-if="includeMover" class="flex justify-between pt-1 border-t border-slate-200 text-brand-700 font-bold">
            <span>Moving Porter:</span>
            <span>Campus Mover Requested</span>
          </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            @click="copyShareLink"
            class="flex-1 py-3 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs sm:text-sm hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 class="w-4 h-4" />
            <span>{{ copied ? 'Link Copied!' : 'Copy Share Link' }}</span>
          </button>
          <NuxtLink
            to="/explore?declutter=true"
            class="flex-1 py-3 rounded-xl bg-brand-600 text-white font-extrabold text-xs sm:text-sm hover:bg-brand-700 flex items-center justify-center transition-colors shadow-sm"
          >
            View Active Listings
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ChevronLeft,
  Sparkles,
  Package,
  Check,
  Plus,
  SlidersHorizontal,
  Trash2,
  MapPin,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Camera,
  ImagePlus,
  Video,
  X,
  Loader2,
  Pencil,
} from 'lucide-vue-next';
import { itemsApi } from '@/api_factory/modules/items';
import { bookingsApi } from '@/api_factory/modules/bookings';
import { getApiError } from '@/composables/modules/services/useServiceFormatting';
import { upload_api } from '~/composables/useApi';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { optimizeVideoUrl, optimizeImageUrl, getVideoThumbnailUrl } from '~/composables/useMediaOptimize';

definePageMeta({ layout: 'default' });

useSeoMeta({
  title: 'Automated Campus Room Declutter | Decluttered',
  description: 'Moving out or graduating? Clear your entire room in 2 minutes. Group declutter sales, instant campus valuations, and fast clearance on Decluttered.',
  ogTitle: 'Automated Campus Room Declutter | Decluttered',
  ogDescription: 'Group room clearance, instant campus valuations, and fast delivery.',
});

interface DeclutterItem {
  tempId: string;
  presetId?: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  videos: string[];
}

const router = useRouter();
const { user } = useAuth();

const presets = ref([
  {
    id: 'mattress',
    title: 'Orthopedic / Spring Mattress (Standard Student Bed)',
    price: 18000,
    category: 'Furniture',
    condition: 'Good Condition',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fan',
    title: 'Standing Rechargeable / Oxford Speed Fan',
    price: 16000,
    category: 'Appliances',
    condition: 'Good Condition',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fridge',
    title: 'Compact Tabletop Mini-Fridge (Low Energy)',
    price: 45000,
    category: 'Appliances',
    condition: 'Good Condition',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'desk-chair',
    title: 'Study Desk & Ergonomic Plastic Chair',
    price: 12000,
    category: 'Furniture',
    condition: 'Good Condition',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'cooker',
    title: 'Electric Hot Plate / Induction Cooker',
    price: 7000,
    category: 'Appliances',
    condition: 'Good Condition',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'drawer',
    title: 'Bedside 4-Tier Plastic Storage Drawer',
    price: 8000,
    category: 'Furniture',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'textbooks',
    title: 'Set of Course Textbooks, Handouts & Past Questions',
    price: 5000,
    category: 'Academics',
    condition: 'Good Condition',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'lamp-ext',
    title: 'Rechargeable LED Reading Lamp & Extension Cord',
    price: 4000,
    category: 'Electronics',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
  },
]);

const editingPresetId = ref<string | null>(null);

const startEditPresetPrice = (presetId: string) => {
  editingPresetId.value = presetId;
};

const updatePresetPrice = (preset: typeof presets.value[0], val: string | number) => {
  const numeric = Math.max(0, Number(val) || 0);
  preset.price = numeric;
  const active = activeItems.value.find((item) => item.presetId === preset.id);
  if (active) {
    active.price = numeric;
  }
};

const urgencies = [
  { id: '48h', label: 'Next 48h ⚡' },
  { id: 'weekend', label: 'This Weekend' },
  { id: 'flexible', label: 'Flexible' },
];

const categoryOptions = [
  'Appliances',
  'Furniture',
  'Electronics',
  'Academics',
  'Kitchen',
  'General',
];

const conditionOptions = [
  'Like New',
  'Good Condition',
  'Fair (Working)',
];

// Active State
const activeItems = ref<DeclutterItem[]>([]);

const hostelName = ref(user.value?.hostel || '');
const groupName = ref('');
const urgency = ref('48h');
const batchNotes = ref('');
const bundleDiscount = ref(15);
const autoPriceDrop = ref(true);
const includeMover = ref(false);

const publishing = ref(false);
const publishError = ref('');
const publishedBatch = ref<any>(null);
const copied = ref(false);
const uploadingItemId = ref<string | null>(null);

const uploadItemMedia = async (e: Event, item: DeclutterItem) => {
  const target = e.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files) : [];
  if (!files.length) return;

  uploadingItemId.value = item.tempId;
  try {
    const promises = files.map((file) =>
      upload_api.uploadFile(file, file.type.startsWith('video/') ? 'video' : 'image')
    );
    const results = await Promise.all(promises);

    if (!item.images) item.images = [];
    if (!item.videos) item.videos = [];

    results.forEach((res: any, idx: number) => {
      const url = res.data?.url || res.data?.data?.url;
      if (url) {
        if (files[idx].type.startsWith('video/')) {
          const optVid = optimizeVideoUrl(url);
          item.videos.push(optVid);
          // If no photo was attached, add poster thumbnail to images so search views display nicely
          if (item.images.length === 0) {
            item.images.push(getVideoThumbnailUrl(url) || optVid);
          }
        } else {
          item.images.push(optimizeImageUrl(url));
        }
      }
    });

    useCustomToast().showToast({
      title: 'Media Uploaded! 📸',
      message: `${files.length} file(s) attached to ${item.title}.`,
      toastType: 'success',
    });
  } catch (err) {
    useCustomToast().showToast({
      title: 'Upload Failed',
      message: 'Could not upload media files. Please try again.',
      toastType: 'error',
    });
  } finally {
    uploadingItemId.value = null;
    target.value = '';
  }
};

const isPresetSelected = (id: string) => {
  return activeItems.value.some((item) => item.presetId === id);
};

const togglePreset = (preset: typeof presets.value[0]) => {
  const index = activeItems.value.findIndex((item) => item.presetId === preset.id);
  if (index >= 0) {
    activeItems.value.splice(index, 1);
  } else {
    activeItems.value.push({
      tempId: `preset-${preset.id}-${Date.now()}`,
      presetId: preset.id,
      title: preset.title,
      price: preset.price,
      category: preset.category,
      condition: preset.condition,
      images: [preset.image],
      videos: [],
    });
  }
};

const selectAll = () => {
  activeItems.value = presets.value.map((p) => ({
    tempId: `preset-${p.id}-${Date.now()}`,
    presetId: p.id,
    title: p.title,
    price: p.price,
    category: p.category,
    condition: p.condition,
    images: [p.image],
    videos: [],
  }));
};

const deselectAll = () => {
  activeItems.value = [];
};

const addCustomItem = () => {
  activeItems.value.push({
    tempId: `custom-${Date.now()}`,
    title: 'Custom Room Item (e.g. Shoe Rack)',
    price: 5000,
    category: 'General',
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'],
    videos: [],
  });
};

const removeItem = (tempId: string) => {
  activeItems.value = activeItems.value.filter((i) => i.tempId !== tempId);
};

const calculatedValuation = computed(() => {
  return activeItems.value.reduce((sum, item) => sum + Number(item.price || 0), 0);
});

const discountAmount = computed(() => {
  if (bundleDiscount.value <= 0) return 0;
  return Math.round((calculatedValuation.value * bundleDiscount.value) / 100);
});

const netValuation = computed(() => {
  return Math.max(0, calculatedValuation.value - discountAmount.value);
});

const canPublish = computed(() => {
  return activeItems.value.length > 0 && !!hostelName.value.trim();
});

const publishBatch = async () => {
  if (!user.value) {
    router.push('/login?redirect=/declutter');
    return;
  }

  if (!canPublish.value) return;

  publishing.value = true;
  publishError.value = '';

  try {
    const payload = {
      hostel: hostelName.value.trim(),
      groupName: groupName.value.trim() || undefined,
      bundleDiscountPercent: bundleDiscount.value,
      autoPriceDrop: autoPriceDrop.value,
      items: activeItems.value.map((item) => ({
        title: item.title,
        description: batchNotes.value.trim() || undefined,
        price: Number(item.price),
        category: item.category,
        condition: item.condition,
        images: item.images && item.images.length ? item.images : undefined,
        videos: item.videos && item.videos.length ? item.videos : undefined,
      })),
    };

    const res = await itemsApi.createDeclutterBatch(payload);
    publishedBatch.value = res.data;

    // If mover was requested, auto-request the moving porter booking
    if (includeMover.value) {
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');

        await bookingsApi.create({
          serviceId: '6ad49b3a7db0ea4784e9c04c', // Hostel Moving & Heavy Lifting Assistance
          date: `${yyyy}-${mm}-${dd}`,
          startTime: '10:00',
          durationMinutes: 60,
          notes: `Auto-dispatched with Campus Room Declutter Batch at ${hostelName.value}. Please bring lifting straps.`,
        });
      } catch (moverErr) {
        // Do not block batch creation if mover booking has conflict
        console.warn('Mover auto-booking dispatch notice:', moverErr);
      }
    }
  } catch (err) {
    const info = getApiError(err);
    publishError.value = info.message;
  } finally {
    publishing.value = false;
  }
};

const copyShareLink = async () => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    const batchParam = publishedBatch.value?.batchId ? `&batchId=${publishedBatch.value.batchId}` : '';
    const url = `${window.location.origin}/explore?declutter=true${batchParam}`;
    await navigator.clipboard.writeText(url);
    copied.value = true;
    useCustomToast().showToast({
      title: 'Share Link Copied! 📋',
      message: 'Declutter room sale link copied to clipboard. Share it with your hostel group!',
      toastType: 'success',
    });
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  }
};
</script>
