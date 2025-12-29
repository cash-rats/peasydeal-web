import {
  type FormEvent,
  useEffect,
  useRef,
  useReducer,
  useMemo,
} from 'react';
import {
  type LoaderFunctionArgs,
  type LinksFunction,
  type ActionFunctionArgs,
  useRouteError,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
} from 'react-router';
import httpStatus from 'http-status-codes';
import { Alert } from '~/components/ui/alert';
import { Spinner } from '~/components/ui/spinner';

import type { PaymentMethod } from '~/shared/types';
import { useContext } from '~/routes/checkout/route';
import type { ShoppingCart } from '~/sessions/types';
import { useCreateOrder, useStripeConfirmPayment } from '~/routes/checkout/hooks';
import styles from '~/routes/checkout/styles/Checkout.css?url';
import CheckoutForm, {
  links as CheckoutFormLinks,
} from '~/routes/checkout/components/CheckoutForm';
import ShippingDetailForm from '~/routes/checkout/components/ShippingDetailForm';
import type { AddressOption as Option } from '~/routes/api.fetch-address-options-by-postal/types';
import CartSummary from '~/routes/checkout/components/CartSummary';
import ContactInfoForm, {
  links as ContactInfoFormLinks,
} from '~/routes/checkout/components/ContactInfoForm';
import reducer, {
  ActionTypes as ReducerActionTypes,
  initState,
} from '~/routes/checkout/reducer';
import type { StateShape } from '~/routes/checkout/reducer';
import {
  __paypalCreateOrder,
  __paypalCapturePayment,
  __stripeCreateOrder,
  ActionType,
} from '~/routes/checkout/actions';
import type { ActionPayload } from '~/routes/checkout/actions';
import { getCheckoutSession } from '~/sessions/checkout.session.server';
import { validatePhoneInput } from '~/routes/checkout/utils';
import { tryCatch } from '~/utils/try-catch';

const getPaymentIntentIdFromClientSecret = (clientSecret: string) => {
  if (!clientSecret) return '';
  const [intentId] = clientSecret.split('_secret_');
  return intentId || '';
};

export const links: LinksFunction = () => {
  return [
    ...CheckoutFormLinks(),
    ...ContactInfoFormLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

type LoaderType = {
  cart_items: ShoppingCart;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [checkoutSession, checkoutError] = await tryCatch(
    getCheckoutSession(request),
  );

  if (checkoutError || !checkoutSession) {
    throw new Response('Failed to load checkout cart', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  const { data } = checkoutSession;

  if (!data || !data.cart || Object.keys(data.cart).length === 0) {
    throw redirect('/cart');
  }

  return Response.json({ cart_items: data.cart });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries()) as ActionPayload;

  if (formObj['action_type'] === ActionType.PaypalCreateOrder) {
    return __paypalCreateOrder(formObj);
  }

  if (formObj['action_type'] === ActionType.PaypalCapturePayment) {
    const ppID = formObj['paypal_order_id'] as string;
    const pdID = formObj['order_id'] as string;
    return __paypalCapturePayment(ppID, pdID);
  }

  return __stripeCreateOrder(formObj);
};

function CheckoutPage() {
  const { cart_items: cartItems } = useLoaderData<LoaderType>() || {};

  const { paymentClientSecret, priceInfo, promoCode } = useContext();
  const paymentIntendID = useMemo(
    () => getPaymentIntentIdFromClientSecret(paymentClientSecret),
    [paymentClientSecret],
  );
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
    const contactName = state.contactInfoForm.contact_name;
    const shippingName = state.shippingDetailForm.firstname;
    if (
      contactName &&
      shippingName &&
      contactName === shippingName
    ) {
      dispatch({
        type: ReducerActionTypes.update_contact_name_same,
        payload: true,
      });
    }
  }, [state.contactInfoForm.contact_name, state.shippingDetailForm.firstname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isDone || !orderUUID) {
      return;
    }
    stripeConfirmPayment(orderUUID);
  }, [isDone, orderUUID, stripeConfirmPayment]);

  const loading = createOrderFetcher.state !== 'idle';

  const assembleContactName = () => {
    let contactName = state.contactInfoForm.contact_name as string;

    /**** contact name same as shipping name ******/
    const contactInfo = state.contactInfoForm;
    const shippingInfo = state.shippingDetailForm;

    if (contactInfo.contact_name_same) {
      contactName = `${shippingInfo.firstname} ${shippingInfo.lastname}`;
    }
    return contactName;
  };

  const composeOrderInfoForSubmission = (paymentMethod: PaymentMethod) => {
    const contactName = assembleContactName();
    reducerState.current.contactInfoForm.contact_name = contactName;

    return {
      shipping_form: JSON.stringify(reducerState.current.shippingDetailForm),
      contact_info_form: JSON.stringify(reducerState.current.contactInfoForm),
      price_info: JSON.stringify(priceInfo),
      cart_items: JSON.stringify(cartItems),
      payment_secret: paymentIntendID,
      promo_code: promoCode ?? null,
      payment_method: paymentMethod,
    };
  };

  const handleCreateOrder = async (paymentMethod: PaymentMethod = 'stripe') => {
    const orderInfo = composeOrderInfoForSubmission(paymentMethod);
    dispatch({
      type: ReducerActionTypes.update_contact_info_form,
      payload: reducerState.current.contactInfoForm,
    });
    await createOrder(orderInfo);
  };

  const handleFormChange = (evt: FormEvent<HTMLFormElement>) => {
    // Only shipping fields are updated here; contact fields are managed inside ContactInfoForm via its onChange prop.
    clearCreateOrderErrorAlert();
    clearStripeErrorAlert();

    const target = evt.target as HTMLInputElement;

    const fieldName = target.name;
    let fieldValue: string | boolean = target.value;

    if (target.type === 'checkbox') {
      fieldValue = target.checked;
    }

    if (Object.prototype.hasOwnProperty.call(reducerState.current.shippingDetailForm, fieldName)) {
      dispatch({
        type: ReducerActionTypes.update_shipping_detail_form,
        payload: {
          [fieldName]: fieldValue,
        },
      });
    }
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!formRef.current) return;
    const phoneInput = formRef.current.querySelector<HTMLInputElement>('#phone');
    if (!validatePhoneInput(phoneInput)) {
      formRef.current.reportValidity();
      return;
    }

    if (!orderUUID) {
      handleCreateOrder('stripe');
      return;
    }

    stripeConfirmPayment(orderUUID);
  };

  const handleSelectAddress = (option: Option) => {
    const addressLine2 = [
      option.line2,
      option.line3,
      option.county,
      option.country,
    ].filter(Boolean).join(', ');

    dispatch({
      type: ReducerActionTypes.update_shipping_detail_form,
      payload: {
        address1: option.line1,
        address2: addressLine2,
        city: option.city,
        postal: option.postal,
      },
    });
  };

  return (
    <div className="checkout-page-container">
      <h1 className="title"> Shipping Information </h1>
      {createOrderErrorAlert ? (
        <Alert variant="destructive">
          {createOrderErrorAlert}
        </Alert>
      ) : null}

      {stripeErrorAlert ? (
        <Alert variant="destructive">
          {stripeErrorAlert}
        </Alert>
      ) : null}

      <div className="checkout-content">
        <div className="left">
          <div className="mb-4 md:my-0 mx-auto">
            <CartSummary
              cart={cartItems}
              priceInfo={priceInfo}
            />
          </div>
        </div>

        <div className="right">
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
            </div>

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
                        payload: data,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {
              <CheckoutForm loading={loading || isPaying} />
            }
          </createOrderFetcher.Form>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner className="h-8 w-8 text-slate-600" />
        </div>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const isResponseError = isRouteErrorResponse(error);

  return (
    <div className="checkout-page-container">
      <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Unable to load checkout details</h1>
        <p className="text-gray-600">
          We couldn&apos;t load your cart for checkout. Please return to your cart and try again.
        </p>
        {isResponseError && (
          <p className="text-sm text-gray-500">
            Error code: {error.status}
          </p>
        )}
        <div className="flex items-center gap-4">
          <a
            className="rounded bg-black px-4 py-2 text-white"
            href="/cart"
          >
            Return to cart
          </a>
          <a
            className="rounded border border-black px-4 py-2 text-black"
            href="/"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
