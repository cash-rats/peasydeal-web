import { useEffect } from 'react';

type useUseGTCScriptParams = {
  env?: string | null | undefined;
  googleTagID?: string | null | undefined;
};

// <!-- Google Tag Manager. Load on client side only  -->
const useGTCScript = (params: useUseGTCScriptParams) => {
  useEffect(() => {
    if (
      params.env &&
      params.env !== 'development' &&
      params.googleTagID
    ) {
      const gtmScript = document.createElement('script');

      gtmScript.innerHTML = `
        (function(w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
          });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src =
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', '${params.googleTagID}');`

      document.head.appendChild(gtmScript);

      return () => {
        if (
          document &&
          document.head &&
          document.head.contains(gtmScript)
        ) {
          document.head.removeChild(gtmScript)
        }
      }
    }
  }, [
    params.env,
    params.googleTagID,
  ]);
}

export default useGTCScript;
