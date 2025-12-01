import type { Category } from '~/shared/types';

import { Button } from '~/components/ui/button';

export interface IMegaMenu {
  category: Category;
  onOpen: (name: string) => void;
  onClose: (name: string) => void;
  onDelayedOpen: (name: string) => void;
  onDelayedClose: (name: string) => void;
  activeMenuName: string | null;
}

const MegaMenu = ({
  category,
  activeMenuName,
  onOpen,
  onClose,
  onDelayedOpen,
  onDelayedClose,
}: IMegaMenu) => {
  const isOpen = activeMenuName === category.name;

  return (
    <div>
      <Button
        variant="ghost"
        aria-label={category.name}
        className="
          text-sm lg:text-base
          px-0 lg:px-2
          py-2 md:py-4
          flex flex-col
          items-center relative
          w-full
        "
        onTouchEnd={e => {
          e.preventDefault();
          isOpen ? onClose(category.name) : onOpen(category.name);
        }}
        onMouseEnter={() => onDelayedOpen(category.name)}
        onMouseLeave={() => onDelayedClose(category.name)}
      >
        <div className="flex items-center">
          <span>{category.shortName || category.title}</span>
        </div>
      </Button>
    </div>
  )
}

export default MegaMenu;
