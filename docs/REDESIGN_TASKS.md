# PeasyDeal Redesign — Implementation Tasks & Progress

**Created:** 2026-02-24
**Source PRD:** [REDESIGN_PRD.md](./REDESIGN_PRD.md)
**Branch Strategy:** `redesign/main` base branch, feature branches per phase via `git worktree`

---

## Branch & Worktree Strategy

```
main (production)
└── redesign/main (integration branch)
    ├── redesign/phase-0-foundation     ← design tokens, CSS vars, fonts, shared base
    ├── redesign/phase-1-shared         ← shared components (§11)
    ├── redesign/phase-2-global         ← header, footer, announcement bar (§3, §10)
    ├── redesign/phase-3-home           ← home page sections (§4)
    ├── redesign/phase-4-product        ← product detail pages (§5)
    ├── redesign/phase-5-cart-checkout  ← cart drawer, cart page, checkout, payment (§8)
    └── redesign/phase-6-remaining      ← category pages, search, blog, error pages (§6, §7, §9)
```

Each phase branch is merged into `redesign/main` upon completion. Use `git worktree` to work on independent phases in parallel when possible (e.g., Phase 1 shared components + Phase 0 foundation).

### Worktree Setup Commands

```bash
# Create integration branch
git checkout -b redesign/main

# Add worktrees for parallel work
git worktree add ../peasydeal-redesign-phase0 redesign/phase-0-foundation
git worktree add ../peasydeal-redesign-phase1 redesign/phase-1-shared
git worktree add ../peasydeal-redesign-phase2 redesign/phase-2-global
# ... etc. as needed
```

---

## Phase 0 — Foundation & Design Tokens
**Branch:** `redesign/phase-0-foundation`
**Dependencies:** None
**Estimated Scope:** ~5 files

| # | Task | PRD Ref | Status |
|---|------|---------|--------|
| 0.1 | Create `app/styles/design-tokens.css` — all CSS custom properties (typography, colors, spacing, radius, shadows, transitions, breakpoints, container) | §2.1 | ✅ |
| 0.2 | Add Google Fonts import for `Playfair Display` and `Inter` (preconnect + font-display: swap) | §2.1 Typography | ✅ |
| 0.3 | Update `tailwind.config.js` — extend theme with design token values, ensure `important: true` is preserved | §2.1 | ✅ |
| 0.4 | Create `app/styles/redesign-base.css` — global reset/base styles using tokens (body font, bg, link resets) | §2.1 | ✅ |
| 0.5 | Import new CSS files in `app/root.tsx` (or stylesheet links) | — | ✅ |

---

## Phase 1 — Shared Components (§11)
**Branch:** `redesign/phase-1-shared`
**Dependencies:** Phase 0
**Estimated Scope:** ~13 component files + styles

These are the building blocks used across all pages. Must be done first.

| # | Task | PRD Ref | Status |
|---|------|---------|--------|
| **1.1** | **Product Card (Standard)** — `app/components/v2/ProductCard/` | §11.1 | ✅ |
| | - Image area with primary/secondary hover swap | | |
| | - Quick-view icon (hover reveal) | | |
| | - Image carousel arrow (hover reveal) | | |
| | - "Choose Options" / "Add to Cart" CTA overlay (hover reveal) | | |
| | - Badge positioning (top-left) | | |
| | - Text area (category, name, price with sale variant) | | |
| | - Hover states: lift + shadow + image swap | | |
| | - Responsive: works in grid and carousel contexts | | |
| **1.2** | **Badge component** — `app/components/v2/Badge/` | §11.2 | ✅ |
| | - Unified pill badge replacing 6 old tag variants | | |
| | - Variants: discount (green), new (red), selling-fast (green), hot (amber), limited (dark) | | |
| | - Mark old `Tags/*` components as `@deprecated` | | |
| **1.3** | **Button system** — `app/components/v2/Button/` | §11.3 | ✅ |
| | - Primary (solid black, 8px radius) | | |
| | - Secondary (outlined, 8px radius) | | |
| | - Pill (full-round, 999px radius) + inverted variant | | |
| | - Disabled, hover, active states | | |
| | - Mark old `RoundButton` as `@deprecated` | | |
| **1.4** | **Carousel arrow controls** — reusable `app/components/v2/CarouselArrows/` | §4.3 arrows | ✅ |
| | - 36px circular buttons, border, hover states | | |
| | - Disabled state (opacity 0.3) | | |
| | - Used in: mega menu, campaign carousel, core products, reviews, collections | | |
| **1.5** | **Quantity Picker** — `app/components/v2/QuantityPicker/` | §5.4, §8.10 | ✅ |
| | - Standard (48px height, rectangular) for PDP | | |
| | - Compact (32px height, pill) for cart drawer | | |
| | - Compact pill (40px height) for sticky ATC bar | | |
| **1.6** | **Value Props Icon Row** — `app/components/v2/ValuePropsRow/` | §11.7 | ✅ |
| | - 4-col grid, SVG icons, title + description | | |
| | - Scroll-triggered stagger animation | | |
| | - Responsive: 2-col on mobile, descriptions hidden | | |
| **1.7** | **Trust Badges Pill Row** — `app/components/v2/TrustBadgesRow/` | §11.8 | ✅ |
| | - Horizontal flex, pill badges with icon + text | | |
| | - Responsive: wrapping | | |
| **1.8** | **FAQ Section (3-Column)** — `app/components/v2/FAQSection/` | §11.9 | ✅ |
| | - 3-col grid: intro text, product image, accordion FAQ | | |
| | - Accordion: only one open at a time, max-height animation | | |
| | - Warm background (--color-bg-warm) | | |
| **1.9** | **Testimonial / Reviews Carousel** — `app/components/v2/ReviewsCarousel/` | §11.10 | ✅ |
| | - Carousel track with review cards (image, reviewer, text, product link) | | |
| | - 3 cards visible + partial peek | | |
| | - Arrow controls, hover states | | |
| **1.10** | **Inline Text + Image Statement Block** — `app/components/v2/StatementBlock/` | §11.6 | ✅ |
| | - Centered tagline + split card (text panel + image panel) | | |
| | - Scroll-in animation (IntersectionObserver) | | |
| **1.11** | **Two-Column CTA Banner** — `app/components/v2/CTABanner/` | §11.11 | ✅ |
| | - Split card: beige text panel + lifestyle image | | |
| | - Ken Burns image animation | | |
| | - Scroll-in animation | | |
| **1.12** | **Collection Carousel (Category Cards)** — `app/components/v2/CollectionCarousel/` | §11.12 | ✅ |
| | - Warm bg, section intro (left), card carousel (right) | | |
| | - Collection cards: image, name, count, arrow | | |
| **1.13** | **Inline Image Text Banner** — `app/components/v2/InlineImageBanner/` | §11.13 | ✅ |
| | - Flowing text with inline image capsules (pill, circle, rounded) | | |
| | - Staggered scroll-in + floating animation | | |

---

## Phase 2 — Global Elements (§3, §10)
**Branch:** `redesign/phase-2-global`
**Dependencies:** Phase 0, Phase 1 (buttons, badges)

| # | Task | PRD Ref | Status |
|---|------|---------|--------|
| **2.1** | **Announcement Bar (Marquee)** — `app/components/v2/AnnouncementBar/` | §3.1 | ✅ |
| | - CSS keyframe marquee, seamless loop (duplicated content) | | |
| | - Props: speed, pauseOnHover, messages[] | | |
| | - Black bg, white uppercase text, 36px height | | |
| | - Mark old `AnnouncementBanner` as `@deprecated` | | |
| **2.2** | **Header / Navbar** — `app/components/v2/Header/` | §3.2 | ✅ |
| | - 3-zone grid: logo (left), nav center, icons (right) | | |
| | - 72px height, sticky on scroll with shadow fade | | |
| | - Nav links: hover underline animation, dropdown chevrons | | |
| | - Utility icons: search, account, cart (with badge) | | |
| | - Cart badge bounce animation on count change | | |
| | - Mobile: 56px, hamburger/logo/cart layout | | |
| | - Mark old `Header`, `LogoHeader`, `NavBar`, `LogoBar`, `PropBar` as `@deprecated` | | |
| **2.3** | **Mega Menu** — `app/components/v2/MegaMenu/` | §3.3 | ✅ |
| | - 4-column grid: quick links, 2x category lists, trending products mini-carousel | | |
| | - Hover trigger with 120ms enter / 100ms leave delay | | |
| | - Open/close: opacity + translateY animation (--transition-menu) | | |
| | - Configurable per nav item: simple dropdown vs full mega menu | | |
| | - Mobile: full-screen drawer from left, accordion pattern | | |
| | - Mark old `MegaMenuContent`, `CategoriesNav` as `@deprecated` | | |
| **2.4** | **Mobile Navigation Drawer** — `app/components/v2/MobileNavDrawer/` | §3.2, §3.3 | ✅ |
| | - Full-screen slide-out from left | | |
| | - Accordion categories | | |
| | - Close button, overlay | | |
| **2.5** | **Footer** — `app/components/v2/Footer/` | §10.1–10.5 | ✅ |
| | - 4-column grid: newsletter, shop links, customer care links, about | | |
| | - Newsletter email input with inline submit arrow | | |
| | - Bottom bar: region selector, legal/copyright, social icons, payment icons | | |
| | - Responsive: stacks on mobile | | |
| | - Mark old `Footer`, `FooterContent`, etc. as `@deprecated` | | |

---

## Phase 3 — Home Page (§4)
**Branch:** `redesign/phase-3-home`
**Dependencies:** Phase 0, Phase 1 (product card, badges, buttons, carousels), Phase 2 (header, footer)

| # | Task | PRD Ref | Status |
|---|------|---------|--------|
| **3.1** | **Hero Carousel (Full-Width Slider)** — `app/components/v2/HeroCarousel/` | §4.1.A | ✅ |
| | - 3-panel: side peeks (160px) + active center | | |
| | - Text overlay (right 45%), serif headline, pill CTA | | |
| | - Dot pagination (pill-shaped active dot) | | |
| | - Auto-play with pause on hover | | |
| | - Responsive: single slide on tablet, full-bleed on mobile | | |
| | - Mark old `PromoCarousell` as `@deprecated` | | |
| **3.2** | **3-Card Banner** — `app/components/v2/HeroBanner/` | §4.1.B | ✅ |
| | - 3-col grid, 280px cards, warm tinted backgrounds | | |
| | - Text left (55%), image right (45%), pill CTA | | |
| | - Hover: scale + shadow + image zoom | | |
| | - Responsive: 2-col tablet, stacked/carousel mobile | | |
| **3.3** | **Tagline / Value Proposition Banner** — `app/components/v2/TaglineBanner/` | §4.2 | ✅ |
| | - Centered serif headline (40px), CTA link with underline animation | | |
| | - 80px vertical padding | | |
| **3.4** | **Featured Campaign + Product Carousel Section** — `app/components/v2/CampaignSection/` | §4.3 | ✅ |
| | - 2-col grid: lifestyle campaign card (left) + stacked carousel rows (right) | | |
| | - Campaign card: full-bleed photo, gradient overlay, Ken Burns | | |
| | - Carousel rows: titled header + product card scroll | | |
| | - Responsive: stacked on tablet/mobile | | |
| **3.5** | **Tabbed Product Grid** — `app/components/v2/TabbedProductGrid/` | §4.4 | ✅ |
| | - Tab nav: typography-only weight/color differentiation | | |
| | - 4-col product grid (8 products per tab) | | |
| | - Tab switch: crossfade animation | | |
| | - "Shop All Products" link | | |
| | - Responsive: 3-col tablet, 2-col mobile | | |
| **3.6** | **Core Products Carousel (Large Detail Cards)** — `app/components/v2/CoreProductsCarousel/` | §4.5 | ✅ |
| | - Horizontal carousel of card pairs (440px image + text column) | | |
| | - 1.5 pairs visible, partial peek | | |
| | - Responsive: stacked on mobile | | |
| **3.7** | **Lifestyle Gallery with Product Overlays** — `app/components/v2/LifestyleGallery/` | §4.6 | ✅ |
| | - 2-col: sticky text + category tabs (left), masonry photo grid (right) | | |
| | - Photo cards with floating product info overlay | | |
| | - Tab click swaps gallery content | | |
| | - Quick-add cart icon on overlay | | |
| | - Responsive: horizontal tabs on tablet/mobile | | |
| **3.8** | **Home page composition** — update `app/routes/__index/index.tsx` | — | ⬜ |
| | - Wire all new sections together in order | | |
| | - Data loading: loaders for featured products, campaigns, collections | | |
| | - Add new shared sections: value props, trust badges, FAQ, reviews, CTA banners, collection carousel, inline image text banner | | |

---

## Phase 4 — Product Pages (§5)
**Branch:** `redesign/phase-4-product`
**Dependencies:** Phase 0, Phase 1 (product card, badges, buttons, quantity picker), Phase 2 (header, footer)

| # | Task | PRD Ref | Status |
|---|------|---------|--------|
| **4.1** | **Breadcrumbs** — `app/components/v2/Breadcrumbs/` | §5.1 | ⬜ |
| | - Chevron separator, hover color transition | | |
| | - Current crumb: no pointer events | | |
| **4.2** | **Product Image Gallery** — `app/components/v2/ProductImageGallery/` | §5.3 | ⬜ |
| | - Main image (3:4 aspect, zoom icon) + 2-col thumbnail grid below | | |
| | - Active thumbnail border, hover states | | |
| | - Sticky positioning on desktop | | |
| | - Mobile: horizontal swipe carousel with dot indicators | | |
| **4.3** | **Product Info (Right Column)** — `app/components/v2/ProductInfo/` | §5.4 | ⬜ |
| | - Badges row, title, rating stars, price block | | |
| | - Description with "Read more" expand | | |
| | - Stock indicator (green dot + count) | | |
| | - Variant selector (size pills, selected = black fill) | | |
| | - Quantity picker + Add to Cart row | | |
| | - Buy It Now button | | |
| | - Trust signals row (shipping, returns icons) | | |
| | - Store pickup section | | |
| | - Accordion sections (Overview / How to use / Ingredients) | | |
| | - Action links (Share, Ask a question) | | |
| **4.4** | **Recommended Products section** — `app/components/v2/RecommendedProducts/` | §5.5 | ⬜ |
| | - Centered heading + 4-col grid of product cards | | |
| | - Cards with border variant (1px solid #E0E0E0) | | |
| **4.5** | **Sticky Add-to-Cart Bar** — `app/components/v2/StickyATCBar/` | §5.6 | ⬜ |
| | - Fixed bottom bar, IntersectionObserver trigger on price block | | |
| | - Product thumbnail, name, price, variant select, quantity picker (pill), ATC button | | |
| | - Slide-in/out animation | | |
| | - Add-to-cart checkmark confirmation feedback | | |
| | - Syncs with main page variant/quantity selectors | | |
| | - Responsive: simplified on mobile (price + qty + ATC only) | | |
| **4.6** | **Product page composition** — update `app/routes/__index/product/` | — | ⬜ |
| | - 2-col grid layout (image gallery + product info) | | |
| | - Wire all new components | | |
| | - Preserve existing data loading and variant logic | | |

---

## Phase 5 — Cart, Checkout & Payment (§8)
**Branch:** `redesign/phase-5-cart-checkout`
**Dependencies:** Phase 0, Phase 1 (buttons, quantity picker), Phase 2 (header for cart icon interaction)

| # | Task | PRD Ref | Status |
|---|------|---------|--------|
| **5.1** | **Cart Drawer (Slide-Out)** — `app/components/v2/CartDrawer/` | §8.10 | ⬜ |
| | - Fixed right panel (420px), overlay backdrop | | |
| | - Header: title, item count badge, close button | | |
| | - Free shipping progress bar (animated, green at 100%) | | |
| | - Cart item rows: thumbnail, name, variant, price, quantity picker, remove | | |
| | - Footer: gift wrap checkbox, action links, estimated total, View Cart + Check Out buttons | | |
| | - Empty state | | |
| | - Animations: slide-in/out, item add/remove, quantity change | | |
| | - Triggered by cart icon click or add-to-cart | | |
| **5.2** | **Cart Page (Fallback)** — `app/components/v2/CartPage/` | §8.10.B | ⬜ |
| | - Full-page cart table: product, price, quantity, total columns | | |
| | - Mobile: card-based layout (no table) | | |
| | - Cart footer: subtotal, tax note, checkout button, continue shopping | | |
| | - Empty cart state | | |
| | - Remove item modal | | |
| | - Update `app/routes/cart/` to use new components | | |
| **5.3** | **Checkout Form Input component** — `app/components/v2/CheckoutInput/` | §8.9 | ⬜ |
| | - Floating label (Shopify pattern) | | |
| | - States: default, focus, has-value, error | | |
| | - Select variant with custom chevron | | |
| | - Error message with icon | | |
| **5.4** | **Checkout Page Layout** — `app/components/v2/CheckoutLayout/` | §8.1–8.2 | ⬜ |
| | - Two-column: form (left) + order summary (right) | | |
| | - No standard header/footer (checkout-only chrome) | | |
| | - Store name/logo linking to home | | |
| | - Breadcrumb steps: Cart → Information → Shipping → Payment | | |
| | - Responsive: single column, summary as collapsible accordion | | |
| **5.5** | **Express Checkout** — `app/components/v2/ExpressCheckout/` | §8.3 | ⬜ |
| | - Shop Pay, PayPal, Google Pay buttons | | |
| | - "OR" divider | | |
| **5.6** | **Contact Information Section** — `app/components/v2/ContactInfoSection/` | §8.4 | ⬜ |
| | - Email input, marketing opt-in checkbox | | |
| **5.7** | **Shipping Address Section** — `app/components/v2/ShippingAddressSection/` | §8.5 | ⬜ |
| | - Country, name row (2-col), company (optional), address, suburb, state/postcode row (3-col), phone | | |
| | - Save info checkbox | | |
| **5.8** | **Navigation Row + Policy Links** — `app/components/v2/CheckoutNav/` | §8.6–8.7 | ⬜ |
| | - Return link (left) + Continue/Pay button (right) | | |
| | - Policy links below | | |
| **5.9** | **Order Summary (Right Column)** — `app/components/v2/OrderSummary/` | §8.8 | ⬜ |
| | - Mobile toggle header | | |
| | - Order items list (thumbnails with quantity badges) | | |
| | - Discount/gift card input with apply button | | |
| | - Price breakdown: subtotal, shipping, tax, total | | |
| **5.10** | **Payment Step** — `app/components/v2/PaymentStep/` | §8.11 | ⬜ |
| | - Payment method tabs (Stripe, PayPal) | | |
| | - Stripe Elements with custom appearance API theme | | |
| | - Pay Now button with loading state | | |
| | - Security trust line | | |
| **5.11** | **Payment Result Pages** — `app/components/v2/PaymentResult/` | §8.12 | ⬜ |
| | - Success page: animated checkmark, order details card, action buttons | | |
| | - Failed page: error icon, message, retry/support buttons | | |
| | - Loading skeleton with shimmer animation | | |
| **5.12** | **Checkout page composition** — update `app/routes/checkout/` | — | ⬜ |
| | - Wire all checkout components into the multi-step flow | | |
| | - Preserve existing Stripe/PayPal integration logic | | |
| | - Update payment result routes | | |

---

## Phase 6 — Remaining Pages (§6, §7, §9, error pages)
**Branch:** `redesign/phase-6-remaining`
**Dependencies:** Phase 0–2
**Note:** PRD sections §6, §7, §9 are marked "Awaiting screenshots." Tasks below are placeholders.

| # | Task | PRD Ref | Status |
|---|------|---------|--------|
| **6.1** | **Category / Collection Pages** — redesign `app/routes/__index/$collection/` | §6 | 🔲 Blocked (awaiting PRD) |
| **6.2** | **Search** — redesign `DropDownSearchBar`, `MobileSearchDialog` | §7 | 🔲 Blocked (awaiting PRD) |
| **6.3** | **Blog** — redesign `app/routes/blog/` | §9 | 🔲 Blocked (awaiting PRD) |
| **6.4** | **Error Pages** — redesign `FourOhFour`, `FiveHundreError` | — | 🔲 Blocked (awaiting PRD) |
| **6.5** | **Modals** — redesign `PeasyDealMessageModal`, `ItemAddedModal`, `EmailSubscribeModal`, etc. | §11.4 | 🔲 Blocked (awaiting PRD) |
| **6.6** | **Loading States** — redesign `CssSpinner`, `Spinner`, `Snackbar` | §11.5 | 🔲 Blocked (awaiting PRD) |
| **6.7** | **Tracking Pages** — redesign `app/routes/tracking/` | — | 🔲 Blocked (awaiting PRD) |
| **6.8** | **Misc Components** — `PageTitle`, `LoadMore`/`LoadMoreButton` | — | 🔲 Blocked (awaiting PRD) |

---

## Phase 7 — Integration, QA & Deprecation Cleanup
**Branch:** `redesign/main`
**Dependencies:** All phases

| # | Task | Status |
|---|------|--------|
| **7.1** | Merge all phase branches into `redesign/main` | ⬜ |
| **7.2** | Full responsive testing: mobile (375px), tablet (768px), desktop (1440px) | ⬜ |
| **7.3** | Cross-browser testing: Chrome, Safari, Firefox, Edge | ⬜ |
| **7.4** | Lighthouse audit: performance, accessibility, SEO | ⬜ |
| **7.5** | Verify all old components have `@deprecated` JSDoc comments | ⬜ |
| **7.6** | Verify all import references updated to v2 components | ⬜ |
| **7.7** | Run full test suite (`npm run validate`) — fix any regressions | ⬜ |
| **7.8** | Visual regression comparison: old vs new (screenshot diff) | ⬜ |
| **7.9** | Merge `redesign/main` → `main` | ⬜ |
| **7.10** | Remove worktrees | ⬜ |

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not started |
| 🔄 | In progress |
| ✅ | Completed |
| 🔲 | Blocked / Waiting on PRD |

---

## Execution Notes

### Component Deprecation Rule (from PRD §1)
- **Never delete** existing component files
- Add `@deprecated` JSDoc comment pointing to the v2 replacement
- Create new components in `app/components/v2/` directory
- Update all import references to use new components
- Old files remain untouched for rollback safety

### Parallel Execution Plan
Using `git worktree` and subagents, the following can be worked on in parallel:
- **Phase 0** + **Phase 1** (tokens and shared components — minimal overlap)
- **Phase 3** + **Phase 4** + **Phase 5** (home, product, cart/checkout — after Phase 0–2 complete)

### Critical Path
```
Phase 0 (Foundation) → Phase 1 (Shared) → Phase 2 (Global) → Phase 3–5 (Pages, parallel) → Phase 7 (Integration)
                                                              → Phase 6 (when PRD ready)
```
