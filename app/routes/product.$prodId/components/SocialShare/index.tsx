import { useEffect, useState } from 'react';

interface SocialShareProps {
  prodUUID: string;
}

type ShareThis = {
  initialize?: () => void;
  href?: string;
};

const loadShareThisScript = (onLoad?: () => void) => {
  const script = document.createElement('script');
  script.async = true;
  if (onLoad) {
    script.onload = onLoad;
  }
  script.id = 'sharethis';
  script.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=635bb7bc9c9fa7001910fbe2&product=sop';
  script.type = 'text/javascript';
  document.body.appendChild(script);
};

const removeShareThisScript = () => {
  const st = document.getElementById('sharethis');
  if (st && document.body.contains(st)) {
    document.body.removeChild(st);
  }
};

export default function SocialShare({ prodUUID }: SocialShareProps) {
  const [isShareThisReady, setIsShareThisReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const st = (window as typeof window & { __sharethis__?: ShareThis }).__sharethis__;
    if (!st) {
      loadShareThisScript(() => setIsShareThisReady(true));
    } else {
      setIsShareThisReady(true);
      if (typeof st.initialize === 'function') {
        st.href = window.location.href;
        st.initialize();
      }
    }

    return () => {
      removeShareThisScript();
      setIsShareThisReady(false);
    };
  }, [prodUUID]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isShareThisReady) return;

    const st = (window as typeof window & { __sharethis__?: ShareThis }).__sharethis__;
    if (!st?.initialize) return;

    st.href = window.location.href;
    st.initialize();
  }, [isShareThisReady, prodUUID]);

  return (
    <div className="mt-6 w-full">
      <h3 className="mb-3 text-lg font-semibold text-black">
        Share This Product:
      </h3>
      <div className="sharethis-inline-share-buttons text-left" />
    </div>
  );
}
