import type { LinksFunction } from 'react-router';

import type { Category } from '~/shared/types';

import styles from './styles/FooterMobileLayout.css?url';
import { links as FooterContentLinks } from '../FooterContent';
import LogoSection from '../LogoSection';
import ProductsSecions from '../ProductsSection';
import CompanySection from '../CompanySection';

// import EventSection from '../EventSection';
// import EmailSubscribe from '../EmailSubscribe';

export const links: LinksFunction = () => {
  return [
    ...FooterContentLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

interface FooterMobileLayoutProps {
  categories?: Category[];
}

function FooterMobileLayout({ categories = [] }: FooterMobileLayoutProps) {
  return (
    <ul className="w-full list-none py-0 px-4 flex flex-col gap-6">
      <li>
        <LogoSection />
      </li>

      <li className="flex flex-row">
        <div className='flex-auto'>
          <ProductsSecions categories={categories} />
        </div>
      </li>

      <li className='flex flex-col gap-4'>
        {/* <EventSection /> */}
        <CompanySection />
      </li>
    </ul>

  )
}

export default FooterMobileLayout;
