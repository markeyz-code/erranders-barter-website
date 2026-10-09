import { GATEWAY_ENDPOINT } from '../axios.config';
export const escrowApi = {
  initiate: (data: any) => GATEWAY_ENDPOINT.post('/escrow/initiate', data),
  release: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/release`),
  dispute: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/dispute`),
  acceptNegotiation: (txId: string) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/accept-negotiation`),
  counterNegotiation: (txId: string, amount: number) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/counter-negotiation`, { amount }),
  myTransactions: () => GATEWAY_ENDPOINT.get('/escrow/my-transactions')
};