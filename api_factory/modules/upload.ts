import axios from 'axios'; const ERRANDERS_CORE_WITH_AUTH_FORM_DATA = axios.create({ baseURL: 'https://api.erranders.org', headers: { 'Content-Type': 'multipart/form-data' } }); ERRANDERS_CORE_WITH_AUTH_FORM_DATA.interceptors.request.use((config) => { const token = typeof window !== 'undefined' ? localStorage.getItem('barter_token') || localStorage.getItem('token') : null; if (token) config.headers.Authorization = 'Bearer ' + token; return config; });;

export const upload_api = {
  uploadFile: (file: File | Blob, resourceType: 'image' | 'video' | 'raw' | 'audio' = 'image') => {
    const formData = new FormData();
    // Use an appropriate filename if it's a raw blob (like an audio recording)
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      const ext = resourceType === 'audio' ? 'webm' : 'bin';
      formData.append('file', file, `recording-${Date.now()}.${ext}`);
    }
    
    // Some backends have specific endpoints for image vs others
    if (resourceType === 'image') {
      return ERRANDERS_CORE_WITH_AUTH_FORM_DATA.post('/upload/image', formData);
    }
    return ERRANDERS_CORE_WITH_AUTH_FORM_DATA.post(`/upload?resourceType=${resourceType}`, formData);
  }
};
