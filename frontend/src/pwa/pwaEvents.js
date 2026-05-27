const PWA_UPDATE_EVENT = 'qvgdm-pwa-update';

export function notifyPwaUpdate(registration) {
  window.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT, { detail: registration }));
}

export function subscribePwaUpdate(listener) {
  const handler = (event) => listener(event.detail);
  window.addEventListener(PWA_UPDATE_EVENT, handler);
  return () => window.removeEventListener(PWA_UPDATE_EVENT, handler);
}
