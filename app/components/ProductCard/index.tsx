/**
 * This component render the modulared products
 * into a product grid
 */
import { useState, useMemo, useCallback } from 'react';
import { Link } from '@remix-run/react';
import type { ScrollPosition } from 'react-lazy-load-image-component';
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { Product } from "~/shared/types";
import { composeProductDetailURL } from '~/utils';

import { Button } from '@chakra-ui/react'
import 'react-lazy-load-image-component/src/effects/blur.css';


interface IProductCard {
  product?: Product;
  scrollPosition?: ScrollPosition;
  onClickProduct?: (title: string, productID: string) => void;
}

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
  switch(tag) {
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
	onClickProduct = () => {},
  scrollPosition,
}: IProductCard) {
  const {
    main_pic: mainPic,
    title = '',
    retailPrice,
    salePrice,
    productUUID = '',
    tabComboType = ''
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

  console.log(product, tags, priceOff);

  const bgImage = loaded ? { backgroundImage: `url('${mainPic}')` } : {};


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
        <div
          className={`
            ${loaded ? 'block' : 'hidden'}
            aspect-square
            image-container bg-contain bg-center bg-no-repeat
          `}
          style={bgImage}
        />

        {
          priceOff > showPriceOffThreshhold
            ? (
              <div className='
                absolute bg-[#D43B33]
                p-2 top-0 left-4 w-12
                flex flex-col justify-center items-center
                font-poppins
                rounded-b-lg
                text-white
              '>
                <small className='font-bold'>{ priceOff }%</small>
                <small className='font-medium mt-[-3px]'>OFF</small>
              </div>
            ) : null
        }

        <LazyLoadImage
          wrapperClassName={`
            ${loaded ? '!hidden' : 'aspect-square w-full h-full'}
          `}
          effect="blur"
          threshold={200}
          afterLoad={() => { setLoaded(true); }}
          alt={title}
          scrollPosition={scrollPosition}
          src={mainPic}
          placeholder={
            <div className='block w-full h-full bg-[#efefef] animate-pulse aspect-square'
          />}
        />

        {/* SELL TAGS */}
        <div className='flex mt-3'>
          {
            tags.map((tag: ITag, index: number) => {
              if (!tag) return null;

              return (
                <div
                  className='flex items-center mr-2 px-3 py-1 rounded-[4px] text-white font-bold uppercase'
                  key={`${title}_${tag.name}`}
                  style={{
                    background: tag.color
                  }}
                >
                  <small>{tag.name}</small>
                </div>
              );
            })
          }
        </div>

        {/* TITLES */}
        <p className='font-poppins font-medium my-2.5'>{title}</p>

        {/* PRICING */}
        <div className='flex space-x-2 mr-auto mt-auto items-center my-2'>
          <div className='relative'>
            <span>{retailPrice}</span>
            <div className='block h-[1px] w-full bg-black absolute top-[10px]'/>
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
            colorScheme='pink' variant='solid' width='100%'
            onClick={() => onClickProduct(title, productUUID)}>
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

