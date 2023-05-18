import type { MouseEvent, KeyboardEvent, BaseSyntheticEvent } from 'react';
import type { AutocompleteApi, AutocompleteState, InternalAutocompleteSource } from '@algolia/autocomplete-core'
import { BsBox } from 'react-icons/bs';
import { Link } from '@remix-run/react';

import { DOMAIN } from '~/utils/get_env_source';
import { transformCategoryLabelToName } from '~/utils';
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
 * - [x] Redirect on click category
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
            <Link key={index} to={`${DOMAIN}/collection/${transformCategoryLabelToName(item.label)}`}>
              <div className="aa-ItemWrapper p-1">
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
            </Link>
          ))
        }
      </ul>
    </section>
  );
};

export default CategoriesHits;