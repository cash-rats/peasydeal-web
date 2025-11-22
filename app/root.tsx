import type { ReactNode } from 'react';
import type { LinksFunction, MetaFunction } from 'react-router';
import {
  Links,
  Meta,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';

export const links: LinksFunction = () => [];

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { title: 'Peasydeal Debug' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
];

interface DocumentProps {
  children: ReactNode;
}

function Document({ children }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <main>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{typeof error.data === 'string' ? error.data : 'Something went wrong.'}</p>
        </main>
      </Document>
    );
  }

  return (
    <Document>
      <main>
        <h1>Unexpected error</h1>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </main>
    </Document>
  );
}

export default function App() {
  return (
    <Document>
      from root!
    </Document>
  );
}
