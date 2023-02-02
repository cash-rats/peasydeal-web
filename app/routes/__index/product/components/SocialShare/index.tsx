import { useEffect } from 'react';
import { InlineShareButtons } from 'sharethis-reactjs';
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
  // return (
  //   <InlineShareButtons
  //     config={{
  //       alignment: 'center',  // alignment of buttons (left, center, right)
  //       color: 'social',      // set the color of buttons (social, white)
  //       enabled: true,        // show/hide buttons (true, false)
  //       font_size: 16,        // font size for the buttons
  //       labels: 'cta',        // button labels (cta, counts, null)
  //       language: 'en',       // which language to use (see LANGUAGES)
  //       networks: [           // which networks to include (see SHARING NETWORKS)
  //         'whatsapp',
  //         'linkedin',
  //         'messenger',
  //         'facebook',
  //         'twitter'
  //       ],
  //       padding: 12,          // padding within buttons (INTEGER)
  //       radius: 4,            // the corner radius on each button (INTEGER)
  //       show_total: true,
  //       size: 40,             // the size of each button (INTEGER)

  //       // OPTIONAL PARAMETERS
  //       // url: window.location.href, // (defaults to current url)
  //       // image: 'https://bit.ly/2CMhCMC',  // (defaults to og:image or twitter:image)
  //       // description: 'custom text',       // (defaults to og:description or twitter:description)
  //       // title: 'custom title',            // (defaults to og:title or twitter:title)
  //       // message: 'custom email text',     // (only for email sharing)
  //       // subject: 'custom email subject',  // (only for email sharing)
  //       // username: 'custom twitter handle' // (only for twitter sharing)
  //     }}
  //   />
  // )
}