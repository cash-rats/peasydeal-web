interface fetchProductsParams {
	categoryID?: number;
	perpage?: number;
	page: number;
}

const fetchProducts = ({
	categoryID,
	perpage,
	page
}: fetchProductsParams): Promise<Response> => {
	if (!categoryID) categoryID = 1;
	if (!perpage) perpage = 9;
	if (!page) page = 0;

	const { MYFB_ENDPOINT } = process.env;

	return fetch(`${MYFB_ENDPOINT}/data-server/ec/products?catId=${categoryID}&perPage=${perpage}&pageNo=${page}`);
}

export { fetchProducts };
