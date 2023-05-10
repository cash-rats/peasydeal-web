import { Link } from '@remix-run/react';
import Button from '@mui/material/Button';

import emptyCartSVG from './images/empty_cart.svg';

function EmptyShoppingCartPage() {

  return (
    <section className="max-w-[1180px] m-h-[40rem] my-0 mx-auto pb-9 pt-4">
      <div className="flex justify-center">
        <img
          className="h-56 w-56"
          alt='nothing in the shopping cart'
          src={emptyCartSVG}
        />
      </div>

      <h1 className="font-poppins mt-5 font-medium text-2xl text-center">
        Your cart is empty
      </h1>

      <p className="font-poppin mt-5 text-center text-xl">
        Looks like you have not added anything to your cart. Go find the product you like.
      </p>

      <div className="mt-5 text-center">
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
    </section>
  );
};

export default EmptyShoppingCartPage;