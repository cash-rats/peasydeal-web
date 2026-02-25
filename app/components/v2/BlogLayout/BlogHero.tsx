import { cn } from "~/lib/utils";

export interface BlogHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function BlogHero({
  title = "Our Blog",
  subtitle = "Tips, stories, and inspiration for smarter shopping",
  className,
}: BlogHeroProps) {
  return (
    <div
      className={cn(
        "w-full bg-rd-bg-warm py-16 text-center",
        "max-redesign-sm:py-10 max-redesign-sm:px-4",
        className
      )}
    >
      <h1 className="font-heading text-hero font-bold text-black mb-3 max-redesign-sm:text-[32px]">
        {title}
      </h1>
      <p className="font-body text-base text-rd-text-body max-w-[480px] mx-auto">
        {subtitle}
      </p>
    </div>
  );
}
