// This is a simple route component that accepts email unsubscribe requests
// and process the request via `action`. Email unsubscribe request are mainly
// from `FooterMobileLayout` and `FooterTabletLayout` for now.
import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import httpStatus from 'http-status-codes';

import { composErrorResponse } from '~/utils/error';

import { unsubscribe } from './api.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const uuid = body.get('uuid') as string | null;

  try {
    if (!uuid) {
      return data({}, { status: httpStatus.BAD_REQUEST })
    }

    const resp = await unsubscribe(uuid);

    return data(resp, { status: httpStatus.OK });
  } catch (err: any) {
    return data(composErrorResponse(err.message), { status: httpStatus.BAD_REQUEST });
  }
}

function Unsubscribe() {
  return ('')
}

export default Unsubscribe;