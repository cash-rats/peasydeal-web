import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import type { LinksFunction } from '@remix-run/node';
import clsx from 'clsx';

import slickStyles from "slick-carousel/slick/slick.css";
import slickThemeStyles from "slick-carousel/slick/slick-theme.css";

import styles from './styles/Carousel.css';
import ScrollButton, { links as ScrollButtonLinks } from '../ScrollButton';

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
 * TODOs:
 * 	- [x] hover thumbnail display border.
 * 	- [x] clicks on thumbnail should display that image.
 *  - [ ] 當移動 slide 到 thumbnail 看不到的位置，要 scroll thumbnail bar.
 */
function PicsCarousel({ images }: PicsCarouselProps) {
	const sliderRef = useRef<Slider>();
	const [activeSlide, setActiveSlide] = useState(0);

	const handleClickNext = () => console.log('next');
	const handleClickPrev = () => console.log('prev');

	const handleChooseSlide = (index: number, evt: MouseEvent<HTMLAnchorElement>) => {
		evt.preventDefault();
		if (!sliderRef.current) return;

		sliderRef.current.slickGoTo(index);
	}

	const settings: Settings = {
		dots: false,
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
		beforeChange(_, nextSlide: number) {
			setActiveSlide(nextSlide);
		}
	}

	return (
		<>
			{/* Mobile view slider */}
			<div className="product-carousel-container">
				<Slider ref={sliderRef} {...settings}>
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

				<div className="ProductDetailSection__carousel-thumbnails">
					{
						images.map((image, index) => {
							return (
								<div
									className={
										clsx("ProductDetailSection__carousel-thumbnail-container", {
											'active-thumbnail': index === activeSlide
										})
									}
									key={index}
									onClick={(evt) => {
										evt.preventDefault();
										handleChooseSlide(index, evt)
									}}
								>
									<img
										alt='product thumbnail'
										className="carousel__thumbnail"
										src={image}
									/>
								</div>
							)
						})
					}
				</div>
			</div>
		</>
	);
};

export default PicsCarousel;
