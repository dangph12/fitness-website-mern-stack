export const buildWorkoutShareUrl = id => {
  const origin =
    (typeof window !== 'undefined' &&
      window.location &&
      window.location.origin) ||
    '';
  return `${origin}/workouts/workout-detail/${id}`;
};

export async function shareOrCopy({ title, text, url }) {
  const payload = { title, text, url };

  try {
    const canShare =
      typeof navigator !== 'undefined' &&
      navigator.share &&
      (navigator.canShare ? navigator.canShare(payload) : true);

    if (canShare) {
      await navigator.share(payload);
      return { ok: true, mode: 'share' };
    }
  } catch (e) {
    console.warn('Share API failed, falling back to clipboard.', e);
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return { ok: true, mode: 'copy' };
    }
  } catch (e) {
    console.warn('Clipboard writeText failed, trying execCommand.', e);
  }

  try {
    if (typeof document !== 'undefined') {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return { ok: true, mode: 'copy' };
    }
  } catch (e) {
    console.error('Fallback copy failed', e);
  }

  return { ok: false, error: 'Clipboard copy failed' };
}
