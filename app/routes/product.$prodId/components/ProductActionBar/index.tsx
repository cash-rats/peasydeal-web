import { forwardRef } from 'react';
import { Form } from 'react-router';

import type { ShoppingCartItem } from '~/sessions/types';
import { Button } from '~/components/ui/button';

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
        <Form
          method='post'
          action='/cart?index'
        >
          {/*
            'buy_now' is an action type that '/cart' can handle.
            Refer to: '__/index/cart/actions.ts'
          */}
          <input
            type='hidden'
            name="__action"
            value='buy_now'
          />

          <input
            type='hidden'
            name="cart_item"
            value={JSON.stringify(sessionStorableCartItem)}
          />

          <Button
            className='h-12 w-full rounded-lg bg-[#D02E7D] text-base text-white font-semibold transition-colors hover:bg-[#B83280] focus-visible:ring-[#D53F8C]'
            type='submit'
            onClick={() => {
              window.rudderanalytics?.track('click_buy_now');
            }}
          >
            Buy Now
          </Button>
        </Form>
      </div>
    </div>
  );
});

ProductActionBar.displayName = 'ProductActionBar';

export default ProductActionBar;
