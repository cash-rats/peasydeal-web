import { forwardRef } from 'react';
import { Button } from '@chakra-ui/react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/ProductActionBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ProductActionBarProps {
  onClickAddToCart: () => void;
  onClickBuyNow: () => void;
  loading?: boolean;
};

const ProductActionBar = forwardRef(({
  onClickAddToCart,
  onClickBuyNow,
  loading = false,
}: ProductActionBarProps, ref) => (
  <div
    ref={ref}
    className="client-action-bar"
  >
    <div>
      <Button
        onClick={onClickAddToCart}
        width={{ base: '100%' }}
        colorScheme='green'
        isLoading={loading}
      >
        Add To Cart
      </Button>
    </div>

    <div>
      <Button
        width={{ base: '100%' }}
        colorScheme='orange'
        onClick={onClickBuyNow}
      >
        Buy Now
      </Button>
    </div>
  </div>
));

export default ProductActionBar;


// () {
//   return (
//     <div>
// 						<div
// 							ref={mobileUserActionBarRef}
// 							className="client-action-bar"
// 						>
// 							<div>
// 								<Button
// 									onClick={handleAddToCart}
// 									width={{ base: '100%' }}
// 									colorScheme='green'
// 									isLoading={addToCart.state !== 'idle'}
// 								>
// 									Add To Cart
// 								</Button>
// 							</div>

// 							<div>
// 								<Button
// 									width={{ base: '100%' }}
// 									colorScheme='orange'
// 								>
// 									Buy Now
// 								</Button>
// 							</div>
// 						</div>
//     </div>
//   )
// }

