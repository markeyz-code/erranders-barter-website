<template>
  <!-- hero -->
  <section v-if="type === 'hero'" class="relative overflow-hidden bg-slate-900">
    <img v-if="p.image" :src="p.image" alt="" class="absolute inset-0 w-full h-full object-cover opacity-40" />
    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
        {{ p.headline || business.name }}
      </h1>
      <p v-if="p.subheadline" class="mt-3 text-base sm:text-lg text-slate-200 font-medium max-w-2xl mx-auto">
        {{ p.subheadline }}
      </p>
      <NuxtLink
        v-if="p.ctaLabel"
        :to="p.ctaHref || '/services'"
        class="inline-block mt-7 px-6 py-3 rounded-xl text-white text-sm font-bold"
        :style="{ backgroundColor: accent }"
      >
        {{ p.ctaLabel }}
      </NuxtLink>
    </div>
  </section>

  <!-- about -->
  <section v-else-if="type === 'about'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'About us' }}</h2>
    <p class="mt-3 text-slate-600 leading-relaxed whitespace-pre-line">{{ p.body }}</p>
  </section>

  <!-- services: pulled live from the business's real offerings -->
  <section v-else-if="type === 'services'" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'What we do' }}</h2>
    <p v-if="p.note" class="mt-1 text-sm text-slate-500">{{ p.note }}</p>

    <div v-if="services.length === 0" class="mt-5 py-10 text-center border border-dashed border-slate-200 rounded-2xl">
      <p class="text-sm text-slate-500">Nothing published yet.</p>
    </div>
    <div v-else class="mt-5 grid sm:grid-cols-2 gap-3">
      <NuxtLink
        v-for="service in services"
        :key="service._id"
        :to="`/services/${service._id}`"
        class="rounded-2xl border border-slate-200 p-4 hover:border-brand-300 transition-colors"
      >
        <p class="font-bold text-slate-900">{{ service.title }}</p>
        <p v-if="service.description" class="mt-1 text-sm text-slate-500 line-clamp-2">{{ service.description }}</p>
        <p class="mt-2 text-sm font-black" :style="{ color: accent }">{{ priceLabel(service) }}</p>
      </NuxtLink>
    </div>
  </section>

  <!-- shop: the business's real catalogue -->
  <section v-else-if="type === 'products'" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'Shop' }}</h2>
    <p v-if="p.note" class="mt-1 text-sm text-slate-500">{{ p.note }}</p>

    <div v-if="products.length === 0" class="mt-5 py-10 text-center border border-dashed border-slate-200 rounded-2xl">
      <p class="text-sm text-slate-500">Nothing in the shop yet.</p>
    </div>
    <div v-else class="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div v-for="product in products" :key="product._id" class="rounded-2xl border border-slate-200 overflow-hidden">
        <div class="aspect-square bg-slate-100">
          <img
            v-if="product.images?.length"
            :src="product.images[0]"
            :alt="product.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <ShoppingBag class="w-8 h-8 text-slate-300" />
          </div>
        </div>
        <div class="p-3">
          <p class="text-sm font-bold text-slate-900 line-clamp-2">{{ product.name }}</p>
          <p class="mt-1 text-sm font-black" :style="{ color: accent }">{{ naira(product.sellPrice) }}</p>
          <p class="text-[11px] font-semibold" :class="product.inStock ? 'text-emerald-600' : 'text-slate-400'">
            {{ product.inStock ? 'In stock' : 'Sold out' }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- gallery -->
  <section v-else-if="type === 'gallery'" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'Our work' }}</h2>
    <div v-if="images.length === 0" class="mt-5 py-10 text-center border border-dashed border-slate-200 rounded-2xl">
      <p class="text-sm text-slate-500">No photos yet.</p>
    </div>
    <div v-else class="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
      <img
        v-for="(src, i) in images"
        :key="i"
        :src="src"
        alt=""
        class="w-full aspect-square object-cover rounded-2xl"
        loading="lazy"
      />
    </div>
  </section>

  <!-- hours -->
  <section v-else-if="type === 'hours'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'Opening hours' }}</h2>
    <div v-if="rows.length === 0" class="mt-3 text-sm text-slate-500">Hours not published.</div>
    <dl v-else class="mt-4 rounded-2xl border border-slate-200 divide-y divide-slate-100">
      <div v-for="(row, i) in rows" :key="i" class="flex items-center justify-between px-4 py-2.5">
        <dt class="text-sm font-semibold text-slate-700">{{ row.day }}</dt>
        <dd class="text-sm font-bold text-slate-900">{{ row.hours }}</dd>
      </div>
    </dl>
  </section>

  <!-- faq -->
  <section v-else-if="type === 'faq'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'Questions' }}</h2>
    <div class="mt-4 space-y-2">
      <details v-for="(item, i) in faqItems" :key="i" class="rounded-xl border border-slate-200 p-4">
        <summary class="cursor-pointer text-sm font-bold text-slate-900">{{ item.q }}</summary>
        <p class="mt-2 text-sm text-slate-600 whitespace-pre-line">{{ item.a }}</p>
      </details>
    </div>
  </section>

  <!-- testimonials -->
  <section v-else-if="type === 'testimonials'" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'What customers say' }}</h2>
    <div class="mt-5 grid sm:grid-cols-2 gap-3">
      <blockquote v-for="(item, i) in testimonialItems" :key="i" class="rounded-2xl border border-slate-200 p-4">
        <p class="text-sm text-slate-700 italic">“{{ item.quote }}”</p>
        <footer class="mt-2 text-xs font-bold text-slate-500">— {{ item.name }}</footer>
      </blockquote>
    </div>
  </section>

  <!-- contact -->
  <section v-else-if="type === 'contact'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-2xl font-extrabold text-slate-900">{{ p.title || 'Get in touch' }}</h2>
    <div class="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
      <a v-if="business.phone" :href="`tel:${business.phone}`" class="inline-flex items-center gap-1.5 hover:underline">
        <Phone class="w-4 h-4" /> {{ business.phone }}
      </a>
      <a v-if="business.email" :href="`mailto:${business.email}`" class="inline-flex items-center gap-1.5 hover:underline">
        <Mail class="w-4 h-4" /> {{ business.email }}
      </a>
      <span v-if="business.address" class="inline-flex items-center gap-1.5">
        <MapPin class="w-4 h-4" /> {{ business.address }}
      </span>
    </div>
  </section>

  <!-- cta -->
  <section v-else-if="type === 'cta'" class="py-14" :style="{ backgroundColor: accent }">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-2xl font-extrabold text-white">{{ p.headline || 'Ready when you are' }}</h2>
      <p v-if="p.body" class="mt-2 text-sm text-white/85">{{ p.body }}</p>
      <NuxtLink
        v-if="p.buttonLabel"
        :to="p.buttonHref || '/services'"
        class="inline-block mt-5 px-6 py-3 rounded-xl bg-white text-sm font-bold"
        :style="{ color: accent }"
      >
        {{ p.buttonLabel }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Phone, Mail, MapPin, ShoppingBag } from 'lucide-vue-next';
import { formatPriceLabel } from '@/composables/modules/services/useServiceFormatting';

/**
 * Renders one designed section of a business's public page.
 *
 * The block `type` decides which markup runs, and an unrecognised type renders nothing —
 * so a page saved by an older build cannot break the site. Content that lives in the
 * database (services, contact details) is read from the API, never copied into the block.
 */

const props = defineProps<{
  block: { type: string; props: Record<string, any> };
  business: any;
  services: any[];
  products?: any[];
  accent: string;
}>();

const type = computed(() => props.block?.type);
const p = computed<Record<string, any>>(() => props.block?.props || {});

const images = computed<string[]>(() => {
  const raw = p.value.images;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry: any) => (typeof entry === 'string' ? entry : entry?.value))
    .filter((value: any) => typeof value === 'string' && value.length > 0);
});

const rows = computed<any[]>(() =>
  Array.isArray(p.value.rows) ? p.value.rows.filter((row: any) => row?.day) : [],
);

const faqItems = computed<any[]>(() =>
  Array.isArray(p.value.items) ? p.value.items.filter((item: any) => item?.q) : [],
);

const testimonialItems = computed<any[]>(() =>
  Array.isArray(p.value.items) ? p.value.items.filter((item: any) => item?.quote) : [],
);

const priceLabel = (service: any) => formatPriceLabel(service?.priceType, service?.price);
const products = computed<any[]>(() => props.products || []);
const naira = (n?: number) => (typeof n === 'number' ? `₦${n.toLocaleString('en-NG')}` : '—');
</script>
