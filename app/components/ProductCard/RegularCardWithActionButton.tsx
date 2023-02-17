/**
 * This component render the modulared products
 * into a product grid
 */
import { useState, useMemo, useCallback } from 'react';
import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import type { ScrollPosition } from 'react-lazy-load-image-component';
import { LazyLoadComponent } from "react-lazy-load-image-component";
import Image, { MimeType } from "remix-image"

import type { Product } from "~/shared/types";
import { composeProductDetailURL } from '~/utils';
import { DOMAIN } from '~/utils/get_env_source';

import { Button } from '@chakra-ui/react'
import llimageStyle from 'react-lazy-load-image-component/src/effects/blur.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: llimageStyle }];
}

interface IProductCard {
  product?: Product;
  scrollPosition?: ScrollPosition;
  onClickProduct?: (title: string, productID: string) => void;
}

/*
  Lazy load remix-image.
  w > 1024: 274x274
  768 < w < 1024: 302x302
  w < 768:  310x310

  Use LazyLoadComponent to lazy load remix image.
*/
interface ITag {
  name: string;
  color: string;
}

const showPriceOffThreshhold = 30;
const capitalizeWords = (str: string) => {
  if (!str) return '';

  let words = str.split('_');
  let newStr = '';

  for (let word of words) {
    newStr += word.charAt(0).toUpperCase() + word.substring(1).toLowerCase() + ' ';
  }

  return newStr.trim();
}

const getColorByTag = (tag: string) => {
  switch (tag) {
    case 'new':
      return '#2D91FF';
    case 'hot_deal':
      return '#D43B33';
    case 'price_off':
      return '#5EA111';
    default:
      return '#2D91FF';
  }
}

export default function ProductCard({
  product,
  onClickProduct = () => { },
  scrollPosition,
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

  const splitNumber = useCallback((n: number): [number, number] => {
    if (!n) return [0, 0];

    return [Math.floor(n), Math.round((n % 1) * 100)]
  }, []);

  const tags: Array<ITag> = useMemo(() => {
    if (!tabComboType) return [];

    return tabComboType?.split(',').map((tag: string) => {
      const name = capitalizeWords(tag);
      const color = getColorByTag(tag);

      return { name, color };
    });
  }, [tabComboType]);

  const [priceLeft, priceRight] = useMemo(() => {
    if (!salePrice) return [0, 0];

    return splitNumber(salePrice);
  }, [salePrice, splitNumber])

  const priceOff: number = useMemo(() => {
    if (!salePrice || !retailPrice) return 0;

    return Math.ceil((1 - salePrice / retailPrice) * 100);
  }, [salePrice, retailPrice]);

  if (!product) return null;

  return (
    <Link
      // prefetch='intent'
      to={composeProductDetailURL({ productName: title, variationUUID: productUUID })}
    >
      <div className='
        flex flex-col
        max-w-xs
        w-full h-full
        border border-gray-200 rounded-lg
        p-1 md:p-2 lg:p-4
        relative
      '>
        {
          priceOff > showPriceOffThreshhold
            ? (
              <div className='
                absolute bg-[#D43B33]
                px-[6px] py-[4px] md:px-2 md:py-2
                top-0
                left-1 md:left-4
                flex flex-col justify-center items-center
                font-poppins
                rounded-b-lg
                text-white
                z-10
              '>
                <small className='font-bold'>{priceOff}%</small>
                <small className='font-medium mt-[-3px]'>OFF</small>
              </div>
            ) : null
        }

        <div className={`${loaded ? 'h-full' : 'h-[183px] md:h-[274px]'}`} >
          <LazyLoadComponent scrollPosition={scrollPosition} >
            <Image
              blurDataURL={`${loaded
                ? null
                : `${DOMAIN}/images/placeholder.svg`
                }`}
              placeholder={loaded ? 'empty' : 'blur'}
              placeholderAspectRatio={1}
              onLoadingComplete={(naturalDimensions) => {
                setLoaded(true);
              }}
              options={{
                contentType: MimeType.WEBP,
                fit: 'contain',
              }}
              className="
              aspect-square
              min-w-0 min-h-0
            "
              loaderUrl='/remix-image'
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
          </LazyLoadComponent>
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
        <div className='flex mb-3'>
          {
            tags.map((tag: ITag, index: number) => {
              if (!tag) return null;

              return (
                <div
                  className='
                    flex items-center
                    mr-1 md:mr-2
                    px-2 py-1 md:px-3
                    text-[10px] md:text-[12px]
                    rounded-[2px] md:rounded-[4px]
                    text-white font-medium uppercase'
                  key={`${title}_${tag.name}`}
                  style={{
                    background: tag.color
                  }}
                >
                  <b>{tag.name}</b>
                </div>
              );
            })
          }
        </div>

        {/* PRICING */}
        <div className='flex space-x-2 mr-auto mt-auto items-center my-2'>
          <div className='relative'>
            <span>{retailPrice}</span>
            <div className='block h-[1px] w-full bg-black absolute top-[10px]' />
          </div>
          <div className='flex font-bold text-[#D02E7D] space-x-[1px] '>
            <small className='text-lg'>£</small>
            <span className='font-poppins text-2xl'>{priceLeft}</span>
            <small className='text-lg'>{priceRight}</small>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div>
          <Button
            colorScheme='pink'
            variant={'solid'}
            width='100%'
            size="sm"
            onClick={() => onClickProduct(title, productUUID)}>
            {variations && variations.length > 1 ? 'See Options' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
};
