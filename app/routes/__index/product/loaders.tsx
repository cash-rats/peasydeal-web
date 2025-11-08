import httpStatus from 'http-status-codes';
import { redirect, data } from 'react-router'

import { fetchNewProductURL } from './api.server';

const redirectToNewProductURL = async (request: Request, uuid: string): Promise<Response> => {
  try {
    // Ask BE if product ID uuid exists.
    const newURL = await fetchNewProductURL(uuid);
    return redirect(newURL);
  } catch (err) {
    throw data('not found', {
      status: httpStatus.NOT_FOUND,
    });
  }
}

export { redirectToNewProductURL }