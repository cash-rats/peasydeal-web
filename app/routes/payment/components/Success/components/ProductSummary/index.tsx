import { Fragment } from 'react';
import Divider from '@mui/material/Divider';

import type { OrderItem } from '../../types';

interface ProductSummaryProps {
  products: OrderItem[];
}

function ProductSummary({ products = [] }: ProductSummaryProps) {
  return (
    <div className="w-full mt-6">
      <h1 className="font-semibold text-[1.4rem]">
        Products Summary
      </h1>
      <div className="flex flex-col mt-3 font-medium">
        {
          products.map((product, idx) => {
            return (
              <Fragment key={product.product_variation_uuid}>
                <div className="flex flex-row my-3 mx-0">
                  <div className="flex-1 flex justify-start flex-col gap-[10px] font-poppins">
                    <label>
                      {product.order_quantity} X {product.title}
                    </label>
                    <p className="font-normal">
                      {product.spec_name}
                    </p>
                  </div>

                  <div className="flex-1 flex justify-end font-poppins">
                    ${product.sale_price}
                  </div>
                </div>
                {
                  // Don't display `Divider` when it reaches the last product element.
                  products.length - 1 !== idx && (<Divider />)
                }

              </Fragment>
            );
          })
        }

      </div>
    </div>
  );
}

export default ProductSummary;