import type { LinksFunction } from '@remix-run/node';

import styles from './styles/HorizontalProductsLayout.css';

import Grid from './HorizontalGrid';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function HorizontalProductsLayout() {
  return (
    <div className="HorizontalProductsLayout__wrapper">
      <Grid />
      <Grid />
      <Grid />
      <Grid />
    </div>
  );
}