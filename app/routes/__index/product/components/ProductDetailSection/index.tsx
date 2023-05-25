import type { LinksFunction } from '@remix-run/node';

import PicsCarousel, { links as PicsCarouselLinks } from '~/components/Carousel';

import styles from './styles/ProductDetailSection.css';
import type { ProductImg } from '../../types';

export const links: LinksFunction = () => {
	return [
		...PicsCarouselLinks(),
		{ rel: 'stylesheet', href: styles },
	];
}

interface ProductDetailSectionProps {
	description?: string;
	sharedPics: ProductImg[];
	variationPics: ProductImg[];
	title?: string;
}

function ProductDetailSection({
	title = '',
	description = '',
	sharedPics = [],
	variationPics = [],
}: ProductDetailSectionProps) {
	console.log('debug 1', sharedPics);
	console.log('debug 2', variationPics);
	return (
		<div className="product-detail mb-4">
			{/* Image container */}
			<div className="product-detail-img-container">
				<PicsCarousel
					title={title}
					sharedImages={sharedPics}
					variationImages={variationPics}
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
