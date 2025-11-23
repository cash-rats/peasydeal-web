import type { ActionFunctionArgs } from 'react-router';

import { cancelOrder } from './api.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());

  try {
    await cancelOrder({
      orderUUID: formEntries['order_uuid'] as string,
      cancelReason: formEntries['cancel_reason'] as string,
    });

    return null;
  } catch (err) {
    return Response.json(err);
  }
};
