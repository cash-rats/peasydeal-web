import type { LinksFunction, MetaFunction } from '@remix-run/node';

import { getReturnPolicyFBSEO } from '~/utils/seo';

import styles from './styles/StaticPage.css';

export const meta: MetaFunction = () => {
  return { ...getReturnPolicyFBSEO() };
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function ReturnPolicy() {
  return (
    <div className="StaticPage-page">
      <h1 className="StaticPage-title"> Returns & Refund </h1>

      <p className="StaticPage-content">
        <b>Personalised Products – No Refunds/Exchanges for reason"change mind", "no need anymore", "want to change the colour (after the product is already done"...etc.</b> <br />

        We do not accept returns or exchanges unless the item you purchased is defective. Please take a video before you open the parcel. If you receive a defective item, please contact us at contactus@topersonalised.com with details of the product and the defect. (Note: please provide images, it would help us solve the problem more faster.) Customer Service will also direct you, if you don't know what to do.

        Upon receipt of the returned product, we will fully examine it and notify you via e-mail, within a reasonable period of time, whether you are entitled to a refund or a replacement as a result of the defect. If you are entitled to a replacement or refund, we will replace the product or refund the purchase price, using the original method of payment.
      </p>

      <h1 className="StaticPage-subtitle">Exceptions</h1>

      <p className="StaticPage-content">
        Some items are non-refundable and non-exchangeable. These include: disposable products, damaged by user behavior
      </p>

      <h1 className="StaticPage-subtitle">Shipping</h1>

      <p className="StaticPage-content">

        To return the item you purchased, please mail it to: contactus@topersonalised.com

        Refunds do not include any shipping and handling charges shown on the packaging slip or invoice. Shipping charges for all returns must be prepaid and insured by you. You are responsible for any loss or damage to hardware during shipment. We do not guarantee that we will receive your returned item. Shipping and handling charges are not refundable. Any amounts refunded will not include the cost of shipping.
      </p>
    </div>
  );
}