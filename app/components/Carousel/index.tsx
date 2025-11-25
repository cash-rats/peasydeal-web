import type { LinksFunction } from 'react-router';

import type { CarouselImage } from './types';
import CarouselMinimal from './CarouselMinimal';
import styles from './styles/Carousel.css?url';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
}

interface PicsCarouselProps {
	sharedImages: CarouselImage[];
	variationImages: CarouselImage[];
	selectedVariationUUID?: string;
	title?: string;
};

/*
 * TODOs:
 * 	- [x] hover thumbnail display border.
 * 	- [x] clicks on thumbnail should display that image.
 *  - [x] display variation_images before shared_images.
 */
function PicsCarousel({
	sharedImages,
	variationImages,
	selectedVariationUUID = '',
	title = ''
}: PicsCarouselProps) {
	const images = variationImages.concat(sharedImages);

	return (
		<>
			{/* Mobile view slider */}
			<div className="">
				<div className="carousel-minimal" >
					<CarouselMinimal
						data={
							images.map((image: CarouselImage) => {
								return {
									title: `${title}-${image.url}`,
									...image,
								}
							})
						}
						time={2000}
						width="850px"
						height="500px"
						radius="10px"
						automatic={false}
						dots={true}
						pauseIconColor="white"
						pauseIconSize="40px"
						slideBackgroundColor="white"
						slideImageFit="cover"
						thumbnails={true}
						thumbnailWidth="100px"
						style={{
							textAlign: "center",
						}}
						selectedVariationUUID={selectedVariationUUID}
					/>
				</div>
			</div>
		</>
	);
};

export default PicsCarousel;
