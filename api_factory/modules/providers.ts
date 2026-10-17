import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';
import type { PageQuery, Paginated, Service, ServiceUser } from './services';

/**
 * Providers API — written against `backend/src/providers/providers.controller.ts`.
 *
 *   POST  /providers/apply        become a provider (or update the public profile)
 *   PATCH /providers/me           update the profile / pause new bookings
 *   GET   /providers/:id          public card + the provider's active services
 *   GET   /providers/:id/services public, paginated active services
 *
 * There is no separate provider account: a provider is a `User` with `isServiceProvider`
 * set and a `providerProfile`.
 */

/** The public provider card (`PUBLIC_PROVIDER_FIELDS` on the backend). */
export interface PublicProvider extends ServiceUser {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  university?: string;
  hostel?: string;
  level?: string;
  createdAt?: string;
}

/** GET /providers/:id */
export interface ProviderWithServices {
  provider: PublicProvider;
  services: Service[];
}

/** POST /providers/apply */
export interface ApplyProviderPayload {
  headline: string;
  bio?: string;
  skills?: string[];
  serviceArea?: string;
}

/** PATCH /providers/me — every field optional, plus the bookings pause switch. */
export interface UpdateProviderPayload {
  headline?: string;
  bio?: string;
  skills?: string[];
  serviceArea?: string;
  isAcceptingBookings?: boolean;
}

export const providersApi = {
  /** POST /providers/apply — sets `isServiceProvider` and the public profile. */
  apply: (payload: ApplyProviderPayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<PublicProvider>('/providers/apply', payload),

  /** PATCH /providers/me — update the profile or pause bookings. */
  updateMe: (payload: UpdateProviderPayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<PublicProvider>('/providers/me', payload),

  /** GET /providers/:id — public card plus active services. */
  getById: (id: string) =>
    GATEWAY_ENDPOINT.get<ProviderWithServices>(`/providers/${id}`),

  /** GET /providers/:id/services — public, paginated active services. */
  getServices: (id: string, params: PageQuery = {}) =>
    GATEWAY_ENDPOINT.get<Paginated<Service>>(`/providers/${id}/services`, { params }),
};
