import type { SyntheticEvent } from 'react';

// Inline SVG placeholder — no network request, so it can never itself fail to
// load. Used as the onError fallback for any property/media <img>, so a
// failed load (deleted file, timeout, corrupt upload, unsupported format)
// renders as a clearly-labeled placeholder instead of a bare broken image.
export const MEDIA_FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23eef0f2'/%3E%3Cg fill='none' stroke='%23c3c8cf' stroke-width='10' stroke-linejoin='round' stroke-linecap='round'%3E%3Crect x='60' y='80' width='280' height='170' rx='8'/%3E%3Ccircle cx='140' cy='140' r='18'/%3E%3Cpath d='M60 220 L160 150 L220 195 L270 160 L340 210'/%3E%3C/g%3E%3C/svg%3E";

/** onError handler for plain <img> tags outside ImageWithBasePath — swaps to the fallback placeholder once, without looping. */
export function handleMediaImgError(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.src === MEDIA_FALLBACK_SRC) return;
  img.src = MEDIA_FALLBACK_SRC;
}
