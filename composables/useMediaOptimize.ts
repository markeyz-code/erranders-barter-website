/**
 * Aggressive Media Optimization Utilities
 * Optimizes Cloudinary images and video assets for maximum streaming speed,
 * minimal memory footprint, and low bandwidth consumption on campus networks.
 */

export const optimizeVideoUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('cloudinary.com')) return url;

  // If it's a Cloudinary video upload URL that doesn't already have aggressive transformations
  if (url.includes('/video/upload/') && !url.includes('/q_auto')) {
    // q_auto:eco = aggressive compression (imperceptible on mobile/desktop screens)
    // f_auto = optimal codec (AV1/VP9/H.264)
    // w_720,c_limit = scale down 4K/1080p to crisp 720p
    // vc_auto = compatible video codec
    return url.replace('/video/upload/', '/video/upload/q_auto:eco,f_auto,w_720,c_limit,vc_auto/');
  }

  return url;
};

export const optimizeImageUrl = (url: string | null | undefined, width = 1080): string => {
  if (!url || typeof url !== 'string') return '/no-image.png';
  if (!url.includes('cloudinary.com')) return url;

  if (url.includes('/image/upload/') && !url.includes('/q_auto')) {
    return url.replace('/image/upload/', `/image/upload/q_auto,f_auto,w_${width},c_limit/`);
  }

  return url;
};

export const getVideoThumbnailUrl = (videoUrl: string | null | undefined): string => {
  if (!videoUrl || typeof videoUrl !== 'string') return '/no-image.png';
  if (!videoUrl.includes('cloudinary.com')) return '/no-image.png';

  // Cloudinary generates video poster snapshots on-the-fly at second 0
  return videoUrl
    .replace('/video/upload/', '/video/upload/so_0,q_auto,f_auto,w_600,c_limit/')
    .replace(/\.[^.]+$/, '.jpg');
};
