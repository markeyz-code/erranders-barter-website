import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Business accounts ("Declutter for businesses").
 *
 * A business is an organisation — a fumigation company, a laundry, a moving crew —
 * with its own page, its own subdomain, staff, recruitment openings and an earnings
 * ledger. An individual seller/provider is unchanged; this is additive.
 *
 * Every path here is written WITHOUT the `/api/v1` prefix, because axios.config
 * already appends it.
 */

export interface BusinessStaff {
  _id: string;
  name: string;
  role: string;
  phone?: string;
  isActive: boolean;
}

export type OpeningType = 'full_time' | 'part_time' | 'contract';

export interface BusinessOpening {
  _id: string;
  title: string;
  description?: string;
  type: OpeningType;
  pay?: string;
  isOpen: boolean;
}

export interface Business {
  _id: string;
  ownerId?: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  isVerified: boolean;
  rating?: number;
  totalJobs?: number;
  staff?: BusinessStaff[];
  openings?: BusinessOpening[];
}

export interface BusinessPublic {
  business: Business;
  openings: BusinessOpening[];
}

export interface BusinessEarnings {
  totalJobs: number;
  completedJobs: number;
  gross: number;
  commission: number;
  net: number;
  /** What the numbers were computed from — so the UI never implies a fake ledger. */
  basis?: string;
  payouts: Array<{
    bookingId?: string;
    serviceId?: string;
    serviceTitle?: string;
    amount?: number;
    date?: string;
  }>;
}

export interface ApplyBusinessPayload {
  name: string;
  slug: string;
  category: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export const businessesApi = {
  /** POST /businesses/apply — becomes a business owned by the caller. */
  apply: (payload: ApplyBusinessPayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Business>('/businesses/apply', payload),

  /** GET /businesses/me — the caller's business (404 if they have none). */
  getMine: () => GATEWAY_ENDPOINT_WITH_AUTH.get<Business>('/businesses/me'),

  /** PATCH /businesses/me — owner-settable fields only. */
  updateMine: (payload: Partial<Business>) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<Business>('/businesses/me', payload),

  /** GET /businesses — public directory, optionally narrowed by category. */
  list: (params: { category?: string; search?: string; page?: number; limit?: number } = {}) =>
    GATEWAY_ENDPOINT.get<{ data: Business[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
      '/businesses',
      { params },
    ),

  /** GET /businesses/:slug/resources — only what this signed-in student may open. */
  getResources: (slug: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<{
      business: { name: string; slug: string };
      viewerEmail: string | null;
      watermark: string | null;
      resources: Array<{
        _id: string; title: string; description?: string;
        kind: 'file' | 'video' | 'link'; url: string; createdAt?: string;
      }>;
    }>(`/businesses/${slug}/resources`),

  /** POST /businesses/:slug/openings/:openingId/apply — public, no account needed. */
  applyToOpening: (
    slug: string,
    openingId: string,
    payload: { name: string; email: string; phone?: string; message?: string },
  ) => GATEWAY_ENDPOINT.post(`/businesses/${slug}/openings/${openingId}/apply`, payload),

  /** GET /businesses/:slug — public page. */
  getBySlug: (slug: string) => GATEWAY_ENDPOINT.get<BusinessPublic>(`/businesses/${slug}`),

  // Staff
  listStaff: () => GATEWAY_ENDPOINT_WITH_AUTH.get<BusinessStaff[]>('/businesses/me/staff'),
  addStaff: (payload: { name: string; role: string; phone?: string }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<BusinessStaff>('/businesses/me/staff', payload),
  updateStaff: (id: string, payload: { role?: string; phone?: string; isActive?: boolean }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<BusinessStaff>(`/businesses/me/staff/${id}`, payload),
  removeStaff: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/businesses/me/staff/${id}`),

  // Recruitment
  listOpenings: () => GATEWAY_ENDPOINT_WITH_AUTH.get<BusinessOpening[]>('/businesses/me/openings'),
  addOpening: (payload: { title: string; description?: string; type: OpeningType; pay?: string }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<BusinessOpening>('/businesses/me/openings', payload),
  updateOpening: (
    id: string,
    payload: { title?: string; description?: string; type?: OpeningType; pay?: string; isOpen?: boolean },
  ) => GATEWAY_ENDPOINT_WITH_AUTH.patch<BusinessOpening>(`/businesses/me/openings/${id}`, payload),
  removeOpening: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/businesses/me/openings/${id}`),

  /** GET /businesses/me/earnings — gross, the platform commission and the net. */
  getEarnings: () => GATEWAY_ENDPOINT_WITH_AUTH.get<BusinessEarnings>('/businesses/me/earnings'),
};
