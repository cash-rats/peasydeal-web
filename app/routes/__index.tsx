import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { StatusCodes } from 'http-status-codes';

import Header, { links as HeaderLinks } from "~/components/Header";
import styles from "./styles/index.css";

export const links: LinksFunction = () => {
	return [
		...HeaderLinks(),
		{ rel: 'stylesheet', href: styles }
	];
};

export const loader: LoaderFunction = async () => {
	const { MYFB_ENDPOINT } = process.env;
	const resp = await fetch(`${MYFB_ENDPOINT}/data-server/ec/cat`)
	const respJSON = await resp.json();

	return json(respJSON, {
		status: StatusCodes.OK,
	});
};

export default function Index() {
	const categories = useLoaderData();
  return (
		<>
			<Header categories={categories.cats} />

			<main className="main-container">
				<Outlet />
    	</main>
		</>
  );
}

