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
  uploadFile: (file: File | Blob, resourceType: 'image' | 'video' | 'raw' | 'audio' = 'image') => {
    const formData = new FormData();
    // Use an appropriate filename if it's a raw blob (like an audio recording)
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      const ext = resourceType === 'audio' ? 'webm' : 'bin';
      formData.append('file', file, `recording-${Date.now()}.${ext}`);
    }

    // Cloudinary's `video` resource type is the one that accepts audio, and the
    // backend only has /upload/image and /upload/video, so anything that is not
    // an image goes to /upload/video.
    const endpoint = resourceType === 'image' ? '/upload/image' : '/upload/video';
    return GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post(endpoint, formData);
  }
};
