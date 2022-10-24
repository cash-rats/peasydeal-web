/*
  TODOs
    - [ ] order amount should be calculated and send from backend.
    - [ ] `client_secret` should be move to action.
    - [x] Redirect to successful page.
*/

import { Fragment, useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { LoaderFunction, LinksFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import {
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import Divider from '@mui/material/Divider';
import httpStatus from 'http-status-codes';

import { calcGrandTotal } from '~/utils/checkout_accountant';
import type { ApiErrorResponse } from '~/shared/types';
import { useErrorSnackbar } from '~/components/Snackbar';
import { getBrowserDomainUrl } from '~/utils/misc';
import { useContext } from '~/routes/checkout';
import { getCart } from '~/utils/shoppingcart.session';

import styles from './styles/Checkout.css';
import CheckoutForm, { links as CheckoutFormLinks } from './components/CheckoutForm';
import ShippingDetailForm, { links as ShippingDetailFormLinks } from './components/ShippingDetailForm';
import ContactInfoForm, { links as ContactInfoFormLinks } from './components/ContactInfoForm';
import type { ShippingDetailFormType, ContactInfoFormType } from './types';
import { transformOrderDetail } from './utils';
import { createOrder } from './api';

export const links: LinksFunction = () => {
  return [
    ...ShippingDetailFormLinks(),
    ...CheckoutFormLinks(),
    ...ContactInfoFormLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const cart = await getCart(request);

  if (!cart || Object.keys(cart).length === 0) {
    throw redirect("/cart");
  }

  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  const amount = Number(calcGrandTotal(cart).toFixed(2))

  return json({
    amount,
    cart_items: cart,
  });
};

type ActionPayload = {
  [k: string]: FormDataEntryValue;
  shipping_form: string,
  contact_info_form: string,
  cart_items: string,
  payment_secret: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());

  const {
    shipping_form: shippingForm,
    contact_info_form: contactInfoForm,
    cart_items: cartItems,
    payment_secret,
  } = formObj as ActionPayload;

  const shippingFormObj: ShippingDetailFormType = JSON.parse(shippingForm);
  const contactInfoFormObj: ContactInfoFormType = JSON.parse(contactInfoForm);
  const cartItemsObj = JSON.parse(cartItems);
  console.log('debug 3', cartItemsObj);
  const trfItemsObj = transformOrderDetail(cartItemsObj);

  console.log('debug 4', trfItemsObj);

  // return null;

  const resp = await createOrder({
    email: shippingFormObj.email,
    firstname: shippingFormObj.firstname,
    lastname: shippingFormObj.lastname,
    address1: shippingFormObj.address1,
    address2: shippingFormObj.address2,
    city: shippingFormObj.city,
    postal: shippingFormObj.postal,

    contact_name: contactInfoFormObj.contact_name,
    phone_value: contactInfoFormObj.phone_value,

    payment_secret,
    products: trfItemsObj,
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    return json(respJSON, httpStatus.OK);
  }

  return json(respJSON, httpStatus.OK);
};

function CheckoutPage() {
  const {
    amount,
    cart_items: cartItems,
  } = useLoaderData();
  const { paymentIntendID } = useContext();
  const element = useElements();
  const stripe = useStripe();

  const [openErrorSnackbar] = useErrorSnackbar();
  const createOrderFetcher = useFetcher();

  // Store orderUUID when is newly created. There might be an senario where shipping information is valid but not billing info.
  // When customer submit payment again, a new order will be created again. Thus, if orderID exists we should not create a new order again.
  const [orderUUID, setOrderUUID] = useState<string | null>();
  const [isPaying, setIsPaying] = useState(false);

  const [shippingDetailFormValues, setShippingDetailFormValues] = useState<ShippingDetailFormType>({
    email: '',
    lastname: '',
    firstname: '',
    address1: '',
    address2: '',
    postal: '',
    city: '',
  });

  const [contactInfoFormValues, setContactInfoFormValues] = useState<ContactInfoFormType>({
    country_data: {},
    phone_value: '',
    contact_name_same: true,
    contact_name: '',
  });


  const stripeConfirmPayment = async (orderUUID: string, elements: StripeElements, stripe: Stripe) => {
    setIsPaying(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${getBrowserDomainUrl()}/checkout/result?order_uuid=${orderUUID}`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        openErrorSnackbar(error.message);
      } else {
        openErrorSnackbar(`An unexpected error occurred. ${error.message}`);
      }
    }

    setIsPaying(false);
  }

  useEffect(
    () => {
      if (createOrderFetcher.type === 'done') {
        if (createOrderFetcher.data.err_code) {
          const errResp = createOrderFetcher.data as ApiErrorResponse;

          openErrorSnackbar(`Failed to create order, please try again later, error code: ${errResp.err_code}`);

          return;
        }

        // Order is created, confirm payment on stripe.
        if (!element || !stripe) return;

        const { order_uuid: orderUUID } = createOrderFetcher.data;
        setOrderUUID(orderUUID);

        stripeConfirmPayment(orderUUID, element, stripe);
      }
    },
    [createOrderFetcher, orderUUID]
  );

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const phoneField = evt.target.querySelector('#phone');

    if (
      !contactInfoFormValues.phone_value ||
      contactInfoFormValues.phone_value === contactInfoFormValues.country_data.dialCode
    ) {
      phoneField.setCustomValidity('Please fill out this field.');
      return;
    }

    // Submit forms to action, only create a new order if order hasn't been created yet.
    if (!orderUUID) {
      createOrderFetcher.submit({
        shipping_form: JSON.stringify(shippingDetailFormValues),
        contact_info_form: JSON.stringify(contactInfoFormValues),
        cart_items: JSON.stringify(cartItems),
        payment_secret: paymentIntendID,
      }, { method: 'post', action: '/checkout?index' });
      return;
    }

    if (!element || !stripe) return;

    stripeConfirmPayment(orderUUID, element, stripe);
  }

  return (
    <section className="checkout-page-container">
      <h1 className="title"> Shipping Information </h1>
      <div className="checkout-content">
        <div className="left">

          {/* You Details  */}
          <div className="form-container">

            {/* product summary TODO add edit link */}
            <div className="pricing-panel">
              <h1 className="form-title">
                Cart Summary
              </h1>

              <div className="product-tiles">
                {
                  Object.keys(cartItems).map((prodID: string): ReactElement => {
                    const cartItem = cartItems[prodID];
                    return (
                      <Fragment key={prodID}>
                        <div className="product-tile">
                          <div className="product-desc">
                            <h3>
                              {cartItem.title}
                            </h3>
                            <p>
                              {cartItem.subTitle}
                            </p>
                          </div>
                          <h2 className="product-price">
                            {cartItem.quantity} x ${cartItem.salePrice}
                          </h2>
                        </div>
                        <Divider />
                      </Fragment>
                    )
                  })
                }
              </div>

              {/* Subtotal */}
              <div className="subtotal">
                Total: &nbsp; <span>${amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          {/* Shipping Info */}

          <createOrderFetcher.Form
            onChange={(evt: FormEvent<HTMLFormElement>) => {
              let target = evt.target as HTMLInputElement;

              const fieldName = target.name;
              let fieldValue: string | boolean = target.value;

              if (target.type === 'checkbox') {
                fieldValue = target.checked;
              }

              if (shippingDetailFormValues.hasOwnProperty(fieldName)) {
                setShippingDetailFormValues(prev => ({
                  ...prev,
                  [fieldName]: fieldValue,
                }));
              }

            }}
            onSubmit={handleSubmit}
          >
            <div className="form-container">
              <h1 className="shipping-info-title">
                Shipping Details
              </h1>

              <div className="pricing-panel">
                <div className="shipping-form-container">
                  <ShippingDetailForm
                    values={shippingDetailFormValues}
                  />
                </div>
              </div>

            </div >


            {/* Contact information */}
            <div className="form-container">
              <h1 className="title">
                Contact Information
              </h1>

              <div className="pricing-panel">
                <div className="shipping-form-container">
                  <ContactInfoForm
                    values={contactInfoFormValues}
                    onChange={setContactInfoFormValues}
                  />
                </div>
              </div>
            </div>

            <div className='form-container'>
              <h3 className="title">
                Payment Information
              </h3>
              {/* You Details  */}
              <div className="pricing-panel">
                <div className="payment-form-container">
                  {
                    // When create order action is triggered in `CheckoutForm`, current loader will be triggered to realod client secret causing display of the warning.
                    // The following is a temperary solution.
                    // @docs https://stackoverflow.com/questions/70864433/integration-of-stripe-paymentelement-warning-unsupported-prop-change-options-c
                    <CheckoutForm loading={createOrderFetcher.state !== 'idle' || isPaying}
                    />
                  }
                </div>
              </div>
            </div>
          </createOrderFetcher.Form>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;
