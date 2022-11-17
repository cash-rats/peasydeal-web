import type { LinksFunction } from '@remix-run/node';

import type { Category } from '~/shared/types';

import styles from './styles/ActivityColumnLayout.css';
import ActivityGrid, { links as ActivityGridLinks } from '../ActivityGrid/ActivityGrid';

export const links: LinksFunction = () => {
  return [
    ...ActivityGridLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

export type ActivityInfo = {
  src: string;
} & Category;

interface ActivityLayoutProps {
  activities?: ActivityInfo[];
};

export default function ActivityColumnLayout({ activities = [] }: ActivityLayoutProps) {
  return (
    <div className="ActivityLayout__wrapper">
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