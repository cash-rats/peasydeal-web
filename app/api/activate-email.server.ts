import { envs } from '~/utils/get_env_source';

export const activateEmailSubscribe = async (uuid: string) => {
  console.log('uuid', uuid);
  const url = `${envs.PEASY_DEAL_ENDPOINT}/v2/subscribe/activate-email`;
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({ uuid }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const respJSON = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(respJSON));
  }
  return respJSON;
}
