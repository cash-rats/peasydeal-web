import type { MouseEvent, KeyboardEvent, BaseSyntheticEvent } from 'react';
import type { AutocompleteApi, AutocompleteState, InternalAutocompleteSource } from '@algolia/autocomplete-core'
import { BsBox } from 'react-icons/bs';

import type { CategoryRecord } from '~/components/Algolia/types';

import { Highlight } from './Highlight';

interface CategoryHitsParams {
  items: CategoryRecord[];
  source: InternalAutocompleteSource<CategoryRecord>;
  state: AutocompleteState<CategoryRecord>
  autocomplete: AutocompleteApi<CategoryRecord, BaseSyntheticEvent, MouseEvent, KeyboardEvent>;
};

/*
 * - [x] Display header template from source
 * - [x] Format category items
 * - [ ] Redirect on click category
 */
function CategoriesHits({
  items,
  autocomplete,
}: CategoryHitsParams) {
  return (
    <section className="aa-Source">
      {/* Category header */}
      <div className="aa-SourceHeader">
        <span className="aa-SourceHeaderTitle">Categories</span>
        <div className="aa-SourceHeaderLine" />
      </div>


      {/* Category items */}
      <ul
        className="aa-List"
        {...autocomplete.getListProps()}
      >
        {
          items.map((item, index) => (
            <div key={index} className="aa-ItemWrapper p-1">
              <div className="aa-ItemContent">
                <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                  <BsBox fontSize={20} />
                </div>

                <div className="aa-ItemContentBody">
                  <div className="aa-ItemContentTitle">
                    <Highlight hit={item} attribute="label" />
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </ul>
    </section>
  );
};

export default CategoriesHits;