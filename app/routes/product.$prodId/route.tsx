import {
  useState,
  useRef,
  type ChangeEvent,
} from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs, LinksFunction } from 'react-router';
import {
  data,
  redirect,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import httpStatus from 'http-status-codes';
import FourOhFour from '~/components/FourOhFour';
import { commitSession } from '~/sessions/redis_session.server';
import { insertItem } from '~/sessions/shoppingcart.session.server';
import type { ShoppingCartItem } from '~/sessions/types';
import ItemAddedModal, { links as ItemAddedModalLinks } from '~/components/PeasyDealMessageModal/ItemAddedModal';
import { getCanonicalDomain } from '~/utils/seo';
import { decomposeProductDetailURL, composeProductDetailURL } from '~/utils';
import { composErrorResponse } from '~/utils/error';
// import PromoteSubscriptionModal from '~/components/PromoteSubscriptionModal';
import { getSessionIDFromSessionStore } from '~/services/daily_session';
import { isFromGoogleStoreBot } from '~/utils';

import Breadcrumbs, { links as BreadCrumbLinks } from './components/Breadcrumbs';
import type { LoaderTypeProductDetail, OptionType } from './types';
import { fetchProductDetail } from './api.server';
import styles from './styles/ProdDetail.css?url';
import ProductDetailContainer, { links as ProductDetailContainerLinks } from './components/ProductDetailContainer';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import trackWindowScrollTo from './components/RecommendedProducts/hooks/track_window_scroll_to';
import {
  useStickyActionBar,
  useSticky,
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
// import { meta as metaFunc } from './meta';
import ProductPolicy from './components/ProductPolicy';

// export const meta = metaFunc;

export const links: LinksFunction = () => {
  return [
    ...BreadCrumbLinks(),
    ...ProductDetailContainerLinks(),
    ...ItemAddedModalLinks(),
    ...RecommendedProductsLinks(),
    { rel: 'stylesheet', href: styles },
  ];
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
      meta_image: prodDetail.main_pic_url?.url || '',
      user_agent: userAgent,
    });
  } catch (error: any) {
    throw Response.json(
      composErrorResponse(error.message),
      { status: httpStatus.NOT_FOUND }
    );
  }
};

type ActionType =
  | 'to_product_detail'
  | 'add_item_to_cart'
  | 'buy_now';

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  const formAction = formObj['__action'] as ActionType;

  if (formAction === 'to_product_detail') {
    return redirect(composeProductDetailURL({
      productName: formObj['productName'] as string,
      productUUID: formObj['productUUID'] as string,
    }));
  }

  const payload = Object.fromEntries(form.entries());
  const item = JSON.parse(payload.item as string) as ShoppingCartItem;

  // If item does not have a valid variationUUID, don't add it to shopping cart.
  // TODO output proper error resposne
  if (
    !item ||
    !item.variationUUID ||
    typeof item.variationUUID === 'undefined'
  ) {
    return data('', { status: httpStatus.BAD_REQUEST });
  }

  const session = await insertItem(request, item);

  if (formAction === 'add_item_to_cart') {
    return data('', {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  // unknown action type.
  return null;
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

  // TODO: extract state initializer to independent function
  const { state, dispatch } = useProductState(loaderData.product);
  const [variationErr, setVariationErr] = useState<string>('');

  const productContentWrapperRef = useRef<HTMLDivElement>(null);
  const mobileUserActionBarRef = useRef<HTMLDivElement>(null);
  const productTopRef = useRef<HTMLDivElement>(null);
  const recmmendedProdsRef = useRef<HTMLDivElement>(null);

  useSticky(productContentWrapperRef, productTopRef, 'sticky', 145);
  useStickyActionBar(mobileUserActionBarRef, productContentWrapperRef);
  trackWindowScrollTo(recmmendedProdsRef, () => {
    const gaSessionID = getSessionIDFromSessionStore();
    if (gaSessionID) {
      window.rudderanalytics?.track('prod_page_scroll_to_recommends', {
        session: gaSessionID,
      })
    }
  });

  useProductChange({
    product: loaderData.product,
    dispatch,
  });

  useVariationChange({
    product: loaderData.product,
    dispatch,
  });

  const handleUpdateQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
    const newQuant = Number(evt.target.value);
    if (state.variation && newQuant <= state.variation.purchase_limit) {
      dispatch(updateQuantity(newQuant));
    }
  };

  const handleIncreaseQuantity = () => {
    if (!state.variation) return;
    const { purchase_limit } = state.variation;
    if (state.quantity === purchase_limit) return;
    dispatch(updateQuantity(state.quantity + 1));
  };

  const handleDecreaseQuantity = () => {
    if (state.quantity === 1) return;
    dispatch(updateQuantity(state.quantity - 1));
  };

  const {
    addItemToCart,
    isAddingToCart,
    openSuccessModal,
    setOpenSuccessModal,
  } = useAddToCart({
    sessionStorableCartItem: state.sessionStorableCartItem,
    variationImages: state.variationImages,
  });

  const handleAddToCart = () => {
    if (!state.variation) {
      setVariationErr('Please pick a variation');
      return;
    }

    setVariationErr('');
    addItemToCart();
  }


  const handleClickProduct = (title: string, productUUID: string) => {
    // Intel we probably want to know
    //   1. what is the current product
    //   2. what is the recommend product he/she clicked on?
    const gaSessionID = getSessionIDFromSessionStore();

    if (gaSessionID) {
      window
        .rudderanalytics
        ?.track('select_recommend_prod_page', {
          session: gaSessionID,
          product: `${title}_${productUUID}`,
        });
    }
  }

  const handleOnClose = () => setOpenSuccessModal(false);

  const handleChangeVariation = (v: OptionType) => {
    if (!v) return;
    const selectedVariation =
      state
        .productDetail
        .variations
        .find(variation => variation.uuid === v.value);

    if (!selectedVariation) return;
    dispatch(setVariation(selectedVariation));
  }

  return (
    <>
      <ItemAddedModal
        open={openSuccessModal}
        onClose={handleOnClose}
      />

      {/*<PromoteSubscriptionModal forceDisable={isFromGoogleStoreBot(loaderData.user_agent)} />*/}
      <Breadcrumbs
        categories={state.categories}
        productTitle={state.productDetail.title}
        productUuid={state.productDetail.uuid}
      />

      <div className="
				relative w-full
				xl:flex xl:mx-auto xl:mb-0 xl:flex-row xl:max-w-[1280px]
				md:flex md:mt-6 md:px-4 md:pb-[20px] md:flex-row md:justify-center
				md:items-start md:gap-[10px]
				max-w-screen-xl mt-2"
      >
        <ProductDetailContainer
          productDetail={state.productDetail}
          sharedImages={state.sharedImages}
          variationImages={state.variationImages}
          variation={state.variation}
          variationErr={variationErr}
          quantity={state.quantity}
          sessionStorableCartItem={state.sessionStorableCartItem}
          isAddingToCart={isAddingToCart}
          tags={state.tags}

          onChangeQuantity={handleUpdateQuantity}
          onChangeVariation={handleChangeVariation}
          addToCart={handleAddToCart}
          onDecreaseQuantity={handleDecreaseQuantity}
          onIncreaseQuantity={handleIncreaseQuantity}
        />
      </div>

      <div className="
				relative w-full
				xl:flex md:flex
				mt-2 xl:mx-auto xl:mb-0 md:mt-6
				md:px-4 md:pb-[20px]
				md:justify-center
				md:items-start md:gap-[10px]
				xl:max-w-[1280px]
				max-w-screen-xl "
      >
        <ProductPolicy productDetail={state.productDetail} />
      </div>

      {/*
				Recommended products:
					- Things you might like: other products that belongs to the same category.
					- Hot deals
					- New trend
			*/}
      {
        state.mainCategory
          ? (
            <RecommendedProducts
              ref={recmmendedProdsRef}
              category={state.mainCategory?.name || ''}
              onClickProduct={handleClickProduct}
            />
          )
          : null
      }
    </>
  );
};

export default ProductDetailPage;
