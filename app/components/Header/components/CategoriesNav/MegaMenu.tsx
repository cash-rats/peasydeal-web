import type { Category } from '~/shared/types';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

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
        className={cn(
          "text-sm lg:text-base",
          "py-2 md:py-3 lg:py-4 px-3 md:px-4",
          "flex flex-col items-center relative w-full",
          "rounded-full bg-transparent text-gray-800",
          "hover:bg-gray-100 hover:text-gray-900 hover:ring-1 hover:ring-gray-200 hover:shadow-sm transition",
          isOpen && "bg-gray-100 text-gray-900 ring-1 ring-gray-200 shadow-sm"
        )}
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
