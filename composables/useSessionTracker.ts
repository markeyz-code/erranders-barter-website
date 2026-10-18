import { ref, computed, onMounted } from 'vue';
import { itemsApi } from '~/composables/useApi';

export interface CatchUpData {
  since: string;
  totalNewListings: number;
  itemsCount: number;
  servicesCount: number;
  breakdown: {
    buy: number;
    swap: number;
    services: number;
  };
  newItems: any[];
  newServices: any[];
}

const catchUpData = ref<CatchUpData | null>(null);
const loading = ref(false);
const isCatchUpModalOpen = ref(false);
const isDismissed = ref(false);
const previousVisitTimestamp = ref<string | null>(null);

export const useSessionTracker = () => {
  const initSession = async () => {
    if (typeof window === 'undefined') return;

    // Check if dismissed for current tab session
    if (sessionStorage.getItem('barter_catchup_dismissed') === 'true') {
      isDismissed.value = true;
    }

    const storedLastVisit = localStorage.getItem('barter_last_visit_time');
    const now = new Date().toISOString();

    if (storedLastVisit) {
      previousVisitTimestamp.value = storedLastVisit;
    } else {
      // Default to 24 hours ago for first-time session
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      previousVisitTimestamp.value = yesterday;
    }

    // Update stored last visit to now for next time
    localStorage.setItem('barter_last_visit_time', now);

    // Fetch catch-up listings
    loading.value = true;
    try {
      const { data } = await itemsApi.getCatchUp(previousVisitTimestamp.value);
      if (data && data.totalNewListings > 0) {
        catchUpData.value = data;
      }
    } catch (err) {
      // Graceful fallback
    } finally {
      loading.value = false;
    }
  };

  const dismissCatchUp = () => {
    isDismissed.value = true;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('barter_catchup_dismissed', 'true');
    }
  };

  const openCatchUpModal = () => {
    isCatchUpModalOpen.value = true;
  };

  const closeCatchUpModal = () => {
    isCatchUpModalOpen.value = false;
  };

  const formattedSinceTime = computed(() => {
    if (!previousVisitTimestamp.value) return 'your last visit';
    const date = new Date(previousVisitTimestamp.value);
    const now = new Date();
    const diffHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours <= 1) return 'an hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return 'yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  });

  return {
    catchUpData,
    loading,
    isDismissed,
    isCatchUpModalOpen,
    previousVisitTimestamp,
    formattedSinceTime,
    hasMissedListings: computed(() => (catchUpData.value?.totalNewListings || 0) > 0 && !isDismissed.value),
    missedCount: computed(() => catchUpData.value?.totalNewListings || 0),
    newItems: computed(() => catchUpData.value?.newItems || []),
    newServices: computed(() => catchUpData.value?.newServices || []),
    initSession,
    dismissCatchUp,
    openCatchUpModal,
    closeCatchUpModal,
  };
};
