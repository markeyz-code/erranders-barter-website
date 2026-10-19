import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const itemsApi = {
  list: (params: any) => GATEWAY_ENDPOINT.get('/items', { params }),
  getById: (id: string) => GATEWAY_ENDPOINT.get(`/items/${id}`),
  create: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/items', data),

  /** POST /items/declutter-batch — publish an automated batch of room declutter items */
  createDeclutterBatch: (data: {
    hostel: string;
    groupName?: string;
    bundleDiscountPercent?: number;
    autoPriceDrop?: boolean;
    items: Array<{
      title: string;
      description?: string;
      price: number;
      category?: string;
      condition?: string;
      images?: string[];
      videos?: string[];
    }>;
  }) => GATEWAY_ENDPOINT_WITH_AUTH.post<{
    success: boolean;
    batchSize: number;
    totalValuation: number;
    hostel: string;
    items: any[];
  }>('/items/declutter-batch', data),

  /** GET /items/me/listings — the signed-in seller's listings (all statuses). */
  myListings: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/items/me/listings'),

  /** PATCH /items/:id — owner-guarded edit. */
  update: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/items/${id}`, data),

  /** DELETE /items/:id — owner-guarded; refused while the item is in an active trade. */
  remove: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/items/${id}`),

  /** GET /items/catch-up — fetch newly uploaded listings and services since last session */
  getCatchUp: (since?: string) => GATEWAY_ENDPOINT.get('/items/catch-up', { params: { since } }),

  /** GET /items/reels — Instagram Reels media feed */
  getReels: (userId?: string, filter?: string) => GATEWAY_ENDPOINT.get('/items/reels', { params: { userId, filter } }),

  /** POST /items/:id/like — toggle like */
  toggleLike: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.post(`/items/${id}/like`),

  /** POST /items/:id/comment — post comment */
  addComment: (id: string, text: string) => GATEWAY_ENDPOINT_WITH_AUTH.post(`/items/${id}/comment`, { text }),

  /** POST /items/:id/repost — repost item */
  repost: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.post(`/items/${id}/repost`),

  /** GET /items/declutter-batch/:batchId — get declutter batch package */
  getDeclutterBatch: (batchId: string) => GATEWAY_ENDPOINT.get(`/items/declutter-batch/${batchId}`),
};

