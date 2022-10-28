import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SocialShare.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function SocialShare() {
  return (
    <div
      className="SocialShare__wrapper"
      dangerouslySetInnerHTML={{
        __html: `
          <div class="sharethis-inline-share-buttons"> </div>
        `
      }}
    >
      {/* <div className="addthis_inline_share_toolbox"></div> */}
      {/* <div className="sharethis-inline-share-buttons"></div> */}
    </div>
  );
}