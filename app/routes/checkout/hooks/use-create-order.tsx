import { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';
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
};

export const useCreateOrder = () => {
  const createOrderFetcher = useFetcher();
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [orderUUID, setOrderUUID] = useState<string>('');
  const createOrder = async (props: CreateOrderProps) => {
    createOrderFetcher.submit(props, {
      method: 'post',
      action: '/checkout?index',
    });
  };

  useEffect(() => {
    if (createOrderFetcher.state !== 'idle' || !createOrderFetcher.data) return;

    if (createOrderFetcher.data.hasOwnProperty('error')) {
      const errResp = createOrderFetcher.data as ApiErrorResponse;
      setErrorAlert(`Failed to create order, please try again later, error code: ${errResp.error}`);
      return;
    }

    const { order_uuid: orderUUID } = createOrderFetcher.data;
    setOrderUUID(orderUUID);
  }, [createOrderFetcher.state, createOrderFetcher.data]);

  const clearErrorAlert = () => {
    setErrorAlert(null);
  }

  return {
    createOrder,
    createOrderFetcher,
    orderUUID,
    isLoading: createOrderFetcher.state !== 'idle',
    isDone: createOrderFetcher.state === 'idle' && Boolean(createOrderFetcher.data),
    errorAlert,
    clearErrorAlert,
  }
}
