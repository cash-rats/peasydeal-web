import styled from 'styled-components';
import { ReactElement } from 'react';

import { ChakraProvider } from "@chakra-ui/react";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px 10px 0;
`

type Content = {
	children: ReactElement;
}

export default ({ children }: Content) => (
	<ChakraProvider>
		<Container>
			{children}
		</Container>
	</ChakraProvider>
);
