import { BsLightningCharge } from 'react-icons/bs';
import { HiFire } from 'react-icons/hi';
import { BiTrendingDown } from 'react-icons/bi';
import { GiEmptyChessboard } from 'react-icons/gi';
import { MdFiberNew } from 'react-icons/md';

import type { Product } from "~/shared/types";

export interface IProductCard {
  loading?: boolean;
  product?: Product;
  onClickProduct?: (title: string, productID: string) => void;
  displayActionButton?: boolean;
  noPadding?: boolean;
}

/*
  Lazy load remix-image.
  w > 1024: 274x274
  768 < w < 1024: 302x302
  w < 768:  310x310

  Use LazyLoadComponent to lazy load remix image.
*/
export interface ITag {
  name: string;
  color: string;
  icon: any;
}

export const showPriceOffThreshhold = 30;

export const capitalizeWords = (str: string) => {
  if (!str) return '';

  let words = str.split('_');
  let newStr = '';

  for (let word of words) {
    newStr += word.charAt(0).toUpperCase() + word.substring(1).toLowerCase() + ' ';
  }

  return newStr.trim();
}

export const getColorByTag = (tag: string) => {
  switch (tag) {
    case 'new':
      return 'linkedin';
    case 'hot_deal':
      return 'pink';
    case 'super_deal':
      return 'cyan';
    case 'price_off':
      return 'red';
    default:
      return '#2D91FF';
  }
}

export const getLeftIconByTag = (tag: string) => {
  switch (tag) {
    case 'new':
      return MdFiberNew;
    case 'hot_deal':
      return HiFire;
    case 'super_deal':
      return BsLightningCharge;
    case 'price_off':
      return BiTrendingDown;
    default:
      return GiEmptyChessboard;
  }
}