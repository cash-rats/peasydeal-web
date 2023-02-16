import type { LinksFunction } from '@remix-run/node';
import { Button } from '@chakra-ui/react';

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

      <div className='w-full'>
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
}