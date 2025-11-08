import type { LinksFunction } from '@remix-run/node';

import PicsCarousel, { links as PicsCarouselLinks } from '~/components/Carousel';

import styles from './styles/ProductDetailSection.css?url';
import type { ProductImg, } from '../../types';

export const links: LinksFunction = () => {
	return [
		...PicsCarouselLinks(),
		{ rel: 'stylesheet', href: styles },
	];
}

interface ProductDetailSectionProps {
	title?: string;
	description?: string;

	// Image carousel will scroll to the variation image based on the
	// selected variation. Thus, we'll need to know corresponding variation UUID
	// to find the DOM to scroll to.
	selectedVariationUUID?: string;
	sharedPics: ProductImg[];
	variationPics: ProductImg[];
}

function ProductDetailSection({
	title = '',
	description = '',
	selectedVariationUUID = '',
	sharedPics = [],
	variationPics = [],
}: ProductDetailSectionProps) {
	return (
		<div className="product-detail mb-4">
			{/* Image container */}
			<div className="product-detail-img-container">
				<PicsCarousel
					title={title}
					sharedImages={sharedPics}
					variationImages={variationPics}
					selectedVariationUUID={selectedVariationUUID}
				/>
			</div>

			<div className="mt-10 mx-0 md:mx-2 flex flex-col w-full">
				<div className='hidden md:flex md:flex-col mr-4'>
					<h3 className='text-3xl mb-4 md:mb-6'>About this product</h3>
					{/* TODO dangerous render html */}
					<div className='pd-product-detail'>
						<div dangerouslySetInnerHTML={{ __html: description || '' }} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetailSection
