import type { LinksFunction } from '@remix-run/node';
import type { ReactNode } from 'react';

import scratchPNG from './assets/scratch.png';
import styles from './styles/Scratch.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ScratchProps {
  text?: ReactNode;
  direction?: 'left' | 'right';
}

export default function Scratch({ text, direction = 'left' }: ScratchProps) {
  return (
    <div className={`ScratchTag ${direction === 'left'
      ? 'ScratchTag__left'
      : 'ScratchTag__right'
      }`}>
      <div className="ScratchTag__img">
        <img alt='price off' src={scratchPNG} />
      </div>

      <p className="ScratchTag__text"> {text} </p>
    </div>
  );
}