/**
 * This component render the modulared products
 * into a product grid
 */
import { useState, useMemo, useCallback } from 'react';
import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { LazyLoadComponent } from "react-lazy-load-image-component";
import Image, { MimeType } from "remix-image"
import { Tag, TagLeftIcon } from '@chakra-ui/react';
import { composeProductDetailURL } from '~/utils';
import { round10 } from '~/utils/preciseRound';
import {
  capitalizeWords,
  getColorByTag,
  getLeftIconByTag,
  showPriceOffThreshhold,
} from './utils';

import type {
  IProductCard,
  ITag,
} from './utils';

import { DOMAIN } from '~/utils/get_env_source';

import { Button } from '@chakra-ui/react'
import llimageStyle from 'react-lazy-load-image-component/src/effects/blur.css';
import extra10 from '~/images/extra10.png';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: llimageStyle }];
}

const SUPER_DEAL_OFF = 0.9;

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

export default function ProductCard({
  product,
  onClickProduct = () => { },
  scrollPosition,
  displayActionButton = true,
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

  const splitNumber = useCallback((n: number): [number, number] => {
    if (!n) return [0, 0];

    return [Math.floor(n), Math.round((n % 1) * 100)]
  }, []);

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

  const [priceLeft, priceRight] = useMemo(() => {
    if (!salePrice) return [0, 0];

    return splitNumber(salePrice);
  }, [salePrice, splitNumber])

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
        bg-white
        relative
      '>
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

        <div className={`${loaded ? 'h-full' : 'h-[183px] md:h-[274px]'}`} >
          <LazyLoadComponent scrollPosition={scrollPosition} >
            <Image
              blurDataURL={`${loaded
                ? `${DOMAIN}/images/placeholder_transparent.png`
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
        <div className='flex mb-3 flex-wrap gap-1 md:gap-2'>
          {
            tags.map((tag: ITag, index: number) => {
              if (!tag) return null;

              return (
                <>
                  <Tag
                    colorScheme={tag.color}
                    variant='solid'
                    className="nowrap"
                    key={`tag_${tag.name}_${tag.color}`}
                    variant='subtle'
                  >
                    <TagLeftIcon boxSize='12px' as={tag.icon} />
                    <span>{tag.name}</span>
                  </Tag>
                </>
              );
            })
          }
        </div>

        {/* PRICING */}
        <div className='flex space-x-2 mr-auto mt-auto items-center my-2'>
          { PriceRowMemo }
        </div>

        {/* ACTION BUTTON */}
        {
          displayActionButton && (
            <div className='hidden md:flex'>
              <Button
                colorScheme='pink'
                variant={'solid'}
                width='100%'
                size="sm"
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
