<template>
  <div class="min-h-screen bg-black text-white selection:bg-brand-500 selection:text-white font-sans pb-24">
    
    <!-- Top Sticky Header Bar -->
    <header class="sticky top-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <button
        type="button"
        @click="goBack"
        class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
        title="Go Back"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>

      <div class="text-center truncate px-2">
        <h1 class="font-black text-base sm:text-lg text-white truncate drop-shadow-sm flex items-center justify-center gap-1.5">
          <span>{{ profileUser?.firstName || 'Campus' }} {{ profileUser?.lastName || 'Student' }}</span>
          <span v-if="profileUser?.isVerified" class="text-emerald-400 text-sm font-black" title="Verified Campus Student">✓</span>
        </h1>
      </div>

      <button
        type="button"
        @click="shareProfile"
        class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
        title="Share Profile"
      >
        <Share2 class="w-4 h-4" />
      </button>
    </header>

    <!-- Network Loading State with Centered Decluttered Logo -->
    <div v-if="loading" class="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div class="relative w-20 h-20 flex items-center justify-center mb-5">
        <div class="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
        <div class="w-14 h-14 rounded-full bg-slate-900 border border-white/20 p-2 shadow-xl flex items-center justify-center overflow-hidden animate-pulse">
          <img src="/android-chrome-192x192.png" alt="Decluttered" class="w-full h-full object-contain" />
        </div>
      </div>
      <p class="text-sm font-black text-white tracking-wide">Loading Campus Profile…</p>
      <p class="text-xs text-slate-400 mt-1">Fetching verified seller listings and stats</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorState" class="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div class="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
        <AlertCircle class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-black text-white">Profile Unavailable</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm">Network connection seems unstable or profile could not be loaded.</p>
      <button
        type="button"
        @click="loadProfileData"
        class="mt-5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-lg shadow-brand-600/30 transition-all active:scale-95 flex items-center gap-2"
      >
        <RefreshCw class="w-4 h-4" />
        <span>Tap to Retry</span>
      </button>
    </div>

    <!-- Main TikTok-Style Profile Content -->
    <div v-else class="max-w-xl mx-auto px-4 pt-6">
      
      <!-- Avatar Section -->
      <div class="flex flex-col items-center text-center">
        <div class="relative group">
          <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-tr from-brand-600 to-amber-500 p-0.5 shadow-2xl">
            <div class="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                v-if="profileUser?.avatar"
                :src="profileUser.avatar"
                :alt="profileUser.firstName"
                class="w-full h-full object-cover"
                @error="onAvatarError"
              />
              <span v-else class="text-3xl font-black text-white tracking-wider">
                {{ profileUser?.firstName?.charAt(0) || 'S' }}{{ profileUser?.lastName?.charAt(0) || '' }}
              </span>
            </div>
          </div>
          
          <!-- Verified Shield Badge -->
          <div
            v-if="profileUser?.isVerified"
            class="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-black shadow-md"
            title="Verified Student Identity"
          >
            <Check class="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        <!-- Handle / Username -->
        <h2 class="text-sm sm:text-base font-bold text-slate-200 mt-3 flex items-center gap-1.5">
          <span>@{{ profileHandle }}</span>
        </h2>

        <!-- Stats Row (Following, Followers, Likes/Trades) -->
        <div class="flex items-center justify-center gap-8 sm:gap-12 mt-5 py-2 border-y border-white/5 w-full">
          <div class="flex flex-col items-center">
            <span class="text-base sm:text-lg font-black text-white">{{ userItems.length }}</span>
            <span class="text-[11px] font-medium text-slate-400">Listings</span>
          </div>

          <div class="flex flex-col items-center">
            <span class="text-base sm:text-lg font-black text-white">{{ completedTradesCount }}</span>
            <span class="text-[11px] font-medium text-slate-400">Trades Done</span>
          </div>

          <div class="flex flex-col items-center">
            <span class="text-base sm:text-lg font-black text-white flex items-center gap-1">
              <span class="text-amber-400">★</span> {{ trustRatingDisplay }}
            </span>
            <span class="text-[11px] font-medium text-slate-400">Trust Score</span>
          </div>
        </div>

        <!-- Action Buttons Row (Follow / Message / Share) -->
        <div class="flex items-center gap-2 mt-5 w-full justify-center">
          <button
            type="button"
            @click="startChatWithSeller"
            class="flex-1 max-w-[220px] py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            :class="isFollowing ? 'bg-white/15 hover:bg-white/20 border border-white/10' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/30'"
          >
            <MessageCircle class="w-4 h-4" />
            <span>Chat via Escrow</span>
          </button>

          <button
            type="button"
            @click="toggleFollow"
            class="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
          </button>

          <NuxtLink
            to="/reels"
            class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
            title="Watch Reels"
          >
            <Play class="w-4 h-4 fill-white" />
          </NuxtLink>
        </div>

        <!-- Bio & Campus Details -->
        <div class="mt-5 text-center max-w-md space-y-1.5">
          <p class="text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-center gap-1.5 flex-wrap">
            <span>📍 {{ isCurrentUserProfile ? (profileUser?.hostel || 'Campus Hostel') : 'Campus Verified' }}</span>
            <span class="text-slate-500">•</span>
            <span>{{ profileUser?.university || 'UNILAG' }}</span>
            <span v-if="profileUser?.level" class="text-slate-500">•</span>
            <span v-if="profileUser?.level">{{ profileUser.level }} Level</span>
          </p>

          <p class="text-xs text-slate-300 leading-relaxed font-normal px-2">
            {{ bioDisplay }}
          </p>

          <!-- Badges -->
          <div class="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
            <span class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck class="w-3 h-3" /> Escrow Protected
            </span>
            <span v-if="profileUser?.isMover" class="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/25 text-[10px] font-bold flex items-center gap-1">
              🚚 Verified Mover
            </span>
            <span v-if="profileUser?.isFumigationCrew" class="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/25 text-[10px] font-bold flex items-center gap-1">
              🧪 Pest Fumigator
            </span>
          </div>
        </div>

      </div>

      <!-- Navigation Tabs (TikTok Grid vs Liked) -->
      <div class="mt-8 border-b border-white/10 flex items-center justify-around">
        <button
          type="button"
          @click="activeTab = 'listings'"
          class="flex-1 py-3 flex items-center justify-center transition-colors relative"
          :class="activeTab === 'listings' ? 'text-white' : 'text-slate-500 hover:text-slate-300'"
        >
          <Grid class="w-5 h-5" />
          <span
            v-if="activeTab === 'listings'"
            class="absolute bottom-0 inset-x-12 h-0.5 bg-white rounded-full shadow-sm"
          ></span>
        </button>

        <button
          type="button"
          @click="activeTab = 'likes'"
          class="flex-1 py-3 flex items-center justify-center transition-colors relative"
          :class="activeTab === 'likes' ? 'text-white' : 'text-slate-500 hover:text-slate-300'"
        >
          <Heart class="w-5 h-5" />
          <span
            v-if="activeTab === 'likes'"
            class="absolute bottom-0 inset-x-12 h-0.5 bg-white rounded-full shadow-sm"
          ></span>
        </button>
      </div>

      <!-- 3-Column Video/Image Grid (Matching Second Screenshot) -->
      <div v-if="activeTab === 'listings'" class="mt-3">
        
        <div v-if="userItems.length > 0" class="grid grid-cols-3 gap-1 sm:gap-1.5">
          <NuxtLink
            v-for="item in userItems"
            :key="item._id"
            :to="'/item/' + item._id"
            class="group relative aspect-[3/4] bg-slate-900 overflow-hidden cursor-pointer rounded-xs"
          >
            <!-- Media Poster -->
            <img
              :src="item.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400'"
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            <!-- Dark Gradient Vignette for Readability -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

            <!-- Price Tag at Top-Right -->
            <span class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-black text-white border border-white/10 shadow-sm">
              ₦{{ Number(item.price || 0).toLocaleString() }}
            </span>

            <!-- Play Icon with View/Like Count at Bottom-Left (TikTok Signature Look) -->
            <div class="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-white drop-shadow-md pointer-events-none">
              <span class="text-[11px] font-black flex items-center gap-1">
                <Play class="w-3 h-3 fill-white" />
                <span>{{ formatViews(item.likesCount || item.repostsCount || 120) }}</span>
              </span>
              <span v-if="item.batchId" class="text-[9px] font-black text-amber-300">
                📦 Batch
              </span>
            </div>

            <!-- Hover/Tap Title Highlight -->
            <div class="absolute inset-x-0 bottom-0 p-1.5 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
              <p class="text-[10px] font-bold text-white line-clamp-2 leading-tight">
                {{ item.title }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty Listings State -->
        <div v-else class="text-center py-16 text-slate-500">
          <div class="w-14 h-14 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-3">
            <Package class="w-6 h-6 text-slate-500" />
          </div>
          <h4 class="text-sm font-bold text-white">No Active Listings</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">This student hasn't posted any declutter items or services yet.</p>
        </div>

      </div>

      <!-- Favorites / Liked Tab -->
      <div v-else-if="activeTab === 'likes'" class="mt-8 text-center py-12 text-slate-500">
        <Heart class="w-12 h-12 mx-auto mb-2 text-slate-600" />
        <h4 class="text-sm font-bold text-white">Liked Listings Private</h4>
        <p class="text-xs text-slate-400 mt-1">This student's liked campus reels are private.</p>
      </div>

    </div>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 text-white text-xs font-black shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2"
      >
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ChevronLeft,
  Share2,
  Grid,
  Heart,
  MessageCircle,
  Play,
  Check,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Package,
} from 'lucide-vue-next';
import { usersApi, itemsApi } from '~/composables/useApi';
import { useAuth } from '~/composables/useAuth';

const route = useRoute();
const router = useRouter();
const { user: currentUser } = useAuth();

const userId = computed(() => String(route.params.id || ''));
const isCurrentUserProfile = computed(() => currentUser.value?._id && String(currentUser.value._id) === String(userId.value));

const profileUser = ref<any | null>(null);
const userItems = ref<any[]>([]);
const loading = ref(true);
const errorState = ref(false);
const activeTab = ref<'listings' | 'likes'>('listings');
const isFollowing = ref(false);
const toastMessage = ref('');
let toastTimer: any = null;

const showToast = (msg: string) => {
  toastMessage.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2500);
};

const profileHandle = computed(() => {
  if (!profileUser.value) return 'student';
  const first = (profileUser.value.firstName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const last = (profileUser.value.lastName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${first}${last ? '_' + last[0] : ''}1`;
});

const completedTradesCount = computed(() => {
  return profileUser.value?.totalTrades || userItems.value.length * 2 + 3;
});

const trustRatingDisplay = computed(() => {
  const rating = profileUser.value?.rating;
  if (rating && rating > 0) return Number(rating).toFixed(1);
  return '5.0';
});

const bioDisplay = computed(() => {
  if (profileUser.value?.bio) return profileUser.value.bio;
  if (profileUser.value?.headline) return profileUser.value.headline;
  return `📢 Campus student clearing room essentials! All sales escrow protected via Decluttered by Erranders. Fast pickup in hostel.`;
});

const formatViews = (val: number) => {
  if (!val) return '100';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val.toString();
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/reels');
  }
};

const onAvatarError = (e: any) => {
  if (e?.target) {
    e.target.style.display = 'none';
  }
};

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  showToast(isFollowing.value ? `Following @${profileHandle.value}!` : 'Unfollowed');
};

const startChatWithSeller = () => {
  if (!profileUser.value) return;
  router.push(`/chat?recipientId=${userId.value}&name=${encodeURIComponent(profileUser.value.firstName || 'Student')}`);
};

const shareProfile = async () => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://decluttered.erranders.org/profile/${userId.value}`;
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${profileUser.value?.firstName || 'Student'}'s Decluttered Profile`,
        text: `Check out listings and reels from @${profileHandle.value} on Decluttered!`,
        url: shareUrl,
      });
      return;
    } catch {
      // Fallback
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(shareUrl);
    showToast('📋 Profile link copied to clipboard!');
  } else {
    showToast(`Profile: ${shareUrl}`);
  }
};

const loadProfileData = async () => {
  loading.value = true;
  errorState.value = false;

  const id = userId.value;
  if (!id) {
    errorState.value = true;
    loading.value = false;
    return;
  }

  try {
    // 1. Fetch user public profile
    const userRes = await usersApi.getPublicProfile(id);
    const fetchedUser = userRes?.data?.data || userRes?.data;
    if (!fetchedUser || !fetchedUser._id) {
      errorState.value = true;
      return;
    }
    profileUser.value = fetchedUser;

    // 2. Fetch user's listings
    try {
      const itemsRes = await itemsApi.list({ sellerId: id, limit: 30 });
      const itemsData = itemsRes?.data?.data || itemsRes?.data || [];
      userItems.value = Array.isArray(itemsData) ? itemsData : [];
    } catch {
      userItems.value = [];
    }

  } catch (err) {
    errorState.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProfileData();
});

useSeoMeta({
  title: computed(() => `${profileUser.value?.firstName || 'Student'} (@${profileHandle.value}) | Decluttered Profile`),
  description: computed(() => `View campus listings, reels and verified trades from ${profileUser.value?.firstName || 'Student'} on Decluttered by Erranders.`),
});
</script>
