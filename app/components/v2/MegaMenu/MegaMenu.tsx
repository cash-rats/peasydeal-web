import { Link } from "react-router";
import { cn } from "~/lib/utils";

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuCategory {
  heading: string;
  href?: string;
  links: MegaMenuLink[];
}

export interface MegaMenuConfig {
  /** Left column: large quick links */
  quickLinks?: MegaMenuLink[];
  /** Middle columns: category lists */
  categories?: MegaMenuCategory[];
}

export interface MegaMenuProps {
  config: MegaMenuConfig;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  className?: string;
}

export function MegaMenu({
  config,
  isOpen,
  onClose,
  onMouseEnter,
  className,
}: MegaMenuProps) {
  const { quickLinks = [], categories = [] } = config;

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
        onMouseEnter={onMouseEnter}
        onMouseLeave={onClose}
      >
        <div className="mx-auto max-w-[var(--container-max)] p-12">
          <div className="grid grid-cols-[200px_1fr] gap-12">
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

            {/* Column 2 — All categories in a multi-column grid */}
            {categories.length > 0 && (
              <div className="grid grid-cols-3 redesign-md:grid-cols-4 gap-x-5 gap-y-4">
                {categories.map((cat, i) => (
                  <nav key={i} className="flex flex-col">
                    {cat.href ? (
                      <Link
                        to={cat.href}
                        className="mb-3 font-body text-[15px] font-normal text-black no-underline block hover:text-[#666] transition-colors duration-fast"
                        onClick={onClose}
                      >
                        {cat.heading}
                      </Link>
                    ) : (
                      <h3 className="mb-3 font-body text-[15px] font-bold text-black">
                        {cat.heading}
                      </h3>
                    )}
                    <div className="flex flex-col gap-1">
                      {cat.links.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={cn(
                            "font-body text-[13px] font-thin text-[#555] no-underline leading-[1.5]",
                            "hover:text-black transition-colors duration-fast"
                          )}
                          onClick={onClose}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
