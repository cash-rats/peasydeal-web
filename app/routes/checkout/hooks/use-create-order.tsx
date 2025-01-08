import { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import type { ApiErrorResponse, PaymentMethod } from '~/shared/types';

// This hook creates a new PeasyDeal order.
type CreateOrderProps = {
  shipping_form: string;
  contact_info_form: string;
  price_info: string;
  cart_items: string;
  payment_secret: string;
  promo_code: string;
  payment_method: PaymentMethod;
}

export const useCreateOrder = () => {
  const createOrderFetcher = useFetcher();
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [orderUUID, setOrderUUID] = useState<string>('');
  const createOrder = async (props: CreateOrderProps) => {
    console.log("* props 1 ", props.contact_info_form);
    console.log("* props 2", props.shipping_form);
    createOrderFetcher.submit(props, {
      method: 'post',
      action: '/checkout?index',
    });
  }

  useEffect(() => {
    if (createOrderFetcher.type !== 'done') {
      return;
    }

    if (createOrderFetcher.data.hasOwnProperty('error')) {
      const errResp = createOrderFetcher.data as ApiErrorResponse;
      console.log("* errResp", errResp);
      console.log("* errResp 2", errResp.error);
      setErrorAlert(`Failed to create order, please try again later, error code: ${errResp.error}`);
      return;
    }

    const { order_uuid: orderUUID } = createOrderFetcher.data;
    setOrderUUID(orderUUID);
  }, [createOrderFetcher.type, createOrderFetcher.data]);

  const clearErrorAlert = () => {
    setErrorAlert(null);
  }

  return {
    createOrder,
    createOrderFetcher,
    orderUUID,
    isLoading: createOrderFetcher.type !== 'done',
    isDone: createOrderFetcher.type === 'done',
    errorAlert,
    clearErrorAlert,
  }
}