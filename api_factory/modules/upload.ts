import { GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA } from '../axios.config';

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
      return GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post('/upload/image', formData);
    }
    return GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post(`/upload?resourceType=${resourceType}`, formData);
  }
};
