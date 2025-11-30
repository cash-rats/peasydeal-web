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

function PicsCarousel({ sharedImages, title = '' }: PicsCarouselProps) {
  return (
    <>
      {/* Mobile view slider */}
      <div className="">
        <div className="carousel-minimal" >
          <CarouselMinimal
            data={
              sharedImages.map((image: CarouselImage) => {
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
