
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/TrackingOrderInitPage.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function InitialPage() {
  return (
    <div className="initial-page">
      <p className='error-text font-poppins'> Search your order with order id. </p>
    </div>
  );
}