
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/ActivityRowLayout.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ActivityGridProps {
  title?: string;
  src?: string;
  catID?: string;
}

export default function ActivityGrid({
  title = '',
  src = '',
  catID = '',
}: ActivityGridProps) {
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      className="ActivityRowLayout__grid"
    />
  );
}