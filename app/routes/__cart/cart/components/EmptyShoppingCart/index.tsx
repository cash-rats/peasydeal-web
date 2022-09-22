
import type { LinksFunction } from '@remix-run/node';
import { Link, PrefetchPageLinks } from '@remix-run/react';
import Button from '@mui/material/Button';

import emptyCartSVG from './images/empty_cart.svg';
import styles from './styles/EmptyShoppingCart.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
}

function EmptyShoppingCartPage() {
  return (
    <section className="empty-cart-container">
      <PrefetchPageLinks page="/" />
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
          <Button variant='contained' size='large'>
            Go Shopping!
          </Button>
        </Link>
      </div>

      {/* Product Suggestion List */}
    </section>
  );
};

export default EmptyShoppingCartPage;