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

const transformData = (apiData: any[]): Product[] => {
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

	console.log('debug 1 ', endpoint);

	const resp = await fetch(endpoint);
	const respJSON = await resp.json();

	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;

		throw new Error(errResp.err_message);
	}

	const prods = transformData(respJSON.products);

	return prods;
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

export interface FetchProductsByCategoryV2Params {
	category?: number;
	perpage?: number;
	page?: number;
	random?: boolean;
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

	let endpoint = `${PEASY_DEAL_ENDPOINT}/v1/products?per_page=${perpage}&page=${page}&category=${category}&random=${random ? 'true' : 'false'}`;
	const resp = await fetch(endpoint);
	const respJSON = await resp.json();

	if (resp.status !== httpStatus.OK) {
		const errResp = respJSON as ApiErrorResponse;

		throw new Error(errResp.err_message);
	}

	const prods = transformData(respJSON.products);
	return prods;
}