import { useEffect } from 'react';

type useRudderStackScriptParams = {
  env?: string | null | undefined;
  rudderStackKey?: string | null | undefined;
  rudderStackUrl?: string | null | undefined;
};

// <!-- Rudder stack. Load on client side only  -->
const useRudderStackScript = (params: useRudderStackScriptParams) => {
  useEffect(() => {
    const rudderStackScript = document.createElement('script');
    rudderStackScript.innerHTML = `
!function(){"use strict";var sdkBaseUrl="https://cdn.rudderlabs.com/beta/3.0.0-beta";var sdkName="rsa.min.js"
;var asyncScript=true;window.rudderAnalyticsBuildType="legacy",window.rudderanalytics=[]
;var e=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","setAnonymousId","startSession","endSession"]
;for(var n=0;n<e.length;n++){var d=e[n];window.rudderanalytics[d]=function(e){return function(){
window.rudderanalytics.push([e].concat(Array.prototype.slice.call(arguments)))}}(d)}try{
new Function('return import("")'),window.rudderAnalyticsBuildType="modern"}catch(a){}
if(window.rudderAnalyticsMount=function(){var e=document.createElement("script")
;e.src="".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName),e.async=asyncScript,
document.head?document.head.appendChild(e):document.body.appendChild(e)},"undefined"==typeof Promise){
var t=document.createElement("script")
;t.src="https://polyfill.io/v3/polyfill.min.js?features=globalThis%2CPromise&callback=rudderAnalyticsMount",
t.async=asyncScript,document.head?document.head.appendChild(t):document.body.appendChild(t)}else{
window.rudderAnalyticsMount()}window.rudderanalytics.load("${params.rudderStackKey}","${params.rudderStackUrl}",{})}();
        `;

    if (
      params.env &&
      params.env !== 'development' &&
      params.rudderStackKey &&
      params.rudderStackUrl
    ) {
      document.head.appendChild(rudderStackScript);
    }

    return () => {
      if (
        document &&
        document.head &&
        document.head.contains(rudderStackScript)
      ) {
        document.head.removeChild(rudderStackScript)
      }
    };
  }, [params]);
}

export default useRudderStackScript;