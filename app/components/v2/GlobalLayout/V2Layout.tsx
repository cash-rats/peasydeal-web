/**
 * V2Layout — Shared global layout shell for v2 redesign.
 *
 * Composes: AnnouncementBar, Header, MegaMenu, MobileNavDrawer,
 * SearchDropdown, MobileSearch, and Footer.
 *
 * Cart count is managed via the CartContext (IndexedDB-backed).
 */
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router";

import type { Category } from "~/shared/types";
import { useCartCount } from "~/routes/hooks/useCartCount";
import { AnnouncementBar } from "~/components/v2/AnnouncementBar/AnnouncementBar";
import { Header } from "~/components/v2/Header/Header";
import { MegaMenu } from "~/components/v2/MegaMenu/MegaMenu";
import { MobileNavDrawer } from "~/components/v2/MobileNavDrawer/MobileNavDrawer";
import { SearchDropdown } from "~/components/v2/SearchDropdown";
import { MobileSearch } from "~/components/v2/MobileSearch";
import { Footer } from "~/components/v2/Footer/Footer";

import {
  categoriesToNavItems,
  categoriesToMegaMenuConfig,
  categoriesToMobileNav,
  getFooterLinkGroups,
} from "./mappers";

const ANNOUNCEMENT_MESSAGES = [
  "FREE SHIPPING ON ALL ORDERS $100+",
  "100% SATISFACTION GUARANTEED",
  "NEW DEALS ADDED DAILY",
];

interface V2LayoutProps {
  categories: Category[];
  navBarCategories: Category[];
  children: React.ReactNode;
}

export function V2Layout({
  categories,
  navBarCategories,
  children,
}: V2LayoutProps) {
  const navigate = useNavigate();
  const cartCount = useCartCount();

  // ---------- State ----------
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // ---------- Derived data ----------
  const navItems = categoriesToNavItems(navBarCategories);
  const megaMenuConfig = categoriesToMegaMenuConfig(categories);
  const mobileCategories = categoriesToMobileNav(categories);
  const footerLinkGroups = getFooterLinkGroups();

  // ---------- Handlers ----------
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelMegaClose = useCallback(() => {
    if (megaCloseTimer.current) {
      clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
  }, []);

  const handleDropdownOpen = useCallback((label: string) => {
    cancelMegaClose();
    if (label === "Shop") setMegaOpen(true);
  }, [cancelMegaClose]);

  const handleDropdownClose = useCallback(() => {
    cancelMegaClose();
    megaCloseTimer.current = setTimeout(() => {
      setMegaOpen(false);
    }, 200);
  }, [cancelMegaClose]);

  const handleMegaMenuEnter = useCallback(() => {
    cancelMegaClose();
  }, [cancelMegaClose]);

  const handleMegaMenuClose = useCallback(() => {
    cancelMegaClose();
    setMegaOpen(false);
  }, [cancelMegaClose]);

  const handleSearchClick = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleCartClick = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  const handleTrackingClick = useCallback(() => {
    navigate("/tracking");
  }, [navigate]);

  const handleMenuOpen = useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  return (
    <div className="v2 bg-white w-full">
      {/* Announcement bar */}
      <AnnouncementBar messages={ANNOUNCEMENT_MESSAGES} />

      {/* Header + MegaMenu + Search */}
      <div className="relative z-[1000]">
        <Header
          navItems={navItems}
          cartCount={cartCount}
          onDropdownOpen={handleDropdownOpen}
          onDropdownClose={handleDropdownClose}
          onSearchClick={handleSearchClick}
          onTrackingClick={handleTrackingClick}
          onCartClick={handleCartClick}
          onMenuOpen={handleMenuOpen}
        />
        <MegaMenu
          config={megaMenuConfig}
          isOpen={megaOpen}
          onMouseEnter={handleMegaMenuEnter}
          onClose={handleMegaMenuClose}
        />

        {/* Desktop search overlay */}
        {searchOpen && (
          <SearchDropdown onClose={() => setSearchOpen(false)} />
        )}
      </div>

      {/* Mobile nav drawer */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        categories={mobileCategories}
      />

      {/* Mobile search fullscreen */}
      <MobileSearch
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />

      {/* Page content */}
      <main className="min-h-[35rem]">{children}</main>

      {/* Footer */}
      <Footer
        linkGroups={footerLinkGroups}
        aboutDescription="PeasyDeal brings you the best deals on quality products — from beauty and fashion to home and electronics."
        aboutLinkHref="/about-us"
        legalLinks={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Use", href: "/terms-of-use" },
          { label: "Payment Policy", href: "/payment-policy" },
        ]}
        regionLabel="United Kingdom (GBP £)"
      />
    </div>
  );
}
