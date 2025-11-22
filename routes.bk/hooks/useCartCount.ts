import { useCartContext } from './cartContext';

export const useCartCount = (): number => {
  const { cartCount } = useCartContext();
  return cartCount;
};

