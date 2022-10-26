import { forwardRef } from 'react';
import Button from '@mui/lab/LoadingButton';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/ProductActionBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ProductActionBarProps {
  onClickAddToCart: () => void;
  onClickBuyNow: () => void;
  loading?: boolean;
};

const ProductActionBar = forwardRef(({
  onClickAddToCart,
  onClickBuyNow,
  loading = false,
}: ProductActionBarProps, ref) => (
  <div
    ref={ref}
    className="client-action-bar"
  >
    <div>
      <Button
        onClick={onClickAddToCart}
        fullWidth
        loading={loading}
      >
        Add To Cart
      </Button>
    </div>

    <div>
      <Button
        fullWidth
        onClick={onClickBuyNow}
      >
        Buy Now
      </Button>
    </div>
  </div>
));

export default ProductActionBar;