import { Package } from 'lucide-react';

import type { OrderItem } from '~/routes/payment/types';
import { round10 } from '~/utils/preciseRound';

interface ProductSummaryProps {
  products: OrderItem[];
}

function ProductSummary({ products = [] }: ProductSummaryProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
        Items in your order
      </h3>

      <ul className="divide-y divide-border">
        {products.map((product) => {
          const subtitle = product.spec_name?.trim() || product.subtitle?.trim() || 'Default Title';

          return (
            <li key={product.product_variation_uuid} className="flex items-start gap-4 py-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40 text-muted-foreground">
                <Package className="h-5 w-5" aria-hidden />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4 text-sm font-medium text-foreground">
                  <h4 className="truncate">
                    {product.title}
                  </h4>
                  <p className="shrink-0">
                    ${round10(product.sale_price, -2).toFixed(2)}
                  </p>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {subtitle}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Qty: {product.order_quantity}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProductSummary;
