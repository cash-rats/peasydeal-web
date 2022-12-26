import { expect } from 'vitest';

import { transformOrderDetail } from './utils';

const cartItems =
{
  "32023502782513": {
    "__action": "buy_now",
    "salePrice": "12.99",
    "retailPrice": "34.99",
    "productUUID": "4637162209329",
    "variationUUID": "32023502782513",
    "image": "https://cdn.shopify.com/s/files/1/0257/7327/7233/products/product-image-1384401897.jpg?v=1590054682",
    "quantity": "1",
    "title": "Key Lock Box Wall Mounted Aluminum alloy Key Safe Box Weatherproof 4 Digit Combination Key Storage Lock Box",
    "specName": "Black",
    "purchaseLimit": "10"
  },
  "43305781100782": {
    "__action": "buy_now",
    "salePrice": "9.99",
    "retailPrice": "25.99",
    "productUUID": "7846175932654",
    "variationUUID": "43305781100782",
    "image": "https://cdn.shopify.com/s/files/1/0617/2498/3534/products/517ldqBhHrS._AC_SL1000.jpg?v=1658828692",
    "quantity": "1",
    "title": "French Fry Fast Food Plastic Holders",
    "specName": "Holders",
    "purchaseLimit": "10"
  },
  "42686055645410": {
    "__action": "add_item_to_cart",
    "salePrice": "10.99",
    "retailPrice": "27.99",
    "productUUID": "7673887391970",
    "variationUUID": "42686055645410",
    "image": "https://cdn.shopify.com/s/files/1/0614/4344/0866/products/0f08130f90c8ebb6270e2971b7265812.jpg?v=1649410496",
    "quantity": "1",
    "title": "Men's Cozy Linen Henley Shirt",
    "specName": "Blue / L",
    "purchaseLimit": "10"
  },
  "42686055678178": {
    "__action": "add_item_to_cart",
    "salePrice": "10.99",
    "retailPrice": "27.99",
    "productUUID": "7673887391970",
    "variationUUID": "42686055678178",
    "image": "https://cdn.shopify.com/s/files/1/0614/4344/0866/products/0f08130f90c8ebb6270e2971b7265812.jpg?v=1649410496",
    "quantity": "1",
    "title": "Men's Cozy Linen Henley Shirt",
    "specName": "Blue / XL",
    "purchaseLimit": "10"
  },
  "42686055710946": {
    "__action": "add_item_to_cart",
    "salePrice": "10.99",
    "retailPrice": "27.99",
    "productUUID": "7673887391970",
    "variationUUID": "42686055710946",
    "image": "https://cdn.shopify.com/s/files/1/0614/4344/0866/products/0f08130f90c8ebb6270e2971b7265812.jpg?v=1649410496",
    "quantity": "1",
    "title": "Men's Cozy Linen Henley Shirt",
    "specName": "Blue / 2XL",
    "purchaseLimit": "10"
  }
}

describe('checkout utils function', () => {
  test('transform OrderItemFromAPI to OrderItem', () => {
    const itemsForApi = transformOrderDetail(cartItems);
    expect(itemsForApi.length).toBe(5)
    const sameProdCount = itemsForApi.reduce((accu, curr) => {
      if (curr.product_uuid === '7673887391970') {
        accu += 1;
      }
      return accu;
    }, 0)
    expect(sameProdCount).toBe(3);
  })
});