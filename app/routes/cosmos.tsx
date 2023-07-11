// import { useCallback, useState, useEffect } from "react";
// import type { HeadersFunction } from "@remix-run/node";

// import { decorators, fixtures, rendererConfig } from "~/cosmos.userdeps.js";

// const shouldLoadCosmos =
//   typeof window !== "undefined" && process.env.NODE_ENV === "development";

// export const headers: HeadersFunction = () => {
//   return { "Access-Control-Allow-Origin": "*" };
// };

// export default function Cosmos() {
//   const [cosmosLoaded, setCosmosLoaded] = useState(false);
//   const loadRenderer = useCallback(async () => {
//     const { mountDomRenderer } = (await import("react-cosmos/dom")).default;
//     mountDomRenderer({
//       decorators,
//       fixtures,
//       rendererConfig: {
//         ...rendererConfig,
//         containerQuerySelector: 'body',
//       }
//     });
//   }, []);

//   useEffect(() => {
//     if (shouldLoadCosmos && !cosmosLoaded) {
//       loadRenderer();
//       setCosmosLoaded(true);
//     }
//   }, []);
//   return null;
// }