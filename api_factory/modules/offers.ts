import { GATEWAY_ENDPOINT } from '../axios.config';

export const offersApi = {
  create: (data: { receiverId: string, targetItemId: string, offeredItemId: string, cashTopUp?: number }) => 
    GATEWAY_ENDPOINT.post('/offers', data),
  
  getMyOffers: () => GATEWAY_ENDPOINT.get('/offers/my-offers'),
  
  getReceivedOffers: () => GATEWAY_ENDPOINT.get('/offers/received'),
  
  updateStatus: (id: string, status: string) => 
    GATEWAY_ENDPOINT.patch(`/offers/${id}/status`, { status }),
};
