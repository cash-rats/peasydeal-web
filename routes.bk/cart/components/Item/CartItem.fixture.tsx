import CartItem from './index';

export default {
  CartItemWithPromoCode: (
    <CartItem
      item={{
        variationUUID: 'somevar',
        image: 'https://storage.googleapis.com/peasydeal/webp/w274_h274/0002b23c5a0147e3b67a5116c299fa.webp',
        title: 'someitem',
        description: 'somespec',
        salePrice: 100,
        retailPrice: 200,
        quantity: 2,
        purchaseLimit: 10,
        discountReason: "Extra 10% off",
      }}
    />
  ),
}