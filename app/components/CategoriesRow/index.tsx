import { useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { IconButton } from '@chakra-ui/react';
import { useOutletContext } from "react-router";
import { VscFlame, VscArrowRight, VscArrowLeft } from 'react-icons/vsc';
import { IoBody, IoSparklesOutline, IoPricetagsOutline } from 'react-icons/io5';
import { MdOutlinePets, MdOutlineSmartToy } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';
import { RiShirtFill } from 'react-icons/ri';
import { GiPearlNecklace, GiFlowerPot, GiLipstick } from 'react-icons/gi';
import { FcRating, FcSmartphoneTablet, FcHome, FcAutomotive } from 'react-icons/fc';

import imgHotDeal from './images/hot_deal.png';
import imgApparel from './images/apparel.png';
import imgArt from './images/art.png';
import imgBaby from './images/baby.png';
import imgBag from './images/bag.png';
import imgBeauty from './images/beauty.png';
import imgBusiness from './images/business.png';
import imgCamera from './images/camera.png';
import imgCar from './images/car.png';
import imgElectronic from './images/electronic.png';
import imgFurniture from './images/furniture.png';
import imgGarden from './images/garden.png';
import imgHardware from './images/hardware.png';
import imgMature from './images/mature.png';
import imgOffice from './images/office.png';
import imgPet from './images/pet.png';
import imgSport from './images/sport.png';
import imgToy from './images/toy.png';

import type { Category } from '~/shared/types';

type ContextType = {
  categories: Category[];
};

export function useContext() {
  return useOutletContext<ContextType>();
}

const imageMapper = (name: string) => {
  switch (name) {
    case 'hot_deal':
      return <img src={imgHotDeal} className='w-[75%] ml-auto' alt="hot_deal" />;
    case 'apparel-and-accessories':
      return <img src={imgApparel} className='w-[75%] ml-auto' alt="apparel-and-accessories" />;
    case 'health-and-beauty':
        return <img src={imgBeauty} className='w-[75%] ml-auto' alt="health-and-beauty" />;
    case 'business-and-industrial':
      return <img src={imgBusiness} className='w-[75%] ml-auto' alt="business-and-industrial" />;
    case 'cameras-and-optics':
      return <img src={imgCamera} className='w-[75%] ml-auto' alt="cameras-and-optics" />;
    case 'arts-and-entertainment':
      return <img src={imgArt} className='w-[75%] ml-auto' alt="arts-and-entertainment" />;
    case 'electronics':
      return <img src={imgElectronic} className='w-[75%] ml-auto' alt="electronics" />;
    case 'mature':
      return <img src={imgMature} className='w-[75%] ml-auto' alt="mature" />;
    case 'home-and-garden':
      return <img src={imgGarden} className='w-[75%] ml-auto' alt="home-and-garden" />;
    case 'furniture':
      return <img src={imgFurniture} className='w-[75%] ml-auto' alt="furniture" />;
    case 'baby-and-toddler':
      return <img src={imgBaby} className='w-[75%] ml-auto' alt="baby-and-toddle" />;
    case 'hardware':
      return <img src={imgHardware} className='w-[75%] ml-auto' alt="hardware" />;
    case 'vehicles-and-parts':
      return <img src={imgCar} className='w-[75%] ml-auto' alt="vehicles-and-parts" />;
    case 'office-supplies':
      return <img src={imgOffice} className='w-[75%] ml-auto' alt="office-supplies" />;
    case 'sporting-goods':
      return <img src={imgSport} className='w-[75%] ml-auto' alt="sporting-goods" />;
    case 'toys-and-games':
      return <img src={imgToy} className='w-[75%] ml-auto' alt="toys-and-games" />;
    case 'animals-and-pet-supplies':
      return <img src={imgPet} className='w-[75%] ml-auto' alt="pet-supplies" />;
    case 'luggage-and-bags':
      return <img src={imgBag} className='w-[75%] ml-auto' alt="luggage-and-bags" />;
    default:
      return null;
  }
}

const CategoriesRow = ({ defatulCategories }: { defatulCategories?: any}) => {
  const { categories } = useOutletContext<ContextType>() || defatulCategories || {};
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((toRight: boolean) => {
    if (!window || !containerRef.current || !containerRef.current) return;
    const offset = containerRef.current.clientWidth - 100;

    containerRef!.current.scrollLeft += (toRight ? offset : -offset);
  }, [containerRef]);

  return (
    <div className='relative w-full bg-slate-50'>
      <div className="w-full p-2.5 max-w-screen-xl mx-auto relative">
        <h3 className="
          font-poppins font-semibold
          text-2xl md:text-3xl
          mt-6 md:mt-8
          mb-2 md:mb-3
          flex
          items-center
        ">
          Shop by category
        </h3>

        <div className='absolute top-8 md:top-11 right-2'>
          <IconButton
            aria-label='Page Left'
            icon={<VscArrowLeft />}
            onClick={() => scroll(false)}
            className='mr-2 bg-white'
          />
          <IconButton
            aria-label='Page Right'
            icon={<VscArrowRight />}
            onClick={() => scroll(true)}
            className='bg-white'
          />
        </div>

        <div
          ref={containerRef}
          className="flex overflow-x-scroll pt-5 pb-10 hide-scroll-bar smooth-scrolling"
        >
          <div className="flex flex-nowrap gap-2 md:gap-4">
            {
              categories?.map((category: Category, index: number) => {
                return (
                  <div className="inline-block" key={`${category.name}_${index}`}>
                    <Link
                      to={
                        `/${category.type === 'promotion'
                          ? 'promotion'
                          : 'collection'
                        }/${category.name}`
                      }
                      onClick={() => {
                        window.rudderanalytics?.track('click_shop_by_category', {
                          category: category.name,
                        });
                      }}
                    >
                      <div
                        className="
                          cursor-pointer
                          flex flex-col items-start
                          px-4 pt-4
                          font-poppins font-medium
                          md:text-lg
                          text-base
                          leading-5
                          min-w-[145px]
                          h-full
                          md:min-w-[160px]
                          max-w-xs
                          overflow-hidden
                          font-bold
                          border boder-[#efefef]
                          hover:shadow-[2px_4px_16px_rgb(0,0,0,16%)]
                          rounded-lg bg-white
                          transition-shadow duration-300 ease-in-out
                          relative
                        "
                      >
                        <span>
                          {category.title}
                        </span>
                        <span className='inline-flex text-right mt-auto py-2'>
                          {imageMapper(category.name)}
                        </span>
                      </div>
                    </Link>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesRow;
