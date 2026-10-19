import { GATEWAY_ENDPOINT } from '../axios.config';

export const categoriesApi = {
  fetch: async () => {
    try {
      const response = await GATEWAY_ENDPOINT.get('/categories');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch categories' };
    }
  },
  list: async () => {
    return categoriesApi.fetch();
  },
  create: async (payload: { name: string; icon?: string }) => {
    try {
      const response = await GATEWAY_ENDPOINT.post('/categories', payload);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to create category' };
    }
  },
};
