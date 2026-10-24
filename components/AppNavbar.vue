<template>
  <div class="fixed top-4 sm:top-5 left-0 w-full z-[100] px-4 pointer-events-none">
    <div
      class="max-w-6xl mx-auto rounded-2xl sm:rounded-full h-16 flex items-center justify-between px-4 sm:px-6 pointer-events-auto relative transition-all duration-300"
      :class="[
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm'
          : 'bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-xs hover:bg-white/75'
      ]"
    >
      
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2.5 shrink-0 group">
        <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-8 w-8 rounded-xl object-contain transition-transform group-hover:scale-105 shadow-xs" />
        <span class="font-black text-slate-900 tracking-tight text-lg sm:text-xl">
          Decluttered<span class="text-[#FF5C1A]">.</span>
        </span>
      </a>

      <!-- Desktop Nav (Clean, un-choked core links) -->
      <nav class="hidden md:flex items-center gap-7 text-sm font-bold">
        <NuxtLink
          to="/explore"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/explore') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-slate-950'"
        >
          Buy
          <span v-if="isRouteActive('/explore')" class="absolute -bottom-1 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/swap"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/swap') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-slate-950'"
        >
          Swap
          <span v-if="isRouteActive('/swap')" class="absolute -bottom-1 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/services"
          class="transition-colors py-1 relative"
          :class="isRouteActive('/services') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-slate-950'"
        >
          Services
          <span v-if="isRouteActive('/services')" class="absolute -bottom-1 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <NuxtLink
          to="/reels"
          class="transition-colors py-1 relative flex items-center gap-1.5"
          :class="isRouteActive('/reels') ? 'text-[#FF5C1A] font-black' : 'text-slate-600 hover:text-slate-950'"
        >
          <span>Reels</span>
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span v-if="isRouteActive('/reels')" class="absolute -bottom-1 inset-x-0 h-0.5 bg-[#FF5C1A] rounded-full"></span>
        </NuxtLink>

        <!-- The business platform is a separate application. -->
        <a
          :href="businessPlatformUrl"
          class="transition-colors py-1 relative flex items-center gap-1.5 text-slate-600 hover:text-slate-950"
        >
          <span>Businesses</span>
          <ArrowUpRight class="w-3.5 h-3.5" />
        </a>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2 pr-1">
        
        <!-- Notifications Bell (Desktop) -->
        <div v-if="user" class="relative hidden md:block">
          <button
            type="button"
            @click="toggleNotifications"
            class="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF5C1A]/10 text-slate-700 hover:text-[#FF5C1A] transition-colors"
            title="Notifications"
          >
            <Bell class="w-5 h-5" />
            <span
              v-if="unreadNotificationsCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs"
            >
              {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 pointer-events-auto"
            >
              <div class="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-black text-slate-900">Notifications</h4>
                  <span
                    v-if="unreadNotificationsCount > 0"
                    class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700"
                  >
                    {{ unreadNotificationsCount }} new
                  </span>
                </div>
                <button
                  v-if="unreadNotificationsCount > 0"
                  type="button"
                  @click="markAllNotificationsRead"
                  class="text-xs font-bold text-[#FF5C1A] hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <!-- Notifications List -->
              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
                <div
                  v-if="notificationsLoading"
                  class="p-6 text-center text-xs text-slate-400"
                >
                  Loading notifications...
                </div>
                <div
                  v-else-if="notifications.length === 0"
                  class="p-6 text-center text-xs text-slate-400"
                >
                  No notifications yet. You're all caught up!
                </div>
                <div
                  v-else
                  v-for="notif in notifications"
                  :key="notif._id"
                  @click="handleNotificationClick(notif)"
                  class="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 text-left"
                  :class="!notif.isRead ? 'bg-orange-50/40' : ''"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    :class="!notif.isRead ? 'bg-[#FF5C1A]/10 text-[#FF5C1A]' : 'bg-slate-100 text-slate-500'"
                  >
                    <Package v-if="notif.type && notif.type.includes('declutter')" class="w-4 h-4" />
                    <Calendar v-else-if="notif.type && notif.type.includes('booking')" class="w-4 h-4" />
                    <DollarSign v-else-if="notif.type && notif.type.includes('escrow')" class="w-4 h-4" />
                    <Bell v-else class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-1">
                      <p class="text-xs font-extrabold text-slate-900 truncate">
                        {{ notif.title }}
                      </p>
                      <span v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-[#FF5C1A] shrink-0 mt-1"></span>
                    </div>
                    <p class="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                      {{ notif.message }}
                    </p>
                    <p class="text-[10px] text-slate-400 font-semibold mt-1">
                      {{ formatTimeAgo(notif.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <a
                  href="/dashboard"
                  class="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  View Activity in Dashboard →
                </a>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Chat Notification Icon -->
        <a v-if="user" href="/messages" class="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF5C1A]/10 text-slate-700 hover:text-[#FF5C1A] transition-colors">
          <MessageCircle class="w-5 h-5" />
          <span v-if="unreadChats.length > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        </a>

        <!-- Desktop Auth -->
        <div v-if="!user" class="hidden md:flex items-center gap-2">
           <a href="/login" class="px-3 py-1.5 text-sm font-bold text-slate-700 hover:text-[#FF5C1A] transition-colors">Log In</a>
           <a href="/sell" class="bg-slate-900 hover:bg-[#FF5C1A] text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all text-xs sm:text-sm shadow-xs active:scale-95">Start Trading</a>
        </div>
        <div v-else class="hidden md:flex items-center gap-2">
          <a href="/dashboard" class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF5C1A]/10 text-slate-700 hover:text-[#FF5C1A] transition-colors" title="Dashboard">
            <User class="w-5 h-5" />
          </a>
          <a href="/sell" class="bg-[#FF5C1A] hover:bg-[#e04e14] text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all text-xs sm:text-sm shadow-xs active:scale-95">+ Sell Item</a>
        </div>

        <!-- Mobile Hamburger Toggle -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors mr-1 outline-none">
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu Full-Screen Overlay -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-98"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-98"
        >
          <div
            v-if="isMobileMenuOpen"
            class="fixed inset-0 z-[9999] bg-white flex flex-col md:hidden overflow-y-auto selection:bg-[#FF5C1A] selection:text-white"
          >
            <!-- Top Sticky Bar: Brand & Close -->
            <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 shrink-0">
              <a href="/" @click="isMobileMenuOpen = false" class="flex items-center gap-2.5">
                <img src="/android-chrome-192x192.png" alt="Decluttered" class="h-8 w-8 rounded-xl object-contain shadow-xs" />
                <span class="font-black text-slate-900 tracking-tight text-xl">
                  Decluttered<span class="text-[#FF5C1A]">.</span>
                </span>
              </a>

              <button
                type="button"
                @click="isMobileMenuOpen = false"
                class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Close navigation"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="p-5 space-y-6 flex-1 pb-16">
              <!-- ── Primary Action & Upload Center ── -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-black uppercase tracking-wider text-slate-400">Upload & Action Center</span>
                  <span class="text-[10px] font-bold text-[#FF5C1A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
                    Instant Escrow 🛡️
                  </span>
                </div>

                <div class="grid grid-cols-1 gap-2.5">
                  <!-- 1. Upload to Sell -->
                  <NuxtLink
                    to="/sell"
                    @click="isMobileMenuOpen = false"
                    class="group p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-200/80 hover:border-orange-400 transition-all flex items-center justify-between shadow-2xs active:scale-[0.98]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-2xl bg-[#FF5C1A] text-white flex items-center justify-center shadow-md shadow-[#FF5C1A]/25 shrink-0">
                        <Tag class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <h4 class="font-black text-sm text-slate-900">Upload Something to Sell</h4>
                          <span class="text-[9px] font-black uppercase bg-[#FF5C1A] text-white px-1.5 py-0.2 rounded-full">Cash Out</span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">Mattress, fridge, fan, gadgets, books</p>
                      </div>
                    </div>
                    <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-[#FF5C1A] transition-colors" />
                  </NuxtLink>

                  <!-- 2. Upload to Swap -->
                  <NuxtLink
                    to="/sell?type=swap"
                    @click="isMobileMenuOpen = false"
                    class="group p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-200/80 hover:border-purple-400 transition-all flex items-center justify-between shadow-2xs active:scale-[0.98]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 shrink-0">
                        <ArrowRightLeft class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <h4 class="font-black text-sm text-slate-900">Upload Something to Swap</h4>
                          <span class="text-[9px] font-black uppercase bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full">Zero Cash</span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">Exchange essentials with verified students</p>
                      </div>
                    </div>
                    <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </NuxtLink>

                  <!-- 3. Offer a Service -->
                  <NuxtLink
                    to="/become-a-provider"
                    @click="isMobileMenuOpen = false"
                    class="group p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200/80 hover:border-emerald-400 transition-all flex items-center justify-between shadow-2xs active:scale-[0.98]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 shrink-0">
                        <Wrench class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <h4 class="font-black text-sm text-slate-900">Upload a Service You Offer</h4>
                          <span class="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full">Campus Pro</span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">Hostel mover, electrician, tech repair, tutor</p>
                      </div>
                    </div>
                    <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </NuxtLink>

                  <!-- 4. 1-Click Room Declutter -->
                  <NuxtLink
                    to="/declutter"
                    @click="isMobileMenuOpen = false"
                    class="group p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/10 via-slate-900/5 to-transparent border border-slate-300 hover:border-slate-800 transition-all flex items-center justify-between shadow-2xs active:scale-[0.98]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/25 shrink-0">
                        <Zap class="w-5 h-5 text-brand-400 fill-current" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <h4 class="font-black text-sm text-slate-900">1-Click Room Declutter</h4>
                          <span class="text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">Room Box</span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">Clear out all your room items at once</p>
                      </div>
                    </div>
                    <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </NuxtLink>

                  <!-- 5. Join Erranders -->
                  <a
                    href="https://erranders.org"
                    target="_blank"
                    rel="noopener"
                    @click="isMobileMenuOpen = false"
                    class="group p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200/80 hover:border-blue-400 transition-all flex items-center justify-between shadow-2xs active:scale-[0.98]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
                        <Compass class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <h4 class="font-black text-sm text-slate-900">Join the Erranders Community</h4>
                          <span class="text-[9px] font-black uppercase bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full">Run & Earn</span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium mt-0.5">Become a runner, deliver errands & earn daily income</p>
                      </div>
                    </div>
                    <ArrowUpRight class="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                </div>
              </div>

              <!-- ── Section 2: Explore Navigation ── -->
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2.5">Browse Marketplace</span>
                <div class="grid grid-cols-2 gap-2">
                  <NuxtLink
                    to="/explore"
                    @click="isMobileMenuOpen = false"
                    class="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <ShoppingBag class="w-4 h-4 text-blue-600" />
                    <span>Buy Items</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/swap"
                    @click="isMobileMenuOpen = false"
                    class="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <ArrowRightLeft class="w-4 h-4 text-purple-600" />
                    <span>Swap Hub</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/services"
                    @click="isMobileMenuOpen = false"
                    class="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <Wrench class="w-4 h-4 text-emerald-600" />
                    <span>Services</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/reels"
                    @click="isMobileMenuOpen = false"
                    class="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs flex items-center justify-between transition-all"
                  >
                    <span class="flex items-center gap-2">
                      <Flame class="w-4 h-4 text-red-500 fill-current" />
                      <span>Reels</span>
                    </span>
                    <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  </NuxtLink>

                  <a
                    :href="businessPlatformUrl"
                    @click="isMobileMenuOpen = false"
                    class="col-span-2 p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs flex items-center justify-between transition-all"
                  >
                    <span class="flex items-center gap-2">
                      <Building2 class="w-4 h-4 text-slate-600" />
                      <span>Campus Business Storefronts</span>
                    </span>
                    <ArrowUpRight class="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              <!-- ── Section 3: User Account & Messages ── -->
              <div class="pt-2 border-t border-slate-100">
                <template v-if="user">
                  <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-3 flex items-center justify-between">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 rounded-full bg-[#FF5C1A] text-white font-black text-sm flex items-center justify-center shrink-0">
                        {{ (user.name || user.email || 'U')[0].toUpperCase() }}
                      </div>
                      <div class="min-w-0">
                        <p class="font-black text-sm text-slate-900 truncate">{{ user.name || 'Campus Student' }}</p>
                        <p class="text-xs text-slate-500 truncate">{{ user.email }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <NuxtLink
                      to="/messages"
                      @click="isMobileMenuOpen = false"
                      class="p-3 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <MessageCircle class="w-4 h-4 text-slate-600" />
                        <span>Messages</span>
                      </div>
                      <span v-if="unreadChats.length > 0" class="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {{ unreadChats.length }}
                      </span>
                    </NuxtLink>

                    <NuxtLink
                      to="/dashboard"
                      @click="isMobileMenuOpen = false"
                      class="p-3 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-800 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <User class="w-4 h-4 text-slate-600" />
                      <span>Dashboard</span>
                    </NuxtLink>
                  </div>
                </template>

                <template v-else>
                  <div class="flex items-center gap-2">
                    <NuxtLink
                      to="/login"
                      @click="isMobileMenuOpen = false"
                      class="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-center font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Log In
                    </NuxtLink>
                    <NuxtLink
                      to="/sell"
                      @click="isMobileMenuOpen = false"
                      class="flex-1 py-3 px-4 rounded-xl bg-[#FF5C1A] hover:bg-[#e04e14] text-center font-black text-sm text-white transition-colors shadow-xs"
                    >
                      Start Trading
                    </NuxtLink>
                  </div>
                </template>
              </div>

            </div>
          </div>
        </Transition>
      </Teleport>

      
    </div>
    
    <!-- Chat Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-[-20px] opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-[-20px] opacity-0"
    >
      <div v-if="showChatToast && latestMessage" class="pointer-events-auto absolute top-20 right-4 max-w-sm w-full bg-white rounded-xl border border-slate-200 p-3.5 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors" @click="navigateToChat">
        <div class="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
          <MessageCircle class="w-5 h-5 text-brand-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900 truncate">New Message</p>
          <p class="text-sm text-slate-600 truncate mt-0.5">
            {{ latestMessage.message?.content || 'Sent an attachment' }}
          </p>
        </div>
        <button @click.stop="showChatToast = false" class="text-slate-400 hover:text-slate-600 shrink-0">
          <X class="w-5 h-5" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ArrowRightLeft,
  User,
  Menu,
  X,
  MessageCircle,
  Bell,
  Package,
  Calendar,
  DollarSign,
  Tag,
  ChevronRight,
  Wrench,
  Zap,
  Compass,
  ArrowUpRight,
  ShoppingBag,
  Flame,
  Building2,
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { notificationsApi } from '@/api_factory/modules/notifications'
import { playNotificationSound } from '@/composables/core/useSound'

const { user, token } = useAuth()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const businessPlatformUrl = config.public?.businessPlatformUrl || 'https://business.erranders.org'

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

watch(isMobileMenuOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Close mobile menu on route change
watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  }
)

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 20
  }
}

const isRouteActive = (target) => {
  const currentPath = route.path
  if (target === '/explore') {
    return currentPath === '/explore' && !route.query.declutter
  }
  if (target === '/declutter') {
    return currentPath === '/declutter' || (currentPath === '/explore' && Boolean(route.query.declutter))
  }
  if (target === '/sell') {
    return currentPath === '/sell'
  }
  if (target === '/swap') {
    return currentPath === '/swap'
  }
  if (target === '/services') {
    return currentPath.startsWith('/services')
  }
  if (target === '/reels') {
    return currentPath.startsWith('/reels')
  }
  if (target === '/messages') {
    return currentPath.startsWith('/messages')
  }
  if (target === '/dashboard') {
    return currentPath.startsWith('/dashboard')
  }
  if (target === '/login') {
    return currentPath === '/login'
  }
  if (target === '/signup') {
    return currentPath === '/signup'
  }
  if (target === '/') {
    return currentPath === '/'
  }
  return currentPath.startsWith(target)
}
const unreadChats = ref([])
const showChatToast = ref(false)
const latestMessage = ref(null)

// Notifications state
const isNotificationsOpen = ref(false)
const notifications = ref([])
// -1 until the first fetch, so an existing badge count never reads as 'new'.
const unreadNotificationsCount = ref(-1)
const notificationsLoading = ref(false)

let socket = null
let notificationPollTimer = null

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const loadNotifications = async () => {
  if (!user.value) return
  notificationsLoading.value = true
  try {
    const res = await notificationsApi.list(15)
    notifications.value = res.data?.data || []
    const newCount = Number(res.data?.unreadCount || 0)

    // Only chime for notifications that arrived *while the page was open*. The previous
    // guard compared against a counter starting at 0, so a refresh with 3 unread read as
    // "3 > 0" and played the chime on every load.
    const hadPreviousValue = unreadNotificationsCount.value >= 0
    if (hadPreviousValue && newCount > unreadNotificationsCount.value) {
      playNotificationSound()
    }
    unreadNotificationsCount.value = newCount
  } catch (err) {
    // silent fallback
  } finally {
    notificationsLoading.value = false
  }
}

const toggleNotifications = async () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    await loadNotifications()
  }
}

const markAllNotificationsRead = async () => {
  try {
    await notificationsApi.markAllRead()
    unreadNotificationsCount.value = 0
    notifications.value.forEach((n) => (n.isRead = true))
  } catch (err) {}
}

const handleNotificationClick = async (notif) => {
  if (!notif.isRead) {
    try {
      await notificationsApi.markRead(notif._id)
      notif.isRead = true
      unreadNotificationsCount.value = Math.max(0, unreadNotificationsCount.value - 1)
    } catch (err) {}
  }
  isNotificationsOpen.value = false
  if (notif.link) {
    router.push(notif.link)
  }
}

const navigateToChat = () => {
  if (latestMessage.value) {
    router.push(`/chat?chatId=${latestMessage.value.chatId}`)
    showChatToast.value = false
    unreadChats.value = unreadChats.value.filter(c => c.chatId !== latestMessage.value.chatId)
  }
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }

  if (user.value) {
    loadNotifications()
    notificationPollTimer = setInterval(loadNotifications, 60000)
  }

  if (process.client && token.value) {
    try {
      socket = io(useRuntimeConfig().public.apiBaseUrl.replace('/api/v1', ''), {
        auth: { token: `Bearer ${token.value}` },
        transports: ['polling'],
      })
      
      socket.on('chatNotification', (data) => {
        if (typeof window !== 'undefined' && window.location.pathname.includes('/chat') && window.location.search.includes(data.chatId)) return;
        
        latestMessage.value = data
        showChatToast.value = true
        unreadChats.value.push(data)
        playNotificationSound()
        
        setTimeout(() => {
          showChatToast.value = false
        }, 5000)
      })
    } catch (err) {
      console.warn('Socket init failed:', err)
    }
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
  }
  if (socket) socket.disconnect()
  if (notificationPollTimer) clearInterval(notificationPollTimer)
})
</script>