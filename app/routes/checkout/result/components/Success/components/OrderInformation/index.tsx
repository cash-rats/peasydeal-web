import type { LinksFunction } from '@remix-run/node';

import styles from './styles/OrderInformation.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface OrderInformationProps {
  email: string;
  phone: string;
  firstname: string;
  lastname: string
  address: string;
  address2: string;
  city: string;
  postal: string;
  country: string;
}

function OrderInformation({
  email,
  phone,
  firstname,
  lastname,
  address,
  address2,
  city,
  postal,
  country,
}: OrderInformationProps) {
  return (
    <div className="customer-detail-container">
      <h1>
        Order Information
      </h1>
      <div className="customer-detail">
        <div className="contact">
          <h2>
            Contact
          </h2>

          <div className="content">
            <span> Email: {email} </span>
            <span> Contact name: {firstname} {lastname} </span>
            <span> Contact phone: {phone} </span>
          </div>
        </div>

        <div className="billing-address">
          <h2>
            Billing address
          </h2>

          <div className="content">
            <span> {address} </span>
            <span> {address2} </span>
            <span> {city}, {postal} </span>
            <span> {country} </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderInformation;
