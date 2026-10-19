import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  whatsappNumber?: string;
  university?: string;
  hostel?: string;
  level?: string;
  avatar?: string;
}

export const users_api = {
  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/users/me');
  },

  getPublicProfile: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/users/${id}`);
  },

  getMyStats: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/users/me/stats');
  },

  /** The backend route is `PATCH /users/me`; the body is a partial user document. */
  updateProfile: (payload: UpdateProfilePayload) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch('/users/me', payload);
  },

  withdraw: (amount: number) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/users/me/withdraw', { amount });
  },
};

/**
 * Alias so `composables/modules/users/useUsers.ts`, which imports `usersApi`,
 * resolves to this real implementation (`getProfile` → GET /users/me).
 */
export const usersApi = users_api;
