import type { LinksFunction } from '@remix-run/node';
import type { Category } from '~/shared/types';

import SeasonalGrid from './SeasonalGrid';
import styles from './styles/SeasonalRowLayout.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export type SeasonalInfo = {
  src?: string;
} & Category;

interface SeasonalRowLayoutProps {
  activities: SeasonalInfo[];
}

export default function ActivityRowLayout({ activities = [] }: SeasonalRowLayoutProps) {
  return (
    <div className="ActivityRowLayout">
      {
        activities.map((activity, index) => {
          return (<SeasonalGrid
            key={index}
            src={activity.src}
            title={activity.title}
          />)
        })
      }
    </div>
  );
}