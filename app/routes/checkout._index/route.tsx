import {
  useEffect,
  useRef,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import type { CountryData } from 'react-phone-input-2';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useRouteError,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
} from 'react-router';
import httpStatus from 'http-status-codes';

import type { PaymentMethod } from '~/shared/types';
import { useContext } from '~/routes/checkout/route';
import type { ShoppingCart } from '~/sessions/types';
import { useCreateOrder, useStripeConfirmPayment } from '~/routes/checkout/hooks';
import StripeCheckout from '~/routes/checkout/components/CheckoutForm/components/StripeCheckout';
import type { StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
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
import { tryCatch } from '~/utils/try-catch';
import { sortItemsByAddedTime } from '~/routes/cart/utils';
import { validatePhoneInput } from '~/routes/checkout/utils';

import { CheckoutLayout } from '~/components/v2/CheckoutLayout';
import { ContactInfoSection } from '~/components/v2/ContactInfoSection';
import { ShippingAddressSection } from '~/components/v2/ShippingAddressSection';
import type {
  ShippingAddress,
  ShippingAddressChangeMeta,
} from '~/components/v2/ShippingAddressSection/ShippingAddressSection';
import { CheckoutNav } from '~/components/v2/CheckoutNav';
import { OrderSummary } from '~/components/v2/OrderSummary';
import type { OrderItem } from '~/components/v2/OrderSummary/OrderSummary';

const getPaymentIntentIdFromClientSecret = (clientSecret: string) => {
  if (!clientSecret) return '';
  const [intentId] = clientSecret.split('_secret_');
  return intentId || '';
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
  const formRef = useRef<HTMLFormElement | null>(null);

  // Stripe PaymentElement ref
  const paymentElement = useRef<StripePaymentElement | null>(null);

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

  const assembleContactName = useCallback(() => {
    const contactInfo = state.contactInfoForm;
    const shippingInfo = state.shippingDetailForm;

    if (contactInfo.contact_name_same) {
      return `${shippingInfo.firstname} ${shippingInfo.lastname}`;
    }
    return contactInfo.contact_name as string;
  }, [state.contactInfoForm, state.shippingDetailForm]);

  const composeOrderInfoForSubmission = useCallback((paymentMethod: PaymentMethod) => {
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
  }, [assembleContactName, cartItems, paymentIntendID, priceInfo, promoCode]);

  const handleCreateOrder = useCallback(async (paymentMethod: PaymentMethod = 'stripe') => {
    const orderInfo = composeOrderInfoForSubmission(paymentMethod);
    dispatch({
      type: ReducerActionTypes.update_contact_info_form,
      payload: reducerState.current.contactInfoForm,
    });
    await createOrder(orderInfo);
  }, [composeOrderInfoForSubmission, createOrder]);

  const validateFormBeforePayment = useCallback(() => {
    if (!formRef.current) return true;

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return false;
    }

    const phoneInput = formRef.current.querySelector<HTMLInputElement>('#phone');
    if (!validatePhoneInput(phoneInput)) {
      formRef.current.reportValidity();
      return false;
    }

    return true;
  }, []);

  const handleConfirmPayment = useCallback(() => {
    if (!validateFormBeforePayment()) {
      return;
    }

    clearCreateOrderErrorAlert();
    clearStripeErrorAlert();

    if (!orderUUID) {
      handleCreateOrder('stripe');
      return;
    }
    stripeConfirmPayment(orderUUID);
  }, [orderUUID, handleCreateOrder, stripeConfirmPayment, clearCreateOrderErrorAlert, clearStripeErrorAlert, validateFormBeforePayment]);

  /* ─── V2 Shipping Address bridge ─── */
  const shippingAddress: ShippingAddress = useMemo(() => ({
    country: 'GB',
    firstName: state.shippingDetailForm.firstname,
    lastName: state.shippingDetailForm.lastname,
    address: state.shippingDetailForm.address1,
    address2: state.shippingDetailForm.address2,
    city: state.shippingDetailForm.city,
    postcode: state.shippingDetailForm.postal,
    phone: state.contactInfoForm.phone_value,
  }), [state.shippingDetailForm, state.contactInfoForm.phone_value]);

  const handleShippingChange = useCallback((
    field: keyof ShippingAddress,
    value: string,
    meta?: ShippingAddressChangeMeta,
  ) => {
    clearCreateOrderErrorAlert();
    clearStripeErrorAlert();

    // Map v2 field names → v1 reducer field names
    const fieldMap: Record<string, string> = {
      firstName: 'firstname',
      lastName: 'lastname',
      address: 'address1',
      address2: 'address2',
      city: 'city',
      postcode: 'postal',
    };

    if (field === 'phone') {
      const payload: {
        phone_value: string;
        country_data?: CountryData;
      } = {
        phone_value: value,
      };

      if (meta?.countryData) {
        payload.country_data = meta.countryData;
      }

      dispatch({
        type: ReducerActionTypes.update_contact_info_form,
        payload,
      });
      return;
    }

    const reducerField = fieldMap[field];
    if (reducerField) {
      dispatch({
        type: ReducerActionTypes.update_shipping_detail_form,
        payload: { [reducerField]: value },
      });
    }
  }, [clearCreateOrderErrorAlert, clearStripeErrorAlert]);

  /* ─── V2 Contact bridge ─── */
  const handleEmailChange = useCallback((value: string) => {
    clearCreateOrderErrorAlert();
    clearStripeErrorAlert();
    dispatch({
      type: ReducerActionTypes.update_contact_info_form,
      payload: { email: value },
    });
  }, [clearCreateOrderErrorAlert, clearStripeErrorAlert]);

  const handleMarketingOptInChange = useCallback((checked: boolean) => {
    clearCreateOrderErrorAlert();
    clearStripeErrorAlert();
    dispatch({
      type: ReducerActionTypes.update_contact_info_form,
      payload: { marketing_opt_in: checked },
    });
  }, [clearCreateOrderErrorAlert, clearStripeErrorAlert]);

  /* ─── Stripe handlers ─── */
  const handlePaymentElementReady = useCallback((element: StripePaymentElement) => {
    paymentElement.current = element;
    element.collapse();
  }, []);

  const handleStripeChange = useCallback((_event: StripePaymentElementChangeEvent) => {
    // no-op — Stripe manages its own state
  }, []);

  // Map cart items for v2 OrderSummary
  const orderItems: OrderItem[] = useMemo(() =>
    sortItemsByAddedTime(cartItems).map(item => ({
      id: item.variationUUID,
      name: item.title,
      variant: item.specName,
      thumbnailSrc: item.image,
      quantity: Number(item.quantity),
      salePrice: Number(item.salePrice) || undefined,
      retailPrice: Number(item.retailPrice),
    })),
    [cartItems],
  );

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleConfirmPayment();
  }, [handleConfirmPayment]);

  const leftContent = (
    <form ref={formRef} onSubmit={handleFormSubmit}>
      {/* Express checkout buttons */}
      {/* <ExpressCheckout /> */}

      {/* Error alerts */}
      {createOrderErrorAlert ? (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {createOrderErrorAlert}
        </div>
      ) : null}

      {stripeErrorAlert ? (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {stripeErrorAlert}
        </div>
      ) : null}

      {/* Required fields legend */}
      <p className="mb-4 font-body text-xs text-[#666]">
        Fields marked with <span className="text-[#C75050]">*</span> are required.
      </p>

      {/* Contact section */}
      <ContactInfoSection
        email={state.contactInfoForm.email}
        onEmailChange={handleEmailChange}
        marketingOptIn={state.contactInfoForm.marketing_opt_in}
        onMarketingOptInChange={handleMarketingOptInChange}
      />

      {/* Shipping address section */}
      <ShippingAddressSection
        address={shippingAddress}
        onChange={handleShippingChange}
        phoneCountryCode={state.contactInfoForm.country_data.countryCode}
        countries={[
          { label: 'United Kingdom', value: 'GB' },
          { label: 'United States', value: 'US' },
          { label: 'Canada', value: 'CA' },
          { label: 'Australia', value: 'AU' },
        ]}
      />

      {/* Stripe Payment Element */}
      <div className="mt-8">
        <h2 className="font-body text-lg font-semibold text-black mb-4">
          Payment
          <span className="ml-0.5 text-[#C75050]" aria-hidden="true">*</span>
        </h2>
        <StripeCheckout
          loading={loading || isPaying}
          onChange={handleStripeChange}
          onReady={handlePaymentElementReady}
        />
      </div>

      {/* Bottom navigation */}
      <CheckoutNav
        returnLabel="Return to cart"
        returnHref="/cart"
        continueLabel={loading || isPaying ? 'Processing...' : 'Pay now'}
        onContinue={handleConfirmPayment}
        loading={loading || isPaying}
      />
    </form>
  );

  const rightContent = (
    <OrderSummary
      items={orderItems}
      subtotal={priceInfo ? priceInfo.sub_total + priceInfo.tax_amount : 0}
      shipping={priceInfo?.shipping_fee ?? null}
      shippingCost={priceInfo?.origin_shipping_fee ?? null}
      shippingDiscount={priceInfo?.shipping_fee_discount}
      discount={priceInfo?.promo_code_discount || undefined}
      discountCode={promoCode || undefined}
      tax={priceInfo?.tax_amount}
      taxIncluded={priceInfo?.vat_included}
      total={priceInfo?.total_amount ?? 0}
      currency="£"
    />
  );

  return (
    <CheckoutLayout
      currentStep="payment"
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const isResponseError = isRouteErrorResponse(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 px-4 text-center bg-white">
      <a href="/" className="block font-heading text-2xl font-black text-black no-underline mb-4">
        PeasyDeal
      </a>
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
  );
}

export default CheckoutPage;
