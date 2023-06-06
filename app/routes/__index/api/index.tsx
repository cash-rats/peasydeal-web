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
		throw new Error(errResp.err_msg);
	}

	return respJSON as ActivityBanner[];
}

/**
 * When a product is not assigned main image, we'll pick a main
 * image from shared images or, from variation images.
 */
const pickMainImage = (sharedImgs: string[], variationImgs: string[]) => {
	if (sharedImgs.length === 0 && variationImgs.length === 0) {
		return ''
	}

	if (sharedImgs.length > 0) {
		return sharedImgs[0]
	}

	return variationImgs[0];
};

const normalizeV2Data = (apiData: any[]): Product[] => {
	const transformed: Product[] = apiData.map((data: any): Product => {
		return {
			currency: data.currency,
			description: '',
			discount: data.discount,
			main_pic: data.main_pic_url || pickMainImage(
				data.shared_images,
				data.variation_images,
			),
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

export const fetchLandingPageFeatureProducts = async ({ categoriesPreviewNames = [], }: IFetchLandingPageFeatureProductsParams) => {
	const url = new URL(PEASY_DEAL_ENDPOINT)

	url.pathname = '/v1/products/landing-page';
	url.searchParams.append('cat_preview_names', categoriesPreviewNames.join(','));

	const resp = await fetch(url.toString());
	const respJSON = await resp.json();

	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;
		throw new Error(errResp.err_msg);
	}

	const categoryPreviews = respJSON.category_previews
		? respJSON.category_previews.map((categoryPreview: any) => {
			return {
				...categoryPreview,
				items: normalizeV2Data(categoryPreview.items),
			}
		}) : [];

	const promotionPreviews = respJSON.promotion_previews
		? respJSON.promotion_previews.map((promotionPreview: any) => {
			return {
				...promotionPreview,
				items: normalizeV2Data(promotionPreview.items),
			}
		}) : [];

	return {
		categoryPreviews,
		promotionPreviews,
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
		return {
			items: [],
			total: 0,
			current: 0,
			hasMore: false,
		};
	}

	return {
		items: normalizeV2Data(respJSON.items),
		total: respJSON.total,
		current: respJSON.current,
		hasMore: respJSON.has_more,
	}
}
