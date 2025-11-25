import type { LinksFunction } from 'react-router';
import type { ReactNode } from 'react';

import styles from './styles/RightTiltBox.css?url';

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