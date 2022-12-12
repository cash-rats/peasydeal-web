import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';
import type { ScrollPosition } from 'react-lazy-load-image-component';

import { OneMainTwoSubs, EvenRow } from "~/components/ProductRow";
import { links as OneMainTwoSubsLinks } from "~/components/ProductRow/OneMainTwoSubs";
import { links as EvenRowLinks } from '~/components/ProductRow/EvenRow';
import ActivityBannerLayout, { links as ActivityBannerLayoutLinks } from '~/components/ActivityBannerLayout';
import type { Product } from '~/shared/types';
import type { SeasonalInfo } from "~/components/SeasonalColumnLayout/SeasonalColumnLayout";
import ActivityColumnLayout, { links as ActivityColumnLayoutLinks } from "~/components/SeasonalColumnLayout/SeasonalColumnLayout";

import type { ActivityBanner } from '../../types';
import styles from './styles/ProductRowsContainer.css';

export const links: LinksFunction = () => {
  return [
    ...OneMainTwoSubsLinks(),
    ...EvenRowLinks(),
    ...ActivityBannerLayoutLinks(),
    ...ActivityColumnLayoutLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};


const LoadingRows = () => {
  return (
    <>
      <div className="productRowsContainer__product-row">
        <OneMainTwoSubs loading />
      </div>

      <div className="productRowsContainer__product-row">
        <EvenRow loading />
      </div>
    </>
  );
}


interface RealRowsProps {
  productRows?: Product[][];
  activityBanners?: ActivityBanner[];
  seasonals?: SeasonalInfo[];
  scrollPosition?: ScrollPosition;
  onClickProduct?: (prodID: string) => void;
}

const RealRows = ({
  productRows = [],
  activityBanners = [],
  seasonals = [],
  scrollPosition,
  onClickProduct = () => { },
}: RealRowsProps) => {
  return (
    <>
      {
        productRows.map((row: Product[], index: number): ReactNode => {
          // For every set of row "even row" + "1 main 2 sub" a subsequent activity banner would
          // be rendered.
          // There should only 4 banners to show in `activityBanners` array.
          // thus, pop activity banner out of the array when `index` is <= 3
          let banner: ActivityBanner | null = null;

          if (index <= 2 && activityBanners[index]) {
            banner = activityBanners[index];
          }

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


          // Render seasonal items on the first `ProductRowsContainer__row-wrapper`.

          if (row.length === 9) {
            // We can rest assure that we have enough products to render both `OneMainTwoSubs` and `EvenRow`
            const oneMainTwoSubsProdData = row.slice(0, 3)
            const EvenRowProdData = row.slice(3)

            return (
              <div
                key={index}
                className="ProductRowsContainer__row-wrapper"
              >
                {
                  index === 0
                    ? (
                      <div className="ProductRowsContainer__row-wrapper__left-seasonal-wrapper">
                        <ActivityColumnLayout seasonals={seasonals.slice(0, 2)} />
                      </div>
                    )
                    : <div />
                }
                <div className="productRowsContainer__product-row-set">
                  <div className="productRowsContainer__product-row">
                    <OneMainTwoSubs
                      reverse={shouldReverese}
                      products={oneMainTwoSubsProdData}
                      onClickProduct={onClickProduct}
                      scrollPosition={scrollPosition}
                    />

                  </div>

                  <div className="productRowsContainer__product-row">
                    <EvenRow
                      products={EvenRowProdData}
                      onClickProduct={onClickProduct}
                      scrollPosition={scrollPosition}
                    />
                  </div>

                  {
                    banner
                      ? (
                        <div style={{
                          backgroundImage: `linear-gradient(to bottom, transparent 60%, black 120%), url(${banner.banner_url})`,
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                        }} className="ProductRowsContainer__activity-banner-wrapper">
                          <ActivityBannerLayout
                            scrollPosition={scrollPosition}
                            activityInfo={{
                              title: banner.title,
                              catID: banner.cat_id,
                              catTitle: banner.cat_title,
                            }}
                            activityProds={banner.items}
                          />
                        </div>
                      )
                      : null
                  }
                </div>

                {
                  index === 0
                    ? (
                      <div className="ProductRowsContainer__row-wrapper__right-seasonal-wrapper">
                        <ActivityColumnLayout seasonals={seasonals.slice(2)} />
                      </div>
                    )
                    : <div />
                }
              </div>
            )
          } else {
            const oneMainTwoSubsProdData = row.slice(0, 3)

            if (oneMainTwoSubsProdData.length < 3) {
              return (
                <div className="ProductRowsContainer__row-wrapper">
                  <div key={index} className="productRowsContainer__product-row-set">
                    <div className="productRowsContainer__product-row">
                      <OneMainTwoSubs
                        reverse={shouldReverese}
                        products={oneMainTwoSubsProdData}
                        onClickProduct={onClickProduct}
                        scrollPosition={scrollPosition}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            const evenRowProdData = row.slice(3)

            return (
              <div
                key={index}
                className="ProductRowsContainer__row-wrapper"
              >

                <div className="productRowsContainer__product-row-set">
                  <div className="productRowsContainer__product-row">
                    <OneMainTwoSubs
                      reverse={shouldReverese}
                      products={oneMainTwoSubsProdData}
                      onClickProduct={onClickProduct}
                      scrollPosition={scrollPosition}
                    />
                  </div>

                  <div className="productRowsContainer__product-row">
                    <EvenRow
                      products={evenRowProdData}
                      onClickProduct={onClickProduct}
                      scrollPosition={scrollPosition}
                    />
                  </div>
                </div>
              </div>
            );
          }
        })
      }
    </>
  )
}

interface ProductRowsContainerProps {
  onClickProduct?: (prodID: string) => void;
  productRows?: Product[][];
  activityBanners?: ActivityBanner[];
  seasonals?: SeasonalInfo[];
  loading?: boolean;

  // Used to improve performance for react-lazy-load-image-component
  scrollPosition?: ScrollPosition;

  onClickAddToCart?: (prodID: string) => void;

  // Reacts shopnow button in activity banner.
  onClickShopNow?: (catID: number, catTitle: string) => void;
}

function ProductRowsContainer({
  onClickProduct = () => { },
  productRows = [],
  activityBanners = [],
  seasonals = [],

  loading = false,
  scrollPosition,

  onClickAddToCart = () => { },
}: ProductRowsContainerProps) {
  return (
    <div className="productRowsContainer__wrapper">
      {
        loading
          ? (<LoadingRows />)
          : (
            <RealRows
              scrollPosition={scrollPosition}
              productRows={productRows}
              activityBanners={activityBanners}
              seasonals={seasonals}
              onClickProduct={onClickProduct}
            />
          )
      }
    </div>
  );
}

export default ProductRowsContainer;