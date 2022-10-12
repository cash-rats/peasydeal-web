import { Button } from '@chakra-ui/react';
import type { LinksFunction } from '@remix-run/node';

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
        <Button
          width={{ base: '100%' }}
          colorScheme='green'
          onClick={onClickAddToCart}
          isLoading={loading}
        >
          Add To Cart
        </Button>
      </div>

      <div>
        <Button
          width={{ base: '100%' }}
          colorScheme='orange'
          onClick={onClickBuyNow}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}