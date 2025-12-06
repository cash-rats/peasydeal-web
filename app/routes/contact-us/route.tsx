import type { MetaFunction } from 'react-router';

import FormBold from '~/components/FormBold';
import { envs } from '~/utils/env';
import { getRootFBSEO_V2 } from '~/utils/seo';

const PAGE_TITLE = 'Contact Us | PeasyDeal';
const PAGE_DESC = 'If you have any questions or concerns, please do not hesitate to contact us. We would love to hear from you!';

export const meta: MetaFunction = () => {
  return getRootFBSEO_V2().map(tag => {
    if (!('property' in tag)) return tag;

    if (tag.property === 'og:title') {
      tag.content = PAGE_TITLE;
    }

    if (tag.property === 'og:description') {
      tag.content = PAGE_DESC;
    }

    return tag;
  });
};

export default function ContactUs() {
  const mapSrc = envs.GOOGLE_MAP_API_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${envs.GOOGLE_MAP_API_KEY}&center=51.5217089,-0.1462043&zoom=15&q=5th%2BFloor%2C%2B167%2C%2B169%2BGreat%2BPortland%2BSt%2C%2BLondon%2BW1W%2B5PF%2C%2BUK`
    : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Support
        </p>
        <h1 className="text-3xl font-semibold text-slate-800 sm:text-4xl">
          Contact Us
        </h1>
        <p className="text-lg leading-7 text-slate-700">
          {PAGE_DESC}
        </p>
      </header>

      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Email</h2>
          <a
            className="inline-flex items-center gap-2 text-base font-medium text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700"
            aria-label="Email PeasyDeal support"
            href="mailto:contact@peasydeal.com"
          >
            contact@peasydeal.com
          </a>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Phone</h2>
          <p className="text-base text-slate-700">+44 745 8149 925</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Address</h2>
          <p className="text-base text-slate-700">
            5th Floor 167 169 Great Portland Street, London, W1W 5PF, United Kingdom
          </p>
          {mapSrc ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <iframe
                title="PeasyDeal London Office"
                className="h-[320px] w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapSrc}
                allowFullScreen
              />
            </div>
          ) : (
            <p className="text-sm text-amber-700">
              Map is unavailable because GOOGLE_MAP_API_KEY is not configured.
            </p>
          )}
        </section>

        <section className="space-y-2 rounded-xl bg-slate-50 p-4">
          <h2 className="text-base font-semibold text-slate-900">Opening Times (excluding bank holidays)</h2>
          <p className="text-base text-slate-700">Monday - Friday: 9am - 5pm</p>
          <p className="text-base text-slate-700">Weekend: Closed</p>
        </section>

        <p className="text-sm text-slate-600">
          Whilst every effort is made to respond to all messages as soon as possible, during busy periods this could
          take up to 3 working days.
        </p>
      </article>

      <FormBold />
    </div>
  );
}
