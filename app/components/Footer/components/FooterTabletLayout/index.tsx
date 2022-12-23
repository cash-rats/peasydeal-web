import type { LinksFunction } from '@remix-run/node';
import type { ReactNode } from 'react';

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
  ];
};

function TabletFooterContent({ children }: { children: ReactNode }) {
  return (
    <div className="px-2 last:border-r-0">
      {children}
    </div>
  )
}

/*
  TODOs:
    Email subscribe function
*/
function FooterTabletLayout() {
  return (
    <div className="
      grid grid-cols-[50%_50%] pt-7 px-4
      pb-0 bg-[#ededed] border-solid
    border-[#e5e5e5]
      lg:grid-cols-[25%_25%_25%_25%]
    border-r-[#e5e5e5]
    "
    >
      <TabletFooterContent>
        <PolicyContent />
      </TabletFooterContent>

      <TabletFooterContent>
        <ServiceContent />
      </TabletFooterContent>

      <TabletFooterContent>
        <ContactUsContent />
      </TabletFooterContent>

      <TabletFooterContent>
        <SubscribeContent />
      </TabletFooterContent>
    </div>
  );
}

export default FooterTabletLayout;