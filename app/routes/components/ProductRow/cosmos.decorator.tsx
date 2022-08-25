import styled from 'styled-components';

import { ChakraProvider } from "@chakra-ui/react";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px 10px 0;
`

export default ({ children }) => (
	<ChakraProvider>
		<Container>
			{children}
		</Container>
	</ChakraProvider>
);
