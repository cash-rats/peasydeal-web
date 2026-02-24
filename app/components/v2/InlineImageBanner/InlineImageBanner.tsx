import { cn } from "~/lib/utils";

export type InlineSegment =
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt?: string; shape: "pill" | "circle" | "rounded" };

export interface InlineImageBannerProps {
  segments: InlineSegment[];
  className?: string;
}

const shapeStyles: Record<string, string> = {
  pill: "w-[140px] h-16 rounded-[32px] max-redesign-md:w-[112px] max-redesign-md:h-[52px] max-redesign-sm:w-[100px] max-redesign-sm:h-12",
  circle: "w-[72px] h-[72px] rounded-full max-redesign-md:w-[58px] max-redesign-md:h-[58px] max-redesign-sm:w-14 max-redesign-sm:h-14",
  rounded: "w-[120px] h-16 rounded-2xl max-redesign-md:w-[96px] max-redesign-md:h-[52px] max-redesign-sm:w-[80px] max-redesign-sm:h-12",
};

export function InlineImageBanner({
  segments,
  className,
}: InlineImageBannerProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[900px] px-12 py-20 text-center",
        "max-redesign-sm:px-4 max-redesign-sm:py-12",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        {segments.map((segment, index) => {
          if (segment.type === "text") {
            return (
              <span
                key={index}
                className={cn(
                  "font-heading font-bold leading-[1.3] text-black",
                  "text-[48px] max-redesign-md:text-[36px] max-redesign-sm:text-[28px]"
                )}
              >
                {segment.content}
              </span>
            );
          }

          return (
            <span
              key={index}
              className={cn(
                "inline-flex overflow-hidden align-middle",
                shapeStyles[segment.shape]
              )}
            >
              <img
                src={segment.src}
                alt={segment.alt ?? ""}
                className="h-full w-full object-cover"
              />
            </span>
          );
        })}
      </div>
    </section>
  );
}
