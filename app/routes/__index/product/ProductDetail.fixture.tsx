import { ChakraProvider } from "@chakra-ui/react";

import ProductDetailPage from "./$prodId";

export default () => (
	<ChakraProvider>
		<div style={{ padding: 10 }}>
			<ProductDetailPage />
		</div>
	</ChakraProvider>
)
