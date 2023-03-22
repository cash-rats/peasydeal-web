import type * as Contentful from 'contentful';

export type Variation = {
  uuid: string;
  spec_name: string;
  purchase_limit: number;
  sku: string;
}

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
  createdAt: string;
  subtitle: string;
  variations?: Variation[];
  variationID: string;
  tabComboType: string | null;
};

export type TCategoryPreview = {
  name: string;
  label: string;
  desc: string;
  items: Product[];
  type: CategoryType;
}

export type TPromotionType = {
  name: string;
  label: string;
  desc: string;
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
};

export type ApiErrorResponse = {
  err_code: string;
  err_message: string;
};

export type Category = {
  catId: string | number;
  title: string;
  description: string;
  name: string;
  url?: string;
  show?: boolean;
  type: string;
  children: Category[];
};

export type TaxonomyWithParents = Category & {
  parents: Category[];
  children: Category[];
}

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

export type TSeoReference = {
  fields: {
    SEOdescription: string;
    SEOtitle: string;
    canonicalUrl: string;
    ogImage: Contentful.Asset;
    ogType: string;
    seoFollow: boolean;
    seoIndex: boolean;
  }
}

export type TContentfulPost = {
  body: Contentful.EntryFields.RichText;
  featuredImage: Contentful.Asset;
  introText: Contentful.EntryFields.RichText;
  metatdata: Array<string>;
  postName: string;
  publishedDate: string;
  seoReference: TSeoReference,
  seoTitle: string;
  slug: string;
  attributes: any;
}

export enum CategoryType {
  promotion = "promotion",
  category = "category",
  taxonomy_category = "taxonomy_category",
};