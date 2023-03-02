import { Fragment } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Link } from '@remix-run/react';

import type { ShoppingCart } from '~/sessions/shoppingcart.session';
import type { PriceInfo } from '~/shared/cart';
import { round10 } from '~/utils/preciseRound';

interface CartSummaryProps {
  cart: ShoppingCart;
  priceInfo: PriceInfo;
}

interface PriceInfoBoxProps {
  label: ReactNode;
  info: ReactNode;
};

function PriceInfoBox({ label, info }: PriceInfoBoxProps) {
  return (
    <div className="
      capitalize text-sm
      flex w-full
    ">
      <label className="
        capitalize font-semibold text-base
        flex-1
      ">
        {label}: &nbsp;
      </label>
      <div className="
        capitalize font-semibold text-base flex-1
        text-end
      ">
        {info}
      </div>
    </div>
  )
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
        p-[0.9375rem] border-t-[1px] border-t-solid border-t-[#DFDFDF]
        text-lg flex justify-end
      ">
        <div className="w-full 499:w-[55%] flex flex-col justify-center items-end gap-[5px]">
          <PriceInfoBox
            label="Items (VAT Incl.)"
            info={`£${round10(priceInfo.sub_total + priceInfo.tax_amount, -2)}`}
          />

          {/* <PriceInfoBox
            label="Tax(20%)"
            info={`£${priceInfo.tax_amount}`}
          /> */}

          {
            priceInfo.discount_type === 'price_off' && (
              <div className="
                capitalize font-semibold text-base flex-1
                text-end
              ">
                - £${priceInfo.discount_amount}
              </div>
            )
          }

          {
            priceInfo.discount_type === 'percentage_off' && (
              <div className="
                capitalize font-semibold text-base flex-1
                text-end
              ">
                - £${priceInfo.discount_amount}
              </div>
            )
          }

          <PriceInfoBox
            label="shipping"
            info={`£${priceInfo.discount_type === 'free_shipping'
              ? 0
              : priceInfo.shipping_fee
              }`}
          />

          <div className="
            capitalize text-sm
            flex w-full
          ">
            <label className="
              capitalize font-semibold
              flex-1 text-xl
            ">
              Total: &nbsp;
            </label>
            <div className="
              capitalize font-semibold text-xl flex-1
              text-end
            ">
              £{priceInfo.total_amount}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
