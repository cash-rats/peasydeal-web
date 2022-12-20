import { MemoryRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { createTransitionManager } from "@remix-run/react/dist/transition";
import { LiveReload, Scripts, ScrollRestoration } from "@remix-run/react";

const clientRoutes = [
  {
    id: "idk",
    path: "idk",
    hasLoader: true,
    element: "",
    module: "",
    action: () => null,
  },
];

let context = {
  routeModules: { idk: { default: () => null } },
  manifest: {
    routes: {
      idk: {
        hasLoader: true,
        hasAction: false,
        hasCatchBoundary: false,
        hasErrorBoundary: false,
        id: "idk",
        module: "idk",
      },
    },
    entry: { imports: [], module: "" },
    url: "",
    version: "",
  },
  matches: [],
  clientRoutes,
  routeData: {},
  appState: {} as any,
  transitionManager: createTransitionManager({
    routes: clientRoutes,
    location: {
      key: "default",
      hash: "#hello",
      pathname: "/",
      search: "?a=b",
      state: {},
    },
    loaderData: {},
    onRedirect(to, state?) {
      console.log("redirected");
    },
  }),
};

const Decorator = ({ children }: { children: any }) => {
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    /// @ts-expect-error i swear to God importing is allowed
    import(
      /// @ts-expect-error Node expects CommonJS, but we're giving him ESM
      "@remix-run/react/dist/esm/components"
    ).then(
      (
        { RemixEntryContext }:
          typeof import("@remix-run/react/dist/components"),
      ) => {
        setResult(
          <RemixEntryContext.Provider value={context}>
            <MemoryRouter>
              {children}
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </MemoryRouter>
          </RemixEntryContext.Provider>,
        );
      },
    );
  }, []);

  if (!result) return <>Loading...</>;

  if (result) return result;
};
export default Decorator;