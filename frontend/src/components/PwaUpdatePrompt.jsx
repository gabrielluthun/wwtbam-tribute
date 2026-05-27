import { useEffect, useState } from 'react';
import { subscribePwaUpdate } from '@/pwa/pwaEvents';

export function PwaUpdatePrompt() {
  const [waitingRegistration, setWaitingRegistration] = useState(null);

  useEffect(() => {
    const onControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker?.addEventListener('controllerchange', onControllerChange);
    return () => {
      navigator.serviceWorker?.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  useEffect(() => subscribePwaUpdate(setWaitingRegistration), []);

  if (!waitingRegistration) {
    return null;
  }

  const applyUpdate = () => {
    waitingRegistration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    setWaitingRegistration(null);
  };

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto flex max-w-md flex-col gap-3 rounded-lg border border-amber-500/40 bg-[#1a1a2e] p-4 text-sm text-white shadow-lg sm:flex-row sm:items-center sm:justify-between"
    >
      <p>Une nouvelle version de QVGDM est disponible.</p>
      <button
        type="button"
        onClick={applyUpdate}
        className="shrink-0 rounded-md bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400"
      >
        Mettre à jour
      </button>
    </div>
  );
}
