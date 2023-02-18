import { forwardRef } from 'react';
import { Button } from '@chakra-ui/react';

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
      className='
        flex gap-[10px]
        pt-4 py-2 bottom-0 left-0
        px-2 md:px-0
        z-10
        w-full bg-white
      '
      ref={ref}
    >
      <div>
        <Button
          colorScheme='pink'
          variant='outline'
          width='100%'
          size="lg"
          isLoading={loading}
          loadingText='Adding'
          onClick={onClickAddToCart}
          spinnerPlacement='start'
        >
          Add To Cart
        </Button>
      </div>

      <div className='flex-auto'>
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