import { GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA } from '../axios.config';

/**
 * Upload API — written against `backend/src/upload/upload.controller.ts`.
 * The backend exposes `POST /upload/image` and `POST /upload/video` only, and
 * both read the multipart field named `file` (`FileInterceptor('file')`).
 * There is no query-param (`?resourceType=`) form on this backend.
 *
 * Signatures are unchanged so no caller has to change.
 */
export const upload_api = {
  uploadFile: (
    file: File | Blob,
    resourceType: 'image' | 'video' | 'raw' | 'audio' = 'image',
    onUploadProgress?: (progressEvent: any) => void
  ) => {
    const formData = new FormData();
    // Use an appropriate filename if it's a raw blob (like a camera recording or audio recording)
    if (file instanceof File) {
      formData.append('file', file, file.name);
    } else {
      let ext = 'bin';
      if (resourceType === 'audio') {
        ext = file.type?.includes('mp4') ? 'm4a' : 'webm';
      } else if (resourceType === 'video') {
        ext = file.type?.includes('mp4') ? 'mp4' : 'webm';
      } else if (resourceType === 'image') {
        ext = file.type?.includes('png') ? 'png' : 'jpg';
      }
      formData.append('file', file, `media-${Date.now()}.${ext}`);
    }

    const endpoint = resourceType === 'image' ? '/upload/image' : '/upload/video';
    return GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post(endpoint, formData, {
      onUploadProgress,
      timeout: 180000,
    });
  }
};
