import { GATEWAY_ENDPOINT } from '../axios.config';

export interface UpdateOfferStatusPayload {
  status: string;
  receiverSwapDetails?: string;
  receiverHandoverNotes?: string;
}

export const offersApi = {
  create: (data: { receiverId: string, targetItemId: string, offeredItemId: string, cashTopUp?: number }) => 
    GATEWAY_ENDPOINT.post('/offers', data),
  
  getMyOffers: () => GATEWAY_ENDPOINT.get('/offers/my-offers'),
  
  getReceivedOffers: () => GATEWAY_ENDPOINT.get('/offers/received'),
  
  updateStatus: (id: string, payload: string | UpdateOfferStatusPayload) => {
    const data = typeof payload === 'string' ? { status: payload } : payload;
    return GATEWAY_ENDPOINT.patch(`/offers/${id}/status`, data);
  },
};
