import { Fragment } from 'react';
import Divider from '@mui/material/Divider';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/ProductSummary.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ProductSummaryProps {
  products: any[];
}

function ProductSummary({ products = [] }: ProductSummaryProps) {
  return (
    <div className="product-summary-container">
      <h1>
        Products Summary
      </h1>
      <div className="product-content">
        {
          products.map((product) => {
            return (
              <Fragment key={product.product_variation_uuid}>
                <div className="product-row">
                  <div className="left">
                    <label>
                      {product.order_quantity} X {product.title}
                    </label>
                    <p>
                      {product.spec_name}
                    </p>
                  </div>

                  <div className="right">
                    ${product.sale_price}
                  </div>
                </div>
                <Divider />
              </Fragment>
            );
          })
        }

      </div>
    </div>
  );
}

export default ProductSummary;