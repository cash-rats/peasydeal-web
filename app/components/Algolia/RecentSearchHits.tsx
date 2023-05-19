import { Link } from '@remix-run/react';
import { RxCounterClockwiseClock as RecentSearch } from 'react-icons/rx';
import type { MouseEvent, KeyboardEvent, BaseSyntheticEvent } from 'react';
import type { AutocompleteApi, InternalAutocompleteSource } from '@algolia/autocomplete-core';

import type { RecentSearchHit } from './types';
import { Highlight } from './Highlight';

interface RecentSearchHitsParams {
  items: RecentSearchHit[];
  source: InternalAutocompleteSource<RecentSearchHit>;
  autocomplete: AutocompleteApi<RecentSearchHit, BaseSyntheticEvent, MouseEvent, KeyboardEvent>;
};

function RecentSearchHits({ items, source, autocomplete }: RecentSearchHitsParams) {
  return (
    <section className="aa-Source">
      {/* Recent searchs header */}
      <div className="aa-SourceHeader">
        <span className="aa-SourceHeaderTitle">Recent searches</span>
        <div className="aa-SourceHeaderLine" />
      </div>

      {/* Recent searches */}
      <ul
        className="aa-List"
        {...autocomplete.getListProps()}
      >
        {
          items.map((item, index) => (
            <Link to={`/search?query=${encodeURIComponent(item.label)}`} key={index}>
              <div className="aa-ItemWrapper p-1">
                <div className="aa-ItemContent">
                  <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                    <RecentSearch fontSize={20} />
                  </div>

                  <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                      <Highlight hit={item} attribute="label" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        }
      </ul>
    </section>
  );
};

export default RecentSearchHits;
