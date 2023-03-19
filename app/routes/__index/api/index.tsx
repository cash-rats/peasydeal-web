import httpStatus from 'http-status-codes';

import type { Product, ApiErrorResponse, TContentfulPost } from '~/shared/types';
import type { ActivityBanner } from '../types';
import {
	MYFB_ENDPOINT,
	PEASY_DEAL_ENDPOINT,
	CONTENTFUL_SPACE_ID,
	CONTENTFUL_ACCESS_TOKEN
} from '~/utils/get_env_source';

import * as contentful from 'contentful';

const contenfulClient = contentful.createClient({
	space: CONTENTFUL_SPACE_ID,
	accessToken: CONTENTFUL_ACCESS_TOKEN,
})

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
	category?: string;
	perpage?: number;
	page?: number;
	random?: boolean;
}

export interface IFetchLandingPageFeatureProductsParams {
	categoriesPreviewNames: string[];
	prmotionPreviewNames?: string[];
}

export const fetchLandingPageFeatureProducts = async ({
	categoriesPreviewNames = [],
	prmotionPreviewNames = [],
}: IFetchLandingPageFeatureProductsParams) => {
	const url = new URL(PEASY_DEAL_ENDPOINT)

	url.pathname = '/v1/products/landing-page';
	url.searchParams.append('cat_preview_names', categoriesPreviewNames.join(','));
	url.searchParams.append('promotion_names', prmotionPreviewNames.join(','));

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
	hasMore: boolean;
}

interface IContentfulRes {
	fields?: TContentfulPost,
}
// Fetch from Contentful with GraphQL
export const fetchContentfulPostWithId = async ({
	entryId,
}: { entryId: string }): Promise<any> => {
	try {
		const resp = await contenfulClient.getEntry<IContentfulRes>(entryId);
		return resp?.fields;
	} catch (error: any) {
		console.error(error);

		throw new Error(error?.message);
	}
}


export const fetchProductsByCategoryV2 = async ({
	category,
	perpage,
	page,
	random,
}: FetchProductsByCategoryV2Params): Promise<IFetchProductsByCategoryV2Response> => {
	if (!perpage) perpage = 8;
	if (!page) page = 1;
	if (!category) category = 'hot_deal';

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

	return {
		items: normalizeV2Data(respJSON.items),
		total: respJSON.total,
		current: respJSON.current,
		hasMore: respJSON.has_more,
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

// -------------- Search Products --------------
export interface SearchProductResponse {
	products: Product[];
	total: number;
	current: number;
	has_more: boolean;
};

export interface SearchProductsParams {
	query: string;
	perpage?: number;
	page?: number;
};

export const searchProducts = async ({ query, perpage = 8, page = 1 }: SearchProductsParams): Promise<SearchProductResponse> => {
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

	return {
		products: normalizeSearchProduct(respJSON.items),
		total: respJSON.total,
		current: respJSON.current,
		has_more: respJSON.has_more,
	}
}