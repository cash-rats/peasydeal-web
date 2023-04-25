import { useCallback, useRef } from 'react';
import { Link } from '@remix-run/react';
import { IconButton } from '@chakra-ui/react';
import { useOutletContext } from "@remix-run/react";
import { VscFlame, VscArrowRight, VscArrowLeft } from 'react-icons/vsc';
import { IoBody, IoSparklesOutline, IoPricetagsOutline } from 'react-icons/io5';
import { MdOutlinePets, MdOutlineSmartToy } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';
import { RiShirtFill } from 'react-icons/ri';
import { GiPearlNecklace, GiFlowerPot, GiLipstick } from 'react-icons/gi';
import { FcRating, FcSmartphoneTablet, FcHome, FcAutomotive } from 'react-icons/fc';

import type { Category } from '~/shared/types';


type ContextType = {
  categories: Category[];
};

export function useContext() {
  return useOutletContext<ContextType>();
}

const iconMapper = (name: string) => {
  switch (name) {
    case 'hot_deal':
      return <VscFlame className='text-[42px] pb-2 text-[#e90064] relative left-[-6px]' />;
    case 'new_trend':
      return <IoSparklesOutline className='text-[42px] pb-2 text-[#FF8B13]' />;
    case 'super_deal':
      return <IoPricetagsOutline className='text-[42px] pb-2 text-[#EB455F]' />;
    case 'pet':
      return <MdOutlinePets className='text-[42px] pb-2 text-[#BAD7E9] relative left-[-6px]' />;
    case 'kitchen_kitchenware':
      return <TbToolsKitchen2 className='text-[42px] pb-2 text-[#10A19D] relative left-[-6px]' />;
    case 'clothes_shoes':
      return <RiShirtFill className='text-[42px] pb-2 text-[#FF8787] relative left-[-6px]' />;
    case 'garden':
      return <GiFlowerPot className='text-[42px] pb-2 text-[#8BDB81] relative left-[-6px]' />;
    case 'electronics':
      return <FcSmartphoneTablet className='text-[42px] pb-2 relative left-[-6px]' />;
    case 'toy':
      return <MdOutlineSmartToy className='text-[42px] pb-2 text-[#FFE162] relative left-[-6px]' />;
    case 'beauty_personal_care':
      return <GiLipstick className='text-[42px] pb-2 text-[#FFA6D5] relative left-[-6px]' />;
    case 'home_appliances':
      return <FcHome className='text-[42px] pb-2 relative left-[-6px]' />;
    case 'health_medical':
      return <IoBody className='text-[42px] pb-2 text-[#39A388] relative left-[-6px]' />;
    case 'car_accessories':
      return <FcAutomotive className='text-[42px] pb-2 relative left-[-6px]' />;
    case 'cloths_accessories':
      return <GiPearlNecklace className='text-[42px] pb-2 text-[#FF8474] relative left-[-6px]' />;
    case 'top_product':
      return <FcRating className='text-[42px] pb-2 relative left-[-6px]' />;
    default:
      return null;
  }
}

const CategoriesRow = () => {
  const { categories } = useOutletContext<ContextType>();
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
          <div className="flex flex-nowrap">
            {
              categories?.map((category: Category, index: number) => {
                return (
                  <div className="inline-block px-3" key={`${category.name}_${index}`}>
                    <Link
                      to={
                        `/${category.type === 'promotion'
                          ? 'promotion'
                          : 'category'
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
                          text-lg md:text-xl
                          leading-5
                          w-[137px] h-[137px]
                          md:w-[160px] md:h-[160px]
                          max-w-xs
                          overflow-hidden
                          border boder-[#efefef]
                          hover:shadow-[2px_4px_16px_rgb(0,0,0,16%)]
                          rounded-lg bg-white
                          transition-shadow duration-300 ease-in-out
                          caterogy-card-box
                        "
                      >
                        <span>{iconMapper(category.name)}</span>
                        <span>
                          {category.title}
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
