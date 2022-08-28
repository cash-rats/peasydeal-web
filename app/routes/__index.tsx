import styled from "styled-components";
import { Outlet } from "@remix-run/react";

import Header from '~/components/Header';

const Main = styled.main`
	background-color: #EFEFEF;
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

