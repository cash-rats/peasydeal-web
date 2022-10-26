import httpStatus from 'http-status-codes';

import type { Product, ApiErrorResponse } from '~/shared/types';
import { getMYFBEndpoint } from '~/utils/endpoints';
export interface FetchProductsByCategoryParams {
	category?: string;
	perpage?: number;
	page?: number;
	title?: string;
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
		};
	})

	return transformed;
}
// https://api.myfbmanage.com:8443/data-server/ec/products?pageSize=10&pageNo=0&cat=home
export const fetchProductsByCategory = async ({
	title,
	category,
	perpage,
	page
}: FetchProductsByCategoryParams): Promise<Product[]> => {
	if (!perpage) perpage = 9;
	if (!page) page = 0;

	let endpoint = `${getMYFBEndpoint()}/data-server/ec/products?pageSize=${perpage}&pageNo=${page}`;

	if (category) {
		endpoint = `${endpoint}&cat=${encodeURI(category)}`;
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

	const prods = transformData(respJSON.products);

	return prods;
}
