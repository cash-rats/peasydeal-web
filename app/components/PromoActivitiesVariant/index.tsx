import { Link } from "@remix-run/react";
import { VscArrowRight } from "react-icons/vsc";
import { IoPricetagsOutline } from 'react-icons/io5';

interface IPromoActivitiesVariantProps {
}

/**
 * a react-remix functional component that renders a flex box div
 */
const PromoActivitiesVariant = ({

}: IPromoActivitiesVariantProps) => {
  return (
    <div className="
      flex
      flex-col
      w-full
      py-2.5 md:py-[46px]
      px-2 md:px-0
    ">
      <div className='
        grid
        gap-2 md:gap-3 lg:gap-4
        grid-cols-2 md:grid-cols-4
      '>
        <div className="
          flex p-4 border-r
        ">
          <div className="flex flex-col self-center">
            <p className="
              font-poppins font-semibold
              text-2xl md:text-3xl
            ">
              Grand Launch Sale
            </p>
            <p className="text-xl">
              UP to <span className="text-3xl font-poppins font-bold text-[#D43B33]">60%+</span> OFF
            </p>
          </div>
        </div>

        <Link to={`/super_deal`}>
          <div className="
            flex justify-between p-4 bg-[#D43B33]
            shadow-[2px_4px_16px_rgb(0,0,0,8%)]
            hover:shadow-[2px_4px_16px_rgb(0,0,0,16%)]
            transition-shadow transition-transform duration-300 ease-in-out
            caterogy-card-box
            cursor-pointer
            rounded-lg
          ">
            <div className="flex flex-col self-center">
              <p className="flex text-white font-poppins font-bold text-2xl mb-2 items-center">
                <IoPricetagsOutline className='text-2xl mr-3 text-white' />
                <span>Super Deal</span>
              </p>
              <p className="text-white text-lg md:text-xl">
                All items here got extra <span className="text-xl font-poppins font-bold md:text-3xl">10%</span> OFF
              </p>
            </div>
            <div className="self-center">
              <VscArrowRight className="m-2 text-2xl text-white" />
            </div>
          </div>
        </Link>


        <Link to={'promotion/new_arrival'}>
          <div className="
          flex justify-between p-4 bg-[#D43B33] h-full
          shadow-[2px_4px_16px_rgb(0,0,0,8%)]
          hover:shadow-[2px_4px_16px_rgb(0,0,0,16%)]
          transition-shadow transition-transform duration-300 ease-in-out
          caterogy-card-box
          cursor-pointer
          rounded-lg
        ">
            <div className="flex flex-col self-center">
              <p className="text-white font-poppins font-bold text-2xl mb-2">
                New Arrival
              </p>
            </div>
            <div className="self-center">
              <VscArrowRight className="m-2 text-2xl text-white" />
            </div>
          </div>
        </Link>

        <Link to={'promotion/deal_under_15'}>
          <div className="
          flex justify-between p-4 bg-[#D43B33] h-full
          shadow-[2px_4px_16px_rgb(0,0,0,8%)]
          hover:shadow-[2px_4px_16px_rgb(0,0,0,16%)]
          transition-shadow transition-transform duration-300 ease-in-out
          caterogy-card-box
          cursor-pointer
          rounded-lg
        ">
            <div className="flex flex-col self-center">
              <p className="text-white font-poppins font-bold text-2xl mb-2">
                Deal Under £15
              </p>
            </div>
            <div className="self-center">
              <VscArrowRight className="m-2 text-2xl text-white" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default PromoActivitiesVariant;