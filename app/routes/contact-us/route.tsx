import { useEffect, useRef, useState } from 'react';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useRouteLoaderData } from 'react-router';
import mapboxCss from 'mapbox-gl/dist/mapbox-gl.css?url';

import FormBold from '~/components/FormBold';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import type { RootLoaderData } from '~/root';
import { useCartCount } from '~/routes/hooks';
import { envs } from '~/utils/env';
import { getRootFBSEO_V2 } from '~/utils/seo';

const PAGE_TITLE = 'Contact Us | PeasyDeal';
const PAGE_DESC = 'If you have any questions or concerns, please do not hesitate to contact us. We would love to hear from you!';
const OFFICE_COORDS: [number, number] = [-0.1462043, 51.5217089]; // lng, lat

export const links: LinksFunction = () => [
  ...CatalogLayoutLinks(),
  { rel: 'stylesheet', href: mapboxCss },
];

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
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const cartCount = useCartCount();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Defer Mapbox initialization to the client to avoid SSR window references.
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || !envs.MAPBOX_BOX_ACCESS_TOKEN) return;

    let cancelled = false;

    (async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      mapboxgl.accessToken = envs.MAPBOX_BOX_ACCESS_TOKEN;

      if (cancelled) return;

      const container = mapContainerRef.current;
      if (!container) return;

      const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: OFFICE_COORDS,
        zoom: 15,
      });

      mapInstanceRef.current = map;

      new mapboxgl.Marker().setLngLat(OFFICE_COORDS).addTo(map);
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
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

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Address</h2>
            <p className="text-base text-slate-700">
              5th Floor 167 169 Great Portland Street, London, W1W 5PF, United Kingdom
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              {envs.MAPBOX_BOX_ACCESS_TOKEN ? (
                <div ref={mapContainerRef} className="h-[320px] w-full" />
              ) : (
                <p className="p-4 text-sm text-amber-700">
                  Map is unavailable because MAPBOX_BOX_ACCESS_TOKEN is not configured.
                </p>
              )}
            </div>
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
    </CatalogLayout>
  );
}
