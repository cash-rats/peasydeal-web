import type { ReactNode } from 'react';

type PriceInfoProps = {
  title: ReactNode;
  priceInfo: ReactNode;
}

function PriceInfo({ title, priceInfo }: PriceInfoProps) {
  return (
    <span className="flex text-sm font-normal text-[rgb(130,129,131)]">
      <span className="flex items-center gap-1">
        <div className="font-poppins m-0 flex-1"> {title} </div>
      </span>
      <div className="flex justify-end flex-1 m-0 font-poppins font-normal text-sm"> {priceInfo}  </div>
    </span>
  );
}

export default PriceInfo;