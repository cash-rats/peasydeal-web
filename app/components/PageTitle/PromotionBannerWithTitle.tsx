import type { LinksFunction } from '@remix-run/node';
import IconPromotion from './images/icon-promotion.svg';
import IconPriceTag from './images/icon-price-tag.svg';
import styles from './styles/promotion-title.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface PromotionBannerWithTitleProps {
  title: string;
  subtitle?: string;
  superSale?: boolean;
}

export default function PromotionBannerWithTitle({
  title,
  subtitle,
  superSale = false,
}: PromotionBannerWithTitleProps) {
  return (
    <div
      className={`
        w-full max-w-screen-xl
        mx-auto
        mb-6
        rounded-xl
        relative
        flex
        justify-center items-center
        py-4 px-2
        overflow-hidden
      `}
    >
      <div className='
        flex flex-col
        w-fit
        px-4 md:px-8
        py-3 md:py-6
        rounded-[16px]
        z-[11] relative
        text-center'>
        <img
          className='
            w-[66px] md:w-[90px] lg:w-[120px]
            mx-auto mb-3
          '
          src={superSale ? IconPromotion : IconPriceTag} alt="promotion icon"
        />
        <h1 className={`
          mb-2 md:mb-3
          text-3xl md:text-5xl
          font-black
          font-poppins
          text-white
          uppercase
        `}>
          {title}
        </h1>
        {
          subtitle ? <h2 className={`
            text-lg md:text-xl
            font-bold
            text-white
          `}>{subtitle}</h2> : null
        }
      </div>

      <div className='promotion-banner-bg absolute z-10' />
      <div className='promotion-banner-bg-wrapper absolute w-full h-full z-0' />
    </div>
  )
}