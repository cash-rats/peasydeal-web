import type { LinksFunction } from '@remix-run/node';

import type { Category } from '~/shared/types';

import styles from './styles/FooterMobileAccordion.css';
import { links as FooterContentLinks } from '../FooterContent';
import LogoSection from '../LogoSection';
import EmailSubscribe from '../EmailSubscribe';
import ProductsSecions from '../ProductsSection';
import ResourceSection from '../ResourceSection';
import CompanySection from '../CompanySection';

export const links: LinksFunction = () => {
  return [
    ...FooterContentLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

interface FooterMobileAccordionProps {
  categories?: Category[];
}

function FooterMobileAccordion({ categories = [] }: FooterMobileAccordionProps) {
  return (
    <ul className="w-full list-none py-0 px-4 flex flex-col gap-4">
      <li>
        <LogoSection />
      </li>
      <li className="border-b-[1px] pb-4  border-b-[#2E4E73]">
        <EmailSubscribe />
      </li>

      <li className="flex flex-row justify-between">
        <ProductsSecions categories={categories} />

        <div className="600:hidden">
          <ResourceSection />
        </div>
      </li>

      <li >
        <CompanySection />
      </li>

      <li>
        <ResourceSection />
      </li>
    </ul>

  )
}

export default FooterMobileAccordion;