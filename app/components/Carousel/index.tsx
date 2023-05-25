import type { LinksFunction } from '@remix-run/node';

import CarouselMinimal from './CarouselMinimal';
import styles from './styles/Carousel.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
}

interface CarouselImage {
	id: number;
	url: string;
};

interface PicsCarouselProps {
	sharedImages: CarouselImage[];
	variationImages: CarouselImage[];
	title?: string;
};

/*
 * TODOs:
 * 	- [x] hover thumbnail display border.
 * 	- [x] clicks on thumbnail should display that image.
 *  - [x] display variation_images before shared_images.
 *  - [ ] 當移動 slide 到 thumbnail 看不到的位置，要 scroll thumbnail bar.
 */
function PicsCarousel({
	sharedImages,
	variationImages,
	title = ''
}: PicsCarouselProps) {
	const images = variationImages.concat(sharedImages);

	console.log('debug 4', images);
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
					/>
				</div>
			</div>
		</>
	);
};

export default PicsCarousel;
