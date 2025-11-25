import { memo, useId, useState } from 'react';
import { Link } from 'react-router';
import type { LinksFunction } from 'react-router';
import { FiMenu } from 'react-icons/fi';

import type { Category } from '~/shared/types';

import PeasyDeal from './images/peasydeal_logo.svg';
import type { IMegaMenuContent} from '../MegaMenuContent';
import MegaMenuContent, { links as MegaMenuContentLink } from '../MegaMenuContent';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent } from '~/components/ui/sheet';

interface LogoBarProps {
  categories?: Category[];
}

export const links: LinksFunction = () => {
  return [
    ...MegaMenuContentLink(),
  ];
}

const MegaMemo = memo(({
  categories,
  onClose,
  ItemNode,
}: IMegaMenuContent) => {
  return (
    <MegaMenuContent
      categories={categories}
      onClose={onClose}
      ItemNode={ItemNode}
    />
  );
});

MegaMemo.displayName = 'MegaMenuContent';

function LogoBar({ categories = [] }: LogoBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mobileSheetId = useId();

  return (
    <div className="flex items-center mr-4 my-auto relative">
      <div className="">
        <div className="block md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button
              aria-label='Open Category Menu'
              aria-haspopup='dialog'
              aria-controls={mobileSheetId}
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(true)}
              className='h-11 w-11 rounded-full bg-white shadow-sm md:hidden'
            >
              <FiMenu className="text-[28px] text-[#e6007e]" />
            </Button>

            <SheetContent
              id={mobileSheetId}
              side="left"
              className="w-[85vw] max-w-sm border-r border-border p-0"
            >
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Browse categories
                </p>
              </div>
              <div className="h-full overflow-y-auto px-2 py-4">
                <MegaMemo
                  categories={categories}
                  onClose={() => setIsOpen(false)}
                  ItemNode="div"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Link to='/' className="
        leading-[20px]
        left-10 top-[10px]
        flex items-center
        scale-110 md:scale-1
        ml-[4px] md:ml-0
      ">
        <picture>
          <source type="image/svg+xml" srcSet={PeasyDeal} />
          <img alt='PeasyDeal Logo' className='h-[42px] md:h-[60px]' src={PeasyDeal} />
        </picture>
      </Link>
    </div>
  );
}

export default LogoBar;
