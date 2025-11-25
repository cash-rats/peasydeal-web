import type { MouseEvent, KeyboardEvent, BaseSyntheticEvent } from 'react';
import type { AutocompleteApi, InternalAutocompleteSource } from '@algolia/autocomplete-core'
import { BsBox } from 'react-icons/bs';
import { Link } from 'react-router';

import type { CategoryRecord } from '~/components/Algolia/types';

import { Highlight } from './Highlight';

interface CategoryHitsParams {
  items: CategoryRecord[];
  source: InternalAutocompleteSource<CategoryRecord>;
  autocomplete: AutocompleteApi<CategoryRecord, BaseSyntheticEvent, MouseEvent, KeyboardEvent>;
};

type CatInfo = {
  type: string;
  name: string;
  label: string;
}

/**
 * Decompose category string sent from algolia index string.
 * Algolia category index string is structured as:
 *
 * {type}:{name}:{label}
 *
 * This function decompose above structure to use it properly.
 */
const decomposeCategoryString = (catStr: string): CatInfo | null => {
  let segs = catStr.split(":");

  if (segs.length === 0 || segs.length === 1) {
    console.error('invalid algolia category string format', catStr)
    return null
  }


  if (segs.length === 2) {
    console.error('invalid algolia category string format', catStr)
    segs[2] = segs[1];
  }

  return {
    type: segs[0],
    name: segs[1],
    label: segs[2],
  };
}

const getCategoryUrl = (catInfo: CatInfo): string => {
  return `${catInfo.type === "promotion"
    ? 'promotion'
    : 'collection'
    }/${catInfo.name}`;
}

/**
 * - [x] Display header template from source
 * - [x] Format category items
 * - [x] Redirect on click category
 * - [x] Split category string by `:` deliminator. {type}:{name}:{label}
 */
export function CategoryHits({
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
          items.map((item, index) => {
            const catInfo = decomposeCategoryString(item.label);

            if (catInfo === null) {
              return null
            }

            return (
              <Link
                key={index}
                to={getCategoryUrl(catInfo)}
                onClick={() => {
                  window.rudderanalytics?.track('search_action_category_hit', {
                    query: catInfo,
                  });
                }}
              >
                <div className="aa-ItemWrapper p-1">
                  <div className="aa-ItemContent">
                    <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                      <BsBox fontSize={20} />
                    </div>

                    <div className="aa-ItemContentBody">
                      <div className="aa-ItemContentTitle">
                        <Highlight hit={catInfo} attribute="label" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        }
      </ul>
    </section>
  );
};

export default CategoryHits;
