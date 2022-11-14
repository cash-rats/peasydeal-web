import type { LinksFunction } from '@remix-run/node';
import RoundButton from '~/components/RoundButton';

import styles from './styles/ProductActionBarLeft.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ProductActionBarLeftProps {
  onClickAddToCart: () => void;
  onClickBuyNow: () => void;
  loading: boolean;
}

export default function ProductActionBarLeft({
  onClickAddToCart,
  onClickBuyNow,
  loading,
}: ProductActionBarLeftProps) {
  return (
    <div className="client-action-bar-large">
      <div className="ProductActionBarLeft__btn">
        <RoundButton
          fullWidth
          colorScheme='addtocart'
          onClick={onClickAddToCart}
          isLoading={loading}
          style={{ whiteSpace: 'nowrap' }}
        >
          Add To Cart
        </RoundButton>
      </div>

      <div className="ProductActionBarLeft__btn">
        <RoundButton
          fullWidth
          colorScheme='buynow'
          onClick={onClickBuyNow}
          style={{ whiteSpace: 'nowrap' }}
        >
          Buy Now
        </RoundButton>
      </div>
    </div>
  );
}