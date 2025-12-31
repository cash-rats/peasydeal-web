import type { ReactNode } from 'react';
import { Link } from 'react-router';

import Footer from '~/components/Footer';
import PeasyDealLogo from '~/components/Header/components/LogoBar/images/peasydeal_logo.svg';

type UtilityLayoutProps = {
  children: ReactNode;
  mainClassName?: string;
  showFooter?: boolean;
};

export default function UtilityLayout({
  children,
  mainClassName = 'flex-1',
  showFooter = true,
}: UtilityLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl items-center px-4 py-3">
          <Link to="/" aria-label="Go to homepage" className="inline-flex items-center">
            <picture>
              <source type="image/svg+xml" srcSet={PeasyDealLogo} />
              <img alt="PeasyDeal Logo" className="h-[42px] md:h-[60px]" src={PeasyDealLogo} />
            </picture>
          </Link>
        </div>
      </header>

      <main className={mainClassName}>{children}</main>

      {showFooter ? <Footer /> : null}
    </div>
  );
}
