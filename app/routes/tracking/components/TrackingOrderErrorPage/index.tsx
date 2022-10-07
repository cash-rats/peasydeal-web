import type { LinksFunction } from '@remix-run/node';

import EmptyBox from './images/empty-box.png';
import styles from './styles/TrackingOrderErrorPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface TrackingOrderErrorPageProps {
  message?: string;
}

export default function TrackingOrderErrorPage({ message = '' }: TrackingOrderErrorPageProps) {
  return (
    <div className="problematic-page">
      <p className="error-text"> {message} </p>

      <div className="error-content">
        <img
          alt="no data found"
          src={EmptyBox}
        />
      </div>
    </div>
  );
}