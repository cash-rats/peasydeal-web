/**
 * This component render the modulared products
 * into a product grid
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { OptimizedImage as Image } from '~/components/OptimizedImage';
import { LazyWrapper } from '~/components/LazyWrapper';
import { composeProductDetailURL } from '~/utils';
import { round10 } from '~/utils/preciseRound';
import {
  type IProductCard,
  type ITag,
  capitalizeWords,
  getColorByTag,
  getLeftIconByTag,
  showPriceOffThreshhold,
} from './utils';


import { envs } from '~/utils/env';
import { SUPER_DEAL_OFF } from '~/shared/constants';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import extra10 from '~/images/extra10.png';

const splitNumber = (n: number): [number, number] => {
  if (!n) return [0, 0];

  return [Math.floor(n), Math.round((n % 1) * 100)];
}

const getPriceRow = (salePrice: number, previousRetailPrice: Array<number>) => {
  const [priceLeft, priceRight] = splitNumber(salePrice);

  return (
    <>
      <div className='flex font-bold text-[#D02E7D] space-x-[1px] '>
        <small className='text-lg'>£</small>
        <span className='font-poppins text-2xl'>{priceLeft}</span>
        <small className='text-lg'>{priceRight}</small>
      </div>
      {
        previousRetailPrice.length > 0 && previousRetailPrice.map((retailPrice, index) => (
          <div
            className='relative'
            key={`previous_retail_price${index}`}
            style={{ fontWeight: index === 0 && previousRetailPrice.length !== 1 ? 'bold' : 'medium' }}
          >
            <span>{retailPrice}</span>
            <div className='block h-[1px] w-full bg-black absolute top-[10px]' />
          </div>
        ))
      }
    </>
  )
}

const TAG_COLOR_MAP: Record<string, string> = {
  linkedin: 'bg-[#0A66C2]/10 text-[#0A66C2]',
  pink: 'bg-pink-100 text-pink-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  red: 'bg-red-100 text-red-700',
};

const getTagClassName = (color: string) => TAG_COLOR_MAP[color] || '';

const TagBadge = ({ tag }: { tag: ITag }) => {
  const Icon = tag.icon;
  const className = getTagClassName(tag.color);
  const needsInline = !className;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
        needsInline ? 'text-white' : className,
      )}
      style={needsInline ? { backgroundColor: tag.color || '#2D91FF' } : undefined}
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span>{tag.name}</span>
    </span>
  );
};

function ProductCardSkeleton() {
  return (
    <div className='flex w-full flex-col border-lg animate-pulse'>
      <div className='h-[183px] md:h-[253px] w-full rounded-lg bg-slate-200' />
      <div className='mt-4 space-y-3'>
        <div className='h-4 w-3/4 rounded bg-slate-200' />
        <div className='h-4 w-1/2 rounded bg-slate-200' />
        <div className='h-4 w-1/3 rounded bg-slate-200' />
      </div>
    </div>
  )
}

export default function ProductCard({
  loading = false,
  product,
  onClickProduct = () => { },
  displayActionButton = true,
  noPadding = false,
}: IProductCard) {
  const {
    main_pic: mainPic,
    title = '',
    retailPrice,
    salePrice,
    productUUID = '',
    tabComboType = '',
    variations,
  } = product || {};

  const [loaded, setLoaded] = useState<Boolean>(false);
  const [hasSuperDeal, setHasSuperDeal] = useState<Boolean>(false);

  const tags: Array<ITag> = useMemo(() => {
    if (!tabComboType) return [];

    let _hasSuperDeal = false;

    const tags = tabComboType?.split(',').map((tag: string) => {
      if (tag === 'super_deal') {
        _hasSuperDeal = true;
      }
      const name = capitalizeWords(tag);
      const color = getColorByTag(tag);
      const icon = getLeftIconByTag(tag);

      return { name, color, icon };
    });

    setHasSuperDeal(_hasSuperDeal);

    return tags;
  }, [tabComboType]);

  const priceOff: number = useMemo(() => {
    if (!salePrice || !retailPrice) return 0;

    return Math.ceil((1 - salePrice / retailPrice) * 100);
  }, [salePrice, retailPrice]);

  const PriceRowMemo = useMemo(() => {
    if (!salePrice) return null;
    if (!retailPrice) return getPriceRow(salePrice, []);

    return hasSuperDeal
      ? getPriceRow(round10(salePrice * SUPER_DEAL_OFF, -2), [salePrice, retailPrice])
      : getPriceRow(salePrice, [retailPrice])
  }, [salePrice, retailPrice, hasSuperDeal]);

  if (!product) return null;

  if (loading) {
    return (
      <ProductCardSkeleton />
    )
  }

  return (
    <Link
      to={composeProductDetailURL({ productName: title, productUUID })}
      state={{ scrollToTop: true }}
    >
      <div className={`
        flex flex-col
        max-w-xs
        w-full h-full
        ${noPadding ? 'border-b-[3px] border-b-[#d53f8c]' : 'border border-gray-200 rounded-lg'}
        ${noPadding ? 'p-0' : 'p-1 md:p-2 lg:p-4'}
        bg-white
        relative`}
      >
        {
          priceOff > showPriceOffThreshhold
            ? (
              <div
                className='
                  absolute
                  px-[6px] py-[4px] md:px-2 md:py-2
                  top-0
                  left-1 md:left-4
                  flex flex-col justify-center items-center
                  font-poppins
                  rounded-b-lg
                  text-white
                  z-10
                '
                style={{
                  backgroundColor: hasSuperDeal ? '#00B5D8' : '#D43B33',
                }}
              >
                <small className='font-bold'>{priceOff}%</small>
                <small className='font-medium mt-[-3px]'>OFF</small>
              </div>
            ) : null
        }

        <div className={`${loaded ? 'h-full' : 'h-[183px] md:h-[253px]'}`} >
          <LazyWrapper threshold={500}>
            <Image
              blurDataURL={`${envs.DOMAIN}/images/${loaded
                ? 'placeholder_transparent.png'
                : 'placeholder.svg'
                }`}
              placeholder={loaded ? 'empty' : 'blur'}
              placeholderAspectRatio={1}
              onLoadingComplete={() => {
                setLoaded(true);
              }}
              options={{
                contentType: 'image/webp',
                fit: 'contain',
              }}
              className="
                aspect-square
                min-w-0 min-h-0
              "
              src={mainPic}
              responsive={[
                {
                  size: {
                    width: 274,
                    height: 274,
                  },
                },
              ]}
            />
          </LazyWrapper>
        </div>

        {/* TITLES */}
        <p
          className='
            font-poppins font-medium
            my-1.5 md:my-2.5
            text-sm md:text-base
          '
        >
          {title}
        </p>

        {/* SELL TAGS */}
        <div className='flex mb-3 flex-wrap gap-1 md:gap-2'>
          {
            tags
              .map((tag: ITag, index: number) => {
                if (!tag) return null;

                return (
                  <TagBadge
                    key={`tag_${tag.name}_${tag.color}`}
                    tag={tag}
                  />
                );
              })
              .filter(c => c !== null)
          }
        </div>


        {/* PRICING */}
        <div className='flex items-center space-x-2 my-2 mr-auto mt-auto'>
          {PriceRowMemo}
        </div>

        {/* ACTION BUTTON */}
        {
          displayActionButton && (
            <div className='hidden md:flex'>
              <Button
                className='w-full bg-pink-600 hover:bg-pink-700 text-white'
                size='sm'
                onClick={() => onClickProduct(title, productUUID)}>
                {variations && variations.length > 1 ? 'See Options' : 'Add to Cart'}
              </Button>
            </div>
          )
        }

        {
          hasSuperDeal && (
            <img
              alt='extra 10% off - super deal'
              className='
                absolute
                right-[-32px] md:right-[-28px]
                top-[-32px] md:top-[-28px]
                scale-[0.65] md:scale-[0.85]
              '
              src={extra10}
            />
          )
        }
      </div>
    </Link>
  );
};
