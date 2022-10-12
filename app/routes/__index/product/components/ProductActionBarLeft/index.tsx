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
      <div>
        <RoundButton
          colorScheme='addtocart'
          onClick={onClickAddToCart}
          isLoading={loading}
          text='Add To Cart'
        />
      </div>

      <div>
        <RoundButton
          colorScheme='buynow'
          onClick={onClickBuyNow}
          text='Buy Now'
        />
      </div>
    </div>
  );
}