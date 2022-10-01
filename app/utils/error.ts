import type { ApiErrorResponse } from '~/shared/types';

export const error = (message: string): ApiErrorResponse => {
  return {
    err_code: 'remix_app_api_error',
    err_message: message,
  };
}