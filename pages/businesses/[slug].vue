<template>
  <main class="min-h-screen bg-white">
    <div v-if="loading" class="max-w-5xl mx-auto px-4 py-10">
      <div class="h-40 rounded-2xl bg-slate-100 animate-pulse mb-5" />
      <div class="h-64 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else-if="error" class="max-w-5xl mx-auto px-4 py-24 text-center">
      <Building2 class="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <p class="text-xl font-extrabold text-slate-900">This business isn't on Declutter</p>
      <p class="text-sm text-slate-500 mt-1">{{ error }}</p>
      <NuxtLink to="/become-a-business" class="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold">
        List your business
      </NuxtLink>
    </div>

    <template v-else-if="business">
      <!-- Study Guard / Academic Focus Banner -->
      <section
        v-if="business.studyMode?.isActive"
        class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6"
      >
        <div class="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 p-4 sm:p-5 shadow-sm">
          <div class="flex items-start gap-3.5">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20">
              <GraduationCap class="h-5 w-5" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                  <span class="relative flex h-2 w-2">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-amber-600"></span>
                  </span>
                  Study Guard Active
                </span>
                <span class="text-xs font-semibold text-amber-800/80">Lectures / Study Hours in Session</span>
              </div>
              <p class="mt-1.5 text-sm font-semibold text-amber-950 leading-relaxed">
                {{ business.studyMode.notice || "Currently attending classes. Orders and requests placed now will be confirmed and processed right after lectures!" }}
              </p>
              <div v-if="business.studyMode.lectureSchedule && business.studyMode.lectureSchedule.length > 0" class="mt-2.5 flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Clock class="w-3 h-3" /> Scheduled Class Hours:
                </span>
                <span
                  v-for="(slot, i) in business.studyMode.lectureSchedule"
                  :key="i"
                  class="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-amber-200/60 shadow-xs"
                >
                  <span class="font-bold text-amber-900">{{ slot.day }}:</span> {{ slot.startTime }} - {{ slot.endTime }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Resource library: shown regardless of whether a page has been designed. -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <NuxtLink
          :to="`/library/${business.slug}`"
          class="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors"
        >
          <div class="min-w-0">
            <p class="font-bold text-slate-900">Resource library</p>
            <p class="text-xs text-slate-500 font-medium">
              Notes and materials {{ business.name }} shares with students.
            </p>
          </div>
          <span class="text-sm font-bold text-brand-600 shrink-0">Open</span>
        </NuxtLink>
      </section>

      <!-- Owner-designed page. Only rendered when the business has published one. -->
      <template v-if="design && design.blocks.length > 0">
        <PageBlock
          v-for="block in design.blocks"
          :key="block.id"
          :block="block"
          :business="business"
          :services="designServices"
          :products="designProducts"
          :accent="design.accentColor || '#FF5C1A'"
        />

        <!-- Roles still live outside the design: hiring is platform behaviour. -->
        <section v-if="openings.length" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 class="text-2xl font-extrabold text-slate-900">Work with us</h2>
          <p class="text-sm text-slate-500 font-medium mt-1 mb-4">Open roles at {{ business.name }}</p>
          <div class="space-y-3">
            <div v-for="role in openings" :key="role._id" class="rounded-2xl border border-slate-200 p-4">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-bold text-slate-900">{{ role.title }}</p>
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold capitalize">
                      {{ role.type.replace('_', ' ') }}
                    </span>
                    <span v-if="role.pay" class="text-xs font-bold text-brand-600">{{ role.pay }}</span>
                  </div>
                  <p v-if="role.description" class="mt-1.5 text-sm text-slate-600">{{ role.description }}</p>
                </div>
                <button class="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0" @click="openApply(role)">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </section>

        <ApplyModal
          :role="applyFor"
          :business-name="business.name"
          :slug="slug"
          @close="closeApply"
          @applied="onApplied"
        />
      </template>

      <template v-else>
      <!-- Banner + identity -->
      <div class="relative">
        <div class="h-40 sm:h-56 bg-slate-900 overflow-hidden">
          <img v-if="business.banner" :src="business.banner" :alt="business.name" class="w-full h-full object-cover opacity-80" />
        </div>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="-mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
            <div class="w-24 h-24 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden shrink-0">
              <img v-if="business.logo" :src="business.logo" :alt="business.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-2xl font-black">
                {{ business.name.charAt(0) }}
              </div>
            </div>
            <div class="pb-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-2xl font-extrabold text-slate-900">{{ business.name }}</h1>
                <span v-if="business.isVerified" class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                  Verified
                </span>
              </div>
              <p class="text-sm font-semibold text-slate-500 capitalize">{{ business.category }}</p>
              <!-- Every business owns a subdomain, not a path. -->
              <a
                :href="`https://${business.slug}.erranders.org`"
                target="_blank"
                rel="noopener"
                class="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
              >
                <Globe class="w-3 h-3" /> {{ business.slug }}.erranders.org
              </a>
            </div>
          </div>

          <p v-if="business.description" class="mt-4 text-slate-600 leading-relaxed">{{ business.description }}</p>

          <div class="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <span v-if="business.address" class="inline-flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5" /> {{ business.address }}</span>
            <span v-if="business.phone" class="inline-flex items-center gap-1.5"><Phone class="w-3.5 h-3.5" /> {{ business.phone }}</span>
            <span v-if="business.email" class="inline-flex items-center gap-1.5"><Mail class="w-3.5 h-3.5" /> {{ business.email }}</span>
          </div>
        </div>
      </div>

      <!-- Open roles -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-lg font-extrabold text-slate-900 mb-1">Work with us</h2>
        <p class="text-sm text-slate-500 font-medium mb-4">Open roles at {{ business.name }}</p>

        <div v-if="openings.length === 0" class="py-10 text-center border border-dashed border-slate-200 rounded-2xl">
          <p class="text-sm font-semibold text-slate-500">No open roles right now.</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="role in openings" :key="role._id" class="rounded-2xl border border-slate-200 p-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="font-bold text-slate-900">{{ role.title }}</p>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold capitalize">
                    {{ role.type.replace('_', ' ') }}
                  </span>
                  <span v-if="role.pay" class="text-xs font-bold text-brand-600">{{ role.pay }}</span>
                </div>
                <p v-if="role.description" class="mt-1.5 text-sm text-slate-600">{{ role.description }}</p>
              </div>
              <button
                class="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0"
                @click="openApply(role)"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <p class="mt-6 text-xs text-slate-400">
          To apply, message {{ business.name }} on Declutter — they'll arrange the rest with you.
        </p>
      </section>
      </template>

      <ApplyModal
        :role="applyFor"
        :business-name="business?.name || ''"
        :slug="slug"
        @close="closeApply"
        @applied="onApplied"
      />
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Building2, MapPin, Phone, Mail, Globe, GraduationCap, Clock } from 'lucide-vue-next';
import PageBlock from '~/components/business/PageBlock.vue';
import ApplyModal from '~/components/business/ApplyModal.vue';
import { businessesApi, type Business, type BusinessOpening } from '@/api_factory/modules/businesses';

/**
 * Public page for one business. Reachable directly, and also served as the
 * subdomain landing (see middleware/business-domain.ts).
 *
 * `?business=<slug>` is accepted as a fallback so this works on localhost and on
 * preview URLs where wildcard DNS is not available.
 */

definePageMeta({ layout: 'default' });

const route = useRoute();
const slug = computed(() =>
  String(route.params.slug || route.query.business || ''),
);

const business = ref<Business | null>(null);
const design = ref<{ blocks: Array<{ id: string; type: string; isVisible: boolean; props: Record<string, any> }>; accentColor?: string } | null>(null);
const designServices = ref<any[]>([]);
const designProducts = ref<any[]>([]);
const openings = ref<BusinessOpening[]>([]);
const loading = ref(true);
const error = ref('');

// ── Applying for a role (public, no account needed) ────────────────────────
const applyFor = ref<BusinessOpening | null>(null);
const applyForm = reactive({ name: '', email: '', phone: '', message: '' });
const applyError = ref('');
const submittingApplication = ref(false);
const applied = ref(false);

const canApply = computed(
  () => applyForm.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(applyForm.email.trim()) && !submittingApplication.value,
);

const openApply = (role: BusinessOpening) => {
  applyFor.value = role;
  applyError.value = '';
  applied.value = false;
};

const closeApply = () => {
  applyFor.value = null;
  applyForm.name = applyForm.email = applyForm.phone = applyForm.message = '';
};

const submitApplication = async () => {
  if (!canApply.value || !applyFor.value) return;
  submittingApplication.value = true;
  applyError.value = '';
  try {
    await businessesApi.applyToOpening(slug.value, applyFor.value._id, {
      name: applyForm.name.trim(),
      email: applyForm.email.trim(),
      phone: applyForm.phone.trim() || undefined,
      message: applyForm.message.trim() || undefined,
    });
    applied.value = true;
  } catch (err: any) {
    applyError.value = err?.response?.data?.message || 'Could not send your application.';
  } finally {
    submittingApplication.value = false;
  }
};

const onApplied = () => {
  /* The modal shows its own confirmation; nothing else to do here. */
};

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await businessesApi.getBySlug(slug.value);
    business.value = data.business;
    openings.value = (data.openings ?? []).filter((o) => o.isOpen !== false);

    const page = (data as any).page;
    design.value = page && Array.isArray(page.blocks) && page.blocks.length > 0 ? page : null;

    // A "services" section reads live offerings rather than copies of them. They arrive
    // with the page payload, so the design renders in a single request.
    designServices.value = (data as any).services ?? [];
    designProducts.value = (data as any).products ?? [];
    useSeoMeta({ title: `${data.business.name} — Declutter` });
  } catch (err: any) {
    error.value =
      err?.response?.status === 404
        ? 'No business has that address.'
        : err?.response?.data?.message || 'We could not load this business.';
    business.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>
