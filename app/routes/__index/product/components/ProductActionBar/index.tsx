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
}: ProductActionBarProps, ref) => (
  <div
    ref={ref}
    className="client-action-bar"
  >
    <div>
      <RoundButton
        onClick={onClickAddToCart}
        fullWidth
        loading={loading}
        colorScheme='addtocart'
      >
        Add To Cart
      </RoundButton>
    </div>

    <div>
      <RoundButton
        fullWidth
        onClick={onClickBuyNow}
        colorScheme='buynow'
      >
        Buy Now
      </RoundButton>
    </div>
  </div>
));

export default ProductActionBar;