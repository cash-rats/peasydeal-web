import type { LinksFunction } from '@remix-run/node';
import type { ReactNode } from 'react';

import styles from './styles/RightTiltBox.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface RightTiltBoxProps {
  text: ReactNode;
}

export default function RightTiltBox({ text }: RightTiltBoxProps) {
  return (
    <span className="RightTiltBox__text">
      {text}
    </span>
  );
}