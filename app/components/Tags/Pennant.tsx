import type { LinksFunction } from '@remix-run/node';
import type { ReactNode } from 'react';

import styles from './styles/Pennant.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface PennantProps {
  text1?: ReactNode;
  text2?: ReactNode;
  direction?: 'left' | 'right';
}
// Thanks to: https://codepen.io/crayon-code/pen/vYXpmPB
export default function Pennant({ text1, text2, direction = 'left' }: PennantProps) {
  return (
    <div className={`Pennent__ribbon down ${direction === 'left'
      ? 'Pennent__left'
      : 'Pennent__right'
      } `}>
      <div className="content">
        <span className="Pennent__text1" >{text1}</span>
        <span className="Pennent__text2">{text2}</span>
      </div>
    </div>
  );
}