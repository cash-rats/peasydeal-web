import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/RoundCornerTag.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface RoundCornerTagProps {
  text?: ReactNode;
}

export default function RoundCornerTag({ text }: RoundCornerTagProps) {
  return (
    <div className="RoundCornerTag">
      {text}
    </div>
  )
}