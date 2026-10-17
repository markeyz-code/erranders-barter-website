import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Availability API — written against `backend/src/availability/availability.controller.ts`.
 * Every route is JWT-guarded and scoped to the caller (`me`).
 *
 *   GET    /availability/me                   weekly windows + date overrides
 *   PUT    /availability/me                   replace the weekly windows (array body)
 *   POST   /availability/me/exceptions        block a day / a range, or open an ad-hoc window
 *   DELETE /availability/me/exceptions/:id    remove one override
 *
 * The bookable slots students see come from these windows, minus bookings, exceptions and
 * past times — `GET /services/:id/availability` is the computed view.
 */

/** One row of `provideravailabilities`; `dayOfWeek` is 0 (Sunday) … 6 (Saturday). */
export interface WeeklyWindow {
  _id?: string;
  providerId?: string;
  dayOfWeek: number;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  isActive: boolean;
}

/** One row of `availabilityexceptions` (a date override). */
export interface AvailabilityException {
  _id: string;
  providerId?: string;
  date: string; // YYYY-MM-DD
  isBlocked: boolean;
  startTime?: string | null;
  endTime?: string | null;
  note?: string;
}

/** A computed slot from `GET /services/:id/availability`. */
export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

/** GET /availability/me */
export interface MyAvailability {
  weeklyWindows: WeeklyWindow[];
  exceptions: AvailabilityException[];
}

/** PUT /availability/me — the backend accepts a bare array or `{ windows: [...] }`. */
export interface WeeklyWindowPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

/** POST /availability/me/exceptions */
export interface AvailabilityExceptionPayload {
  date: string;
  isBlocked: boolean;
  startTime?: string;
  endTime?: string;
  note?: string;
}

export const availabilityApi = {
  /** GET /availability/me */
  getMine: () => GATEWAY_ENDPOINT_WITH_AUTH.get<MyAvailability>('/availability/me'),

  /** PUT /availability/me — replaces every weekly window in one shot. */
  replaceWeekly: (windows: WeeklyWindowPayload[]) =>
    GATEWAY_ENDPOINT_WITH_AUTH.put<WeeklyWindow[]>('/availability/me', windows),

  /** POST /availability/me/exceptions — a whole-day block needs no times. */
  addException: (payload: AvailabilityExceptionPayload) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<AvailabilityException>(
      '/availability/me/exceptions',
      payload,
    ),

  /** DELETE /availability/me/exceptions/:id */
  removeException: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.delete<{
      success: boolean;
      deleted: boolean;
      exceptionId: string;
    }>(`/availability/me/exceptions/${id}`),
};
