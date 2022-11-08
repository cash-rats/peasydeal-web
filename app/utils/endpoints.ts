// Get endpoints according to different environment.
const getAvailableSource = () => {
  if (typeof window !== 'undefined') return window.ENV.ENV;
  return process.env
}

export const getMYFBEndpoint = () => getAvailableSource().MYFB_ENDPOINT;
export const getPeasyDealEndpoint = () => getAvailableSource().PEASY_DEAL_ENDPOINT;