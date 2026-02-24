import { cn } from "~/lib/utils";

export interface HeroBannerCard {
  categoryLabel?: string;
  headline: string;
  ctaLabel: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt?: string;
  bgColor?: string;
}

export interface HeroBannerProps {
  cards: HeroBannerCard[];
  className?: string;
}

export function HeroBanner({ cards, className }: HeroBannerProps) {
  return (
    <section
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-12 pt-6",
        className
      )}
    >
      {/* Desktop: 3-col grid */}
      <div className="hidden redesign-sm:grid grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <BannerCard key={i} card={card} />
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex redesign-sm:hidden gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2">
        {cards.map((card, i) => (
          <div key={i} className="min-w-[85vw] snap-center flex-shrink-0">
            <BannerCard card={card} />
          </div>
        ))}
      </div>
    </section>
  );
}

function BannerCard({ card }: { card: HeroBannerCard }) {
  return (
    <a
      href={card.ctaHref ?? "#"}
      className={cn(
        "relative flex items-stretch rounded-2xl overflow-hidden cursor-pointer no-underline",
        "h-[280px] group",
        "transition-all duration-normal hover:shadow-card-hover hover:scale-[1.02]"
      )}
      style={{ backgroundColor: card.bgColor ?? "var(--color-bg-warm)" }}
    >
      {/* Text content (left ~55%) */}
      <div className="relative z-[1] w-[55%] p-8 flex flex-col justify-center">
        {card.categoryLabel && (
          <p className="font-body text-xs font-normal text-[#666] mb-2">
            {card.categoryLabel}
          </p>
        )}
        <h3 className="font-heading text-[28px] font-bold text-black leading-[1.2] mb-4">
          {card.headline}
        </h3>
        <span className="inline-flex items-center px-6 py-2.5 bg-black text-white font-body text-[13px] font-medium rounded-full w-fit">
          {card.ctaLabel}
        </span>
      </div>

      {/* Image (right ~45%) */}
      <div className="absolute right-0 top-0 bottom-0 w-[50%] overflow-hidden">
        <img
          src={card.imageSrc}
          alt={card.imageAlt ?? ""}
          className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
        />
      </div>
    </a>
  );
}
