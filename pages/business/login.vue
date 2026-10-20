<template>
  <main class="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
    <!-- Dot grid background matching hero section -->
    <div class="fixed inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none opacity-40" />

    <div class="relative z-10 w-full max-w-md">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 mb-6 group">
          <img
            src="/android-chrome-192x192.png"
            alt="Decluttered"
            class="h-10 w-10 rounded-xl object-contain shadow-xs"
          />
          <span class="font-black text-slate-900 tracking-tight text-xl">
            Decluttered<span class="text-[#FF5C1A]">.</span>
          </span>
        </NuxtLink>
        <h1 class="text-2xl font-extrabold text-slate-900">Business Portal Login</h1>
        <p class="text-sm text-slate-500 mt-1 font-medium">
          Sign in to manage your <span class="font-bold text-slate-700">business-name.erranders.org</span> dashboard
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Business Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@yourbusiness.com"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:border-slate-900 focus:bg-white outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:border-slate-900 focus:bg-white outline-none transition-colors"
              required
            />
          </div>

          <div v-if="error" class="p-3 rounded-xl bg-red-50 border border-red-200">
            <p class="text-xs font-bold text-red-700">{{ error }}</p>
          </div>

          <button
            type="submit"
            class="w-full py-3 rounded-xl bg-slate-900 hover:bg-[#FF5C1A] text-white font-bold text-sm transition-colors shadow-xs disabled:opacity-40"
            :disabled="submitting"
          >
            {{ submitting ? 'Signing in…' : 'Sign In to Business Admin' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200" /></div>
          <div class="relative flex justify-center">
            <span class="px-3 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or use a demo account
            </span>
          </div>
        </div>

        <!-- Quick Demo Login Buttons -->
        <div class="space-y-2">
          <p class="text-[11px] text-slate-500 font-semibold text-center">
            Try the Business Mini-Admin with one of these example vendor accounts:
          </p>
          <button
            v-for="demo in DEMO_ACCOUNTS"
            :key="demo.slug"
            @click="quickLogin(demo)"
            class="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-3 text-left"
          >
            <span class="text-lg">{{ demo.icon }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-slate-900">{{ demo.name }}</p>
              <p class="text-[11px] text-slate-500 font-mono">{{ demo.slug }}.erranders.org</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
              {{ demo.category }}
            </span>
          </button>
        </div>
      </div>

      <!-- Bottom Links -->
      <div class="mt-6 text-center space-y-3">
        <p class="text-sm text-slate-600">
          Don't have a business yet?
          <NuxtLink to="/become-a-business" class="font-bold text-slate-900 hover:text-[#FF5C1A] transition-colors">
            Register & claim your domain →
          </NuxtLink>
        </p>
        <p class="text-xs text-slate-400">
          <NuxtLink to="/login" class="hover:text-slate-700 transition-colors">
            Looking for personal account login?
          </NuxtLink>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCustomToast } from '@/composables/core/useCustomToast';

/**
 * Dedicated business vendor login. Separate from the consumer /login so
 * business owners have a clean entry-point into their mini-admin.
 *
 * Domain pattern: business-name.erranders.org
 * After login the user lands on /business (the mini-admin dispatch panel).
 */

definePageMeta({ layout: 'default' });

useSeoMeta({
  title: 'Business Login | Decluttered by Erranders',
  description: 'Sign in to your Erranders business portal to manage bookings, crew, payouts and your business-name.erranders.org domain.',
});

const toast = useCustomToast();

const email = ref('');
const password = ref('');
const error = ref('');
const submitting = ref(false);

const DEMO_ACCOUNTS = [
  { slug: 'fumigation', name: 'CleanZone Pest Control', icon: '⚡', category: 'fumigation', email: 'fumigpro@barter.test' },
  { slug: 'campusmove', name: 'CampusMove Logistics', icon: '🚚', category: 'moving', email: 'campusmove@barter.test' },
  { slug: 'freshfold', name: 'FreshFold Laundry', icon: '🧺', category: 'laundry', email: 'freshfold@barter.test' },
  { slug: 'quickfix', name: 'QuickFix Gadget Care', icon: '🔧', category: 'repairs', email: 'quickfix@barter.test' },
];

const handleLogin = async () => {
  if (!email.value || !password.value) return;
  submitting.value = true;
  error.value = '';
  try {
    // In production this calls the auth API; for now navigate to the mini-admin
    toast.showToast({
      title: 'Signed In',
      message: 'Welcome back to your Business Admin!',
      toastType: 'success',
    });
    await navigateTo('/business');
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Login failed. Please check your credentials.';
  } finally {
    submitting.value = false;
  }
};

const quickLogin = async (demo: (typeof DEMO_ACCOUNTS)[number]) => {
  email.value = demo.email;
  password.value = 'password123';
  toast.showToast({
    title: 'Demo Login',
    message: `Logging in as ${demo.name} (${demo.slug}.erranders.org)`,
    toastType: 'info',
  });
  await navigateTo(`/business?slug=${demo.slug}`);
};
</script>
