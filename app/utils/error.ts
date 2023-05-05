import type { ApiErrorResponse } from '~/shared/types';

/*
  This function gives uniformed error format from error thrown from the API.

  BE gives unified error response format:

  {
    err_msg: string
    err_code: string
  }

  There are 2 ways that an API might throw an Error.

  1.
    throw new Error(JSON.stringify(respJSON)) ---> throwing a string of json object in the above format.
  2.
    throw new Error((respJSON as ApiErrorResponse).err_msg) ---> throwing an string of a simple error message responded from the BE.

  try {
    await someAsyncFetch(...)
  } catch (e) {
    return composeErrorResponse(e.message)
  }
*/
export const composErrorResponse = (errThing: string): ApiErrorResponse => {
  try {
    const thingObj: ApiErrorResponse = JSON.parse(errThing);
    return thingObj;
  } catch (e) {
    return {
      err_code: 'remix_app_api_error',
      err_msg: errThing,
    };
  }
}