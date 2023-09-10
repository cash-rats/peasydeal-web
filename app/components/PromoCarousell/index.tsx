import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { Button } from '@chakra-ui/react';
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

import React from "react";
import Swipe from "react-easy-swipe";
import styles from './styles/PromoCarousell.css';
import shoes from './images/light-up-shoes.png';
import bubble from './images/bubble-slide.png';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ]
}

const campaigns = [1, 2];

const getEvent = (index: number) => {
  const campaign = [
    // (
    //   <Link
    //     key={`campaign_card_${index}`}
    //     to='/events/win-a-free-surprise-gift'
    //     onClick={() => {
    //       window.rudderanalytics?.track('click_event_carousell', {
    //         event: 'win_a_free_surprise_gift',
    //       });
    //     }}
    //   >
    //     <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white h-[200px] flex justify-between p-4 self-center mx-2 gap-2">
    //       <div className="flex self-center flex-col flex-1">
    //         <h3 className="font-poppin font-medium  text-xl md:text-2xl lg:text-3xl">Win a surprise gift for your next purchase</h3>
    //         <Button
    //           colorScheme='whiteAlpha'
    //           size="lg"
    //           variant='solid'
    //           className='capitalize text-lg md:text-xl mt-3 md:mt-4 bg-white text-orange-800 inline-flex w-[180px] md:w-[200px]'
    //         >
    //           I want free gifts
    //         </Button>
    //       </div>
    //       <span className="flex-1 overflow-hidden">
    //         <div
    //           className='animate-scrollgrid'
    //           style={{
    //             height: "200px",
    //             marginTop: "-12px",
    //             backgroundSize: "1600px",
    //             backgroundRepeat: "repeat-x",
    //             backgroundPosition: "center",
    //             width: "1775px",
    //             backgroundImage: `url(${bg})`,
    //           }} />
    //       </span>
    //     </div>
    //   </Link>
    // ),

    (
      <Link
        key={`campaign_card_${index}`}
        to='/product/massage-bubble-slides-slippers-i.7925634138350'
        onClick={() => {
          window.rudderanalytics?.track('click_event_carousell', {
            event: 'bubble_slides_slippers',
          });
        }}
      >
        <div className='rounded-2xl bg-[#e6decf] h-[250px] flex justify-between self-center mx-2 gap-2 overflow-hidden' style={{
          background: 'linear-gradient(28deg, #f2bd56 50%, #fec85e 50.1%)'
        }}>
          <div className="flex self-center flex-col flex-1 p-8">
            <h3 className="font-poppin font-medium text-xl md:text-2xl lg:text-3xl">Bubble Slides Slippers</h3>
            <h4 className="font-base text-xl md:text-2xl mt-2">Message your feet for only £16.16</h4>
            <Button
              colorScheme='whiteAlpha'
              size="lg"
              variant='solid'
              className='capitalize text-lg md:text-xl mt-3 md:mt-4 bg-white text-orange-800 inline-flex w-[180px] md:w-[200px]'
            >
              Check now
            </Button>
          </div>
          <span className="flex-1 align-right self-center">
            <img alt='Bubble Slides Slippers' src={bubble} className='max-h-[250px] object-cover mx-auto' />
          </span>
        </div>
      </Link>
    ),

    (
      <Link
        key={`campaign_card_${index}`}
        to='/product/led-light-up-trainers-i.7705390678254'
        onClick={() => {
          window.rudderanalytics?.track('click_event_carousell', {
            event: 'light_up_shoes',
          });
        }}
      >
        <div className='rounded-2xl bg-[#e6decf] h-[250px] flex justify-between self-center mx-2 gap-2 overflow-hidden' style={{
          background: 'linear-gradient(28deg, #e6decf 50%, #e2d3b5 50.1%)'
        }}>
          <div className="flex self-center flex-col flex-1 p-8">
            <h3 className="font-poppin font-medium text-xl md:text-2xl lg:text-3xl">Light Up Trainers Shoes</h3>
            <h4 className="font-base text-xl md:text-2xl mt-2">Now £17.99</h4>
            <Button
              colorScheme='whiteAlpha'
              size="lg"
              variant='solid'
              className='capitalize text-lg md:text-xl mt-3 md:mt-4 bg-white text-orange-800 inline-flex w-[180px] md:w-[200px]'
            >
              Check now
            </Button>
          </div>
          <span className="flex-1 align-right self-center">
            <img alt='LED Light-Up Trainers' src={shoes} className='max-h-[100%] w-[100%] object-cover mx-auto' />
          </span>
        </div>
      </Link>
    )
  ]

  return index <= campaign.length ? campaign[index] : null;
}

const PromoCarousell = () => {
  // We will start by storing the index of the current image in the state.
  const [currentImage, setCurrentImage] = React.useState(0);

  // We are using react ref to 'tag' each of the images. Below will create an array of
  // objects with numbered keys. We will use those numbers (i) later to access a ref of a
  // specific image in this array.
  const refs = campaigns.reduce((acc, val, i) => {
    acc[i] = React.createRef();
    return acc;
  }, {});

  const scrollToImage = (i) => {
    // First let's set the index of the image we want to see next
    setCurrentImage(i);
    // Now, this is where the magic happens. We 'tagged' each one of the images with a ref,
    // we can then use built-in scrollIntoView API to do eaxactly what it says on the box - scroll it into
    // your current view! To do so we pass an index of the image, which is then use to identify our current
    // image's ref in 'refs' array above.
    refs[i].current.scrollIntoView({
      //     Defines the transition animation.
      behavior: "smooth",
      //      Defines vertical alignment.
      block: "nearest",
      //      Defines horizontal alignment.
      inline: "start",
    });
  };

  // Some validation for checking the array length could be added if needed
  const totalImages = campaigns.length;

  // Below functions will assure that after last image we'll scroll back to the start,
  // or another way round - first to last in previousImage method.
  const nextImage = () => {
    if (currentImage >= totalImages - 1) {
      scrollToImage(0);
    } else {
      scrollToImage(currentImage + 1);
    }
  };

  const previousImage = () => {
    if (currentImage === 0) {
      scrollToImage(totalImages - 1);
    } else {
      scrollToImage(currentImage - 1);
    }
  };

  // Tailwind styles. Most importantly notice position absolute, this will sit relative to the carousel's outer div.
  const arrowStyle =
    "absolute text-white text-2xl z-10 bg-black h-8 w-8 md:h-10 md:w-10 rounded-full opacity-75 flex items-center justify-center";

  // Let's create dynamic buttons. It can be either left or right. Using
  // isLeft boolean we can determine which side we'll be rendering our button
  // as well as change its position and content.
  const sliderControl = (isLeft?: boolean) => (
    <button
      type="button"
      onClick={isLeft ? previousImage : nextImage}
      className={`${arrowStyle} ${isLeft ? "left-0" : "right-0"}`}
      style={{ top: "40%" }}
    >
      <span role="img" aria-label={`Arrow ${isLeft ? "left" : "right"}`}>
        {isLeft ? <FiChevronLeft /> : <FiChevronRight />}
      </span>
    </button>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="flex justify-center w-full items-center">
        <div className="relative w-full">
          <Swipe
            onSwipeRight={() => {
              previousImage();
            }}
            onSwipeLeft={() => {
              nextImage();
            }}
          >
            <div className="promo-carousel w-full">
              {sliderControl(true)}
              {campaigns.map((campaign, i) => (
                <div className="w-full flex-shrink-0" key={`campaign_${campaign}`} ref={refs[i]}>
                  {
                    getEvent(i)
                  }
                </div>
              ))}
              {sliderControl()}

              <div className="mt-2.5 absolute bottom-2.5 w-full text-center">
                {campaigns.map((item: any, index: number) => {
                  return (
                    <span
                      className="cursor-pointer h-2 w-2 mx-2 rounded-full inline-block transition-colors bg-white duration-200 ease-in-out hover:bg-gray-700"
                      key={index}
                      style={{
                        opacity:
                          index === currentImage ? "1" : "0.5",
                      }}
                      onClick={(e) => {
                        scrollToImage(index);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </Swipe>
        </div>
      </div>
    </div>
  );
};

export default PromoCarousell;