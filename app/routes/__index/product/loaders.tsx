import httpStatus from 'http-status-codes';
import { redirect, json } from 'react-router'

import { fetchNewProductURL } from './api.server';

const redirectToNewProductURL = async (request: Request, uuid: string): Promise<Response> => {
  try {
    // Ask BE if product ID uuid exists.
    const newURL = await fetchNewProductURL(uuid);
    return redirect(newURL);
  } catch (err) {
    throw json('not found', {
      status: httpStatus.NOT_FOUND,
    });
  }
}

export { redirectToNewProductURL }