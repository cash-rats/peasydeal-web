import { TbArrowBackUp, TbTruckDelivery } from "react-icons/tb";
import { VscFlame } from "react-icons/vsc";

const PropBar = () => {
  return (
    <div className="
      bg-white w-full
      border-y-[1px] border-y-[rgba(0,0,0,.17)]
      py-3 mb-2 md:mb-6
      text-center mx-auto">
      <ul className="max-w-screen-xl flex flex-row justify-center space-x-0.5 mx-auto">
        <li className="
          flex flex-col sm:flex-row flex-initial
          px-2 md:px-4 basis-4/12
          justify-center
          border-r
        ">
          <TbArrowBackUp className="self-center text-lg md:text-xl sm:space-x-0.5" />
          <span className="self-center text-sm sm:text-sm md:text-base ml-1.5"><b>100% money back</b> guarantee</span>
        </li>
        <li className="
          flex flex-col sm:flex-row flex-initial
          px-2 md:px-4 basis-4/12
          justify-center
          border-r
        ">
          <VscFlame className="self-center text-lg md:text-xl sm:space-x-0.5" />
          <span className="self-center text-sm sm:text-sm md:text-base ml-1.5">New Deal <b>Every Week</b></span>
        </li>
        <li className="
          flex flex-col sm:flex-row flex-initial
          px-2 md:px-4 basis-4/12
          justify-center
        ">
          <TbTruckDelivery className="self-center text-lg md:text-xl sm:space-x-0.5" />
          <span className="self-center text-sm sm:text-sm md:text-base ml-1.5">Lowest Shipping Starting at <b>£2.99</b></span>
        </li>
      </ul>
    </div>
  );
};

export default PropBar;
