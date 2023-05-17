// This is a simple route component that accepts email unsubscribe requests
// and process the request via `action`. Email unsubscribe request are mainly
// from `FooterMobileLayout` and `FooterTabletLayout` for now.
import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import httpStatus from 'http-status-codes';

import { composErrorResponse } from '~/utils/error';

import { unsubscribe } from './api.server';

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const uuid = body.get('uuid') as string | null;

  try {
    if (!uuid) {
      return json({}, httpStatus.BAD_REQUEST)
    }

    const resp = await unsubscribe(uuid);

    return json(resp, httpStatus.OK);
  } catch (err: any) {
    return json(composErrorResponse(err.message), httpStatus.BAD_REQUEST);
  }
}

function Unsubscribe() {
  return ('')
}

export default Unsubscribe;