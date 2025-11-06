import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';

export type AddressParts = 'line1' | 'line2' | 'city' | 'county' | 'country';

export type Option = {
  [key in AddressParts]: string;
}

const transformDataToOption = (data: any[]): Option[] => {
  return data.map((item) => {
    return {
      line1: item.line1,
      line2: item.line2,
      city: item.city,
      county: item.county,
      country: item.country,
    };
  });
};

/*
[
  {
   "line1": "...",
   "line2": "...",
   "city": "...",
   "county": "...",
   "country": "...",
  },

  {
   "line1": "...",
   "line2": "...",
   "city": "...",
   "county": "...",
   "country": "...",
  },

  {
   "line1": "...",
   "line2": "...",
   "city": "...",
   "county": "...",
   "country": "...",
  },
]
*/
export const fetchAddressOptionsByPostal = async ({ postal }: { postal: string }): Promise<Option[]> => {
  const resp = await fetch(`${envs.MYFB_ENDPOINT}/data-server/ec/value/getaddress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'postcode': postal
    }),
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(respJSON);
  }

  // transform data to address options
  // return transformDataToAddressOptions(respJSON.data);
  return transformDataToOption(respJSON.data);
};