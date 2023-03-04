import { forwardRef } from 'react';
import { Form } from '@remix-run/react';
import { Button } from '@chakra-ui/react';

import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';

interface ProductActionBarProps {
  onClickAddToCart: () => void;
  sessionStorableCartItem: ShoppingCartItem;
  loading?: boolean;
};

const ProductActionBar = forwardRef(({
  onClickAddToCart,
  sessionStorableCartItem,
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
            colorScheme='pink'
            variant={'solid'}
            width='100%'
            size="lg"
            type='submit'
          >
            Buy Now
          </Button>
        </Form>
      </div>
    </div>
  );
});

export default ProductActionBar;