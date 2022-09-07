export const fetchCategories = async () => {
	const { MYFB_ENDPOINT } = process.env;
	const resp = await fetch(`${MYFB_ENDPOINT}/data-server/ec/cat`)
	return await resp.json();
}
