import { GATEWAY_ENDPOINT } from '../axios.config';

export const categoriesApi = {
  fetch: async () => {
    try {
      const response = await GATEWAY_ENDPOINT.get('/categories');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch categories' };
    }
  }
};
