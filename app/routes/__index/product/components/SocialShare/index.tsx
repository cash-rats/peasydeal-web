import { useEffect } from 'react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SocialShare.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function SocialShare() {
  useEffect(() => {
    const st = window.__sharethis__;
    if (!st) {
      const script = document.createElement('script')
      script.id = 'sharethis'
      script.src = `https://platform-api.sharethis.com/js/sharethis.js#property=635a37810e0d03001fe8c1e9&product=inline-share-buttons`
      script.type = 'text/javascript';
      document.body.appendChild(script)
    } else if (typeof st.initialize === 'function') {
      st.href = window.location.href
      st.initialize()
    }
  }, [])

  return (
    <div
      className="SocialShare__wrapper"
      dangerouslySetInnerHTML={{
        __html: `
        <div id="sharebuttons" class="sharethis-inline-share-buttons"> </div>
      `
      }}
    />
  );
}