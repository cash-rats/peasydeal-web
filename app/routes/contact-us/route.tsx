import { useEffect, useRef, useState, useMemo } from 'react';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useRouteLoaderData } from 'react-router';
import mapboxCss from 'mapbox-gl/dist/mapbox-gl.css?url';

import FormBold from '~/components/FormBold';
import { V2Layout } from '~/components/v2/GlobalLayout';
import type { RootLoaderData } from '~/root';
import { Breadcrumbs } from '~/components/v2/Breadcrumbs';
import { PageTitle } from '~/components/v2/PageTitle';
import { envs } from '~/utils/env';
import { getRootFBSEO_V2 } from '~/utils/seo';

const PAGE_TITLE = 'Contact Us | PeasyDeal';
const PAGE_DESC = 'If you have any questions or concerns, please do not hesitate to contact us. We would love to hear from you!';
const OFFICE_COORDS: [number, number] = [-0.1462043, 51.5217089]; // lng, lat

export const links: LinksFunction = () => [
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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  const breadcrumbs = useMemo(
    () => [{ label: 'Home', href: '/' }, { label: 'Contact Us' }],
    []
  );

  useEffect(() => {
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
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <div className="v2 max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
        <PageTitle
          title="Contact Us"
          subtitle={PAGE_DESC}
        />

        <div className="max-w-[780px] mx-auto space-y-8">
          <article className="space-y-6 rounded-rd-lg border border-rd-border bg-rd-bg-card p-6 redesign-sm:p-8">
            <section className="space-y-2">
              <h2 className="font-heading text-lg font-semibold text-black">Email</h2>
              <a
                className="inline-flex items-center gap-2 font-body text-base font-medium text-black underline underline-offset-2 transition-colors hover:text-rd-text-body"
                aria-label="Email PeasyDeal support"
                href="mailto:contact@peasydeal.com"
              >
                contact@peasydeal.com
              </a>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-lg font-semibold text-black">Address</h2>
              <p className="font-body text-base text-rd-text-body">
                5th Floor 167 169 Great Portland Street, London, W1W 5PF, United Kingdom
              </p>
              <div className="overflow-hidden rounded-rd-md border border-rd-border">
                {envs.MAPBOX_BOX_ACCESS_TOKEN ? (
                  <div ref={mapContainerRef} className="h-[320px] w-full" />
                ) : (
                  <p className="p-4 font-body text-sm text-rd-text-body">
                    Map is unavailable because MAPBOX_BOX_ACCESS_TOKEN is not configured.
                  </p>
                )}
              </div>
            </section>

            <p className="font-body text-sm text-rd-text-body">
              Whilst every effort is made to respond to all messages as soon as possible, during busy periods this could
              take up to 3 working days.
            </p>
          </article>

          <FormBold />
        </div>
      </div>
    </V2Layout>
  );
}
