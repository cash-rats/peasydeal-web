import { useMemo, useCallback } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData, useCatch, useNavigate } from "@remix-run/react";
import type { DynamicLinksFunction } from "remix-utils";
import httpStatus from "http-status-codes";

import type {
  TCategoryPreview,
  TPromotionType,
  Product,
} from "~/shared/types";
import { getCanonicalDomain, composeProductDetailURL, isFromGoogleStoreBot } from "~/utils";
import FiveHundredError from "~/components/FiveHundreError";
import PromoteSubscriptionModal from "~/components/PromoteSubscriptionModal";

// v2 components
import { HeroCarousel } from "~/components/v2/HeroCarousel";
import { HeroBanner } from "~/components/v2/HeroBanner";
import { TaglineBanner } from "~/components/v2/TaglineBanner";
import { CampaignSection } from "~/components/v2/CampaignSection";
import { TabbedProductGrid } from "~/components/v2/TabbedProductGrid";
import { CoreProductsCarousel } from "~/components/v2/CoreProductsCarousel";
import { LifestyleGallery } from "~/components/v2/LifestyleGallery";

import { fetchLandingPageFeatureProducts } from "./api";

type LoaderDataType = {
  categoryPreviews: TCategoryPreview[];
  promotionPreviews: TCategoryPreview[];
  promotions: TPromotionType[];
  userAgent: string;
};

export const links: LinksFunction = () => {
  return [];
};

const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => {
  return [
    {
      rel: "canonical",
      href: getCanonicalDomain(),
    },
  ];
};
export const handle = { dynamicLinks };

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const userAgent = request.headers.get("user-agent");

    const landings = await fetchLandingPageFeatureProducts({
      categoriesPreviewNames: [
        "hardware",
        "vehicles-and-parts",
        "animals-and-pet-supplies",
        "cameras-and-optics",
        "luggage-and-bags",
        "apparel-and-accessories",
        "new_trend",
      ],
    });

    return json<LoaderDataType>({
      categoryPreviews: landings.categoryPreviews,
      promotionPreviews: landings.promotionPreviews,
      promotions: landings.promotions,
      userAgent: userAgent || "",
    });
  } catch (e) {
    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return (
    <FiveHundredError message={caught.data} statusCode={caught.status} />
  );
};

/* ─── Static placeholder content ─── */

const heroSlides = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=600&fit=crop",
    bgTint: "#D4A99A",
    subtitle: "DEALS YOU'LL LOVE",
    headline: "Discover amazing products at unbeatable prices",
    ctaLabel: "Shop Now",
    ctaHref: "/collection/new_trend",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=600&fit=crop",
    bgTint: "#C9D4C5",
    subtitle: "NEW ARRIVALS",
    headline: "Fresh finds added daily",
    ctaLabel: "Explore",
    ctaHref: "/collection/new_trend",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&h=600&fit=crop",
    bgTint: "#E0D5C8",
    subtitle: "TOP PICKS",
    headline: "Handpicked deals just for you",
    ctaLabel: "Discover",
    ctaHref: "/collection/apparel-and-accessories",
  },
];

const lifestyleCategories = [
  {
    label: "Tech & Gadgets",
    description: "The latest gadgets and accessories for your everyday life.",
    photos: [
      {
        imageSrc:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=800&fit=crop",
        aspectRatio: "portrait" as const,
      },
      {
        imageSrc:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        aspectRatio: "square" as const,
      },
      {
        imageSrc:
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop",
        aspectRatio: "wide" as const,
      },
      {
        imageSrc:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop",
        aspectRatio: "portrait" as const,
      },
    ],
  },
  {
    label: "Home & Living",
    description:
      "Upgrade your space with practical and stylish home essentials.",
    photos: [
      {
        imageSrc:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=800&fit=crop",
        aspectRatio: "portrait" as const,
      },
      {
        imageSrc:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
        aspectRatio: "square" as const,
      },
      {
        imageSrc:
          "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=450&fit=crop",
        aspectRatio: "wide" as const,
      },
    ],
  },
  {
    label: "Outdoors",
    description: "Gear up for adventure with outdoor essentials.",
    photos: [
      {
        imageSrc:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=800&fit=crop",
        aspectRatio: "portrait" as const,
      },
      {
        imageSrc:
          "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=600&fit=crop",
        aspectRatio: "square" as const,
      },
    ],
  },
];

/* ─── Helpers ─── */

function toCoreProd(p: Product) {
  return {
    id: p.productUUID,
    imageSrc: p.main_pic,
    name: p.title,
    description: p.shortDescription || p.description || "",
    salePrice:
      p.salePrice < p.retailPrice ? p.salePrice : undefined,
    retailPrice: p.retailPrice,
    ctaLabel: "Shop Now",
    href: composeProductDetailURL({
      productName: p.title,
      productUUID: p.productUUID,
    }),
  };
}

function capitalizeLabel(name: string) {
  return name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ─── Component ─── */

export default function Index() {
  const {
    categoryPreviews = [],
    promotionPreviews = [],
    promotions = [],
    userAgent = "",
  } = useLoaderData<LoaderDataType>() || {};

  const navigate = useNavigate();

  const handleProductClick = useCallback(
    (product: Product) => {
      navigate(
        composeProductDetailURL({
          productName: product.title,
          productUUID: product.productUUID,
        })
      );
    },
    [navigate]
  );

  // Build hero banner cards from promotions metadata
  const heroBannerCards = useMemo(() => {
    const promos = promotions.slice(0, 3);
    const placeholderImages = [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    ];
    const bgColors = ["#F5EDE4", "#E8EDE5", "#EDE5E8"];

    return promos.map((promo, i) => ({
      categoryLabel: capitalizeLabel(promo.name),
      headline: promo.label || promo.desc || capitalizeLabel(promo.name),
      ctaLabel: "Shop Now",
      ctaHref: `/collection/${promo.name}`,
      imageSrc: placeholderImages[i] || placeholderImages[0],
      bgColor: bgColors[i] || bgColors[0],
    }));
  }, [promotions]);

  // Build campaign section from first promotionPreview
  const campaignData = useMemo(() => {
    const firstPromo = promotionPreviews[0];
    const secondPromo = promotionPreviews[1] || categoryPreviews[0];

    const campaign = firstPromo
      ? {
          categoryLabel: capitalizeLabel(firstPromo.name),
          headline: firstPromo.label || capitalizeLabel(firstPromo.name),
          ctaLabel: "Shop Now",
          ctaHref: `/collection/${firstPromo.name}`,
          imageSrc:
            firstPromo.items[0]?.main_pic ||
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop",
        }
      : {
          headline: "Featured Deals",
          ctaLabel: "Shop Now",
          ctaHref: "/collection/new_trend",
          imageSrc:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop",
        };

    const rows = [firstPromo, secondPromo]
      .filter(Boolean)
      .map((preview) => ({
        title: preview!.label || capitalizeLabel(preview!.name),
        products: preview!.items.slice(0, 6),
      }));

    return { campaign, rows };
  }, [promotionPreviews, categoryPreviews]);

  // Build tabbed grid from all previews
  const productTabs = useMemo(() => {
    const allPreviews = promotionPreviews.concat(categoryPreviews);
    return allPreviews.slice(0, 4).map((preview) => ({
      label: preview.label || capitalizeLabel(preview.name),
      products: preview.items.slice(0, 8),
    }));
  }, [promotionPreviews, categoryPreviews]);

  // Build core products from top items
  const coreProducts = useMemo(() => {
    const allItems = categoryPreviews.flatMap((cp) => cp.items);
    return allItems.slice(0, 4).map(toCoreProd);
  }, [categoryPreviews]);

  return (
    <div className="v2 overflow-hidden">
      <h1 className="absolute top-0 left-0 w-[1px] h-[1px] overflow-hidden">
        Welcome to PeasyDeal - Shop Now and Save Big!
      </h1>
      <PromoteSubscriptionModal
        forceDisable={isFromGoogleStoreBot(userAgent)}
      />

      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* 3-Card Banner */}
      {heroBannerCards.length >= 3 && (
        <HeroBanner cards={heroBannerCards} />
      )}

      {/* Tagline */}
      <TaglineBanner
        headline="Discover unbeatable deals on quality products — delivered straight to your door"
        ctaLabel="Browse all categories"
        ctaHref="/collection/new_trend"
      />

      {/* Campaign Section */}
      {campaignData.rows.length > 0 && (
        <CampaignSection
          campaign={campaignData.campaign}
          rows={campaignData.rows}
          onProductClick={handleProductClick}
        />
      )}

      {/* Tabbed Product Grid */}
      {productTabs.length > 0 && (
        <TabbedProductGrid
          tabs={productTabs}
          shopAllLabel="Shop All Products"
          shopAllHref="/collection/new_trend"
          onProductClick={handleProductClick}
        />
      )}

      {/* Core Products Carousel */}
      {coreProducts.length > 0 && (
        <CoreProductsCarousel
          title="Featured products"
          products={coreProducts}
        />
      )}

      {/* Lifestyle Gallery */}
      <LifestyleGallery
        subtitle="CURATED FOR YOU"
        heading="Products our customers love"
        categories={lifestyleCategories}
      />
    </div>
  );
}
