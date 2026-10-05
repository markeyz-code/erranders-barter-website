import axios from 'axios'; const ERRANDERS_CORE_WITH_AUTH = axios.create({ baseURL: 'https://api.erranders.org' }); ERRANDERS_CORE_WITH_AUTH.interceptors.request.use((config) => { const token = typeof window !== 'undefined' ? localStorage.getItem('barter_token') || localStorage.getItem('token') : null; if (token) config.headers.Authorization = 'Bearer ' + token; return config; });

export const users_api = {
  getRecentlyViewed: () => {
    return ERRANDERS_CORE_WITH_AUTH.get('/users/me/recently-viewed');
  },
  
  addRecentlyViewed: (vendorId: string) => {
    return ERRANDERS_CORE_WITH_AUTH.post('/users/me/recently-viewed', { vendorId });
  },

  updateFcmToken: (payload: { token: string }) => {
    return ERRANDERS_CORE_WITH_AUTH.put('/users/me/fcm-token', payload);
  },

  updateProfile: (payload: any) => {
    return ERRANDERS_CORE_WITH_AUTH.put('/users/me', payload);
  },

  deleteAccount: (payload: { reason: string }) => {
    return ERRANDERS_CORE_WITH_AUTH.delete('/users/me', { data: payload });
  },
};
