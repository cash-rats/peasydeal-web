import type { LinksFunction } from '@remix-run/node';
import type { Category } from '~/shared/types';

import ActivityGrid from './ActivityGrid';
import styles from './styles/ActivityRowLayout.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export type ActivityInfo = {
  src?: string;
} & Category;

interface ActivityRowLayoutProps {
  activities: ActivityInfo[];
}

export default function ActivityRowLayout({ activities = [] }: ActivityRowLayoutProps) {
  return (
    <div className="ActivityRowLayout">
      {
        activities.map((activity, index) => {
          return (<ActivityGrid key={index} src={activity.src} />)
        })
      }
    </div>
  );
}