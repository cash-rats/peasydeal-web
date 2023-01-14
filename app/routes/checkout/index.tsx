import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { LoaderFunction, LinksFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import {
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import httpStatus from 'http-status-codes';
import Alert from '@mui/material/Alert';

import type { ApiErrorResponse } from '~/shared/types';
import type { PriceInfo } from '~/shared/cart';
import { getBrowserDomainUrl } from '~/utils/misc';
import { useContext } from '~/routes/checkout';
import { getCart } from '~/sessions/shoppingcart.session';
import type { ShoppingCart } from '~/sessions/shoppingcart.session';

import styles from './styles/Checkout.css';
import CheckoutForm, { links as CheckoutFormLinks } from './components/CheckoutForm';
import ShippingDetailForm, { links as ShippingDetailFormLinks } from './components/ShippingDetailForm';
import type { Option } from './components/ShippingDetailForm/api.server';
import ContactInfoForm, { links as ContactInfoFormLinks } from './components/ContactInfoForm';
import type { ShippingDetailFormType, ContactInfoFormType } from './types';
import { transformOrderDetail } from './utils';
import { createOrder } from './api';
import CartSummary from './components/CartSummary';

export const links: LinksFunction = () => {
  return [
    ...ShippingDetailFormLinks(),
    ...CheckoutFormLinks(),
    ...ContactInfoFormLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

type LoaderType = {
  cart_items: ShoppingCart;
}

export const loader: LoaderFunction = async ({ request }) => {
  const cart = await getCart(request);

  if (!cart || Object.keys(cart).length === 0) {
    throw redirect("/cart");
  }

  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  return json<LoaderType>({ cart_items: cart });
};

type ActionPayload = {
  [k: string]: FormDataEntryValue;
  shipping_form: string;
  contact_info_form: string;
  cart_items: string,
  payment_secret: string;
  price_info: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());

  const {
    shipping_form: shippingForm,
    contact_info_form: contactInfoForm,
    cart_items: cartItems,
    price_info: priceInfo,
    payment_secret,
  } = formObj as ActionPayload;

  const shippingFormObj: ShippingDetailFormType = JSON.parse(shippingForm);
  const contactInfoFormObj: ContactInfoFormType = JSON.parse(contactInfoForm);
  const priceInfoObj: PriceInfo = JSON.parse(priceInfo);
  const cartItemsObj = JSON.parse(cartItems);
  const trfItemsObj = transformOrderDetail(cartItemsObj);

  const resp = await createOrder({
    firstname: shippingFormObj.firstname,
    lastname: shippingFormObj.lastname,
    address1: shippingFormObj.address1,
    address2: shippingFormObj.address2,
    city: shippingFormObj.city,
    postal: shippingFormObj.postal,

    email: contactInfoFormObj.email,
    contact_name: contactInfoFormObj.contact_name,
    phone_value: contactInfoFormObj.phone_value,
    payment_secret,

    products: trfItemsObj,
    price_info: priceInfoObj,
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    return json(respJSON, httpStatus.OK);
  }

  return json(respJSON, httpStatus.OK);
};

/*

  TODOs
    - [ ] order amount should be calculated and send from backend.
    - [ ] `client_secret` should be move to action.
    - [ ] Add edit cart
    - [x] Redirect to successful page.
    - [x] Fix error snackbar.
    - [ ] add search bar header
*/
function CheckoutPage() {
  const { cart_items: cartItems } = useLoaderData<LoaderType>();
  const { paymentIntendID, priceInfo } = useContext();

  const element = useElements();
  const stripe = useStripe();

  const createOrderFetcher = useFetcher();

  // Store orderUUID when is newly created. There might be an senario where shipping information is valid but not billing info.
  // When customer submit payment again, a new order will be created again. Thus, if orderID exists we should not create a new order again.
  const [orderUUID, setOrderUUID] = useState<string | null>();
  const [isPaying, setIsPaying] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');

  const [shippingDetailFormValues, setShippingDetailFormValues] = useState<ShippingDetailFormType>({
    lastname: '',
    firstname: '',
    address1: '',
    address2: '',
    postal: '',
    city: '',
  });

  const [contactInfoFormValues, setContactInfoFormValues] = useState<ContactInfoFormType>({
    email: '',
    country_data: {},
    phone_value: '',
    contact_name_same: true,
    contact_name: '',
  });


  const stripeConfirmPayment = async (orderUUID: string, elements: StripeElements, stripe: Stripe) => {
    setIsPaying(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${getBrowserDomainUrl()}/payment/${orderUUID}`,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        throw new Error(error.message);
      } else {
        // TODO log to remote API if error happens
        throw new Error(`An unexpected error occurred. ${error.message}`);
      }

    } catch (error: any) {
      setErrorAlert(`An unexpected error occurred. ${error.message}`);
    } finally {
      setIsPaying(false);
    }
  }

  useEffect(
    () => {
      if (createOrderFetcher.type === 'done') {
        if (createOrderFetcher.data.err_code) {
          const errResp = createOrderFetcher.data as ApiErrorResponse;

          setErrorAlert(`Failed to create order, please try again later, error code: ${errResp.err_code}`);

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

    if (contactInfoFormValues.contact_name_same) {
      contactInfoFormValues.contact_name = `${shippingDetailFormValues.firstname} ${shippingDetailFormValues.lastname}`
    }

    // Submit forms to action, only create a new order if order hasn't been created yet.
    if (!orderUUID) {
      createOrderFetcher.submit({
        shipping_form: JSON.stringify(shippingDetailFormValues),
        contact_info_form: JSON.stringify(contactInfoFormValues),
        price_info: JSON.stringify(priceInfo),
        cart_items: JSON.stringify(cartItems),
        payment_secret: paymentIntendID,
      }, { method: 'post', action: '/checkout?index' });
      return;
    }

    if (!element || !stripe) return;

    stripeConfirmPayment(orderUUID, element, stripe);
  }

  const handleSelectAddress = (option: Option) => {
    setShippingDetailFormValues({
      ...shippingDetailFormValues,
      address1: option.line1,
      address2: option.line2,
      city: option.city,
    })
  }

  return (
    <div className="checkout-page-container">
      <h1 className="title"> Shipping Information </h1>
      {
        errorAlert
          ? (
            <Alert severity='warning' >
              {errorAlert}
            </Alert>
          )
          : null
      }

      <div className="checkout-content">
        <div className="left">

          {/* You Details  */}
          {/* form-container */}
          <div className="mb-4 md:my-0 mx-auto">
            <CartSummary
              cart={cartItems}
              priceInfo={priceInfo}
            />
          </div>
        </div>

        <div className="right">
          {/* Shipping Info */}

          <createOrderFetcher.Form
            onChange={(evt: FormEvent<HTMLFormElement>) => {
              // Remove error alert when submitting error.
              setErrorAlert('');

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
                    onSelectAddress={handleSelectAddress}
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
                    <CheckoutForm loading={createOrderFetcher.state !== 'idle' || isPaying} />
                  }
                </div>
              </div>
            </div>
          </createOrderFetcher.Form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
