import { data } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';
import { envs } from '~/utils/env';

type EmailSubscribeSuccessResponse = {
  ok: true;
};

type EmailSubscribeErrorResponse = ApiErrorResponse & {
  ok: false;
};

export type EmailSubscribeActionData =
  | EmailSubscribeSuccessResponse
  | EmailSubscribeErrorResponse;

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const buildErrorResponse = ({
  status,
  error,
  code,
}: {
  status: number;
  error: string;
  code?: string;
}): EmailSubscribeErrorResponse => {
  return {
    ok: false,
    code: code ?? 'email_subscribe_failed',
    error,
    err_msg: error,
    status: String(status),
  };
};

const parseJsonSafely = async (resp: Response) => {
  const text = await resp.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawEmail = formData.get('email');

  if (!rawEmail || typeof rawEmail !== 'string') {
    return data<EmailSubscribeActionData>(
      buildErrorResponse({
        status: httpStatus.BAD_REQUEST,
        error: 'Email is required',
      }),
      { status: httpStatus.BAD_REQUEST }
    );
  }

  const email = rawEmail.trim();
  if (!isValidEmail(email)) {
    return data<EmailSubscribeActionData>(
      buildErrorResponse({
        status: httpStatus.BAD_REQUEST,
        error: 'Please enter a valid email address',
        code: 'invalid_email',
      }),
      { status: httpStatus.BAD_REQUEST }
    );
  }

  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/subscribe';

  try {
    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (resp.ok) {
      return data<EmailSubscribeActionData>({ ok: true });
    }

    const respJson = (await parseJsonSafely(resp)) as Partial<ApiErrorResponse> | null;
    const message =
      respJson?.err_msg ||
      respJson?.error ||
      `Failed to subscribe (HTTP ${resp.status})`;

    return data<EmailSubscribeActionData>(
      buildErrorResponse({
        status: resp.status,
        error: message,
        code: respJson?.code,
      }),
      { status: resp.status }
    );
  } catch (error) {
    console.error('api.email-subscribe action error', error);

    return data<EmailSubscribeActionData>(
      buildErrorResponse({
        status: httpStatus.BAD_GATEWAY,
        error: 'Failed to subscribe. Please try again later.',
        code: 'upstream_error',
      }),
      { status: httpStatus.BAD_GATEWAY }
    );
  }
};

