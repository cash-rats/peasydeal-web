import httpStatus from 'http-status-codes';
import { envs } from '~/utils/env';

import { AddressOption } from './types';
import { getSupabaseAdminClient } from '~/services/supabase.server';

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

export const fetchAddressOptionsByPostalViaSupabase = async ({ postal }: { postal: string }): Promise<AddressOption[]> => {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc('search_uk_addresses_by_postcode', {
    p_input: postal,
    p_limit: 50,
  });

  if (error) {
    throw new Error(error.message);
  }

  return transformDataToAddressOption(Array.isArray(data) ? data : []);
};
