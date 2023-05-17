import httpStatus from 'http-status-codes';

import { MYFB_ENDPOINT } from '~/utils/get_env_source';

export const unsubscribe = async (uuid: string): Promise<object> => {
  if (!MYFB_ENDPOINT || !uuid) {
    return {
      status: httpStatus.BAD_REQUEST,
    }
  }

  const url = new URL(MYFB_ENDPOINT);

  url.pathname = `/data-server/ec/edm/unsubscribe`;

  let formdata = new FormData();
  formdata.append("uuid", uuid);


  const resp = await fetch(url.toString(), {
    method: 'POST',
    body: formdata,
  })

  const respJson = await resp.json();

  if (resp.status !== httpStatus.OK) {
    return {
      err_code: resp.status,
    }
  }

  return respJson;
}