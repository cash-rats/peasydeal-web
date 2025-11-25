import type { ReactNode } from 'react';

import Divider from '~/components/Divider';

type DividerContentProps = {
  icon?: ReactNode;
  text?: ReactNode
}

export default function DividerContent({ icon, text }: DividerContentProps) {
  return (
    <Divider text={
      text
        ? (
          <span className="flex justify-center items-center gap-1">
            {icon} {text}
          </span>
        )
        : null
    } />
  );
}