import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { BsBagCheck } from 'react-icons/bs';
import Skeleton from '@mui/material/Skeleton';

import { TAX } from '~/utils/checkout_accountant';
import RoundButton, { links as RoundButtonLinks } from '~/components/RoundButton';

import type { PriceInfo } from '../../cart.server';

export const links: LinksFunction = () => {
  return [
    ...RoundButtonLinks(),
  ];
};

type PriceResultProps = {
  priceInfo: PriceInfo;
  calculating?: boolean;
};

export default function PriceResult({ priceInfo, calculating = false }: PriceResultProps) {
  return (
    <div className="result-row">
      <div className="left" />

      <div className="right">
        <h2 className="Cart__result-row-summary">
          Summary
        </h2>
        <div className="subtotal">
          <label> Items </label>
          <div className="result-value">
            {
              calculating
                ? (
                  <Skeleton
                    variant='text'
                    width={40}
                    sx={{ fontSize: '1rem' }}
                  />
                )
                : `£ ${priceInfo.sub_total} `
            }
          </div>
        </div>

        <div className="tax">
          <label> Tax ({TAX * 100}%) </label>
          <div className="result-value">
            {
              calculating
                ? (
                  <Skeleton
                    variant='text'
                    width={40}
                    sx={{ fontSize: '1rem' }}
                  />
                )
                : `£ ${priceInfo.tax_amount}`
            }
          </div>
        </div>

        <div className="shipping">
          <label> Est. Shipping </label>
          <div className="result-value">
            {
              calculating
                ? (
                  <Skeleton
                    variant='text'
                    width={40}
                    sx={{ fontSize: '1rem' }}
                  />
                )
                : `£ ${priceInfo.shipping_fee}`
            }
          </div>
        </div>

        <div className="grand-total">
          <label> <strong>Est. Total</strong> </label>
          <div className="result-value">
            <strong>
              {
                calculating
                  ? (
                    <Skeleton
                      variant='text'
                      width={100}
                      sx={{ fontSize: '1.5rem' }}
                    />
                  )
                  : `£ ${priceInfo.total_amount}`
              }
            </strong>
          </div>
        </div>

        <div className="checkout-button">
          <Link to="/checkout" >
            <RoundButton
              size='large'
              colorScheme='checkout'
              leftIcon={<BsBagCheck fontSize={22} />}
            >
              <b>Proceed Checkout</b>
            </RoundButton>
          </Link>
        </div>
      </div>
    </div>
  );
};