import { forwardRef } from 'react';
import type { LinksFunction } from '@remix-run/node';

import { Button } from '@chakra-ui/react';

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
        <Button
          colorScheme='pink'
          variant='outline'
          width='100%'
          size="lg"
          isLoading={loading}
          loadingText='Adding'
          onClick={onClickAddToCart}>
          Add To Cart
        </Button>
      </div>

      <div>
        <Button
          colorScheme='pink'
          variant={'solid'}
          width='100%'
          size="lg"
          onClick={onClickBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
});

export default ProductActionBar;