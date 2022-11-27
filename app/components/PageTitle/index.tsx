import type { LinksFunction } from '@remix-run/node';

import styles from './styles/PageTitle.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="PageTitle__wrapper">
      <div className="PageTitle__title">
        <h1 className="PageTitle__text">
          <span className="PageTitle__limit-string"> {title} </span>
        </h1>
      </div>
    </div>
  )
}