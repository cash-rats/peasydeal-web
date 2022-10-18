import httpStatus from 'http-status-codes';

import type { Product, ApiErrorResponse } from '~/shared/types';
import { getMYFBEndpoint } from '~/utils/endpoints';

export interface FetchProductsParams {
	categoryID?: number;
	perpage?: number;
	page?: number;
}

export const fetchProducts = ({
	categoryID,
	perpage,
	page
}: FetchProductsParams): Promise<Response> => {
	if (!categoryID) categoryID = 1;
	if (!perpage) perpage = 9;
	if (!page) page = 0;

	const { MYFB_ENDPOINT } = process.env;
	return fetch(`${MYFB_ENDPOINT}/data-server/ec/products?catId=${categoryID}&pageSize=${perpage}&pageNo=${page}`);
}

export interface FetchProductsByCategoryParams {
	category?: string;
	perpage?: number;
	page?: number;
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
			productID: data.productId,
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
	category,
	perpage,
	page
}: FetchProductsByCategoryParams): Promise<Product[]> => {
	if (!perpage) perpage = 9;
	if (!page) page = 0;

	let endpoint = `${getMYFBEndpoint()}/data-server/ec/products?pageSize=${perpage}&pageNo=${page}`;

	if (category) {
		endpoint = `${endpoint}&cat=${category}`;
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
