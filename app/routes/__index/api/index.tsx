import httpStatus from 'http-status-codes';

import type { Product, ApiErrorResponse } from '~/shared/types';
import type { ActivityBanner } from '../types';
import { MYFB_ENDPOINT, PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';
export interface FetchProductsByCategoryParams {
	category?: string | number;
	perpage?: number;
	page?: number;
	title?: string;
	random?: 0 | 1;
}

export interface FetchProductsByCategoryResponse {
	products: Product[];
}

const normalizeData = (apiData: any[]): Product[] => {
	const transformed: Product[] = apiData.map((data: any): Product => {
		return {
			currency: data.currency,
			description: data.description,
			discount: data.discountOff,
			main_pic: data.mainPic,
			productUUID: data.productUuid,
			retailPrice: data.retailPrice,
			salePrice: data.salePrice,
			shortDescription: data.shortDescription,
			subtitle: data.subTitle,
			title: data.title,
			variationID: data.variationId,
			tabComboType: data.tag_combo_type,
		};
	})

	return transformed;
}
// https://api.myfbmanage.com:8443/data-server/ec/products?pageSize=10&pageNo=0&cat=home
// fetchProductsByCategort takes category in type "string" instead of type "number" as search criteria.
export const fetchProductsByCategory = async ({
	title,
	category,
	perpage,
	page,
	random
}: FetchProductsByCategoryParams): Promise<Product[]> => {
	if (!perpage) perpage = 9;
	if (!page) page = 0;
	if (!random) random = 0;

	let endpoint = `${MYFB_ENDPOINT}/data-server/ec/products?pageSize=${perpage}&pageNo=${page}&random=${random}`;

	if (category) {
		endpoint = `${endpoint}&cat=${encodeURI(category.toString())}`;
	}

	if (title) {
		endpoint = `${endpoint}&title=${encodeURI(title)}`;
	}

	const resp = await fetch(endpoint);
	const respJSON = await resp.json();

	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;

		throw new Error(errResp.err_message);
	}

	return normalizeData(respJSON.products);
}

// We will interweave activity banners in between products list to make the screen
// more contentful.
export const fetchActivityBanners = async (): Promise<ActivityBanner[]> => {
	const endpoint = `${MYFB_ENDPOINT}/data-server/ec/activity_banners`;
	const resp = await fetch(endpoint);
	const respJSON = await resp.json();
	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;
		throw new Error(errResp.err_message);
	}

	return respJSON as ActivityBanner[];
}


const normalizeV2Data = (apiData: any[]): Product[] => {
	const transformed: Product[] = apiData.map((data: any): Product => {
		console.log('data', data);
		return {
			currency: data.currency,
			description: '',
			discount: data.discount,
			main_pic: data.images && data.images.length > 0 ? data.images[0] : '',
			productUUID: data.product_uuid,
			retailPrice: data.retail_price,
			salePrice: data.sale_price,
			shortDescription: '',
			subtitle: '',
			title: data.title,
			createdAt: data.created_at,
			variationID: data.variationId,
			tabComboType: data.tag_combo_type,
			variations: data.variations,
		};
	})

	return transformed;
}
export interface FetchProductsByCategoryV2Params {
	category?: number;
	perpage?: number;
	page?: number;
	random?: boolean;
}

export interface IFetchLandingPageFeatureProductsParams {
	categoriesPreviewNames: String[];
}

export const fetchLandingPageFeatureProducts = async ({
	categoriesPreviewNames = [],
}: IFetchLandingPageFeatureProductsParams) => {
	const url = new URL(PEASY_DEAL_ENDPOINT)

	url.pathname = '/v1/products/landing-page';
	url.searchParams.append('cat_preview_names', categoriesPreviewNames.join(','));

	const resp = await fetch(url.toString());
	const respJSON = await resp.json();

	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;
		throw new Error(errResp.err_message);
	}

	const categoryPreviews = respJSON.category_previews
		? respJSON.category_previews.map((categoryPreview: any) => {
			return {
				...categoryPreview,
				items: normalizeV2Data(categoryPreview.items),
			}
		}) : [];

	return {
		categoryPreviews,
		promotions: respJSON?.promotions || [],
	};
}

export const fetchProductsByCategoryV2 = async ({
	category,
	perpage,
	page,
	random,
}: FetchProductsByCategoryV2Params) => {
	if (!perpage) perpage = 9;
	if (!page) page = 1;
	if (!category) category = 1;

	const url = new URL(PEASY_DEAL_ENDPOINT)
	url.pathname = '/v1/products';
	url.searchParams.append('per_page', perpage.toString());
	url.searchParams.append('page', page.toString());
	url.searchParams.append('category', category.toString());
	url.searchParams.append('random', random ? 'true' : 'false');

	const resp = await fetch(url.toString());
	const respJSON = await resp.json();

	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;
		throw new Error(errResp.err_message);
	}

	return normalizeV2Data(respJSON.items);
}

const transformSearchProduct = (apiData: any[]): Product[] => {
	const transformed: Product[] = apiData.map((data: any): Product => {
		return {
			currency: data.currency,
			description: data.description || '',
			discount: data.discount,
			main_pic: data.images[0],
			productUUID: data.product_uuid,
			retailPrice: data.retail_price,
			salePrice: data.sale_price,
			shortDescription: data.shortDescription,
			subtitle: data.subtitle,
			title: data.title,
			variationID: data.variationId || '',
			tabComboType: data.tag_combo_type,
		};
	})

	return transformed;
}

export interface SearchProductsParams {
	query: string;
	perpage?: number;
	page?: number;
};

export const searchProducts = async ({ query, perpage = 8, page = 1 }: SearchProductsParams) => {
	const url = new URL(PEASY_DEAL_ENDPOINT);
	url.pathname = '/v1/products/search';
	url.searchParams.append('query', query);
	url.searchParams.append('per_page', perpage.toString());
	url.searchParams.append('page', page.toString());

	const resp = await fetch(url.toString());
	const respJSON = await resp.json();

	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;
		throw new Error(errResp.err_message);
	}

	return transformSearchProduct(respJSON.items);
}