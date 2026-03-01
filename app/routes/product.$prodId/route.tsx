import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import {
  data,
  redirect,
  useNavigate,
  useNavigation,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
  useFetcher,
} from 'react-router';
import httpStatus from 'http-status-codes';
import FourOhFour from '~/components/FourOhFour';
import { CartDrawer } from '~/components/v2/CartDrawer';
import type { CartItem as CartDrawerItem } from '~/components/v2/CartDrawer';
import { useCartContext } from '~/routes/hooks';
import { getCanonicalDomain } from '~/utils/seo';
import { decomposeProductDetailURL, composeProductDetailURL } from '~/utils';
import { composErrorResponse } from '~/utils/error';
import { getSessionIDFromSessionStore } from '~/services/daily_session';
import { trackEvent } from '~/lib/gtm';
import type { Product } from '~/shared/types';
import { SUPER_DEAL_OFF } from '~/shared/constants';
import { round10 } from '~/utils/preciseRound';

import { Breadcrumbs } from '~/components/v2/Breadcrumbs';
import { ProductImageGallery } from '~/components/v2/ProductImageGallery';
import { ProductInfo } from '~/components/v2/ProductInfo';
import { StickyATCBar } from '~/components/v2/StickyATCBar';
import { RecommendedProducts } from '~/components/v2/RecommendedProducts';

import type { LoaderTypeProductDetail } from './types';
import { fetchProductDetail } from './api.server';
import {
  useProductState,
  useAddToCart,
  useProductChange,
  useVariationChange,
} from './hooks';
import {
  setVariation,
  updateQuantity,
} from './reducer';
import { matchOldProductURL } from './utils';
import { redirectToNewProductURL } from './loaders';

const RECOMMENDED_PRODUCTS_ENDPOINT = '/api/products/recommendations';

const toDiscountLabel = (variation?: {
  discount?: number;
  retail_price?: number;
  sale_price?: number;
}): string | null => {
  if (!variation) return null;

  let discount = variation.discount;

  // Fallback to price-derived discount when backend value is missing/invalid.
  if (
    (discount == null || Number.isNaN(discount) || discount <= 0) &&
    variation.retail_price &&
    variation.sale_price != null &&
    variation.retail_price > variation.sale_price
  ) {
    discount = (variation.retail_price - variation.sale_price) / variation.retail_price;
  }

  if (discount == null || Number.isNaN(discount) || discount <= 0) {
    return null;
  }

  // API discount is ratio (0~1). Keep compatibility for percentage-style values (>1).
  const percentage = discount <= 1 ? discount * 100 : discount;
  const normalized = Number(percentage.toFixed(1));
  return `-${normalized}%`;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.prodId) {
    throw Response.json(
      composErrorResponse('unrecognize product'),
      { status: httpStatus.NOT_FOUND },
    );
  }

  const oldMatches = matchOldProductURL(request.url);
  if (oldMatches.length > 0) {
    return redirectToNewProductURL(request, params.prodId);
  }

  const url = new URL(request.url);
  const decompURL = decomposeProductDetailURL(url);
  const userAgent = request.headers.get('user-agent') || '';

  if (!decompURL.productUUID) {
    throw Response.json(
      composErrorResponse('variationUUID is not found.'),
      { status: httpStatus.NOT_FOUND },
    )
  }

  try {
    const prodDetail = await fetchProductDetail(decompURL.productUUID);

    return data<LoaderTypeProductDetail>({
      product: prodDetail,
      canonical_url: `${getCanonicalDomain()}${url.pathname}`,
      main_pic_url: prodDetail.main_pic_url || '',
      meta_image: prodDetail.main_pic_url || '',
      user_agent: userAgent,
    });
  } catch (error: any) {
    throw Response.json(
      composErrorResponse(error.message),
      { status: httpStatus.NOT_FOUND }
    );
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());

  return redirect(composeProductDetailURL({
    productName: formObj['productName'] as string,
    productUUID: formObj['productUUID'] as string,
  }));
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === httpStatus.NOT_FOUND) {
    return <FourOhFour />;
  }

  return <FourOhFour />;
}

function ProductDetailPage() {
  const loaderData = useLoaderData<LoaderTypeProductDetail>() || {};
  const navigate = useNavigate();
  const navigation = useNavigation();

  const { state, dispatch } = useProductState(loaderData.product);
  const [hoveredVariationUUID, setHoveredVariationUUID] = useState<string | null>(null);
  const priceBlockRef = useRef<HTMLDivElement>(null);

  // Recommended products fetcher
  const recFetcher = useFetcher();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useProductChange({
    product: loaderData.product,
    dispatch,
  });

  useVariationChange({
    product: loaderData.product,
    dispatch,
  });

  // Fetch recommendations on mount
  useEffect(() => {
    if (state.mainCategory?.name) {
      recFetcher.submit(
        { category: state.mainCategory.name },
        { method: 'post', action: RECOMMENDED_PRODUCTS_ENDPOINT },
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch recommendations when navigating between products
  useEffect(() => {
    if (
      navigation.state !== 'idle' &&
      navigation.location?.pathname.includes('/product/')
    ) {
      if (state.mainCategory?.name) {
        recFetcher.submit(
          { category: state.mainCategory.name },
          { method: 'post', action: RECOMMENDED_PRODUCTS_ENDPOINT },
        );
      }
    }
  }, [navigation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set recommended products from fetcher data
  useEffect(() => {
    if (recFetcher.state === 'idle' && recFetcher.data) {
      const fetcherData = recFetcher.data as { products: Product[] } | undefined;
      if (fetcherData?.products?.length) {
        setRecommendedProducts(fetcherData.products);
      }
    }
  }, [recFetcher.state, recFetcher.data]);

  // ----- Data mapping for v2 components -----

  const galleryImages = useMemo(() => {
    const variation = state.variationImages.map(img => img.url);
    const shared = state.sharedImages.map(img => img.url);
    return [...variation, ...shared];
  }, [state.sharedImages, state.variationImages]);

  const commonImages = useMemo(
    () => state.sharedImages.map(img => img.url),
    [state.sharedImages],
  );

  const thumbnailImages = useMemo(
    () => commonImages.slice(0, 4),
    [commonImages],
  );

  const detailImages = useMemo(
    () => commonImages.slice(4),
    [commonImages],
  );

  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' },
    ];
    if (state.mainCategory) {
      items.push({
        label: state.mainCategory.label || state.mainCategory.name,
        href: `/collection/${state.mainCategory.name}`,
      });
    }
    items.push({ label: state.productDetail.title });
    return items;
  }, [state.mainCategory, state.productDetail.title]);

  const hasSuperDeal = useMemo(() => state.tags.includes('super_deal'), [state.tags]);

  const badges = useMemo(() => {
    const result: Array<{
      variant: 'discount' | 'new' | 'selling-fast' | 'hot' | 'limited' | 'super-deal';
      label: string;
    }> = [];
    if (hasSuperDeal) {
      result.push({ variant: 'super-deal', label: 'Super Deal' });
    }
    if (state.tags.includes('hot_deal')) {
      result.push({ variant: 'hot', label: 'Hot Deal' });
    }
    if (state.tags.includes('new')) {
      result.push({ variant: 'new', label: 'New' });
    }
    const variation = state.variation;
    const discountLabel = toDiscountLabel(variation);
    if (discountLabel) {
      result.push({ variant: 'discount', label: discountLabel });
    }
    return result;
  }, [hasSuperDeal, state.tags, state.variation]);

  const variants = useMemo(
    () => state.productDetail.variations.map(v => ({ label: v.spec_name, value: v.uuid })),
    [state.productDetail.variations],
  );

  const selectedVariationImage = useMemo(
    () => state.variationImages.find(img => img.variation_uuid === state.variation?.uuid)?.url,
    [state.variationImages, state.variation?.uuid],
  );

  const hoveredVariationImage = useMemo(() => {
    if (!hoveredVariationUUID) return undefined;
    return state.variationImages.find(img => img.variation_uuid === hoveredVariationUUID)?.url;
  }, [hoveredVariationUUID, state.variationImages]);

  const accordionItems = useMemo(() => [
    ...(state.productDetail.description
      ? [{ title: 'About this product', content: state.productDetail.description }]
      : []),
    {
      title: 'Shipping Cost',
      content: 'Shipping costs are based on the weight of your order and the delivery method. Once at the checkout screen, shipping charges will be displayed. FREE Shipping on order £19.99+',
    },
    {
      title: 'Free Return & Refund',
      content: 'You have our 100% money back guarantee. If you\'re not fully satisfied, you may return your unused item in its original condition and packaging within 14 days of receipt for a full refund.',
    },
    {
      title: 'How long will it take to get my order?',
      content: 'Unless there are exceptional circumstances, we make every effort to fulfill your order within 12 business days of the date of your order. Business day mean Monday to Friday, except holidays. Please note we do not ship on Weekend & Public Holidays.',
    },
  ], [state.productDetail.description]);

  // ----- Super Deal pricing -----
  const effectiveSalePrice = useMemo(() => {
    const sp = state.variation?.sale_price;
    if (hasSuperDeal && sp != null) {
      return round10(sp * SUPER_DEAL_OFF, -2);
    }
    return sp;
  }, [hasSuperDeal, state.variation?.sale_price]);

  const originalSalePrice = useMemo(() => {
    if (hasSuperDeal && state.variation?.sale_price != null) {
      return state.variation.sale_price;
    }
    return undefined;
  }, [hasSuperDeal, state.variation?.sale_price]);

  const maxQuantity = useMemo(() => {
    const purchaseLimit = state.variation?.purchase_limit;
    if (typeof purchaseLimit !== 'number' || !Number.isFinite(purchaseLimit) || purchaseLimit < 1) {
      return 99;
    }
    return Math.floor(purchaseLimit);
  }, [state.variation?.purchase_limit]);

  // ----- Event handlers -----

  const {
    addItemToCart,
    openSuccessModal,
    setOpenSuccessModal,
  } = useAddToCart({
    sessionStorableCartItem: state.sessionStorableCartItem,
    variationImages: state.variationImages,
  });

  // Cart drawer: map ShoppingCart → CartDrawerItem[]
  const { cart, setCart } = useCartContext();
  const cartDrawerItems = useMemo<CartDrawerItem[]>(() =>
    Object.values(cart).map((item) => {
      const isSuperDeal = item.tagComboTags?.includes('super_deal');
      const sp = item.salePrice ? parseFloat(item.salePrice) : undefined;
      const adjustedSalePrice = isSuperDeal && sp != null
        ? round10(sp * SUPER_DEAL_OFF, -2)
        : sp;
      return {
        id: item.variationUUID,
        name: item.title,
        variant: item.specName || undefined,
        thumbnailSrc: item.image || undefined,
        salePrice: adjustedSalePrice,
        originalSalePrice: isSuperDeal && sp != null ? sp : undefined,
        retailPrice: parseFloat(item.retailPrice) || 0,
        quantity: parseInt(item.quantity, 10) || 1,
      };
    }),
  [cart]);

  const handleCartQuantityChange = (id: string, qty: number) => {
    const item = cart[id];
    if (!item) return;
    setCart({ ...cart, [id]: { ...item, quantity: String(qty) } });
  };

  const handleCartRemoveItem = (id: string) => {
    const next = { ...cart };
    delete next[id];
    setCart(next);
  };

  // Checkout via server action (calculates price + sets checkout session)
  const checkoutFetcher = useFetcher();
  const handleCartCheckout = () => {
    checkoutFetcher.submit(
      {
        cart: JSON.stringify(cart),
        promo_code: '',
      },
      {
        method: 'post',
        action: '/api/cart/checkout',
      },
    );
    setOpenSuccessModal(false);
  };

  const handleAddToCart = () => {
    if (!state.variation) {
      return;
    }
    addItemToCart();
  };

  const handleBuyNow = () => {
    if (!state.variation) {
      return;
    }
    addItemToCart();
    navigate('/checkout');
  };

  const handleChangeVariationV2 = (uuid: string) => {
    const selectedVariation = state.productDetail.variations.find(
      v => v.uuid === uuid,
    );
    if (!selectedVariation) return;
    dispatch(setVariation(selectedVariation));
  };

  const handleQuantityChange = (qty: number) => {
    if (!state.variation) return;
    const nextQty = Math.max(1, Math.min(qty, maxQuantity));
    dispatch(updateQuantity(nextQty));
  };

  const handleClickRecommended = (product: Product) => {
    const gaSessionID = getSessionIDFromSessionStore();
    if (gaSessionID) {
      trackEvent('pd_select_recommend_prod_page', {
        session: gaSessionID,
        product: `${product.title}_${product.productUUID}`,
      });
    }
  };
  return (
    <>
      <CartDrawer
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        items={cartDrawerItems}
        onQuantityChange={handleCartQuantityChange}
        onRemoveItem={handleCartRemoveItem}
        giftWrapPrice={2}
        onViewCart={() => {
          setOpenSuccessModal(false);
          navigate('/cart');
        }}
        onCheckout={handleCartCheckout}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-2 redesign-md:py-2">
        <div className="grid grid-cols-1 redesign-sm:grid-cols-2 gap-6 redesign-md:gap-12 items-start">
          <ProductImageGallery
            images={galleryImages}
            thumbnailImages={thumbnailImages}
            detailImages={detailImages}
            previewImage={hoveredVariationImage}
            selectedVariationImage={selectedVariationImage}
            productName={state.productDetail.title}
          />

          <ProductInfo
            priceRef={priceBlockRef}
            badges={badges}
            title={state.productDetail.title}
            productUUID={state.productDetail.uuid}
            rating={state.productDetail.rating}
            reviewCount={state.productDetail.num_of_raters}
            salePrice={effectiveSalePrice}
            originalSalePrice={originalSalePrice}
            retailPrice={state.variation?.retail_price ?? 0}
            currency={state.variation?.currency}
            shippingNote="Tax included. Shipping calculated at checkout."
            description={state.productDetail.seo_description || state.productDetail.subtitle}
            stock={state.variation?.purchase_limit}
            variants={variants}
            selectedVariant={state.variation?.uuid}
            onVariantChange={handleChangeVariationV2}
            onVariantHoverStart={setHoveredVariationUUID}
            onVariantHoverEnd={() => setHoveredVariationUUID(null)}
            quantity={state.quantity}
            maxQuantity={maxQuantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            accordionItems={accordionItems}
          />
        </div>
      </div>

      {recommendedProducts.length > 0 && (
        <RecommendedProducts
          products={recommendedProducts.slice(0, 4)}
          onProductClick={handleClickRecommended}
        />
      )}

      <StickyATCBar
        priceBlockRef={priceBlockRef as React.RefObject<HTMLDivElement>}
        productName={state.productDetail.title}
        thumbnailSrc={galleryImages[0]}
        salePrice={effectiveSalePrice}
        originalSalePrice={originalSalePrice}
        retailPrice={state.variation?.retail_price ?? 0}
        currency={state.variation?.currency}
        variants={variants}
        selectedVariant={state.variation?.uuid}
        onVariantChange={handleChangeVariationV2}
        quantity={state.quantity}
        maxQuantity={maxQuantity}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}

export default ProductDetailPage;
