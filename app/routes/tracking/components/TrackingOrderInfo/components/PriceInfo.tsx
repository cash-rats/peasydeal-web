import type { ReactNode } from 'react';

type PriceInfoProps = {
  title: ReactNode;
  priceInfo: ReactNode;
}

function PriceInfo({ title, priceInfo }: PriceInfoProps) {
  return (
    <span className="flex text-sm font-normal text-[rgb(130,129,131)]">
      <span className="flex items-center gap-1">
        <p className="m-0 flex-1"> {title} </p>
      </span>
      <p className="flex justify-end flex-1 m-0 font-normal text-sm"> {priceInfo}  </p>
    </span>
  );
}

export default PriceInfo;