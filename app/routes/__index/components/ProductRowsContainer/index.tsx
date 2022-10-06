import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import { OneMainTwoSubs, EvenRow } from "~/components/ProductRow";
import { links as OneMainTwoSubsLinks } from "~/components/ProductRow/OneMainTwoSubs";
import { links as EvenRowLinks } from '~/components/ProductRow/EvenRow';

import type { Product } from '~/shared/types';

export const links: LinksFunction = () => {
  return [
    ...OneMainTwoSubsLinks(),
    ...EvenRowLinks(),
  ];
};

interface ProductRowsContainerProps {
  handleClickProduct?: (prodID: string) => void;
  productRows?: Product[][];
}

function ProductRowsContainer({ handleClickProduct = () => { }, productRows = [] }: ProductRowsContainerProps) {
  return (
    <>
      {
        productRows.map((row: Product[], index: number): ReactNode => {
          // A complete row has 9 products.
          // A incomplete row contains less than 9 products
          //
          // To render `OneMainTwoSubs` layout properly, we need to have at least 3 products
          // To render `EvenRow` layout properly we need to have at least 6 products
          //
          // If a given row has less than 9 products, that means we've reached the last page.
          // Moreover, we might not have enough products to render both layouts.
          // we'll need to decided if we have enough products to render `OneMainTwoSubs` and `EvenRow`
          const shouldReverese = index % 2 !== 0;

          if (row.length === 9) {
            // We can rest assure that we have enough products to render both `OneMainTwoSubs` and `EvenRow`
            const oneMainTwoSubsProdData = row.slice(0, 3)
            const EvenRowProdData = row.slice(3)

            return (
              <Fragment key={index}>
                <div className="productRowsContainer_product-row">
                  <OneMainTwoSubs
                    reverse={shouldReverese}
                    products={oneMainTwoSubsProdData}
                    onClickProduct={handleClickProduct}
                  />
                </div>

                <div className="productRowsContainer_product-row">
                  <EvenRow
                    products={EvenRowProdData}
                    onClickProduct={handleClickProduct}
                  />
                </div>
              </Fragment>
            )
          } else {
            const oneMainTwoSubsProdData = row.slice(0, 3)

            if (oneMainTwoSubsProdData.length <= 3) {
              return (
                <div key={index} className="productRowsContainer_product-row">
                  <OneMainTwoSubs
                    reverse={shouldReverese}
                    products={oneMainTwoSubsProdData}
                    onClickProduct={handleClickProduct}
                  />
                </div>
              );
            }

            const EvenRowProdData = row.slice(3)

            return (
              <Fragment key={index}>
                <div className="productRowsContainer_product-row">
                  <OneMainTwoSubs
                    reverse={shouldReverese}
                    products={oneMainTwoSubsProdData}
                    onClickProduct={handleClickProduct}
                  />
                </div>

                <div className="productRowsContainer_product-row">
                  <EvenRow
                    products={EvenRowProdData}
                    onClickProduct={handleClickProduct}
                  />
                </div>
              </Fragment>
            );
          }
        })
      }
    </>
  );
}

export default ProductRowsContainer;