// Get endpoints according to different environment.
declare global {
  interface Window {
    ENV: {
      ENV: {
        STRIPE_PUBLIC_KEY: string;
        DOMAIN: string;
      }
    }
  }
}

const getEnvSource = () => {
  if (typeof window !== 'undefined') return window.ENV.ENV;
  return process.env
}

export default getEnvSource