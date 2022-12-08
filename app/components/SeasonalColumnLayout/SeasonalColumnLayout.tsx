import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import type { LinksFunction } from '@remix-run/node';

import type { Category } from '~/shared/types';

import styles from './styles/SeasonalColumnLayout.css';
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

interface ActivityLayoutProps {
  activities?: SeasonalInfo[];
};

function ActivityColumnLayout({ activities = [] }: ActivityLayoutProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div ref={ref} className="ActivityLayout__wrapper">
      {
        activities.map((activity, index) => {
          return (
            <ActivityGrid key={index} src={activity.src} />
          )
        })
      }
    </div>
  );
}

export default forwardRef<HTMLDivElement, ActivityLayoutProps>(ActivityColumnLayout);