import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';
import type { AvailabilitySlot } from './availability';

/**
 * Services API — written against `backend/src/services/services.controller.ts`.
 * axios.config.ts already appends `/api/v1`, so paths here are written without it.
 *
 *   GET    /services                   public browse (category, search, minPrice, maxPrice,
 *                                      isRemote, page, limit)
 *   GET    /services/me/listings       the caller's own catalogue, paused ones included
 *   GET    /services/:id               public detail
 *   GET    /services/:id/availability  computed slots for ?date=YYYY-MM-DD
 *   POST   /services                   provider only
 *   PATCH  /services/:id               owner only
 *   DELETE /services/:id               owner only, refused while an upcoming confirmed
 *                                      booking exists
 */

/** Matches `PriceType` in backend/src/services/schemas/service.schema.ts */
export type PriceType = 'fixed' | 'hourly' | 'negotiable';

/** Matches `ProviderProfile` in backend/src/users/schemas/user.schema.ts */
export interface ProviderProfile {
  headline?: string;
  bio?: string;
  skills?: string[];
  serviceArea?: string;
  isAcceptingBookings?: boolean;
  rating?: number;
  totalReviews?: number;
  totalBookings?: number;
}

/** A user as populated by the services/bookings API. */
export interface ServiceUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  university?: string;
  hostel?: string;
  level?: string;
  rating?: number;
  isServiceProvider?: boolean;
  providerProfile?: ProviderProfile;
}

/** `populate('category', 'name icon')` */
export interface ServiceCategory {
  _id: string;
  name: string;
  icon?: string;
}

/** Matches `backend/src/services/schemas/service.schema.ts`. */
export interface Service {
  _id: string;
  /** Populated on browse/detail; a bare id on the owner's raw listings. */
  providerId: ServiceUser | string;
  title: string;
  description: string;
  category: ServiceCategory | string;
  priceType: PriceType;
  price: number;
  durationMinutes: number;
  bufferMinutes: number;
  images: string[];
  location?: string;
  isRemote: boolean;
  tags: string[];
  isActive: boolean;
  rating: number;
  totalBookings: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Shape returned by `servicesService.browse()` and the provider services route. */
export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Pagination params shared by the public list routes. */
export interface PageQuery {
  page?: number;
  limit?: number;
}

export interface ServiceBrowseQuery extends PageQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isRemote?: boolean;
  page?: number;
  limit?: number;
  providerId?: string;
}

/** Body for POST /services (CreateServiceDto) and PATCH /services/:id (PartialType). */
export interface CreateServicePayload {
  title: string;
  description: string;
  category: string;
  priceType?: PriceType;
  price?: number;
  durationMinutes: number;
  bufferMinutes?: number;
  images?: string[];
  location?: string;
  isRemote?: boolean;
  tags?: string[];
  isActive?: boolean;
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

export const servicesApi = {
  /** GET /services — public browse of active listings only. */
  browse: (params: ServiceBrowseQuery) =>
    GATEWAY_ENDPOINT.get<Paginated<Service>>('/services', { params }),

  /** GET /services/me/listings — the signed-in provider's whole catalogue. */
  myListings: () => GATEWAY_ENDPOINT_WITH_AUTH.get<Service[]>('/services/me/listings'),

  /** GET /services/:id — public detail with provider summary and category. */
  getById: (id: string) => GATEWAY_ENDPOINT.get<Service>(`/services/${id}`),

  /**
   * GET /services/:id/availability?date=YYYY-MM-DD
   * Returns every generated slot for the day, including taken ones (`available: false`),
   * so the booking UI can grey them out instead of hiding them.
   */
  availability: (id: string, date: string) =>
    GATEWAY_ENDPOINT.get<AvailabilitySlot[]>(`/services/${id}/availability`, {
      params: { date },
    }),

  /** POST /services — provider only. */
  create: (payload: CreateServicePayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Service>('/services', payload),

  /** PATCH /services/:id — owner only. */
  update: (id: string, payload: UpdateServicePayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<Service>(`/services/${id}`, payload),

  /**
   * DELETE /services/:id — owner only. The backend answers 400 with a human message when an
   * upcoming confirmed booking still holds the listing; callers must surface that message.
   */
  remove: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.delete<{
      success: boolean;
      deleted: boolean;
      serviceId: string;
      declinedBookings: number;
    }>(`/services/${id}`),
};
