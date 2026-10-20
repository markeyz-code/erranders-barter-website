<template>
  <main class="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-24 selection:bg-[#FF5C1A]/20 selection:text-[#FF5C1A]">
    <!-- Top Bar Navigation (Clean White) -->
    <header class="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <!-- Left: Back link + Business identity -->
        <div class="flex items-center gap-3 min-w-0">
          <NuxtLink to="/services" class="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors shrink-0">
            <ArrowLeft class="w-4 h-4" />
            <span class="hidden sm:inline">Back to Marketplace</span>
          </NuxtLink>
          <span class="text-slate-200 hidden sm:inline">|</span>
          
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-[#FF5C1A] flex items-center justify-center font-black text-base shadow-xs shrink-0">
              {{ currentBusiness.icon || '⚡' }}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-sm sm:text-base font-extrabold text-slate-900 leading-none tracking-tight truncate">
                  {{ currentBusiness.name }}
                </h1>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  Verified Partner
                </span>
              </div>
              <p class="text-[11px] text-slate-500 font-semibold mt-0.5 truncate">
                Business Mini-Admin & Dispatch · <span class="capitalize text-slate-600 font-bold">{{ currentBusiness.category }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Domain Badge, Switcher & Storefront link -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Business Switcher Dropdown (Demonstrating any business can use this) -->
          <div class="relative">
            <button
              @click="isSwitcherOpen = !isSwitcherOpen"
              class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
              title="Switch demo business profile"
            >
              <Briefcase class="w-3.5 h-3.5 text-slate-500" />
              <span class="hidden md:inline">Example:</span>
              <span class="truncate max-w-[110px]">{{ currentBusiness.shortName }}</span>
              <ChevronDown class="w-3 h-3 text-slate-400" />
            </button>

            <!-- Switcher Menu -->
            <div
              v-if="isSwitcherOpen"
              class="absolute right-0 top-11 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-left"
            >
              <div class="px-3 py-2 border-b border-slate-100 mb-1">
                <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Campus Business Examples</p>
                <p class="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Fumigation is just one example. Erranders powers all campus service vendors:
                </p>
              </div>
              <button
                v-for="b in SAMPLE_BUSINESSES"
                :key="b.slug"
                @click="switchBusiness(b)"
                class="w-full p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 text-left"
                :class="currentBusiness.slug === b.slug ? 'bg-orange-50/70 border border-orange-200/80' : ''"
              >
                <span class="text-lg">{{ b.icon }}</span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-slate-900 truncate">{{ b.name }}</p>
                    <span class="text-[10px] font-mono text-slate-400">{{ b.slug }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 capitalize">{{ b.category }}</p>
                </div>
              </button>
              <div class="pt-2 border-t border-slate-100 mt-1">
                <NuxtLink
                  to="/business/onboard"
                  @click="isSwitcherOpen = false"
                  class="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#FF5C1A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>Onboard New Business</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Domain Badge with 1-click Copy -->
          <div class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
            <Globe class="w-3.5 h-3.5 text-emerald-600" />
            <span>{{ currentBusiness.slug }}.erranders.org</span>
            <button
              @click="copyDomain"
              class="ml-1 text-slate-400 hover:text-slate-800 transition-colors"
              title="Copy Storefront URL"
            >
              <Copy class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Storefront Button -->
          <button
            @click="openStorefront"
            class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <ExternalLink class="w-3.5 h-3.5 text-slate-300" />
            <span>Storefront</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

      <!-- Dynamic Notice: Fumigation is just an example -->
      <div class="mb-4 px-4 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-center justify-between text-xs gap-3">
        <div class="flex items-center gap-2">
          <span class="text-base">💡</span>
          <span>
            <strong>Campus Vendor Architecture:</strong> Fumigation is just one example. Every business gets its own
            <code class="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-amber-950 border border-amber-200">business-name.erranders.org</code>
            domain, mini-admin dispatch, staff roster, and payout ledger.
          </span>
        </div>
        <NuxtLink to="/business/onboard" class="shrink-0 font-bold text-amber-950 hover:underline">
          Launch Yours →
        </NuxtLink>
      </div>

      <!-- Domain Banner Alert (Plain White & Emerald) -->
      <div class="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-sm sm:text-base font-extrabold text-slate-900">
                Your Unique Campus Domain is Live!
              </h4>
              <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                SSL Secured
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Direct campus link:
              <a
                :href="`https://${currentBusiness.slug}.erranders.org`"
                target="_blank"
                class="text-emerald-700 hover:text-emerald-800 font-mono font-bold hover:underline"
              >
                https://{{ currentBusiness.slug }}.erranders.org
              </a>
              (Mapped directly to your bookings, team dispatch & recruitment)
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            @click="copyDomain"
            class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
          <button
            @click="activeTab = 'settings'"
            class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-colors"
          >
            Configure Domain
          </button>
        </div>
      </div>

      <!-- Navigation Tabs (Clean White Cards) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 no-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 border"
          :class="activeTab === tab.id
            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
            : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge"
            class="px-1.5 py-0.5 rounded-full text-[10px] font-black"
            :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- TAB 1: OVERVIEW & KPIS (PLAIN WHITE) -->
      <div v-if="activeTab === 'overview'" class="space-y-8 animate-in fade-in duration-200">
        <!-- KPI Cards Grid (White Cards with Slate Borders) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Gross Bookings</span>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-extrabold text-slate-900">₦{{ metrics.grossRevenue.toLocaleString() }}</span>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">+18% this wk</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Total customer escrow deposits</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Platform Commission</span>
              <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                {{ platformCommissionPercent }}% Take-Rate
              </span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-extrabold text-purple-700">₦{{ metrics.platformFeeDeducted.toLocaleString() }}</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Configured in Erranders Admin</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Net Business Earnings</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ready to withdraw
              </span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-extrabold text-emerald-600">₦{{ metrics.netEarnings.toLocaleString() }}</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">After staff payouts & commission</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Staff / Crew</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {{ applicantList.length }} applicants
              </span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-extrabold text-slate-900">{{ staffList.length }}</span>
              <span class="text-xs font-semibold text-slate-500">trained field operators</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Dispatched to campus hostels</p>
          </div>
        </div>

        <!-- Two Column Overview Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left: Incoming Hostel Jobs -->
          <div class="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Incoming Hostel Jobs</span>
                  <span class="px-2 py-0.5 rounded-full text-xs font-black bg-orange-50 text-[#FF5C1A] border border-orange-200">
                    {{ bookingsList.length }} Total
                  </span>
                </h3>
                <p class="text-xs text-slate-500">Latest room bookings requiring crew assignment and execution</p>
              </div>
              <button @click="activeTab = 'bookings'" class="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1">
                <span>View All ({{ bookingsList.length }})</span>
                <span>→</span>
              </button>
            </div>

            <!-- Job Cards List (Clean White) -->
            <div class="space-y-3">
              <div
                v-for="job in bookingsList.slice(0, 3)"
                :key="job.id"
                class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-extrabold text-slate-900">{{ job.customerName }}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="statusBadgeClass(job.status)">
                      {{ job.status }}
                    </span>
                  </div>
                  <h4 class="text-xs sm:text-sm font-extrabold text-slate-800">
                    {{ job.packageName }} · <span class="text-emerald-700 font-black">₦{{ job.amount.toLocaleString() }}</span>
                  </h4>
                  <p class="text-[11px] text-slate-500 font-medium flex items-center gap-3">
                    <span class="flex items-center gap-1"><MapPin class="w-3 h-3 text-slate-400" /> {{ job.hostelRoom }}</span>
                    <span class="flex items-center gap-1"><Clock class="w-3 h-3 text-slate-400" /> {{ job.scheduledDate }} ({{ job.scheduledTime }})</span>
                  </p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    v-if="!job.assignedCrew"
                    @click="openAssignModal(job)"
                    class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors shadow-2xs"
                  >
                    Assign Crew
                  </button>
                  <span v-else class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                    👤 {{ job.assignedCrew }}
                  </span>
                  <button
                    v-if="job.status !== 'Completed'"
                    @click="markJobComplete(job)"
                    class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-colors shadow-2xs"
                  >
                    Finish Job
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: New Student Applicants -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users class="w-4 h-4 text-emerald-600" />
                  <span>New Student Applicants</span>
                </h3>
                <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                  {{ applicantList.length }} New
                </span>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed mb-4">
                Students who applied via your public recruitment portal to earn on campus.
              </p>

              <div class="space-y-3">
                <div
                  v-for="app in applicantList.slice(0, 3)"
                  :key="app.id"
                  class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2"
                >
                  <div class="min-w-0">
                    <h5 class="text-xs font-bold text-slate-900 truncate">{{ app.name }}</h5>
                    <p class="text-[11px] text-slate-500 truncate">{{ app.hostel }} · {{ app.phone }}</p>
                    <p class="text-[10px] text-slate-400 font-semibold">{{ app.role }}</p>
                  </div>
                  <button
                    @click="hireApplicant(app)"
                    class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition-colors shrink-0 shadow-2xs"
                  >
                    Hire
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="activeTab = 'recruitment'"
              class="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors border border-slate-200"
            >
              Manage All Recruitment Openings →
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: BOOKINGS & JOBS -->
      <div v-else-if="activeTab === 'bookings'" class="space-y-6 animate-in fade-in duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">Customer Campus Bookings</h2>
            <p class="text-xs text-slate-500">Manage orders, schedule equipment dispatch, and release completion milestones.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500">Filter:</span>
            <button
              @click="bookingFilter = 'all'"
              class="px-3 py-1 rounded-lg text-xs font-bold border"
              :class="bookingFilter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
            >
              All
            </button>
            <button
              @click="bookingFilter = 'Pending'"
              class="px-3 py-1 rounded-lg text-xs font-bold border"
              :class="bookingFilter === 'Pending' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
            >
              Pending
            </button>
            <button
              @click="bookingFilter = 'Completed'"
              class="px-3 py-1 rounded-lg text-xs font-bold border"
              :class="bookingFilter === 'Completed' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
            >
              Completed
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
              <tr>
                <th class="py-3.5 px-4">Booking Ref</th>
                <th class="py-3.5 px-4">Student / Hostel</th>
                <th class="py-3.5 px-4">Service Package</th>
                <th class="py-3.5 px-4">Amount</th>
                <th class="py-3.5 px-4">Assigned Worker</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3.5 px-4 font-mono font-bold text-slate-900">#{{ booking.id }}</td>
                <td class="py-3.5 px-4">
                  <span class="font-bold text-slate-900 block">{{ booking.customerName }}</span>
                  <span class="text-slate-500 text-[11px]">{{ booking.hostelRoom }} · {{ booking.phone }}</span>
                </td>
                <td class="py-3.5 px-4">
                  <span class="font-bold text-slate-900 block">{{ booking.packageName }}</span>
                  <span class="text-slate-500 text-[11px]">{{ booking.scheduledDate }} @ {{ booking.scheduledTime }}</span>
                </td>
                <td class="py-3.5 px-4 font-extrabold text-emerald-700">₦{{ booking.amount.toLocaleString() }}</td>
                <td class="py-3.5 px-4">
                  <span v-if="booking.assignedCrew" class="text-slate-800 font-bold flex items-center gap-1">
                    👤 {{ booking.assignedCrew }}
                  </span>
                  <span v-else class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200">
                    Unassigned
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="statusBadgeClass(booking.status)">
                    {{ booking.status }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right space-x-2">
                  <button
                    @click="openAssignModal(booking)"
                    class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors"
                  >
                    Assign
                  </button>
                  <button
                    v-if="booking.status !== 'Completed'"
                    @click="markJobComplete(booking)"
                    class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-colors"
                  >
                    Complete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: RECRUITMENT & STAFF MANAGEMENT -->
      <div v-else-if="activeTab === 'recruitment'" class="space-y-8 animate-in fade-in duration-200">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Live Openings -->
          <div class="lg:col-span-1 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-extrabold text-slate-900">Active Campus Openings</h3>
              <button
                @click="isNewJobModalOpen = true"
                class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-[#FF5C1A] text-white font-black text-xs transition-colors"
              >
                + New Opening
              </button>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Openings published on your business domain (<code class="font-mono text-slate-700">{{ currentBusiness.slug }}.erranders.org</code>) and the campus recruitment board.
            </p>

            <div class="space-y-3">
              <div v-for="job in activeJobOpenings" :key="job.id" class="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-slate-900 text-xs">{{ job.title }}</h4>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">Active</span>
                </div>
                <p class="text-xs text-slate-600 mb-2">Pay: <strong class="text-emerald-700">₦{{ job.payPerJob.toLocaleString() }}</strong> / job</p>
                <div class="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>{{ job.location }}</span>
                  <span class="font-bold text-slate-700">{{ job.applicantsCount }} applicants</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle & Right: Student Applicants & Hired Roster -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Student Applicants Queue -->
            <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base font-extrabold text-slate-900">Student Applicants ({{ applicantList.length }})</h3>
                  <p class="text-xs text-slate-500">Students seeking flexible work to execute service tasks between lectures.</p>
                </div>
              </div>

              <div v-if="applicantList.length === 0" class="py-8 text-center text-xs text-slate-400 font-semibold">
                All pending applicants have been processed.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="applicant in applicantList"
                  :key="applicant.id"
                  class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-bold text-slate-900">{{ applicant.name }}</h4>
                      <span class="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        {{ applicant.level }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 mt-0.5">Applied for: <strong class="text-slate-900">{{ applicant.role }}</strong></p>
                    <p class="text-[11px] text-slate-500 mt-1 italic font-serif">"{{ applicant.note }}"</p>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      @click="hireApplicant(applicant)"
                      class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-2xs"
                    >
                      Accept & Hire
                    </button>
                    <button
                      @click="rejectApplicant(applicant)"
                      class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hired Staff Roster -->
            <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 class="text-base font-extrabold text-slate-900">Active Crew Roster ({{ staffList.length }})</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div v-for="staff in staffList" :key="staff.id" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-slate-900">{{ staff.name }}</span>
                    <span
                      class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      :class="staff.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'"
                    >
                      {{ staff.status }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500">{{ staff.role }}</p>
                  <div class="pt-2 border-t border-slate-200/80 text-[11px] flex justify-between font-bold text-slate-700">
                    <span>{{ staff.jobsCompleted }} jobs</span>
                    <span class="text-emerald-700">₦{{ staff.totalEarned.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: PAYMENTS & LEDGER -->
      <div v-else-if="activeTab === 'payments'" class="space-y-8 animate-in fade-in duration-200">
        <!-- Balance Breakdown Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Net Balance</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600">₦{{ metrics.netEarnings.toLocaleString() }}</div>
            <p class="text-xs text-slate-500">Ready for instant settlement to your bank account.</p>
            <button
              @click="requestWithdrawal"
              class="mt-3 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs"
            >
              Withdraw to Bank
            </button>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Escrow Pending</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">₦48,000</div>
            <p class="text-xs text-slate-500">Held securely by Erranders pending job sign-off by student.</p>
            <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Released immediately upon mutual completion.
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Commission ({{ platformCommissionPercent }}%)</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-purple-700">₦{{ metrics.platformFeeDeducted.toLocaleString() }}</div>
            <p class="text-xs text-slate-500">Platform take-rate configured in Erranders Admin for campus infrastructure.</p>
            <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Covers payments, customer verification & campus domain.
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Worker Payouts Disbursed</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">₦{{ metrics.workerDisbursed.toLocaleString() }}</div>
            <p class="text-xs text-slate-500">Paid directly to hired student crew members for field tasks.</p>
            <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Disbursed automatically to student wallets upon job sign-off.
            </div>
          </div>
        </div>

        <!-- Payout History Table -->
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 class="text-base font-extrabold text-slate-900">Payout & Settlement Ledger</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-[10px] text-slate-500 uppercase font-black border-b border-slate-200 bg-slate-50">
                <tr>
                  <th class="py-3 px-3">Date</th>
                  <th class="py-3 px-3">Description</th>
                  <th class="py-3 px-3">Gross</th>
                  <th class="py-3 px-3">Platform Fee ({{ platformCommissionPercent }}%)</th>
                  <th class="py-3 px-3">Worker Share</th>
                  <th class="py-3 px-3 font-black text-slate-900">Net Profit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                <tr v-for="payout in payoutHistory" :key="payout.id" class="text-slate-700 hover:bg-slate-50">
                  <td class="py-3 px-3 font-mono text-slate-500">{{ payout.date }}</td>
                  <td class="py-3 px-3 font-bold text-slate-900">{{ payout.description }}</td>
                  <td class="py-3 px-3 font-semibold">₦{{ payout.gross.toLocaleString() }}</td>
                  <td class="py-3 px-3 text-purple-700 font-semibold">-₦{{ payout.platformFee.toLocaleString() }}</td>
                  <td class="py-3 px-3 text-slate-500 font-semibold">-₦{{ payout.workerPayout.toLocaleString() }}</td>
                  <td class="py-3 px-3 font-extrabold text-emerald-700">+₦{{ payout.net.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 5: DOMAIN & STOREFRONT SETTINGS -->
      <div v-else-if="activeTab === 'settings'" class="max-w-3xl space-y-6 animate-in fade-in duration-200">
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">Business Domain & Brand Identity</h2>
            <p class="text-xs text-slate-500">Configure your business domain on Erranders, campus coverage, and contact details.</p>
          </div>

          <form @submit.prevent="saveBusinessSettings" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Business Name</label>
              <input
                v-model="currentBusiness.name"
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-slate-900 focus:bg-white outline-none transition-colors"
              />
            </div>

            <!-- Subdomain Configuration (Strictly business-name.erranders.org) -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
                Unique Business Domain
              </label>
              <div class="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-slate-900 focus-within:bg-white overflow-hidden transition-colors">
                <input
                  v-model="currentBusiness.slug"
                  type="text"
                  class="flex-1 px-4 py-3 bg-transparent text-slate-900 font-mono font-bold text-sm outline-none"
                  placeholder="your-business"
                />
                <span class="px-4 py-3 bg-slate-100 text-slate-600 font-mono text-xs border-l border-slate-200 font-bold">
                  .erranders.org
                </span>
              </div>
              <p class="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <span>Public address:</span>
                <span class="font-mono font-bold text-emerald-700">https://{{ currentBusiness.slug }}.erranders.org</span>
                <span class="text-slate-400">· Admin address:</span>
                <span class="font-mono font-bold text-slate-700">https://{{ currentBusiness.slug }}.erranders.org/admin</span>
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Service Category</label>
                <select
                  v-model="currentBusiness.category"
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-slate-900 focus:bg-white outline-none"
                >
                  <option value="fumigation">Fumigation & Pest Control</option>
                  <option value="moving">Campus Moving & Luggage</option>
                  <option value="laundry">Laundry & Dry Cleaning</option>
                  <option value="repairs">Electronics & Gadget Repair</option>
                  <option value="cleaning">Hostel Room Cleaning</option>
                  <option value="haircare">Hair & Personal Grooming</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Official WhatsApp / Phone</label>
                <input
                  v-model="currentBusiness.phone"
                  type="text"
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-slate-900 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Hostels Covered</label>
              <input
                v-model="currentBusiness.coverage"
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-slate-900 focus:bg-white outline-none"
                placeholder="e.g. Moremi, Jaja, Mariere, Eni Njoku"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Business Bio / Pitch</label>
              <textarea
                v-model="currentBusiness.bio"
                rows="3"
                class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:border-slate-900 focus:bg-white outline-none"
              ></textarea>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button
                type="submit"
                class="px-6 py-3 rounded-xl bg-slate-900 hover:bg-[#FF5C1A] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Save Brand & Domain Settings
              </button>
              <NuxtLink
                :to="`/businesses/${currentBusiness.slug}`"
                target="_blank"
                class="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
              >
                Preview Storefront →
              </NuxtLink>
            </div>
          </form>
        </div>
      </div>

    </div>

    <!-- Modal: Assign Crew Member to Booking (Plain White) -->
    <div v-if="assignModal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div class="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-slate-900 text-base">Assign Worker to Job #{{ assignModal.job?.id }}</h3>
          <button @click="assignModal.isOpen = false" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
        </div>
        <p class="text-xs text-slate-500">Select an available crew member to execute this service at {{ assignModal.job?.hostelRoom }}.</p>
        
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <button
            v-for="member in staffList"
            :key="member.id"
            @click="confirmAssign(member)"
            class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-900 text-left flex items-center justify-between transition-colors"
          >
            <div>
              <h5 class="text-xs font-bold text-slate-900">{{ member.name }}</h5>
              <p class="text-[11px] text-slate-500">{{ member.role }} · {{ member.phone }}</p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ⭐ {{ member.rating }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: New Job Opening Modal -->
    <div v-if="isNewJobModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div class="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-slate-900 text-base">Create Campus Job Opening</h3>
          <button @click="isNewJobModalOpen = false" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
        </div>
        <p class="text-xs text-slate-500">Recruit campus students to execute tasks for your business.</p>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
            <input v-model="newOpeningTitle" type="text" placeholder="e.g. Porter / Field Technician" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Payout per Completed Task (₦)</label>
            <input v-model="newOpeningPay" type="number" placeholder="4000" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none" />
          </div>
          <button
            @click="publishJobOpening"
            class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF5C1A] text-white text-xs font-bold transition-colors"
          >
            Publish Opening
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, Globe, Copy, ExternalLink, Sparkles, LayoutDashboard,
  CalendarCheck, Users, Wallet, Settings, MapPin, Clock, X, Briefcase,
  ChevronDown, Plus
} from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { settingsApi } from '~/composables/useApi'

useSeoMeta({
  title: 'Business Mini-Admin & Dispatch | Erranders',
  description: 'Manage campus bookings, crew recruitment, payouts, and your unique business domain on Erranders.',
})

const route = useRoute()
const toast = useCustomToast()
const activeTab = ref('overview')
const bookingFilter = ref('all')
const isSwitcherOpen = ref(false)
const platformCommissionPercent = ref(15) // Hydrated from admin settings

// Pre-configured campus business examples showing that Fumigation is just one example
const SAMPLE_BUSINESSES = [
  {
    slug: 'fumigation',
    name: 'CleanZone Pest Control & Fumigation',
    shortName: 'CleanZone Fumigation',
    icon: '⚡',
    category: 'fumigation',
    phone: '+234 812 345 6789',
    coverage: 'All Campus Hostels (Moremi, Jaja, Mariere, Eni Njoku)',
    bio: 'Certified hostel pest eradication with trained student crew hands. Guaranteed bedbug knockout within 45 minutes.',
    gross: 284000,
    commission: 42600,
    worker: 112000,
    net: 129400,
  },
  {
    slug: 'campusmove',
    name: 'CampusMove Luggage & Logistics',
    shortName: 'CampusMove Crew',
    icon: '🚚',
    category: 'moving',
    phone: '+234 803 987 6543',
    coverage: 'Main Campus & Off-campus Hostels (Akoka, Bariga, Onike)',
    bio: 'Heavy luggage hauling, room swaps, and end-of-semester cartage with verified student porters.',
    gross: 340000,
    commission: 51000,
    worker: 150000,
    net: 139000,
  },
  {
    slug: 'freshfold',
    name: 'FreshFold Hostel Laundry & Press',
    shortName: 'FreshFold Laundry',
    icon: '🧺',
    category: 'laundry',
    phone: '+234 814 555 7788',
    coverage: 'Hostel Pickup & 24hr Doorstep Delivery',
    bio: 'Wash, dry, fold and starching for students and fellows with rapid turnaround.',
    gross: 195000,
    commission: 29250,
    worker: 78000,
    net: 87750,
  },
  {
    slug: 'quickfix',
    name: 'QuickFix Campus Laptop & Gadget Care',
    shortName: 'QuickFix Repairs',
    icon: '🔧',
    category: 'repairs',
    phone: '+234 901 222 3344',
    coverage: 'Faculty of Engineering, Library & Hostels',
    bio: 'Screen replacements, SSD upgrades, OS reinstallations and phone diagnostics right in your hostel room.',
    gross: 260000,
    commission: 39000,
    worker: 95000,
    net: 126000,
  },
]

// Current active business profile
const currentBusiness = ref({ ...SAMPLE_BUSINESSES[0] })

// Financial metrics
const metrics = computed(() => ({
  grossRevenue: currentBusiness.value.gross,
  platformFeeDeducted: currentBusiness.value.commission,
  workerDisbursed: currentBusiness.value.worker,
  netEarnings: currentBusiness.value.net,
}))

// Navigation tabs
const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings & Dispatch', icon: CalendarCheck, badge: '5' },
  { id: 'recruitment', label: 'Crew & Recruitment', icon: Users, badge: '3' },
  { id: 'payments', label: 'Payments & Ledger', icon: Wallet },
  { id: 'settings', label: 'Domain & Settings', icon: Settings },
]

// Sample Bookings data
const bookingsList = ref([
  { id: 'JOB-892', customerName: 'Adeola Balogun', phone: '08023456789', hostelRoom: 'Moremi Hall, Room B12', packageName: 'Move-In Fumigation + Deep Clean', amount: 28000, scheduledDate: 'Tomorrow', scheduledTime: '10:00 AM', status: 'Pending', assignedCrew: null },
  { id: 'JOB-891', customerName: 'Chinedu Eze', phone: '08134567890', hostelRoom: 'Jaja Hall, Room 405', packageName: 'Double / Shared Room Knockout', amount: 20000, scheduledDate: 'Today', scheduledTime: '2:30 PM', status: 'In Progress', assignedCrew: 'Ibrahim Sani' },
  { id: 'JOB-890', customerName: 'Zainab Bello', phone: '09012345678', hostelRoom: 'Mariere Hall, Room A08', packageName: 'Hostel Single Fumigation', amount: 14000, scheduledDate: 'Today', scheduledTime: '4:00 PM', status: 'Assigned', assignedCrew: 'Emeka Okafor' },
  { id: 'JOB-889', customerName: 'Tunde Bakare', phone: '08098765432', hostelRoom: 'Eni Njoku, Room C21', packageName: 'Hostel Single Room Service', amount: 14000, scheduledDate: 'Yesterday', scheduledTime: '11:00 AM', status: 'Completed', assignedCrew: 'Ibrahim Sani' },
  { id: 'JOB-888', customerName: 'Grace Adeleke', phone: '08122334455', hostelRoom: 'Honours Hall, Room 102', packageName: 'Complete Deep Clean & Prep', amount: 28000, scheduledDate: '2 days ago', scheduledTime: '1:00 PM', status: 'Completed', assignedCrew: 'Emeka Okafor' },
])

const filteredBookings = computed(() => {
  if (bookingFilter.value === 'all') return bookingsList.value
  return bookingsList.value.filter(b => b.status === bookingFilter.value)
})

// Active Job Openings for Recruitment
const activeJobOpenings = ref([
  { id: 'JOB-OP-1', title: 'Campus Field Technician / Porter', payPerJob: 4500, applicantsCount: 8, location: 'UNILAG Hostels' },
  { id: 'JOB-OP-2', title: 'Post-Service Deep Cleaner', payPerJob: 4000, applicantsCount: 5, location: 'Hostel Environs' },
])

// Student Applicants queue
const applicantList = ref([
  { id: 'APP-1', name: 'Segun Oladipo', role: 'Field Specialist', hostel: 'Jaja Hall', level: '300L Chemistry', phone: '08031122334', note: 'I have experience with safety operations and available weekday afternoons.' },
  { id: 'APP-2', name: 'Blessing Chukwuma', role: 'Service Crew', hostel: 'Moremi Hall', level: '200L Biochemistry', phone: '08149988776', note: 'Fast, punctual and ready to start immediately.' },
  { id: 'APP-3', name: 'Kabir Mohammed', role: 'Logistics Applicator', hostel: 'Mariere Hall', level: '400L Pharmacy', phone: '09055443322', note: 'Physically strong, polite with hostel residents.' },
])

// Hired Staff Roster
const staffList = ref([
  { id: 'STF-1', name: 'Ibrahim Sani', role: 'Lead Field Specialist', phone: '08022334455', status: 'Available', jobsCompleted: 19, totalEarned: 85500, rating: 4.9 },
  { id: 'STF-2', name: 'Emeka Okafor', role: 'Service Crew', phone: '08133445566', status: 'On Job', jobsCompleted: 14, totalEarned: 63000, rating: 4.8 },
  { id: 'STF-3', name: 'Amina Yusuf', role: 'Operations Partner', phone: '09044556677', status: 'Available', jobsCompleted: 8, totalEarned: 32000, rating: 5.0 },
])

// Payout history ledger
const payoutHistory = ref([
  { id: 'PAY-101', date: 'Oct 19, 2026', description: 'Hostel Room Service (Eni Njoku #C21)', gross: 14000, platformFee: 2100, workerPayout: 4500, net: 7400 },
  { id: 'PAY-102', date: 'Oct 18, 2026', description: 'Move-In Fumigation & Prep (Honours #102)', gross: 28000, platformFee: 4200, workerPayout: 9000, net: 14800 },
  { id: 'PAY-103', date: 'Oct 17, 2026', description: 'Double Shared Room Service (Jaja #210)', gross: 20000, platformFee: 3000, workerPayout: 6500, net: 10500 },
])

// Modal states
const assignModal = ref({ isOpen: false, job: null })
const isNewJobModalOpen = ref(false)
const newOpeningTitle = ref('')
const newOpeningPay = ref('')

const switchBusiness = (b) => {
  currentBusiness.value = { ...b }
  isSwitcherOpen.value = false
  toast.showToast({
    title: 'Business Loaded',
    message: `Now viewing ${b.name} (${b.slug}.erranders.org)`,
    toastType: 'info',
  })
}

const openAssignModal = (job) => {
  assignModal.value = { isOpen: true, job }
}

const confirmAssign = (worker) => {
  if (assignModal.value.job) {
    assignModal.value.job.assignedCrew = worker.name
    assignModal.value.job.status = 'Assigned'
    toast.showToast({
      title: 'Assigned',
      message: `${worker.name} assigned to ${assignModal.value.job.hostelRoom}`,
      toastType: 'success',
    })
  }
  assignModal.value.isOpen = false
}

const markJobComplete = (job) => {
  job.status = 'Completed'
  toast.showToast({
    title: 'Job Completed',
    message: `Job #${job.id} marked as completed! Payout calculated with ${platformCommissionPercent.value}% take-rate.`,
    toastType: 'success',
  })
}

const hireApplicant = (applicant) => {
  staffList.value.push({
    id: `STF-${Date.now()}`,
    name: applicant.name,
    role: applicant.role,
    phone: applicant.phone,
    status: 'Available',
    jobsCompleted: 0,
    totalEarned: 0,
    rating: 5.0,
  })
  applicantList.value = applicantList.value.filter((a) => a.id !== applicant.id)
  toast.showToast({
    title: 'Hired!',
    message: `${applicant.name} joined your active campus crew roster!`,
    toastType: 'success',
  })
}

const rejectApplicant = (applicant) => {
  applicantList.value = applicantList.value.filter((a) => a.id !== applicant.id)
  toast.showToast({
    title: 'Declined',
    message: `Applicant from ${applicant.name} declined.`,
    toastType: 'info',
  })
}

const publishJobOpening = () => {
  if (!newOpeningTitle.value) return
  activeJobOpenings.value.unshift({
    id: `JOB-OP-${Date.now()}`,
    title: newOpeningTitle.value,
    payPerJob: Number(newOpeningPay.value) || 4000,
    applicantsCount: 0,
    location: 'Campus Hostels',
  })
  isNewJobModalOpen.value = false
  newOpeningTitle.value = ''
  newOpeningPay.value = ''
  toast.showToast({
    title: 'Opening Published',
    message: 'Role is now visible on your business domain and recruitment board.',
    toastType: 'success',
  })
}

const copyDomain = () => {
  const url = `https://${currentBusiness.value.slug}.erranders.org`
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
    toast.showToast({
      title: 'Domain Copied',
      message: `${url} copied to clipboard!`,
      toastType: 'success',
    })
  }
}

const openStorefront = () => {
  const url = `/businesses/${currentBusiness.value.slug}`
  window.open(url, '_blank')
}

const saveBusinessSettings = () => {
  toast.showToast({
    title: 'Settings Saved',
    message: `Domain https://${currentBusiness.value.slug}.erranders.org updated successfully!`,
    toastType: 'success',
  })
}

const requestWithdrawal = () => {
  toast.showToast({
    title: 'Withdrawal Initiated',
    message: `₦${metrics.value.netEarnings.toLocaleString()} queued for transfer to verified bank account.`,
    toastType: 'success',
  })
}

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'Assigned':
      return 'bg-purple-50 text-purple-700 border border-purple-200'
    case 'Pending':
      return 'bg-amber-50 text-amber-800 border border-amber-200'
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200'
  }
}

onMounted(async () => {
  // If slug was passed in query params (?slug=campusmove), match that business
  if (route.query.slug) {
    const matched = SAMPLE_BUSINESSES.find((b) => b.slug === route.query.slug)
    if (matched) {
      currentBusiness.value = { ...matched }
    }
  }

  try {
    const res = await settingsApi.get('service_business_commission_percentage')
    if (res?.data?.value != null && !isNaN(Number(res.data.value))) {
      platformCommissionPercent.value = Number(res.data.value)
    }
  } catch (e) {
    // fallback to default 15%
  }
})
</script>
