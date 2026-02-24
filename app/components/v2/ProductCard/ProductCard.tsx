import { useMemo, useState, useCallback } from "react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/v2/Badge";
import type { Product } from "~/shared/types";
import { SUPER_DEAL_OFF } from "~/shared/constants";

export interface ProductCardProps {
  product?: Product;
  loading?: boolean;
  /** Category label shown above title */
  categoryLabel?: string;
  /** Show border instead of background (for "recommended" context) */
  bordered?: boolean;
  /** Called when user clicks the card */
  onClick?: (product: Product) => void;
  /** Called when user clicks "Add to Cart" / "Choose Options" */
  onAddToCart?: (product: Product) => void;
  className?: string;
}

/** Maps tabComboType tags to Badge variants */
function getTagBadges(tabComboType: string | null): Array<{
  variant: "discount" | "new" | "selling-fast" | "hot" | "limited";
  label: string;
}> {
  if (!tabComboType) return [];
  const tags = tabComboType.split(",").map((t) => t.trim());
  const badges: Array<{
    variant: "discount" | "new" | "selling-fast" | "hot" | "limited";
    label: string;
  }> = [];

  for (const tag of tags) {
    switch (tag) {
      case "new":
        badges.push({ variant: "new", label: "New" });
        break;
      case "hot_deal":
        badges.push({ variant: "hot", label: "Hot" });
        break;
      case "super_deal":
        badges.push({ variant: "selling-fast", label: "Selling fast!" });
        break;
      case "price_off":
        // discount badge is handled separately from price calculation
        break;
    }
  }
  return badges;
}

function SkeletonCard() {
  return (
    <div className="w-full flex flex-col rounded-rd-md overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/5] bg-[#E0E0E0]" />
      <div className="p-4 pb-5 bg-white space-y-2">
        <div className="h-3 w-16 bg-[#E0E0E0] rounded" />
        <div className="h-4 w-full bg-[#E0E0E0] rounded" />
        <div className="h-4 w-2/3 bg-[#E0E0E0] rounded" />
        <div className="h-4 w-20 bg-[#E0E0E0] rounded mt-2" />
      </div>
    </div>
  );
}

function QuickViewIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.5 2.5L7.5 6L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductCard({
  product,
  loading = false,
  categoryLabel,
  bordered = false,
  onClick,
  onAddToCart,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const priceInfo = useMemo(() => {
    if (!product) return null;
    const hasSuperDeal = product.tabComboType?.includes("super_deal");
    const effectiveSalePrice = hasSuperDeal
      ? product.salePrice * SUPER_DEAL_OFF
      : product.salePrice;
    const discountPercent = Math.ceil(
      (1 - effectiveSalePrice / product.retailPrice) * 100
    );
    const isOnSale = effectiveSalePrice < product.retailPrice;
    return { effectiveSalePrice, discountPercent, isOnSale };
  }, [product]);

  const tagBadges = useMemo(
    () => getTagBadges(product?.tabComboType ?? null),
    [product?.tabComboType]
  );

  const hasVariations = (product?.variations?.length ?? 0) > 1;
  const ctaText = hasVariations ? "Choose Options" : "Add to Cart";

  const handleCardClick = useCallback(() => {
    if (product && onClick) onClick(product);
  }, [product, onClick]);

  const handleCtaClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (product && onAddToCart) onAddToCart(product);
    },
    [product, onAddToCart]
  );

  if (loading || !product) {
    return <SkeletonCard />;
  }

  return (
    <div
      className={cn(
        "group w-full flex flex-col rounded-rd-md overflow-hidden cursor-pointer",
        "transition-all duration-normal",
        "hover:shadow-card-hover hover:-translate-y-0.5",
        "active:shadow-overlay active:translate-y-0",
        bordered
          ? "border border-[#E0E0E0] bg-white"
          : "bg-[#F5F5F5]",
        className
      )}
      onClick={handleCardClick}
      role="article"
    >
      {/* Image Area */}
      <div className="relative w-full aspect-[4/5] flex items-center justify-center p-5 overflow-hidden">
        {/* Primary Image */}
        {product.main_pic && !imageError ? (
          <img
            src={product.main_pic}
            alt={product.title}
            className="max-w-[80%] max-h-[80%] object-contain transition-opacity duration-normal"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#E8E8E8] flex items-center justify-center text-[#AAAAAA] text-caption">
            No image
          </div>
        )}

        {/* Badges (top-left) */}
        {(tagBadges.length > 0 || (priceInfo?.isOnSale && priceInfo.discountPercent >= 10)) && (
          <div className="absolute top-3 left-3 flex gap-1.5 z-[3]">
            {priceInfo?.isOnSale && priceInfo.discountPercent >= 10 && (
              <Badge variant="discount">-{priceInfo.discountPercent}%</Badge>
            )}
            {tagBadges.map((badge) => (
              <Badge key={badge.variant} variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Quick View Icon (top-right, hover reveal) */}
        <button
          type="button"
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full",
            "bg-white shadow-overlay",
            "flex items-center justify-center",
            "z-[2] text-black",
            "opacity-0 translate-y-1",
            "transition-all duration-fast",
            "group-hover:opacity-100 group-hover:translate-y-0",
            "hover:bg-[#F5F5F5]"
          )}
          aria-label="Quick view"
          onClick={(e) => e.stopPropagation()}
        >
          <QuickViewIcon />
        </button>

        {/* Image Carousel Arrow (right side, hover reveal) */}
        {/* Only shown if product has multiple images — for now single image */}

        {/* "Choose Options" / "Add to Cart" CTA Overlay (hover reveal) */}
        <button
          type="button"
          className={cn(
            "absolute bottom-3 left-3 right-3 h-10",
            "bg-white/95 backdrop-blur-[4px]",
            "border-none rounded-rd-sm",
            "font-body text-[13px] font-semibold text-black",
            "flex items-center justify-center",
            "z-[2] cursor-pointer",
            "opacity-0 translate-y-2",
            "transition-all duration-fast",
            "group-hover:opacity-100 group-hover:translate-y-0",
            "hover:bg-white"
          )}
          onClick={handleCtaClick}
        >
          {ctaText}
        </button>
      </div>

      {/* Text Area */}
      <div className="px-4 pt-4 pb-5 bg-white">
        {/* Category */}
        {categoryLabel && (
          <p className="font-body text-caption font-normal text-[#888888] mb-1 leading-snug">
            {categoryLabel}
          </p>
        )}

        {/* Product Name */}
        <h3
          className={cn(
            "font-body text-card-title font-semibold text-black",
            "leading-tight mb-2",
            "line-clamp-2"
          )}
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {priceInfo?.isOnSale ? (
            <>
              <span className="font-body text-[14px] font-semibold text-[#C75050]">
                ${priceInfo.effectiveSalePrice.toFixed(2)}
              </span>
              <span className="font-body text-[13px] font-normal text-[#999999] line-through">
                ${product.retailPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-body text-[14px] font-semibold text-black">
              ${product.retailPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
