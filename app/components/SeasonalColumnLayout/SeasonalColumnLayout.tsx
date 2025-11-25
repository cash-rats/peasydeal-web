import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import type { LinksFunction } from 'react-router';

import type { Category } from '~/shared/types';

import styles from './styles/SeasonalColumnLayout.css?url';
import ActivityGrid, { links as ActivityGridLinks } from './components/SeasonalGrid/SeasonalGrid';

export const links: LinksFunction = () => {
  return [
    ...ActivityGridLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

export type SeasonalInfo = {
  src: string;
} & Category;

interface SeasonalLayoutProps {
  seasonals?: SeasonalInfo[];
};

function ActivityColumnLayout({ seasonals = [] }: SeasonalLayoutProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div ref={ref} className="ActivityLayout__wrapper">
      {
        seasonals.map((seasonal, index) => {
          return (
            <ActivityGrid
              catId={seasonal.catId}
              title={seasonal.title}
              key={index} src={seasonal.src}
            />
          )
        })
      }
    </div>
  );
}

export default forwardRef<HTMLDivElement, SeasonalLayoutProps>(ActivityColumnLayout);