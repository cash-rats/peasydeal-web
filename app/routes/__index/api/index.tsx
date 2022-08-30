interface fetchProductsParams {
	category?: string;
	perpage?: number;
	page: number;
}

const fetchProducts = ({
	category,
	perpage,
	page
}: fetchProductsParams): Promise<Response> => {
	if (!category) category = 'hotdeal';
	if (!perpage) perpage = 9;
	if (!page) page = 0;

	const { MYFB_ENDPOINT } = process.env;

	return fetch(`${MYFB_ENDPOINT}/data-server/ec/products?cat=${category}&perPage=${perpage}&pageNo=${page}`);
}

export { fetchProducts };
