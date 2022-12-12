import type { LinksFunction } from '@remix-run/node';

import styles from './styles/SeasonalGrid.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SeasonalGridProps {
  title?: string;
  src?: string;
  catId?: string;
}

export default function ActivityGrid({
  title = '',
  src = '',
  catId = '',
}: SeasonalGridProps) {
  console.log('debug catID', catId);

  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      className="ActivityGrid"
    />
  );
}