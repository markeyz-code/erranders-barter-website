import type { BookingStatus } from '@/api_factory/modules/bookings';
import type { PriceType, Service, ServiceUser } from '@/api_factory/modules/services';

/**
 * Presentation helpers shared by the services marketplace screens.
 *
 * Nothing here invents data: every function formats a value that came from the API. The
 * date helpers deliberately avoid `toISOString()` (which shifts by the timezone offset) and
 * `new Date('YYYY-MM-DD')` (which parses as UTC), because a booking date is a wall-clock
 * date, not an instant.
 */

export interface ApiErrorInfo {
  status: number | null;
  message: string;
}

/** A category option as used by the service form and the browse filter. */
export interface CategoryOption {
  _id: string;
  name: string;
}

interface AxiosishError {
  response?: {
    status?: number;
    data?: { message?: string | string[]; error?: string };
  };
  message?: string;
}

const firstMessage = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '';
};

/** Turns anything thrown by axios into `{ status, message }` without using `any`. */
export const getApiError = (error: unknown): ApiErrorInfo => {
  const candidate = error as AxiosishError;
  const status =
    typeof candidate?.response?.status === 'number' ? candidate.response.status : null;
  const message =
    firstMessage(candidate?.response?.data?.message) ||
    candidate?.response?.data?.error ||
    candidate?.message ||
    'Something went wrong. Please try again.';
  return { status, message };
};

/** Local wall-clock date as YYYY-MM-DD (no UTC conversion). */
export const toIsoDate = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export interface DayOption {
  iso: string;
  weekday: string;
  day: number;
  month: string;
  isToday: boolean;
}

/**
 * The next `count` calendar days, starting today. Only call this on the client: the server
 * may be in another timezone, and a hydration mismatch on a date list is worse than a
 * skeleton for one tick.
 */
export const buildUpcomingDays = (count = 14): DayOption[] => {
  const days: DayOption[] = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);

  for (let index = 0; index < count; index += 1) {
    const day = new Date(base);
    day.setDate(base.getDate() + index);
    days.push({
      iso: toIsoDate(day),
      weekday: day.toLocaleDateString(undefined, { weekday: 'short' }),
      day: day.getDate(),
      month: day.toLocaleDateString(undefined, { month: 'short' }),
      isToday: index === 0,
    });
  }

  return days;
};

const utcDateFromIso = (iso: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!match) return null;
  const parsed = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/** "Mon, 12 May 2025" — timezone-independent because the components are formatted in UTC. */
export const formatDateLong = (iso: string): string => {
  const date = utcDateFromIso(iso);
  if (!date) return iso || '';
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

/** "12 May" — for compact rows. */
export const formatDateShort = (iso: string): string => {
  const date = utcDateFromIso(iso);
  if (!date) return iso || '';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
};

/** "09:00" → "9:00 AM"; anything unexpected is passed through unchanged. */
export const formatTime12h = (time: string): string => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time || '');
  if (!match) return time || '';
  const hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
};

/** "09:00 – 10:30" */
export const formatTimeRange = (startTime: string, endTime: string): string =>
  `${formatTime12h(startTime)} – ${formatTime12h(endTime)}`;

/** Price respecting `priceType`: fixed, hourly or negotiable. */
export const formatPriceLabel = (priceType: PriceType | undefined, price: number | undefined): string => {
  if (priceType === 'negotiable') return 'Negotiable';
  const amount = `₦${Number(price || 0).toLocaleString()}`;
  return priceType === 'hourly' ? `${amount}/hr` : amount;
};

/** "45 min", "1 hr", "1 hr 30 min". */
export const formatDuration = (minutes: number | undefined): string => {
  const total = Math.max(0, Math.round(Number(minutes) || 0));
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
};

/** The first image, or the site's placeholder. */
export const serviceImage = (service: Pick<Service, 'images'> | null | undefined): string =>
  service?.images?.[0] || '/no-image.png';

/** A populated provider object, or null when the API sent a bare id. */
export const providerOf = (service: { providerId?: ServiceUser | string } | null | undefined): ServiceUser | null => {
  const provider = service?.providerId;
  return provider && typeof provider === 'object' ? provider : null;
};

export const providerIdOf = (service: { providerId?: ServiceUser | string } | null | undefined): string => {
  const provider = service?.providerId;
  if (!provider) return '';
  return typeof provider === 'string' ? provider : provider._id;
};

export const fullName = (user: ServiceUser | null | undefined): string => {
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  return name || 'Student';
};

export const initials = (user: ServiceUser | null | undefined): string => {
  const value = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
  return value || 'B';
};

/** The provider rating students see on a card (profile first, account rating second). */
export const providerRating = (provider: ServiceUser | null | undefined): number => {
  const value = provider?.providerProfile?.rating ?? provider?.rating ?? 0;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

export const isServiceOwner = (service: Service | null | undefined, userId: string | undefined): boolean =>
  Boolean(service && userId && providerIdOf(service) === userId);

export interface StatusMeta {
  label: string;
  pill: string;
  dot: string;
}

/** Status pill styles for every `BookingStatus` the backend can return. */
export const bookingStatusMeta = (status: BookingStatus): StatusMeta => {
  const map: Record<BookingStatus, StatusMeta> = {
    pending: {
      label: 'Pending',
      pill: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    confirmed: {
      label: 'Confirmed',
      pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    completed: {
      label: 'Completed',
      pill: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    cancelled: {
      label: 'Cancelled',
      pill: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
    },
    declined: {
      label: 'Declined',
      pill: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
    },
    no_show: {
      label: 'No show',
      pill: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
    },
  };
  return map[status] || map.pending;
};
