import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node'

import styles from './styles/OrderAnnotation.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

interface OrderAnnotationProps {
  email: string;
}

function OrderAnnotation({ email }: OrderAnnotationProps) {
  return (
    <div className="order-annotation-container">
      <div className="success-icon">
        <CheckCircleIcon
          color="success"
          sx={{ fontSize: 60 }}
        />
      </div>

      <h1 className="title">
        Your order has been placed
      </h1>

      <p className="text">
        An email of your order detail has been sent to {email}
      </p>

      <p className="text">
        Please keep your order number. You can trace your package with order number
        <span>
          <Link to='/'> here </Link>.
        </span>
      </p>

      <div className="continue-shopping-btn">
        <Button variant="contained">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default OrderAnnotation;