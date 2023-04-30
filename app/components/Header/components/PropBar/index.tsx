import returnIcon from './images/14_day_hassle_free_return_icon.svg';
import lowShippingIcon from './images/low_shipping_cost_icon.svg';
import newDealIcon from './images/new_deal_every_week_icon.svg';

const PropBar = () => {
  return (
    <div className="
      bg-white w-full
      border-b-[1px] border-b-[rgba(0,0,0,.17)]
      py-0 lg:py-3
      mb-0
      inline-block
      text-center mx-auto
      whitespace-nowrap
      overflow-hidden
    ">
      <ul className="
        block lg:w-[100vw] lg:max-w-screen-xl
        whitespace-nowrap
        overflow-hidden
        lg:flex lg:flex-row
        justify-center lg:space-x-0.5
        lg:mx-auto
        pt-[6px] lg:pt-0
        bg-[#f7fbff] lg:bg-transparent
        m-0
      ">
        <li className="
          w-[100%] lg:w-[100%] lg:basis-4/12
          px-2 lg:px-4
          inline-block
          animate-[slider_20s_ease-out_infinite] lg:animate-none
          lg:border-r
        ">
          <div className='flex flex-row justify-center'>
            <img src={returnIcon} alt="14 day hassle free return icon" className="self-center text-lg md:text-xl sm:space-x-0.5" />
            <span className="self-center text-sm sm:text-sm md:text-base ml-1.5"><b>100% money back</b> guarantee</span>
          </div>
        </li>
        <li className="
          w-[100%] lg:w-[100%] lg:basis-4/12
          px-2 lg:px-4
          inline-block
          lg:border-r
        ">
          <div className='flex flex-row justify-center'>
            <img src={newDealIcon} alt="New Deal Every Week" className="self-center text-lg md:text-xl sm:space-x-0.5" />
            <span className="self-center text-sm sm:text-sm md:text-base ml-1.5">New Deal <b>Every Week</b></span>
          </div>
        </li>
        <li className="
          w-[100%] lg:w-[100%] lg:basis-4/12
          px-2 lg:px-4
          inline-block
        ">
          <div className='flex flex-row justify-center'>
            <img src={lowShippingIcon} alt="Shipping Starting from £2.99" className="self-center text-lg md:text-xl sm:space-x-0.5" />
            <span className="self-center text-sm sm:text-sm md:text-base ml-1.5">Shipping Starting from <b>£2.99</b></span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default PropBar;
