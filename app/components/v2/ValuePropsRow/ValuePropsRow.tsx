import { cn } from "~/lib/utils";

export interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export interface ValuePropsRowProps {
  items: ValueProp[];
  className?: string;
}

export function ValuePropsRow({ items, className }: ValuePropsRowProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-16",
        className
      )}
    >
      <div
        className={cn(
          "grid border-b border-[#E0E0E0] pb-16 text-center",
          "grid-cols-2 gap-6",
          "redesign-sm:gap-10",
          "redesign-md:grid-cols-4 redesign-md:gap-8"
        )}
      >
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-5 h-12 w-12 text-black">{item.icon}</div>

            <h3 className="mb-2 font-body text-[16px] font-bold text-black">
              {item.title}
            </h3>

            {item.description && (
              <p className="hidden max-w-[220px] font-body text-[13px] font-normal leading-[1.5] text-[#666] redesign-sm:block">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
