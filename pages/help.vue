<template>
  <main class="min-h-screen bg-white pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <p class="text-xs font-black uppercase tracking-wider text-brand-600 mb-1">Help centre</p>
      <h1 class="text-3xl font-extrabold text-slate-900">Every question, answered</h1>
      <p class="mt-2 text-slate-500 font-medium">
        Buying, selling, swapping, delivery, safety and business accounts.
      </p>

      <input
        v-model="search"
        type="search"
        placeholder="Search — e.g. refund, delivery, scam, free"
        class="mt-5 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
      />

      <!-- Group chips -->
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="group in GROUPS"
          :key="group.key"
          class="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
          :class="activeGroup === group.key
            ? 'bg-brand-600 text-white border-brand-600'
            : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
          @click="activeGroup = group.key"
        >
          {{ group.label }}
        </button>
      </div>

      <div v-if="results.length === 0" class="mt-10 py-14 text-center border border-dashed border-slate-200 rounded-2xl">
        <SearchX class="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p class="font-bold text-slate-900">Nothing matches "{{ search }}"</p>
        <p class="text-sm text-slate-500 mt-1">
          Try a different word, or
          <NuxtLink to="/contact" class="font-bold text-brand-600 hover:underline">message support</NuxtLink>.
        </p>
      </div>

      <div v-else class="mt-6 space-y-3">
        <details
          v-for="entry in results"
          :key="entry.q"
          class="rounded-2xl border border-slate-200 p-4 group"
        >
          <summary class="cursor-pointer flex items-start justify-between gap-3 list-none">
            <span class="text-sm font-bold text-slate-900">{{ entry.q }}</span>
            <ChevronDown class="w-4 h-4 text-slate-400 shrink-0 mt-0.5 group-open:rotate-180 transition-transform" />
          </summary>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed">{{ entry.a }}</p>
          <NuxtLink v-if="entry.to" :to="entry.to" class="mt-2 inline-block text-xs font-bold text-brand-600 hover:underline">
            {{ entry.toLabel }}
          </NuxtLink>
        </details>
      </div>

      <!-- Support -->
      <div class="mt-10 rounded-2xl border border-slate-200 p-5 bg-slate-50">
        <p class="text-sm font-extrabold text-slate-900">Still stuck?</p>
        <p class="text-xs text-slate-500 mt-1">Message us and you'll get a reference number you can quote.</p>
        <NuxtLink to="/contact" class="inline-block mt-3 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Message support
        </NuxtLink>

        <div class="mt-4 pt-4 border-t border-slate-200">
          <p class="text-xs font-bold text-slate-600">Or call the support team</p>
          <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-600">
            <a v-for="person in SUPPORT" :key="person.phone" :href="`tel:${person.phone}`" class="hover:text-brand-600">
              {{ person.name }} · {{ person.phone }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown, SearchX } from 'lucide-vue-next';

/**
 * The help centre.
 *
 * Every answer here describes something the platform actually does. Where a common
 * assumption is wrong — for example that buyers pay to contact a seller — the answer
 * says so plainly rather than inventing a feature.
 */

definePageMeta({ layout: 'default' });
useSeoMeta({
  title: 'Help centre — Decluttered',
  description: 'How to buy, sell, swap, get delivery, stay safe and register a business on Decluttered.',
});

const SUPPORT = [
  { name: 'Ruth', phone: '+2348106600919' },
  { name: 'Ife', phone: '+2348179495795' },
  { name: 'Kim', phone: '+2348052854256' },
  { name: 'Brandy', phone: '+2348139908262' },
];

const GROUPS = [
  { key: 'all', label: 'All' },
  { key: 'selling', label: 'Selling' },
  { key: 'buying', label: 'Buying' },
  { key: 'safety', label: 'Safety' },
  { key: 'business', label: 'Business' },
];

const FAQ: Array<{ q: string; a: string; group: string; to?: string; toLabel?: string }> = [
  {
    group: 'selling',
    q: 'How do I sell my items on Decluttered?',
    a: 'Tap Sell, add photos, a title, your price and the condition, then publish. Your listing is live immediately and appears in Explore and on the home page.',
    to: '/sell',
    toLabel: 'Start a listing',
  },
  {
    group: 'selling',
    q: 'Is it free to list items for sale?',
    a: 'Yes. Listing costs nothing and there is no charge to browse, message or swap. Declutter takes a small commission only when a sale completes through escrow — you never pay to advertise.',
  },
  {
    group: 'selling',
    q: 'What should I do when an item I advertised has been sold?',
    a: 'Open the listing from your dashboard and mark it sold. That removes it from Explore so buyers stop asking, and keeps your storefront accurate.',
    to: '/dashboard/listings',
    toLabel: 'Manage my listings',
  },
  {
    group: 'selling',
    q: 'Can I negotiate the price with a seller?',
    a: 'Yes. On a listing you can send an offer with a price, and the seller can accept, decline or counter. Nothing is charged until you both agree.',
  },
  {
    group: 'selling',
    q: 'Can I swap my item for one of a different value, and how is the difference settled?',
    a: 'Yes. A swap offer names the item you want and the item you are giving, and you can add a cash top-up for the difference. Whoever offers the top-up pays it through escrow, so both sides are protected.',
  },
  {
    group: 'selling',
    q: 'Are there restrictions on the types of items I can advertise?',
    a: 'Yes. No weapons, drugs, prescription medicine, live animals, stolen goods, counterfeit branded items, or anything illegal. Academic work offered for cheating is also not allowed. Listings that break these rules are removed and repeat offenders are suspended.',
  },
  {
    group: 'buying',
    q: 'How can I know if an item I am buying is in good condition?',
    a: 'Every listing carries a stated condition. Read it alongside the photos, and ask the seller anything you are unsure about before paying. If the item arrives materially different from what was described, open a dispute rather than accepting delivery.',
  },
  {
    group: 'buying',
    q: 'How do I receive an item I purchase, and who handles the delivery?',
    a: 'You choose at checkout: meet the seller on campus, or use a Declutter rider. Riders are tracked in the app, and the seller is only paid once you confirm you received the item.',
  },
  {
    group: 'buying',
    q: 'How do I know if an item is still available or has already been sold?',
    a: 'Listings show their status. Sold items are labelled and removed from Explore, so anything you can still open is available. If a seller has gone quiet, see what to do below.',
  },
  {
    group: 'buying',
    q: 'What services can I book through Decluttered?',
    a: 'Barbers, braiders and nail techs, tutors, photographers, laundry, cleaning, phone and laptop repairs, food and more. Everything bookable is under Services, with prices and free slots shown per provider.',
    to: '/services',
    toLabel: 'Browse services',
  },
  {
    group: 'buying',
    q: 'Does the platform handle payments between buyers and sellers?',
    a: 'Yes. Pay inside Declutter and the money is held in escrow. The seller is only paid after you confirm you received what you paid for. Never pay outside the app — that is the one way to lose your protection.',
  },
  {
    group: 'safety',
    q: 'What happens if an item is faulty, misrepresented, or I suspect a scam?',
    a: 'Do not confirm delivery. Open a dispute on the order and describe the problem. The money stays in escrow while it is reviewed, and it can be refunded to you or released to the seller depending on the outcome.',
    to: '/dashboard/trades',
    toLabel: 'My orders',
  },
  {
    group: 'safety',
    q: 'What do I do if a seller does not respond to my messages?',
    a: 'Message them first from the listing. If there is no reply and you have already paid, open a dispute — the funds are still in escrow and will not reach the seller while it is unresolved. You can also report the listing.',
  },
  {
    group: 'safety',
    q: 'How do I report an incorrect or misleading advertisement?',
    a: 'Open the listing and choose Report. Pick the reason, describe what is wrong, and it goes to the moderation queue. The seller is never told who reported them.',
  },
  {
    group: 'safety',
    q: 'How can I report a suspicious listing or a fraudulent user?',
    a: 'The same Report button is on every listing and business page. A report is filed against the listing or the person, and scam reports are escalated immediately.',
  },
  {
    group: 'safety',
    q: 'How do I know if a seller is genuine?',
    a: 'Check their rating and the reviews left by students they have actually traded with, plus the verified badge where it appears. A young account with no history is not automatically a problem, but keep the payment inside escrow.',
  },
  {
    group: 'safety',
    q: 'Does the platform verify the identity of buyers and sellers?',
    a: 'We verify accounts by email and phone, and verified badges appear on profiles that have completed that step. We do not currently run government-ID identity checks, so treat the badge as "this account has been confirmed reachable", not as a background check. Escrow is what protects your money.',
  },
  {
    group: 'safety',
    q: 'What happens if a buyer pays to connect with a seller but the seller does not respond?',
    a: 'Declutter does not charge buyers to contact a seller — messaging is free, so this cannot happen. If a seller has accepted payment and gone quiet, open a dispute and the escrowed funds are held until it is resolved.',
  },
  {
    group: 'business',
    q: 'How can I become a service provider or register my business?',
    a: 'For a personal service — barber, tutor, photographer — create a provider profile and list what you do. For a business with staff, branches or a shop, register on the business platform and you get a dashboard and your own name.erranders.org address.',
    to: '/become-a-business',
    toLabel: 'Register a business',
  },
  {
    group: 'business',
    q: 'Who can I contact if I need technical support or assistance?',
    a: 'Use the contact form and you will get a reference number, or call the support team listed below. Both reach a real person.',
    to: '/contact',
    toLabel: 'Message support',
  },
];

const search = ref('');
const activeGroup = ref('all');

const results = computed(() => {
  const term = search.value.trim().toLowerCase();
  return FAQ.filter((entry) => {
    if (activeGroup.value !== 'all' && entry.group !== activeGroup.value) return false;
    if (!term) return true;
    return entry.q.toLowerCase().includes(term) || entry.a.toLowerCase().includes(term);
  });
});
</script>
