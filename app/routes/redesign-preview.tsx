import { useState, useRef } from "react";
import { AnnouncementBar } from "~/components/v2/AnnouncementBar";
import { Header } from "~/components/v2/Header";
import type { NavItem } from "~/components/v2/Header";
import { MegaMenu } from "~/components/v2/MegaMenu";
import type { MegaMenuConfig } from "~/components/v2/MegaMenu";
import { MobileNavDrawer } from "~/components/v2/MobileNavDrawer";
import { Badge } from "~/components/v2/Badge";
import { Button } from "~/components/v2/Button";
import { QuantityPicker } from "~/components/v2/QuantityPicker";
import { CarouselArrows } from "~/components/v2/CarouselArrows";
import { TrustBadgesRow } from "~/components/v2/TrustBadgesRow";
import { ValuePropsRow } from "~/components/v2/ValuePropsRow";
import { FAQSection } from "~/components/v2/FAQSection";
import { CTABanner } from "~/components/v2/CTABanner";
import { StatementBlock } from "~/components/v2/StatementBlock";
import { InlineImageBanner } from "~/components/v2/InlineImageBanner";
import { Footer } from "~/components/v2/Footer";
// Phase 3 — Home page components
import { HeroCarousel } from "~/components/v2/HeroCarousel";
import { HeroBanner } from "~/components/v2/HeroBanner";
import { TaglineBanner } from "~/components/v2/TaglineBanner";
import { CampaignSection } from "~/components/v2/CampaignSection";
import { TabbedProductGrid } from "~/components/v2/TabbedProductGrid";
import { CoreProductsCarousel } from "~/components/v2/CoreProductsCarousel";
import { LifestyleGallery } from "~/components/v2/LifestyleGallery";
import type { Product } from "~/shared/types";
// Phase 4 — Product page components
import { Breadcrumbs } from "~/components/v2/Breadcrumbs";
import { ProductImageGallery } from "~/components/v2/ProductImageGallery";
import { ProductInfo } from "~/components/v2/ProductInfo";
import { RecommendedProducts } from "~/components/v2/RecommendedProducts";
import { StickyATCBar } from "~/components/v2/StickyATCBar";
// Phase 5 — Cart, Checkout & Payment components
import { CartDrawer } from "~/components/v2/CartDrawer";
import type { CartItem } from "~/components/v2/CartDrawer";
import { CartPage } from "~/components/v2/CartPage";
import { CheckoutLayout } from "~/components/v2/CheckoutLayout";
import { ExpressCheckout } from "~/components/v2/ExpressCheckout";
import { ContactInfoSection } from "~/components/v2/ContactInfoSection";
import { ShippingAddressSection } from "~/components/v2/ShippingAddressSection";
import type { ShippingAddress } from "~/components/v2/ShippingAddressSection";
import { CheckoutInput } from "~/components/v2/CheckoutInput";
import { CheckoutNav } from "~/components/v2/CheckoutNav";
import { OrderSummary } from "~/components/v2/OrderSummary";
import { PaymentStep } from "~/components/v2/PaymentStep";
import type { PaymentMethod } from "~/components/v2/PaymentStep";
import { PaymentSuccess, PaymentFailed, PaymentLoadingSkeleton } from "~/components/v2/PaymentResult";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", hasDropdown: true },
  { label: "Collections", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const megaMenuConfig: MegaMenuConfig = {
  quickLinks: [
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "New Arrivals", href: "/new" },
    { label: "Bundles", href: "/bundles" },
    { label: "Trending", href: "/trending" },
  ],
  categories: [
    {
      heading: "Skincare",
      href: "/skincare",
      links: [
        { label: "Cleansers", href: "/skincare/cleansers" },
        { label: "Moisturizers", href: "/skincare/moisturizers" },
        { label: "Serums", href: "/skincare/serums" },
      ],
    },
    {
      heading: "Body Care",
      href: "/body",
      links: [
        { label: "Body Wash", href: "/body/wash" },
        { label: "Lotions", href: "/body/lotions" },
        { label: "Oils", href: "/body/oils" },
      ],
    },
  ],
};

// Mock product data for Phase 3 components
function makeMockProduct(id: number, overrides?: Partial<Product>): Product {
  return {
    productUUID: `mock-${id}`,
    currency: "USD",
    description: "A premium skincare product made with all-natural ingredients.",
    discount: 20,
    main_pic: `https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop&q=80&sig=${id}`,
    retailPrice: 49.99,
    salePrice: 39.99,
    shortDescription: "Premium natural skincare",
    title: `Natural Glow Serum ${id}`,
    createdAt: "2026-01-01",
    variationID: `var-${id}`,
    tabComboType: id % 3 === 0 ? "new" : id % 3 === 1 ? "hot_deal" : null,
    ...overrides,
  };
}

const mockProducts = Array.from({ length: 8 }, (_, i) => makeMockProduct(i + 1));
const mockProducts2 = Array.from({ length: 6 }, (_, i) =>
  makeMockProduct(i + 20, {
    title: `Body Lotion ${i + 1}`,
    retailPrice: 29.99,
    salePrice: 24.99,
    main_pic: `https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop&q=80&sig=${i + 20}`,
  })
);

const productImages = [
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop&q=70",
];

const mockCartItems: CartItem[] = [
  {
    id: "cart-1",
    name: "Vitamin C Brightening Serum",
    variant: "30ml",
    thumbnailSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=250&fit=crop",
    salePrice: 39.99,
    retailPrice: 52.0,
    quantity: 2,
  },
  {
    id: "cart-2",
    name: "Hydra Glow Face Cream",
    variant: "50ml",
    thumbnailSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=250&fit=crop",
    retailPrice: 44.99,
    quantity: 1,
  },
  {
    id: "cart-3",
    name: "Gentle Foaming Cleanser with Aloe Vera Extract",
    thumbnailSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=200&h=250&fit=crop",
    salePrice: 19.99,
    retailPrice: 28.0,
    quantity: 1,
  },
];

const emptyShippingAddress: ShippingAddress = {
  country: "US",
  firstName: "",
  lastName: "",
  company: "",
  address: "",
  city: "",
  state: "",
  postcode: "",
  phone: "",
};

export default function RedesignPreview() {
  const [qty, setQty] = useState(1);
  const [pdpQty, setPdpQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("30ml");
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const priceBlockRef = useRef<HTMLDivElement>(null);
  // Phase 5 state
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [shippingAddress, setShippingAddress] = useState(emptyShippingAddress);
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

  return (
    <div className="v2 min-h-screen bg-white">
      {/* Announcement Bar */}
      <AnnouncementBar
        messages={[
          "FREE SHIPPING ON ALL U.S. ORDERS $200+",
          "100% CLEAN, NON-IRRITATING",
          "NO ANIMAL TESTING",
        ]}
      />

      {/* Header */}
      <div className="relative">
        <Header
          logoText="PeasyDeal"
          navItems={navItems}
          cartCount={3}
          onDropdownOpen={(label) => {
            if (label === "Shop") setMegaOpen(true);
          }}
          onDropdownClose={() => setMegaOpen(false)}
          onMenuOpen={() => setMobileNavOpen(true)}
        />
        <MegaMenu
          config={megaMenuConfig}
          isOpen={megaOpen}
          onClose={() => setMegaOpen(false)}
        />
      </div>

      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        categories={[
          { label: "Home", href: "/" },
          {
            label: "Shop",
            children: [
              { label: "Best Sellers", href: "/best-sellers" },
              { label: "New Arrivals", href: "/new" },
              { label: "Skincare", href: "/skincare" },
              { label: "Body Care", href: "/body" },
            ],
          },
          {
            label: "Collections",
            children: [
              { label: "Summer", href: "/collections/summer" },
              { label: "Winter", href: "/collections/winter" },
            ],
          },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      {/* ========== PHASE 3: HOME PAGE SECTIONS ========== */}

      {/* Hero Carousel */}
      <HeroCarousel
        slides={[
          {
            imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1400&h=600&fit=crop",
            bgTint: "#D4A99A",
            subtitle: "NEW COLLECTION",
            headline: "Naturally radiant skin",
            ctaLabel: "Shop Now",
            ctaHref: "/shop",
          },
          {
            imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1400&h=600&fit=crop",
            bgTint: "#C9D4C5",
            subtitle: "BESTSELLERS",
            headline: "Self-care essentials",
            ctaLabel: "Explore",
            ctaHref: "/best-sellers",
          },
          {
            imageSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1400&h=600&fit=crop",
            bgTint: "#E0D5C8",
            subtitle: "LIMITED EDITION",
            headline: "Summer glow collection",
            ctaLabel: "Discover",
            ctaHref: "/collections/summer",
          },
        ]}
      />

      {/* 3-Card Banner */}
      <HeroBanner
        cards={[
          {
            categoryLabel: "Skincare",
            headline: "Glow from within",
            ctaLabel: "Shop Now",
            ctaHref: "/skincare",
            imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
            bgColor: "#F5EDE4",
          },
          {
            categoryLabel: "Body Care",
            headline: "Nourish your body",
            ctaLabel: "Explore",
            ctaHref: "/body",
            imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
            bgColor: "#E8EDE5",
          },
          {
            categoryLabel: "Gift Sets",
            headline: "Perfect for gifting",
            ctaLabel: "Shop Gifts",
            ctaHref: "/gifts",
            imageSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=400&fit=crop",
            bgColor: "#EDE5E8",
          },
        ]}
      />

      {/* Tagline Banner */}
      <TaglineBanner
        headline="Because your skin deserves the purest ingredients nature has to offer"
        ctaLabel="Learn about our ingredients"
        ctaHref="/about"
      />

      {/* Campaign Section */}
      <CampaignSection
        campaign={{
          categoryLabel: "Sale Event",
          headline: "Sale 30% off",
          ctaLabel: "Shop Sale",
          ctaHref: "/sale",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=1000&fit=crop",
        }}
        rows={[
          { title: "Sale 30% off", products: mockProducts.slice(0, 4) },
          { title: "Under $29", products: mockProducts2.slice(0, 4) },
        ]}
      />

      {/* Tabbed Product Grid */}
      <TabbedProductGrid
        tabs={[
          { label: "What's Hot", products: mockProducts },
          { label: "Best Sellers", products: mockProducts2 },
          { label: "Sale", products: [...mockProducts.slice(0, 4), ...mockProducts2.slice(0, 4)] },
        ]}
      />

      {/* Core Products Carousel */}
      <CoreProductsCarousel
        title="The core products"
        products={[
          {
            id: "core-1",
            imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
            category: "Moisturizer",
            name: "Hydra Glow Face Cream",
            description: "Lightweight, fast-absorbing formula that locks in moisture all day. Made with hyaluronic acid and vitamin E.",
            salePrice: 34.99,
            retailPrice: 44.99,
            ctaLabel: "Shop Now",
            href: "/product/hydra-glow-face-cream",
          },
          {
            id: "core-2",
            imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=800&fit=crop",
            category: "Serum",
            name: "Vitamin C Brightening Serum",
            description: "Powerful antioxidant serum that evens skin tone and boosts radiance. Paraben-free and dermatologist tested.",
            retailPrice: 52.00,
            ctaLabel: "Shop Now",
            href: "/product/vitamin-c-serum",
          },
          {
            id: "core-3",
            imageSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop",
            category: "Cleanser",
            name: "Gentle Foaming Cleanser",
            description: "A soft, fragrance-free cleanser that removes impurities without stripping natural oils.",
            salePrice: 19.99,
            retailPrice: 28.00,
            ctaLabel: "Shop Now",
            href: "/product/gentle-cleanser",
          },
        ]}
      />

      {/* Lifestyle Gallery */}
      <LifestyleGallery
        subtitle="REAL MOMENTS"
        heading="Customers enjoy their journey everyday"
        categories={[
          {
            label: "Skincare",
            description: "Beautiful skin starts with the right routine. See how our customers use our products.",
            photos: [
              {
                imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=800&fit=crop",
                aspectRatio: "portrait",
                product: { name: "Hydra Glow Cream", price: 44.99, salePrice: 34.99, href: "#" },
              },
              {
                imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop",
                aspectRatio: "square",
                product: { name: "Body Lotion", price: 29.99, href: "#" },
              },
              {
                imageSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=450&fit=crop",
                aspectRatio: "wide",
              },
              {
                imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=800&fit=crop&q=70",
                aspectRatio: "portrait",
                product: { name: "Rose Face Mist", price: 22.00, href: "#" },
              },
            ],
          },
          {
            label: "Body Care",
            description: "From head to toe, our body care line nourishes every part of you.",
            photos: [
              {
                imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=800&fit=crop",
                aspectRatio: "portrait",
                product: { name: "Shea Butter Lotion", price: 32.00, salePrice: 25.00, href: "#" },
              },
              {
                imageSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop",
                aspectRatio: "square",
              },
              {
                imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=450&fit=crop&q=70",
                aspectRatio: "wide",
                product: { name: "Coconut Body Oil", price: 38.00, href: "#" },
              },
              {
                imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=800&fit=crop&q=70",
                aspectRatio: "portrait",
              },
            ],
          },
          {
            label: "Wellness",
            description: "Mindful moments for your overall well-being.",
            photos: [
              {
                imageSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=800&fit=crop",
                aspectRatio: "portrait",
              },
              {
                imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop&q=70",
                aspectRatio: "square",
                product: { name: "Lavender Bath Salts", price: 18.00, href: "#" },
              },
            ],
          },
        ]}
      />

      {/* ========== PHASE 4: PRODUCT PAGE SECTIONS ========== */}

      {/* Divider */}
      <div className="max-w-[var(--container-max)] mx-auto px-12 py-16">
        <div className="border-t border-[#E0E0E0] pt-16">
          <h2 className="font-heading text-[36px] font-bold text-black text-center mb-2">Product Detail Page Preview</h2>
          <p className="font-body text-sm text-[#888] text-center mb-12">Phase 4 components shown below</p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Skincare", href: "/skincare" },
          { label: "Serums", href: "/skincare/serums" },
          { label: "Vitamin C Brightening Serum" },
        ]}
      />

      {/* Product detail 2-col layout */}
      <div className="max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-2 redesign-md:py-2">
        <div className="grid grid-cols-1 redesign-sm:grid-cols-2 gap-6 redesign-md:gap-12 items-start">
          {/* Left: Image gallery */}
          <ProductImageGallery
            images={productImages}
            productName="Vitamin C Brightening Serum"
            onZoom={() => {}}
          />

          {/* Right: Product info */}
          <ProductInfo
            priceRef={priceBlockRef}
            badges={[
              { variant: "new", label: "New" },
              { variant: "discount", label: "-20%" },
            ]}
            title="Vitamin C Brightening Serum"
            rating={4.5}
            reviewCount={127}
            salePrice={39.99}
            retailPrice={52.00}
            shippingNote="Tax included. Shipping calculated at checkout."
            description="A powerful antioxidant serum that evens skin tone and boosts radiance. Made with 15% L-Ascorbic Acid, Vitamin E, and Ferulic Acid for maximum efficacy. Paraben-free, cruelty-free, and suitable for all skin types. Apply 3-5 drops to clean, dry skin morning and night before moisturizer."
            stock={131}
            variants={[
              { label: "15ml", value: "15ml" },
              { label: "30ml", value: "30ml" },
              { label: "50ml", value: "50ml" },
            ]}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
            quantity={pdpQty}
            onQuantityChange={setPdpQty}
            onAddToCart={() => {}}
            onBuyNow={() => {}}
            accordionItems={[
              {
                title: "Overview",
                content: "Our Vitamin C Brightening Serum is formulated with 15% L-Ascorbic Acid, the most potent form of Vitamin C, combined with Vitamin E and Ferulic Acid for maximum antioxidant protection. This lightweight serum absorbs quickly, leaving your skin feeling hydrated and refreshed.",
              },
              {
                title: "How to use",
                content: "Apply 3-5 drops to clean, dry skin in the morning and evening. Gently pat into face, neck, and décolleté. Follow with moisturizer and sunscreen (AM). For best results, use consistently for 4-6 weeks.",
              },
              {
                title: "Ingredients",
                content: "Water, Ascorbic Acid (15%), Propanediol, Ethoxydiglycol, Tocopherol (Vitamin E), Ferulic Acid, Panthenol, Sodium Hyaluronate, Glycerin, Xanthan Gum, Phenoxyethanol.",
              },
            ]}
          />
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts
        products={mockProducts.slice(0, 4)}
      />

      {/* Sticky ATC Bar (appears when scrolling past price) */}
      <StickyATCBar
        priceBlockRef={priceBlockRef as React.RefObject<HTMLDivElement>}
        productName="Vitamin C Brightening Serum"
        thumbnailSrc="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&h=100&fit=crop"
        salePrice={39.99}
        retailPrice={52.00}
        variants={[
          { label: "15ml", value: "15ml" },
          { label: "30ml", value: "30ml" },
          { label: "50ml", value: "50ml" },
        ]}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        quantity={pdpQty}
        onQuantityChange={setPdpQty}
        onAddToCart={() => {}}
      />

      {/* ========== PHASE 5: CART / CHECKOUT / PAYMENT ========== */}

      {/* Divider */}
      <div className="max-w-[var(--container-max)] mx-auto px-12 py-16">
        <div className="border-t border-[#E0E0E0] pt-16">
          <h2 className="font-heading text-[36px] font-bold text-black text-center mb-2">Cart, Checkout &amp; Payment Preview</h2>
          <p className="font-body text-sm text-[#888] text-center mb-12">Phase 5 components shown below</p>
        </div>
      </div>

      {/* Cart Drawer trigger */}
      <div className="max-w-[var(--container-max)] mx-auto px-12 mb-8">
        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="h-12 px-8 rounded-lg border-none bg-black text-white font-body text-sm font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-fast"
        >
          Open Cart Drawer
        </button>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={mockCartItems}
        freeShippingThreshold={200}
        giftWrapPrice={2.0}
        onViewCart={() => setCartDrawerOpen(false)}
        onCheckout={() => setCartDrawerOpen(false)}
      />

      {/* Cart Page (inline preview) */}
      <CartPage
        items={mockCartItems.map((i) => ({
          id: i.id,
          name: i.name,
          variant: i.variant,
          thumbnailSrc: i.thumbnailSrc,
          salePrice: i.salePrice,
          retailPrice: i.retailPrice,
          quantity: i.quantity,
        }))}
      />

      {/* Checkout Input demo */}
      <div className="max-w-[var(--container-max)] mx-auto px-12 py-8">
        <h3 className="font-heading text-xl font-bold text-black mb-6">Form Inputs (§8.9)</h3>
        <div className="max-w-md flex flex-col gap-3">
          <CheckoutInput label="Email" type="email" value="" onChange={() => {}} />
          <CheckoutInput label="Email" type="email" value="test@example.com" onChange={() => {}} />
          <CheckoutInput label="Email" type="email" value="" onChange={() => {}} error="Enter a valid email address" />
        </div>
      </div>

      {/* Checkout Layout preview (compact) */}
      <div className="max-w-[var(--container-max)] mx-auto px-12 py-8">
        <h3 className="font-heading text-xl font-bold text-black mb-6">Checkout Layout (§8.1-8.8)</h3>
      </div>
      <div className="border border-[#E0E0E0] rounded-xl overflow-hidden mx-4 redesign-md:mx-12 mb-16">
        <CheckoutLayout
          currentStep="information"
          leftContent={
            <div>
              <ExpressCheckout />
              <ContactInfoSection
                email={checkoutEmail}
                onEmailChange={setCheckoutEmail}
                marketingOptIn={marketingOptIn}
                onMarketingOptInChange={setMarketingOptIn}
                onLoginClick={() => {}}
              />
              <ShippingAddressSection
                address={shippingAddress}
                onChange={(field, value) =>
                  setShippingAddress((prev) => ({ ...prev, [field]: value }))
                }
                saveInfo={saveInfo}
                onSaveInfoChange={setSaveInfo}
              />
              <CheckoutNav
                returnLabel="Return to cart"
                returnHref="/cart"
                continueLabel="Continue to shipping"
                onContinue={() => {}}
              />
            </div>
          }
          rightContent={
            <OrderSummary
              items={mockCartItems.map((i) => ({
                id: i.id,
                name: i.name,
                variant: i.variant,
                thumbnailSrc: i.thumbnailSrc,
                quantity: i.quantity,
                salePrice: i.salePrice,
                retailPrice: i.retailPrice,
              }))}
              subtotal={144.96}
              total={144.96}
              currency="$"
            />
          }
        />
      </div>

      {/* Payment Step */}
      <div className="max-w-[var(--container-max)] mx-auto px-12 py-8">
        <h3 className="font-heading text-xl font-bold text-black mb-6">Payment Step (§8.11)</h3>
        <div className="max-w-lg">
          <PaymentStep
            activeMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />
        </div>
      </div>

      {/* Payment Results */}
      <div className="max-w-[var(--container-max)] mx-auto px-12 py-8">
        <h3 className="font-heading text-xl font-bold text-black mb-6">Payment Results (§8.12)</h3>
      </div>
      <PaymentSuccess
        orderNumber="#PD-20260224-001"
        items={[
          { id: "1", name: "Vitamin C Brightening Serum", variant: "30ml", thumbnailSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop", quantity: 2, price: 79.98 },
          { id: "2", name: "Hydra Glow Face Cream", variant: "50ml", thumbnailSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop", quantity: 1, price: 44.99 },
        ]}
        shippingInfo={{ name: "Jane Smith", address: "123 Main St, Los Angeles, CA 90001", method: "Standard Shipping (5-7 days)" }}
        total={124.97}
      />
      <PaymentFailed />
      <PaymentLoadingSkeleton />

      {/* ========== SHARED SECTIONS ========== */}

      {/* Trust Badges */}
      <TrustBadgesRow
        badges={[
          { label: "Free Shipping" },
          { label: "Money Guarantee" },
          { label: "Flexible Payment" },
          { label: "Online Support" },
          { label: "Return within 7 days" },
        ]}
      />

      {/* Value Props */}
      <ValuePropsRow
        items={[
          {
            icon: (
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="24" cy="24" r="20" />
                <path d="M14 24L22 32L34 18" />
              </svg>
            ),
            title: "Earth Lover",
            description: "We use sustainable packaging and eco-friendly ingredients.",
          },
          {
            icon: (
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M24 4L30 18H44L32 28L36 44L24 34L12 44L16 28L4 18H18Z" />
              </svg>
            ),
            title: "Cruelty Free",
            description: "Never tested on animals. Certified cruelty-free.",
          },
          {
            icon: (
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="24" cy="24" r="20" />
                <path d="M16 24C16 28.4 19.6 32 24 32S32 28.4 32 24" />
              </svg>
            ),
            title: "100% Organic",
            description: "Pure organic ingredients sourced responsibly.",
          },
          {
            icon: (
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="8" y="8" width="32" height="32" rx="4" />
                <path d="M16 24H32M24 16V32" />
              </svg>
            ),
            title: "Paraben Free",
            description: "No harmful chemicals. Safe for sensitive skin.",
          },
        ]}
      />

      {/* Statement Block */}
      <StatementBlock
        tagline="Because you need time for yourself"
        subtitle="OUR PROMISE"
        heading="Made with love and care"
        body="Every product is crafted with the finest natural ingredients, designed to nourish your skin and elevate your daily routine."
        imageSrc="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop"
        imageAlt="Lifestyle image"
      />

      {/* CTA Banner */}
      <CTABanner
        subtitle="Natural skincare"
        heading="Made for sensitive skin"
        body="Gentle formulas that deliver powerful results without irritation."
        ctaLabel="Shop Now"
        imageSrc="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop"
        imageAlt="Skincare products"
      />

      {/* FAQ Section */}
      <FAQSection
        heading="We're answerable!"
        body="Have questions? We've got answers."
        secondaryText="Can't find what you're looking for?"
        contactLink={{ label: "Contact us", href: "/contact" }}
        ctaLabel="See More Answers"
        imageSrc="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop"
        items={[
          { question: "What are your products made of?", answer: "All our products use 100% organic, sustainably sourced ingredients." },
          { question: "Do you offer free shipping?", answer: "Yes! Free shipping on all U.S. orders over $200." },
          { question: "What is your return policy?", answer: "We offer hassle-free returns within 7 days of delivery." },
          { question: "Are your products cruelty-free?", answer: "Absolutely. We never test on animals and are certified cruelty-free." },
        ]}
      />

      {/* Inline Image Banner */}
      <InlineImageBanner
        segments={[
          { type: "text", content: "Make you look" },
          { type: "image", src: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=80&fit=crop", shape: "pill" },
          { type: "text", content: "and feel glowy" },
          { type: "image", src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&h=100&fit=crop", shape: "circle" },
          { type: "text", content: "and healthy" },
          { type: "image", src: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=160&h=80&fit=crop", shape: "rounded" },
        ]}
      />

      {/* ========== COMPONENT GALLERY (Phase 1-2) ========== */}
      <main className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding)]">
        <section className="py-12 border-b border-[#E0E0E0]">
          <h2 className="font-heading text-section-title font-bold mb-6">Badges</h2>
          <div className="flex gap-3 flex-wrap">
            <Badge variant="discount">-20%</Badge>
            <Badge variant="new">New</Badge>
            <Badge variant="selling-fast">Selling fast!</Badge>
            <Badge variant="hot">Hot</Badge>
            <Badge variant="limited">Limited</Badge>
          </div>
        </section>

        <section className="py-12 border-b border-[#E0E0E0]">
          <h2 className="font-heading text-section-title font-bold mb-6">Buttons</h2>
          <div className="flex gap-4 flex-wrap items-center">
            <Button variant="primary">Buy It Now</Button>
            <Button variant="secondary">Add to Cart</Button>
            <Button variant="pill">Shop Now</Button>
            <Button variant="pill" inverted className="bg-black">Shop Now</Button>
            <Button variant="primary" isLoading>Loading...</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className="flex gap-4 flex-wrap items-center mt-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="default">Default</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </section>

        <section className="py-12 border-b border-[#E0E0E0]">
          <h2 className="font-heading text-section-title font-bold mb-6">Quantity Picker</h2>
          <div className="flex gap-6 items-center">
            <div>
              <p className="text-sm text-[#888] mb-2">Default</p>
              <QuantityPicker value={qty} onChange={setQty} />
            </div>
            <div>
              <p className="text-sm text-[#888] mb-2">Compact</p>
              <QuantityPicker value={qty} onChange={setQty} size="compact" />
            </div>
            <div>
              <p className="text-sm text-[#888] mb-2">Pill</p>
              <QuantityPicker value={qty} onChange={setQty} size="pill" />
            </div>
          </div>
        </section>

        <section className="py-12 border-b border-[#E0E0E0]">
          <h2 className="font-heading text-section-title font-bold mb-6">Carousel Arrows</h2>
          <div className="flex gap-6 items-center">
            <CarouselArrows onPrev={() => {}} onNext={() => {}} />
            <CarouselArrows onPrev={() => {}} onNext={() => {}} canPrev={false} />
            <CarouselArrows onPrev={() => {}} onNext={() => {}} canNext={false} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        linkGroups={[
          {
            heading: "Shop",
            links: [
              { label: "Shop All", href: "/shop" },
              { label: "Sale", href: "/sale" },
              { label: "Lookbook", href: "/lookbook" },
              { label: "Basic Collections", href: "/collections" },
            ],
          },
          {
            heading: "Customer Care",
            links: [
              { label: "My Account", href: "/account" },
              { label: "Contact", href: "/contact" },
              { label: "FAQs", href: "/faq" },
              { label: "Shipping and Returns", href: "/shipping" },
            ],
          },
        ]}
        aboutDescription="PeasyDeal brings you the best deals on premium, natural products for your everyday routine."
        legalLinks={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ]}
      />
    </div>
  );
}
