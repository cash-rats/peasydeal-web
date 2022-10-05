import type { OrderItemFromAPI, OrderItem } from './types';

export const transformOrderDetail = (orderDetail: OrderItemFromAPI): Array<OrderItem> => {
  const transformedProds = Object.keys(orderDetail).reduce((prev: any, prodID) => {
    const prod = orderDetail[prodID];
    prev.push({
      product_uuid: prodID,
      variation_uuid: prod.variationID,
      quantity: Number(prod.quantity),
    });

    return prev;
  }, []);

  return transformedProds;
};