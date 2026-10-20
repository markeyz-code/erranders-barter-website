<template>
  <main class="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-emerald-500 selection:text-black">
    <!-- Top Bar Navigation -->
    <header class="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <NuxtLink to="/services" class="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft class="w-4 h-4" />
            <span class="hidden sm:inline">Back to Marketplace</span>
          </NuxtLink>
          <span class="text-slate-700">|</span>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <h1 class="text-sm sm:text-base font-black text-white leading-none tracking-tight flex items-center gap-2">
                <span>{{ businessProfile.name }}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Partner
                </span>
              </h1>
              <p class="text-[11px] text-slate-400 font-medium">Business Mini-Admin & Dispatch</p>
            </div>
          </div>
        </div>

        <!-- Right: Domain Badge & Switcher -->
        <div class="flex items-center gap-2">
          <div class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <Globe class="w-3.5 h-3.5 text-emerald-400" />
            <span>{{ businessProfile.subdomain }}.erranders.org</span>
            <button @click="copySubdomain" class="ml-1 text-slate-400 hover:text-white transition-colors" title="Copy Storefront URL">
              <Copy class="w-3.5 h-3.5" />
            </button>
          </div>
          <NuxtLink to="/dashboard/business" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-95">
            <LayoutDashboard class="w-3.5 h-3.5 text-slate-400" />
            <span class="hidden sm:inline">Live Dashboard</span>
          </NuxtLink>
          <button @click="openStorefront" class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-95">
            <ExternalLink class="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      
      <!-- Subdomain Banner Alert -->
      <div class="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <span>Your Unique Campus Domain is Live!</span>
              <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">SSL Secured</span>
            </h4>
            <p class="text-xs text-slate-400 mt-0.5">
              Direct campus link: <a :href="'http://' + businessProfile.subdomain + '.erranders.org'" target="_blank" class="text-emerald-400 hover:underline font-mono">http://{{ businessProfile.subdomain }}.erranders.org</a> (Mapped directly to your bookings & team)
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="activeTab = 'settings'" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors">
            Configure Domain
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800 no-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2"
          :class="activeTab === tab.id ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
          <span v-if="tab.badge" class="px-1.5 py-0.5 rounded-full text-[10px] font-black" :class="activeTab === tab.id ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'">
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- TAB 1: OVERVIEW & KPIS -->
      <div v-if="activeTab === 'overview'" class="space-y-8 animate-in fade-in duration-200">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Gross Bookings</span>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-black text-white">₦{{ metrics.grossRevenue.toLocaleString() }}</span>
              <span class="text-xs font-bold text-emerald-400">+18% this wk</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Total customer escrow deposits</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Platform Commission</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">{{ platformCommissionPercent }}% Take-Rate</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-black text-purple-300">₦{{ metrics.platformFeeDeducted.toLocaleString() }}</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Configured in Erranders Admin</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Net Business Earnings</span>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-black text-emerald-400">₦{{ metrics.netEarnings.toLocaleString() }}</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Ready to withdraw</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">After staff payouts & commission</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Staff / Crew</span>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl sm:text-3xl font-black text-white">{{ staffList.length }}</span>
              <span class="text-xs font-bold text-slate-400">{{ applicantList.length }} applicants pending</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-2 font-medium">Trained student field operators</p>
          </div>
        </div>

        <!-- Quick Operations Split -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Bookings Waiting for Dispatch -->
          <div class="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-base font-bold text-white">Incoming Hostel Jobs</h3>
                <p class="text-xs text-slate-400">Latest room bookings requiring crew assignment</p>
              </div>
              <button @click="activeTab = 'bookings'" class="text-xs font-bold text-emerald-400 hover:underline">
                View All ({{ bookingsList.length }}) →
              </button>
            </div>

            <div class="space-y-3">
              <div v-for="job in bookingsList.slice(0, 3)" :key="job.id" class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-white">{{ job.customerName }}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="statusBadgeClass(job.status)">
                      {{ job.status }}
                    </span>
                  </div>
                  <p class="text-xs text-emerald-400 font-bold">{{ job.packageName }} • ₦{{ job.amount.toLocaleString() }}</p>
                  <p class="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-slate-500" /> {{ job.hostelRoom }}
                    <span class="mx-1 text-slate-600">•</span>
                    <Clock class="w-3 h-3 text-slate-500" /> {{ job.scheduledDate }} ({{ job.scheduledTime }})
                  </p>
                </div>
                <div class="flex items-center gap-2 self-start sm:self-center">
                  <button @click="openAssignModal(job)" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors">
                    {{ job.assignedCrew ? job.assignedCrew : 'Assign Crew' }}
                  </button>
                  <button @click="markJobComplete(job)" v-if="job.status !== 'Completed'" class="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors">
                    Finish Job
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Recruitment Applicants -->
          <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  <Users class="w-4 h-4 text-emerald-400" />
                  <span>New Student Applicants</span>
                </h3>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                  {{ applicantList.length }} New
                </span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Students who applied via your public recruitment portal to earn on campus.
              </p>

              <div class="space-y-3">
                <div v-for="app in applicantList.slice(0, 3)" :key="app.id" class="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <h5 class="text-xs font-bold text-white">{{ app.name }}</h5>
                    <p class="text-[11px] text-slate-400">{{ app.hostel }} • {{ app.phone }}</p>
                  </div>
                  <button @click="hireApplicant(app)" class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black transition-colors">
                    Hire
                  </button>
                </div>
              </div>
            </div>

            <button @click="activeTab = 'recruitment'" class="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors border border-slate-700">
              Manage All Recruitment Openings →
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: BOOKINGS & JOBS -->
      <div v-else-if="activeTab === 'bookings'" class="space-y-6 animate-in fade-in duration-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-black text-white">Customer Room Bookings</h2>
            <p class="text-xs text-slate-400">Manage orders, schedule equipment dispatch, and release completion milestones.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-400">Filter:</span>
            <button @click="bookingFilter = 'all'" class="px-3 py-1 rounded-lg text-xs font-bold" :class="bookingFilter === 'all' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'">All</button>
            <button @click="bookingFilter = 'Pending'" class="px-3 py-1 rounded-lg text-xs font-bold" :class="bookingFilter === 'Pending' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'">Pending</button>
            <button @click="bookingFilter = 'Completed'" class="px-3 py-1 rounded-lg text-xs font-bold" :class="bookingFilter === 'Completed' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'">Completed</button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-black border-b border-slate-800">
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
            <tbody class="divide-y divide-slate-800 font-medium">
              <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3.5 px-4 font-mono font-bold text-slate-300">#{{ booking.id }}</td>
                <td class="py-3.5 px-4">
                  <span class="font-bold text-white block">{{ booking.customerName }}</span>
                  <span class="text-slate-400 text-[11px]">{{ booking.hostelRoom }} • {{ booking.phone }}</span>
                </td>
                <td class="py-3.5 px-4 text-slate-300">
                  <span class="font-bold text-white block">{{ booking.packageName }}</span>
                  <span class="text-slate-500 text-[11px]">{{ booking.scheduledDate }} @ {{ booking.scheduledTime }}</span>
                </td>
                <td class="py-3.5 px-4 font-bold text-emerald-400">₦{{ booking.amount.toLocaleString() }}</td>
                <td class="py-3.5 px-4">
                  <span v-if="booking.assignedCrew" class="text-slate-200 font-bold flex items-center gap-1">
                    👤 {{ booking.assignedCrew }}
                  </span>
                  <span v-else class="text-amber-400 text-[11px] font-bold">Unassigned</span>
                </td>
                <td class="py-3.5 px-4">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="statusBadgeClass(booking.status)">
                    {{ booking.status }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right space-x-2">
                  <button @click="openAssignModal(booking)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors">
                    Assign
                  </button>
                  <button v-if="booking.status !== 'Completed'" @click="markJobComplete(booking)" class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-colors">
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
        <!-- Recruitment Openings & New Applicant Funnel -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Live Openings -->
          <div class="lg:col-span-1 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-white">Active Recruitment Roles</h3>
              <button @click="isNewJobModalOpen = true" class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors">
                + New Opening
              </button>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Openings published on your business domain and Decluttered campus gigs page.
            </p>

            <div class="space-y-3">
              <div v-for="job in activeJobOpenings" :key="job.id" class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-white text-xs">{{ job.title }}</h4>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Active</span>
                </div>
                <p class="text-xs text-slate-400 mb-2">Pay: <strong class="text-emerald-400">₦{{ job.payPerJob.toLocaleString() }}</strong> / job completed</p>
                <div class="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{{ job.applicantsCount }} applied</span>
                  <span>{{ job.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Applicant Pipeline -->
          <div class="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-white">Student Applicant Queue</h3>
                <p class="text-xs text-slate-400">Review, vet, and onboard campus students into your crew roster.</p>
              </div>
              <span class="text-xs font-bold text-emerald-400">{{ applicantList.length }} Pending Review</span>
            </div>

            <div class="space-y-3">
              <div v-for="applicant in applicantList" :key="applicant.id" class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-bold text-white">{{ applicant.name }}</h4>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{{ applicant.role }}</span>
                  </div>
                  <p class="text-xs text-slate-400">
                    Hostel: <strong class="text-slate-200">{{ applicant.hostel }}</strong> • Level: {{ applicant.level }} • Phone: <span class="font-mono text-emerald-400">{{ applicant.phone }}</span>
                  </p>
                  <p class="text-[11px] text-slate-500 italic">"{{ applicant.note }}"</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button @click="rejectApplicant(applicant)" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-rose-400 transition-colors">
                    Decline
                  </button>
                  <button @click="hireApplicant(applicant)" class="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-sm">
                    Accept & Hire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Staff Roster -->
        <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Active Business Crew Roster</h3>
              <p class="text-xs text-slate-400">Trained workers authorized to perform room services under your business brand.</p>
            </div>
            <span class="text-xs font-bold text-slate-400">{{ staffList.length }} Staff Hired</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="member in staffList" :key="member.id" class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {{ member.name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-xs">{{ member.name }}</h4>
                    <p class="text-[11px] text-slate-400">{{ member.role }}</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="member.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'">
                  {{ member.status }}
                </span>
              </div>
              <div class="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-center text-xs">
                <div class="p-2 rounded-xl bg-slate-900/60">
                  <span class="text-[10px] text-slate-500 uppercase block font-bold">Jobs Done</span>
                  <span class="font-bold text-white">{{ member.jobsCompleted }}</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-900/60">
                  <span class="text-[10px] text-slate-500 uppercase block font-bold">Earnings</span>
                  <span class="font-bold text-emerald-400">₦{{ member.totalEarned.toLocaleString() }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between pt-1 text-[11px]">
                <span class="text-slate-400">📱 {{ member.phone }}</span>
                <span class="text-amber-400 font-bold">⭐ {{ member.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: PAYMENTS & EARNINGS -->
      <div v-else-if="activeTab === 'payments'" class="space-y-6 animate-in fade-in duration-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Wallet Balance</span>
            <div class="text-3xl font-black text-emerald-400">₦{{ metrics.netEarnings.toLocaleString() }}</div>
            <p class="text-xs text-slate-500">Funds cleared after completed jobs and customer sign-off.</p>
            <button @click="withdrawModal = true" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-md shadow-emerald-500/20">
              Withdraw to Bank Account 🏦
            </button>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Erranders Commission Cut</span>
            <div class="text-2xl font-black text-purple-300">₦{{ metrics.platformFeeDeducted.toLocaleString() }}</div>
            <p class="text-xs text-slate-400">Platform take-rate is configured at <strong class="text-white">{{ platformCommissionPercent }}%</strong> in Erranders Admin.</p>
            <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Covers Escrow buyer guarantee, logistics dispatch, customer support, and server infrastructure.
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Worker Payouts Disbursed</span>
            <div class="text-2xl font-black text-white">₦{{ metrics.workerDisbursed.toLocaleString() }}</div>
            <p class="text-xs text-slate-400">Paid directly to hired student crew members for field tasks.</p>
            <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Disbursed automatically to student wallets upon job sign-off.
            </div>
          </div>
        </div>

        <!-- Payout History Table -->
        <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 class="text-base font-bold text-white">Payout & Settlement Ledger</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-[10px] text-slate-400 uppercase font-black border-b border-slate-800">
                <tr>
                  <th class="py-3">Date</th>
                  <th class="py-3">Description</th>
                  <th class="py-3">Gross</th>
                  <th class="py-3">Platform Fee ({{ platformCommissionPercent }}%)</th>
                  <th class="py-3">Worker Share</th>
                  <th class="py-3">Net Profit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                <tr v-for="payout in payoutHistory" :key="payout.id" class="text-slate-300">
                  <td class="py-3 font-mono">{{ payout.date }}</td>
                  <td class="py-3 font-bold text-white">{{ payout.description }}</td>
                  <td class="py-3">₦{{ payout.gross.toLocaleString() }}</td>
                  <td class="py-3 text-purple-400">-₦{{ payout.platformFee.toLocaleString() }}</td>
                  <td class="py-3 text-slate-400">-₦{{ payout.workerPayout.toLocaleString() }}</td>
                  <td class="py-3 font-bold text-emerald-400">+₦{{ payout.net.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 5: DOMAIN & STOREFRONT SETTINGS -->
      <div v-else-if="activeTab === 'settings'" class="max-w-3xl space-y-6 animate-in fade-in duration-200">
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h2 class="text-xl font-black text-white">Business Domain & Brand Identity</h2>
            <p class="text-xs text-slate-400">Configure your business subdomain on Erranders, campus coverage, and contact details.</p>
          </div>

          <form @submit.prevent="saveBusinessSettings" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Business Name</label>
              <input v-model="businessProfile.name" type="text" class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm focus:border-emerald-500 outline-none" />
            </div>

            <!-- Subdomain Configuration -->
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Unique Subdomain</label>
              <div class="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-emerald-500 overflow-hidden">
                <input v-model="businessProfile.subdomain" type="text" class="flex-1 px-4 py-3 bg-transparent text-white font-mono font-bold text-sm outline-none" />
                <span class="px-4 py-3 bg-slate-900 text-slate-400 font-mono text-xs border-l border-slate-800">.erranders.org</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-1">Students can book your service directly through this URL.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Official WhatsApp / Phone</label>
                <input v-model="businessProfile.phone" type="text" class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Hostels Covered</label>
                <input v-model="businessProfile.coverage" type="text" class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm focus:border-emerald-500 outline-none" placeholder="e.g. Moremi, Jaja, Eni Njoku" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Business Bio / Pitch</label>
              <textarea v-model="businessProfile.bio" rows="3" class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:border-emerald-500 outline-none"></textarea>
            </div>

            <button type="submit" class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-sm">
              Save Brand & Domain Settings
            </button>
          </form>
        </div>
      </div>

    </div>

    <!-- Modal: Assign Crew Member to Booking -->
    <div v-if="assignModal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-white text-base">Assign Worker to Job #{{ assignModal.job?.id }}</h3>
          <button @click="assignModal.isOpen = false" class="text-slate-400 hover:text-white"><X class="w-5 h-5" /></button>
        </div>
        <p class="text-xs text-slate-400">Select an available crew member to execute this room service.</p>
        
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <button
            v-for="member in staffList"
            :key="member.id"
            @click="confirmAssign(member)"
            class="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left flex items-center justify-between transition-colors"
          >
            <div>
              <h5 class="text-xs font-bold text-white">{{ member.name }}</h5>
              <p class="text-[11px] text-slate-400">{{ member.role }} • {{ member.phone }}</p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              ⭐ {{ member.rating }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Globe, Copy, ExternalLink, Sparkles, LayoutDashboard, CalendarCheck, Users, Wallet, Settings, MapPin, Clock, X } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { settingsApi } from '~/composables/useApi'

useSeoMeta({
  title: 'Business Mini-Admin | Campus Vendor Dispatch',
  description: 'Manage bookings, campus crew recruitment, payouts, and your unique business subdomain on Erranders.',
})

const toast = useCustomToast()
const activeTab = ref('overview')
const bookingFilter = ref('all')
const platformCommissionPercent = ref(15) // Hydrated from admin settings

// Business profile state
const businessProfile = ref({
  name: 'CleanZone Pest Control & Fumigation',
  subdomain: 'fumigation',
  phone: '+234 812 345 6789',
  coverage: 'All Campus Hostels (Moremi, Jaja, Mariere, Eni Njoku)',
  bio: 'Certified hospital-grade hostel pest eradication with trained student crew hands. Guaranteed bedbug knockout within 45 minutes.',
})

// Metrics
const metrics = ref({
  grossRevenue: 284000,
  platformFeeDeducted: 42600,
  workerDisbursed: 112000,
  netEarnings: 129400,
})

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
  { id: 'FUM-892', customerName: 'Adeola Balogun', phone: '08023456789', hostelRoom: 'Moremi Hall, Room B12', packageName: 'Move-In Fumigation + Deep Clean', amount: 28000, scheduledDate: 'Tomorrow', scheduledTime: '10:00 AM', status: 'Pending', assignedCrew: null },
  { id: 'FUM-891', customerName: 'Chinedu Eze', phone: '08134567890', hostelRoom: 'Jaja Hall, Room 405', packageName: 'Double / Shared Room Knockout', amount: 20000, scheduledDate: 'Today', scheduledTime: '2:30 PM', status: 'In Progress', assignedCrew: 'Ibrahim Sani' },
  { id: 'FUM-890', customerName: 'Zainab Bello', phone: '09012345678', hostelRoom: 'Mariere Hall, Room A08', packageName: 'Hostel Single Fumigation', amount: 14000, scheduledDate: 'Today', scheduledTime: '4:00 PM', status: 'Assigned', assignedCrew: 'Emeka Okafor' },
  { id: 'FUM-889', customerName: 'Tunde Bakare', phone: '08098765432', hostelRoom: 'Eni Njoku, Room C21', packageName: 'Hostel Single Fumigation', amount: 14000, scheduledDate: 'Yesterday', scheduledTime: '11:00 AM', status: 'Completed', assignedCrew: 'Ibrahim Sani' },
  { id: 'FUM-888', customerName: 'Grace Adeleke', phone: '08122334455', hostelRoom: 'Honours Hall, Room 102', packageName: 'Move-In Fumigation + Deep Clean', amount: 28000, scheduledDate: '2 days ago', scheduledTime: '1:00 PM', status: 'Completed', assignedCrew: 'Emeka Okafor' },
])

const filteredBookings = computed(() => {
  if (bookingFilter.value === 'all') return bookingsList.value
  return bookingsList.value.filter(b => b.status === bookingFilter.value)
})

// Active Job Openings
const activeJobOpenings = ref([
  { id: 'JOB-1', title: 'Campus Fumigation Applicator', payPerJob: 4500, applicantsCount: 8, location: 'UNILAG Hostels' },
  { id: 'JOB-2', title: 'Post-Fumigation Deep Clean Porter', payPerJob: 4000, applicantsCount: 5, location: 'Hostel Environs' },
])

// Student Applicants queue
const applicantList = ref([
  { id: 'APP-1', name: 'Segun Oladipo', role: 'Fumigation Applicator', hostel: 'Jaja Hall', level: '300L Chemistry', phone: '08031122334', note: 'I have experience with chemical spraying in my church hostel and available weekday afternoons.' },
  { id: 'APP-2', name: 'Blessing Chukwuma', role: 'Deep Clean Specialist', hostel: 'Moremi Hall', level: '200L Biochemistry', phone: '08149988776', note: 'Fast cleaner, ready to start immediately.' },
  { id: 'APP-3', name: 'Kabir Mohammed', role: 'Fumigation Applicator', hostel: 'Mariere Hall', level: '400L Pharmacy', phone: '09055443322', note: 'Punctual, physically strong, understands chemical safety precautions.' },
])

// Hired Staff Roster
const staffList = ref([
  { id: 'STF-1', name: 'Ibrahim Sani', role: 'Lead Applicator', phone: '08022334455', status: 'Available', jobsCompleted: 19, totalEarned: 85500, rating: 4.9 },
  { id: 'STF-2', name: 'Emeka Okafor', role: 'Fumigation Crew', phone: '08133445566', status: 'On Job', jobsCompleted: 14, totalEarned: 63000, rating: 4.8 },
  { id: 'STF-3', name: 'Amina Yusuf', role: 'Deep Clean Partner', phone: '09044556677', status: 'Available', jobsCompleted: 8, totalEarned: 32000, rating: 5.0 },
])

// Payout history ledger
const payoutHistory = ref([
  { id: 'PAY-101', date: 'Oct 19, 2026', description: 'Hostel Single Fumigation (Eni Njoku #C21)', gross: 14000, platformFee: 2100, workerPayout: 4500, net: 7400 },
  { id: 'PAY-102', date: 'Oct 18, 2026', description: 'Move-In Fumigation + Deep Clean (Honours #102)', gross: 28000, platformFee: 4200, workerPayout: 9000, net: 14800 },
  { id: 'PAY-103', date: 'Oct 17, 2026', description: 'Double Shared Room Knockout (Jaja #210)', gross: 20000, platformFee: 3000, workerPayout: 6500, net: 10500 },
])

// Modals
const assignModal = ref({ isOpen: false, job: null })
const isNewJobModalOpen = ref(false)

const openAssignModal = (job) => {
  assignModal.value = { isOpen: true, job }
}

const confirmAssign = (worker) => {
  if (assignModal.value.job) {
    assignModal.value.job.assignedCrew = worker.name
    assignModal.value.job.status = 'Assigned'
    toast.showToast({ title: 'Assigned', message: `${worker.name} assigned to ${assignModal.value.job.hostelRoom}`, toastType: 'success' })
  }
  assignModal.value.isOpen = false
}

const markJobComplete = (job) => {
  job.status = 'Completed'
  toast.showToast({ title: 'Job Completed', message: `Job #${job.id} marked as completed! Payout queued in escrow.`, toastType: 'success' })
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
    rating: 5.0
  })
  applicantList.value = applicantList.value.filter(a => a.id !== applicant.id)
  toast.showToast({ title: 'Hired!', message: `${applicant.name} has been welcomed into your active crew roster!`, toastType: 'success' })
}

const rejectApplicant = (applicant) => {
  applicantList.value = applicantList.value.filter(a => a.id !== applicant.id)
  toast.showToast({ title: 'Application Declined', message: `Application from ${applicant.name} declined.`, toastType: 'info' })
}

const copySubdomain = () => {
  const url = `http://${businessProfile.value.subdomain}.erranders.org`
  navigator.clipboard?.writeText(url)
  toast.showToast({ title: 'Copied!', message: `${url} copied to clipboard!`, toastType: 'success' })
}

const openStorefront = () => {
  window.open('/businesses/fumigpro', '_blank')
}

const saveBusinessSettings = () => {
  toast.showToast({ title: 'Saved', message: 'Brand & Subdomain settings updated successfully!', toastType: 'success' })
}

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    case 'In Progress': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    case 'Assigned': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    case 'Pending': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    default: return 'bg-slate-800 text-slate-300'
  }
}

onMounted(async () => {
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
