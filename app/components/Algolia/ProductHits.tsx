import type { MouseEvent, KeyboardEvent, BaseSyntheticEvent } from 'react';
import type { AutocompleteApi, InternalAutocompleteSource } from '@algolia/autocomplete-core';
import { BiSearch as SearchIcon } from 'react-icons/bi';
import { IoIosReturnLeft as Return } from 'react-icons/io'
import { Link } from '@remix-run/react';

import type { AlgoliaIndexItem } from '~/components/Algolia/types';

import { Highlight } from './Highlight';

interface ProductHitParams {
  items: AlgoliaIndexItem[];
  source: InternalAutocompleteSource<AlgoliaIndexItem>;
  autocomplete: AutocompleteApi<AlgoliaIndexItem, BaseSyntheticEvent, MouseEvent, KeyboardEvent>;
}

function ProductHit({
  items,
  autocomplete,
  source,
}: ProductHitParams) {
  return (
    <section className="aa-Source">
      <ul
        className="aa-List"
        {...autocomplete.getListProps()}
      >
        {
          items.map(item => (
            <Link
              to={`/search?query=${encodeURIComponent(item.title)}`}
              key={item.objectID}
              onClick={() => {
                window.rudderanalytics?.track('search_action_product_hit', {
                  query: item.title,
                });
              }}
            >
              <li
                className="aa-Item"
                {...autocomplete.getItemProps({ item, source })}
              >
                <div className="aa-ItemWrapper">
                  <div className="aa-ItemContent">
                    <div className="">
                      <SearchIcon fontSize={22} />
                    </div>
                    <div className="flex flex-row justify-start items-center">
                      <div className="aa-ItemContentTitle m-0">
                        <Highlight hit={item} attribute="name" />
                      </div>
                      <div className="aa-ItemContentDescription">
                        <strong>{item.title}</strong>
                        {/* <strong>{item.categories[0]}</strong> */}
                      </div>
                    </div>
                  </div>
                  <div className="aa-ItemActions">
                    <button
                      className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                      type="button"
                      title="Select"
                      style={{ pointerEvents: 'none' }}
                    >
                      <Return />
                    </button>
                  </div>
                </div>
              </li>
            </Link>
          ))

        }
      </ul>
    </section>
  );
}

export default ProductHit;