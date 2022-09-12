// TODO: TAX and shipping fee are fake data.

/*
 * Calculate subtotal to the list of the items in the shopping cart.
 */
export const calcSubTotal = (items): number => {
  return Object.keys(items).reduce((prev, prodID) => {
    const item = items[prodID];
    return prev + (item.salePrice * item.quantity);
  }, 0);
};

export const TAX = 0.2;
export const SHIPPING_FEE = 20;

export const calcPriceWithTax = (price: number) => price * (1 + TAX);

export const calcPriceWithShippingFee = (price: number) => price + SHIPPING_FEE;

/*
 * Calculate grand total of this order.
 */
export const calcGrandTotal = (items): number => calcPriceWithTax(calcSubTotal(items)) + SHIPPING_FEE;