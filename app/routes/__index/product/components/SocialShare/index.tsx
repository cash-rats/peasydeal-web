import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SocialShare.css';
// import Facebook from './images/facebook.png';
// import Twitter from './images/twitter.png';
// import Whatsapp from './images/whatsapp.png';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function SocialShare() {
  return (
    <div className="SocialShare__wrapper">
      <div className="sharethis-inline-share-buttons"></div>
      {/* <ul className="SocialShare__list">
        <li>
          <img alt='share on facebook' src={Facebook} />
        </li>
        <li>
          <img alt='share on twitter' src={Twitter} />
        </li>
        <li>
          <img alt='share on whatsapp' src={Whatsapp} />
        </li>
      </ul> */}
    </div>
  );
}