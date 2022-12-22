import httpStatus from 'http-status-codes';

import { getMYFBEndpoint } from '~/utils/endpoints';

// export type Option = {
//   label: string;
//   value: string;
// };

// export type AddressPartialOptions = {
//   line1s: Option[];
//   line2s: Option[];
//   cities: Option[];
//   counties: Option[]
//   countries: Option[];
// };

// type DedupObj = { [key: string]: boolean };
// type DedupObjs = DedupObj[];

// const transformDataToAddressOptions = (data: any[]): AddressPartialOptions => {
//   const line1sDedupe: DedupObj = {};
//   const line2sDedupe: DedupObj = {};
//   const citiesDedupe: DedupObj = {};
//   const countiesDedupe: DedupObj = {};
//   const countriesDedupe: DedupObj = {};
//   const dedupObjs: DedupObjs = [line1sDedupe, line2sDedupe, citiesDedupe, countiesDedupe, countriesDedupe];

//   data.forEach((item) => {
//     if (item.line1) {
//       line1sDedupe[item.line1] = true;
//     }

//     if (item.line2) {
//       line2sDedupe[item.line2] = true;
//     }

//     if (item.city) {
//       citiesDedupe[item.city] = true;
//     }

//     if (item.county) {
//       countiesDedupe[item.county] = true;
//     }

//     if (item.country) {
//       countriesDedupe[item.country] = true;
//     }
//   });


//   const trfmedAddrParts = dedupObjs.reduce((accu: Option[][], curr: DedupObj): Option[][] => {
//     const currKeys = Object.keys(curr);
//     const currOptions = currKeys.map((key) => ({ label: key, value: key }));
//     accu.push(currOptions);
//     return accu;
//   }, []);

//   return {
//     line1s: trfmedAddrParts[0],
//     line2s: trfmedAddrParts[1],
//     cities: trfmedAddrParts[2],
//     counties: trfmedAddrParts[3],
//     countries: trfmedAddrParts[4],
//   };
// }

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
  const resp = await fetch(`${getMYFBEndpoint()}/data-server/ec/value/getaddress`, {
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