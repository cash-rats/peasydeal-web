import {
	useState,
	useEffect,
	Fragment,
	useRef,
} from "react";
import type { ReactNode } from "react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction, LinksFunction, ActionFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import { OneMainTwoSubs, EvenRow } from "~/components/ProductRow";
import { links as OneMainTwoSubsLinks } from "~/components/ProductRow/OneMainTwoSubs";
import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import Spinner from "~/components/Spinner";

import type { Product } from "~/shared/lib/types";

import { fetchProducts } from "./api";
import styles from "./styles/ProductList.css";

export const links: LinksFunction = () => {
	return [
		...LoadmoreLinks(),
		...OneMainTwoSubsLinks(),
		{ rel: 'stylesheet', href: styles },
	]
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

// To render grid layout properly:
//  - 1 ~ 3 prods in layout 1
//  - 4 ~ 9 prods in layout 2,
//  we need to organize list of products in a format of 2 dimensional array:
//
//  [
//		[{}, {} ..., {}] <--- 9 prods each row.
//		[{}, {} ..., {}]
//  ]
//
// So that frontend only needs to consider 9 products for each iteration.
const organizeTo9ProdsPerRow = (prods: Product[]): Product[][] => {
	const rows = [];
	let row = []

	for (let i = 0; i < prods.length; i++) {
		row.push(prods[i])
		if ((row.length % 9) === 0) {
			rows.push(row);
			row = [];
		}
	}

	return rows;
}

const LIMIT = 18;

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const perPage = Number(url.searchParams.get('per_page') || LIMIT);
	const page = Number(url.searchParams.get('page') || '1');

	const resp  = await fetchProducts({
		perpage: perPage,
		page,
	})

	const respJSON = await resp.json();

	// Transform data to frontend compatible format.
	const transformedProds = transformData(respJSON.products)
	const prodRows = organizeTo9ProdsPerRow(transformedProds)

	return json({
		...respJSON,
		prod_rows: prodRows,
	}, { status: StatusCodes.OK });
};

export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
  const productID = body.get("product_id");
	console.log('productID', productID);

	return redirect(`/product/${productID}`);
};


/*
 * Product list page.
 *
 * - [ ] 根據 row index 的不同，顯示的 grid layout 會不一樣
 *    - 每 3 個 row OneMainTwoSubs 就會 reverse 一次
 *    - 頭一個 row 是 OneMainTwoSubs Layout
 *
 * - [ ] Fetch products from remote API when initial rendered.
 * - [ ] Fetch more.
 */
export default function Index() {
	const preloadProds = useLoaderData();
	const [productRows, addProductRows] = useState<Product[][]>(preloadProds.prod_rows);
	const currPage = useRef(1);

	// Transition to observe when preload the first page of the product list render
	const fetcher = useFetcher();
	const handleLoadMore = () => {
		currPage.current += 1;
		fetcher.load(`/?index&page=${currPage.current}&per_page=${LIMIT}`);
	};


	// Append products to local state when fetcher type is in `done` state.
	useEffect(() => {
		if (fetcher.type === 'done') {
			// Current page fetched successfully, increase page number getting ready to fetch next page.
			const productRows = fetcher.data.prod_rows;
			addProductRows(prev => prev.concat(productRows))
		}
	}, [fetcher])

	// Submit to action to redirect to product detail page.
	const submit = useSubmit();

	// Redirect to product detail page when click on product.
	const handleClickProduct = (productID: string) => {
		submit({ product_id: productID }, { method: 'post', action: '/?index' });
	};


	return (
		<div className="prod-list-container">
			{
				productRows.map((row: Product[], index: number): ReactNode => {
					// A complete row has 9 products.
					// A incomplete row contains less than 9 products
					//
					// To render `OneMainTwoSubs` layout properly, we need to have at least 3 products
					// To render `EvenRow` layout properly we need to have at least 6 products
					//
					// If a given row has less than 9 products, that means we've reached the last page.
					// Moreover, we might not have enough products to render both layouts.
					// we'll need to decided if we have enough products to render `OneMainTwoSubs` and `EvenRow`
					const shouldReverese = index % 2 !== 0;

					if (row.length === 9) {
						// We can rest assure that we have enough products to render both `OneMainTwoSubs` and `EvenRow`
						const oneMainTwoSubsProdData = row.slice(0, 3)
						const EvenRowProdData = row.slice(3)

						return (
							<Fragment key={index}>
								<div className="product-row">
									<OneMainTwoSubs
										reverse={shouldReverese}
										products={oneMainTwoSubsProdData}
										onClickProduct={handleClickProduct}
									/>
								</div>

								<div className="product-row">
									<EvenRow products={EvenRowProdData} />
								</div>
							</Fragment>
						)
					} else {
						const oneMainTwoSubsProdData = row.slice(0, 3)

						if (oneMainTwoSubsProdData.length <= 3) {
							return (
								<div key={index} className="product-row">
									<OneMainTwoSubs reverse={shouldReverese} products={oneMainTwoSubsProdData}/>
								</div>
							);
						}

						const EvenRowProdData = row.slice(3)

						return (
							<Fragment key={index}>
								<div className="product-row">
									<OneMainTwoSubs reverse={shouldReverese} products={oneMainTwoSubsProdData}/>
								</div>

								<div className="product-row">
									<EvenRow products={EvenRowProdData} />
								</div>
							</Fragment>
						);
					}
				})
			}

			<fetcher.Form>
				<input
					type="hidden"
					name="page"
					value={currPage.current}
				/>

				<LoadMore
					spinner={Spinner}
					loading={fetcher.state !== 'idle'}
					callback={handleLoadMore}
					delay={100}
					offset={150}
				/>
			</fetcher.Form>
		</div>
	);
}
