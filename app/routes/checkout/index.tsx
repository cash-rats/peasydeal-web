import { useEffect, useState, useRef, useReducer } from 'react';
import type { FormEvent } from 'react';
import type { LoaderFunction, LinksFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import {
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import Alert from '@mui/material/Alert';
import type {
  OnApproveData,
  OnApproveActions,
  OnClickActions,
} from "@paypal/paypal-js";

import type { ApiErrorResponse, PaymentMethod } from '~/shared/types';
import { PaymentMethod as PaymentMethodEnum } from '~/shared/enums';
import { getBrowserDomainUrl } from '~/utils/misc';
import { useContext } from '~/routes/checkout';
import { getCart } from '~/sessions/shoppingcart.session';
import type { ShoppingCart } from '~/sessions/shoppingcart.session';

import styles from './styles/Checkout.css';
import CheckoutForm, { links as CheckoutFormLinks } from './components/CheckoutForm';
import ShippingDetailForm, { links as ShippingDetailFormLinks } from './components/ShippingDetailForm';
import type { Option } from './components/ShippingDetailForm/api.server';
import CartSummary from './components/CartSummary';
import ContactInfoForm, { links as ContactInfoFormLinks } from './components/ContactInfoForm';
import type {
  ShippingDetailFormType,
  ContactInfoFormType,
} from './types';
import type { PaypalCreateOrderResponse } from './api';
import useFetcherWithPromise from './hooks/useFetcherWithPromise';
import reducer, { ActionTypes as ReducerActionTypes } from './reducer';
import type { StateShape } from './reducer';
import {
  __paypalCreateOrder,
  __paypalCapturePayment,
  __stripeCreateOrder,
  ActionType,
} from './actions';
import type { ActionPayload } from './actions';

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

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries()) as ActionPayload;

  if (formObj['action_type'] === ActionType.PaypalCreateOrder) {
    return __paypalCreateOrder(formObj)
  }

  if (formObj['action_type'] === ActionType.PaypalCapturePayment) {
    const ppID = formObj['paypal_order_id'] as string;
    const pdID = formObj['order_id'] as string
    return __paypalCapturePayment(ppID, pdID);
  }

  return __stripeCreateOrder(formObj)
};

/*

  TODOs
    - [ ] order amount should be calculated and send from backend.
    - [ ] `client_secret` should be move to action.
    - [ ] Add edit cart
    - [x] Redirect to successful page.
    - [x] Fix error snackbar.
    - [x] add search bar header
    - [ ] move data to reducer
*/
function CheckoutPage() {
  const { cart_items: cartItems } = useLoaderData<LoaderType>();
  const { paymentIntendID, priceInfo, promoCode } = useContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const element = useElements();
  const stripe = useStripe();

  const createOrderFetcher = useFetcher();
  const { submit } = useFetcherWithPromise();
  const [state, dispatch] = useReducer(
    reducer,
    {
      orderUUID: '',
      paypalOrderID: '',
    },
  );

  // Store orderUUID when is newly created. There might be an senario where shipping information is valid but not billing info.
  // When customer submit payment again, a new order will be created again. Thus, if orderID exists we should not create a new order again.
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
    country_data: {
      name: '',
      dialCode: '',
      countryCode: '',
      format: '',
    },
    phone_value: '',
    contact_name_same: true,
    contact_name: '',
  });

  const cinfoRef = useRef<ContactInfoFormType>(contactInfoFormValues);
  cinfoRef.current = contactInfoFormValues;
  const shipInfoRef = useRef<ShippingDetailFormType>(shippingDetailFormValues)
  shipInfoRef.current = shippingDetailFormValues;
  const reducerState = useRef<StateShape>(state);
  reducerState.current = state;

  const stripeConfirmPayment = async (orderUUID: string, elements: StripeElements, stripe: Stripe) => {
    setIsPaying(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${getBrowserDomainUrl()}/payment/${orderUUID}?payment_method=${PaymentMethodEnum.Stripe}`,
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
        dispatch({
          type: ReducerActionTypes.set_order_uuid,
          payload: orderUUID,
        })

        stripeConfirmPayment(orderUUID, element, stripe);
      }
    },
    [createOrderFetcher, state.orderUUID]
  );

  const validatePhone = (form: HTMLFormElement): boolean => {
    const phoneField = form.querySelector('#phone') as HTMLInputElement;

    if (!phoneField) return false;

    if (
      !cinfoRef.current.phone_value ||
      cinfoRef.current.phone_value === contactInfoFormValues.country_data.dialCode
    ) {
      phoneField.setCustomValidity('Please fill out this field.');
      form.reportValidity();
      return false;
    }

    return true;
  };

  const assembleContactName = (): string => {
    let contactName = cinfoRef.current.contact_name;
    if (cinfoRef.current.contact_name_same) {
      contactName = `${shipInfoRef.current.firstname} ${shipInfoRef.current.lastname}`
    }
    return contactName
  }

  const retrieveOrderInfoForSubmission = (paymentMethod: PaymentMethod) => {
    const contactName = assembleContactName()
    cinfoRef.current.contact_name = contactName

    return {
      shipping_form: JSON.stringify(shipInfoRef.current),
      contact_info_form: JSON.stringify(cinfoRef.current),
      price_info: JSON.stringify(priceInfo),
      cart_items: JSON.stringify(cartItems),
      payment_secret: paymentIntendID,
      promo_code: promoCode,
      payment_method: paymentMethod,
    };
  }

  const createOrder = (paymentMethod: PaymentMethod = "stripe") => {
    const orderInfo = retrieveOrderInfoForSubmission(paymentMethod);

    setContactInfoFormValues(cinfoRef.current);

    createOrderFetcher.submit(
      orderInfo,
      {
        method: 'post',
        action: '/checkout?index'
      },
    );
  };


  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!formRef.current) return;
    if (!validatePhone(formRef.current)) return;

    // Submit forms to action, only create a new order if order hasn't been created yet.
    if (!state.orderUUID) {
      createOrder('stripe');

      return;
    }

    if (!element || !stripe) return;

    stripeConfirmPayment(state.orderUUID, element, stripe);
  }

  const handleSelectAddress = (option: Option) => {
    setShippingDetailFormValues({
      ...shippingDetailFormValues,
      address1: option.line1,
      address2: option.line2,
      city: option.city,
    })
  }

  const handlePaypalCreateOrder = async (): Promise<string> => {
    const orderInfo = retrieveOrderInfoForSubmission('paypal');
    const data: PaypalCreateOrderResponse = await submit(
      {
        action_type: ActionType.PaypalCreateOrder,
        ...orderInfo,
      },
      {
        method: 'post',
        action: '/checkout?index',
      }
    );

    console.log('debug 1', data.order_uuid);

    dispatch({
      type: ReducerActionTypes.set_both_paypal_and_peasydeal_order_id,
      payload: {
        orderUUID: data.order_uuid,
        paypalOrderID: data.paypal_order_id,
      },
    });

    return data.paypal_order_id;
  }

  const handlePaypalApproveOrder = async (data: OnApproveData, action: OnApproveActions) => {
    await submit(
      {
        action_type: ActionType.PaypalCapturePayment,
        order_id: reducerState.current.orderUUID,
        paypal_order_id: data.orderID, // This is the paypal order id
      },
      {
        method: 'post',
        action: '/checkout?index',
      },
    )
  };

  const handlePaypalInputValidate = (data: Record<string, unknown>, actions: OnClickActions) => {
    if (!formRef.current) {
      return actions.reject();
    }

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return actions.reject();
    }

    if (!validatePhone(formRef.current)) {
      return actions.reject();
    }

    return actions.resolve();
  };

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
            ref={formRef}
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

            {
              // When create order action is triggered in `CheckoutForm`, current loader will be triggered to realod client secret
              // causing display of the warning.
              // The following is a temperary solution.
              // @docs https://stackoverflow.com/questions/70864433/integration-of-stripe-paymentelement-warning-unsupported-prop-change-options-c
              <CheckoutForm
                loading={createOrderFetcher.state !== 'idle' || isPaying}
                paypalCreateOrder={handlePaypalCreateOrder}
                paypalApproveOrder={handlePaypalApproveOrder}
                paypalInputValidate={handlePaypalInputValidate}
              />
            }
          </createOrderFetcher.Form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
