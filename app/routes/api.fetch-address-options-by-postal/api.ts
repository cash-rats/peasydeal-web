import httpStatus from 'http-status-codes';
import { envs } from '~/utils/env';

import { AddressOption } from './types';

const transformDataToAddressOption = (data: any[]): AddressOption[] => {
  return data.map((item) => {
    return {
      line1: item.line_1,
      line2: item.line_2,
      line3: item.line_3,
      city: item.city,
      county: item.county,
      country: item.country,
    };
  });
};

// # Find addresses by postcode substring (ILIKE).
// GET {{API_URL}}/v2/addresses/search?postcode=AB10&limit=100&offset=0
export const fetchAddressOptionsByPostal = async ({ postal }: { postal: string }): Promise<AddressOption[]> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/addresses/search';
  url.searchParams.append("postcode", postal);
  url.searchParams.append("limit", "50");
  url.searchParams.append("offset", "0");

  const resp = await fetch(url);

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(respJSON);
  }

  return transformDataToAddressOption(respJSON.data);
};
