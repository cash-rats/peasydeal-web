import getEnvSource from '~/utils/get_env_source';
import { getLogoURL } from '~/utils';
import { round10 } from '~/utils/preciseRound';

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
  return `404 Error - ${object || 'Page'} Not Found | PeasyDeal Up to 65% Off on Electronic, Home Supplies, and More! Shop Now and Save Big!`
};
export const getFourOhFourDescText = (object?: string) => {
  return `Oops! We couldn't find the ${object || 'page'} you were looking for. Please check the URL or navigate to our homepage.`;
}

// SEO index page
export const getIndexTitleText = () =>
  'PeasyDeal | Up to 65% Off on Electronic, Home Supplies, and More!"';
export const getIndexDescText = () =>
  `Hurry up, limited time free shipping! Discover weekly updated deals on the latest gadgets, home decor, apparel, and more at PeasyDeal.` +
  `Shop now for fast shipping, easy returns, and 14-day money-back guarantee.`;

// SEO collection page
export const getCollectionTitleText = (category: string) =>
  `Up to 65% Off on ${category} | PeasyDeal`;
export const getCollectionDescText = (category: string, desc?: string) => {
  return `${category} | ${(desc || '') + `Find the Latest ${category} deals at PeasyDeal. Shop Now and Save Big! Hurry up, limited time free shipping!`}`;
}

// SEO prod page
export const getProdDetailTitleText = (title: string, uuid: string) =>
  `Shop ${title} | Save Up to 65% with PeasyDeal!`;
export const getProdDetailDescTextWithoutPrice = (title: string, category: string) =>
  `Save Up to 65% with PeasyDeal! Upgrade Your ${category} Game with PeasyDeal. 14 days money-back guarantee`
export const getProdDetailDescText = (title: string, retailPrice: number, salePrice: number, category: string) =>
  `Buy for Only £${salePrice} at PeasyDeal! Save up to ${round10((1 - Number((salePrice / retailPrice).toFixed(2))) * 100, -2)
  }%, plus limited free shipping!` +
  `Upgrade Your ${category} Game with PeasyDeal. 14 days money-back guarantee`;

// SEO tracking page
export const getTrackingTitleText = () => 'Track Order | PeasyDeal';
export const getTrackingDescText = () => 'track your order delivering status with the order id. Order id was sent to your email address by contact@peasydeal.com after you\'ve made the payment.';

// SEO cart page
export const getCartTitleText = () => 'Shopping Cart| PeasyDeal';

// SEO privacy page
export const getPrivacyTitleText = () => 'Privacy | PeasyDeal';

// SEO contact us page
export const getContactTitleText = () => 'Contact us | PeasyDeal';

// SEO about us page
export const getAboutUsTitleText = () => 'About Us | PeasyDeal';

// SEO return policy page
export const getReturnPolicyTitleText = () => 'Return Policy | PeasyDeal';

// SEO shipping policy page
export const getShippingPolicyTitleText = () => 'Shipping Policy | PeasyDeal';

// SEO terms of use page
export const getTermsOfUseTitleText = () => 'Terms of Use | PeasyDeal';

// SEO sell with Us page
export const getWholesaleTitleText = () => 'Terms of Use | PeasyDeal';

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
