import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { Button, type ButtonProps } from '~/components/ui/button';
import { cn } from '~/lib/utils';

type ColorScheme =
  | 'buynow'
  | 'addtocart'
  | 'checkout'
  | 'cerise'
  | 'blackcontained'
  | 'green';

interface RoundButtonProps extends ButtonProps {
  colorScheme?: ColorScheme;
  loading?: boolean;
  leftIcon?: ReactNode;
}

const baseClasses =
  'w-full rounded-full px-6 py-3 text-base font-semibold shadow transition-colors disabled:opacity-70';

const schemeClasses: Record<ColorScheme, string> = {
  addtocart: 'bg-[#009378] text-white hover:bg-[#018268]',
  buynow: 'bg-[#D32D7D] text-white hover:bg-[#b32065]',
  cerise: 'bg-[#D32D7D] text-white hover:bg-[#b32065]',
  checkout: 'bg-[#ffa33a] text-[#1a1a1a] hover:bg-[#f19028]',
  blackcontained: 'bg-[#101010] text-white hover:bg-white hover:text-[#101010] border border-[#101010]',
  green: 'bg-[#50B04C] text-white hover:bg-[#00c441]',
};

function RoundButton({
  colorScheme = 'addtocart',
  loading = false,
  leftIcon,
  className,
  children,
  ...props
}: RoundButtonProps) {
  return (
    <Button
      className={cn(baseClasses, schemeClasses[colorScheme], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          leftIcon && <span>{leftIcon}</span>
        )}
        <span className="uppercase tracking-wide">{children}</span>
      </div>
    </Button>
  );
}

RoundButton.displayName = 'RoundButton';

export default RoundButton;
