import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import type { LinksFunction } from '@remix-run/node';

import slickStyles from "slick-carousel/slick/slick.css";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";

import styles from './styles/Carousel.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
		{ rel: 'stylesheet', href: slickStyles },
		{ rel: 'stylesheet', href: slickThemeStyles },
	];
}

interface PicsCarouselProps {
	images: string[];
};

/*
 * - [x] hover thumbnail display border.
 * - [x] clicks on thumbnail should display that image.
 */
function PicsCarousel({ images }: PicsCarouselProps) {
	const settings: Settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		dotsClass: "slick-dots slick-thumb",
		customPaging(index) {
			return (
				<a>
					<img style={{ 'height': '100%' }} src={images[index]} />
				</a>
			);
		}
	}

	return (
		<>
			<div className="product-carousel-container">
				<Slider {...settings}>
					{
						images.map((image, index) => {
							return (
								<div key={index}>
									<img alt='product' className="product-carousel-image" src={image} />
								</div>
							)
						})
					}
				</Slider>
			</div>

			<div className="thumbnails-hover-images-container">
				<Slider {...settings}>
					{
						images.map((image, index) => {
							return (
								<div key={index} >
									<img alt='product' className="preview-image" src={image} />
								</div>
							)
						})
					}
				</Slider>
			</div>
		</>
	);
};

export default PicsCarousel;
