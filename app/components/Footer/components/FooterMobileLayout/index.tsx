import type { Category } from '~/shared/types';

import LogoSection from '../LogoSection';
import ProductsSecions from '../ProductsSection';
import CompanySection from '../CompanySection';

// import EventSection from '../EventSection';
// import EmailSubscribe from '../EmailSubscribe';

interface FooterMobileLayoutProps {
  categories?: Category[];
}

function FooterMobileLayout({ categories = [] }: FooterMobileLayoutProps) {
  return (
    <ul className="w-full list-none py-0 px-4 flex flex-col gap-6">
      <li className="box-border flex flex-col items-center py-[10px]">
        <LogoSection />
      </li>

      <li className="box-border flex flex-col items-center py-[10px]">
        <div className="flex-auto">
          <ProductsSecions categories={categories} />
        </div>
      </li>

      <li className="box-border flex flex-col items-center gap-4 py-[10px]">
        {/* <EventSection /> */}
        <CompanySection />
      </li>
    </ul>

  )
}

export default FooterMobileLayout;
