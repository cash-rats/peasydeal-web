import type { LinksFunction } from '@remix-run/node';
import CarouselMinimal from './CarouselMinimal';

import styles from './styles/Carousel.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
}

interface PicsCarouselProps {
	images: string[];
	title?: string;
};

/*
 * TODOs:
 * 	- [x] hover thumbnail display border.
 * 	- [x] clicks on thumbnail should display that image.
 *  - [ ] 當移動 slide 到 thumbnail 看不到的位置，要 scroll thumbnail bar.
 */
function PicsCarousel({ images, title = '' }: PicsCarouselProps) {
	return (
		<>
			{/* Mobile view slider */}
			<div className="">
				<div className="carousel-minimal" >
					<CarouselMinimal
						data={images.map((image: string) => ({
							title: `${title}-${image}`,
							image,
						}))}
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
