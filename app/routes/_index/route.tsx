import { useMemo, useCallback, useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs } from 'react-router';
import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
  useRouteLoaderData,
} from 'react-router';
import httpStatus from 'http-status-codes';

import type {
  TCategoryPreview,
  TPromotionType,
  Product,
} from '~/shared/types';
import type { ShoppingCartItem } from '~/sessions/types';
import { useCartContext } from '~/routes/hooks';
import { getCanonicalDomain, composeProductDetailURL, isFromGoogleStoreBot } from '~/utils';
import FiveHundredError from '~/components/FiveHundreError';
import { EmailSubscribeModal } from '~/components/v2/EmailSubscribeModal';
import { ItemAddedModal } from '~/components/v2/ItemAddedModal';
import type { GalleryProduct } from '~/components/v2/LifestyleGallery/LifestyleGallery';
import type { RootLoaderData } from '~/root';

// v2 components
import { V2Layout } from '~/components/v2/GlobalLayout';
import { HeroCarousel } from '~/components/v2/HeroCarousel';
import { HeroBanner } from '~/components/v2/HeroBanner';
import { TaglineBanner } from '~/components/v2/TaglineBanner';
import { CampaignSection } from '~/components/v2/CampaignSection';
import { TabbedProductGrid } from '~/components/v2/TabbedProductGrid';
import { CoreProductsCarousel } from '~/components/v2/CoreProductsCarousel';
import { LifestyleGallery } from '~/components/v2/LifestyleGallery';
import { ValuePropsRow } from '~/components/v2/ValuePropsRow';
import { Truck, ShieldCheck, BadgeCheck, Sparkles } from 'lucide-react';

import { fetchLandingPageFeatureProducts } from './api.server';
import { StatementBlock } from '~/components/v2/StatementBlock';

type LoaderData = {
  categoryPreviews: TCategoryPreview[];
  promotionPreviews: TCategoryPreview[];
  promotions: TPromotionType[];
  userAgent: string;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'canonical',
      href: getCanonicalDomain(),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const userAgent = request.headers.get('user-agent') || '';

    const landings = await fetchLandingPageFeatureProducts({
      categoriesPreviewNames: [
        'hardware',
        'vehicles-and-parts',
        'animals-and-pet-supplies',
        'cameras-and-optics',
        'luggage-and-bags',
        'apparel-and-accessories',
        'new_trend',
      ],
    });

    return Response.json({
      categoryPreviews: landings.categoryPreviews,
      promotionPreviews: landings.promotionPreviews,
      promotions: landings.promotions,
      userAgent,
    });
  } catch (e) {
    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <FiveHundredError
        error={new Error(error.statusText || 'Route Error')}
        statusCode={error.status}
      />
    );
  }

  return (
    <FiveHundredError
      error={error instanceof Error ? error : new Error('Unknown error')}
      statusCode={500}
    />
  );
}

/* ─── Static placeholder content ─── */

const heroSlides = [
  {
    imageSrc:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=600&fit=crop',
    bgTint: '#D4A99A',
    subtitle: 'DEALS YOU\'LL LOVE',
    headline: 'Discover amazing products at unbeatable prices',
    ctaLabel: 'Shop Now',
    ctaHref: '/promotion/new_trend',
  },
  {
    imageSrc:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=600&fit=crop',
    bgTint: '#C9D4C5',
    subtitle: 'NEW ARRIVALS',
    headline: 'Fresh finds added daily',
    ctaLabel: 'Explore',
    ctaHref: '/promotion/new_trend',
  },
  {
    imageSrc:
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&h=600&fit=crop',
    bgTint: '#E0D5C8',
    subtitle: 'TOP PICKS',
    headline: 'Handpicked deals just for you',
    ctaLabel: 'Discover',
    ctaHref: '/collection/apparel-and-accessories',
  },
];

/* ─── Helpers ─── */

function toCoreProd(p: Product) {
  return {
    id: p.productUUID,
    imageSrc: p.main_pic,
    name: p.title,
    description: p.shortDescription || p.description || '',
    salePrice:
      p.salePrice < p.retailPrice ? p.salePrice : undefined,
    retailPrice: p.retailPrice,
    ctaLabel: 'Shop Now',
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
    .join(' ');
}

/* ─── Component ─── */

export default function LandingPage() {
  const {
    categoryPreviews = [],
    promotionPreviews = [],
    promotions = [],
    userAgent = '',
  } = useLoaderData<LoaderData>() || {};

  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const navigate = useNavigate();
  const { cart, setCart } = useCartContext();
  const [showItemAdded, setShowItemAdded] = useState(false);

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
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    ];
    const bgColors = ['#F5EDE4', '#E8EDE5', '#EDE5E8'];

    return promos.map((promo, i) => ({
      categoryLabel: capitalizeLabel(promo.name),
      headline: promo.label || promo.desc || capitalizeLabel(promo.name),
      ctaLabel: 'Shop Now',
      ctaHref: `/promotion/${promo.name}`,
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
          ctaLabel: 'Shop Now',
          ctaHref: firstPromo.type === 'promotion' ? `/promotion/${firstPromo.name}` : `/collection/${firstPromo.name}`,
          imageSrc: firstPromo.items[0]?.main_pic || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop',
        }
      : undefined;

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
      href: preview.type === 'promotion'
        ? `/promotion/${preview.name}`
        : `/collection/${preview.name}`,
    }));
  }, [promotionPreviews, categoryPreviews]);

  // Build core products from top items
  const coreProducts = useMemo(() => {
    const allItems = categoryPreviews.flatMap((cp) => cp.items);
    return allItems.slice(0, 4).map(toCoreProd);
  }, [categoryPreviews]);

  // Build lifestyle gallery from top 5 categories by product count, with shuffled items
  // Also build a product lookup map keyed by href for quick-add-to-cart
  const { lifestyleCategories, productByHref } = useMemo(() => {
    const aspectPatterns = ['portrait', 'square', 'wide', 'portrait'] as const;
    const lookup = new Map<string, Product>();

    // Sort by count descending, take top 5 with at least 2 items
    const topCategories = [...categoryPreviews]
      .filter(cp => cp.items.length >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const cats = topCategories.map(cp => {
      // Shuffle items to show variety each page load
      const shuffled = [...cp.items].sort(() => Math.random() - 0.5);
      return {
        label: cp.label || capitalizeLabel(cp.name),
        description: cp.desc || undefined,
        photos: shuffled.slice(0, 6).map((product, idx) => {
          const href = composeProductDetailURL({
            productName: product.title,
            productUUID: product.productUUID,
          });
          lookup.set(href, product);
          return {
            imageSrc: product.main_pic,
            imageAlt: product.title,
            aspectRatio: aspectPatterns[idx % 4],
            product: {
              name: product.title,
              price: product.retailPrice,
              salePrice: product.salePrice < product.retailPrice ? product.salePrice : undefined,
              thumbnailSrc: product.main_pic,
              href,
            },
          };
        }),
      };
    });

    return { lifestyleCategories: cats, productByHref: lookup };
  }, [categoryPreviews]);

  // Quick-add from LifestyleGallery bag icon
  const handleGalleryQuickAdd = useCallback(
    (galleryProduct: GalleryProduct) => {
      const product = productByHref.get(galleryProduct.href);
      if (!product) {
        navigate(galleryProduct.href);
        return;
      }

      // If multiple variations, go to PDP to pick one
      if ((product.variations?.length ?? 0) > 1) {
        navigate(galleryProduct.href);
        return;
      }

      const variationUUID = product.variations?.[0]?.uuid || product.variationID;
      const cartItem: ShoppingCartItem = {
        productUUID: product.productUUID,
        variationUUID,
        title: product.title,
        specName: '',
        image: product.main_pic,
        salePrice: product.salePrice.toString(),
        retailPrice: product.retailPrice.toString(),
        quantity: String(Number(cart[variationUUID]?.quantity || 0) + 1),
        purchaseLimit: product.variations?.[0]?.purchase_limit?.toString() || '',
        tagComboTags: product.tabComboType || '',
        added_time: Date.now().toString(),
      };

      setCart({ ...cart, [variationUUID]: cartItem });
      setShowItemAdded(true);
    },
    [productByHref, cart, setCart, navigate]
  );

  return (
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <div className="v2 overflow-hidden">
        <h1 className="absolute top-0 left-0 w-[1px] h-[1px] overflow-hidden">
          Welcome to PeasyDeal - Shop Now and Save Big!
        </h1>
        <EmailSubscribeModal
          disableAutoOpen={isFromGoogleStoreBot(userAgent)}
          onSubscribe={async (email) => {
            const form = new FormData();
            form.append('email', email);
            const resp = await fetch('/api/email-subscribe', { method: 'POST', body: form });
            const result = await resp.json();
            if (result?.ok === false || result?.error) {
              throw new Error(result.error || result.err_msg || 'Failed to subscribe');
            }
          }}
          imageUrl="/Sale-Overlay-Variation.png"
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
          ctaHref="/shop-all"
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
            shopAllHref="/shop-all"
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

        {/* ValuePropsRow */}
        <ValuePropsRow
          items={[
            {
              icon: <Truck size={48} strokeWidth={1.5} />,
              title: "Free Shipping",
              description: "Free shipping on all orders over £19.99. Fast and reliable delivery to your door.",
            },
            {
              icon: <ShieldCheck size={48} strokeWidth={1.5} />,
              title: "Secure Payment",
              description: "SSL encrypted checkout with Stripe and PayPal. Your data is always safe.",
            },
            {
              icon: <BadgeCheck size={48} strokeWidth={1.5} />,
              title: "Money-Back Guarantee",
              description: "100% satisfaction guaranteed. Not happy? Full refund within 14 days.",
            },
            {
              icon: <Sparkles size={48} strokeWidth={1.5} />,
              title: "Daily New Deals",
              description: "Fresh deals added every day. Great products at unbeatable prices.",
            },
          ]}
        />

        {/* Lifestyle Gallery */}
        {lifestyleCategories.length > 0 && (
          <LifestyleGallery
            subtitle="CURATED FOR YOU"
            heading="Products our customers love"
            categories={lifestyleCategories}
            onQuickAdd={handleGalleryQuickAdd}
          />
        )}

        {/* Item Added Modal */}
        <ItemAddedModal
          open={showItemAdded}
          onClose={() => setShowItemAdded(false)}
          onContinueShopping={() => setShowItemAdded(false)}
          onViewCart={() => {
            setShowItemAdded(false);
            navigate('/cart');
          }}
        />

        {/* Statement Block */}
        <div className="border-t-[1px] border-[#E0E0E0]">
          <StatementBlock
            tagline="Discover unbeatable deals on quality products — delivered straight to your door"
            subtitle="CURATED FOR YOU"
            heading="Products our customers love"
            body="We offer a wide range of products at unbeatable prices. From electronics to fashion, we have something for everyone."
            imageSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
          />
        </div>
      </div>
    </V2Layout>
  );
}
