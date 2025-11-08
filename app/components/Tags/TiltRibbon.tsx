import type { ReactNode } from 'react';
import type { LinksFunction } from 'react-router';

import styles from './styles/TiltRibbon.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export type RibbonDirection = 'left' | 'right';

interface TiltRibbonProps {
  text?: ReactNode;
  direction?: RibbonDirection;
};

// Thanks to `https://codepen.io/nxworld/pen/oLdoWb` for ribbon styling
export default function TiltRibbon({ text, direction = 'left' }: TiltRibbonProps) {
  return (
    <>
      {
        text
          ? (
            <div className={`ribbon ${direction === 'left'
              ? 'ribbon-top-left'
              : 'ribbon-top-right'
              }`} >
              <span>
                {text}
              </span>
            </div>
          )
          : null
      }
    </>
  )
}