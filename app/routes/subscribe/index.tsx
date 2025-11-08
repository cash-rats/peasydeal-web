// This is a simple route component that accepts email subscribe requests
// and process the request via `action`. Email subscribe request are mainly
// from `FooterMobileLayout` and `FooterTabletLayout` for now.
import type { ActionFunctionArgs } from 'react-router';
import { json } from 'react-router';
import httpStatus from 'http-status-codes';

import { composErrorResponse } from '~/utils/error';

import { subscribe } from './api.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const email = body.get('email') as string | null;

  try {
    if (!email) {
      return json({}, httpStatus.BAD_REQUEST)
    }
    const resp = await subscribe(email);
    return json(resp, httpStatus.OK);

  } catch (err: any) {
    return json(composErrorResponse(err.message), httpStatus.BAD_REQUEST);
  }
}

function Subscribe() {
  return null;
}

export default Subscribe;