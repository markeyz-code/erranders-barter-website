import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const itemsApi = {
  list: (params: any) => GATEWAY_ENDPOINT.get('/items', { params }),
  getById: (id: string) => GATEWAY_ENDPOINT.get(`/items/${id}`),
  create: (data: any) => GATEWAY_ENDPOINT.post('/items', data),

  /** GET /items/me/listings — the signed-in seller's listings (all statuses). */
  myListings: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/items/me/listings'),

  /** PATCH /items/:id — owner-guarded edit. */
  update: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/items/${id}`, data),

  /** DELETE /items/:id — owner-guarded; refused while the item is in an active trade. */
  remove: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/items/${id}`)
};
