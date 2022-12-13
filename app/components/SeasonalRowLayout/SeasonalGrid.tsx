import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import styles from './styles/SeasonalRowLayout.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ActivityGridProps {
  title?: string;
  src?: string;
  catId?: string;
}

export default function ActivityGrid({
  title,
  src = '',
}: ActivityGridProps) {
  return (
    <Link to={`/${title}`}>
      <div
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        className="ActivityRowLayout__grid"
      />
    </Link>
  );
}