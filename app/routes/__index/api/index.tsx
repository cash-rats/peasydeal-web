import httpStatus from 'http-status-codes';

import type { Product, ApiErrorResponse } from '~/shared/types';
import type { ActivityBanner } from '../types';
import { MYFB_ENDPOINT, PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

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

interface IFetchProductsByCategoryV2Response {
	items: Product[];
	total: number;
	current: number;
}

export const fetchProductsByCategoryV2 = async ({
	category,
	perpage,
	page,
	random,
}: FetchProductsByCategoryV2Params): Promise<IFetchProductsByCategoryV2Response> => {
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

	console.log('data ~', respJSON);

	return {
		items: normalizeV2Data(respJSON.items),
		total: respJSON.total,
		current: respJSON.current,
	}
}

const normalizeSearchProduct = (apiData: any[]): Product[] => {
	const transformed: Product[] = apiData.map((data: any): Product => {
		return {
			currency: data.currency,
			description: data.description || '',
			discount: data.discount,
			main_pic: data.images && data.images.length > 0 ? data.images[0] : '',
			productUUID: data.product_uuid,
			retailPrice: data.retail_price,
			salePrice: data.sale_price,
			shortDescription: data.shortDescription,
			subtitle: data.subtitle,
			createdAt: data.created_at,
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

	return normalizeSearchProduct(respJSON.items);
}