export type Product = {
  productID: string
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
}

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
}