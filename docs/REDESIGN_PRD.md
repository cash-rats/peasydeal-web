# PeasyDeal Website Redesign — Product Requirements Document

**Status:** Draft (Incremental — Screenshots in progress)
**Last Updated:** 2026-02-24
**Design Philosophy:** Premium Website Design (Halo Effect, Cognitive Load Reduction, Micro-Interactions)
**Precision Level:** Pixel-level design spec (not copywriting). All values are exact implementation targets.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design Principles](#2-design-principles)
3. [Global Elements](#3-global-elements)
   - 3.1 [Announcement Bar (Marquee)](#31-announcement-bar-marquee)
   - 3.2 [Header / Navbar](#32-header--navbar)
   - 3.3 [Mega Menu (Jumbo Dropdown)](#33-mega-menu-jumbo-dropdown)
4. [Home Page](#4-home-page)
   - 4.1 [Hero Section](#41-hero-section)
     - 4.1.A [Full-Width Hero Carousel (Slider)](#41a--full-width-hero-carousel-slider)
     - 4.1.B [3-Card Banner](#41b--3-card-banner)
   - 4.2 [Tagline / Value Proposition Banner](#42-tagline--value-proposition-banner)
   - 4.3 [Featured Campaign + Product Carousel Section](#43-featured-campaign--product-carousel-section)
   - 4.4 [Tabbed Product Grid (What's Hot / Best Sellers / Sale)](#44-tabbed-product-grid-whats-hot--best-sellers--sale)
   - 4.5 [Core Products Carousel (Large Detail Cards)](#45-core-products-carousel-large-detail-cards)
   - 4.6 [Lifestyle Gallery with Product Overlays](#46-lifestyle-gallery-with-product-overlays)
5. [Product Pages](#5-product-pages)
   - 5.1 [Breadcrumbs](#51-breadcrumbs)
   - 5.2 [Product Detail Layout](#52-product-detail-layout)
   - 5.3 [Product Image Gallery (Left Column)](#53-product-image-gallery-left-column)
   - 5.4 [Product Info (Right Column)](#54-product-info-right-column)
   - 5.5 [Recommended Products ("You may also like")](#55-recommended-products-you-may-also-like)
   - 5.6 [Sticky Add-to-Cart Bar](#56-sticky-add-to-cart-bar)
6. [Category / Collection Pages](#6-category--collection-pages)
7. [Search](#7-search)
8. [Cart / Checkout / Payment Flow](#8-cart--checkout--payment-flow)
   - 8.1 [Checkout Page — Global Layout](#81-checkout-page--global-layout)
   - 8.2 [Checkout Header](#82-checkout-header-left-column-top)
   - 8.3 [Express Checkout](#83-express-checkout)
   - 8.4 [Contact Information Section](#84-contact-information-section)
   - 8.5 [Shipping Address Section](#85-shipping-address-section)
   - 8.6 [Navigation Row](#86-navigation-row-bottom-of-left-column)
   - 8.7 [Policy Links](#87-policy-links-bottom-of-left-column)
   - 8.8 [Order Summary](#88-order-summary-right-column)
   - 8.9 [Form Input Component](#89-form-input-component-shared)
   - 8.10 [Cart Drawer (Slide-Out Sidebar)](#810-cart-drawer-slide-out-sidebar)
   - 8.10.B [Cart Page (Fallback)](#810b-cart-page-fallback--view-cart-destination)
   - 8.11 [Payment Step](#811-payment-step-stripe--paypal)
   - 8.12 [Payment Result Pages](#812-payment-result-pages)
   - 8.13 [Checkout Micro-Interactions](#813-checkout-micro-interactions-summary)
   - 8.14 [Premium Rationale](#814-premium-rationale)
9. [Blog](#9-blog)
10. [Footer](#10-footer)
    - 10.1 [Footer Layout](#101-footer-layout)
    - 10.2 [Newsletter Column](#102-newsletter-column-column-1)
    - 10.3 [Link Columns](#103-link-columns-columns-2-3)
    - 10.4 [About Column](#104-about-column-column-4)
    - 10.5 [Footer Bottom Bar](#105-footer-bottom-bar)
11. [Shared Components](#11-shared-components)
    - 11.1 [Product Card (Standard)](#111-product-card-standard)
    - 11.2 [Tags / Badges](#112-tags--badges)
    - 11.3 [Buttons](#113-buttons)
    - 11.4 [Modals](#114-modals)
    - 11.5 [Loading States](#115-loading-states)
    - 11.6 [Inline Text + Image Statement Block](#116-inline-text--image-statement-block)
    - 11.7 [Value Props Icon Row](#117-value-props-icon-row)
    - 11.8 [Trust Badges Pill Row](#118-trust-badges-pill-row)
    - 11.9 [FAQ Section (3-Column Layout)](#119-faq-section-3-column-layout)
    - 11.10 [Testimonial / Reviews Carousel](#1110-testimonial--reviews-carousel)
    - 11.11 [Two-Column CTA Banner (Split Card)](#1111-two-column-cta-banner-split-card)
    - 11.12 [Collection Carousel (Category Cards)](#1112-collection-carousel-category-cards)
    - 11.13 [Inline Image Text Banner](#1113-inline-image-text-banner-flowing-text-with-embedded-images)
12. [Component Migration Map](#12-component-migration-map)

---

## 1. Overview

Full redesign of the PeasyDeal e-commerce website to achieve a premium, clean, and trust-building aesthetic. Every existing component will be redesigned — no components will be removed, only visually elevated.

### Goals
- Establish immediate trust and quality perception (Halo Effect)
- Reduce cognitive load across all pages with generous whitespace and clear hierarchy
- Add micro-interactions and polished transitions for a premium feel
- Maintain all existing functionality and component coverage
- Responsive across mobile, tablet, and desktop

### Tech Stack (Unchanged)
- Remix v1 + React 18 + TypeScript
- CSS Pipeline: SCSS → PostCSS → Tailwind CSS v3
- Chakra UI + MUI (co-existing)
- shadcn/ui primitives in `app/components/ui/`

### Component Deprecation Rule

**Never delete existing component files.** When redesigning a component:

1. **Mark the old component as deprecated** — add a `@deprecated` JSDoc comment at the top of the file with the replacement path:
   ```tsx
   /**
    * @deprecated Use `app/components/v2/ProductCard` instead.
    * Kept for reference and rollback safety. Do not delete.
    */
   ```
2. **Create the new component in a new file/directory** — use a `v2/` subdirectory or a clearly distinct name (e.g., `ProductCardV2`, `CartDrawer`).
3. **Replace all import references** — update every consumer to import from the new component. The old file remains in the codebase untouched.
4. **Do not reuse the old file path for new code** — the old file stays as-is at its original path for rollback safety and git history clarity.

This ensures zero risk of losing functionality, enables instant rollback by reverting imports, and keeps git blame/history clean for every original component.

---

## 2. Design Principles

| Principle | Application |
|-----------|-------------|
| **Halo Effect** | Hero and first-impression elements must convey quality within 50ms. Clean, professional, uncluttered. |
| **Cognitive Fluency** | Generous whitespace, clear visual hierarchy, one primary goal per section. |
| **Micro-Interactions** | Subtle hover animations, smooth transitions, satisfying feedback loops. |

### 2.1 Design Tokens (Global)

#### Typography
| Token | Value |
|---|---|
| `--font-heading` | `'Playfair Display', Georgia, serif` |
| `--font-body` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` |
| `--font-size-hero` | `40px` |
| `--font-size-section-title` | `28px` |
| `--font-size-card-title-lg` | `32px` |
| `--font-size-card-title` | `15px` |
| `--font-size-body` | `14px` |
| `--font-size-caption` | `12px` |
| `--font-size-badge` | `11px` |
| `--line-height-heading` | `1.2` |
| `--line-height-body` | `1.5` |
| `--letter-spacing-uppercase` | `1.5px` |

#### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#FFFFFF` | Page background |
| `--color-bg-card` | `#F5F5F5` | Product card background |
| `--color-bg-dark` | `#000000` | Announcement bar, CTA buttons |
| `--color-bg-warm` | `#F0EBE3` | Hero card tint (beige/cream) |
| `--color-text-primary` | `#000000` | Headings, body |
| `--color-text-secondary` | `#888888` | Category labels, muted text |
| `--color-text-muted` | `#999999` | Inactive tabs, strikethrough prices |
| `--color-text-disabled` | `#AAAAAA` | Inactive tab headings |
| `--color-text-body` | `#666666` | Descriptions, secondary body text |
| `--color-price-sale` | `#C75050` | Sale prices |
| `--color-badge-discount` | `#4A7C59` | Discount badge bg |
| `--color-badge-new` | `#C75050` | "New" badge bg |
| `--color-badge-selling` | `#4A7C59` | "Selling fast" badge bg |
| `--color-border-light` | `#E0E0E0` | Card borders, dividers |
| `--color-white` | `#FFFFFF` | Text on dark, card overlays |

#### Spacing Scale
| Token | Value |
|---|---|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |
| `--space-3xl` | `64px` |
| `--space-4xl` | `80px` |

#### Radius
| Token | Value |
|---|---|
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-full` | `999px` |

#### Shadows
| Token | Value |
|---|---|
| `--shadow-card-hover` | `0 4px 16px rgba(0, 0, 0, 0.08)` |
| `--shadow-overlay` | `0 2px 8px rgba(0, 0, 0, 0.10)` |
| `--shadow-header-sticky` | `0 2px 12px rgba(0, 0, 0, 0.06)` |
| `--shadow-badge` | `0 1px 3px rgba(0, 0, 0, 0.15)` |

#### Transitions
| Token | Value |
|---|---|
| `--transition-fast` | `150ms ease` |
| `--transition-normal` | `200ms ease` |
| `--transition-slow` | `300ms ease` |
| `--transition-menu` | `250ms cubic-bezier(0.4, 0, 0.2, 1)` |

#### Breakpoints
| Token | Value |
|---|---|
| `--bp-mobile` | `0 – 639px` |
| `--bp-tablet` | `640px – 1023px` |
| `--bp-desktop` | `1024px – 1439px` |
| `--bp-wide` | `1440px+` |

#### Container
| Token | Value |
|---|---|
| `--container-max` | `1320px` |
| `--container-padding` | `48px` (desktop), `24px` (tablet), `16px` (mobile) |

---

## 3. Global Elements

### 3.1 Announcement Bar (Marquee)

**Current Component:** `AnnouncementBanner`
**Reference:** Screenshot Set 1 — top strip

#### Layout
- `width: 100%`, pinned to top of viewport (above header)
- `height: 36px` (desktop), `32px` (mobile)
- `display: flex; align-items: center; overflow: hidden`

#### Styling
- `background: #000000`
- Text: `font-family: var(--font-body); font-size: 12px; font-weight: 500; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px`
- Mobile text: `font-size: 11px`
- Messages separated by `48px` horizontal gap (transparent spacer)

#### Marquee Behavior
- CSS `@keyframes` translateX animation, seamless infinite loop
- Content duplicated (2x) so tail connects to head with no gap
- **Props:**
  - `speed: number` — pixels-per-second (default: `50`)
  - `pauseOnHover: boolean` — default `true`
  - `messages: string[]` — configurable from CMS/env
- Animation: `animation: marquee ${duration}s linear infinite`
- On hover: `animation-play-state: paused`

#### Premium Rationale
- **Cognitive Fluency:** Single-line, no-noise trust signals. Uppercase + letter-spacing creates editorial authority.
- **Halo Effect:** Black bar creates visual weight anchoring the top of page.

---

### 3.2 Header / Navbar

**Current Components:** `Header`, `LogoHeader`, `NavBar`, `LogoBar`, `PropBar`, `SearchBar` (header)
**Reference:** Screenshot Set 1 — header row

#### Layout
- `width: 100%; height: 72px; display: flex; align-items: center; justify-content: space-between`
- `max-width: var(--container-max); margin: 0 auto; padding: 0 48px`
- 3-zone grid: `grid-template-columns: 1fr auto 1fr` (logo left, nav center, icons right)

#### Logo (Left)
- `font-family: var(--font-heading); font-size: 28px; font-weight: 900; color: #000000; letter-spacing: -0.5px`
- `text-decoration: none; cursor: pointer`
- Links to `/`

#### Nav Links (Center)
- `display: flex; gap: 32px; align-items: center`
- Each link: `font-family: var(--font-body); font-size: 15px; font-weight: 400; color: #000000; text-decoration: none; cursor: pointer`
- Dropdown chevron: inline SVG, `width: 10px; height: 6px; margin-left: 4px; transition: transform var(--transition-fast)`
- **Hover state:** `text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1.5px`
- **Active dropdown:** chevron `transform: rotate(180deg)`

#### Utility Icons (Right)
- `display: flex; gap: 20px; align-items: center; justify-content: flex-end`
- Icons: Search (magnifying glass), Account (user silhouette), Cart (shopping bag)
- Each icon: `width: 22px; height: 22px; color: #000000; cursor: pointer`
- **Cart badge:** `position: absolute; top: -4px; right: -6px; width: 16px; height: 16px; border-radius: 50%; background: #C75050; color: #FFFFFF; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center`

#### Sticky Behavior
- On scroll past `72px`: `position: sticky; top: 0; z-index: 1000; background: #FFFFFF; box-shadow: var(--shadow-header-sticky); transition: box-shadow var(--transition-normal)`

#### Mobile (< 640px)
- `height: 56px; padding: 0 16px`
- Layout: hamburger icon (left, 24px) | logo (center, 22px) | cart icon (right, 22px)
- Nav links hidden, moved to slide-out drawer

#### Micro-Interactions
- Nav link hover: underline slides in from left `@keyframes underline-in { from { width: 0 } to { width: 100% } }` duration `var(--transition-fast)`
- Sticky shadow: fades in over `var(--transition-normal)`
- Cart badge: `transform: scale(1.2)` then back to `scale(1)` over `var(--transition-normal)` when count changes

#### Premium Rationale
- **Cognitive Load:** Only 6 nav items max, clean sans-serif, no color noise. Single-purpose utility icons with no labels.
- **Halo Effect:** Generous 72px height with centered logo creates editorial magazine feel.

---

### 3.3 Mega Menu (Jumbo Dropdown)

**Current Component:** `MegaMenuContent`, `CategoriesNav`
**Reference:** Screenshot Set 1 — expanded dropdown under "Shop"

#### Layout
- `width: 100%; position: absolute; top: 72px; left: 0; z-index: 999`
- `background: #FFFFFF; border-top: 1px solid #E0E0E0`
- Inner content: `max-width: var(--container-max); margin: 0 auto; padding: 48px`
- `display: grid; grid-template-columns: 200px 200px 200px 1fr; gap: 48px`

#### Trigger
- Desktop: hover on nav item (with `120ms` enter delay, `100ms` leave delay to prevent flicker)
- Mobile: tap opens accordion/drawer

#### Column 1 — Quick Links
- Each link: `font-family: var(--font-heading); font-size: 22px; font-weight: 700; color: #000000; text-decoration: none; line-height: 1.2`
- Stack: `display: flex; flex-direction: column; gap: 20px`
- Hover: `color: #666666; transition: color var(--transition-fast)`
- Items: Best Sellers, New Arrivals, Bundles, Trending

#### Columns 2–3 — Category Lists
- Group heading: `font-family: var(--font-body); font-size: 16px; font-weight: 700; color: #000000; margin-bottom: 16px`
- Subcategory items: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #000000; text-decoration: none; line-height: 1.5`
- Stack: `display: flex; flex-direction: column; gap: 10px`
- "Shop All" at bottom: same style as subcategory items
- Hover: `color: #888888; transition: color var(--transition-fast)`

#### Column 4 — Trending Products Mini-Carousel
- Header row: `display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px`
  - Title: `font-family: var(--font-body); font-size: 16px; font-weight: 700; color: #000000`
  - Pagination: `font-family: var(--font-body); font-size: 14px; color: #888888` showing "1/2"
  - Arrow buttons: `width: 32px; height: 32px; border-radius: 50%; border: 1px solid #E0E0E0; background: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center`
  - Arrow icon: `width: 12px; height: 12px; color: #000000`
  - Arrow hover: `background: #F5F5F5; transition: background var(--transition-fast)`

- Product cards (3 visible): `display: flex; gap: 16px; overflow: hidden`
  - Each card: `width: 160px; flex-shrink: 0`
  - Image area: `width: 160px; height: 180px; background: #F5F5F5; border-radius: 12px; position: relative; display: flex; align-items: center; justify-content: center`
  - Product image: `max-width: 80%; max-height: 80%; object-fit: contain`
  - Badges: positioned `top: 8px; left: 8px` — see §11.2
  - Text below: `padding-top: 12px`
    - Category: `font-size: 12px; color: #888888; margin-bottom: 2px`
    - Name: `font-size: 14px; font-weight: 600; color: #000000; margin-bottom: 4px; line-height: 1.3`
    - Price: `font-size: 14px; font-weight: 600; color: #C75050` + original `font-size: 13px; color: #999999; text-decoration: line-through; margin-left: 6px`

#### Configurable Mode
Each nav item can be configured to render either:
1. **Simple dropdown:** single column of links (same style as Column 2–3)
2. **Full mega menu:** multi-column layout as above

#### Open/Close Animation
- Open: `opacity: 0 → 1; transform: translateY(-8px) → translateY(0)` over `var(--transition-menu)`
- Close: reverse, then `display: none` after animation ends

#### Mobile (< 640px)
- Full-screen drawer from left: `width: 100%; height: 100vh; position: fixed; top: 0; left: 0`
- Accordion pattern: category headings toggle subcategory lists
- Close button: top-right, `24px` icon

#### Premium Rationale
- **Cognitive Load:** Clear 4-column hierarchy separates browsing intent (quick links) from category navigation from product discovery. No competing visual elements.
- **Micro-Interactions:** Smooth slide+fade prevents jarring popups; hover delays prevent accidental triggers.

---

## 4. Home Page

### 4.1 Hero Section

**Current Component:** `PromoCarousell` (hero carousel), `PromoActivities` (banner variants)

Two configurable hero variants — each page/campaign can choose which variant to render.

---

#### 4.1.A — Full-Width Hero Carousel (Slider)

**Reference:** Screenshot Set 6 — full-bleed lifestyle image with text overlay + dot pagination

##### Outer Container
- `width: 100%; position: relative; overflow: hidden`
- Sits directly below the header with no gap/padding (`margin-top: 0`)

##### Slide Layout
- `display: flex; overflow-x: hidden; scroll-snap-type: x mandatory`
- Each slide: `min-width: 100%; flex-shrink: 0; scroll-snap-align: start; position: relative`

##### Slide Structure (per slide)
- **3-panel composition:** previous slide peeking (left) | active slide (center) | next slide peeking (right)
- Previous/next peek: `width: 160px` visible on each side at desktop, creating a "gallery window" effect
- Active center panel: `width: calc(100% - 320px); margin: 0 auto`

###### Center Panel
- `border-radius: 16px; overflow: hidden; position: relative; height: 580px`
- Background image: `width: 100%; height: 100%; object-fit: cover` — full-bleed lifestyle photograph
- Background tint: soft warm tone (e.g., `#D4A99A` peach/skin tone), can be per-slide via inline style

###### Text Content Overlay
- `position: absolute; top: 0; right: 0; bottom: 0; width: 45%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 48px`
- Subtitle: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #000000; margin-bottom: 12px; letter-spacing: 0.5px`
- Headline: `font-family: var(--font-heading); font-size: 48px; font-weight: 400; color: #000000; line-height: 1.15; margin-bottom: 28px; max-width: 400px`
  - Note: font-weight 400 (not bold) — italic style for elegance
- CTA button: `padding: 14px 36px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 14px; font-weight: 500; border-radius: 999px; border: none; cursor: pointer`

###### Side Peek Panels
- Previous (left): `position: absolute; left: 0; top: 0; bottom: 0; width: 160px; overflow: hidden; border-radius: 0`
- Next (right): `position: absolute; right: 0; top: 0; bottom: 0; width: 160px; overflow: hidden; border-radius: 0`
- Both show adjacent slide images, slightly dimmed: `filter: brightness(0.95)`
- Separated from center by `gap: 8px` (thin transparent strip)

##### Dot Pagination
- `position: relative; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 20px`
- Inactive dot: `width: 8px; height: 8px; border-radius: 50%; background: #CCCCCC; cursor: pointer; transition: all var(--transition-fast)`
- Active dot: `width: 32px; height: 8px; border-radius: 4px; background: #000000` (pill shape, elongated)
- Hover (inactive): `background: #999999`

##### Auto-play
- **Props:**
  - `autoPlay: boolean` — default `true`
  - `interval: number` — default `5000` (ms)
  - `pauseOnHover: boolean` — default `true`
- Auto-advances to next slide; pauses when user hovers over carousel
- On manual dot click or swipe: resets auto-play timer

##### Responsive
- Desktop (1024+): 3-panel layout with side peeks, `height: 580px`
- Tablet (640–1023): no side peeks, single full-width slide, `height: 480px; border-radius: 12px; margin: 0 24px`
- Mobile (< 640): `height: 400px; border-radius: 0` — full edge-to-edge; text overlay moves to bottom with semi-transparent dark gradient `linear-gradient(transparent 50%, rgba(0,0,0,0.4) 100%)`; headline `font-size: 32px; color: #FFFFFF`

##### Micro-Interactions
- Slide transition: `transform: translateX()` with `transition: transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)`
- Active dot: width expands `8px → 32px` over `var(--transition-normal)`
- CTA hover: `background: #333333; transition: background var(--transition-fast)`
- Side peek panels: slight parallax on slide transition (translate slightly slower than center)

##### Premium Rationale
- **Halo Effect (critical):** This is the single most important element on the page. The 580px-tall lifestyle photo with warm skin tones creates immediate emotional connection. The 48px italic serif headline feels editorial/magazine-quality. The Halo Effect is engineered within the first 50ms of page load.
- **Cognitive Fluency:** Only 3 elements compete for attention: photo, headline, CTA button. Zero navigation clutter inside the hero. The side peeks hint at more content without demanding attention.
- **Micro-Interactions:** The elongated active dot is a "peak" moment — a small detail that signals craftsmanship.

---

#### 4.1.B — 3-Card Banner

**Reference:** Screenshot Set 1 — three promotional cards below header

##### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 24px 48px 0`
- `display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px`

##### Card Design
- `border-radius: 16px; overflow: hidden; position: relative; height: 280px; cursor: pointer`
- `background: var(--color-bg-warm)` (each card can have a unique warm tint via inline style)
- `display: flex; align-items: stretch`

###### Card Content (Left ~55%)
- `padding: 32px; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 1`
- Category label: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #666666; margin-bottom: 8px`
- Headline: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 16px`
- CTA button: `display: inline-flex; align-items: center; padding: 10px 24px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 13px; font-weight: 500; border-radius: 999px; border: none; cursor: pointer; width: fit-content`

###### Card Image (Right ~45%)
- `position: absolute; right: 0; top: 0; bottom: 0; width: 50%; object-fit: cover`
- Image bleeds to right edge, no padding on right side

##### Responsive
- Tablet (640–1023px): `grid-template-columns: repeat(2, 1fr)` — third card wraps below or horizontal scroll
- Mobile (< 640px): `grid-template-columns: 1fr; gap: 12px` — stacked, or `display: flex; overflow-x: auto; scroll-snap-type: x mandatory` for swipe carousel; each card `min-width: 85vw; scroll-snap-align: center`

##### Micro-Interactions
- Card hover: `transform: scale(1.02); box-shadow: var(--shadow-card-hover); transition: all var(--transition-normal)`
- CTA hover: `background: #333333; transition: background var(--transition-fast)`
- Image hover: `transform: scale(1.05); transition: transform var(--transition-slow)` (within `overflow: hidden` container)

##### Premium Rationale
- **Halo Effect:** Three cards immediately establish visual richness and product variety. Warm tones create emotional warmth. Large serif headlines signal editorial quality.
- **Cognitive Load:** Each card has exactly one CTA — no competing elements.

---

### 4.2 Tagline / Value Proposition Banner

**Current Component:** Replaces/supplements `AllTimeCoupon` — positioned between hero and product sections
**Reference:** Screenshot Set 2 — top area (centered headline + CTA)

#### Layout
- `width: 100%; background: #FFFFFF; text-align: center`
- `padding: 80px 48px`

#### Content
- Headline: `font-family: var(--font-heading); font-size: 40px; font-weight: 400; color: #000000; line-height: 1.3; max-width: 640px; margin: 0 auto 24px`
- CTA link: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; text-decoration: none; display: inline-block; position: relative; padding-bottom: 4px`
- Underline: `&::after { content: ''; position: absolute; bottom: 0; left: -4px; right: -4px; height: 2px; background: #000000 }`

#### Micro-Interactions
- CTA underline on page enter (scroll into view): `@keyframes underline-grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }; transform-origin: left; animation-duration: 400ms`
- CTA hover: `&::after { background: #666666; transition: background var(--transition-fast) }`

#### Premium Rationale
- **Halo Effect:** 80px vertical padding creates a breathing zone that signals luxury. The centered serif headline at 40px dominates as a singular emotional statement.
- **Cognitive Fluency:** Zero visual noise — just text and a single action link. The brain processes this in under 500ms.

---

### 4.3 Featured Campaign + Product Carousel Section

**Current Component:** Maps to `PromoActivities` variants + `ProductRow` / `CategoryPreview` / `ScrollButton`
**Reference:** Screenshot Set 2 — "Sale 30% off" and "Under 29$" sections

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 0 48px`
- `display: grid; grid-template-columns: 420px 1fr; gap: 32px; align-items: start`

##### Left Column — Campaign Lifestyle Card
- `width: 420px; height: 100%; min-height: 680px; border-radius: 16px; overflow: hidden; position: relative`
- Background: full-bleed lifestyle photograph (`object-fit: cover; width: 100%; height: 100%`)
- Gradient overlay: `&::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%) }`
- Content overlay: `position: absolute; top: 0; left: 0; z-index: 1; padding: 40px 32px`
  - Category label: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.8); margin-bottom: 8px`
  - Headline: `font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: #FFFFFF; line-height: 1.2; margin-bottom: 20px`
  - CTA button: `padding: 12px 28px; background: #FFFFFF; color: #000000; font-family: var(--font-body); font-size: 13px; font-weight: 500; border-radius: 999px; border: none; cursor: pointer`
  - CTA hover: `background: #F0F0F0; transition: background var(--transition-fast)`

##### Right Column — Stacked Product Carousel Rows
- `display: flex; flex-direction: column; gap: 48px`
- Each row is a **Titled Product Carousel** (reusable pattern):

###### Row Header
- `display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px`
- Title: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000`
- Arrow controls: `display: flex; gap: 8px`
  - Each button: `width: 36px; height: 36px; border-radius: 50%; border: 1px solid #E0E0E0; background: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center`
  - Arrow icon: `width: 14px; height: 14px; color: #000000`
  - Hover: `background: #F5F5F5; border-color: #CCCCCC; transition: all var(--transition-fast)`
  - Disabled: `opacity: 0.3; cursor: default`

###### Product Cards Row
- `display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none; &::-webkit-scrollbar { display: none }`
- 2 full cards visible + partial 3rd peeking
- Each card: `min-width: 260px; flex-shrink: 0; scroll-snap-align: start`
- Card design: see §11.1 Product Card (Standard)

#### Responsive
- Tablet: `grid-template-columns: 1fr; gap: 32px` — campaign card becomes full-width banner (`height: 320px`), carousels below
- Mobile: `grid-template-columns: 1fr; gap: 24px` — campaign card `height: 280px`; carousel shows 1.3 cards visible

#### Micro-Interactions
- Product cards: `&:hover { box-shadow: var(--shadow-card-hover); transform: translateY(-2px); transition: all var(--transition-normal) }` + image `transform: scale(1.03)` inside `overflow: hidden`
- Arrow buttons: `background` transition on hover
- Campaign card image: slow Ken Burns effect `@keyframes kenburns { from { transform: scale(1) } to { transform: scale(1.05) } }; animation: kenburns 20s ease infinite alternate`

#### Premium Rationale
- **Halo Effect:** The large lifestyle card anchors the section with a premium photographic moment. It creates asymmetry that draws the eye.
- **Cognitive Fluency:** Each carousel row has a single title + products — no competing CTAs or descriptive text beyond the essentials.

---

### 4.4 Tabbed Product Grid (What's Hot / Best Sellers / Sale)

**Current Component:** Maps to `ProductGrid` (LargeGrid, MediumGrid) + `CategoryPreview`
**Reference:** Screenshot Set 3 — "What's hot / Best sellers / Sale" tabbed section

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 80px 48px`
- `background: #FFFFFF`

##### Tab Navigation Row
- `display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 40px`
- Tab group (left): `display: flex; gap: 40px; align-items: baseline`
  - Active tab: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; cursor: pointer; border: none; background: none; padding: 0`
  - Inactive tab: `font-family: var(--font-heading); font-size: 28px; font-weight: 300; color: #AAAAAA; cursor: pointer; border: none; background: none; padding: 0`
  - Tab transition: `transition: color var(--transition-fast), font-weight var(--transition-fast)`
  - No underline, no border, no background — differentiation is purely typographic weight + color
- "Shop All Products" link (right): `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1.5px`

##### Product Grid
- `display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px`
- 2 rows visible = 8 products per tab
- Each cell uses §11.1 Product Card (Standard) — `width: 100%`

##### Responsive
- Desktop (1024+): `grid-template-columns: repeat(4, 1fr)`
- Tablet (640–1023): `grid-template-columns: repeat(3, 1fr)`
- Mobile (< 640): `grid-template-columns: repeat(2, 1fr); gap: 12px`
- Tabs on mobile: `font-size: 20px; gap: 24px`

#### Behavior
- Tab click: client-side filter, no page reload
- Grid content transition: `opacity: 0 → 1` crossfade over `var(--transition-normal)`
- Products link to `/product/{slug}-i.{VARIATION_UID}`

#### Micro-Interactions
- Tab switch: grid fades out `opacity: 0` over `100ms`, data swaps, fades in `opacity: 1` over `200ms`
- Active tab text: weight transitions from 300 → 700, color from #AAAAAA → #000000 simultaneously
- Product cards: same hover as §11.1

#### Premium Rationale
- **Cognitive Load:** Tabs eliminate page navigation — users discover 3 product collections without leaving the section. Typography-only tab design has zero visual clutter.
- **Micro-Interactions:** The crossfade grid transition prevents jarring content jumps — the page feels alive and responsive.

---

### 4.5 Core Products Carousel (Large Detail Cards)

**Current Component:** Maps to `ProductPromotionRow` or new layout variant
**Reference:** Screenshot Set 4 — "The core products" section

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 80px 48px`
- Section header: `display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px`
  - Title: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000`
  - Arrow controls: same as §4.3 arrows (`36px` circular buttons, `1px solid #E0E0E0`)

#### Carousel Track
- `display: flex; gap: 40px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; &::-webkit-scrollbar { display: none }; scroll-behavior: smooth`
- Visible: 1.5 card-pairs in viewport (partial next pair visible to cue scrollability)

##### Card Pair (Each Carousel Item)
- `display: grid; grid-template-columns: 440px 1fr; gap: 32px; min-width: 720px; flex-shrink: 0; scroll-snap-align: start; align-items: center`

###### Image Column
- `width: 440px; height: 480px; background: #F5F5F5; border-radius: 16px; display: flex; align-items: center; justify-content: center; overflow: hidden`
- Product image: `max-width: 75%; max-height: 75%; object-fit: contain`

###### Text Column
- `display: flex; flex-direction: column; justify-content: center; padding: 16px 0`
- Category label: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-bottom: 8px`
- Product name: `font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 12px; max-width: 280px`
  - Max 3 lines: `-webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden`
- Price: `font-family: var(--font-body); font-size: 16px; font-weight: 600; color: #000000; margin-bottom: 16px`
  - Sale variant: `color: #C75050` + original `font-size: 14px; font-weight: 400; color: #999999; text-decoration: line-through; margin-left: 8px`
- Description: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin-bottom: 24px; max-width: 320px`
  - 3 lines truncated: `-webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden`
- CTA button: `padding: 14px 32px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 14px; font-weight: 500; border-radius: 999px; border: none; cursor: pointer; width: fit-content`

#### Responsive
- Tablet: `grid-template-columns: 320px 1fr; min-width: 560px` — image area `320px; height: 360px`
- Mobile: `grid-template-columns: 1fr; min-width: 280px` — image full-width (`height: 300px`), text below

#### Micro-Interactions
- CTA hover: `background: #333333; transition: background var(--transition-fast)`
- Image hover: `transform: scale(1.02); transition: transform var(--transition-normal)` inside `overflow: hidden`
- Carousel scroll: `scroll-behavior: smooth` with momentum; arrow buttons `scrollBy({ left: 760, behavior: 'smooth' })`

#### Premium Rationale
- **Halo Effect:** Large 440px image cards with 480px height give products a gallery/editorial treatment — each product gets the visual weight of a magazine feature.
- **Micro-Interactions:** Partial next-pair peeking uses the Zeigarnik effect — incomplete views compel users to scroll and discover more.

---

### 4.6 Lifestyle Gallery with Product Overlays

**Current Component:** Maps to `SeasonalColumnLayout` / `SeasonalGrid` or new component
**Reference:** Screenshot Set 5 — "Customers enjoy their journey everyday" section

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 80px 48px`
- `display: grid; grid-template-columns: 280px 1fr; gap: 48px; align-items: start`

##### Left Zone — Text + Category Tabs
- `position: sticky; top: 120px` (sticks while user scrolls through gallery)

- Subtitle: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; margin-bottom: 12px`
- Heading: `font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 32px`

- **Category tabs:** `display: flex; flex-direction: column; gap: 0`
  - Each tab: `padding: 16px 0 16px 16px; cursor: pointer; border-left: 3px solid transparent; transition: all var(--transition-fast)`
  - Active tab: `border-left: 3px solid #000000`
    - Label: `font-family: var(--font-body); font-size: 15px; font-weight: 700; color: #000000; margin-bottom: 8px`
    - Description: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #666666; line-height: 1.5; max-width: 240px`
  - Inactive tab:
    - Label: `font-family: var(--font-body); font-size: 15px; font-weight: 400; color: #999999`
    - No description shown (collapses)
  - Hover (inactive): `color: #666666; border-left-color: #E0E0E0; transition: all var(--transition-fast)`

##### Right Zone — Masonry Photo Grid
- `display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start`
- Column 2 offset: `padding-top: 100px` (creates staggered masonry effect)

###### Photo Card
- `border-radius: 16px; overflow: hidden; position: relative; cursor: pointer`
- Varying aspect ratios per card:
  - Portrait: `aspect-ratio: 3/4` (taller)
  - Square: `aspect-ratio: 1/1`
  - Wide: `aspect-ratio: 4/3`
- Image: `width: 100%; height: 100%; object-fit: cover`

###### Product Info Overlay
- `position: absolute; bottom: 16px; left: 16px; right: 16px`
- `background: #FFFFFF; border-radius: 12px; padding: 10px 12px`
- `display: flex; align-items: center; gap: 10px`
- `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10)`
- Product thumbnail: `width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex-shrink: 0`
- Text block: `flex: 1; min-width: 0`
  - Product name: `font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`
  - Price: `font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #C75050` + original `color: #999999; text-decoration: line-through; margin-left: 6px; font-size: 12px`
- Cart icon button: `width: 36px; height: 36px; border-radius: 50%; border: 1px solid #E0E0E0; background: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0`
  - Icon: shopping bag, `width: 16px; height: 16px; color: #666666`
  - Hover: `background: #F5F5F5; border-color: #CCCCCC; transition: all var(--transition-fast)`

#### Responsive
- Tablet: `grid-template-columns: 1fr` — left zone becomes horizontal above gallery (`position: static`), tabs become horizontal pills row
- Mobile: `grid-template-columns: 1fr` — single column photo stack, tabs as horizontal scroll chips, overlay cards simplified (no thumbnail)

#### Behavior
- Tab click: swaps photo grid content; active tab expands to show description, others collapse
- Cart icon click: quick-add to cart (triggers `ItemAddedModal` — see §11.4)
- Photo card click: navigates to product detail page

#### Micro-Interactions
- Photo card hover: `transform: scale(1.02); transition: transform var(--transition-normal)` inside `overflow: hidden`
- Product overlay on card hover: `transform: translateY(-4px); transition: transform var(--transition-normal)`
- Cart icon click: `transform: scale(0.9)` then `scale(1)` over `200ms` (bounce feedback)
- Tab switch: gallery `opacity: 0 → 1` crossfade over `var(--transition-slow)`
- Active tab border: `border-left-color` slides in from `transparent → #000000` over `var(--transition-fast)`

#### Premium Rationale
- **Halo Effect:** Lifestyle photography with real people creates emotional resonance and social proof. The masonry layout creates visual variety that keeps the eye engaged.
- **Micro-Interactions:** The floating product overlay is a "peak" moment (peak-end rule) — it delights by revealing product info without leaving the gallery experience.
- **Cognitive Fluency:** Category tabs on the left let users self-select their interest without scrolling. Sticky positioning keeps context visible.

---

## 5. Product Pages

**Current Components:** `ProductDetailContainer`, `ProductDetailSection`, `Carousel`/`CarouselMinimal`, `ProductActionBar`, `ProductPolicy`, `SocialShare`, `Reviews`, `RecommendedProducts`, `TopProductsColumn`, `Breadcrumbs`
**Reference:** Screenshot Set 7 — Product detail page + "You may also like" section

### 5.1 Breadcrumbs

**Current Component:** `Breadcrumbs`

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 16px 48px 0`

#### Styling
- `display: flex; align-items: center; gap: 8px`
- Each crumb: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; text-decoration: none`
- Separator: `>` chevron icon, `width: 10px; height: 10px; color: #CCCCCC`
- Last crumb (current): `color: #000000; font-weight: 400; pointer-events: none`
- Hover (links): `color: #000000; transition: color var(--transition-fast)`

---

### 5.2 Product Detail Layout

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 8px 48px 80px`
- `display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start`

#### Responsive
- Tablet (640–1023): `grid-template-columns: 1fr 1fr; gap: 32px; padding: 8px 24px 64px`
- Mobile (< 640): `grid-template-columns: 1fr; gap: 24px; padding: 8px 16px 48px`

---

### 5.3 Product Image Gallery (Left Column)

**Current Component:** `Carousel` / `CarouselMinimal`

#### Layout
- `display: flex; flex-direction: column; gap: 8px; position: sticky; top: 88px` (sticky while scrolling right column)

##### Main Image
- `width: 100%; aspect-ratio: 3/4; background: #F5F5F5; border-radius: 16px; overflow: hidden; position: relative`
- Image: `width: 100%; height: 100%; object-fit: cover`
- Zoom icon: `position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.10); display: flex; align-items: center; justify-content: center; cursor: pointer`
  - Icon: magnifying glass + `+`, `width: 18px; height: 18px; color: #000000`
  - Hover: `background: #F5F5F5; transition: background var(--transition-fast)`

##### Thumbnail Grid (below main image)
- `display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px`
- Each thumbnail: `aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; cursor: pointer; border: 2px solid transparent`
  - Image: `width: 100%; height: 100%; object-fit: cover`
  - Active: `border-color: #000000`
  - Hover: `border-color: #CCCCCC; transition: border-color var(--transition-fast)`

##### Full gallery on scroll
- Additional images stack vertically below the 2-col thumbnails
- Each: `width: 100%; border-radius: 12px; overflow: hidden`
- Mix of product shots and lifestyle photos

#### Mobile (< 640)
- `position: static` (not sticky)
- Main image becomes horizontal swipe carousel: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 0`
- Each image: `min-width: 100%; scroll-snap-align: center`
- Dot indicators below: same as §4.1.A dot pagination

---

### 5.4 Product Info (Right Column)

**Current Components:** `ProductDetailContainer`, `PriceRow`, `Reviews`, `ProductPolicy`, `SocialShare`

#### Layout
- `display: flex; flex-direction: column; gap: 0; padding-top: 8px`

##### Badges Row
- `display: flex; gap: 6px; margin-bottom: 12px`
- Uses §11.2 pill badges (e.g., "New" red, "Save 20%" green)

##### Product Title
- `font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 12px`

##### Rating Row
- `display: flex; align-items: center; gap: 8px; margin-bottom: 16px`
- Stars: `display: flex; gap: 2px` — each star `width: 16px; height: 16px`
  - Filled: `color: #E8A040` (amber)
  - Empty: `color: #E0E0E0`
  - Half: gradient fill
- Review count: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #888888` — e.g., "(3)"

##### Price Block
- `margin-bottom: 4px`
- Sale price: `font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: #C75050`
- Original price: `font-family: var(--font-body); font-size: 16px; font-weight: 400; color: #999999; text-decoration: line-through; margin-left: 10px; vertical-align: middle`
- Shipping note: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-top: 4px`
  - "Shipping" link: `text-decoration: underline; color: #000000`

##### Description
- `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin: 16px 0 16px`
- Max 3 lines initially, "Read more" expandable

##### Stock Indicator
- `display: flex; align-items: center; gap: 6px; margin-bottom: 20px`
- Green dot: `width: 8px; height: 8px; border-radius: 50%; background: #4A7C59`
- Text: `font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #4A7C59` — e.g., "131 in stock"

##### Variant Selector (Size)
- Label: `font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #000000; margin-bottom: 10px`
  - Selected value: `font-weight: 400` appended inline (e.g., "Size: 30ml")
- Options: `display: flex; gap: 8px; margin-bottom: 20px`
  - Each option: `padding: 10px 20px; border-radius: 8px; border: 1.5px solid #E0E0E0; background: #FFFFFF; font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; cursor: pointer`
  - Selected: `border-color: #000000; background: #000000; color: #FFFFFF`
  - Hover: `border-color: #000000; transition: border-color var(--transition-fast)`

##### Quantity + Add to Cart Row
- `display: flex; gap: 12px; margin-bottom: 12px`

###### Quantity Picker
- `display: flex; align-items: center; border: 1.5px solid #E0E0E0; border-radius: 8px; overflow: hidden; height: 48px`
- Minus button: `width: 40px; height: 100%; background: none; border: none; font-size: 18px; color: #000000; cursor: pointer; display: flex; align-items: center; justify-content: center`
  - Disabled (qty=1): `color: #CCCCCC; cursor: default`
- Input: `width: 40px; text-align: center; border: none; font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; -moz-appearance: textfield; &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none }`
- Plus button: same as minus

###### Add to Cart Button
- `flex: 1; height: 48px; background: #FFFFFF; color: #000000; font-family: var(--font-body); font-size: 14px; font-weight: 600; border: 1.5px solid #E0E0E0; border-radius: 8px; cursor: pointer`
- Hover: `background: #F5F5F5; border-color: #CCCCCC; transition: all var(--transition-fast)`

##### Buy It Now Button
- `width: 100%; height: 48px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 14px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 16px`
- Hover: `background: #333333; transition: background var(--transition-fast)`

##### Trust Signals Row
- `display: flex; gap: 24px; align-items: center; margin-bottom: 16px`
- Each signal: `display: flex; align-items: center; gap: 6px`
  - Icon: `width: 16px; height: 16px; color: #888888` (truck icon for shipping, clock icon for returns)
  - Text: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #666666`

##### Store Pickup
- `margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #E0E0E0`
- Checkmark icon: `width: 14px; height: 14px; color: #4A7C59; margin-right: 6px`
- Title: `font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #000000`
- Subtitle: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-top: 2px`
- Link: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #000000; text-decoration: underline; margin-top: 4px`

##### Accordion Sections (Overview / How to use / Ingredients)
- Each section: `border-bottom: 1px solid #E0E0E0; padding: 20px 0`
- Header: `display: flex; justify-content: space-between; align-items: center; cursor: pointer; width: 100%`
  - Title: `font-family: var(--font-body); font-size: 16px; font-weight: 600; color: #000000`
  - Toggle icon: `+` or `−`, `width: 20px; height: 20px; color: #000000; transition: transform var(--transition-fast)`
  - Open state: icon rotates `45deg`
- Content (expanded): `padding-top: 12px; font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6`
- Animation: `max-height: 0 → auto; overflow: hidden; transition: max-height var(--transition-slow) ease`

##### Action Links Row
- `display: flex; gap: 20px; padding-top: 16px`
- Each link: `display: flex; align-items: center; gap: 6px; font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; cursor: pointer`
  - Icon: `width: 14px; height: 14px`
  - Items: "Share" (share icon), "Ask a question" (question mark icon)
  - Hover: `color: #000000; transition: color var(--transition-fast)`

---

### 5.5 Recommended Products ("You may also like")

**Current Component:** `RecommendedProducts`
**Reference:** Screenshot Set 7 — "You may also like" section below product detail

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 64px 48px; border-top: 1px solid #E0E0E0`

#### Section Title
- `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; text-align: center; margin-bottom: 40px`

#### Product Grid
- `display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px`
- Each cell uses §11.1 Product Card (Standard)
- Cards have thin `border: 1px solid #E0E0E0` in this context (instead of background-only)

#### Responsive
- Tablet: `grid-template-columns: repeat(3, 1fr)`
- Mobile: `grid-template-columns: repeat(2, 1fr); gap: 12px`

#### Micro-Interactions
- Same as §11.1 product card hover states

#### Premium Rationale
- **Cognitive Fluency:** Centered heading + clean 4-column grid with no competing CTAs. The horizontal rule separator creates clear sectioning.
- **Halo Effect:** Showing 4 high-quality products signals depth of catalog — "if these are the recommendations, the main catalog must be impressive."

---

### 5.6 Sticky Add-to-Cart Bar

**Current Component:** `ProductActionBar` (new or enhanced)
**Reference:** Screenshot Set 10 — sticky bottom bar on product detail page
**Trigger:** Appears when the user scrolls past the price block (§5.4 Price Block) such that it is no longer visible in the viewport. Hides when the price block scrolls back into view.

#### Visibility Logic
- Uses `IntersectionObserver` on the §5.4 Price Block element
- When price block `intersectionRatio === 0` (fully out of viewport): bar slides in
- When price block `intersectionRatio > 0` (any part visible): bar slides out
- Only active on the product detail page route (`/product/*`)

#### Container
```css
.sticky-atc-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #FFFFFF;
  border-top: 1px solid #E0E0E0;
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.sticky-atc-bar--visible {
  transform: translateY(0);
}
```

#### Inner Layout
```css
.sticky-atc-bar__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 12px 48px;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 64px;
}
```

##### Product Info (Left)
- `display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0`

###### Thumbnail
- `width: 40px; height: 40px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #F5F5F5`
- Image: `width: 100%; height: 100%; object-fit: cover`

###### Text
- Product name: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`
- Price row: `display: flex; align-items: baseline; gap: 6px; margin-top: 1px`
  - Sale price: `font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #C75050`
  - Original price: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #999999; text-decoration: line-through`
  - Regular price (non-sale): `font-size: 14px; font-weight: 600; color: #000000`

##### Controls (Right)
- `display: flex; align-items: center; gap: 12px; flex-shrink: 0`

###### Variant Select (if applicable)
```css
.sticky-atc-bar__variant {
  height: 40px;
  padding: 0 32px 0 14px;
  border: 1px solid #E0E0E0;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: #000000;
  background: #FFFFFF;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  position: relative;
}
```
- Dropdown chevron: `position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 10px; height: 6px; color: #888888; pointer-events: none`
- Shows currently selected variant (e.g., "30ml")
- On change: syncs with the main product page variant selector (§5.4)

###### Quantity Picker (Compact, Pill Style)
```css
.sticky-atc-bar__qty {
  display: flex;
  align-items: center;
  border: 1px solid #E0E0E0;
  border-radius: 999px;
  height: 40px;
  overflow: hidden;
}
.sticky-atc-bar__qty-btn {
  width: 36px;
  height: 100%;
  background: none;
  border: none;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sticky-atc-bar__qty-btn:hover {
  background: #F5F5F5;
}
.sticky-atc-bar__qty-btn:disabled {
  color: #CCCCCC;
  cursor: default;
}
.sticky-atc-bar__qty-input {
  width: 28px;
  text-align: center;
  border: none;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: #000000;
  background: none;
  -moz-appearance: textfield;
}
.sticky-atc-bar__qty-input::-webkit-outer-spin-button,
.sticky-atc-bar__qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
```

###### Add to Cart Button
```css
.sticky-atc-bar__add {
  height: 40px;
  padding: 0 28px;
  background: #000000;
  color: #FFFFFF;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--transition-fast);
}
.sticky-atc-bar__add:hover {
  background: #333333;
}
.sticky-atc-bar__add:active {
  background: #1A1A1A;
}
```
- Text: "Add To Cart"

#### Responsive
- Tablet (640–1023): `padding: 12px 24px; gap: 16px`; variant select hidden (uses main page selection)
- Mobile (< 640): `padding: 10px 16px; height: 56px`
  - Product thumbnail + name hidden (only price visible)
  - Layout: price (left) | quantity + "Add to Cart" (right)
  - "Add to Cart" button: `flex: 1` (fills remaining space)

#### Micro-Interactions
- **Slide in:** `transform: translateY(100%) → translateY(0)` over `300ms cubic-bezier(0.4, 0, 0.2, 1)` — smooth deceleration
- **Slide out:** reverse animation when price block re-enters viewport
- **Add to Cart click:** button text swaps to checkmark `✓` icon for `1200ms`, then reverts — provides confirmation without modal
- **Quantity change:** syncs with main page quantity picker (§5.4) in both directions

#### Premium Rationale
- **Cognitive Fluency:** The bar only appears when the original CTA is out of view — it never competes with the main product info. This prevents "two calls-to-action" cognitive conflict. The pill-shaped controls match the editorial tone of hero CTAs (§4.1).
- **Micro-Interactions:** The slide-in is a "peak" moment — the bar arrives exactly when the user needs it. The checkmark confirmation on add-to-cart follows the peak-end rule by providing immediate, satisfying feedback without interrupting the browsing flow.
- **Halo Effect:** The compact bar with product thumbnail, price, variant, quantity, and CTA in a single row signals that the checkout experience is streamlined and professional — "this store makes buying easy."

---

## 6. Category / Collection Pages

**Current Components:** `$collection.tsx` route, `ProductRowsContainer/ThreeColumns`, `PageTitle`, `LoadMoreButton`, `AllTimeCoupon`, `PromoteSubscriptionModal`, Chakra Breadcrumb/Drawer
**Reuses:** v2 ProductCard (§11.1), v2 Breadcrumbs (§5.1), v2 Badge (§11.2), v2 Button (§11.3), v2 LoadMore (§11.5)

### 6.1 Collection Page — Global Layout

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-padding)`
- Content area: `display: grid; grid-template-columns: 240px 1fr; gap: 48px` (desktop)
- Tablet: `grid-template-columns: 1fr` (sidebar collapses to horizontal filter bar)
- Mobile: `grid-template-columns: 1fr` (sidebar becomes bottom drawer)

#### Page Header (Collection Banner)
- Full-width warm background: `background: var(--color-bg-warm); border-radius: var(--radius-lg); padding: 48px 40px`
- Title: `font-family: var(--font-heading); font-size: 36px; font-weight: 700; color: #000000; line-height: 1.2`
- Mobile title: `font-size: 28px; padding: 32px 24px`
- Optional subtitle/description: `font-family: var(--font-body); font-size: 15px; color: var(--color-text-body); line-height: 1.6; margin-top: 12px; max-width: 600px`
- Breadcrumbs (v2 §5.1) displayed above the banner: `margin-bottom: 16px`
- **Replaces:** Old `PageTitle` and `PromotionBannerWithTitle` components

#### Structured Data (Preserve Existing)
- Keep current BreadcrumbList + ProductList JSON-LD generation from `structured_data.ts`
- Keep canonical link + meta tag logic

### 6.2 Sidebar — Category Navigation (Desktop)

#### Layout
- `width: 240px; position: sticky; top: 96px; align-self: start; max-height: calc(100vh - 120px); overflow-y: auto`
- `padding-right: 24px; border-right: 1px solid var(--color-border-light)`

#### Parent Category
- `font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: #000000; margin-bottom: 20px`
- "Back to all" link above: `font-family: var(--font-body); font-size: 13px; color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px; margin-bottom: 16px`
- Back arrow: inline SVG, `width: 14px; height: 14px`
- Hover: `color: #000000; transition: color var(--transition-fast)`

#### Child Category Links
- `display: flex; flex-direction: column; gap: 0`
- Each link: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: var(--color-text-body); text-decoration: none; padding: 10px 0; border-bottom: 1px solid #F0F0F0; transition: all var(--transition-fast)`
- Product count: `color: var(--color-text-muted); font-size: 12px; margin-left: 8px`
- Hover: `color: #000000; padding-left: 4px`
- Active (current category): `font-weight: 600; color: #000000; border-left: 2px solid #000000; padding-left: 12px`

### 6.3 Sidebar — Mobile Category Drawer

#### Trigger
- Mobile: sticky filter bar at top of product grid
- `height: 48px; background: #FFFFFF; border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; padding: 0 16px`
- Label: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000`
- Chevron: `width: 16px; height: 16px; transition: transform var(--transition-fast)`
- Active: chevron rotates 180°

#### Drawer
- Slides up from bottom: `position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; max-height: 70vh`
- `background: #FFFFFF; border-radius: var(--radius-lg) var(--radius-lg) 0 0; padding: 24px`
- Overlay: `background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px)`
- Handle bar: `width: 40px; height: 4px; background: #D9D9D9; border-radius: 2px; margin: 0 auto 20px`
- Animation: `transform: translateY(100%)` → `translateY(0)` over `var(--transition-menu)`
- Category links: same styling as desktop sidebar but with `padding: 14px 0` for larger touch targets
- Close on overlay tap or swipe down

### 6.4 Product Grid

#### Layout
- `display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px` (desktop)
- Tablet: `grid-template-columns: repeat(3, 1fr); gap: 20px`
- Mobile: `grid-template-columns: repeat(2, 1fr); gap: 12px`
- Uses v2 ProductCard (§11.1) — no changes needed to the card itself

#### Sort & Count Bar
- `display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #F0F0F0`
- Count: `font-family: var(--font-body); font-size: 13px; color: var(--color-text-secondary)`  — "Showing 24 of 128 products"
- Sort dropdown: same style as CheckoutSelect (§8.9) but compact — `height: 40px; min-width: 180px; font-size: 13px`

#### Progress Indicator
- Below grid: `width: 100%; max-width: 200px; margin: 0 auto`
- Text: `font-family: var(--font-body); font-size: 13px; color: var(--color-text-secondary); text-align: center; margin-bottom: 8px` — "Showing X of Y"
- Progress bar: `height: 2px; background: #F0F0F0; border-radius: 1px; overflow: hidden`
- Fill: `background: #000000; height: 100%; transition: width var(--transition-slow)`

#### Load More
- v2 Button (§11.3) secondary variant: `margin: 32px auto 0; display: block`
- Label: "Load More Products"
- Loading state: shows spinner inside button
- Hidden when `hasMore === false`

### 6.5 Empty Collection State

- Centered: `text-align: center; padding: 80px 24px`
- Illustration: folder/search SVG icon, `width: 120px; opacity: 0.4; margin: 0 auto 24px`
- Heading: `font-family: var(--font-heading); font-size: 24px; color: #000000; margin-bottom: 8px` — "No products found"
- Body: `font-family: var(--font-body); font-size: 15px; color: var(--color-text-body); margin-bottom: 24px` — "Try browsing a different category or check back soon."
- CTA: v2 Button pill variant — "Browse All Products" → links to `/collection/all`

### 6.6 Collection Page — Responsive Summary

| Breakpoint | Sidebar | Grid | Card Size |
|---|---|---|---|
| Desktop (≥1024px) | 240px sticky sidebar | 4 columns, 24px gap | Standard |
| Tablet (640–1023px) | Horizontal filter bar | 3 columns, 20px gap | Standard |
| Mobile (<640px) | Bottom drawer | 2 columns, 12px gap | Compact |

### 6.7 Micro-Interactions
- Product cards: standard hover effects from §11.1 (lift + shadow + image swap)
- Category sidebar links: slide-in padding on hover
- Load more: button loading spinner → new cards fade in with `opacity: 0; transform: translateY(8px)` → `opacity: 1; transform: translateY(0)` stagger `50ms` per card
- Mobile drawer: spring-dampened slide up
- Sort dropdown: fade-in over `var(--transition-fast)`

### 6.8 Premium Rationale
- **Cognitive Fluency:** 4-column grid with generous gap keeps visual density low. Sticky sidebar maintains navigation context without requiring scroll-to-top.
- **Halo Effect:** Warm background banner replaces generic border/text header — creates editorial magazine category entrance. Progress indicator provides completeness feedback without pressure.
- **Micro-Interactions:** Staggered card fade-in on load-more creates a "reveal" moment rather than a jarring content shift.

---

## 7. Search

**Current Components:** `DropDownSearchBar`, `MobileSearchDialog`, Algolia `Autocomplete`, `ProductHits`, `CategoryHits`, `RecentSearchHits`
**Reuses:** v2 ProductCard (§11.1), v2 Button (§11.3)

### 7.1 Search — Desktop Dropdown

#### Trigger
- Click on Search icon (magnifying glass) in v2 Header (§3.2)
- Search bar expands inline in the header: `position: absolute; top: 0; right: 0; width: 420px; height: 72px; display: flex; align-items: center; padding: 0 16px`
- Animation: `width: 0; opacity: 0` → `width: 420px; opacity: 1` over `var(--transition-menu)`
- Close button (X icon) on right: `width: 20px; height: 20px; color: var(--color-text-secondary); cursor: pointer`
- Close on: X click, Escape key, click outside

#### Search Input
- `font-family: var(--font-body); font-size: 15px; color: #000000; background: transparent; border: none; outline: none; width: 100%`
- Placeholder: `color: var(--color-text-muted)` — "Search products, categories..."
- Leading icon: magnifying glass SVG, `width: 20px; height: 20px; color: var(--color-text-secondary); margin-right: 12px`
- Auto-focus on open

#### Dropdown Results Panel
- `position: absolute; top: 72px; right: 0; width: 480px; max-height: 480px; overflow-y: auto`
- `background: #FFFFFF; border: 1px solid var(--color-border-light); border-radius: 0 0 var(--radius-md) var(--radius-md); box-shadow: var(--shadow-overlay)`
- Appears when input has ≥ 1 character
- Animation: `opacity: 0; transform: translateY(-4px)` → `opacity: 1; translateY(0)` over `var(--transition-fast)`

#### Recent Searches Section
- Shown when input is empty and history exists
- Header: `font-family: var(--font-body); font-size: 11px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; padding: 16px 20px 8px`
- Each item: `padding: 10px 20px; font-size: 14px; color: var(--color-text-body); display: flex; align-items: center; gap: 10px; cursor: pointer`
- Clock icon: `width: 14px; height: 14px; color: var(--color-text-muted)`
- Hover: `background: #F9F9F9`
- Max 5 recent searches

#### Product Suggestions Section
- Header: same uppercase style as recent searches — "Products"
- Each item: `padding: 12px 20px; display: flex; align-items: center; gap: 14px; cursor: pointer`
- Thumbnail: `width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; background: var(--color-bg-card)`
- Title: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000`
- Highlight match: `background: rgba(0, 0, 0, 0.06); border-radius: 2px; padding: 0 1px`
- Price: `font-size: 13px; color: var(--color-text-secondary); margin-top: 2px`
- Hover: `background: #F9F9F9; transition: background var(--transition-fast)`
- Max 6 product suggestions

#### Category Suggestions Section
- Header: "Categories"
- Each item: `padding: 10px 20px; font-size: 14px; color: var(--color-text-body); display: flex; align-items: center; gap: 10px`
- Folder icon: `width: 16px; height: 16px; color: var(--color-text-muted)`
- Arrow on right: `margin-left: auto; width: 12px; height: 12px; color: var(--color-text-muted)`
- Hover: `background: #F9F9F9`
- Max 4 category suggestions

#### Footer
- `padding: 12px 20px; border-top: 1px solid #F0F0F0; text-align: center`
- "View all results for ‟{query}"": `font-size: 13px; font-weight: 500; color: #000000; text-decoration: underline; text-underline-offset: 3px; cursor: pointer`

### 7.2 Search — Mobile Full-Screen

#### Layout
- `position: fixed; inset: 0; z-index: 1100; background: #FFFFFF`
- Animation: `opacity: 0; transform: translateY(-8px)` → `opacity: 1; translateY(0)` over `var(--transition-menu)`

#### Header Bar
- `height: 56px; display: flex; align-items: center; gap: 12px; padding: 0 16px; border-bottom: 1px solid #F0F0F0`
- Back arrow (left): `width: 24px; height: 24px; color: #000000; cursor: pointer`
- Input: `flex: 1; font-size: 16px; border: none; outline: none` (16px minimum to prevent iOS zoom)
- Clear button (right): `width: 20px; height: 20px; color: var(--color-text-muted)` — only shown when input has value

#### Results
- Same sections as desktop but full-width
- Product suggestions: thumbnail `56px × 56px` for larger touch targets
- Each item: `padding: 14px 16px` for touch-friendly spacing
- Scrollable: `overflow-y: auto; height: calc(100vh - 56px)`

### 7.3 Search Results Page (Full)

#### Layout
- Standard collection page layout (§6) without sidebar
- `max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-padding)`

#### Header
- Search query display: `font-family: var(--font-heading); font-size: 28px; color: #000000; margin-bottom: 8px` — "Results for "{query}""
- Count: `font-family: var(--font-body); font-size: 14px; color: var(--color-text-secondary); margin-bottom: 32px` — "{n} products found"

#### No Results State
- Same pattern as Empty Collection (§6.5)
- Heading: "No results for "{query}""
- Suggestions: `margin-top: 16px; font-size: 14px; color: var(--color-text-body)` — "Try checking your spelling or using more general terms"
- Popular categories: horizontal scroll of pill links → collection pages

#### Product Grid
- Same as §6.4 product grid (4/3/2 column responsive)

### 7.4 Micro-Interactions
- Search open: bar expands with cubic-bezier ease-out
- Typing: results appear with 200ms debounce, dropdown fades in
- Result hover: subtle background slide from left
- Product suggestion thumbnail: slight scale on hover `transform: scale(1.05)`
- Submit: brief loading spinner in search icon position

### 7.5 Premium Rationale
- **Cognitive Fluency:** Search results are grouped into clear sections (recent, products, categories) with uppercase headers — zero ambiguity about what each group contains.
- **Halo Effect:** The expanding search bar feels like a native app interaction, not a clunky page-redirect search. Thumbnail previews in suggestions give instant visual confirmation.
- **Micro-Interactions:** Debounced results with fade-in prevent the "flickering results" pattern common in cheap implementations.

---

## 8. Cart / Checkout / Payment Flow

**Current Components:** `CartPage`, `Item`, `PriceResult`, `ResultRow`, `EmptyShoppingCart`, `RemoveItemModal`, `CheckoutForm`, `StripeCheckout`, `PaypalCheckout`, `ShippingDetailForm`, `ContactInfoForm`, `CartSummary`, `StripePaymentResult`, `PaypalPaymentResult`, `Success`, `Failed`, `LoadingSkeleton`
**Reference:** Screenshot Set 8 — Shopify-style checkout page
**Design Goal:** Premium Shopify-like checkout experience — clean, focused, trust-building.

### 8.1 Checkout Page — Global Layout

#### Container
- `background: #FFFFFF`
- `min-height: 100vh; display: flex; flex-direction: column`
- No standard site header/footer — checkout uses its own minimal chrome (Shopify pattern)

#### Two-Column Layout
- `max-width: 1160px; margin: 0 auto; width: 100%`
- `display: grid; grid-template-columns: 1fr 420px; gap: 0`

##### Left Column (Main Form)
- `padding: 48px 64px 48px 48px; border-right: 1px solid #E0E0E0; min-height: 100vh`

##### Right Column (Order Summary)
- `padding: 48px 48px 48px 40px; background: #FAFAFA; min-height: 100vh`

#### Responsive
- Tablet (640–1023): `grid-template-columns: 1fr; gap: 0` — order summary collapses into accordion above form, `background: #FAFAFA; border-bottom: 1px solid #E0E0E0`
- Mobile (< 640): `grid-template-columns: 1fr; padding: 24px 16px` — fully stacked, order summary as collapsible dropdown at top

---

### 8.2 Checkout Header (Left Column Top)

#### Store Name / Logo
- `font-family: var(--font-heading); font-size: 24px; font-weight: 900; color: #000000; text-decoration: none; margin-bottom: 24px; display: block`
- Links back to `/` (homepage)

#### Breadcrumb Steps
- `display: flex; align-items: center; gap: 8px; margin-bottom: 32px`
- Steps: **Cart** → **Information** → **Shipping** → **Payment**
- Active step: `font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #000000`
- Completed step: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #1A73E8; text-decoration: none; cursor: pointer`
  - Hover: `text-decoration: underline`
- Inactive step: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #999999; cursor: default`
- Separator: `>` chevron, `font-size: 11px; color: #CCCCCC; margin: 0 2px`

#### Step Logic
- Each step corresponds to a checkout phase. The breadcrumb reflects the user's current position in the flow.
- Completed steps are clickable to navigate back (client-side, no page reload).
- Current step is bold. Future steps are grayed out.

---

### 8.3 Express Checkout

#### Section
- `margin-bottom: 28px`

#### Express Checkout Buttons Row
- `display: flex; gap: 8px; margin-bottom: 0`
- Each button: `flex: 1; height: 48px; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center`

##### Shop Pay Button
- `background: #5A31F4; color: #FFFFFF`
- Logo: ShopPay SVG, `height: 22px; width: auto`
- Hover: `background: #4A28CC; transition: background var(--transition-fast)`

##### PayPal Button
- `background: #FFC439; color: #000000`
- Logo: PayPal SVG, `height: 20px; width: auto`
- Hover: `background: #E8B333; transition: background var(--transition-fast)`

##### Google Pay Button
- `background: #000000; color: #FFFFFF`
- Logo: GPay SVG, `height: 20px; width: auto`
- Hover: `background: #333333; transition: background var(--transition-fast)`

#### "OR" Divider
- `display: flex; align-items: center; gap: 16px; margin: 24px 0`
- Lines: `flex: 1; height: 1px; background: #E0E0E0`
- Text: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap`

---

### 8.4 Contact Information Section

#### Section Header
- `display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px`
- Title: `font-family: var(--font-body); font-size: 18px; font-weight: 600; color: #000000`
- Login link: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #1A73E8; text-decoration: none`
  - Hover: `text-decoration: underline`

#### Email Input
- Uses §8.9 Form Input Component
- `width: 100%; margin-bottom: 12px`
- Label/placeholder: "Email"

#### Marketing Opt-in Checkbox
- `display: flex; align-items: flex-start; gap: 10px; margin-bottom: 28px`
- Checkbox: `width: 18px; height: 18px; border: 1.5px solid #CCCCCC; border-radius: 4px; background: #FFFFFF; cursor: pointer; flex-shrink: 0; margin-top: 1px`
  - Checked: `background: #000000; border-color: #000000` with white checkmark SVG
- Label: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #666666; line-height: 1.4`

---

### 8.5 Shipping Address Section

#### Section Header
- Title: `font-family: var(--font-body); font-size: 18px; font-weight: 600; color: #000000; margin-bottom: 16px`

#### Form Layout
- `display: flex; flex-direction: column; gap: 12px`

##### Country/Region Select
- Uses §8.9 Form Input Component (select variant)
- `width: 100%`

##### Name Row
- `display: grid; grid-template-columns: 1fr 1fr; gap: 12px`
- First Name input + Last Name input — each uses §8.9

##### Company Input (Optional)
- Uses §8.9, `width: 100%`
- Label includes "(optional)" in lighter weight: `font-weight: 400; color: #999999`

##### Address Input
- Uses §8.9, `width: 100%`

##### Suburb / City Input
- Uses §8.9, `width: 100%`

##### Country / State / Postcode Row
- `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px`
- Country select + State select + Postcode input — each uses §8.9
- Mobile (< 640): `grid-template-columns: 1fr; gap: 12px` — stacked

##### Phone Input
- Uses §8.9, `width: 100%`
- Info tooltip icon: `width: 14px; height: 14px; color: #CCCCCC; margin-left: 6px; cursor: help`

#### Save Info Checkbox
- Same style as marketing opt-in (§8.4)
- `margin-top: 8px`

---

### 8.6 Navigation Row (Bottom of Left Column)

#### Layout
- `display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 24px`

#### Return Link (Left)
- `display: flex; align-items: center; gap: 6px`
- Chevron left: `width: 12px; height: 12px; color: #1A73E8`
- Text: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #1A73E8; text-decoration: none`
  - Hover: `text-decoration: underline`
- Links to previous step (e.g., "Return to cart" → `/cart`)

#### Continue Button (Right)
- `height: 52px; padding: 0 40px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 15px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer`
- Hover: `background: #333333; transition: background var(--transition-fast)`
- Active: `background: #1A1A1A`
- Disabled (form invalid): `background: #CCCCCC; cursor: default`
- Text changes per step: "Continue to shipping" → "Continue to payment" → "Pay now"

#### Mobile (< 640)
- `flex-direction: column-reverse; gap: 16px`
- Button: `width: 100%`
- Return link: `text-align: center; width: 100%`

---

### 8.7 Policy Links (Bottom of Left Column)

#### Layout
- `display: flex; gap: 16px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #E0E0E0`

#### Links
- Each: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #1A73E8; text-decoration: none`
  - Hover: `text-decoration: underline`
- Items: Refund Policy, Shipping Policy, Privacy Policy, Terms of Service

---

### 8.8 Order Summary (Right Column)

#### Mobile Toggle Header
- Only visible on mobile/tablet (when right column collapses):
- `display: flex; justify-content: space-between; align-items: center; padding: 16px 0; cursor: pointer`
- Left: `display: flex; align-items: center; gap: 8px`
  - Cart icon: `width: 18px; height: 18px; color: #1A73E8`
  - Text: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #1A73E8`
  - Toggle chevron: `width: 10px; height: 6px; transform: rotate(0)` → open: `rotate(180deg)`
- Right (total): `font-family: var(--font-body); font-size: 18px; font-weight: 700; color: #000000`

---

#### Order Items List
- `display: flex; flex-direction: column; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid #E0E0E0`

##### Each Item Row
- `display: flex; align-items: center; gap: 16px`

###### Product Thumbnail
- `width: 64px; height: 64px; border-radius: 8px; border: 1px solid #E0E0E0; overflow: hidden; position: relative; flex-shrink: 0; background: #FFFFFF`
- Image: `width: 100%; height: 100%; object-fit: cover`
- **Quantity Badge:** `position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; border-radius: 999px; background: rgba(0, 0, 0, 0.7); color: #FFFFFF; font-family: var(--font-body); font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; padding: 0 5px`

###### Item Info (Middle)
- `flex: 1; min-width: 0`
- Product name: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`
- Variant: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; margin-top: 2px`

###### Item Price (Right)
- `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; flex-shrink: 0`
- Sale variant: `color: #C75050` + original `font-size: 12px; color: #999999; text-decoration: line-through; display: block; text-align: right`

---

#### Discount / Gift Card Input

##### Layout
- `display: flex; gap: 8px; padding: 20px 0; border-bottom: 1px solid #E0E0E0`

##### Input
- `flex: 1; height: 44px; padding: 0 14px; border: 1px solid #CCCCCC; border-radius: 6px; font-family: var(--font-body); font-size: 14px; color: #000000; background: #FFFFFF`
  - Placeholder: `color: #AAAAAA` — "Discount code or gift card"
  - Focus: `border-color: #000000; outline: none; box-shadow: 0 0 0 1px #000000; transition: all var(--transition-fast)`
  - Error: `border-color: #C75050; box-shadow: 0 0 0 1px #C75050`

##### Apply Button
- `height: 44px; padding: 0 20px; background: #E0E0E0; color: #888888; font-family: var(--font-body); font-size: 14px; font-weight: 500; border: none; border-radius: 6px; cursor: default`
- When input has value: `background: #000000; color: #FFFFFF; cursor: pointer`
  - Hover (active): `background: #333333; transition: background var(--transition-fast)`

##### Applied Discount Tag
- Shown below input when code is applied:
- `display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; background: #F0F0F0; border-radius: 6px; margin-top: 10px`
- Discount icon: `width: 14px; height: 14px; color: #888888`
- Code text: `font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #000000`
- Remove `×`: `width: 14px; height: 14px; color: #888888; cursor: pointer`
  - Hover: `color: #000000`

---

#### Price Breakdown

##### Layout
- `padding: 20px 0 0`
- `display: flex; flex-direction: column; gap: 10px`

##### Subtotal Row
- `display: flex; justify-content: space-between; align-items: center`
- Label: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666`
- Value: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #000000`

##### Shipping Row
- Same layout as subtotal
- Value: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #888888` — e.g., "Calculated at next step" or actual shipping cost

##### Tax Info (if applicable)
- `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; margin-top: 2px`

##### Total Row
- `display: flex; justify-content: space-between; align-items: baseline; padding-top: 16px; border-top: 1px solid #E0E0E0; margin-top: 6px`
- Label: `font-family: var(--font-body); font-size: 16px; font-weight: 400; color: #000000`
- Value: `font-family: var(--font-body); font-size: 24px; font-weight: 700; color: #000000`
  - Currency code (small): `font-size: 12px; font-weight: 400; color: #888888; margin-right: 6px; vertical-align: middle`

##### Tax Included Note
- `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; text-align: right; margin-top: 2px`
- e.g., "Including $X.XX in taxes"

---

### 8.9 Form Input Component (Shared)

#### Default State
```css
.checkout-input {
  width: 100%;
  height: 48px;
  padding: 12px 14px;
  border: 1px solid #CCCCCC;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  background: #FFFFFF;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
```

#### Floating Label (Shopify pattern)
```css
.checkout-input__label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  pointer-events: none;
  transition: all var(--transition-fast);
}
/* Focused or has-value */
.checkout-input:focus ~ .checkout-input__label,
.checkout-input.has-value ~ .checkout-input__label {
  top: 8px;
  transform: translateY(0);
  font-size: 11px;
  color: #888888;
}
.checkout-input:focus,
.checkout-input.has-value {
  padding-top: 20px;
  padding-bottom: 4px;
}
```

#### States
```css
.checkout-input:focus {
  border-color: #000000;
  box-shadow: 0 0 0 1px #000000;
}
.checkout-input--error {
  border-color: #C75050;
  box-shadow: 0 0 0 1px #C75050;
}
.checkout-input--error ~ .checkout-input__label {
  color: #C75050;
}
```

#### Error Message
- `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #C75050; margin-top: 4px; display: flex; align-items: center; gap: 4px`
- Error icon: `width: 12px; height: 12px; color: #C75050`

#### Select Variant
- Same container as text input
- Dropdown chevron: `position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 10px; height: 6px; color: #999999; pointer-events: none`
- `appearance: none; -webkit-appearance: none` (custom dropdown)
- Options dropdown: native `<select>` — no custom dropdown needed (Shopify pattern)

---

### 8.10 Cart Drawer (Slide-Out Sidebar)

**Current Components:** `CartPage`, `Item`, `PriceResult`, `ResultRow`, `EmptyShoppingCart`, `RemoveItemModal`
**Reference:** Screenshot Set 9 — Slide-out cart drawer from right
**Trigger:** Clicking cart icon in header (§3.2), or adding an item to cart from any page

The cart is **not** a separate page — it is a slide-out drawer that overlays the current page. Clicking "Check Out" navigates to the Shopify-style checkout (§8.1).

#### Overlay
- `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 9998; cursor: pointer`
- Clicking overlay closes the drawer
- Fade in: `opacity: 0 → 1` over `var(--transition-normal)`

#### Drawer Panel
- `position: fixed; top: 0; right: 0; bottom: 0; width: 420px; max-width: 100vw; background: #FFFFFF; z-index: 9999; display: flex; flex-direction: column`
- Slide-in: `transform: translateX(100%) → translateX(0)` over `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Slide-out (close): reverse, then `display: none`
- Mobile (< 640px): `width: 100vw` (full-screen drawer)

#### Drawer Header
- `display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 16px`
- Title: `font-family: var(--font-heading); font-size: 22px; font-weight: 700; color: #000000`
- Item count badge: `display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 12px; font-weight: 600; margin-left: 8px; vertical-align: middle`
- Close button: `width: 28px; height: 28px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center`
  - Icon: `×`, `width: 20px; height: 20px; color: #000000`
  - Hover: `color: #888888; transition: color var(--transition-fast)`

#### Free Shipping Progress Bar
- `padding: 0 24px 16px`
- Text: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #000000; margin-bottom: 8px`
  - Threshold amount: `font-weight: 700` (e.g., "Spend **$155.11** more to reach free shipping!")
- Progress bar container: `width: 100%; height: 4px; background: #E0E0E0; border-radius: 2px; overflow: hidden`
- Progress fill: `height: 100%; background: #000000; border-radius: 2px; transition: width var(--transition-normal)`
  - Width = percentage of free shipping threshold met
  - At 100%: `background: #4A7C59` (green, goal reached)

#### Cart Items List (Scrollable)
- `flex: 1; overflow-y: auto; padding: 0 24px; scrollbar-width: thin; scrollbar-color: #CCCCCC transparent`

##### Each Cart Item Row
- `display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; border-bottom: 1px solid #F0F0F0`
  - Last item: no border

###### Product Thumbnail
- `width: 64px; height: 80px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #F5F5F5`
- Image: `width: 100%; height: 100%; object-fit: cover`

###### Item Info (Middle)
- `flex: 1; min-width: 0`
- Product name: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; margin-bottom: 2px; line-height: 1.3`
  - Max 2 lines: `-webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden`
- Variant: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; margin-bottom: 4px`
- Price: `font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #000000`
  - Sale: `color: #C75050` + original `font-size: 12px; color: #999999; text-decoration: line-through; margin-left: 6px`

###### Remove Button (Top Right of Item)
- `position: absolute; top: 16px; right: 0; width: 20px; height: 20px; background: none; border: none; cursor: pointer`
  - Icon: `×`, `width: 14px; height: 14px; color: #CCCCCC`
  - Hover: `color: #000000; transition: color var(--transition-fast)`
- Item row needs: `position: relative`

###### Quantity Picker (Below Price, Inline)
- Compact variant: `display: inline-flex; align-items: center; border: 1px solid #E0E0E0; border-radius: 999px; height: 32px; margin-top: 8px`
- Minus button: `width: 32px; height: 100%; background: none; border: none; font-size: 14px; color: #000000; cursor: pointer; display: flex; align-items: center; justify-content: center`
  - Disabled (qty=1): `color: #CCCCCC; cursor: default`
- Count: `width: 28px; text-align: center; font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #000000; border: none; background: none`
- Plus button: same as minus

#### Drawer Footer (Pinned to Bottom)
- `padding: 16px 24px 24px; border-top: 1px solid #E0E0E0; background: #FFFFFF`
- `flex-shrink: 0`

##### Gift Wrap Checkbox
- `display: flex; align-items: center; gap: 10px; padding-bottom: 16px; border-bottom: 1px solid #E0E0E0; margin-bottom: 12px`
- Checkbox: `width: 16px; height: 16px; border: 1.5px solid #CCCCCC; border-radius: 3px; background: #FFFFFF; cursor: pointer; flex-shrink: 0`
  - Checked: `background: #000000; border-color: #000000` with white checkmark
- Label: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #000000`
  - Price: `font-weight: 600` inline (e.g., "For **$2.00**, please wrap the products in this order.")

##### Action Links Row
- `display: flex; gap: 20px; margin-bottom: 16px`
- Each link: `display: flex; align-items: center; gap: 6px; font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #000000; cursor: pointer; background: none; border: none; padding: 0`
  - Icon: `width: 14px; height: 14px; color: #888888`
  - Items: "Order note" (pencil icon), "Estimate Shipping" (location icon), "Coupon" (tag icon)
  - Hover: `color: #666666; transition: color var(--transition-fast)`

##### Estimated Total
- `display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px`
- Label: `font-family: var(--font-body); font-size: 16px; font-weight: 600; color: #000000`
- Value: `font-family: var(--font-body); font-size: 18px; font-weight: 700; color: #000000`
  - Currency suffix: `font-size: 14px; font-weight: 400; color: #888888; margin-left: 4px`

##### Tax/Shipping Note
- `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; margin-bottom: 16px`
  - "Shipping" link: `text-decoration: underline; color: #000000`

##### CTA Buttons Row
- `display: flex; gap: 10px`

###### View Cart Button
- `flex: 1; height: 48px; background: #FFFFFF; color: #000000; font-family: var(--font-body); font-size: 14px; font-weight: 600; border: 1.5px solid #000000; border-radius: 999px; cursor: pointer`
- Hover: `background: #F5F5F5; transition: background var(--transition-fast)`
- Links to `/cart` (full cart page fallback)

###### Check Out Button
- `flex: 1.5; height: 48px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 14px; font-weight: 600; border: none; border-radius: 999px; cursor: pointer`
- Hover: `background: #333333; transition: background var(--transition-fast)`
- Navigates to `/checkout` (§8.1 Shopify-style checkout)

#### Empty Drawer State
- Replaces cart items list when cart has 0 items
- `flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center`
- Icon: empty shopping bag, `width: 48px; height: 48px; color: #CCCCCC; margin-bottom: 16px`
- Heading: `font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: #000000; margin-bottom: 8px`
- Subtext: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #888888; margin-bottom: 24px`
- CTA: `btn-pill` (§11.3) — "Continue shopping" — closes drawer

#### Micro-Interactions
- Drawer open: panel slides from right `translateX(100%) → translateX(0)` over `300ms`; overlay fades in simultaneously
- Drawer close: reverse animation; overlay fades out
- Item add: new item row fades in `opacity: 0 → 1` with `transform: translateY(-8px) → translateY(0)` over `var(--transition-normal)`
- Item remove: row collapses `max-height → 0; opacity → 0` over `var(--transition-normal)`, remaining items slide up
- Quantity change: price value crossfades `opacity: 0 → 1` over `var(--transition-fast)`
- Progress bar: width animates smoothly on total change
- Free shipping reached: progress bar turns green with subtle pulse `@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.7 } }` once

#### Premium Rationale
- **Cognitive Fluency:** The drawer keeps users on their current page — no context switch to a cart page. This reduces the "leaving the store" feeling that causes cart abandonment. The free shipping progress bar provides a clear goal and motivates higher cart value.
- **Halo Effect:** The clean, focused drawer with generous padding and no clutter signals "this brand has its act together." The pill-shaped CTA buttons match the editorial tone from the hero sections.
- **Micro-Interactions:** The slide-in animation is a "peak" moment — the drawer feels alive, not static. Item add/remove animations prevent jarring content jumps.

---

### 8.10.B Cart Page (Fallback / "View Cart" Destination)

**Reference:** Linked from "View Cart" button in Cart Drawer. Full-page cart for users who prefer the traditional experience.

#### Layout
- Uses standard site header/footer (§3.2, §10)
- `max-width: var(--container-max); margin: 0 auto; padding: 48px`

#### Page Title
- `font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: #000000; margin-bottom: 40px; text-align: center`

#### Cart Table
- `width: 100%; border-collapse: collapse`

##### Table Header Row
- `border-bottom: 1px solid #E0E0E0; padding-bottom: 12px`
- Columns: Product (left-aligned, `width: 50%`), Price, Quantity, Total
- Each header: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 12px`

##### Cart Item Row
- `border-bottom: 1px solid #E0E0E0; padding: 24px 0`

###### Product Cell
- `display: flex; align-items: center; gap: 20px`
- Thumbnail: `width: 100px; height: 100px; border-radius: 8px; border: 1px solid #E0E0E0; overflow: hidden; flex-shrink: 0`
  - Image: `width: 100%; height: 100%; object-fit: cover`
- Info:
  - Product name: `font-family: var(--font-body); font-size: 15px; font-weight: 500; color: #000000; margin-bottom: 4px`
  - Variant: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-bottom: 8px`
  - Remove link: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; text-decoration: underline; cursor: pointer`
    - Hover: `color: #C75050`

###### Price Cell
- `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; text-align: center`
- Sale: `color: #C75050` + original `color: #999999; text-decoration: line-through; display: block; font-size: 12px`

###### Quantity Cell
- Uses inline quantity picker (same as §5.4 Quantity Picker but compact):
- `height: 40px` (instead of 48px)
- Minus/plus buttons: `width: 36px`
- Input: `width: 36px`
- `border: 1.5px solid #E0E0E0; border-radius: 8px`

###### Total Cell
- `font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #000000; text-align: right`

##### Mobile Cart (< 640px)
- No table layout. Each item rendered as card:
- `display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid #E0E0E0`
- Thumbnail: `width: 80px; height: 80px`
- Info stacks vertically on right with quantity picker below

#### Cart Footer
- `display: flex; justify-content: flex-end; margin-top: 32px`
- Right-aligned block: `max-width: 380px; width: 100%`

##### Subtotal
- `display: flex; justify-content: space-between; margin-bottom: 8px`
- Label: `font-family: var(--font-body); font-size: 16px; font-weight: 400; color: #000000`
- Value: `font-family: var(--font-body); font-size: 16px; font-weight: 600; color: #000000`

##### Tax/Shipping Note
- `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-bottom: 20px; text-align: right`
- e.g., "Taxes and shipping calculated at checkout"

##### Checkout Button
- `width: 100%; height: 52px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 15px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer`
- Hover: `background: #333333; transition: background var(--transition-fast)`

##### Continue Shopping Link
- `display: block; text-align: center; margin-top: 12px; font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #1A73E8; text-decoration: none`
  - Hover: `text-decoration: underline`

##### Mobile (< 640px)
- `max-width: 100%`
- Checkout button: `position: sticky; bottom: 16px; z-index: 10`

#### Empty Cart State
- **Current Component:** `EmptyShoppingCart`
- `text-align: center; padding: 80px 48px`
- Icon: empty bag, `width: 64px; height: 64px; color: #CCCCCC; margin: 0 auto 24px`
- Heading: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; margin-bottom: 12px`
  - e.g., "Your cart is empty"
- Subtext: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; margin-bottom: 28px`
- CTA: `btn-primary` (§11.3) — "Continue shopping"

#### Remove Item Modal
- **Current Component:** `RemoveItemModal`
- Overlay: `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 9999; display: flex; align-items: center; justify-content: center`
- Modal box: `background: #FFFFFF; border-radius: 12px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15)`
- Title: `font-family: var(--font-body); font-size: 18px; font-weight: 600; color: #000000; margin-bottom: 8px`
- Message: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; margin-bottom: 24px; line-height: 1.5`
- Buttons: `display: flex; gap: 12px`
  - Cancel: `btn-secondary` (§11.3), `flex: 1`
  - Remove: `flex: 1; height: 48px; background: #C75050; color: #FFFFFF; font-family: var(--font-body); font-size: 14px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer`
    - Hover: `background: #B04444; transition: background var(--transition-fast)`

---

### 8.11 Payment Step (Stripe / PayPal)

**Current Components:** `CheckoutForm`, `StripeCheckout`, `PaypalCheckout`

#### Payment Method Tabs
- `display: flex; border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden; margin-bottom: 24px`
- Each tab: `flex: 1; height: 48px; background: #FFFFFF; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000`
  - Icon: payment method logo, `height: 18px; width: auto`
  - Active: `background: #F5F5F5; box-shadow: inset 0 -2px 0 #000000`
  - Hover: `background: #FAFAFA; transition: background var(--transition-fast)`
  - Separator between tabs: `border-right: 1px solid #E0E0E0` (except last)

#### Stripe Payment Element
- Container: `border: 1px solid #E0E0E0; border-radius: 8px; padding: 20px; background: #FFFFFF`
- Stripe Elements renders inside — use Stripe's `appearance` API:
```js
{
  theme: 'stripe',
  variables: {
    colorPrimary: '#000000',
    colorBackground: '#FFFFFF',
    colorText: '#000000',
    colorDanger: '#C75050',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSizeBase: '14px',
    borderRadius: '6px',
    spacingGridRow: '16px',
  },
  rules: {
    '.Input': {
      border: '1px solid #CCCCCC',
      boxShadow: 'none',
      padding: '12px 14px',
    },
    '.Input:focus': {
      border: '1px solid #000000',
      boxShadow: '0 0 0 1px #000000',
    },
    '.Label': {
      fontSize: '13px',
      fontWeight: '400',
      color: '#888888',
    }
  }
}
```

#### Pay Now Button (final step)
- `width: 100%; height: 52px; background: #000000; color: #FFFFFF; font-family: var(--font-body); font-size: 15px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; margin-top: 24px`
- Hover: `background: #333333`
- Loading state: text replaced with spinner (see §11.5), `cursor: wait`

#### Security Trust Line
- `display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 16px`
- Lock icon: `width: 14px; height: 14px; color: #888888`
- Text: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888`
  - e.g., "All transactions are secure and encrypted"

---

### 8.12 Payment Result Pages

**Current Components:** `Success`, `Failed`, `OrderDetail`, `OrderInformation`, `ProductSummary`, `OrderAnnotation`, `LoadingSkeleton`

#### Success Page

##### Layout
- `max-width: 720px; margin: 0 auto; padding: 64px 48px; text-align: center`

##### Checkmark Icon
- `width: 64px; height: 64px; border-radius: 50%; background: #4A7C59; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px`
- Checkmark: `width: 28px; height: 28px; color: #FFFFFF`
- Entry animation: `@keyframes checkmark-in { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }; animation: checkmark-in 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`

##### Thank You Title
- `font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: #000000; margin-bottom: 8px`

##### Order Number
- `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #888888; margin-bottom: 32px`

##### Order Details Card
- `background: #FAFAFA; border-radius: 12px; padding: 32px; text-align: left; margin-bottom: 32px`
- Section title: `font-family: var(--font-body); font-size: 16px; font-weight: 600; color: #000000; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #E0E0E0`

###### Order Items
- Same as §8.8 Order Items List (item rows with thumbnail, name, quantity, price)

###### Shipping Info
- `display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E0E0E0`
- Each info block:
  - Label: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; margin-bottom: 6px`
  - Value: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #000000; line-height: 1.5`

##### Action Buttons
- `display: flex; gap: 12px; justify-content: center`
- "Track Order": `btn-primary` (§11.3)
- "Continue Shopping": `btn-secondary` (§11.3)

---

#### Failed Page

##### Layout
- `max-width: 560px; margin: 0 auto; padding: 64px 48px; text-align: center`

##### Error Icon
- `width: 64px; height: 64px; border-radius: 50%; background: #FEE2E2; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px`
- `×` icon: `width: 28px; height: 28px; color: #C75050`

##### Error Title
- `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; margin-bottom: 12px`

##### Error Message
- `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin-bottom: 32px`

##### Action Buttons
- "Try Again": `btn-primary` (§11.3) — returns to checkout
- "Contact Support": `btn-secondary` (§11.3)

---

#### Loading Skeleton
- **Current Component:** `LoadingSkeleton`
- Uses CSS shimmer animation:
```css
.skeleton {
  background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease infinite;
  border-radius: 6px;
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```
- Checkmark placeholder: `width: 64px; height: 64px; border-radius: 50%`
- Title placeholder: `width: 240px; height: 24px; margin: 0 auto 8px`
- Order number placeholder: `width: 180px; height: 14px; margin: 0 auto 32px`
- Card placeholder: `width: 100%; height: 320px; border-radius: 12px`

---

### 8.13 Checkout Micro-Interactions Summary

| Element | Interaction | Spec |
|---|---|---|
| Form inputs | Focus | Border + box-shadow transitions over `var(--transition-fast)` |
| Floating labels | Float up | `top: 50% → 8px; font-size: 14px → 11px` over `var(--transition-fast)` |
| Express checkout buttons | Hover | Background darkens over `var(--transition-fast)` |
| Continue button | Loading | Text → spinner swap, `opacity: 0 → 1` |
| Order summary items | Page load | Stagger fade-in: each item `opacity: 0 → 1` with `50ms` delay increment |
| Discount input | Apply | Button background `#E0E0E0 → #000000` when input has value |
| Success checkmark | Page load | `scale(0) → scale(1)` bounce with `cubic-bezier(0.175, 0.885, 0.32, 1.275)` |
| Price total | Update | Number transition using `CountUp` pattern (optional) |
| Step breadcrumb | Step change | Active step fades in bold, previous step transitions to link color |

### 8.14 Premium Rationale

- **Halo Effect (critical):** The checkout page is the highest-trust-requirement moment. Removing the full site header and showing only the store name creates focused, distraction-free trust. The Shopify-style two-column layout is the most recognized and trusted checkout pattern in e-commerce — users feel safe because it looks familiar.
- **Cognitive Load:** Each form step collects only one category of information (contact → shipping → payment). The floating labels eliminate label clutter. Express checkout buttons at the top let returning users skip the entire form. The right-column order summary stays visible throughout, preventing "what am I paying for?" anxiety.
- **Micro-Interactions:** The floating label animation provides satisfying feedback. The success page checkmark bounce is a "peak" moment (peak-end rule) — the last experience the user has in the purchase flow is a moment of delight, coloring their entire memory of the transaction positively.

---

## 9. Blog

**Current Components:** `BlogLayout`, `PreviewPost`, `FollowUs`, blog routes (`index.tsx`, `page/$page.tsx`, `post/$blog.tsx`), Contentful CMS integration
**Reuses:** v2 Button (§11.3), v2 Badge (§11.2), v2 Footer (§10)

### 9.1 Blog Landing Page

#### Hero Section
- Full-width warm background: `background: var(--color-bg-warm); padding: 64px 0; text-align: center`
- Mobile: `padding: 40px 16px`
- Title: `font-family: var(--font-heading); font-size: 40px; font-weight: 700; color: #000000; margin-bottom: 12px` — "Our Blog"
- Subtitle: `font-family: var(--font-body); font-size: 16px; color: var(--color-text-body); max-width: 480px; margin: 0 auto` — "Tips, stories, and inspiration for smarter shopping"

#### Blog Grid Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 48px var(--container-padding)`
- `display: grid; grid-template-columns: 1fr 300px; gap: 48px`
- Tablet: `grid-template-columns: 1fr` (sidebar below)
- Mobile: `grid-template-columns: 1fr`

#### Post Grid (Main Column)
- `display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px`
- Mobile: `grid-template-columns: 1fr; gap: 24px`

#### Pagination
- `display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 48px`
- Each page number: `width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--color-text-body); border: 1px solid var(--color-border-light); cursor: pointer; transition: all var(--transition-fast)`
- Active page: `background: #000000; color: #FFFFFF; border-color: #000000`
- Hover (non-active): `background: #F9F9F9; border-color: #CCCCCC`
- Prev/Next arrows: same size, chevron SVG icons, disabled state: `opacity: 0.3; pointer-events: none`

### 9.2 Blog Post Card (Preview)

#### Layout
- `border-radius: var(--radius-md); overflow: hidden; background: #FFFFFF; border: 1px solid #F0F0F0; transition: all var(--transition-normal); cursor: pointer`
- Hover: `box-shadow: var(--shadow-card-hover); transform: translateY(-2px)`

#### Image
- `width: 100%; aspect-ratio: 16/10; object-fit: cover; background: var(--color-bg-card)`
- Hover: `transform: scale(1.03)` inside `overflow: hidden` container over `var(--transition-slow)`

#### Content Area
- `padding: 20px`

#### Tags
- v2 Badge (§11.2) — use `variant: "new"` for tags
- `display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px`
- Compact size: `font-size: 10px; padding: 3px 8px`

#### Title
- `font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: #000000; line-height: 1.3; margin-bottom: 8px`
- Clamp to 2 lines: `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`

#### Excerpt
- `font-family: var(--font-body); font-size: 14px; color: var(--color-text-body); line-height: 1.5; margin-bottom: 12px`
- Clamp to 3 lines

#### Meta Row
- `display: flex; align-items: center; justify-content: space-between`
- Date: `font-family: var(--font-body); font-size: 12px; color: var(--color-text-muted)` — format: "Feb 23, 2026"
- Read time (if available): `font-size: 12px; color: var(--color-text-muted)` — "5 min read"

### 9.3 Blog Post (Full Article)

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 0 var(--container-padding)`
- `display: grid; grid-template-columns: 1fr 300px; gap: 48px; padding-top: 32px`
- Tablet/Mobile: `grid-template-columns: 1fr`

#### Back Navigation
- `margin-bottom: 24px; display: flex; align-items: center; gap: 8px`
- Arrow + "Back to Blog": `font-family: var(--font-body); font-size: 14px; color: var(--color-text-secondary); text-decoration: none; transition: color var(--transition-fast)`
- Hover: `color: #000000`

#### Article Header
- Tags: v2 Badge row, `margin-bottom: 16px`
- Title: `font-family: var(--font-heading); font-size: 36px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 16px`
- Mobile: `font-size: 28px`
- Meta: `font-family: var(--font-body); font-size: 13px; color: var(--color-text-muted); margin-bottom: 32px` — "Published Feb 23, 2026"

#### Featured Image
- `width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 40px`

#### Article Body (Rich Text from Contentful)
- Prose styling (constrained width for readability):
  - `max-width: 680px`
  - Paragraphs: `font-family: var(--font-body); font-size: 16px; color: var(--color-text-body); line-height: 1.8; margin-bottom: 24px`
  - Headings (h2): `font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: #000000; margin: 40px 0 16px`
  - Headings (h3): `font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: #000000; margin: 32px 0 12px`
  - Links: `color: #000000; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px`
  - Link hover: `text-decoration-thickness: 2px`
  - Inline images: `border-radius: var(--radius-sm); margin: 32px 0`
  - Blockquotes: `border-left: 3px solid #000000; padding-left: 20px; margin: 32px 0; font-style: italic; color: var(--color-text-secondary)`
  - Lists: `padding-left: 24px; margin-bottom: 24px; line-height: 1.8`

### 9.4 Blog Sidebar

#### Latest Posts Widget
- Heading: `font-family: var(--font-body); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #000000; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #000000`
- Each post: `display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #F0F0F0; cursor: pointer`
- Thumbnail: `width: 72px; height: 72px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0`
- Title: `font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #000000; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`
- Date: `font-size: 11px; color: var(--color-text-muted); margin-top: 4px`
- Hover: title `text-decoration: underline`
- Max 6 posts

#### Follow Us Widget
- `margin-top: 32px; padding: 24px; background: var(--color-bg-card); border-radius: var(--radius-md)`
- Heading: same uppercase style as Latest Posts
- Social icons: `display: flex; gap: 16px; margin-top: 16px`
- Each icon: `width: 40px; height: 40px; border-radius: 50%; background: #000000; color: #FFFFFF; display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast)`
- Hover: `background: #333333; transform: scale(1.05)`

### 9.5 Micro-Interactions
- Post card hover: lift + shadow + image scale (matches ProductCard pattern)
- Pagination: active number has smooth background transition
- Blog post: rich text images lazy-load with fade-in (`opacity: 0` → `opacity: 1`)
- Sidebar post hover: title underline slides in
- Social icons: scale bounce on hover

### 9.6 Premium Rationale
- **Cognitive Fluency:** Two-column layout with generous whitespace follows editorial magazine patterns. Post cards use clear visual hierarchy (image → tags → title → excerpt → meta) matching the reading flow.
- **Halo Effect:** Large hero section with warm background creates a curated, lifestyle-brand feel rather than a generic blog listing. Article typography (16px body, 1.8 line-height, max-width constraint) ensures comfortable reading.
- **Micro-Interactions:** Post card hover effects match the product card interactions (§11.1), creating a cohesive "everything in this store is premium" perception.

---

## 10. Footer

**Current Components:** `Footer`, `FooterContent`, `FooterTopInfo`, `FooterTabletLayout`, `FooterMobileLayout`, `CompanySection`, `LogoSection`, `EmailSubscribe`, `ShoppingIdeaSection`, `ResourceSection`
**Reference:** Screenshot Set 7 — bottom of product page

### 10.1 Footer Layout

#### Container
- `width: 100%; background: #FFFFFF; border-top: 1px solid #E0E0E0`
- Inner: `max-width: var(--container-max); margin: 0 auto; padding: 64px 48px 32px`

#### Main Content Grid
- `display: grid; grid-template-columns: 1.2fr 0.8fr 0.8fr 1.2fr; gap: 48px; margin-bottom: 48px`

---

### 10.2 Newsletter Column (Column 1)

**Current Component:** `EmailSubscribe`

#### Content
- Heading: `font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 8px`
- Subtext: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; margin-bottom: 20px; line-height: 1.5`

#### Email Input + Submit
- Container: `display: flex; border: 1.5px solid #E0E0E0; border-radius: 8px; overflow: hidden; height: 44px`
- Input: `flex: 1; padding: 0 14px; border: none; font-family: var(--font-body); font-size: 14px; color: #000000; background: #FFFFFF; outline: none`
  - Placeholder: `color: #AAAAAA`
  - Focus: container `border-color: #000000; transition: border-color var(--transition-fast)`
- Submit button: `width: 44px; height: 100%; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center`
  - Icon: right arrow `→`, `width: 18px; height: 18px; color: #000000`
  - Hover: `background: #F5F5F5; transition: background var(--transition-fast)`

#### Legal Text
- `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888; margin-top: 12px; line-height: 1.4`
- Links ("Terms of Use", "Privacy Policy"): `color: #000000; text-decoration: underline`

---

### 10.3 Link Columns (Columns 2–3)

**Current Components:** `CompanySection`, `ShoppingIdeaSection`, `ResourceSection`

#### Column Structure
- Heading: `font-family: var(--font-body); font-size: 16px; font-weight: 700; color: #000000; margin-bottom: 20px`
- Links: `display: flex; flex-direction: column; gap: 12px`
  - Each link: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; text-decoration: none`
  - Hover: `color: #000000; transition: color var(--transition-fast)`

#### Column 2 — "Shop"
- Shop All, Sale, Lookbook, Basic Collections

#### Column 3 — "Customer care"
- My Account, Contact, FAQs, Support, Shipping and Returns

---

### 10.4 About Column (Column 4)

#### Content
- Heading: `font-family: var(--font-body); font-size: 16px; font-weight: 700; color: #000000; margin-bottom: 20px`
- Description: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin-bottom: 16px; max-width: 280px`
- "Learn More" link: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000; text-decoration: none; border-bottom: 1.5px solid #000000; padding-bottom: 2px`
  - Hover: `border-color: #888888; color: #666666; transition: all var(--transition-fast)`

---

### 10.5 Footer Bottom Bar

#### Layout
- `border-top: 1px solid #E0E0E0; padding-top: 24px`
- `display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px`

#### Left Side — Region Selector
- `display: flex; align-items: center; gap: 8px; cursor: pointer`
- Flag icon: `width: 20px; height: 14px`
- Text: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #000000`
- Chevron: `width: 10px; height: 6px; color: #888888`

#### Center — Legal Row
- Copyright: `font-family: var(--font-body); font-size: 12px; font-weight: 400; color: #888888`
- Links ("Privacy Policy", "Terms of Service"): `font-size: 12px; color: #888888; text-decoration: none; margin-left: 16px`
  - Hover: `color: #000000`

#### Right Side — Social Icons + Payment Methods
- Social icons: `display: flex; gap: 16px; align-items: center`
  - Each: `width: 20px; height: 20px; color: #888888; cursor: pointer`
  - Hover: `color: #000000; transition: color var(--transition-fast)`
  - Icons: Facebook, X (Twitter), Instagram, TikTok, Pinterest, YouTube

- Payment icons: `display: flex; gap: 8px; align-items: center; margin-left: 24px`
  - Each: `height: 24px; width: auto` — Visa, Mastercard, Amex, PayPal, Diners, Discover
  - Grayscale filter: `filter: grayscale(0.3)` for premium understated look

#### Responsive
- Mobile: stacks vertically
  - `flex-direction: column; align-items: flex-start; gap: 24px`
  - Social + payment wrap to separate rows

#### Premium Rationale
- **Cognitive Fluency:** 4-column grid with clear category separation. No visual noise — just links, a single email input, and essential legal info.
- **Halo Effect:** The newsletter CTA uses a minimal inline input (not a modal or popup) — respects the user's attention. Payment icons signal trust at the final touchpoint.

---

## 11. Shared Components

> *Will be populated as shared patterns emerge from screenshots*

### 11.1 Product Card (Standard)

**Current Component:** `ProductCard` / `RegularCardWithActionButton`
**Used In:** §4.3 Carousel, §4.4 Tabbed Grid, §3.3 Mega Menu trending, §6 Category pages

#### Container
```css
.product-card {
  background: #F5F5F5;
  border-radius: 12px;
  border: none;
  box-shadow: none;
  overflow: hidden;
  cursor: pointer;
  width: 100%; /* fills grid column */
  display: flex;
  flex-direction: column;
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}
```

#### Image Area
```css
.product-card__image {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}
```

##### Primary & Secondary Image (Hover Swap)
```css
.product-card__image-primary {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  transition: opacity var(--transition-normal);
  opacity: 1;
}
.product-card__image-secondary {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* secondary is lifestyle/context photo — full bleed */
  opacity: 0;
  transition: opacity var(--transition-normal);
}
/* Hover: swap to secondary image (if available) */
.product-card:hover .product-card__image-primary {
  opacity: 0;
}
.product-card:hover .product-card__image-secondary {
  opacity: 1;
}
```
- **Primary image:** Product on neutral background, centered with padding (`object-fit: contain`)
- **Secondary image:** Lifestyle/context photo, full bleed within the image area (`object-fit: cover`)
- If product has no secondary image, primary remains visible on hover (no swap)

##### Quick View Icon (Top-Right, Default State)
```css
.product-card__quickview {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FFFFFF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  z-index: 2;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity var(--transition-fast), transform var(--transition-fast), background var(--transition-fast);
}
.product-card__quickview svg {
  width: 16px;
  height: 16px;
  color: #000000;
}
.product-card:hover .product-card__quickview {
  opacity: 1;
  transform: translateY(0);
}
.product-card__quickview:hover {
  background: #F5F5F5;
}
```
- Icon: magnifying glass (search/quick-view)
- Appears on card hover, hidden by default

##### Image Carousel Arrow (Right Side, Hover State)
```css
.product-card__image-next {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FFFFFF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  z-index: 2;
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.product-card__image-next svg {
  width: 12px;
  height: 12px;
  color: #000000;
}
.product-card:hover .product-card__image-next {
  opacity: 1;
}
.product-card__image-next:hover {
  background: #F5F5F5;
}
```
- Chevron right `>` icon, centered vertically
- Cycles through product images (primary → secondary → additional)
- Only shown if product has 2+ images

##### "Choose Options" CTA Overlay (Hover State)
```css
.product-card__cta {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--transition-fast), transform var(--transition-fast), background var(--transition-fast);
}
.product-card:hover .product-card__cta {
  opacity: 1;
  transform: translateY(0);
}
.product-card__cta:hover {
  background: #FFFFFF;
}
```
- Text: "Choose Options" (for products with variants) or "Add to Cart" (for single-variant products)
- Frosted glass effect with `backdrop-filter: blur(4px)` over the image
- Slides up + fades in on card hover

#### Badges (top-left, inside image area)
```css
.product-card__badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  z-index: 3;
}
```
See §11.2 for badge component spec. Badges remain visible on hover (z-index above CTA overlay).

#### Text Area
```css
.product-card__info {
  padding: 16px 16px 20px;
  background: #FFFFFF;
}
.product-card__category {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  color: #888888;
  margin-bottom: 4px;
  line-height: 1.4;
}
.product-card__name {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  line-height: 1.3;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-card__price-sale {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: #C75050;
}
.product-card__price-original {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  color: #999999;
  text-decoration: line-through;
  margin-left: 8px;
}
.product-card__price-regular {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}
```
- "From" prefix: same style as sale/regular price, prepended inline
- Text area background is `#FFFFFF` — distinct from the `#F5F5F5` image area, creating a clean visual separation

#### States
```css
/* Default → Hover: lift + shadow */
.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
/* Active: settle back down */
.product-card:active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transform: translateY(0);
}
```
- On hover: card lifts `2px`, shadow appears, secondary image swaps in, CTA overlay slides up, quick-view icon and carousel arrow fade in
- Primary image does **not** scale on hover (replaced by secondary image swap instead)

---

### 11.2 Tags / Badges

**Current Component:** `Tags` (Pennant, RightTiltBox, RoundCornerTag, Scratch, SunShine, TiltRibbon), `SaleTag`

#### Unified Pill Badge System
All 6 existing tag variants are consolidated into a single `<Badge>` component:

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: #FFFFFF;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
```

#### Variants

| Variant | `background` | `color` | Example text |
|---|---|---|---|
| `discount` | `#4A7C59` | `#FFFFFF` | "-20%", "-30%", "-34%" |
| `new` | `#C75050` | `#FFFFFF` | "New" |
| `selling-fast` | `#4A7C59` | `#FFFFFF` | "Selling fast!" |
| `hot` | `#E8A040` | `#FFFFFF` | "Hot" |
| `limited` | `#333333` | `#FFFFFF` | "Limited" |

#### Positioning
- Always inside a `position: relative` parent (image container)
- `position: absolute; top: 12px; left: 12px`
- Multiple badges: parent `display: flex; gap: 6px`

#### Premium Rationale
- Unified pill shape eliminates the 6 different tag visual styles (pennants, ribbons, scratches) that created visual noise. A single shape language = cognitive fluency.

### 11.3 Buttons

**Current Component:** `RoundButton` (addtocart, buynow, checkout, green variants)

#### Unified Button System

All existing button variants consolidated into 3 tiers:

##### Primary Button (Buy It Now, Checkout)
```css
.btn-primary {
  height: 48px;
  padding: 0 32px;
  background: #000000;
  color: #FFFFFF;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--transition-fast);
}
.btn-primary:hover { background: #333333; }
.btn-primary:active { background: #1A1A1A; }
.btn-primary:disabled { background: #CCCCCC; cursor: default; }
```

##### Secondary Button (Add to Cart)
```css
.btn-secondary {
  height: 48px;
  padding: 0 32px;
  background: #FFFFFF;
  color: #000000;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid #E0E0E0;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-secondary:hover { background: #F5F5F5; border-color: #CCCCCC; }
.btn-secondary:active { background: #EEEEEE; }
```

##### Pill Button (Hero CTAs, Shop Now)
```css
.btn-pill {
  padding: 12px 28px;
  background: #000000;
  color: #FFFFFF;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background var(--transition-fast);
}
.btn-pill:hover { background: #333333; }
/* Inverted variant (on dark backgrounds) */
.btn-pill--inverted {
  background: #FFFFFF;
  color: #000000;
}
.btn-pill--inverted:hover { background: #F0F0F0; }
```

#### Premium Rationale
- 3 button tiers creates clear visual hierarchy: primary (solid black, high-commitment actions) > secondary (outline, lower-commitment) > pill (contextual CTAs).
- `border-radius: 8px` for action buttons, `999px` for promotional pills — separates functional from editorial.

### 11.4 Modals

**Current Components:** `PeasyDealMessageModal` (MUI), `ItemAddedModal`, `LoadingModal`, `EmailSubscribeModal` (Chakra), `PromoteSubscriptionModal` (Chakra)
**Reuses:** v2 Button (§11.3), v2 CheckoutInput (§8.9)

#### 11.4.1 Base Modal (Shared Shell)

**Overlay**
- `position: fixed; inset: 0; z-index: 1100; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px)`
- Animation: `opacity: 0` → `opacity: 1` over `var(--transition-normal)`
- Close on: overlay click, Escape key

**Dialog Container**
- `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1101`
- `background: #FFFFFF; border-radius: var(--radius-lg); padding: 32px; max-width: 480px; width: calc(100% - 32px); max-height: 90vh; overflow-y: auto`
- Mobile: `max-width: calc(100% - 32px); padding: 24px`
- Animation: `opacity: 0; transform: translate(-50%, -48%)` → `opacity: 1; transform: translate(-50%, -50%)` over `var(--transition-menu)`
- Box shadow: `0 24px 48px rgba(0, 0, 0, 0.12)`

**Close Button**
- `position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer; transition: background var(--transition-fast)`
- Icon: X SVG, `width: 16px; height: 16px; color: var(--color-text-secondary)`
- Hover: `background: #F5F5F5`

#### 11.4.2 Item Added to Cart Modal

**Purpose:** Brief confirmation after add-to-cart action. Auto-dismisses after 2s.

**Layout**
- `text-align: center; padding: 40px 32px`
- No close button (auto-dismiss only), but close on overlay click

**Success Icon**
- Animated checkmark circle: `width: 64px; height: 64px; margin: 0 auto 20px`
- Circle: `stroke: #4A7C59; stroke-width: 2; fill: none` → fills `#4A7C59` on complete
- Checkmark: `stroke: #FFFFFF; stroke-width: 2.5` — draws in with `stroke-dasharray` animation
- Animation: circle fills over `300ms`, checkmark draws over `400ms` with `150ms` delay

**Text**
- Title: `font-family: var(--font-body); font-size: 16px; font-weight: 600; color: #000000; margin-bottom: 8px` — "Added to cart"
- Subtitle: `font-size: 14px; color: var(--color-text-secondary)` — "1 item · Continue shopping or view cart"

**Actions**
- `display: flex; gap: 12px; justify-content: center; margin-top: 24px`
- "Continue Shopping": v2 Button secondary, size sm
- "View Cart": v2 Button primary, size sm
- Auto-dismiss: fades out after 2000ms unless user interacts

#### 11.4.3 Email Subscription Modal (Promotional)

**Purpose:** Captures email for discount voucher. Shows on first visit after 2s delay, respects localStorage dismissal (1 hour cooldown).

**Layout**
- `max-width: 520px; padding: 0; overflow: hidden`
- `display: grid; grid-template-columns: 1fr 1fr` (desktop)
- Mobile: `grid-template-columns: 1fr` (image hidden)

**Image Panel (Left)**
- `background: var(--color-bg-warm); display: flex; align-items: center; justify-content: center; padding: 32px; min-height: 360px`
- Lifestyle product image, `object-fit: contain; max-width: 100%`

**Content Panel (Right)**
- `padding: 40px 32px`

**Headline**
- `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 8px` — "Get £3 Off"
- Subtitle: `font-family: var(--font-body); font-size: 14px; color: var(--color-text-body); line-height: 1.5; margin-bottom: 24px` — "Subscribe for exclusive deals and your welcome discount."

**Email Input**
- Same floating-label pattern as CheckoutInput (§8.9)
- `width: 100%; margin-bottom: 12px`

**Subscribe Button**
- v2 Button primary, full width: `width: 100%` — "Subscribe"
- Loading state: spinner in button

**Terms Text**
- `font-family: var(--font-body); font-size: 11px; color: var(--color-text-muted); line-height: 1.4; margin-top: 12px`
- "Minimum order £30. Terms apply."

**Success State**
- Replaces form content
- Animated checkmark (same as §11.4.2)
- Title: "You're in!" — `font-size: 20px; font-weight: 700`
- Body: "Check your email for your £3 voucher code." — `font-size: 14px; color: var(--color-text-body)`

**Error State**
- Red error message below input: `font-size: 13px; color: #C75050; margin-top: 8px`

**Dismissal Logic**
- Close button (top-right)
- On close: store dismissal timestamp in `localStorage` with 1-hour TTL
- Do not show to returning visitors within cooldown
- Do not show if already subscribed (check cookie/localStorage)

#### 11.4.4 Confirmation Modal (Generic)

**Purpose:** Reusable for confirm/cancel actions (e.g., remove cart item, cancel order).

**Layout**
- `max-width: 400px; text-align: center; padding: 40px 32px`

**Icon (Optional)**
- Warning: `width: 48px; height: 48px; color: #E8A040; margin: 0 auto 16px` — triangle exclamation SVG
- Destructive: `color: #C75050` — circle exclamation SVG

**Text**
- Title: `font-family: var(--font-body); font-size: 18px; font-weight: 600; color: #000000; margin-bottom: 8px`
- Body: `font-size: 14px; color: var(--color-text-body); line-height: 1.5; margin-bottom: 24px`

**Actions**
- `display: flex; gap: 12px; justify-content: center`
- Cancel: v2 Button secondary — "Cancel"
- Confirm: v2 Button primary — customizable label
- Destructive variant: confirm button `background: #C75050; hover: #A33E3E`

#### 11.4.5 Premium Rationale
- **Cognitive Fluency:** All modals share the same shell (overlay, radius, padding, close pattern) — the user learns one mental model. Auto-dismiss on item-added reduces interruption to zero.
- **Halo Effect:** The email subscription modal uses a split-card layout with lifestyle imagery instead of a generic popup — it feels like a magazine ad, not a spam popup. Generous padding and the warm background convey premium brand values.
- **Micro-Interactions:** The animated checkmark provides visceral satisfaction. The modal entrance animation (subtle slide-up + fade) feels native and polished.

---

### 11.5 Loading States

**Current Components:** `CssSpinner` (3 schemes), `Spinner` (react-spinners ClipLoader), `Snackbar` (MUI Alert + react-simple-snackbar), `LoadingModal`
**Reuses:** Design tokens for consistent animation timing

#### 11.5.1 Spinner

**Primary Spinner (Replaces all spinner variants)**
- SVG-based circle spinner: `width: 24px; height: 24px` (default size)
- `stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round`
- `stroke-dasharray: 60 200; stroke-dashoffset: 0`
- Animation: `@keyframes spin { to { transform: rotate(360deg) } }` — `animation: spin 800ms linear infinite`
- Sizes: `sm` (16px), `md` (24px), `lg` (40px), `xl` (64px)
- Color: inherits from parent (`currentColor`), defaults to `var(--color-text-secondary)`
- Props: `size?: "sm" | "md" | "lg" | "xl"; className?: string`

#### 11.5.2 Skeleton Loader

**Purpose:** Replaces content areas while data loads. Used in product grids, blog cards, order details.

**Base Skeleton Styles** (already defined in `redesign-base.css`)
```css
.skeleton {
  background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease infinite;
  border-radius: var(--radius-sm);
}
```

**Product Card Skeleton**
- Already implemented in v2 ProductCard `loading` prop
- Aspect-ratio placeholder + text line placeholders with shimmer

**Blog Post Card Skeleton**
- Image: `aspect-ratio: 16/10; border-radius: var(--radius-md) var(--radius-md) 0 0`
- Tag placeholders: `width: 60px; height: 20px; border-radius: var(--radius-full)`
- Title: `height: 20px; width: 80%`
- Excerpt: two lines, `height: 14px; width: 100%` and `width: 65%`
- Date: `height: 12px; width: 90px`

**Generic Content Skeleton Props**
```typescript
interface SkeletonProps {
  width?: string | number;    // default "100%"
  height?: string | number;   // default "16px"
  rounded?: "sm" | "md" | "lg" | "full";  // default "sm"
  className?: string;
}
```

#### 11.5.3 Full-Page Loading Overlay

**Purpose:** Replaces `LoadingModal`. Used during payment processing and other blocking operations.

**Layout**
- `position: fixed; inset: 0; z-index: 1200; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px)`
- `display: flex; flex-direction: column; align-items: center; justify-content: center`

**Content**
- Spinner: size `xl` (64px), `color: #000000`
- Message (optional): `font-family: var(--font-body); font-size: 15px; color: var(--color-text-secondary); margin-top: 16px`
- Example: "Processing your payment..."

**Animation**
- Fade in: `opacity: 0` → `opacity: 1` over `var(--transition-normal)`
- Spinner has continuous rotation

#### 11.5.4 Toast Notifications (Replaces Snackbar)

**Purpose:** Non-blocking success/error/info feedback. Replaces MUI Snackbar + react-simple-snackbar.

**Position & Layout**
- `position: fixed; top: 24px; right: 24px; z-index: 1300`
- Mobile: `top: 16px; right: 16px; left: 16px` (full-width)
- Stack: multiple toasts stack vertically with `gap: 8px`

**Toast Container**
- `min-width: 320px; max-width: 420px; padding: 14px 16px; border-radius: var(--radius-sm); display: flex; align-items: flex-start; gap: 12px`
- `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12)`
- Mobile: `min-width: unset; width: 100%`

**Variants**
| Variant | Background | Icon Color | Border-Left |
|---|---|---|---|
| success | `#FFFFFF` | `#4A7C59` | `3px solid #4A7C59` |
| error | `#FFFFFF` | `#C75050` | `3px solid #C75050` |
| info | `#FFFFFF` | `#000000` | `3px solid #000000` |
| warning | `#FFFFFF` | `#E8A040` | `3px solid #E8A040` |

**Icon**
- `width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px`
- Success: checkmark circle
- Error: X circle
- Info: info circle
- Warning: triangle exclamation

**Text**
- Title (optional): `font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #000000`
- Message: `font-family: var(--font-body); font-size: 13px; color: var(--color-text-body); line-height: 1.4`

**Close Button**
- `margin-left: auto; width: 16px; height: 16px; color: var(--color-text-muted); cursor: pointer; flex-shrink: 0`
- Hover: `color: #000000`

**Behavior**
- Auto-dismiss: 4000ms (success/info), 6000ms (error/warning)
- Hover pauses auto-dismiss timer
- Manual close via X button
- Props:
```typescript
interface ToastProps {
  variant: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  duration?: number;      // auto-dismiss ms, 0 = persistent
  onClose?: () => void;
}
```

**Animations**
- Enter: `transform: translateX(100%); opacity: 0` → `transform: translateX(0); opacity: 1` over `var(--transition-menu)`
- Exit: `transform: translateX(100%); opacity: 0` over `var(--transition-normal)`
- Mobile enter: `transform: translateY(-16px); opacity: 0` → `transform: translateY(0); opacity: 1`

#### 11.5.5 Button Loading State (Reference)
- Already defined in v2 Button (§11.3)
- Shows sm spinner replacing button text
- `pointer-events: none` during loading

#### 11.5.6 Inline Loading State
- For sections that load data within existing layout (e.g., "Load More" results)
- Centered spinner: size `md`, `padding: 32px 0; text-align: center`
- Optional text below: `font-size: 13px; color: var(--color-text-muted); margin-top: 8px`

#### 11.5.7 Premium Rationale
- **Cognitive Fluency:** One spinner design across the entire app. Skeleton loaders preserve layout structure during loading, preventing content layout shift (CLS) — the user's eye doesn't need to re-scan the page when content arrives.
- **Halo Effect:** White toast notifications with subtle left-border color coding feel native and polished (similar to macOS/iOS notification patterns). No jarring red/green full-color backgrounds.
- **Micro-Interactions:** Toast slide-in from right feels natural and non-disruptive. Skeleton shimmer animation at 1.5s pace is perceptually comfortable — fast enough to signal progress, slow enough to not feel anxious.

---

### 11.6 Inline Text + Image Statement Block

**Reference:** Screenshot Set 11 — "Because you need time for yourself" tagline + split content card with lifestyle image + value prop icons below
**Used In:** Home page, collection pages, about pages — any context needing a brand statement with supporting editorial content.

#### Outer Section
- `max-width: var(--container-max); margin: 0 auto; padding: 80px 48px`

##### Centered Tagline (Above Card)
- `text-align: center; margin-bottom: 48px`
- Headline: `font-family: var(--font-heading); font-size: 36px; font-weight: 400; color: #000000; line-height: 1.3; max-width: 640px; margin: 0 auto`

##### Split Content Card
- `display: grid; grid-template-columns: 1fr 1fr; border-radius: 16px; overflow: hidden; min-height: 520px`

###### Left Panel — Text Content
- `background: #F0EBE3; padding: 64px 48px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center`
- Subtitle: `font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #000000; letter-spacing: 0.5px; margin-bottom: 16px`
- Heading: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; line-height: 1.3; margin-bottom: 20px; max-width: 380px`
- Body text: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.7; max-width: 380px`

###### Right Panel — Lifestyle Image
- `position: relative; overflow: hidden`
- Image: `width: 100%; height: 100%; object-fit: cover`

##### Responsive
- Tablet: `grid-template-columns: 1fr; min-height: auto` — image panel `height: 360px` below text
- Mobile: `grid-template-columns: 1fr` — text `padding: 40px 24px`; image `height: 280px`

#### Micro-Interactions
- Card scroll-in: `opacity: 0; transform: translateY(24px)` → `opacity: 1; transform: translateY(0)` over `600ms` when entering viewport (IntersectionObserver)

#### Premium Rationale
- **Halo Effect:** The warm beige panel paired with a lifestyle photograph creates an editorial magazine spread. The split layout signals brand depth — "we have a story, not just products."
- **Cognitive Fluency:** One statement, one image. Zero competing CTAs. The brain processes the brand message in a single glance.

---

### 11.7 Value Props Icon Row

**Reference:** Screenshot Set 11 — 4 icons with titles and descriptions (Earth Lover, Cruelty Free, 100% Organic, Paraben Free)
**Used In:** Home page, about page, product pages — below hero or brand statement sections.

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 64px 48px`
- `display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center`
- `border-bottom: 1px solid #E0E0E0; padding-bottom: 64px`

#### Each Value Prop Item
- `display: flex; flex-direction: column; align-items: center`

##### Icon
- `width: 48px; height: 48px; margin-bottom: 20px; color: #000000`
- SVG line icons (stroke-based, not filled): `stroke-width: 1.5px`
- Configurable: each item accepts a custom SVG icon

##### Title
- `font-family: var(--font-body); font-size: 16px; font-weight: 700; color: #000000; margin-bottom: 8px`

##### Description
- `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #666666; line-height: 1.5; max-width: 220px`

#### Responsive
- Tablet: `grid-template-columns: repeat(2, 1fr); gap: 40px`
- Mobile: `grid-template-columns: repeat(2, 1fr); gap: 24px` — descriptions hidden, icon + title only

#### Micro-Interactions
- Icons stagger in on scroll: each icon `opacity: 0 → 1; transform: translateY(12px) → translateY(0)` with `100ms` delay between each, `400ms` duration

#### Premium Rationale
- **Cognitive Fluency:** Four icons with single-line titles are processed faster than paragraphs. The grid creates rhythm and predictability.
- **Halo Effect:** Thin stroke icons signal refined, modern design craft — not clip-art.

---

### 11.8 Trust Badges Pill Row

**Reference:** Screenshot Set 11 — horizontal row of pill badges (Free Shipping, Money Guarantee, Flexible Payment, Online Support, Return within 7 days)
**Used In:** Home page, product pages, checkout — anywhere trust reinforcement is needed.

#### Layout
- `width: 100%; padding: 40px 48px`
- `display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap`

#### Each Trust Pill
```css
.trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #E0E0E0;
  border-radius: 999px;
  background: #FFFFFF;
  white-space: nowrap;
}
.trust-pill__icon {
  width: 18px;
  height: 18px;
  color: #888888;
  flex-shrink: 0;
}
.trust-pill__text {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: #000000;
}
```
- Icon: checkmark circle (filled `#888888` bg with white check), `border-radius: 50%`

#### Responsive
- Tablet/Mobile: `flex-wrap: wrap; gap: 8px` — pills wrap to second row naturally
- Mobile: `padding: 32px 16px`

#### Premium Rationale
- **Cognitive Fluency:** Pill shape + checkmark creates instant "yes, confirmed" pattern recognition. Horizontal layout is scannable in under 1 second.
- **Halo Effect:** These trust signals positioned near purchase decisions reduce friction and increase confidence.

---

### 11.9 FAQ Section (3-Column Layout)

**Reference:** Screenshot Set 11 — "We're answerable!" section with intro text + product image + accordion FAQ
**Used In:** Home page, product pages, help/support pages.

#### Layout
- `width: 100%; background: var(--color-bg-warm); padding: 80px 48px`
- Inner: `max-width: var(--container-max); margin: 0 auto`
- `display: grid; grid-template-columns: 280px 1fr 1fr; gap: 48px; align-items: start`

##### Column 1 — Intro Text
- Heading: `font-family: var(--font-heading); font-size: 28px; font-weight: 900; color: #000000; line-height: 1.2; margin-bottom: 16px`
- Body: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin-bottom: 8px`
- Secondary text: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; margin-bottom: 24px`
  - "Contact us" link: `font-weight: 500; color: #000000; text-decoration: underline`
- CTA button: `btn-pill` (§11.3) — e.g., "See More Answers"

##### Column 2 — Product / Brand Image
- `display: flex; align-items: center; justify-content: center`
- Image: `max-width: 100%; max-height: 480px; object-fit: contain`
- No border-radius — lifestyle/editorial product shot (e.g., product on stones/organic backdrop)

##### Column 3 — Accordion FAQ
- `display: flex; flex-direction: column; gap: 8px`

###### Each FAQ Item
```css
.faq-item {
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
}
.faq-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.faq-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  cursor: pointer;
  width: 100%;
  background: none;
  border: none;
}
.faq-item__question {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  text-align: left;
  flex: 1;
}
.faq-item__toggle {
  width: 20px;
  height: 20px;
  color: #000000;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}
/* Open state: + rotates to − */
.faq-item--open .faq-item__toggle {
  transform: rotate(45deg);
}
.faq-item__answer {
  padding: 0 20px 18px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 1.6;
}
```
- Toggle icon: `+` (plus) → rotates `45deg` to become `×` when open
- Expand animation: `max-height: 0 → auto; opacity: 0 → 1` over `var(--transition-slow)`
- Only one FAQ item open at a time (accordion pattern)

#### Responsive
- Tablet: `grid-template-columns: 1fr 1fr; gap: 32px` — intro text spans full width above, image and accordion side by side
- Mobile: `grid-template-columns: 1fr; gap: 24px` — all stacked; image hidden or `height: 240px`

#### Micro-Interactions
- FAQ expand: content slides down `max-height` + fades in `opacity` over `var(--transition-slow)`
- Toggle icon: rotates `0 → 45deg` over `var(--transition-fast)`
- FAQ item hover: subtle shadow lift

#### Premium Rationale
- **Cognitive Fluency:** Accordion pattern reveals one answer at a time — prevents information overwhelm. White cards on warm background create clear figure-ground separation.
- **Halo Effect:** The editorial product image in the center column adds visual richness and brand presence to what is typically a boring FAQ section.
- **Micro-Interactions:** The `+` to `×` rotation is a satisfying "peak" detail that signals interactive quality.

---

### 11.10 Testimonial / Reviews Carousel

**Reference:** Screenshot Set 11 — "Over 2,000 Happy reviews" carousel with lifestyle photos + reviewer info + product link
**Used In:** Home page, product pages — social proof sections.

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 80px 48px`

##### Section Header
- `display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px`
- Title: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000`
- Arrow controls: same as §4.3 arrows (`36px` circular buttons, `1px solid #E0E0E0`)

##### Carousel Track
- `display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; &::-webkit-scrollbar { display: none }; scroll-behavior: smooth`
- 3 full cards visible + partial 4th peeking

##### Review Card
```css
.review-card {
  min-width: 380px;
  flex-shrink: 0;
  scroll-snap-align: start;
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #E0E0E0;
  display: flex;
  flex-direction: column;
}
```

###### Lifestyle Image (Top)
- `width: 100%; height: 280px; overflow: hidden`
- Image: `width: 100%; height: 100%; object-fit: cover`
- Each review has a unique lifestyle/product-in-use photo with warm tones

###### Review Content (Middle)
- `padding: 20px 20px 16px; flex: 1`
- Reviewer name: `font-family: var(--font-body); font-size: 15px; font-weight: 600; color: #000000; display: inline`
- Verified badge: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-left: 8px` — e.g., "Verified Buyer"
- Review text: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin-top: 12px`
  - Max 3 lines: `-webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden`

###### Product Link (Bottom)
- `display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-top: 1px solid #F0F0F0`
- Product thumbnail: `width: 40px; height: 40px; border-radius: 8px; overflow: hidden; flex-shrink: 0`
  - Image: `width: 100%; height: 100%; object-fit: cover`
- Product name: `font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #000000; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`
- Links to product detail page on click

#### Responsive
- Tablet: `min-width: 320px` — 2 cards + peek visible
- Mobile: `min-width: 280px` — 1.1 cards visible; `gap: 12px`

#### Micro-Interactions
- Card hover: `transform: translateY(-2px); box-shadow: var(--shadow-card-hover); transition: all var(--transition-normal)`
- Image hover: `transform: scale(1.03)` inside `overflow: hidden` over `var(--transition-normal)`
- Carousel: smooth scroll via arrow buttons `scrollBy({ left: 400, behavior: 'smooth' })`

#### Premium Rationale
- **Halo Effect:** Lifestyle photography in reviews (not avatars or text-only) creates emotional resonance. Warm tones and real product-in-use images feel authentic and aspirational.
- **Cognitive Fluency:** Each card has exactly 3 layers: image (emotional), text (rational), product link (action). The brain processes each card in a single scan.
- **Micro-Interactions:** The partial 4th card peeking uses the Zeigarnik effect — incompleteness compels scrolling.

---

### 11.11 Two-Column CTA Banner (Split Card)

**Reference:** Screenshot Set 11 — "Made for sensitive skin" split card with text on beige + lifestyle photo
**Used In:** Home page, collection pages — brand storytelling / campaign CTA blocks.

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 0 48px`
- `display: grid; grid-template-columns: 1fr 1fr; border-radius: 16px; overflow: hidden; min-height: 420px`

##### Left Panel — Text Content
- `background: var(--color-bg-warm); padding: 64px 48px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center`
- Subtitle: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-bottom: 12px; letter-spacing: 0.5px`
- Heading: `font-family: var(--font-heading); font-size: 36px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 16px; max-width: 340px`
- Body text: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin-bottom: 24px; max-width: 340px`
- CTA button: `btn-pill` (§11.3) — e.g., "Shop Now"

##### Right Panel — Lifestyle Image
- `position: relative; overflow: hidden`
- Image: `width: 100%; height: 100%; object-fit: cover`
- Can include decorative brand watermark text (large, semi-transparent serif) overlaid on image for editorial effect

#### Responsive
- Tablet: `grid-template-columns: 1fr; min-height: auto` — image `height: 320px` below text
- Mobile: `grid-template-columns: 1fr; border-radius: 0; margin: 0 -16px; width: calc(100% + 32px)` — full-bleed; text `padding: 40px 24px`; image `height: 260px`

#### Micro-Interactions
- CTA hover: `background: #333333` over `var(--transition-fast)`
- Image: slow Ken Burns `@keyframes kenburns { from { transform: scale(1) } to { transform: scale(1.04) } }; animation: kenburns 15s ease infinite alternate`
- Scroll-in: entire card `opacity: 0; transform: translateY(24px)` → `opacity: 1; translateY(0)` over `600ms`

#### Premium Rationale
- **Halo Effect:** The split layout with warm beige + lifestyle photo creates an editorial magazine spread. Large serif heading signals brand authority.
- **Cognitive Fluency:** Single CTA ("Shop Now") — no competing elements. The user processes the message and takes action in one flow.

---

### 11.12 Collection Carousel (Category Cards)

**Reference:** Screenshot Set 11 — "Natural self care products" section with category cards showing collection image + name + item count + arrow
**Used In:** Home page, category navigation sections — showcasing product collections/categories.

#### Layout
- `max-width: var(--container-max); margin: 0 auto; padding: 80px 48px`
- `background: var(--color-bg-warm)`
- Inner: `display: grid; grid-template-columns: 320px 1fr; gap: 48px; align-items: center`

##### Left Zone — Section Intro
- Subtitle: `font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #000000; letter-spacing: 0.5px; margin-bottom: 12px`
- Heading: `font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: #000000; line-height: 1.2; margin-bottom: 16px`
- Body text: `font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #666666; line-height: 1.6; margin-bottom: 32px`
- Arrow controls: same as §4.3 arrows (`36px` circular buttons, `1px solid #E0E0E0`)

##### Right Zone — Collection Cards Carousel
- `display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; &::-webkit-scrollbar { display: none }; scroll-behavior: smooth`
- 2 full cards + partial 3rd peeking

###### Collection Card
```css
.collection-card {
  min-width: 340px;
  flex-shrink: 0;
  scroll-snap-align: start;
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}
.collection-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
```

###### Collection Image
- `width: 100%; height: 280px; overflow: hidden`
- Image: `width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-normal)`
- Hover: `transform: scale(1.03)`

###### Collection Info Bar
- `display: flex; justify-content: space-between; align-items: center; padding: 16px 20px`
- Left: `display: flex; flex-direction: column`
  - Collection name: `font-family: var(--font-body); font-size: 16px; font-weight: 600; color: #000000`
  - Item count: `font-family: var(--font-body); font-size: 13px; font-weight: 400; color: #888888; margin-top: 2px`
- Arrow button: `width: 36px; height: 36px; border-radius: 50%; border: 1px solid #E0E0E0; background: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0`
  - Icon: diagonal arrow `↗`, `width: 14px; height: 14px; color: #000000`
  - Hover: `background: #F5F5F5; border-color: #CCCCCC; transition: all var(--transition-fast)`

#### Responsive
- Tablet: `grid-template-columns: 1fr` — intro text above carousel, full width
- Mobile: `grid-template-columns: 1fr; min-width: 260px` — 1.2 cards visible

#### Micro-Interactions
- Card hover: lift + shadow + image scale
- Arrow icon on card hover: `transform: translate(2px, -2px)` over `var(--transition-fast)` (subtle diagonal nudge)

#### Premium Rationale
- **Halo Effect:** Lifestyle photography for collections (not product grids) creates aspirational browsing. The warm background + white cards signal curated, intentional categorization.
- **Cognitive Fluency:** Each card has only 3 data points: image, name, count. No prices, no badges, no competing CTAs — pure navigation.

---

### 11.13 Inline Image Text Banner (Flowing Text with Embedded Images)

**Reference:** Screenshot Set 11 — "Make you look [image] and feel glowy [image] and healthy [image]" flowing text with inline product/lifestyle images
**Used In:** Home page, about page — brand storytelling / emotional impact sections.

#### Layout
- `max-width: 900px; margin: 0 auto; padding: 80px 48px; text-align: center`

#### Text + Image Flow
- Uses a flowing multi-line layout where large text wraps around inline image capsules
- `display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px`

##### Text Fragments
- `font-family: var(--font-heading); font-size: 48px; font-weight: 700; color: #000000; line-height: 1.3`
- Each text fragment is an inline element

##### Inline Image Capsules
```css
.inline-image-capsule {
  display: inline-flex;
  overflow: hidden;
  vertical-align: middle;
}
/* Pill variant (wider) */
.inline-image-capsule--pill {
  width: 140px;
  height: 64px;
  border-radius: 32px;
}
/* Circle variant */
.inline-image-capsule--circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
}
/* Rounded rectangle variant */
.inline-image-capsule--rounded {
  width: 120px;
  height: 64px;
  border-radius: 16px;
}
.inline-image-capsule img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```
- Each capsule contains a lifestyle or product image, sized to fit inline with the text
- Mix of shapes (pill, circle, rounded rect) creates visual playfulness
- Images have warm/pink/coral tones consistent with brand palette

#### Responsive
- Tablet: `font-size: 36px` — capsules scale proportionally (80% of desktop)
- Mobile: `font-size: 28px; padding: 48px 16px` — capsules `width: 100px; height: 48px` (pill), `width: 56px; height: 56px` (circle)

#### Micro-Interactions
- Scroll-in: text fragments stagger in `opacity: 0 → 1` with `80ms` delay between each word/image, `400ms` duration
- Image capsules: subtle float `@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }; animation: float 3s ease infinite` with staggered `animation-delay` per capsule

#### Premium Rationale
- **Halo Effect:** This is the most visually distinctive section — the flowing text-with-images pattern is unexpected and memorable. It creates a "wow" moment that elevates the entire site's perceived quality.
- **Micro-Interactions:** The staggered scroll-in + floating capsules create a "living" layout that signals playful craftsmanship. This is a peak-end "delight" moment.
- **Cognitive Fluency:** Despite its visual complexity, the message is simple — a single sentence broken into a visual rhythm. The brain reads it as one statement.

---

### 11.14 Error Pages

**Current Components:** `FourOhFour` (Poppins font, yellow accent, SVG illustration), `FiveHundreError` (red bg, informal tone)
**Reuses:** v2 Button (§11.3)

#### 11.14.1 404 — Page Not Found

**Layout**
- `max-width: var(--container-max); margin: 0 auto; padding: 120px var(--container-padding); text-align: center`
- Mobile: `padding: 80px var(--container-padding)`

**Illustration**
- Minimal line-art SVG: `width: 200px; height: 200px; margin: 0 auto 40px; opacity: 0.6`
- SVG style: thin stroke (#000000, stroke-width: 1.5px), no fill — matches v2 icon style
- Subject: abstract "lost" illustration (empty page, compass, or question mark)

**Heading**
- "404" number: `font-family: var(--font-heading); font-size: 80px; font-weight: 700; color: #000000; line-height: 1; margin-bottom: 8px`
- Mobile: `font-size: 56px`
- Title: `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; margin-bottom: 12px` — "Page not found"

**Body**
- `font-family: var(--font-body); font-size: 15px; color: var(--color-text-body); line-height: 1.6; max-width: 420px; margin: 0 auto 32px`
- Copy: "Sorry, the page you're looking for doesn't exist or has been moved."

**Actions**
- `display: flex; gap: 12px; justify-content: center`
- "Go Home": v2 Button primary — links to `/`
- "Browse Products": v2 Button secondary — links to `/collection/all`

#### 11.14.2 500 — Server Error

**Layout**
- Same centering as 404

**Illustration**
- Minimal line-art SVG: wrench/gear icon, same style
- `width: 160px; height: 160px; margin: 0 auto 40px; opacity: 0.5`

**Heading**
- "Something went wrong": `font-family: var(--font-heading); font-size: 28px; font-weight: 700; color: #000000; margin-bottom: 12px`

**Body**
- `font-family: var(--font-body); font-size: 15px; color: var(--color-text-body); line-height: 1.6; max-width: 420px; margin: 0 auto 32px`
- Copy: "We're working on it. Please try again in a moment."
- Error details (dev only): `margin-top: 24px; padding: 16px; background: var(--color-bg-card); border-radius: var(--radius-sm); font-family: monospace; font-size: 12px; color: var(--color-text-muted); text-align: left; max-height: 200px; overflow-y: auto`

**Actions**
- "Try Again": v2 Button primary — `onClick: () => window.location.reload()`
- "Go Home": v2 Button secondary — links to `/`

#### 11.14.3 Premium Rationale
- **Halo Effect:** Clean, minimal error pages with editorial typography signal that even failure states are designed with care. No jarring red backgrounds or cartoon error images.
- **Cognitive Fluency:** Clear heading + one sentence + two action buttons. Zero ambiguity about what to do next.

---

### 11.15 Tracking Pages

**Current Components:** `TrackingSearchBar`, `TrackingOrderInitPage`, `TrackingOrderErrorPage`, `TrackingOrderInfo`, `DeliveryInfo`, `TrackingTable`, `CancelOrderActionBar`, `ReviewModal`, `ReviewForm`, `ReviewSuccess`
**Reuses:** v2 Button (§11.3), v2 CheckoutInput (§8.9), v2 Badge (§11.2), v2 Modal (§11.4.1), v2 Toast (§11.5.4)

#### 11.15.1 Tracking — Search Page (Initial State)

**Layout**
- `max-width: var(--container-max); margin: 0 auto; padding: 80px var(--container-padding); text-align: center`

**Heading**
- `font-family: var(--font-heading); font-size: 36px; font-weight: 700; color: #000000; margin-bottom: 12px` — "Track Your Order"
- Mobile: `font-size: 28px`
- Subtitle: `font-family: var(--font-body); font-size: 15px; color: var(--color-text-body); margin-bottom: 40px` — "Enter your order ID to check the status"

**Search Bar**
- `max-width: 560px; margin: 0 auto; display: flex; gap: 12px`
- Input: CheckoutInput style (§8.9), `flex: 1` — placeholder: "Order ID (e.g., ORD-12345)"
- Search button: v2 Button primary — "Track Order"
- Mobile: stack vertically, button full-width

**Empty State Illustration**
- Below search: shipping box line-art SVG, `width: 160px; opacity: 0.3; margin: 48px auto 0`

#### 11.15.2 Tracking — Order Details

**Layout**
- `max-width: 800px; margin: 0 auto; padding: 48px var(--container-padding)`

**Order Header Card**
- `background: var(--color-bg-card); border-radius: var(--radius-md); padding: 32px; margin-bottom: 32px`
- `display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px`
- Order ID: `font-family: var(--font-body); font-size: 13px; font-weight: 500; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.5px` — "ORDER"
- ID value: `font-family: var(--font-heading); font-size: 24px; font-weight: 700; color: #000000; margin-top: 4px`
- Date: `font-size: 14px; color: var(--color-text-body)` — "Ordered Feb 23, 2026"
- Estimated delivery: `font-size: 14px; color: var(--color-text-body)` — "Est. delivery: Mar 5, 2026"

**Status Badge**
- Order status uses v2 Badge variants:
  - `order_received`: v2 Badge "limited" variant — "Order Received"
  - `processing`: v2 Badge "hot" variant — "Processing"
  - `complete`: v2 Badge "discount" variant — "Completed"
  - `cancelled`: v2 Badge "new" variant — "Cancelled"
  - `hold`: v2 Badge "hot" variant — "On Hold"

**Status Alert Banners**
- Cancelled: `background: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--radius-sm); padding: 14px 16px; display: flex; align-items: center; gap: 10px; margin-bottom: 24px`
- Icon: circle-X, `color: #C75050`
- Text: `font-size: 14px; color: #991B1B`
- Contact link: `color: #000000; text-decoration: underline`

#### 11.15.3 Product List

**Layout**
- `border: 1px solid var(--color-border-light); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 32px`

**Each Item Row**
- `display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-bottom: 1px solid #F0F0F0`
- Last item: no border-bottom
- Thumbnail: `width: 64px; height: 64px; border-radius: var(--radius-sm); object-fit: cover; background: var(--color-bg-card); flex-shrink: 0`
- Info: `flex: 1`
  - Title: `font-family: var(--font-body); font-size: 14px; font-weight: 500; color: #000000`
  - Variant/spec: `font-size: 13px; color: var(--color-text-muted); margin-top: 2px`
  - Qty: `font-size: 13px; color: var(--color-text-secondary); margin-top: 2px` — "Qty: 2"
- Price: `font-family: var(--font-body); font-size: 14px; font-weight: 600; color: #000000; text-align: right`
- Review link: `font-size: 13px; color: #000000; text-decoration: underline; text-underline-offset: 3px; margin-left: 16px; cursor: pointer` — only shown if `can_review === true`

#### 11.15.4 Delivery & Shipping Info

**Section Container**
- `border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: 24px; margin-bottom: 32px`
- Heading: `font-family: var(--font-body); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #000000; margin-bottom: 20px`

**Info Grid**
- `display: grid; grid-template-columns: 1fr 1fr; gap: 20px`
- Mobile: `grid-template-columns: 1fr`
- Each field label: `font-size: 12px; color: var(--color-text-muted); margin-bottom: 4px`
- Each field value: `font-size: 14px; color: #000000; font-weight: 500`
- Fields: Contact name (masked), Address (masked), Payment status, Shipping status

**Tracking Table** (if shipping)
- Clean table, no MUI dependency
- `width: 100%; border-collapse: collapse; margin-top: 20px`
- Header: `font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted); padding: 10px 0; border-bottom: 2px solid #000000`
- Cells: `font-size: 14px; padding: 12px 0; border-bottom: 1px solid #F0F0F0`
- Tracking link: `color: #000000; text-decoration: underline`
- Columns: Tracking Number, Carrier, Link

#### 11.15.5 Order Summary

- `border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: 24px; margin-bottom: 32px`
- Each row: `display: flex; justify-content: space-between; padding: 8px 0; font-family: var(--font-body); font-size: 14px`
- Label: `color: var(--color-text-body)`
- Value: `font-weight: 500; color: #000000`
- Divider before total: `border-top: 1px solid var(--color-border-light); margin-top: 8px; padding-top: 12px`
- Total: `font-size: 16px; font-weight: 700`

#### 11.15.6 Cancel Order Flow

**Cancel Button**
- v2 Button secondary, size sm — "Cancel Order"
- Only visible if order status is not `cancelled` or `complete`

**Cancel Modal** (uses v2 Modal shell §11.4.1)
- `max-width: 440px`
- Title: "Cancel Order" — modal heading style
- Reason list: radio-style selection
  - Each item: `padding: 12px 16px; border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); margin-bottom: 8px; cursor: pointer; transition: all var(--transition-fast)`
  - Selected: `border-color: #000000; background: #F9F9F9`
  - Hover: `border-color: #CCCCCC`
- "Other reasons" shows textarea: same style as CheckoutInput but multiline, `height: 100px; resize: none`
- Character count: `font-size: 11px; color: var(--color-text-muted); text-align: right; margin-top: 4px` — "42/150"
- Actions: "Go Back" (secondary) + "Confirm Cancellation" (primary, destructive: `background: #C75050`)

#### 11.15.7 Review Modal

**Uses v2 Modal shell** (§11.4.1), `max-width: 520px`

**Product Info Row**
- `display: flex; gap: 14px; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #F0F0F0; margin-bottom: 24px`
- Thumbnail: `64px × 64px; border-radius: var(--radius-sm); object-fit: cover`
- Title: `font-size: 14px; font-weight: 500; color: #000000`

**Name Input**
- CheckoutInput style (§8.9)
- Helper text: `font-size: 12px; color: var(--color-text-muted); margin-top: 4px; display: flex; align-items: center; gap: 4px` — "We won't display your full name"

**Star Rating**
- 5 stars, `gap: 4px`
- Each star: `width: 28px; height: 28px; cursor: pointer; transition: transform var(--transition-fast)`
- Active: `fill: #000000` (solid black, premium)
- Inactive: `fill: none; stroke: #CCCCCC; stroke-width: 1.5`
- Hover: `transform: scale(1.15)`
- Default: 3 stars selected

**Review Textarea**
- CheckoutInput style but multiline: `height: 120px; resize: none`
- Placeholder: "Share your experience..."
- Character limit: `font-size: 11px; color: var(--color-text-muted)` — "0/100"

**Image Upload**
- `margin-top: 16px`
- Drop zone: `border: 2px dashed var(--color-border-light); border-radius: var(--radius-sm); padding: 24px; text-align: center; cursor: pointer; transition: all var(--transition-fast)`
- Hover/drag: `border-color: #000000; background: #FAFAFA`
- Icon: plus in circle, `width: 32px; height: 32px; color: var(--color-text-muted); margin: 0 auto 8px`
- Text: `font-size: 13px; color: var(--color-text-muted)` — "Upload up to 2 images"
- Preview thumbnails: `display: flex; gap: 8px; margin-top: 12px`
- Each: `width: 72px; height: 72px; border-radius: var(--radius-sm); object-fit: cover; position: relative`
- Remove button: `position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; background: #000000; color: #FFFFFF; border-radius: 50%; font-size: 10px; cursor: pointer`
- Max 2 images

**Actions**
- "Cancel" (secondary) + "Submit Review" (primary)
- Loading state: spinner in submit button

**Success State** (replaces form)
- Animated checkmark (reuse §11.4.2 pattern)
- Title: "Thank you!" — `font-size: 20px; font-weight: 700`
- Body: "Your review helps our community." — `font-size: 14px; color: var(--color-text-body)`
- "Continue Shopping" button: v2 Button primary — closes modal

#### 11.15.8 Tracking Error State

- Same layout as tracking search page
- Error illustration: empty box line-art SVG, `width: 140px; opacity: 0.4; margin: 0 auto 24px`
- Heading: `font-family: var(--font-heading); font-size: 24px; font-weight: 700; margin-bottom: 8px` — "Order not found"
- Body: `font-size: 15px; color: var(--color-text-body); max-width: 440px; margin: 0 auto 32px; line-height: 1.6` — "We couldn't find an order with that ID. Please double-check and try again."
- Contact: `font-size: 14px; color: var(--color-text-secondary)` — "Need help? [Contact us](mailto:support@peasydeal.co.uk)"
- "Try Again" button: v2 Button secondary — clears search and refocuses input

#### 11.15.9 Premium Rationale
- **Cognitive Fluency:** Order details are organized in clear card sections (header → products → delivery → summary) following the natural question flow: "What did I order? → Where is it? → How much was it?"
- **Halo Effect:** Clean card-based layout with consistent borders and spacing signals a well-organized operation. The masked personal data with clear labeling builds trust.
- **Micro-Interactions:** Star rating hover scale and review success checkmark animation provide satisfying feedback moments during the review flow.

---

### 11.16 Miscellaneous Components

#### 11.16.1 PageTitle (Section Header)

**Current Component:** `PageTitle` (Poppins font, gray borders)

**Replaces with:** Warm background banner pattern (consistent with §6.1 Collection Page Header)

**Layout**
- `width: 100%; background: var(--color-bg-warm); border-radius: var(--radius-lg); padding: 48px 40px; text-align: center; margin-bottom: 32px`
- Mobile: `padding: 32px 24px; border-radius: var(--radius-md)`

**Title**
- `font-family: var(--font-heading); font-size: 36px; font-weight: 700; color: #000000; line-height: 1.2`
- Mobile: `font-size: 28px`

**Subtitle (Optional)**
- `font-family: var(--font-body); font-size: 15px; color: var(--color-text-body); margin-top: 12px; max-width: 480px; margin-left: auto; margin-right: auto`

**Props**
```typescript
interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}
```

#### 11.16.2 LoadMore / LoadMoreButton

**Current Components:** `LoadMore` (scroll detection, 168 lines), `LoadMoreButton` (Chakra pink button)

**Replaces with:** Two components: `InfiniteScroll` (detection logic) + styled load-more button

**InfiniteScroll (Logic Component)**
- Preserves scroll detection from existing `LoadMore`
- Uses IntersectionObserver instead of scroll events (more performant)
- Sentinel element placed below last item: `<div ref={sentinelRef} />`
- Props:
```typescript
interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;    // IntersectionObserver rootMargin, default "200px"
  children: React.ReactNode;
}
```

**Load More Button (Visual)**
- v2 Button secondary variant, centered
- `display: block; margin: 32px auto 0`
- Label: "Load More" (customizable via `children`)
- Loading state: spinner in button (built into v2 Button)
- Hidden when `hasMore === false`
- Props:
```typescript
interface LoadMoreButtonProps {
  loading?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}
```

#### 11.16.3 Premium Rationale
- **Cognitive Fluency:** Warm banner PageTitle creates visual section breaks without competing with content. The rounded corners and warm background subtly separate navigational context from content.
- **Halo Effect:** Consistent use of IntersectionObserver for scroll detection is invisible to users but eliminates janky scroll-event performance issues. The "Load More" button follows the same button system as the rest of the site.

---

## 12. Component Migration Map

This maps every existing component to its redesigned version to ensure nothing is lost.

| Current Component | Section in PRD | Status |
|---|---|---|
| `AnnouncementBanner` | 3.1 Announcement Bar | Defined |
| `Header` / `LogoHeader` / `NavBar` / `LogoBar` | 3.2 Header / Navbar | Defined |
| `MegaMenuContent` / `CategoriesNav` | 3.3 Mega Menu | Defined |
| `PropBar` | 3.2 Header (absorbed) | Defined |
| `SearchBar` (header) | 3.2 Header — search icon | Defined |
| `PromoCarousell` | 4.1 Hero Section | Defined |
| `PromoActivities` / variants | 4.1 Hero Section | Defined |
| `AllTimeCoupon` / variants | 4.2 Tagline Banner (absorbed) | Defined |
| `ProductCard` | 11.1 Product Card (Standard) | Defined |
| `ProductGrid` (Large/Medium) | 4.4 Tabbed Product Grid | Defined |
| `ProductRow` (OneMainTwoSubs, EvenRow) | 4.3 Campaign + Carousel | Defined |
| `ProductPromotionRow` | 4.5 Core Products Carousel | Defined |
| `CategoryPreview` | 4.3 Campaign + Carousel | Defined |
| `SeasonalColumnLayout` | 4.6 Lifestyle Gallery | Defined |
| `CategoriesRow` | 11.12 Collection Carousel | Defined |
| `Carousel` / `CarouselMinimal` | 4.3/4.5 Carousel patterns | Defined |
| `Footer` / all sub-components | 10. Footer (all subsections) | Defined |
| `Tags` (all 6 variants) | 11.2 Tags/Badges (unified pills) | Defined |
| `ScrollButton` | 4.3/4.5 Carousel arrow buttons | Defined |
| `QuantityDropDown` / `QuantityPicker` | 5.4 Quantity Picker | Defined |
| `RoundButton` | 5.4 Add to Cart / Buy It Now | Defined |
| `PeasyDealMessageModal` / `ItemAddedModal` | 11.4 Modals | Defined |
| `EmailSubscribeModal` / `PromoteSubscriptionModal` | 11.4 Modals | Defined |
| `CssSpinner` / `Spinner` | 11.5 Loading States | Defined |
| `Snackbar` | 11.5 Loading States (Toast) | Defined |
| `Breadcrumbs` | 5.1 Breadcrumbs | Defined |
| `Divider` | 5.4 section borders | Defined |
| `CouponBox` | 8.8 Order Summary — Discount Input | Defined |
| `PageTitle` | 11.16 Misc Components | Defined |
| `LoadMore` / `LoadMoreButton` | 11.16 Misc Components | Defined |
| `PaymentMethods` | 10.5 Footer Bottom Bar | Defined |
| `FourOhFour` / `FiveHundreError` | 11.14 Error Pages | Defined |
| `DropDownSearchBar` / `MobileSearchDialog` | 7. Search | Defined |
| Product detail components | 5. Product Pages (all subsections) | Defined |
| `ProductActionBar` | 5.6 Sticky Add-to-Cart Bar | Defined |
| Cart components (`Item`, `PriceResult`, `ResultRow`, `EmptyShoppingCart`, `RemoveItemModal`) | 8.10 Cart Drawer + 8.10.B Cart Page | Defined |
| Checkout components (`CheckoutForm`, `StripeCheckout`, `PaypalCheckout`, `ShippingDetailForm`, `ContactInfoForm`, `CartSummary`) | 8.1–8.9, 8.11 Checkout Flow | Defined |
| Payment result components (`Success`, `Failed`, `LoadingSkeleton`, `OrderDetail`, `OrderInformation`, `ProductSummary`, `OrderAnnotation`) | 8.12 Payment Result Pages | Defined |
| Tracking components | 11.15 Tracking Pages | Defined |
| Blog components | 9. Blog | Defined |
| Collection page (`$collection.tsx`, `ProductRowsContainer`) | 6. Category / Collection Pages | Defined |
| *New:* Inline Text + Image Statement Block | 11.6 | Defined |
| *New:* Value Props Icon Row | 11.7 | Defined |
| *New:* Trust Badges Pill Row | 11.8 | Defined |
| *New:* FAQ Section (3-Column) | 11.9 | Defined |
| *New:* Testimonial / Reviews Carousel | 11.10 | Defined |
| *New:* Two-Column CTA Banner | 11.11 | Defined |
| *New:* Collection Carousel (Category Cards) | 11.12 | Defined |
| *New:* Inline Image Text Banner | 11.13 | Defined |
