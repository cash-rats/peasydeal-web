// Validates phone input value and writes any validation message to the input element.
// Returns true when valid, false otherwise.
import type { OrderItemFromAPI, OrderItem } from './types';

export const validatePhoneInput = (input: HTMLInputElement | null): boolean => {
  if (!input) return true;

  input.setCustomValidity('');

  const rawPhone = input.value;
  const phone = rawPhone.replace(/\s+/g, '');

  const phoneIsNum = /^\+?[0-9]+$/.test(phone);
  if (!phoneIsNum) {
    input.setCustomValidity('Phone must contain only numbers');
    input.reportValidity();
    return false;
  }

  if (phone.length <= 3) {
    input.setCustomValidity('The phone number seems too short.');
    input.reportValidity();
    return false;
  }

  return true;
};

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
