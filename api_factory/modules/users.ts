import { ERRANDERS_CORE_WITH_AUTH } from '../axios.config';

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
