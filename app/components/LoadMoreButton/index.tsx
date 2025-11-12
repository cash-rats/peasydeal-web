import type { ReactNode, MouseEvent } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '~/components/ui/button';

interface LoadMoreButtonProps {
  disabled?: boolean;
  loading?: boolean;
  text?: ReactNode;
  onClick?: (evt: MouseEvent<HTMLButtonElement>) => void;
}

export default function LoadMoreButton({
  disabled = false,
  loading = false,
  text = 'Show More',
  onClick = () => { },
}: LoadMoreButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      size="lg"
      aria-busy={loading}
      className="min-w-[140px]"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </span>
      ) : (
        text
      )}
    </Button>
  );
};
