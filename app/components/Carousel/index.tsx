import { useState } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import type { LinksFunction } from '@remix-run/node';

import slickStyles from "slick-carousel/slick/slick.css";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";

import styles from './styles/Carousel.css';
import ScrollButton, { links as ScrollButtonLinks } from './components/ScrollButton';

export const links: LinksFunction = () => {
	return [
		...ScrollButtonLinks(),
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
	const handleClickNext = () => console.log('next');


	const handleClickPrev = () => console.log('prev');


	const settings: Settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		dotsClass: "slick-dots slick-thumb",
		nextArrow: (
			<ScrollButton
				direction='right'
				onClick={handleClickNext}
			/>
		),
		prevArrow: (
			<ScrollButton
				direction='left'
				onClick={handleClickPrev}
			/>
		),

		customPaging(index) {
			return (
				<a>
					<img style={{ 'height': '100%' }} src={images[index]} />
				</a>
			);
		},
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
								<div className="carousel_desktop-preview-image-container" key={index} >
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
