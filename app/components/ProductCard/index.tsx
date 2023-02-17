import PromotionCard from "./PromotionCard";
import RegularCardWithActionButton from "./RegularCardWithActionButton";

import type { LinksFunction } from '@remix-run/node';
import llimageStyle from 'react-lazy-load-image-component/src/effects/blur.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: llimageStyle }];
}

export { PromotionCard, RegularCardWithActionButton };

