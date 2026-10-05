import { computed } from 'vue';
import { useCookie } from '#app';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  avatar?: string;
  matricNumber?: string;
  points?: number;
  streakCount?: number;
  totalOrders?: number;
  totalDeliveries?: number;
  isPro?: boolean;
  referralCode?: string;
  referralCount?: number;
  department?: string;
  faculty?: string;
  dateOfBirth?: string;
  gender?: string;
  erranderGenderPreference?: string;
  homeAddress?: string;
  workAddress?: string;
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    marketingPromos: boolean;
  };
}

export const useUser = () => {
  const token = useCookie<string | null>('errandr_token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'none',
    secure: true,
  });
  
  const user = useCookie<User | null>('errandr_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'none',
    secure: true,
  });

  const setUser = (userData: User) => {
    user.value = userData;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_user=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires}; path=/; samesite=none; secure`;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_token=${newToken}; expires=${expires}; path=/; samesite=none; secure`;
      localStorage.setItem('token', newToken);
    }
  };

  const logOut = (shouldRedirect = true) => {
    user.value = null;
    token.value = null;
    // Clear other site data if needed, but cookies are the core
    if (typeof window !== 'undefined') {
      localStorage.removeItem('errandr_cart');
      if (shouldRedirect) {
        window.location.href = '/';
      }
    }
  };

  const isLoggedIn = computed(() => !!token.value);

  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  return {
    user,
    token,
    setUser,
    setToken,
    logOut,
    isLoggedIn,
    fullName
  };
};
