import type { LinksFunction } from '@remix-run/node';
import { Link } from 'react-router';

import styles from './styles/SeasonalGrid.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SeasonalGridProps {
  title?: string;
  src?: string;
  catId: number | string;
}

export default function ActivityGrid({
  title = '',
  src = '',
  catId,
}: SeasonalGridProps) {
  return (
    <Link to={`/${title}`}>
      <div
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        className="ActivityGrid"
      />
    </Link>
  );
}