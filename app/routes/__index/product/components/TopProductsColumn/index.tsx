import type { LinksFunction } from '@remix-run/node';

import styles from './styles/TopProductsColumn.css';
import RoundButton, { links as RoundButtonLinks } from '~/components/RoundButton';

export const links: LinksFunction = () => {
  return [
    ...RoundButtonLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

export default function TopProductsColumn() {
  return (
    <div className="TopProductsColumn__wrapper">
      <div className="TopProductsColumn__banner">
        <p className="TopProductsColumn__banner-text">
          Personalised Auto-Rotating Cordless Hair Curler
        </p>

        <RoundButton
          style={{
            width: '140px'
          }}
          colorScheme='cerise'
        >
          View
        </RoundButton  >
      </div>

      <div className="TopProductsColumn__banner-wrapper">
        <h2 className="TopProductsColumn__banner-wrapper-title">
          top products
          <span className="TopProductsColumn__banner-wrapper-border" />
        </h2>

        <div className="TopProductsColumn-grid-wrapper">
          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/IMG_8917-copy.jpg?v=1606378690"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                Chubby Blob Seal Pillow
              </p>
            </div>
          </div>

          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/H9a7a1bc057eb47b49191facc0616a0c2C.jpg?v=1594998061"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                22 LED makeup mirror
              </p>
            </div>
          </div>

          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/O1CN01Co4Agq2Lj1FK3yzA9__2210981359727-0-cib.jpg?v=1636598420"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                Personalised 3D Throw Face Pillow
              </p>
            </div>
          </div>

          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/O1CN01Co4Agq2Lj1FK3yzA9__2210981359727-0-cib.jpg?v=1636598420"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                Personalised 3D Throw Face Pillow
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="TopProductsColumn__banner-wrapper">
        <h2 className="TopProductsColumn__banner-wrapper-title">
          you may also like
          <span className="TopProductsColumn__banner-wrapper-border" />
        </h2>

        <div className="TopProductsColumn-grid-wrapper">
          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/IMG_8917-copy.jpg?v=1606378690"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                Men's Cozy Linen Henley Shirt
              </p>
            </div>
          </div>

          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/H9a7a1bc057eb47b49191facc0616a0c2C.jpg?v=1594998061"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                Personalized Moon Lamp - Photo & Text Option
              </p>
            </div>
          </div>

          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/O1CN01Co4Agq2Lj1FK3yzA9__2210981359727-0-cib.jpg?v=1636598420"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                24pcs Ceramic Handle
                Stainless Steel
                Cutlery Set

              </p>
            </div>
          </div>

          <div className="TopProductsColumn-grid">
            <div className="TopProductsColumn-grid-left">
              <img
                alt='recommend product'
                src="https://cdn.shopify.com/s/files/1/0257/7327/7233/products/O1CN01Co4Agq2Lj1FK3yzA9__2210981359727-0-cib.jpg?v=1636598420"
              />
            </div>

            <div className="TopProductsColumn-grid-right">
              <p>
                Cloud Shape Rug
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}