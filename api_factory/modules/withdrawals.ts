import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Withdrawals API — written against the backend payout routes (Paystack).
 * All routes are JWT-guarded; `axios.config.ts` already appends `/api/v1`:
 *
 *   GET  /users/me/bank-details  → saved payout account | null
 *   PUT  /users/me/bank-details  → { bankCode, bankName?, accountNumber } → saved details
 *   POST /users/me/withdraw      → { amount } → Withdrawal
 *   GET  /users/me/withdrawals   → Withdrawal[] (newest first)
 *
 * `users_api.withdraw` in `modules/users.ts` targets the same POST route for the
 * older wallet code; this module is the typed, complete version used by the UI.
 */

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

/** A payout record as returned by the backend. */
export interface Withdrawal {
  _id: string;
  amount: number;
  fee: number;
  netAmount: number;
  reference: string;
  status: WithdrawalStatus;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  failureReason?: string;
  createdAt: string;
}

/** The payout account stored on the signed-in user. */
export interface BankDetails {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface SaveBankDetailsPayload {
  bankCode: string;
  /** Optional: the backend can resolve the name from `bankCode`, but sending it saves a lookup. */
  bankName?: string;
  accountNumber: string;
}

export const withdrawalsApi = {
  /** The user's saved payout account, or `null` when they have not set one up yet. */
  getBankDetails: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get<BankDetails | null>('/users/me/bank-details');
  },

  /** Persist the payout account. The server echoes the saved details back. */
  saveBankDetails: (payload: SaveBankDetailsPayload) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put<BankDetails>('/users/me/bank-details', payload);
  },

  /** Request a payout of `amount` naira to the saved bank account. */
  withdraw: (amount: number) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post<Withdrawal>('/users/me/withdraw', { amount });
  },

  /** The signed-in user's withdrawals, newest first. */
  history: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get<Withdrawal[]>('/users/me/withdrawals');
  },
};
