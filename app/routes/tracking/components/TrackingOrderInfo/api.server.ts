import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';
import { envs } from '~/utils/get_env_source';

interface ICancelOrder {
  orderUUID: string;
  cancelReason: string;
}

const cancelOrder = async ({ orderUUID, cancelReason }: ICancelOrder) => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/orders/cancel';

  const resp = await fetch(url.toString(), {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_uuid: orderUUID,
      cancel_reason: cancelReason,
    }),
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error((respJSON as ApiErrorResponse).err_msg);
  }
};

export { cancelOrder };