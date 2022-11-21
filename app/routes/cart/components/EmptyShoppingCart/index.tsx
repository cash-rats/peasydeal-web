
import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import Button from '@mui/material/Button';

import HorizontalProductsLayout from '~/routes/components/HorizontalProductsLayout';

import emptyCartSVG from './images/empty_cart.svg';
import styles from './styles/EmptyShoppingCart.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
}

function EmptyShoppingCartPage() {

  return (
    <section className="empty-cart-container">
      <div className="empty-cart-image">
        <img alt='nothing in the shopping cart' src={emptyCartSVG} />
      </div>

      <h1 className="empty-cart-title">
        Your cart is empty
      </h1>

      <p className="empty-cart-text">
        Looks like you have not added anything to your cart. Go find the product you like.
      </p>

      <div className="redirect-to-shopping">
        <Link to='/'>
          <Button
            color='success'
            variant='contained'
            size='large'
          >
            Go Shopping!
          </Button>
        </Link>
      </div>

      {/* Product Suggestion List */}

      {/* Recommended products */}
      <div className="Cart__rec-products">
        <h1 className="Cart__rec-title">
          top items
        </h1>

        <HorizontalProductsLayout catID={1} />
      </div>

      <div className="Cart__rec-products">
        <h1 className="Cart__rec-title">
          new trend
        </h1>

        <HorizontalProductsLayout catID={2} />
      </div>
    </section>
  );
};

export default EmptyShoppingCartPage;