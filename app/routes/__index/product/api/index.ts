export const fetchProductDetail = (prodId: string) => {
	const { MYFB_ENDPOINT } = process.env;
  return fetch(`${MYFB_ENDPOINT}/data-server/ec/product?id=${prodId}`)
}
