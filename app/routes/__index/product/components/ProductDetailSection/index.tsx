import type { LinksFunction } from '@remix-run/node';

import PicsCarousel, { links as PicsCarouselLinks } from '~/components/Carousel';

import styles from './styles/ProductDetailSection.css';

export const links: LinksFunction = () => {
	return [
		...PicsCarouselLinks(),
		{ rel: 'stylesheet', href: styles },
	];
}

interface ProductDetailSectionProps {
	description?: string;
	pics: string[],
	title?: string,
}

function ProductDetailSection({
	title = '',
	description = '',
	pics = [],
}: ProductDetailSectionProps) {
	// console.log('debug pics', pics);
	return (
		<div className="product-detail">
			{/* Image container */}
			<div className="product-detail-img-container">
				<PicsCarousel
					title={title}
					images={pics}
				/>
			</div>

			{/* product features. display > 768 */}
			<div className="product-features-large-screen">
				<h1>
					Details
				</h1>
				{/* TODO dangerous render html */}
				<div dangerouslySetInnerHTML={{ __html: description || '' }} />
			</div>
		</div>
	);
};

export default ProductDetailSection
