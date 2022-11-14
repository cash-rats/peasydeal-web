import { forwardRef } from 'react';
import type { LinksFunction } from '@remix-run/node';

import RoundButton from '~/components/RoundButton';

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
}: ProductActionBarProps, ref) => {
  return (
    <div
      ref={ref}
      className="client-action-bar"
    >
      <div>
        <RoundButton
          onClick={onClickAddToCart}
          fullWidth
          isLoading={loading}
          colorScheme='addtocart'
        >
          <p style={{ width: '100%', textAlign: 'center' }}>
            Add To Cart
          </p>
        </RoundButton>
      </div>

      <div>
        <RoundButton
          fullWidth
          onClick={onClickBuyNow}
          colorScheme='buynow'
        >
          <p style={{ width: '100%', textAlign: 'center' }}>
            Buy Now
          </p>
        </RoundButton>
      </div>
    </div>
  );
});

export default ProductActionBar;