import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import type { LinksFunction } from '@remix-run/node';
import clsx from 'clsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from '@mui/material/Skeleton';
import CarouselMinimal from './CarouselMinimal';

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
	title?: string;
};

/*
 * TODOs:
 * 	- [x] hover thumbnail display border.
 * 	- [x] clicks on thumbnail should display that image.
 *  - [ ] 當移動 slide 到 thumbnail 看不到的位置，要 scroll thumbnail bar.
 */
function PicsCarousel({ images, title = '' }: PicsCarouselProps) {
	const sliderRef = useRef<Slider | null>(null);
	const thumbnailRef = useRef<Slider | null>(null);
	const [activeSlide, setActiveSlide] = useState(0);
	const handleClickNext = () => console.log('next');
	const handleClickPrev = () => console.log('prev');

	const handleChooseSlide = (index: number, evt: MouseEvent<HTMLDivElement>) => {
		evt.preventDefault();
		if (!sliderRef.current) return;

		sliderRef.current.slickGoTo(index);
	}

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
            slideBackgroundColor="darkgrey"
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
