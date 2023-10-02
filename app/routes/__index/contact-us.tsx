import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import { getRootFBSEO_V2 } from '~/utils/seo';
import styles from './styles/StaticPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const meta: V2_MetaFunction = () => {
  return getRootFBSEO_V2()
    .map(tag => {
      if (!('property' in tag)) return tag;

      if (tag.property === 'og:title') {
        tag.content = 'Contact Us | PeasyDeal';
      }

      if (tag.property === 'og:description') {
        tag.content = 'If you have any questions or concerns, please do not hesitate to contact us. We would love to hear from you!';
      }

      return tag;
    });
};

export default function AboutUs() {
  return (
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <div className="peasydeal-v1 pt-4">
        <h1 className="uppercase">
          Contact Us
        </h1>
      </div>
      <article className="peasydeal-v1 pt-8 rounded-xl border-2 p-8">
        <p className="py-4">If you have any questions or concerns, please do not hesitate to contact us. We would love to hear from you, contact us via:</p>
        <section>
          <h3 className="pt-4 pb-0 text-lg">Email</h3>
          <p>
            <a
              className="flex flex-cols"
              aria-label='track order'
              href="mailto:contact@peasydeal.com"
            >
              contact@peasydeal.com
            </a>
          </p>
        </section>

        <section>
          <h3 className="pt-4 pb-0 text-lg">Address</h3>
          <p>
            5th Floor 167 169 Great Portland Street, London, W1W 5PF, United Kingdom
          </p>
        </section>

        <section>
          <h3 className="pt-4 pb-0 text-lg">Phone</h3>
          <p>
            020 4577 3092
          </p>
        </section>

        <blockquote className='text-left'>
          <b>Opening Times: (excluding bank holidays)</b>
          <p>Monday - Friday 9am - 5pm</p>
          <p>Weekend - Closed</p>
        </blockquote>

        <small>Whilst every effort is made to respond to all messages as soon as possible, during busy periods this could take up to 3 working days.</small>

      </article>
    </div>
  );
}