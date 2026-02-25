import { cn } from "~/lib/utils";

export interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "w-full bg-rd-bg-warm rounded-rd-lg py-12 px-10 text-center mb-8",
        "max-redesign-sm:py-8 max-redesign-sm:px-6 max-redesign-sm:rounded-rd-md",
        className
      )}
    >
      <h1 className="font-heading text-4xl font-bold text-black leading-tight max-redesign-sm:text-[28px]">
        {title}
      </h1>
      {subtitle && (
        <p className="font-body text-[15px] text-rd-text-body mt-3 max-w-[480px] mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
