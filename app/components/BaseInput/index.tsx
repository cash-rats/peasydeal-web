import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { cn } from '~/lib/utils';
import { Input } from '~/components/ui/input';

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  height?: CSSProperties['height'];
  rightaddon?: ReactNode;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ height, rightaddon, className, ...props }, ref) => (
    <div
      className="bg-white rounded-sm border border-[#707070] h-10 w-full px-4 mx-0 md:mx-2 relative flex items-center gap-2 shadow-searchbox box-border"
      style={{ height }}
    >
      <Input
        ref={ref}
        className={cn(
          'h-full border-0 px-0 py-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0',
          className,
        )}
        {...props}
      />
      {rightaddon}
    </div>
  ),
);

BaseInput.displayName = 'BaseInput';

export default BaseInput;
