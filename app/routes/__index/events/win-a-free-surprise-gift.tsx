import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useCallback, useRef, useState } from "react";
import CountDown, { links as CountDownLinks } from "./components/countdown/CountDown";
import { trackWindowScroll, LazyLoadComponent } from "react-lazy-load-image-component";
import type { ScrollPosition } from 'react-lazy-load-image-component';
import Image, { MimeType } from "remix-image"
import {
  Link,
} from '@remix-run/react';
import {
  ListItem,
  OrderedList,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react'
import useSticky from "../hooks/useSticky";
import { useScrollSpy } from '../hooks/useScrollSpy';

import iconFree from './images/icon-free.png';
import iconGift from './images/icon-gift.png';
import iconTier from './images/icon-tier.png';
import iconTime from './images/icon-time.png';

import styles from './styles/events.css';

import cardBG from './images/card-bg.jpg';
import prizes from '~/data/2023-may-event-items.json';

export const links: LinksFunction = () => {
  return [
    ...CountDownLinks(),
    { rel: 'stylesheet', href: styles }
  ];
};

export const meta: MetaFunction = ({ data, params }) => {
  return {
    title: "Win a Free Surprise Gift on every purchase above £20",
    description: "Shop with us and get surprised with amazing gifts! Our tier-based surprise gift event is here and it's waiting for you! The more you spend, the better your gift! Don't Miss Out on Our PeasyDeal Surprise Gift Event",
  }
};

const ItemCard = ({ item, scrollPosition }) => {
  const [loaded, setLoaded] = useState<Boolean>(false);
  const { price, name, link, image } = item;

  return (
    <Link to={`${link}`}>
      <div className='flex flex-col justify-center max-w-[250px]'>
        <div
          className='rounded-xl flex flex-col justify-center items-center p-1 md:p-2'
          style={{
            background: `url(${cardBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <p className='text-[#92CEFB] text-xl font-black font-poppins py-0 md:py-2 mx-auto'>FREE</p>
          <div className={`rounded-xl bg-white ${loaded ? 'h-full' : 'h-[183px] md:h-[253px]'}`} >
            <LazyLoadComponent
              threshold={500}
              scrollPosition={scrollPosition}
            >
              <Image
                blurDataURL={`${loaded
                  ? `/images/placeholder_transparent.png`
                  : `/images/placeholder.jpg`
                }`}
                placeholder={loaded ? 'empty' : 'blur'}
                placeholderAspectRatio={1}
                onLoadingComplete={(naturalDimensions) => {
                  setLoaded(true);
                }}
                options={{
                  contentType: MimeType.WEBP,
                  fit: 'contain',
                }}
                className="
                aspect-square
                min-w-0 min-h-0
                rounded-xl
              "
                loaderUrl='/remix-image'
                src={image}
                responsive={[
                  {
                    size: {
                      width: 274,
                      height: 274,
                    },
                  },
                ]}
              />
            </LazyLoadComponent>
          </div>
        </div>
        <div className='flex ml-2 mt-2 mr-auto md:mx-auto'>
          <span
            className='flex relative mr-2 font-medium'
          >
            <span className="text-base md:text-xl lg:text-2xl">
              £{price}
            </span>
            <span className='block w-full h-[1px] md:h-[3px] absolute top-[50%] bg-black' />
          </span>
          <span className="text-base md:text-xl lg:text-2xl font-poppins font-bold text-[#D02E7D] mr-2">
            FREE
          </span>
        </div>
        <p className='
          text-sm md:text-md lg:text-lg font-poppins text-left md:text-center
          font-medium md:font-normal
          leading-6 md:leading-8
          py-2 ml-2
          md:mx-auto'>{name}</p>
      </div>
    </Link>
  )
}

const TierCards = ({ scrollPosition }: { scrollPosition: ScrollPosition }) => {
  return (
    <>
      { Object.keys(prizes).map((tier: string, index) => {
        return (
          <div className='max-w-7xl mx-auto px-2 md:px-12 mb-8' key={`tier-category-${index}`}>
            <div className='rounded-2xl bg-gradient-to-b from-pink-100 to-fuchsia-0 min-h-[400px] w-full p-2 md:px-6 lg:px-8 sm:py-8 flex flex-col'>
              <h3
                className="
                  hidden md:block
                  text-xl text-xl md:text-2xl lg:text-3xl
                  font-black text-[#25276C] font-poppins mb-10 xl:mb-10
                "
              >
                <span className='bg-[#25276C] rounded-xl py-2 px-4 mr-4 text-white'>TIER {tier}</span>
                Spend <span className='rounded-xl py-2 px-4 text-white bg-[#D02E7D] mx-2'>£{prizes[tier]['threshhold']}+</span> get <span className='text-[#D02E7D]'>1</span> random gift worth <span className='rounded-xl py-2 px-4 text-white bg-[#D02E7D] mx-2'>£{prizes[tier]['worthUpTo']}</span>
              </h3>

              <div className='flex flex-col md:hidden text-center'>
                {/* <div className='bg-[#25276C] rounded-xl py-2 px-4 flex-1 my-2 text-white'>
                  TIER {tier}
                </div> */}
                <h3 className='text-2xl font-bold pt-4 pb-6'>
                  Spend <span className='text-[#D02E7D]'>£{prizes[tier]['threshhold']}+</span><br/>
                  Get <span className='text-[#D02E7D]'>1</span> random gift worth <span className='text-[#D02E7D]'>£{prizes[tier]['worthUpTo']}</span>
                </h3>
              </div>

              <div className='
                grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
              '>
                {
                  prizes[tier]['items'].map((item: any) => (
                    <ItemCard
                      key={item.name}
                      item={item}
                      scrollPosition={scrollPosition}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )
      })
    }
    </>
  )
}

const EventsEasterHunter = ({ scrollPosition }) => {
  const headings = [
    {
      name: 'How it works',
      id: 'how-it-works',
    },
    {
      name: 'Gift Tiers',
      id: 'gift-tiers',
    },
    {
      name: 'FAQs',
      id: 'faqs',
    },
  ];
  const linkColor = useColorModeValue('pink.800', 'pink.300');
  const linkHoverColor = useColorModeValue('gray.900', 'gray.600');

  const qaRef = useRef(null);
  const { sticky } = useSticky(qaRef);
  const activeId = useScrollSpy(
    headings.map(({ id }) => `[id="${id}"]`),
    {
      rootMargin: '0% 0% -24% 0%',
    },
  )

  const onNavLinkClick = useCallback((id: string) => {
    if (typeof document === 'undefined') return;

    const tEl = document.getElementById(id);
    if (tEl) {
      const headerOffset = 126;
      const elementPosition = tEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({ behavior: 'smooth', top: offsetPosition });
    }
  }, [])

  return (
    <div className="mt-[-7px] md:mt-[-32px] lg:mt-[-15px]">
      <section
        className="
          relative isolate z-0 text-2xl font-custom overflow-hidden justify-between
          text-slate-800 w-full relative flex flex-col
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        "
      >
        <section className=" max-w-6xl py-12 sm:py-24 mx-auto">
          <div className="px-5 flex flex-col">
            {/* <img src={bg} alt="win a free gift for every purchase" className='absolute bottom-0 max-w-[300px] self-center' /> */}
            <p className="font-bold text-center text-xl md:text-2xl font-poppins px-4 text-white bg-clip-text">
              May 01 to May 31
            </p>

            <CountDown countdown="2023-06-01T00:00:00.000Z"/>

            <h1
              data-shadow="Get a Free Gift with Your Purchase!"
              className="animated-header relative text-4xl text-center md:text-7xl font-poppins font-bold max-w-5xl md:leading-tight mx-auto text-white">
              Get a Free Gift with Your Purchase!
            </h1>

            <p className="leading-relaxed mt-4 text-lg sm:text-2xl mt-4 text-center mx-auto max-w-3xl text-white">
              Spend <b data-shadow="£20" className='relative animated-header font-poppins'>£20</b> or more, get <b data-shadow="1" className='font-poppins relative animated-header '>1</b> random gift worth <b className='font-poppins'>£7.99 - £32.99</b>
            </p>
          </div>

          <div className="flex mt-4 flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center px-4">
            <button
              className="rounded-lg py-4 whitespace-nowrap px-6 sm:px-12 text-base font-bold lg:text-xl text-white shadow-lg hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 w-full sm:w-fit focus-visible:outline-offset-2 focus-visible:outline-white bg-[#d02e7d]"
              onClick={() => {
                onNavLinkClick('gift-tiers')
              }}
            >
              See what you can get!
            </button>
          </div>
        </section>
      </section>

      <nav
        className='z-10 top-[58px] md:top-[120px] lg:top-[126px]'
        style={{ position: sticky ? 'sticky' : 'static', top: '58px' }}
      >
        <div className='lg:hidden flex justify-between shadow-lg bg-[#393939] text-white py-1 px-2'>
          <div className='flex flex-col font-poppin text-sm justify-center'>
            <span>HURRY UP!</span>
            <span>DEAL ENDS IN</span>
          </div>
          <CountDown countdown="2023-06-01T00:00:00.000Z" noStyle />
        </div>
        <OrderedList className="sticky top-0 z-10 bg-white shadow-lg" ml='0' styleType='none'>
          <ListItem className="flex justify-center">
            {
              headings.map(({ name, id }) => (
                <chakra.a
                  className="py-2 px-3 text-md md:py-4 md:px-6 md:text-lg transition"
                  key={id}
                  py='1'
                  display='block'
                  fontWeight={id === activeId ? 'bold' : 'medium'}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavLinkClick(id);
                  }}
                  aria-current={id === activeId ? 'location' : undefined}
                  color={id === activeId ? 'pink.800' : 'pink.400'}
                  _hover={{
                    color: linkHoverColor,
                  }}
                >
                  { name }
                </chakra.a>
              ))
            }
          </ListItem>
        </OrderedList>
      </nav>

      <div
        id="how-it-works"
        className="bg-gradient-to-b from-white/80 to-white py-8 md:py-20"
        style={{ borderColor: 'rgba(217, 70, 239, 0.6)' }}
      >
        <div className='max-w-7xl px-5 md:px-12 mx-auto'>
          <h2 className="text-4xl sm:text-5xl mb-8 font-bold text-center ">How it works</h2>
        </div>

        <p className="leading-relaxed mt-2 mb-8 text-lg sm:text-2xl my-4 text-center mx-auto max-w-3xl">
          The more you spend, the better your surprise gift! And, yes, even shipping is FREE.
        </p>
        <section className="max-w-7xl px-5 md:px-12 mx-auto">
          <div className="flex flex-wrap gap-8">
            <div
              className="
                rounded-2xl
                lg:flex-[1_1_40%]
                text-2xl transition duration-200 hover:-translate-y-4
                gradient-border
                w-full h-full">
              <div className="flex bg-white p-6 sm:px-6 lg:px-8 sm:py-8 w-full rounded-2xl">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-xl md:text-3xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Tiered Gifts
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">Get a free gift with your purchase of $20, $50, $80, or $100+.</p>
                </div>
                <img src={iconTier} alt="Tiered Gifts Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>

            <div
              className="
                rounded-2xl
                lg:flex-[1_1_40%]
                text-2xl transition duration-200 hover:-translate-y-4
                gradient-border
                w-full h-full">
              <div className="flex bg-white p-6 sm:px-6 lg:px-8 sm:py-8 w-full rounded-2xl">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-xl md:text-3xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Random Selection
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">All gifts are randomly selected from a set of 6-9 items per tier.</p>
                </div>
                <img src={iconGift} alt="Random Selection Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>

            <div
              className="
                rounded-2xl
                lg:flex-[1_1_40%]
                text-2xl transition duration-200 hover:-translate-y-4
                gradient-border
                w-full h-full">
              <div className="flex bg-white p-6 sm:px-6 lg:px-8 sm:py-8 w-full rounded-2xl">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-xl md:text-3xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Limited Time Only
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">This campaign is only valid for a limited time, so act fast!</p>
                </div>
                <img src={iconTime} alt="Limited Time Only Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>

            <div
              className="
                rounded-2xl
                lg:flex-[1_1_40%]
                text-2xl transition duration-200 hover:-translate-y-4
                gradient-border
                w-full h-full">
              <div className="flex bg-white p-6 sm:px-6 lg:px-8 sm:py-8 w-full rounded-2xl">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-xl md:text-3xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Free Shipping
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">All gifts will be shipped to you free of charge!</p>
                </div>
                <img src={iconFree} alt="Free Shipping Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        id="gift-tiers"
        className="bg-gradient-to-b from-white/80 to-white py-8 md:py-20"
        style={{ borderColor: 'rgba(217, 70, 239, 0.6)' }}
        ref={qaRef}
      >
        <div className='max-w-7xl px-5 md:px-12 mx-auto'>
          <h2 className="text-4xl sm:text-5xl mb-8 font-bold text-center ">Sneak a Peek of Your Gifts</h2>
        </div>

        <p className="leading-relaxed px-5 md:px-12 mt-2 mb-8 text-lg sm:text-2xl my-4 text-center mx-auto max-w-3xl">
          Discover the exciting items you could receive in each tier!
        </p>
        {
          <TierCards scrollPosition={scrollPosition} />
        }
      </div>

      {/* Email lead */}
      <div className="py-20 bg-[#efefef]">
        <section className="relative">
          <h2 className="mb-4 px-5 sm:text-center font-custom text-3xl font-bold max-w-4xl md:leading-tight mx-auto">
            Like this event?
          </h2>
          <p className="leading-relaxed mt-4 text-lg sm:text-2xl my-4 text-center mx-auto max-w-3xl">
            Get notified about when we have new events
          </p>
          <div className="px-5">
            <form
              method="POST"
              action="/subscribe"
              className="flex flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center"
            >
              <input type="hidden" name="iframe_id" value="gift-surprise-campaign" />
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                className="flex-auto rounded-lg border-0 bg-white px-4 py-4 shadow-md ring-1 ring-slate-300/80 focus:ring-2 w-full max-w-xl focus:ring-slate-400/70 sm:text-base lg:text-lg sm:leading-6"
                placeholder="Enter your email"
                style={{ paddingRight: "46px" }}
              />
              <button
                type="submit"
                className="rounded-lg py-4 whitespace-nowrap px-6 sm:px-12 text-base font-bold lg:text-lg text-white shadow-lg hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 w-full sm:w-fit focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: "#d02e7d" }}
              >
                Notify me
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Q & A */}
      <section className="py-16 sm:py-40" id="faqs">
        <div className="grid sm:grid-cols-3 px-5 max-w-6xl mx-auto sm:gap-24">
          <div>
            <h2 className="text-4xl sm:text-5xl max-w-3xl mb-12 font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="col-span-2 space-y-16">
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>When does the campaign end?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">The campaign is valid until the end of May, 2023.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>Can I choose my gift?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">No, all gifts are randomly selected from a set of 6-9 items per tier.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>Are there any restrictions on the gifts?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">No, there are no restrictions on the gifts. It's a surprise!</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>How many gifts can I get?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">You can get one gift per tier you qualify for per order.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>How do I know which tier I qualify for?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">Your gift will be determined by the total amount of your purchase.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>Does the purchase include sales tax?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">Yes, the purchase amount includes any applicable sales tax.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default trackWindowScroll(EventsEasterHunter);
