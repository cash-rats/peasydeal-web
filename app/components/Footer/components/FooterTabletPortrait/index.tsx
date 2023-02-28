import type { Category } from '~/shared/types';

import LogoSection from '../LogoSection';
import EmailSubscribe from '../EmailSubscribe';
import ProductSection from '../ProductsSection';
import ResourceSection from '../ResourceSection';
import CompanySection from '../CompanySection';

interface FooterTabletPortraitProps {
  categories?: Category[];
}

function FooterTabletPortrait({ categories = [] }: FooterTabletPortraitProps) {
  return (
    <div className="grid grid-rows-[300px_1fr]">
      <div className="
        grid grid-cols-2
        border-b-[1px] border-b-[#2E4E73]
      ">
        <LogoSection />
        <EmailSubscribe />
      </div>

      <div className="grid grid-cols-2 pt-10">
        <ProductSection categories={categories} />
        <div className="flex flex-col">
          {/* <ResourceSection /> */}
          <div className="mt-10">
            <CompanySection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterTabletPortrait;