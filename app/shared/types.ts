export type Product = {
  productUUID: string;
  currency: string;
  description: string;
  discount: number;
  main_pic: string;
  retailPrice: number;
  salePrice: number;
  shortDescription: string;
  sku?: string;
  title: string;
  subtitle: string;
  variationID: string;
  tabComboType: string | null;
};

// Shopping cart item stored in session or from API.
export type CartItem = {
  image: string;
  productID: string;
  quantity: string | number;
  retailPrice: string | number;
  salePrice: string | number;
  subTitle: string;
  title: string;
  variationID: string;
};

export type ApiErrorResponse = {
  err_code: string;
  err_message: string;
};

export type Category = {
  catId: string | number;
  title: string;
  name: string;
  url?: string;
  show?: boolean;
};

export type CategoriesMap = {
  [key: string]: Category;
};


export type ItemData = {
  title: string;
  image: string;
  discount: number;
  productID: string;
};

export type SuggestItem = {
  title: string;
  data: ItemData;
};

export type PaymentMethod = 'paypal' | 'stripe';