import {
  useCallback,
  useState,
  useEffect,
  useRef,
  useReducer,
} from 'react';
import type { ChangeEvent } from 'react';
import type { LoaderFunction, ActionFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import type { DynamicLinksFunction } from 'remix-utils';
import httpStatus from 'http-status-codes';
import { trackWindowScroll } from "react-lazy-load-image-component";
import type { LazyComponentProps } from "react-lazy-load-image-component";

import FourOhFour from '~/components/FourOhFour';
import { commitSession } from '~/sessions/redis_session';
import { insertItem } from '~/sessions/shoppingcart.session';
import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';
import ItemAddedModal, { links as ItemAddedModalLinks } from '~/components/PeasyDealMessageModal/ItemAddedModal';
import { getCanonicalDomain } from '~/utils/seo';
import { decomposeProductDetailURL, composeProductDetailURL } from '~/utils';
import { composErrorResponse } from '~/utils/error';
import type { ApiErrorResponse } from '~/shared/types';
import PromoteSubscriptionModal from '~/components/PromoteSubscriptionModal';
import { getSessionIDFromSessionStore } from '~/services/daily_session';
import { isFromGoogleStoreBot } from '~/utils';

import Breadcrumbs, { links as BreadCrumbLinks } from './components/Breadcrumbs';
import type { LoaderTypeProductDetail } from './types';
import { fetchProductDetail } from './api.server';
import styles from "./styles/ProdDetail.css";
import ProductDetailContainer, { links as ProductDetailContainerLinks } from './components/ProductDetailContainer';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import trackWindowScrollTo from './components/RecommendedProducts/hooks/track_window_scroll_to';
import useStickyActionBar from './hooks/useStickyActionBar';
import useSticky from './hooks/useSticky';
import reducer, {
  ActionTypes,
  updateProductImages,
  changeProduct,
  setVariation,
} from './reducer';
import {
  normalizeToSessionStorableCartItem,
  findDefaultVariation,
  matchOldProductURL,
  tryPickUserSelectedVariationImage,
} from './utils';
import { redirectToNewProductURL } from './loaders';
import { meta as metaFunc } from './meta';
import ProductPolicy from './components/ProductPolicy';

export const meta = metaFunc;

export const links: LinksFunction = () => {
  return [
    ...BreadCrumbLinks(),
    ...ProductDetailContainerLinks(),
    ...ItemAddedModalLinks(),
    ...RecommendedProductsLinks(),
    { rel: "stylesheet", href: styles },
  ];
};


const dynamicLinks: DynamicLinksFunction<LoaderTypeProductDetail> = ({ data }) => {
  return [
    {
      rel: 'canonical',
      href: data?.canonical_url || getCanonicalDomain(),
    },
  ];
}

export const handle = { dynamicLinks };

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.prodId) {
    throw json(
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
    throw json<ApiErrorResponse>(
      composErrorResponse('variationUUID is not found.'),
      { status: httpStatus.NOT_FOUND },
    )
  }

  try {
    const prodDetail = await fetchProductDetail(decompURL.productUUID);

    return json<LoaderTypeProductDetail>({
      product: prodDetail,
      canonical_url: `${getCanonicalDomain()}${url.pathname}`,
      meta_image: prodDetail.main_pic_url || '',
      user_agent: userAgent,
    });
  } catch (error: any) {
    throw json<ApiErrorResponse>(
      composErrorResponse(error.message),
      { status: httpStatus.NOT_FOUND }
    );
  }
};

type ActionType =
  | 'to_product_detail'
  | 'add_item_to_cart'
  | 'buy_now';

// TODO
//  - [x] store shopping cart items in session storage if user has not logged in yet.
//  - [ ] what is the error?
export const action: ActionFunction = async ({ request }) => {
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
    return json('');
  }

  const session = await insertItem(request, item);

  if (formAction === 'add_item_to_cart') {
    return json('', {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  // unknown action type.
  return null;
}

export const CatchBoundary = () => (<FourOhFour />);

type ProductDetailProps = {} & LazyComponentProps;

function ProductDetailPage({ scrollPosition }: ProductDetailProps) {
  const loaderData = useLoaderData<LoaderTypeProductDetail>() || {};
  const mainCategory = (
    loaderData?.product?.categories &&
    loaderData?.product?.categories.length > 0
  )
    ? loaderData.product.categories[0]
    : null;

  const defaultVariation = findDefaultVariation(loaderData.product);
  const tags = loaderData.product.tag_combo_tags || '';

  // TODO: extract state initializer to independent function
  const [state, dispatch] = useReducer(reducer, {
    productDetail: loaderData?.product,
    categories: loaderData?.product?.categories,
    mainCategory,
    sharedImages: loaderData?.product.shared_images,
    variationImages: loaderData?.product.variation_images,
    quantity: 1,
    variation: defaultVariation,
    tags: tags.split(','),
    sessionStorableCartItem: normalizeToSessionStorableCartItem({
      productDetail: loaderData?.product,
      productVariation: defaultVariation,
      quantity: 1,
    }),
  });

  const [variationErr, setVariationErr] = useState<string>('');
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

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

  // Change product.
  useEffect(() => {
    // This action updates detail to new product also clears images of previous product images.
    dispatch(changeProduct(loaderData.product));

    // Update product images to new product after current event loop.
    setTimeout(() => {
      dispatch(updateProductImages(
        loaderData.product.shared_images,
        loaderData.product.variation_images,
      ));
    }, 100);

    const gaSessionID = getSessionIDFromSessionStore();

    window
      .rudderanalytics
      ?.track('view_product_detail', {
        session: gaSessionID,
        product: `${state.productDetail.title}_${state.productDetail.uuid}`
      });
  }, [loaderData.product.uuid]);

  useEffect(() => {
    const currentVariation = findDefaultVariation(state.productDetail);
    dispatch({
      type: ActionTypes.set_variation,
      payload: currentVariation,
    })
  }, [state.productDetail]);


  const handleUpdateQuantity = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!state.variation) return;
    const { purchase_limit } = state.variation;
    const newQuant = Number(evt.target.value);
    if (newQuant > purchase_limit) return;
    dispatch({
      type: ActionTypes.update_quantity,
      payload: newQuant,
    })
  };

  const increaseQuantity = () => {
    if (!state.variation) return;
    const { purchase_limit } = state.variation;
    if (state.quantity === purchase_limit) return;

    dispatch({
      type: ActionTypes.update_quantity,
      payload: state.quantity + 1,
    })
  };

  const decreaseQuantity = () => {
    if (state.quantity === 1) return;
    dispatch({
      type: ActionTypes.update_quantity,
      payload: state.quantity - 1,
    })
  };

  const addToCart = useFetcher();
  const reloadCartItemCount = useFetcher();

  const handleAddToCart = useCallback(
    () => {
      if (!state.variation) {
        setVariationErr('Please pick a variation');
        return;
      }

      setVariationErr('');

      const item = {
        ...state.sessionStorableCartItem,

        // Try to pick image of the variation that user selected
        // image: state.variationImages[state.sessionStorableCartItem.variationUUID] || '',
        image: tryPickUserSelectedVariationImage(
          state.sessionStorableCartItem.variationUUID,
          state.variationImages,
        ) || state.productDetail.main_pic_url,

        added_time: Date.now().toString(),
      }

      window.rudderanalytics?.track('click_add_to_cart', {
        product: item.productUUID,
      });

      addToCart.submit(
        {
          __action: 'add_item_to_cart',
          item: JSON.stringify(item),
        },
        {
          method: 'post',
          action: `/product/${item.productUUID}`,
        },
      );
    },
    [state.sessionStorableCartItem],
  );

  useEffect(() => {
    if (addToCart.type === 'done') {
      setOpenSuccessModal(true);

      setTimeout(() => {
        setOpenSuccessModal(false);
      }, 1000)

      reloadCartItemCount.submit(
        null,
        {
          method: 'post',
          action: '/components/Header?index',
          replace: true,
        })
    }
  }, [addToCart.type]);



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

  const handleChangeVariation = (v: any) => {
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

      <PromoteSubscriptionModal forceDisable={isFromGoogleStoreBot(loaderData.user_agent)} />
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
          isAddingToCart={addToCart.state !== 'idle'}
          tags={state.tags}

          onChangeQuantity={handleUpdateQuantity}
          onChangeVariation={handleChangeVariation}
          addToCart={handleAddToCart}
          onDecreaseQuantity={decreaseQuantity}
          onIncreaseQuantity={increaseQuantity}
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
              category={state.mainCategory.name}
              onClickProduct={handleClickProduct}
              scrollPosition={scrollPosition}
            />

          )
          : null
      }
    </>
  );
};

export default trackWindowScroll(ProductDetailPage);
