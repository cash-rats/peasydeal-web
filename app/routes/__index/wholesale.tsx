import type { LinksFunction } from '@remix-run/node';

import styles from './styles/StaticPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function WholeSale() {
  return (
    <div className="StaticPage-page">
      <h1 className="StaticPage-title">Wholesale</h1>
      <p className="StaticPage-content">
        Looking for placing a wholesale order for team uniform, family shirt, own brand goods ? Then you've come to the right place. We have a variety of products for you to choose and create your own design! If you need help with wholesale order, please don't hesitate to contact us at contactus @topersonalised.com.We are willing to help you with any questions.
      </p>
    </div>
  );
}