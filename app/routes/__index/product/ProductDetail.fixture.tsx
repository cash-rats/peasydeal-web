import { ChakraProvider } from "@chakra-ui/react";

import ProductDetailPage from "./$prodId";

export default () => (
	<ChakraProvider>
		<div style={{ padding: 10 }}>
			<ProductDetailPage src="https://images.wowcher.co.uk/images/deal/23155097/777x520/864807.jpg" />
		</div>
	</ChakraProvider>
)
