import type { ApiErrorResponse } from '~/shared/types';

export const composErrorResponse = (message: string): ApiErrorResponse => {
  return {
    err_code: 'remix_app_api_error',
    err_msg: message,
  };
}