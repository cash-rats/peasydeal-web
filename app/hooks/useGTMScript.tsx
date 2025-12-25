import { useEffect } from 'react';

type UseGTMScriptParams = {
  env?: string | null | undefined;
  googleTagID?: string | null | undefined;
};

const EXTERNAL_SCRIPT_ID = 'google-tag-gtag-js';
const INLINE_SCRIPT_ID = 'google-tag-gtag-init';

// Google tag (gtag.js). Load on client side only.
const useGTMScript = (params: UseGTMScriptParams) => {
  useEffect(() => {
    const googleTagID = params.googleTagID;
    if (!params.env || params.env === 'development' || !googleTagID) return;

    const existingExternalScript = document.getElementById(EXTERNAL_SCRIPT_ID);
    const existingInlineScript = document.getElementById(INLINE_SCRIPT_ID);

    const externalScript =
      existingExternalScript ?? document.createElement('script');
    if (!existingExternalScript) {
      externalScript.id = EXTERNAL_SCRIPT_ID;
      externalScript.async = true;
      externalScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagID)}`;
      document.head.appendChild(externalScript);
    }

    const inlineScript = existingInlineScript ?? document.createElement('script');
    if (!existingInlineScript) {
      inlineScript.id = INLINE_SCRIPT_ID;
      inlineScript.innerHTML = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${googleTagID}');
`.trim();
      document.head.appendChild(inlineScript);
    }

    return () => {
      if (!existingInlineScript && document.head.contains(inlineScript)) {
        document.head.removeChild(inlineScript);
      }
      if (!existingExternalScript && document.head.contains(externalScript)) {
        document.head.removeChild(externalScript);
      }
    };
  }, [
    params.env,
    params.googleTagID,
  ]);
}

export default useGTMScript;
