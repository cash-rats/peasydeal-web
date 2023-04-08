import type { ApiErrorResponse } from '~/shared/types';

/*
  BE gives unified error response format:

  {
    msg: string
    err_code: string
  }

  There are 2 ways that an API might throw an Error.

  1.
    throw new Error(JSON.stringify(respJSON)) ---> throwing a string of object.
  2.
    throw new Error((respJSON as ApiErrorResponse).err_msg) ---> throwing an string of error message.
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