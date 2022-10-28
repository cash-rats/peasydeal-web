import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SocialShare.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function SocialShare() {
  return (
    <div className="SocialShare__wrapper">
      <div className="sharethis-inline-share-buttons"></div>
    </div>
  );
}