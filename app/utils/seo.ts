import type { V2_ServerRuntimeMetaDescriptor } from '@remix-run/server-runtime';

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
export const getCanonicalDomain = (): string => getEnvSource()?.DOMAIN || 'https://www.peasydeal.com';

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
  'PeasyDeal | Save Up to 65% on Electronics, Home Supplies & More';

export const getIndexDescText = () =>
  'Shop limited-time deals on gadgets, home decor, apparel, and more at PeasyDeal. Fast shipping, easy returns, and 14-day money-back guarantee.';

// SEO collection page
export const getCollectionTitleText = (category: string) =>
  `Save Up to 65% on ${category} | PeasyDeal`;

export const getCollectionDescText = (category: string, desc?: string) => {
  return `${category} | Find the latest deals at PeasyDeal. Shop now and save big! Limited-time free shipping.`;
}

// SEO prod page
export const getProdDetailTitleText = (title: string, uuid: string) =>
  `Shop ${title} | Save Up to 65% | PeasyDeal`;

export const getProdDetailDescTextWithoutPrice = (title: string, category: string) =>
  `Upgrade your ${category} with PeasyDeal. Save up to 65% and enjoy our 14-day money-back guarantee.`;

export const getProdDetailDescText = (title: string, retailPrice: number, salePrice: number, category: string) =>
  `Only £${salePrice} at PeasyDeal! Save up to ${round10((1 - Number((salePrice / retailPrice).toFixed(2))) * 100, -2)
  }% with limited free shipping. Upgrade your ${category} and enjoy our 14-day money-back guarantee.`;


// SEO tracking page
export const getTrackingTitleText = () => 'Track Order | PeasyDeal';
export const getTrackingDescText = () => 'track your order delivering status with the order id. Order id was sent to your email address by contact@peasydeal.com after you\'ve made the payment.';

// SEO cart page
export const getCartTitleText = () => 'Shopping Cart | PeasyDeal';

// SEO cart page
export const getCheckoutTitleText = () => 'Secure Checkout | PeasyDeal';

// SEO cart page
export const getPaymentSuccessTitleText = () => 'Payment Success! Thank you for shopping with us | PeasyDeal';

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

export const getRootFBSEO_V2 = (): V2_ServerRuntimeMetaDescriptor[] => {
  return [
    {
      tagName: 'meta',
      property: 'og:url',
      content: getCanonicalDomain(),
    },
    {
      tagName: 'meta',
      property: 'og:type',
      content: 'website',
    },
    {
      tagName: 'meta',
      property: 'og:title',
      content: getIndexTitleText(),
    },
    {
      tagName: 'meta',
      property: 'og:description',
      content: getIndexDescText(),
    },
    {
      tagName: 'meta',
      property: 'og:image',
      content: getLogoURL(),
    },
    {
      tagName: 'meta',
      property: 'og:locale',
      content: 'en_GB',
    },
  ];
};

export const getCategoryFBSEO = (category: string, desc?: string): FBSEO => ({
  ...getRootFBSEO(),
  'og:title': getCollectionTitleText(category),
  'og:description': getCollectionDescText(category, desc),
})

export const getCategoryFBSEO_V2 = (category: string, desc?: string) => {
  return getRootFBSEO_V2().map(tag => {
    if (tag.tagName === 'og:title') {
      return {
        tagName: 'meta',
        name: 'og:title',
        content: getCollectionTitleText(category),
      };
    }

    if (tag.tagName === 'og:description') {
      return {
        tagName: 'meta',
        name: 'og:description',
        content: getCollectionDescText(category, desc)
      };
    }

    return tag;
  });
};

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

export const getCartFBSEO_V2 = (): V2_ServerRuntimeMetaDescriptor[] => {
  return getRootFBSEO_V2().map((tag) => {
    return tag.property === 'og:title'
      ? {
        tagName: 'meta',
        property: 'og:title',
        content: getCartTitleText(),
      }
      : tag;
  });
};



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
