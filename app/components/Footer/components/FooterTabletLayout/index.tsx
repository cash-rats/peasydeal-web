import type { LinksFunction } from '@remix-run/node';

import styles from './styles/FooterTabletLayout.css';
import {
  PolicyContent,
  ServiceContent,
  ContactUsContent,
  SubscribeContent,
  links as FooterContentLinks,
} from '../FooterContent';

export const links: LinksFunction = () => {
  return [
    ...FooterContentLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

/*
  TODOs:
    Email subscribe function
*/
function FooterTabletLayout() {
  return (
    <div className="footer-tablet-layout">
      <PolicyContent />
      <ServiceContent />
      <ContactUsContent />
      <SubscribeContent />
    </div>
  );
}

export default FooterTabletLayout;