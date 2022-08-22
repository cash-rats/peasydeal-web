import styled from 'styled-components';

import { ChakraProvider } from "@chakra-ui/react";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

export default ({ children }) => (
	<ChakraProvider>
		<Container>
			{children}
		</Container>
	</ChakraProvider>
);
