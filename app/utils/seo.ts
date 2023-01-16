import getEnvSource from '~/utils/get_env_source';
import { getLogoURL } from '~/utils';

interface FBSEO {
  'og:url': string;
  'og:type': string;
  'og:title': string;
  'og:description': string;
  'og:image': string;
  'og:locale': string;
}

declare global {
  interface Window {
    ENV: {
      ENV: {
        STRIPE_PUBLIC_KEY: string;
        DOMAIN: string;
      }
    }
  }
}

// ------------------ SEO ------------------
export const getCanonicalDomain = (): string => getEnvSource().DOMAIN || 'https://peasydeal.com';

// SEO index page
export const getIndexTitleText = () => 'peasydeal.com | premium selected car accessories, gadgets, home & gardening products, clothes and more at a great price!';
export const getIndexDescText = () => `PeasyDeal makes your shopping experience a breeze. Premium selected solar-powered lights, gadgets, home & gardening products, apparel and more at a best price possible. Responsive customer service, fast processing and shipping time.`;

// SEO collection page
export const getCollectionTitleText = (category: string) => `${category} | peasydeal.com`;
export const getCollectionDescText = (category: string) => `${category} | Hot Deals | Shop for Hot Deals and more at everyday discount price with FREE SHIPPING on all Products to celebrate PeasyDeal's Grant Opening!!`;

// SEO prod page
export const getProdDetailTitleText = (title: string, uuid: string) => `${title} - peasydeal.com - ${uuid}`;
export const getProdDetailDescTextWithoutPrice = (title: string) => `Shop for ${title} and more at everyday discount price with FREE SHIPPING on all Products to celebrate PeasyDeal's Grant Opening!!`
export const getProdDetailDescText = (title: string, retailPrice: number, salePrice: number) => `£${salePrice} instead of £${retailPrice} for ${title} – save 36 % Shop for ${title} and more at everyday discount price with FREE SHIPPING on all Products to celebrate PeasyDeal's Grant Opening!!.`;

// SEO tracking page
export const getTrackingTitleText = () => 'Track Order | peasydeal.com';
export const getTrackingDescText = () => 'track your order delivering status with the order id. Order id was sent to your email address by contact@peasydeal.com after you\'ve made the payment.';

// SEO cart page
export const getCartTitleText = () => 'Shopping Cart| peasydeal.com';
// ------------------ END SEO ------------------

// Root FBSEO tags
// TODO: missing facebook fb:app_id.
export const getRootFBSEO = (): FBSEO => ({
  'og:url': getCanonicalDomain(),
  'og:type': 'website',
  'og:title': getIndexTitleText(),
  'og:description': getIndexDescText(),
  'og:image': getLogoURL(),
  'og:locale': 'en_GB',
});

export const getCategoryFBSEO = ({ title, desc }: { title: string, desc: string }): FBSEO => ({
  ...getRootFBSEO(),
  'og:title': title,
  'og:description': desc,
})

export const getProdDetailFBSEO = ({
  title,
  desc,
  image
}: { title: string, desc: string, image: string }): FBSEO => ({
  ...getRootFBSEO(),
  'og:title': title,
  'og:description': desc,
  'og:image': image,
});

export const getCartFBSEO = (title: string): FBSEO => ({
  ...getRootFBSEO(),
  'og:title': title,
});

export const getTrackingFBSEO = (): FBSEO => {
  console.log('debug getTrackingFBSEO', getTrackingTitleText());
  return {
    ...getRootFBSEO(),
    'og:title': getTrackingTitleText(),
  }
};