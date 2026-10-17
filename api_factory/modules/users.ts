import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Users API — written against `backend/src/users/users.controller.ts`.
 * The backend exposes exactly:
 *   GET   /users/me
 *   PATCH /users/me          (NOT PUT — this was previously sending PUT and 404ing)
 *   GET   /users/me/stats
 *   POST  /users/me/withdraw
 *   GET   /users/admin/all
 *
 * The previous `getRecentlyViewed`, `addRecentlyViewed`, `updateFcmToken` and
 * `deleteAccount` helpers pointed at routes this backend does not implement and
 * have been removed rather than left to 404.
 */

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
