import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import SunShinePng from './assets/SunShine.png';
import styles from './styles/SunShineTag.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SunShineProps {
  direction?: 'left' | 'right';
  text: ReactNode;
};

export default function SunShine({ direction = 'left', text }: SunShineProps) {
  return (
    <div className={`SunShineTag ${direction === 'left'
        ? 'SunShineTag__left'
        : 'SunShineTag__right'

      }`}>
      <div className="SunShineTag__img">
        <img alt='price off!' src={SunShinePng} />
      </div>

      <p className="SunShineTag__text">
        {text}
      </p>
    </div>
  )
}