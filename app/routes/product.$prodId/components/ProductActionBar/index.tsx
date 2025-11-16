import { forwardRef, useCallback } from 'react';
import { useNavigate } from 'react-router';

import type { ShoppingCartItem } from '~/sessions/types';
import { Button } from '~/components/ui/button';
import { useCartContext } from '~/routes/hooks';

interface ProductActionBarProps {
  onClickAddToCart?: () => void;
  sessionStorableCartItem: ShoppingCartItem;
  loading?: boolean;
};

const ProductActionBar = forwardRef<HTMLDivElement, ProductActionBarProps>(({
  onClickAddToCart = () => { },
  sessionStorableCartItem,
  loading = false,
}, ref) => {
  const navigate = useNavigate();
  const { cart, setCart } = useCartContext();

  const handleBuyNow = useCallback(() => {
    const item: ShoppingCartItem = {
      ...sessionStorableCartItem,
      added_time: sessionStorableCartItem.added_time ?? Date.now().toString(),
    };

    setCart({
      ...cart,
      [item.variationUUID]: item,
    });

    window.rudderanalytics?.track('click_buy_now');
    navigate('/cart');
  }, [cart, navigate, sessionStorableCartItem, setCart]);

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
          type='button'
          variant='outline'
          className='h-12 w-full rounded-lg border border-[#D53F8C] text-base font-semibold text-[#D53F8C] transition-colors hover:bg-[#FFF5F7] focus-visible:ring-[#D53F8C]'
          disabled={loading}
          aria-busy={loading}
          onClick={onClickAddToCart}
        >
          {loading && (
            <span
              aria-hidden='true'
              className='inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'
            />
          )}
          {loading ? 'Adding' : 'Add To Cart'}
        </Button>
      </div>

      <div className='flex-auto'>
        <Button
          className='h-12 w-full rounded-lg bg-[#D02E7D] text-base text-white font-semibold transition-colors hover:bg-[#B83280] focus-visible:ring-[#D53F8C]'
          type='button'
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
});

ProductActionBar.displayName = 'ProductActionBar';

export default ProductActionBar;
