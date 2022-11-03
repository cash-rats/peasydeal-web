import { createContext, useReducer, useMemo } from 'react';
import produce from 'immer';

import type { Product } from '~/shared/types';

import { organizeTo9ProdsPerRow } from '~/routes/__index/utils';

type Category = string;

type CollectionProducts = {
  [key: Category]: Product[];
};

type CollectionProductsRows = {
  [key: Category]: Product[][];
};

export interface InitState {
  products: Product[];
  product_rows: Product[][];

  /*
   * We keep a different array for collection products "collection_products" needs to be reloaded
   * every time when user redirect to different category. If both index / $collection page uses the same array,
   * products on the index page will be wiped out and reloaded every time user clicks back to index ("/") page
   * and we don't want that.
   */
  collection_products: CollectionProducts;
  collection_products_rows: CollectionProductsRows;
};

export const initState: InitState = {
  products: [],
  product_rows: [],

  collection_products: {},
  collection_products_rows: {},
}

const ADD_PRODUCTS = 'ADD_PRODUCTS';
const ADD_COLLECTION_PRODUCTS = 'ADD_COLLECTION_PRODUCTS';
const SET_COLLECTION_PRODUCTS = 'SET_COLLECTION_PRODUCTS';

export const actionTypes = { ADD_PRODUCTS };

export const addProducts = (products: Product[]) => {
  return {
    type: ADD_PRODUCTS,
    payload: { products },
  }
}

export const setCollectionProducts = (products: Product[], category: string) => {
  return {
    type: SET_COLLECTION_PRODUCTS,
    payload: { products, category },
  }
}

export const addCollectionProducts = (products: Product[], category: string) => {
  return {
    type: ADD_COLLECTION_PRODUCTS,
    payload: { products, category },
  }
}

export const reducer = produce((draft, action) => {
  switch (action.type) {
    case ADD_PRODUCTS:
      draft.products = draft.products.concat(action.payload.products);
      draft.product_rows = draft.product_rows.concat(organizeTo9ProdsPerRow(action.payload.products));
      break;
    case SET_COLLECTION_PRODUCTS: {
      const { products, category } = action.payload;

      draft.collection_products[category] = products;
      draft.collection_products_rows[category] = organizeTo9ProdsPerRow(products);
    }
      break;
    case ADD_COLLECTION_PRODUCTS: {
      const { products, category } = action.payload;

      if (!draft.collection_products[category]) {
        draft.collection_products[category] = [];
      }

      draft.collection_products[category] = draft.collection_products[category].concat(products);

      if (!draft.collection_products_rows[category]) {
        draft.collection_products_rows[category] = [];
      }
      draft.collection_products_rows[category] = draft.collection_products_rows[category].concat(organizeTo9ProdsPerRow(products));
      break;
    }
  }
}, initState);

export const selectAllCollectionRows = (state) => state.collection_products_rows;
export const selectCollectionProductRows = (state, category: string) => state.collection_products_rows[category] || [];


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