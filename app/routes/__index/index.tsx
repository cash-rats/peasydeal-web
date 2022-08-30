import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useFetcher, useTransition, useLoaderData } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import { ranges } from "~/styles/breakpoints";
import { OneMainTwoSubs, EvenRow } from "~/components/ProductRow";
//import type { Product } from "~/components/ProductRow";
import type { Product } from "~/shared/lib/types";

import { fetchProducts } from "./api";

// We need to resize container based on viewport.
const Container = styled.div`
	padding-top: 20px;
	width: 100%;
	display: flex;
	justify-content: center;

	& > div {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		justify: center;

		@media ${ranges.desktopUp} {
			width: 1100px;
		}

		@media ${ranges.normalScreen} {
			width: 992px;
		}
	}
`;

const ProductRow = styled.div`
	padding-top: 20px;
	width: 100%;
`

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
// TODO: add typescript.
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

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const perPage = url.searchParams.get('per_page') || '18';
	const page = url.searchParams.get('page') || '1';

	const resp  = await fetchProducts({
		perpage: +perPage,
		page: +page,
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
	const [pagination, setPagination] = useState({
		perPage: 9,
		page: 2,
	});

	const preloadProds = useLoaderData();

	const [productRows, addProductRows] = useState<Product[][]>(preloadProds.prod_rows);

	// Transition to observe when preload the first page of the product list render
	//const transition = useTransition();
	const fetcher = useFetcher();
	const handleSubmit = () => {
		fetcher.load(`__index?index`);
	};


	// Append products to local state when fetcher type is in `done` state.
	useEffect(() => {
		console.log('fetcher type', fetcher.type);
		if (fetcher.type === 'done') {
			console.log('debug ', fetcher.data);
		}
	}, [fetcher])

	return (
		<Container>
			<fetcher.Form>
				<div>
					{
						productRows.map((row: Product[]): ReactNode => {
							// A complete row has 9 products.
							// A incomplete row contains less than 9 products
							//
							// To render `OneMainTwoSubs` layout properly, we need to have at least 3 products
							// To render `EvenRow` layout properly we need to have at least 6 products
							//
							// If a given row has less than 9 products, that means we've reached the last page.
							// Moreover, we might not have enough products to render both layouts.
							// we'll need to decided if we have enough products to render `OneMainTwoSubs` and `EvenRow`
							if (row.length === 9) {
								// We can rest assure that we have enough products to render both `OneMainTwoSubs` and `EvenRow`
								const oneMainTwoSubsProdData = row.slice(0, 3)
								const EvenRowProdData = row.slice(3)

								return (
									<>
										<ProductRow>
											<OneMainTwoSubs products={oneMainTwoSubsProdData}/>
										</ProductRow>

										<ProductRow>
											<EvenRow products={EvenRowProdData} />
										</ProductRow>
									</>
								)
							} else {
								const oneMainTwoSubsProdData = row.slice(0, 3)

								if (oneMainTwoSubsProdData.length <= 3) {
									return (
										<ProductRow>
											<OneMainTwoSubs products={oneMainTwoSubsProdData}/>
										</ProductRow>
									);
								}

								const EvenRowProdData = row.slice(3)

								return (
									<>
										<ProductRow>
											<OneMainTwoSubs products={oneMainTwoSubsProdData}/>
										</ProductRow>

										<ProductRow>
											<EvenRow products={EvenRowProdData} />
										</ProductRow>
									</>
								);
							}
						})
					}

					<input
						type="hidden"
						name="per_page"
						value={pagination.perPage}
					/>

					<input
						type="hidden"
						name="page"
						value={pagination.page}
					/>

					<button onSubmit={handleSubmit}>
						aa~
					</button>
				</div>
			</fetcher.Form>
		</Container>
	);
}
