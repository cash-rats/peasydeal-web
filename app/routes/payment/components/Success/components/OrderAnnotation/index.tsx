import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from '@remix-run/react';

interface OrderAnnotationProps {
  email: string;
  orderUUID: string;
}

function Text({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 font-poppins text-center text-base text-[#7f7f7f]">
      {children}
    </p>
  )
}

function OrderAnnotation({ email, orderUUID }: OrderAnnotationProps) {
  return (
    <div className="flex flex-col">
      <div className="text-center">
        <CheckCircleIcon
          color="success"
          sx={{ fontSize: 120 }}
        />
      </div>

      <h1 className="text-center font-semibold text-3xl mt-4 font-poppins">
        Your order has been placed
      </h1>

      <Text>
        An email of your order detail has been sent to <b>{email}</b>
      </Text>

      <Text>
        Please keep your order number. You can trace your package with the order number.
      </Text>

      <div className="flex justify-center gap-6 mt-6">
        <Button variant="contained">
          <Link to='/'>
            Continue Shopping
          </Link>
        </Button>

        <Button color='info' variant="contained">
          <Link to={`/tracking?query=${orderUUID}`}>
            Track you order
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default OrderAnnotation;