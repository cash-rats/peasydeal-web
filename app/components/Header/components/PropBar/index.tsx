import { TbArrowBackUp, TbFlame, TbTruckDelivery } from "react-icons/tb";

const PropBar = () => {
  return (
    <div className="w-full border-y py-3 mb-10 text-center">
      <ul className="categories-nav-container flex flex-row justify-center space-x-0.5">
        <li className="flex flex-row flex-initial px-4 basis-4/12	justify-center border-r">
          <TbArrowBackUp fontSize={24} className="self-center"/>
          <span className="self-center ml-1.5"><b>100% money back</b> guarantee</span>
        </li>
        <li className="flex flex-row flex-initial px-4 basis-4/12	justify-center border-r">
          <TbFlame fontSize={24} className="self-center" />
          <span className="self-center ml-1.5">New Deal <b>Every Week</b></span>
        </li>

        <li className="flex flex-row flex-initial px-4 basis-4/12	justify-center">
          <TbTruckDelivery fontSize={24} className="self-center" />
          <span className="self-center ml-1.5">Low Shipping Cost at <b>£2.99</b></span>
        </li>
      </ul>
    </div>
  );
};

export default PropBar;
