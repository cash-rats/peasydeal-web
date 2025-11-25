import type { ReactNode } from 'react';
import type { LinksFunction } from 'react-router';

import useNprogress, { links as nprogressStyles } from '~/hooks/useNprogress';

export const links: LinksFunction = () => {
  return [
    ...nprogressStyles(),
  ];
};

export default function Layout({ children }: { children: ReactNode }) {
  useNprogress();
  return (
    <>
      {children}
    </>
  );
}
