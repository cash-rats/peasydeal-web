import { createContext, useReducer, useMemo } from 'react';
import produce from 'immer';

import type { Product } from '~/shared/types';

export interface InitState {
  products: Product[][];

  /*
   * We keep a different array for collection products "collection_products" needs to be reloaded
   * every time when user redirect to different category. If both index / $collection page uses the same array,
   * products on the index page will be wiped out and reloaded every time user clicks back to index ("/") page
   * and we don't want that.
   */
  collection_products: Product[][];
};

export const initState: InitState = {
  products: [],
  collection_products: []
}

const ADD_PRODUCTS = 'ADD_PRODUCTS';
const ADD_COLLECTION_PRODUCTS = 'ADD_COLLECTION_PRODUCTS';
const SET_COLLECTION_PRODUCTS = 'SET_COLLECTION_PRODUCTS';

export const actionTypes = { ADD_PRODUCTS };

export const reducer = produce((draft, action) => {
  switch (action.type) {
    case ADD_PRODUCTS:
      draft.products = draft.products.concat(action.payload.products);
      break;
    case SET_COLLECTION_PRODUCTS:
      draft.collection_products = action.payload.products;
      break;
    case ADD_COLLECTION_PRODUCTS:
      draft.collection_products = draft.collection_products.concat(action.payload.products);
      break;
  }
}, initState);

export const addProducts = (products: Product[][]) => {
  return {
    type: ADD_PRODUCTS,
    payload: { products },
  }
}

export const setCollectionProducts = (products: Product[][]) => {
  return {
    type: SET_COLLECTION_PRODUCTS,
    payload: { products },
  }
}

export const addCollectionProducts = (products: Product[][]) => {
  return {
    type: ADD_COLLECTION_PRODUCTS,
    payload: { products },
  }
}

export const ProductsContext = createContext(initState);

const ProductsStore = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const contextValue = useMemo(() => {
    return [state, dispatch]
  }, [state]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  )
};

export default ProductsStore;