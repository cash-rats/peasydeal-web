import { Outlet } from "@remix-run/react";

import Header from './components/Header';

export default function Index() {
  return (
		<>
			<Header />

			<main>
				<Outlet />
    	</main>
		</>
  );
}

