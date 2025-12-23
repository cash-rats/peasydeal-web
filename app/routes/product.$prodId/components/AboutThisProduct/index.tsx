import { useEffect, useRef, useState } from 'react';

import { cn } from '~/lib/utils';

import { productRichTextClass } from '../productRichTextClass';

const COLLAPSED_MAX_HEIGHT_PX = 360;

interface AboutThisProductProps {
  descriptionHtml?: string;
  showTitle?: boolean;
  containerClassName?: string;
  contentClassName?: string;
  fadeFromClassName?: string;
}

export default function AboutThisProduct({
  descriptionHtml = '',
  showTitle = true,
  containerClassName,
  contentClassName,
  fadeFromClassName = 'from-white',
}: AboutThisProductProps) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (typeof ResizeObserver === 'undefined') return;

    const checkOverflow = () => {
      setCanExpand(el.scrollHeight > COLLAPSED_MAX_HEIGHT_PX + 16);
    };

    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);

    return () => ro.disconnect();
  }, [descriptionHtml]);

  if (!descriptionHtml) return null;

  return (
    <section
      className={cn(
        'bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8',
        containerClassName,
      )}
    >
      {showTitle && (
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          About this product
        </h3>
      )}

      <div className="relative">
        <div
          className={cn(
            !expanded && canExpand && 'max-h-[360px] overflow-hidden',
            contentClassName,
          )}
        >
          <div ref={innerRef} className={productRichTextClass}>
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
        </div>

        {!expanded && canExpand && (
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t to-transparent',
              fadeFromClassName,
            )}
          />
        )}
      </div>

      {canExpand && (
        <button
          type="button"
          className="mt-5 text-sm font-semibold text-[#EC4899] hover:text-[#BE185D]"
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </section>
  );
}
