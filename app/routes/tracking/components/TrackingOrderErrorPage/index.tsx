import type { LinksFunction } from 'react-router';

import EmptyBox from './images/empty-box.png';
import styles from './styles/TrackingOrderErrorPage.css?url';

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
      <p className="
        mt-0 mx-0 mb-1
        text-2xl font-bold text-center font-poppins
      ">
        {message}
      </p>

      <div className="error-content">
        <img
          alt="no data found"
          src={EmptyBox}
        />
      </div>

      <p className="
        font-poppins font-medium text-center
        max-w-[600px] mx-auto mt-8
      ">
        Sorry, we couldn't find an order with that ID. Please double-check and try again. Contact us if the issue persists. Thank you.
      </p>
    </div>
  );
}