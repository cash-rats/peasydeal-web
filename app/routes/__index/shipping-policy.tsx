import type { LinksFunction } from '@remix-run/node';

import styles from './styles/StaticPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function ShippingPolicy() {
  return (
    <div className="StaticPage-page">
      <h1 className="StaticPage-title">Shipping Policy</h1>

      <h2 className="StaticPage-subtitle">General Information</h2>
      <p className="StaticPage-content">
        All orders are subject to product availability. If an item is not in stock at the time you place your order, we will notify you and refund you the total amount of your order, using the original method of payment.
      </p>

      <h2 className="StaticPage-subtitle">Delivery Location</h2>
      <p className="StaticPage-content">
        Items offered on peasydeal.com website are available for delivery to addresses in IT, FR, UK, IE, U.S.A., CA, MX, ES, DE, SE, PL, SG. We also accept orders from international customers who are shipping to addresses in the whole world. Any shipments out of our shipping locations are not available at this time and we will notify you with email and refund you the total amount of your order, using the original method of payment.
      </p>

      <h2 className="StaticPage-subtitle">Delivery Time</h2>
      <p className="StaticPage-content">
        An estimated delivery time will be provided to you once your order is placed. Delivery times are estimates and commence from the date of shipping, rather than the date of order. Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order.

        Unless there are exceptional circumstances, we make every effort to fulfill your order within [12] business days of the date of your order. Business day mean Monday to Friday, except holidays.

        Please note we do not ship on [Weekend & Public Holidays].



        Date of delivery may vary due to carrier shipping practices, delivery location, method of delivery and the items ordered. Products may also be delivered in separate shipments.
      </p>


      <h2 className="StaticPage-subtitle">
        Note: If you are in hurry, you can order by express shipment. It may short down about 3~4 delivery days.
        Delivery Instructions
      </h2>
      <p className="StaticPage-content">
        Standard Shipment: 7~9 business days
        Express Shipment: 4~5 business days
        (Note: above are only for delivery time, you need to add about 2~3 days for producing your special design product.)
      </p>

      <h2 className="StaticPage-subtitle">
        Shipping Costs
      </h2>
      <p className="StaticPage-content">

        Shipping costs are based on the weight of your order and the delivery method. To find out how much your order will cost, simple add the items you would like to purchase to your cart and proceed to the checkout page. Once at the checkout screen, shipping charges will be displayed.

        Additional shipping charges may apply to remote areas or for large or heavy items. You will be advised of any charges on the checkout page.

        Sales tax is charged according to the province or territory to which the item is shipped.
      </p>

      <h2 className="StaticPage-subtitle">
        Damaged Items in Transport
      </h2>

      <p className="StaticPage-content">

        If there is any package is damaged during shipping, please remember to take a video/ photo before you open the parcel and contact us immediately at contact@peasydeal.com

        .
      </p>

      <h2 className="StaticPage-subtitle">

        More Questions
      </h2>

      <p className="StaticPage-content">

        If you have any questions about the delivery and shipment or your order, please contact us at <b>contact@peasydeal.com.</b>
      </p>
    </div>
  );
}