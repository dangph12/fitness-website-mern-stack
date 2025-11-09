import axiosInstance from '~/lib/axios-instance';

const originFromAbsoluteUrl = maybeUrl => {
  try {
    if (!maybeUrl) return '';
    const u = new URL(maybeUrl);
    return `${u.protocol}//${u.host}`;
  } catch {
    return '';
  }
};

const getBaseOrigin = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  const env =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env
      : {};
  const appUrl =
    env.VITE_APP_URL || env.VITE_PUBLIC_APP_URL || env.PUBLIC_APP_URL || '';
  if (appUrl) {
    const o = originFromAbsoluteUrl(appUrl);
    if (o) return o;
  }

  const apiBase = axiosInstance?.defaults?.baseURL || '';
  const inferred = originFromAbsoluteUrl(apiBase);
  if (inferred) return inferred;

  throw new Error(
    '[pay-urls] Cannot determine app origin. Set VITE_APP_URL (e.g. https://app.example.com).'
  );
};

const buildUrl = (path, params) => {
  const base = getBaseOrigin();
  const clean = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(clean, base);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
};

export const buildReturnUrl = ({ level, orderCode, extra } = {}) =>
  buildUrl('/payments/success', {
    status: 'success',
    ...(orderCode ? { orderCode } : {}),
    ...(level ? { level } : {}),
    ...(extra || {})
  });

export const buildCancelUrl = ({ level, orderCode, reason, extra } = {}) =>
  buildUrl('/payments/cancel', {
    status: 'cancelled',
    ...(orderCode ? { orderCode } : {}),
    ...(level ? { level } : {}),
    ...(reason ? { reason } : {}),
    ...(extra || {})
  });

export { buildUrl };
