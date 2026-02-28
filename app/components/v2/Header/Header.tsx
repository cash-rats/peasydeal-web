import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

export interface NavItem {
  label: string;
  href?: string;
  /** If true, renders a dropdown chevron and triggers onDropdownOpen */
  hasDropdown?: boolean;
}

export interface HeaderProps {
  /** Logo text (e.g. "PeasyDeal") */
  logoText?: string;
  logoHref?: string;
  navItems?: NavItem[];
  cartCount?: number;
  /** Called when a dropdown nav item is hovered (desktop) */
  onDropdownOpen?: (label: string) => void;
  onDropdownClose?: () => void;
  onSearchClick?: () => void;
  onAccountClick?: () => void;
  onTrackingClick?: () => void;
  onCartClick?: () => void;
  onMenuOpen?: () => void;
  className?: string;
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 15L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 6H19L17.5 14H7.5L6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 6H13V14H3V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 9H17.2L19 11.2V14H13V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header({
  logoText = "PeasyDeal",
  logoHref = "/",
  navItems = [],
  cartCount = 0,
  onDropdownOpen,
  onDropdownClose,
  onSearchClick,
  onAccountClick,
  onTrackingClick,
  onCartClick,
  onMenuOpen,
  className,
}: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 72);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavEnter = useCallback(
    (item: NavItem) => {
      if (item.hasDropdown) {
        setActiveDropdown(item.label);
        onDropdownOpen?.(item.label);
      }
    },
    [onDropdownOpen]
  );

  const handleNavLeave = useCallback(() => {
    setActiveDropdown(null);
    onDropdownClose?.();
  }, [onDropdownClose]);

  return (
    <header
      className={cn(
        "w-full bg-white z-[1000]",
        "sticky top-0",
        "transition-shadow duration-normal",
        isSticky && "shadow-header-sticky",
        className
      )}
    >
      {/* Desktop header */}
      <div
        className={cn(
          "mx-auto hidden redesign-sm:grid",
          "max-w-[var(--container-max)] h-[72px] items-center",
          "grid-cols-[1fr_auto_1fr] px-12"
        )}
      >
        {/* Logo */}
        <div className="justify-self-start">
          <Link
            to={logoHref}
            className="font-heading text-[28px] font-black text-black no-underline tracking-[-0.5px]"
          >
            {logoText}
          </Link>
        </div>

        {/* Nav center */}
        <nav className="flex items-center gap-8" onMouseLeave={handleNavLeave}>
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => handleNavEnter(item)}
            >
              {item.href && !item.hasDropdown ? (
                <Link
                  to={item.href}
                  className={cn(
                    "font-body text-[15px] font-normal text-black no-underline",
                    "hover:underline hover:underline-offset-4 hover:[text-decoration-thickness:1.5px]",
                    "transition-all duration-fast"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 bg-transparent border-none cursor-pointer p-0",
                    "font-body text-[15px] font-normal text-black",
                    "hover:underline hover:underline-offset-4 hover:[text-decoration-thickness:1.5px]"
                  )}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDownIcon
                      className={cn(
                        "ml-1 transition-transform duration-fast",
                        activeDropdown === item.label && "rotate-180"
                      )}
                    />
                  )}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Utility icons */}
        <div className="flex items-center gap-5 justify-self-end">
          <button
            type="button"
            className="bg-transparent border-none cursor-pointer p-0 text-black hover:text-[#666] transition-colors duration-fast"
            aria-label="Search"
            onClick={onSearchClick}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="bg-transparent border-none cursor-pointer p-0 text-black hover:text-[#666] transition-colors duration-fast"
            aria-label="Track Order"
            onClick={onTrackingClick}
          >
            <TruckIcon />
          </button>
          {/* <button
            type="button"
            className="bg-transparent border-none cursor-pointer p-0 text-black hover:text-[#666] transition-colors duration-fast"
            aria-label="Account"
            onClick={onAccountClick}
          >
            <AccountIcon />
          </button> */}
          <button
            type="button"
            className="relative bg-transparent border-none cursor-pointer p-0 text-black hover:text-[#666] transition-colors duration-fast"
            aria-label={`Cart (${cartCount} items)`}
            onClick={onCartClick}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1.5",
                  "flex items-center justify-center",
                  "w-4 h-4 rounded-full bg-[#C75050] text-white",
                  "font-body text-[10px] font-bold leading-none"
                )}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div
        className={cn(
          "flex redesign-sm:hidden items-center justify-between",
          "h-14 px-4"
        )}
      >
        <button
          type="button"
          className="bg-transparent border-none cursor-pointer p-0 text-black"
          aria-label="Open menu"
          onClick={onMenuOpen}
        >
          <HamburgerIcon />
        </button>

        <Link
          to={logoHref}
          className="font-heading text-[22px] font-black text-black no-underline tracking-[-0.5px]"
        >
          {logoText}
        </Link>

        <button
          type="button"
          className="relative bg-transparent border-none cursor-pointer p-0 text-black"
          aria-label={`Cart (${cartCount} items)`}
          onClick={onCartClick}
        >
          <CartIcon />
          {cartCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -right-1.5",
                "flex items-center justify-center",
                "w-4 h-4 rounded-full bg-[#C75050] text-white",
                "font-body text-[10px] font-bold leading-none"
              )}
            >
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
