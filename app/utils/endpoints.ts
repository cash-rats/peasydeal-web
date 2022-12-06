// Get endpoints according to different environment.
import getEnvSource from './get_env_source';

export const getMYFBEndpoint = () => getEnvSource().MYFB_ENDPOINT;
export const getPeasyDealEndpoint = () => getEnvSource().PEASY_DEAL_ENDPOINT;