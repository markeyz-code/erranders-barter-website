<template>
  <div class="p-4 md:p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Not a business yet -->
      <div v-if="!loading && !business" class="py-20 text-center border border-dashed border-slate-200 rounded-2xl">
        <Building2 class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="font-extrabold text-slate-900">You don't have a business yet</p>
        <p class="text-sm text-slate-500 mt-1">Set one up to get a page, staff, recruitment and payouts.</p>
        <NuxtLink to="/become-a-business" class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
          Create my business
        </NuxtLink>
      </div>

      <div v-else-if="loading" class="space-y-4">
        <div class="h-24 rounded-2xl bg-slate-100 animate-pulse" />
        <div class="h-64 rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <template v-else-if="business">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-extrabold text-slate-900 truncate">{{ business.name }}</h1>
              <span v-if="business.isVerified" class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">Verified</span>
              <span
                class="px-2 py-0.5 rounded-md text-[11px] font-bold"
                :class="business.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ business.isActive ? 'Active' : 'Paused' }}
              </span>
            </div>
            <p class="text-sm text-slate-500 font-medium">
              /businesses/{{ business.slug }} · commission {{ business.commissionRate }}%
            </p>
          </div>
          <NuxtLink :to="`/businesses/${business.slug}`" class="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shrink-0">
            View public page
          </NuxtLink>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 border-b border-slate-200 mb-5 overflow-x-auto">
          <button
            v-for="tab in TABS"
            :key="tab.key"
            class="px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === tab.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- ── Staff ──────────────────────────────────────────────── -->
        <section v-if="activeTab === 'staff'">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-slate-600">{{ staff.length }} on the team</p>
            <button class="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold" @click="staffForm.open = true">
              Add staff
            </button>
          </div>

          <div v-if="staffForm.open" class="mb-4 p-4 rounded-2xl border border-slate-200 space-y-3">
            <input v-model="staffForm.name" placeholder="Name" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <input v-model="staffForm.role" placeholder="Role (e.g. Lead technician)" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <input v-model="staffForm.phone" placeholder="Phone (optional)" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <div class="flex gap-2">
              <button class="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold disabled:opacity-40" :disabled="!staffForm.name || !staffForm.role || busy" @click="addStaff">Save</button>
              <button class="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold" @click="staffForm.open = false">Cancel</button>
            </div>
          </div>

          <div v-if="staff.length === 0" class="py-12 text-center border border-dashed border-slate-200 rounded-2xl">
            <Users class="w-9 h-9 text-slate-300 mx-auto mb-2" />
            <p class="text-sm font-semibold text-slate-500">No staff yet.</p>
          </div>

          <div v-else class="space-y-2">
            <div v-for="person in staff" :key="person._id" class="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div class="min-w-0">
                <p class="text-sm font-bold text-slate-900 truncate">{{ person.name }}</p>
                <p class="text-xs text-slate-500">{{ person.role }}<span v-if="person.phone"> · {{ person.phone }}</span></p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button class="text-xs font-bold text-slate-600 hover:underline" @click="toggleStaff(person)">
                  {{ person.isActive ? 'Pause' : 'Activate' }}
                </button>
                <button class="text-xs font-bold text-red-600 hover:underline" @click="removeStaff(person)">Remove</button>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Recruitment ────────────────────────────────────────── -->
        <section v-else-if="activeTab === 'openings'">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-slate-600">{{ openings.length }} role(s)</p>
            <button class="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold" @click="openingForm.open = true">
              Post a role
            </button>
          </div>

          <div v-if="openingForm.open" class="mb-4 p-4 rounded-2xl border border-slate-200 space-y-3">
            <input v-model="openingForm.title" placeholder="Role title" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <textarea v-model="openingForm.description" rows="2" placeholder="What the job involves" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <div class="grid grid-cols-2 gap-2">
              <select v-model="openingForm.type" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm">
                <option value="full_time">Full time</option>
                <option value="part_time">Part time</option>
                <option value="contract">Contract</option>
              </select>
              <input v-model="openingForm.pay" placeholder="Pay (e.g. ₦25,000/mo)" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div class="flex gap-2">
              <button class="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold disabled:opacity-40" :disabled="!openingForm.title || busy" @click="addOpening">Post</button>
              <button class="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold" @click="openingForm.open = false">Cancel</button>
            </div>
          </div>

          <div v-if="openings.length === 0" class="py-12 text-center border border-dashed border-slate-200 rounded-2xl">
            <Briefcase class="w-9 h-9 text-slate-300 mx-auto mb-2" />
            <p class="text-sm font-semibold text-slate-500">No roles posted.</p>
          </div>

          <div v-else class="space-y-2">
            <div v-for="role in openings" :key="role._id" class="p-3 rounded-xl border border-slate-200">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-bold text-slate-900">{{ role.title }}</p>
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold capitalize">{{ role.type.replace('_', ' ') }}</span>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold" :class="role.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                      {{ role.isOpen ? 'Open' : 'Closed' }}
                    </span>
                  </div>
                  <p v-if="role.description" class="text-xs text-slate-500 mt-1">{{ role.description }}</p>
                  <p v-if="role.pay" class="text-xs font-bold text-brand-600 mt-1">{{ role.pay }}</p>
                </div>
                <div class="flex flex-col gap-1 shrink-0">
                  <button class="text-xs font-bold text-slate-600 hover:underline" @click="toggleOpening(role)">{{ role.isOpen ? 'Close' : 'Reopen' }}</button>
                  <button class="text-xs font-bold text-red-600 hover:underline" @click="removeOpening(role)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Earnings ───────────────────────────────────────────── -->
        <section v-else-if="activeTab === 'earnings'">
          <div v-if="!earnings" class="py-12 text-center border border-dashed border-slate-200 rounded-2xl">
            <Wallet class="w-9 h-9 text-slate-300 mx-auto mb-2" />
            <p class="text-sm font-semibold text-slate-500">No earnings recorded yet.</p>
          </div>

          <template v-else>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div class="p-4 rounded-2xl border border-slate-200">
                <p class="text-xs font-semibold text-slate-500">Gross</p>
                <p class="text-xl font-black text-slate-900">{{ naira(earnings.gross) }}</p>
              </div>
              <div class="p-4 rounded-2xl border border-slate-200">
                <p class="text-xs font-semibold text-slate-500">Platform commission ({{ business.commissionRate }}%)</p>
                <p class="text-xl font-black text-amber-600">{{ naira(earnings.commission) }}</p>
              </div>
              <div class="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                <p class="text-xs font-semibold text-emerald-700">You keep</p>
                <p class="text-xl font-black text-emerald-700">{{ naira(earnings.net) }}</p>
              </div>
              <div class="p-4 rounded-2xl border border-slate-200">
                <p class="text-xs font-semibold text-slate-500">Completed jobs</p>
                <p class="text-xl font-black text-slate-900">{{ earnings.completedJobs }}<span class="text-sm text-slate-400">/{{ earnings.totalJobs }}</span></p>
              </div>
            </div>

            <p v-if="earnings.basis" class="text-[11px] text-slate-400 mb-3">Calculated from {{ earnings.basis }}.</p>

            <div v-if="!earnings.payouts?.length" class="py-8 text-center border border-dashed border-slate-200 rounded-xl">
              <p class="text-sm text-slate-500 font-semibold">No completed jobs yet.</p>
            </div>

            <div v-else class="rounded-2xl border border-slate-200 overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-500">
                  <tr>
                    <th class="text-left font-semibold px-4 py-2.5">Job</th>
                    <th class="text-left font-semibold px-4 py-2.5">Date</th>
                    <th class="text-right font-semibold px-4 py-2.5">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(p, i) in earnings.payouts" :key="p.bookingId || i">
                    <td class="px-4 py-2.5 font-semibold text-slate-800">{{ p.serviceTitle || 'Service' }}</td>
                    <td class="px-4 py-2.5 text-slate-500">{{ p.date || '—' }}</td>
                    <td class="px-4 py-2.5 text-right font-bold text-slate-900">{{ naira(p.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </section>

        <!-- ── Profile ────────────────────────────────────────────── -->
        <section v-else>
          <div class="space-y-3 max-w-xl">
            <label class="block">
              <span class="text-xs font-bold text-slate-600">Description</span>
              <textarea v-model="profile.description" rows="3" class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            </label>
            <label class="block">
              <span class="text-xs font-bold text-slate-600">Phone</span>
              <input v-model="profile.phone" class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            </label>
            <label class="block">
              <span class="text-xs font-bold text-slate-600">Email</span>
              <input v-model="profile.email" class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            </label>
            <label class="block">
              <span class="text-xs font-bold text-slate-600">Address</span>
              <input v-model="profile.address" class="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            </label>

            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="profile.isActive" class="w-4 h-4 rounded border-slate-300 text-brand-600" />
              <span class="text-sm font-semibold text-slate-700">Accept work (visible on Declutter)</span>
            </label>

            <p class="text-[11px] text-slate-400">
              Commission is set by Declutter and cannot be changed here.
            </p>

            <button class="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold disabled:opacity-40" :disabled="busy" @click="saveProfile">
              {{ busy ? 'Saving…' : 'Save changes' }}
            </button>
            <span v-if="saved" class="ml-2 text-xs font-bold text-emerald-600">Saved</span>
          </div>
        </section>

        <p v-if="error" class="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">{{ error }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { Building2, Users, Briefcase, Wallet } from 'lucide-vue-next';
import {
  businessesApi,
  type Business,
  type BusinessEarnings,
  type BusinessOpening,
  type BusinessStaff,
  type OpeningType,
} from '@/api_factory/modules/businesses';

/**
 * The business mini-admin.
 *
 * This is the interface the owner asked for: a business (a fumigation company, a
 * laundry, a moving crew) runs its own operation here — staff, recruitment and the
 * money — without touching the platform admin. Commission is deliberately read-only.
 *
 * Everything is fetched from the API; there are no placeholder rows.
 */

definePageMeta({ layout: 'dashboard' });

const TABS = [
  { key: 'staff' as const, label: 'Staff' },
  { key: 'openings' as const, label: 'Recruitment' },
  { key: 'earnings' as const, label: 'Earnings' },
  { key: 'profile' as const, label: 'Profile' },
];

const activeTab = ref<'staff' | 'openings' | 'earnings' | 'profile'>('staff');
const business = ref<(Business & { commissionRate: number }) | null>(null);
const staff = ref<BusinessStaff[]>([]);
const openings = ref<BusinessOpening[]>([]);
const earnings = ref<BusinessEarnings | null>(null);

const loading = ref(true);
const busy = ref(false);
const error = ref('');
const saved = ref(false);

const staffForm = reactive({ open: false, name: '', role: '', phone: '' });
const openingForm = reactive({ open: false, title: '', description: '', type: 'part_time' as OpeningType, pay: '' });
const profile = reactive({ description: '', phone: '', email: '', address: '', isActive: true });

const naira = (n?: number) => (typeof n === 'number' ? `₦${n.toLocaleString('en-NG')}` : '—');

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await businessesApi.getMine();
    business.value = data as any;
    profile.description = data.description || '';
    profile.phone = data.phone || '';
    profile.email = data.email || '';
    profile.address = data.address || '';
    profile.isActive = data.isActive !== false;
    await Promise.all([loadStaff(), loadOpenings(), loadEarnings()]);
  } catch (err: any) {
    if (err?.response?.status === 404 || err?.response?.status === 403) {
      business.value = null; // simply not a business yet — an empty state, not an error
    } else {
      error.value = err?.response?.data?.message || 'Could not load your business.';
    }
  } finally {
    loading.value = false;
  }
};

const loadStaff = async () => {
  try {
    const { data } = await businessesApi.listStaff();
    staff.value = Array.isArray(data) ? data : (data as any)?.data ?? [];
  } catch { staff.value = []; }
};

const loadOpenings = async () => {
  try {
    const { data } = await businessesApi.listOpenings();
    openings.value = Array.isArray(data) ? data : (data as any)?.data ?? [];
  } catch { openings.value = []; }
};

const loadEarnings = async () => {
  try {
    const { data } = await businessesApi.getEarnings();
    earnings.value = data;
  } catch { earnings.value = null; }
};

const switchTab = (key: typeof activeTab.value) => {
  activeTab.value = key;
  if (key === 'earnings' && !earnings.value) void loadEarnings();
};

/** Run a mutation with the shared busy/error handling. */
const run = async (fn: () => Promise<unknown>) => {
  busy.value = true;
  error.value = '';
  try {
    await fn();
    return true;
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'That did not work. Please try again.';
    return false;
  } finally {
    busy.value = false;
  }
};

const addStaff = async () => {
  const ok = await run(() =>
    businessesApi.addStaff({
      name: staffForm.name.trim(),
      role: staffForm.role.trim(),
      phone: staffForm.phone.trim() || undefined,
    }),
  );
  if (ok) {
    staffForm.open = false;
    staffForm.name = staffForm.role = staffForm.phone = '';
    await loadStaff();
  }
};

const toggleStaff = async (person: BusinessStaff) => {
  await run(() => businessesApi.updateStaff(person._id, { isActive: !person.isActive }));
  await loadStaff();
};

const removeStaff = async (person: BusinessStaff) => {
  if (!confirm(`Remove ${person.name} from your team?`)) return;
  await run(() => businessesApi.removeStaff(person._id));
  await loadStaff();
};

const addOpening = async () => {
  const ok = await run(() =>
    businessesApi.addOpening({
      title: openingForm.title.trim(),
      description: openingForm.description.trim() || undefined,
      type: openingForm.type,
      pay: openingForm.pay.trim() || undefined,
    }),
  );
  if (ok) {
    openingForm.open = false;
    openingForm.title = openingForm.description = openingForm.pay = '';
    await loadOpenings();
  }
};

const toggleOpening = async (role: BusinessOpening) => {
  await run(() => businessesApi.updateOpening(role._id, { isOpen: !role.isOpen }));
  await loadOpenings();
};

const removeOpening = async (role: BusinessOpening) => {
  if (!confirm(`Delete the "${role.title}" role?`)) return;
  await run(() => businessesApi.removeOpening(role._id));
  await loadOpenings();
};

const saveProfile = async () => {
  const ok = await run(() =>
    businessesApi.updateMine({
      description: profile.description.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      address: profile.address.trim(),
      isActive: profile.isActive,
    }),
  );
  if (ok) {
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 2500);
    await load();
  }
};

onMounted(load);
</script>
