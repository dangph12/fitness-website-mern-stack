import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return 'N/A';

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  } catch (error) {
    return 'Invalid Date';
  }
}

export function formatDateTime(date) {
  if (!date) return 'N/A';

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch (error) {
    return 'Invalid Date';
  }
}

export const formatInstructions = text => {
  if (!text) return '—';
  let t = String(text);

  // If the string contains escaped newline sequences like "\n" (two chars),
  // convert them to real newlines.
  t = t.replace(/\\r?\\n/g, '\n').replace(/\\n/g, '\n');

  // Collapse 3+ newlines to max 2 for cleaner spacing
  t = t.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace on each line
  t = t
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  return t;
};

/**
 * Check if URL is an image file
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isImageUrl = url => {
  if (!url || typeof url !== 'string') return false;
  return /\.(gif|jpe?g|png|webp)$/i.test(url);
};

/**
 * Check if URL is a GIF file
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isGifUrl = url => {
  if (!url || typeof url !== 'string') return false;
  return url.toLowerCase().endsWith('.gif');
};

/**
 * Convert Cloudinary GIF URL to static JPG preview (first frame)
 * @param {string} url - Original image URL
 * @returns {string} - Preview URL or original URL
 */
export const getImagePreviewUrl = url => {
  if (!url || typeof url !== 'string') return url;

  const isGif = isGifUrl(url);
  const isCloudinary = url.includes('/upload/');

  if (isGif && isCloudinary) {
    // Cloudinary transformation: get first frame as JPG
    return url.replace('/upload/', '/upload/f_jpg,so_0/');
  }

  return url;
};

/**
 * Get image URLs for static preview and animated version
 * @param {string} url - Original image URL
 * @returns {{previewUrl: string, animatedUrl: string}}
 */
export const getImageUrls = url => {
  if (!url || typeof url !== 'string') {
    return { previewUrl: '', animatedUrl: '' };
  }

  return {
    previewUrl: getImagePreviewUrl(url),
    animatedUrl: url
  };
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string}
 */
export const formatFileSize = bytes => {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Max file size in bytes (default: 10MB)
 * @param {string[]} options.allowedTypes - Allowed MIME types (default: image/*)
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
  } = options;

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Only ${allowedTypes.join(', ')} files are allowed`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`
    };
  }

  return { valid: true, error: null };
};
