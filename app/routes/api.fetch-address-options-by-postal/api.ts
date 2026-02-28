import httpStatus from 'http-status-codes';
import { envs } from '~/utils/env.server';

import type { AddressOption } from './types';

const ADDRESS_SEARCH_TIMEOUT_MS = 5000;

const transformDataToAddressOption = (data: any[]): AddressOption[] => {
  return data.map((item) => {
    const getString = (...keys: string[]) => {
      for (const key of keys) {
        const value = item?.[key];
        if (typeof value === 'string') return value;
      }
      return '';
    };

    const line3 = getString('line_3', 'line3');

    return {
      line1: getString('line_1', 'line1'),
      line2: getString('line_2', 'line2'),
      line3: line3 || undefined,
      city: getString('city'),
      county: getString('county'),
      country: getString('country'),
      postal: getString('postcode', 'postal', 'postalcode', 'post_code').toUpperCase(),
    };
  });
};

// # Find addresses by postcode substring (ILIKE).
// GET {{API_URL}}/v2/addresses/search?postcode=AB10&limit=100&offset=0
export const fetchAddressOptionsByPostal = async ({ postal }: { postal: string }): Promise<AddressOption[]> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/addresses/search';
  url.searchParams.append('postcode', postal.trim());
  url.searchParams.append('limit', '50');
  url.searchParams.append('offset', '0');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ADDRESS_SEARCH_TIMEOUT_MS);

  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    const respJSON = await resp.json();

    if (resp.status !== httpStatus.OK) {
      throw new Error(
        `address-search-api-unexpected-status:${resp.status}`,
      );
    }

    return transformDataToAddressOption(Array.isArray(respJSON?.data) ? respJSON.data : []);
  } finally {
    clearTimeout(timeoutId);
  }
};
