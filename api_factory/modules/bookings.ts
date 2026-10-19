import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';
import type { PriceType, ServiceUser } from './services';

/**
 * Bookings API — written against `backend/src/bookings/bookings.controller.ts`.
 * Every route is JWT-guarded; `mine`/`received` split the two sides of the marketplace.
 *
 *   POST  /bookings                    { serviceId, date, startTime, notes } → pending booking
 *   GET   /bookings/mine               as customer
 *   GET   /bookings/received           as provider
 *   GET   /bookings/:id                participants only
 *   PATCH /bookings/:id/accept         provider → confirmed + chatId (+ meetingUrl if remote)
 *   PATCH /bookings/:id/decline        provider, optional reason
 *   PATCH /bookings/:id/cancel         either party, reason required
 *   PATCH /bookings/:id/complete       provider → completed, bumps counters
 *   PATCH /bookings/:id/reschedule     either party, re-checks the slot
 */

/** Matches `BookingStatus` in backend/src/bookings/schemas/booking.schema.ts */
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'declined'
  | 'no_show';

/** `serviceId` as populated on every booking response (`SERVICE_POPULATE`). */
export interface BookingService {
  _id: string;
  title: string;
  description?: string;
  images?: string[];
  price?: number;
  priceType?: PriceType;
  durationMinutes?: number;
  bufferMinutes?: number;
  location?: string;
  isRemote?: boolean;
  isActive?: boolean;
}

/** Matches the populated booking document. */
export interface Booking {
  _id: string;
  serviceId: BookingService | string;
  providerId: ServiceUser | string;
  customerId: ServiceUser | string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  bufferMinutes?: number;
  amount: number;
  commitmentFee?: number;
  remainingBalance?: number;
  commitmentFeePaid?: boolean;
  remainingBalancePaid?: boolean;
  paymentStatus?: 'unpaid' | 'commitment_paid' | 'fully_paid';
  payoutReleased?: boolean;
  status: BookingStatus;
  notes?: string;
  meetingUrl?: string;
  chatId?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingPayload {
  serviceId: string;
  date: string;
  startTime: string;
  durationMinutes?: number;
  notes?: string;
}

export interface RescheduleBookingPayload {
  date: string;
  startTime: string;
  notes?: string;
}

export const bookingsApi = {
  /** POST /bookings — creates a pending request. A taken slot answers 409. */
  create: (payload: CreateBookingPayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Booking>('/bookings', payload),

  /** GET /bookings/mine — bookings the caller made as a customer. */
  mine: () => GATEWAY_ENDPOINT_WITH_AUTH.get<Booking[]>('/bookings/mine'),

  /** GET /bookings/received — bookings the caller received as a provider. */
  received: () => GATEWAY_ENDPOINT_WITH_AUTH.get<Booking[]>('/bookings/received'),

  /** GET /bookings/:id — participants only. */
  getById: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.get<Booking>(`/bookings/${id}`),

  /** PATCH /bookings/:id/accept — provider confirms; mints chat + video link. */
  accept: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.patch<Booking>(`/bookings/${id}/accept`, {}),

  /** PATCH /bookings/:id/decline — provider only; the reason is optional. */
  decline: (id: string, reason?: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<Booking>(`/bookings/${id}/decline`, { reason }),

  /** PATCH /bookings/:id/cancel — either party; the backend requires a reason. */
  cancel: (id: string, reason: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<Booking>(`/bookings/${id}/cancel`, { reason }),

  /** PATCH /bookings/:id/complete — provider marks a confirmed booking done. */
  complete: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.patch<Booking>(`/bookings/${id}/complete`, {}),

  /** PATCH /bookings/:id/reschedule — moves to a freshly validated slot. */
  reschedule: (id: string, payload: RescheduleBookingPayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<Booking>(`/bookings/${id}/reschedule`, payload),

  /** POST /bookings/:id/pay-balance — student pays remaining balance on completion */
  payBalance: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Booking>(`/bookings/${id}/pay-balance`, {}),
};
