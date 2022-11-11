import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import SunShinePng from './assets/SunShine.png';
import styles from './styles/PriceTags.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SunShineProps {
  text: ReactNode;
};

export default function SunShine({ text }: SunShineProps) {
  return (
    <div className="SunShineTag">
      <div className="SunShineTag__img">
        <img alt='price off!' src={SunShinePng} />
      </div>

      <p className="SunShineTag__text">
        {text}
      </p>
    </div>
  )
}