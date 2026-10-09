import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const users_api = {
  getRecentlyViewed: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/users/me/recently-viewed');
  },
  
  addRecentlyViewed: (vendorId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/users/me/recently-viewed', { vendorId });
  },

  updateFcmToken: (payload: { token: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/users/me/fcm-token', payload);
  },

  updateProfile: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/users/me', payload);
  },

  deleteAccount: (payload: { reason: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete('/users/me', { data: payload });
  },
};
