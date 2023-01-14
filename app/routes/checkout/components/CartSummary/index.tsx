import { Fragment } from 'react';
import type { ReactElement } from 'react';
import { Link } from '@remix-run/react';

import type { ShoppingCart } from '~/sessions/shoppingcart.session';
import type { PriceInfo } from '~/shared/cart';

interface CartSummaryProps {
  cart: ShoppingCart;
  priceInfo: PriceInfo;
}

export default function CartSummary({ cart, priceInfo }: CartSummaryProps) {
  return (

    <div className="
              mb-0 border-none shadow-price-panel
              bg-white w-full
            ">
      <h1 className="font-bold text-[1.4rem] p-3">
        <span>Cart Summary</span>
        <Link to="/cart">
          <span className="
                    uppercase text-[0.8rem] ml-4
                    font-normal
                  ">
            edit
          </span>
        </Link>
      </h1>

      <div className="py-0 px-4">
        {
          Object.keys(cart).map((prodID: string): ReactElement => {
            const cartItem = cart[prodID];
            return (
              <Fragment key={prodID}>
                <div className="py-4 px-0 flex items-center">
                  <div className="mr-[1.2rem]">
                    <img
                      className="w-[85px] aspect-square"
                      src={cartItem.image}
                      alt={`#${cartItem.variationUUID}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium leading-6 h-full">
                      {cartItem.title}
                    </p>
                  </div>
                  <h2 className="
                            flex-1flex justify-center items-center
                            font-semibold text-lg
                          ">
                    {cartItem.quantity} x ${cartItem.salePrice}
                  </h2>
                </div>
              </Fragment>
            )
          })
        }
      </div>

      {/* Subtotal */}
      <div className="
                p-[0.9375rem] flex justify-end items-center
                border-t-[1px] border-t-solid border-t-[#DFDFDF]
                text-lg
              ">
        Total: &nbsp;
        <span className="font-semibold">
          £{priceInfo.total_amount}
        </span>
      </div>
    </div>

  );
}
