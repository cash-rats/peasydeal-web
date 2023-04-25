import { Link } from "@remix-run/react";
import { VscArrowRight } from "react-icons/vsc";

/**
 * a react-remix functional component that renders a flex box div
 */
const PromoActivitiesVariant = () => {
  const promotions = [{
    to: '/promotion/super_deal',
    title1: 'Enjoy extra',
    title2: '10% OFF',
    label: 'Super Deal'
  }, {
    to: '/promotion/new_arrival',
    title1: 'Up to',
    title2: '60%+ OFF',
    label: 'New Arrival'
  }, {
    to: '/promotion/deal_under_15',
    title1: 'Shop smart',
    title2: '£0.99 - £15',
    label: 'Hottest Deal'
  }];

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

        {
          promotions.map((promotion: any) => (
            <Link to={promotion.to} key={`promotion_variant_${promotion.to}`}>
              <div className="
                flex justify-between p-4 bg-[#D43B33]
                shadow-[2px_4px_16px_rgb(0,0,0,8%)]
                hover:shadow-[2px_4px_16px_rgb(0,0,0,16%)]
                transition-transform duration-300 ease-in-out
                caterogy-card-box
                cursor-pointer
                rounded-lg
                h-full
              ">
                <div className="flex flex-col self-center">
                  <p className="flex flex-col text-white">
                    <span>{promotion.title1}</span>
                    <span className="font-poppins text-2xl font-black my-2">{promotion.title2}</span>
                    <span className="border-[#fff089] font-poppins font-bold text-2xl border-b-4">{promotion.label}</span>
                  </p>
                </div>
                <div className="self-center">
                  <VscArrowRight className="m-2 text-2xl text-white" />
                </div>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default PromoActivitiesVariant;