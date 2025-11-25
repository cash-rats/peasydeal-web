import { useId, useState } from 'react';
import { Search } from 'lucide-react';

import BaseInput from '~/components/BaseInput';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export default function SearchBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobilePanelId = useId();

  const SearchField = ({ className }: { className?: string }) => (
    <form
      className={cn('w-full', className)}
      onSubmit={event => event.preventDefault()}
    >
      <BaseInput
        type="text"
        placeholder="What are you looking for?"
        aria-label="Search products"
        rightaddon={
          <Button
            type="submit"
            size="icon"
            className="bg-[#555BBD] text-white hover:bg-[#4b50a5]"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Search</span>
          </Button>
        }
      />
    </form>
  );

  return (
    <div className="relative w-full max-w-[886px] flex-1 lg:mx-[15px]">
      <div className="hidden lg:block">
        <SearchField />
      </div>

      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={isMobileOpen}
            aria-controls={mobilePanelId}
            aria-label={isMobileOpen ? 'Hide search' : 'Show search'}
            onClick={() => setIsMobileOpen(prev => !prev)}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <div
          id={mobilePanelId}
          className={cn(
            'w-full rounded-md border border-border bg-background p-2 shadow-lg',
            isMobileOpen ? 'block' : 'hidden',
          )}
        >
          <SearchField />
        </div>
      </div>
    </div>
  );
}
