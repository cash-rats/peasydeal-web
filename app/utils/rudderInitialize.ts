import getEnvSource from '~/utils/get_env_source';

export async function rudderInitialize() {
  if (typeof document !== 'undefined') {
    const { default: rudder } = await import("rudder-sdk-js");
    
    window.rudderanalytics = rudder;

    if (!window.rudderanalytics) return;

    const { RUDDER_STACK_KEY, RUDDER_STACK_URL } = getEnvSource();

    if (!RUDDER_STACK_KEY || !RUDDER_STACK_URL) return;

    window.rudderanalytics.load(RUDDER_STACK_KEY, RUDDER_STACK_URL, {
      integrations: { All: true }, // load call options
    });

    window.rudderanalytics.ready(() => {
      console.log("rudderstack set");
    });
  }
}