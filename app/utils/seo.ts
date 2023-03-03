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


// ------------------ SEO ------------------
export const getCanonicalDomain = (): string => getEnvSource().DOMAIN || 'https://peasydeal.com';

// 404 page
// Object indicates the "thing" that is not found.
export const getFourOhFourTitleText = (object?: string) => {
  return `404 Error - ${object || 'Page'} Not Found`
};
export const getFourOhFourDescText = (object?: string) => {
  return `Oops! We couldn't find the ${object || 'page'} you were looking for. Please check the URL or navigate to our homepage.`;
}

// SEO index page
export const getIndexTitleText = () => 'peasydeal.com | premium selected car accessories, gadgets, home & gardening products, clothes and more at a great price!';
export const getIndexDescText = () => `Shop with confidence at PeasyDeal with our premium selected solar-powered lights, gadgets, home & gardening products, apparel and more at a best price possible. Responsive customer service, fast shipping time. Get 14 days money-back guarantee on all products!`;

// SEO collection page
export const getCollectionTitleText = (category: string) => `${category} | peasydeal.com`;
export const getCollectionDescText = (category: string, desc?: string) => {
  return `${category} | ${desc || `Shop for ${category} and more at everyday discount price`}`;
}

// SEO prod page
export const getProdDetailTitleText = (title: string, uuid: string) => `${title} - PeasyDeal - ${uuid}`;
export const getProdDetailDescTextWithoutPrice = (title: string) => `Shop for ${title} and more at everyday discount price`
export const getProdDetailDescText = (title: string, retailPrice: number, salePrice: number) => `£${salePrice} instead of £${retailPrice} for ${title} – save ${(1 - Number((salePrice / retailPrice).toFixed(2))) * 100} % Shop for ${title} and more at everyday discount price. Responsive customer service, fast shipping time. Get 14 days money-back guarantee on all products!`;

// SEO tracking page
export const getTrackingTitleText = () => 'Track Order | peasydeal.com';
export const getTrackingDescText = () => 'track your order delivering status with the order id. Order id was sent to your email address by contact@peasydeal.com after you\'ve made the payment.';

// SEO cart page
export const getCartTitleText = () => 'Shopping Cart| peasydeal.com';

// SEO privacy page
export const getPrivacyTitleText = () => 'Privacy | peasydeal.com';

// SEO contact us page
export const getContactTitleText = () => 'Contact us | peasydeal.com';

// SEO about us page
export const getAboutUsTitleText = () => 'About Us | peasydeal.com';

// SEO return policy page
export const getReturnPolicyTitleText = () => 'Return Policy | peasydeal.com';

// SEO shipping policy page
export const getShippingPolicyTitleText = () => 'Shipping Policy | peasydeal.com';

// SEO terms of use page
export const getTermsOfUseTitleText = () => 'Terms of Use | peasydeal.com';

// SEO sell with Us page
export const getWholesaleTitleText = () => 'Terms of Use | peasydeal.com';

// ------------------ END SEO ------------------


// ------------------ OG tags ------------------
// TODO: missing facebook fb:app_id.
export const getRootFBSEO = (): FBSEO => ({
  'og:url': getCanonicalDomain(),
  'og:type': 'website',
  'og:title': getIndexTitleText(),
  'og:description': getIndexDescText(),
  'og:image': getLogoURL(),
  'og:locale': 'en_GB',
});

export const getCategoryFBSEO = (category: string, desc?: string): FBSEO => ({
  ...getRootFBSEO(),
  'og:title': getCollectionTitleText(category),
  'og:description': getCollectionDescText(category, desc),
})

export const getProdDetailOgSEO = ({
  title,
  desc,
  image,
  url,
}: {
  title: string,
  desc: string,
  image: string,
  url: string
}): FBSEO => ({
  ...getRootFBSEO(),
  'og:url': url,
  'og:title': title,
  'og:description': desc,
  'og:image': image,
});

export const getCartFBSEO = (): FBSEO => ({
  ...getRootFBSEO(),
  'og:title': getCartTitleText(),
});

export const getTrackingFBSEO = (): FBSEO => ({
  ...getRootFBSEO(),
  'og:title': getTrackingTitleText(),
});

export const getPrivacyFBSEO = () => ({
  ...getRootFBSEO(),
  'og:title': getPrivacyTitleText(),
})

export const getContactUsFBSEO = () => ({
  ...getRootFBSEO(),
  'og:title': getContactTitleText(),
});

export const getAboutUsFBSEO = () => ({
  ...getRootFBSEO(),
  'og:title': getAboutUsTitleText(),
});


export const getReturnPolicyFBSEO = () => ({
  ...getRootFBSEO(),
  'og:title': getReturnPolicyTitleText(),
});

export const getShippingPolicyFBSEO = () => ({
  ...getRootFBSEO(),
  'og:title': getShippingPolicyTitleText(),
});

export const getTermsOfUseFBSEO = () => ({
  ...getRootFBSEO(),
  'og:title': getTermsOfUseTitleText(),
});

export const getWholeSaleFBSEO = () => ({
  ...getRootFBSEO(),
  'og:title': getWholesaleTitleText(),
});
