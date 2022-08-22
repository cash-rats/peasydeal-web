import { ChakraProvider } from "@chakra-ui/react";

export default ({ children }) => (
	<ChakraProvider>
		{children}
	</ChakraProvider>
);
