import type { OrderItemFromAPI, OrderItem } from './types';

export const transformOrderDetail = (orderDetail: OrderItemFromAPI): Array<OrderItem> => {
  const transformedProds = Object.keys(orderDetail).reduce((prev: any, variationID) => {
    const prod = orderDetail[variationID];
    prev.push({
      product_uuid: prod.productUUID,
      variation_uuid: prod.variationUUID,
      quantity: Number(prod.quantity),
    });

    return prev;
  }, []);

  return transformedProds;
};


