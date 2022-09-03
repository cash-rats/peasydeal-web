import { ReactElement } from 'react';
import styled from 'styled-components';

import { ChakraProvider } from "@chakra-ui/react";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

interface FixtureChildren {
	children: ReactElement;
}

export default ({ children }: FixtureChildren) => (
	<ChakraProvider>
		<Container>
			{children}
		</Container>
	</ChakraProvider>
);
