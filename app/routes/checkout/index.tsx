import { useEffect, useRef, useReducer } from 'react';
import type { FormEvent } from 'react';
import type { LoaderFunction, LinksFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Alert from '@mui/material/Alert';
import { Spinner } from '@chakra-ui/react'
import type { PaymentMethod } from '~/shared/types';
import { useContext } from '~/routes/checkout';
import { getCart } from '~/sessions/shoppingcart.session';
import type { ShoppingCart } from '~/sessions/shoppingcart.session';
import { useCreateOrder, useStripeConfirmPayment } from './hooks';

import styles from './styles/Checkout.css';
import CheckoutForm, { links as CheckoutFormLinks } from './components/CheckoutForm';
import ShippingDetailForm, { links as ShippingDetailFormLinks } from './components/ShippingDetailForm';
import type { Option } from './components/ShippingDetailForm/api.server';
import CartSummary from './components/CartSummary';
import ContactInfoForm, { links as ContactInfoFormLinks } from './components/ContactInfoForm';
import reducer, { ActionTypes as ReducerActionTypes, initState } from './reducer';
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
  try {
    const cart = await getCart(request);

    if (!cart || Object.keys(cart).length === 0) {
      throw redirect("/cart");
    }

    return json<LoaderType>({ cart_items: cart });
  } catch (error) {
    return json<LoaderType>({ cart_items: {} });
  }
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
  const { cart_items: cartItems } = useLoaderData<LoaderType>() || {};

  const { paymentIntendID, priceInfo, promoCode } = useContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    createOrder,
    createOrderFetcher,
    orderUUID,
    isDone,
    errorAlert: createOrderErrorAlert,
    clearErrorAlert: clearCreateOrderErrorAlert,
  } = useCreateOrder();
  const {
    stripeConfirmPayment,
    isPaying,
    errorAlert: stripeErrorAlert,
    clearErrorAlert: clearStripeErrorAlert,
  } = useStripeConfirmPayment();

  const [state, dispatch] = useReducer(reducer, initState);

  const reducerState = useRef<StateShape>(state);
  reducerState.current = state;

  useEffect(() => {
    // Validate form inputs on every input changes. This part of the logic
    // is for enabling paypal button.
    dispatch({
      type: ReducerActionTypes.set_disable_paypal_button,
      payload: !(
        !!formRef.current?.checkValidity() &&
        !isPhoneValueEmpty(
          reducerState.current.contactInfoForm.phone_value,
          reducerState.current.contactInfoForm.country_data.countryCode,
        )
      ),
    });
  }, [
    state.shippingDetailForm,
    state.contactInfoForm,
  ]);

  // Scroll to top if a new error message is set so user can see.
  useEffect(() => {
    if (createOrderErrorAlert || stripeErrorAlert) {
      window.scrollTo(0, 0);
    }
  }, [createOrderErrorAlert, stripeErrorAlert]);

  useEffect(() => {
    if (orderUUID && isDone) {
      stripeConfirmPayment(orderUUID);
    }
  }, [orderUUID, isDone, stripeConfirmPayment]);

  if (!cartItems || !Object.keys(cartItems).length) return (
    <div className='w-full flex items-center justify-center my-4'>
      <Spinner size='lg' />
    </div>
  );

  const isPhoneValueEmpty = (phone: string, countryCode: string) => !phone || phone === countryCode;
  const validatePhone = (form: HTMLFormElement): boolean => {
    const phoneField = form.querySelector('#phone') as HTMLInputElement;

    if (!phoneField) return false;

    if (
      isPhoneValueEmpty(
        reducerState.current.contactInfoForm.phone_value,
        reducerState.current.contactInfoForm.country_data.dialCode,
      )
    ) {
      phoneField.setCustomValidity('Please fill out this field.');
      return false;
    }

    return true;
  };

  const assembleContactName = (): string => {
    const contactInfo = reducerState.current.contactInfoForm;
    const shippingInfo = reducerState.current.shippingDetailForm;

    let contactName = contactInfo.contact_name;
    if (contactInfo.contact_name_same) {
      contactName = `${shippingInfo.firstname} ${shippingInfo.lastname}`
    }
    return contactName
  }

  const retrieveOrderInfoForSubmission = (paymentMethod: PaymentMethod) => {
    const contactName = assembleContactName()
    reducerState.current.contactInfoForm.contact_name = contactName

    return {
      shipping_form: JSON.stringify(reducerState.current.shippingDetailForm),
      contact_info_form: JSON.stringify(reducerState.current.contactInfoForm),
      price_info: JSON.stringify(priceInfo),
      cart_items: JSON.stringify(cartItems),
      payment_secret: paymentIntendID,
      promo_code: promoCode,
      payment_method: paymentMethod,
    };
  }

  const handleCreateOrder = async (paymentMethod: PaymentMethod = "stripe") => {
    const orderInfo = retrieveOrderInfoForSubmission(paymentMethod);
    dispatch({
      type: ReducerActionTypes.update_contact_info_form,
      payload: reducerState.current.contactInfoForm,
    });
    await createOrder(orderInfo);
  };

  const handleFormChange = (evt: FormEvent<HTMLFormElement>) => {
    clearCreateOrderErrorAlert();
    clearStripeErrorAlert();

    let target = evt.target as HTMLInputElement;

    const fieldName = target.name;
    let fieldValue: string | boolean = target.value;

    if (target.type === 'checkbox') {
      fieldValue = target.checked;
    }

    if (reducerState.current.shippingDetailForm.hasOwnProperty(fieldName)) {
      dispatch({
        type: ReducerActionTypes.update_shipping_detail_form,
        payload: {
          [fieldName]: fieldValue,
        },
      });
    }
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!formRef.current) return;
    if (!validatePhone(formRef.current)) {
      formRef.current.reportValidity();
      return;
    };

    // Submit forms to action, only create a new order if order hasn't been created yet.
    if (!state.orderUUID) {
      handleCreateOrder('stripe');
      return;
    }

    stripeConfirmPayment(state.orderUUID);
  }

  const handleSelectAddress = (option: Option) => {
    dispatch({
      type: ReducerActionTypes.update_shipping_detail_form,
      payload: {
        address1: option.line1,
        address2: option.line2,
        city: option.city,
      },
    });
  }

  return (
    <div className="checkout-page-container">
      <h1 className="title"> Shipping Information </h1>
      {
        createOrderErrorAlert
          ? (
            <Alert severity='warning' >
              {createOrderErrorAlert}
            </Alert>
          )
          : null
      }

      {
        stripeErrorAlert
          ? (
            <Alert severity='warning' >
              {stripeErrorAlert}
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
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          >
            <div className="form-container">
              <h1 className="shipping-info-title">
                Shipping Details
              </h1>

              <div className="pricing-panel">
                <div className="shipping-form-container">
                  <ShippingDetailForm
                    values={state.shippingDetailForm}
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
                    values={state.contactInfoForm}
                    onChange={(data) => {
                      dispatch({
                        type: ReducerActionTypes.update_contact_info_form,
                        payload: data
                      })
                    }}
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
              />
            }
          </createOrderFetcher.Form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
