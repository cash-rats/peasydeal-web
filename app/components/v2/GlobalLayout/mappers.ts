/**
 * Mappers: Category[] → v2 global layout component props
 *
 * Transforms the API Category data into the shapes expected by
 * Header (NavItem[]), MegaMenu (MegaMenuConfig), MobileNavDrawer
 * (MobileNavCategory[]), and Footer (FooterLinkGroup[]).
 */
import type { Category } from "~/shared/types";
import type { NavItem } from "~/components/v2/Header/Header";
import type {
  MegaMenuConfig,
  MegaMenuCategory,
} from "~/components/v2/MegaMenu/MegaMenu";
import type { MobileNavCategory } from "~/components/v2/MobileNavDrawer/MobileNavDrawer";
import type { FooterLinkGroup } from "~/components/v2/Footer/Footer";

/**
 * Build the top nav items for the v2 Header.
 * "Shop" gets a dropdown (opens MegaMenu); the rest are direct links.
 */
export function categoriesToNavItems(navBarCategories: Category[]): NavItem[] {
  return [
    { label: "Home", href: "/" },
    { label: "Shop", hasDropdown: true },
    ...navBarCategories
      .filter((c) => c.type !== "promotion") // skip hot_deal etc.
      .slice(0, 4)
      .map((cat) => ({
        label: cat.title,
        href: `/collection/${cat.name}`,
      })),
  ];
}

/**
 * Build the MegaMenu config from categories.
 * - quickLinks: static promotional links
 * - categories: first 2 top-level categories with their children
 */
export function categoriesToMegaMenuConfig(
  categories: Category[]
): MegaMenuConfig {
  const quickLinks = [
    { label: "Hot Deals", href: "/promotion/hot_deal" },
    { label: "New Arrivals", href: "/promotion/new_arrival" },
    { label: "Best Sellers", href: "/promotion/best_seller" },
    { label: "Shop All", href: "/shop-all" },
  ];

  // All taxonomy categories (non-promotion)
  const taxonomyCats = categories.filter(
    (c) => c.type !== "promotion"
  );

  const megaCategories: MegaMenuCategory[] = taxonomyCats.map((cat) => ({
    heading: cat.title,
    href: `/collection/${cat.name}`,
    links: (cat.children || []).slice(0, 4).map((child) => ({
      label: child.title,
      href: `/collection/${child.name}`,
    })),
  }));

  return {
    quickLinks,
    categories: megaCategories,
  };
}

/**
 * Build mobile nav categories for MobileNavDrawer.
 */
export function categoriesToMobileNav(
  categories: Category[]
): MobileNavCategory[] {
  const items: MobileNavCategory[] = [{ label: "Home", href: "/" }];

  // "Shop" accordion with top-level subcategories
  const shopChildren = categories
    .filter((c) => c.type !== "promotion")
    .slice(0, 10)
    .map((cat) => ({
      label: cat.title,
      href: `/collection/${cat.name}`,
    }));

  if (shopChildren.length > 0) {
    items.push({ label: "Shop", children: shopChildren });
  }

  // Promotions as direct links
  categories
    .filter((c) => c.type === "promotion")
    .forEach((promo) => {
      items.push({
        label: promo.title,
        href: `/collection/${promo.name}`,
      });
    });

  items.push({ label: "Blog", href: "/blog" });
  items.push({ label: "Track Order", href: "/tracking" });

  return items;
}

/**
 * Static footer link groups — not category-driven.
 */
export function getFooterLinkGroups(): FooterLinkGroup[] {
  return [
    {
      heading: "Shop",
      links: [
        { label: "Hot Deals", href: "/promotion/hot_deal" },
        { label: "New Arrivals", href: "/promotion/new_arrival" },
        { label: "All Products", href: "/shop-all" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      heading: "Customer Care",
      links: [
        { label: "Track Order", href: "/tracking" },
        { label: "Shipping & Returns", href: "/shipping-policy" },
        { label: "Return Policy", href: "/return-policy" },
        { label: "Contact Us", href: "/contact-us" },
      ],
    },
  ];
}
