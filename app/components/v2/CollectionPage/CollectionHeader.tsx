import { cn } from "~/lib/utils";
import { Breadcrumbs } from "~/components/v2/Breadcrumbs/Breadcrumbs";

export interface CollectionHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function CollectionHeader({
  title,
  description,
  breadcrumbs,
  className,
}: CollectionHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <div className="w-full bg-rd-bg-warm rounded-rd-lg py-12 px-10 max-redesign-sm:py-8 max-redesign-sm:px-6 max-redesign-sm:rounded-rd-md">
        <h1 className="font-heading text-4xl font-bold text-black leading-tight max-redesign-sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="font-body text-[15px] text-rd-text-body leading-relaxed mt-3 max-w-[600px]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
