import { useRef, useCallback, useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/v2/Badge";

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuCategory {
  heading: string;
  links: MegaMenuLink[];
}

export interface MegaMenuProduct {
  id: string;
  imageSrc: string;
  category?: string;
  name: string;
  salePrice?: number;
  retailPrice: number;
  discountPercent?: number;
  href: string;
}

export interface MegaMenuConfig {
  /** Left column: large quick links */
  quickLinks?: MegaMenuLink[];
  /** Middle columns: category lists */
  categories?: MegaMenuCategory[];
  /** Right column: trending products */
  trendingTitle?: string;
  trendingProducts?: MegaMenuProduct[];
}

export interface MegaMenuProps {
  config: MegaMenuConfig;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7.5 2.5L4.5 6L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MegaMenu({
  config,
  isOpen,
  onClose,
  className,
}: MegaMenuProps) {
  const { quickLinks = [], categories = [], trendingTitle = "Trending", trendingProducts = [] } = config;
  const trackRef = useRef<HTMLDivElement>(null);
  const [productPage, setProductPage] = useState(0);
  const productsPerPage = 3;
  const totalPages = Math.ceil(trendingProducts.length / productsPerPage);

  const scrollProducts = useCallback(
    (dir: "prev" | "next") => {
      setProductPage((p) => {
        if (dir === "next") return Math.min(p + 1, totalPages - 1);
        return Math.max(p - 1, 0);
      });
    },
    [totalPages]
  );

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: productPage * productsPerPage * 176,
        behavior: "smooth",
      });
    }
  }, [productPage]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[998] bg-transparent"
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute top-[72px] left-0 w-full z-[999]",
          "bg-white border-t border-[#E0E0E0]",
          "animate-in fade-in slide-in-from-top-2 duration-200",
          className
        )}
        onMouseLeave={onClose}
      >
        <div className="mx-auto max-w-[var(--container-max)] p-12">
          <div className="grid grid-cols-[200px_200px_200px_1fr] gap-12">
            {/* Column 1 — Quick Links */}
            {quickLinks.length > 0 && (
              <nav className="flex flex-col gap-5">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "font-heading text-[22px] font-bold text-black no-underline leading-[1.2]",
                      "hover:text-[#666] transition-colors duration-fast"
                    )}
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Columns 2-3 — Category Lists */}
            {categories.map((cat, i) => (
              <nav key={i} className="flex flex-col">
                <h3 className="mb-4 font-body text-[16px] font-bold text-black">
                  {cat.heading}
                </h3>
                <div className="flex flex-col gap-2.5">
                  {cat.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "font-body text-[14px] font-normal text-black no-underline leading-[1.5]",
                        "hover:text-[#888] transition-colors duration-fast"
                      )}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ))}

            {/* Column 4 — Trending Products */}
            {trendingProducts.length > 0 && (
              <div>
                {/* Header row */}
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-body text-[16px] font-bold text-black">
                    {trendingTitle}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-[14px] text-[#888]">
                      {productPage + 1}/{totalPages}
                    </span>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        "border border-[#E0E0E0] bg-white text-black",
                        "hover:bg-[#F5F5F5] transition-colors duration-fast",
                        "disabled:opacity-30 disabled:cursor-default"
                      )}
                      onClick={() => scrollProducts("prev")}
                      disabled={productPage === 0}
                      aria-label="Previous products"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full",
                        "border border-[#E0E0E0] bg-white text-black",
                        "hover:bg-[#F5F5F5] transition-colors duration-fast",
                        "disabled:opacity-30 disabled:cursor-default"
                      )}
                      onClick={() => scrollProducts("next")}
                      disabled={productPage >= totalPages - 1}
                      aria-label="Next products"
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>

                {/* Product cards */}
                <div
                  ref={trackRef}
                  className="flex gap-4 overflow-hidden"
                >
                  {trendingProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={product.href}
                      className="w-[160px] shrink-0 no-underline"
                      onClick={onClose}
                    >
                      <div className="relative flex items-center justify-center w-[160px] h-[180px] bg-[#F5F5F5] rounded-xl">
                        <img
                          src={product.imageSrc}
                          alt={product.name}
                          className="max-w-[80%] max-h-[80%] object-contain"
                          loading="lazy"
                        />
                        {product.discountPercent != null && product.discountPercent >= 10 && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="discount">-{product.discountPercent}%</Badge>
                          </div>
                        )}
                      </div>
                      <div className="pt-3">
                        {product.category && (
                          <p className="font-body text-[12px] text-[#888] mb-0.5">{product.category}</p>
                        )}
                        <p className="font-body text-[14px] font-semibold text-black leading-[1.3] mb-1 line-clamp-1">
                          {product.name}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          {product.salePrice != null ? (
                            <>
                              <span className="font-body text-[14px] font-semibold text-[#C75050]">
                                ${product.salePrice.toFixed(2)}
                              </span>
                              <span className="font-body text-[13px] text-[#999] line-through">
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
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
