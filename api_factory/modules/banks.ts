import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Banks API — Paystack reference data exposed by the Barter backend.
 * Both routes are JWT-guarded:
 *   GET /banks                                  → [{ name, code }]
 *   GET /banks/resolve?accountNumber=&bankCode= → { accountName }
 *
 * `axios.config.ts` already appends `/api/v1`, so the paths here are relative.
 */

export interface Bank {
  name: string;
  code: string;
}

export interface ResolvedBankAccount {
  accountName: string;
}

export const banksApi = {
  /** The full Paystack bank list (several hundred entries — search before selecting). */
  list: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get<Bank[]>('/banks');
  },

  /** Resolve an account number at a bank to the name registered on it. */
  resolve: (accountNumber: string, bankCode: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get<ResolvedBankAccount>('/banks/resolve', {
      params: { accountNumber, bankCode },
    });
  },
};
