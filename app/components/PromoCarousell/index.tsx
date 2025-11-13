import type { LinksFunction } from 'react-router';
import { Link } from 'react-router';
import { useMemo, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Swipe from '~/lib/shims/react-easy-swipe';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

import styles from './styles/promoCarousell.css?url';
import shoes from './images/light-up-shoes.png';
import bubble from './images/bubble-slide.png';

type Campaign = {
  id: string;
  href: string;
  eventName: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  gradient: string;
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

const campaigns: Campaign[] = [
  {
    id: 'bubble-slides',
    href: '/product/massage-bubble-slides-slippers-i.7925634138350',
    eventName: 'bubble_slides_slippers',
    title: 'Bubble Slides Slippers',
    subtitle: 'Massage your feet for only £16.16',
    image: bubble,
    imageAlt: 'Bubble Slides Slippers',
    gradient: 'linear-gradient(28deg, #f2bd56 50%, #fec85e 50.1%)',
  },
  {
    id: 'light-up-shoes',
    href: '/product/led-light-up-trainers-i.7705390678254',
    eventName: 'light_up_shoes',
    title: 'Light Up Trainers Shoes',
    subtitle: 'Now £17.99',
    image: shoes,
    imageAlt: 'LED Light-Up Trainers',
    gradient: 'linear-gradient(28deg, #e6decf 50%, #e2d3b5 50.1%)',
  },
];

const PromoCarousell = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalImages = campaigns.length;

  const scrollToImage = (index: number) => {
    const target = cardRefs.current[index];
    if (!target) return;

    setCurrentImage(index);
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const nextImage = () => {
    if (currentImage >= totalImages - 1) {
      scrollToImage(0);
      return;
    }

    scrollToImage(currentImage + 1);
  };

  const previousImage = () => {
    if (currentImage === 0) {
      scrollToImage(totalImages - 1);
      return;
    }

    scrollToImage(currentImage - 1);
  };

  const sliderControl = (direction: 'left' | 'right') => (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      onClick={direction === 'left' ? previousImage : nextImage}
      className={cn(
        'absolute z-10 h-8 w-8 md:h-10 md:w-10 rounded-full bg-black text-white hover:bg-black/80 opacity-75',
        direction === 'left' ? 'left-0' : 'right-0'
      )}
      style={{ top: '40%' }}
    >
      {direction === 'left' ? <FiChevronLeft aria-hidden /> : <FiChevronRight aria-hidden />}
      <span className="sr-only">{direction === 'left' ? 'Previous slide' : 'Next slide'}</span>
    </Button>
  );

  const renderedSlides = useMemo(
    () =>
      campaigns.map(campaign => (
        <Link
          key={campaign.id}
          to={campaign.href}
          onClick={() =>
            window.rudderanalytics?.track('click_event_carousell', {
              event: campaign.eventName,
            })
          }
        >
          <div
            className="rounded-2xl h-[250px] flex justify-between self-center mx-2 gap-2 overflow-hidden"
            style={{ background: campaign.gradient }}
          >
            <div className="flex self-center flex-col flex-1 p-8">
              <h3 className="font-poppin font-medium text-xl md:text-2xl lg:text-3xl">
                {campaign.title}
              </h3>
              <h4 className="font-base text-xl md:text-2xl mt-2">{campaign.subtitle}</h4>
              <Button
                size="lg"
                variant="secondary"
                className="capitalize text-lg md:text-xl mt-3 md:mt-4 bg-white text-orange-800 hover:bg-orange-100 inline-flex w-[180px] md:w-[200px]"
              >
                Check now
              </Button>
            </div>
            <span className="flex-1 align-right self-center">
              <img
                alt={campaign.imageAlt}
                src={campaign.image}
                className="max-h-[250px] object-cover mx-auto w-full"
              />
            </span>
          </div>
        </Link>
      )),
    []
  );

  return (
    <div className="w-full flex justify-center">
      <div className="flex justify-center w-full items-center">
        <div className="relative w-full">
          <Swipe onSwipeRight={previousImage} onSwipeLeft={nextImage}>
            <div className="promo-carousel w-full">
              {sliderControl('left')}
              {campaigns.map((campaign, index) => (
                <div
                  className="w-full flex-shrink-0"
                  key={campaign.id}
                  ref={el => (cardRefs.current[index] = el)}
                >
                  {renderedSlides[index]}
                </div>
              ))}
              {sliderControl('right')}

              <div className="mt-2.5 absolute bottom-2.5 w-full text-center">
                {campaigns.map((campaign, index) => (
                  <span
                    key={campaign.id}
                    className="cursor-pointer h-2 w-2 mx-2 rounded-full inline-block transition-colors bg-white duration-200 ease-in-out hover:bg-gray-700"
                    style={{ opacity: index === currentImage ? '1' : '0.5' }}
                    onClick={() => scrollToImage(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        scrollToImage(index);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </Swipe>
        </div>
      </div>
    </div>
  );
};

export default PromoCarousell;
