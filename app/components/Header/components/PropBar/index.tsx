import { TbArrowBackUp, TbTruckDelivery } from "react-icons/tb";
import { VscFlame } from "react-icons/vsc";

const PropBar = () => {
  return (
    <div className="bg-white w-full border-y py-3 mb-10 text-center mx-auto">
      <ul className="max-w-screen-xl flex flex-row justify-center space-x-0.5 mx-auto">
        <li className="
          flex flex-col sm:flex-row flex-initial
          px-4 basis-4/12
          sm:space-x-1
          justify-center
          border-r
        ">
          <TbArrowBackUp className="self-center text-lg md:text-xl sm:space-x-0.5" />
          <span className="self-center text-xs sm:text-sm md:text-base ml-1.5"><b>100% money back</b> guarantee</span>
        </li>
        <li className="
          flex flex-col sm:flex-row flex-initial
          px-4 basis-4/12
          sm:space-x-1
          justify-center
          border-r
        ">
          <VscFlame className="self-center text-lg md:text-xl sm:space-x-0.5" />
          <span className="self-center text-xs sm:text-sm md:text-base ml-1.5">New Deal <b>Every Week</b></span>
        </li>
        <li className="
          flex flex-col sm:flex-row flex-initial
          px-4 basis-4/12
          sm:space-x-1
          justify-center
        ">
          <TbTruckDelivery className="self-center text-lg md:text-xl sm:space-x-0.5" />
          <span className="self-center text-xs sm:text-sm md:text-base ml-1.5">Low Shipping Cost at <b>£2.99</b></span>
        </li>
      </ul>
    </div>
  );
};

export default PropBar;
