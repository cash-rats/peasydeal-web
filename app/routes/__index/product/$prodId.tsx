import {
	useCallback,
	useState,
	useEffect,
	useRef,
	useReducer,
} from 'react';
import type { ChangeEvent } from 'react';
import type { LoaderFunction, ActionFunction, V2_MetaFunction, LinksFunction } from '@remix-run/node';
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
import {
	getCanonicalDomain,
	getProdDetailTitleText,
	getProdDetailDescText,
	getProdDetailDescTextWithoutPrice,
	getProdDetailOgSEO,
	getFourOhFourTitleText,
	getFourOhFourDescText,
} from '~/utils/seo';
import {
	decomposeProductDetailURL,
	composeProductDetailURL,
} from '~/utils';
import { composErrorResponse } from '~/utils/error';
import type { ApiErrorResponse } from '~/shared/types';
import PromoteSubscriptionModal from '~/components/PromoteSubscriptionModal';

import Breadcrumbs from './components/Breadcrumbs';
import Reviews from './components/Reviews';
import type { ProductVariation, LoaderTypeProductDetail } from './types';
import { fetchProductDetail } from './api.server';
import styles from "./styles/ProdDetail.css";
import ProductDetailContainer, { links as ProductDetailContainerLinks } from './components/ProductDetailContainer';
import RecommendedProducts, { links as RecommendedProductsLinks } from './components/RecommendedProducts';
import useStickyActionBar from './hooks/useStickyActionBar';
import useSticky from './hooks/useSticky';
import reducer, {
	ActionTypes,
	updateProductImages,
	changeProduct,
	setVariation,
} from './reducer';
import { structuredData } from './structured_data';
import { normalizeToSessionStorableCartItem, findDefaultVariation } from './utils';
import { matchOldProductURL, } from './utils';
import { redirectToNewProductURL } from './loaders';

export const meta: V2_MetaFunction = ({ data }: { data: LoaderTypeProductDetail }) => {
	if (!data || !data.product) {
		return [
			{ title: getFourOhFourTitleText('product') },
			{
				tagName: 'meta',
				name: 'description',
				content: getFourOhFourDescText('product'),
			}
		];
	}

	const defaultVariation: ProductVariation | undefined = data.
		product.
		variations.
		find(variation => variation.uuid === data.product.default_variation_uuid);

	const category = data.product?.categories.length > 0 ? data.product.categories[0].label : '';
	let description = getProdDetailDescTextWithoutPrice(data.product.title, category);

	if (defaultVariation) {
		description = getProdDetailDescText(
			data.product.title,
			defaultVariation.retail_price,
			defaultVariation.sale_price,
			category,
		)
	}

	return [
		{ title: getProdDetailTitleText(data.product.title, data.product.uuid) },
		{
			tagName: 'meta',
			name: 'description',
			content: description,
		},
		...getProdDetailOgSEO({
			title: getProdDetailTitleText(data.product.title, data.product.uuid),
			desc: description,
			image: data.meta_image,
			url: data.canonical_url,
		})
	];
};

export const links: LinksFunction = () => {
	return [
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

export const handle = {
	dynamicLinks,
	structuredData,
};

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
//  - [ ] what is error?
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

	// If item does not have a valid variationUUID, don't insert it to shopping cart.
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

const getPriceRow = (salePrice: number, previousRetailPrice: Array<number>) => {
	return (
		<>
			<span className="text-4xl font-poppins font-bold text-[#D02E7D] mr-2">
				£{salePrice}
			</span>
			{
				previousRetailPrice.length > 0 && previousRetailPrice.map((retailPrice, index) => (
					<span
						className='flex relative mr-2'
						key={`previous_retail_price${index}`}
						style={{ fontWeight: index === 0 && previousRetailPrice.length !== 1 ? '500' : '300' }}
					>
						<span className="text-2xl">
							£{retailPrice}
						</span>
						<span className='block w-full h-[3px] absolute top-[50%] bg-black' />
					</span>
				))
			}
		</>
	)
}

type ProductDetailProps = {} & LazyComponentProps;
/*
 * - [ ] display product reviews
 */
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
		sessionStorableCartItem: normalizeToSessionStorableCartItem(
			{
				productDetail: loaderData?.product,
				productVariation: defaultVariation,
				quantity: 1,
			},
		),
	});

	const [variationErr, setVariationErr] = useState<string>('');
	const [openSuccessModal, setOpenSuccessModal] = useState(false);

	const productContentWrapperRef = useRef<HTMLDivElement>(null);
	const mobileUserActionBarRef = useRef<HTMLDivElement>(null);
	const productTopRef = useRef<HTMLDivElement>(null);

	useSticky(productContentWrapperRef, productTopRef, 'sticky', 145);
	useStickyActionBar(mobileUserActionBarRef, productContentWrapperRef);

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
		console.log('ga[recommended_product]', title, productUUID);
	}

	const handleOnClose = () => {
		setOpenSuccessModal(false);
	}

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

			<PromoteSubscriptionModal />

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
					onAddToCart={handleAddToCart}
					onDecreaseQuantity={decreaseQuantity}
					onIncreaseQuantity={increaseQuantity}
				/>
			</div>

			{/* Reviews */}
			<Reviews />

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
