import { useEffect } from 'react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SocialShare.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SocialShareProps {
  prodUUID: string;
}

const loadShareThisScript = () => {
  const script = document.createElement('script')
  script.id = 'sharethis'
  script.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=635bb7bc9c9fa7001910fbe2&product=sop'
  script.type = 'text/javascript';
  document.body.appendChild(script)
}

export default function SocialShare({ prodUUID }: SocialShareProps) {
  useEffect(() => {
    console.log('debug share this', prodUUID);
    const st = window.__sharethis__;
    if (!st) {
      loadShareThisScript();
    } else if (typeof st.initialize === 'function') {
      loadShareThisScript();
      st.href = window.location.href
      st.initialize()
    }
  }, [prodUUID])

  return (
    <div
      className="SocialShare__wrapper"
      dangerouslySetInnerHTML={{
        __html: `
        <div class="sharethis-inline-share-buttons"></div>
      `
      }}
    />
  );
}