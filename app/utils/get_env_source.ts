// Get endpoints according to different environment.
const getEnvSource = () => {
  if (typeof window !== 'undefined') return window.ENV.ENV;
  return process.env
}

export default getEnvSource