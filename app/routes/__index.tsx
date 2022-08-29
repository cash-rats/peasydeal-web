import styled from "styled-components";
import { Outlet } from "@remix-run/react";

import Header from '~/components/Header';

const Main = styled.main`
	background-color: #EFEFEF;
	height: 100vh;
`;

export default function Index() {
  return (
		<>
			<Header />

			<Main>
				<Outlet />
    	</Main>
		</>
  );
}

