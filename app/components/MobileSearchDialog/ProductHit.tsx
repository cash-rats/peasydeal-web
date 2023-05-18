import type { MouseEvent, KeyboardEvent, BaseSyntheticEvent } from 'react';
import type { AutocompleteApi, InternalAutocompleteSource } from '@algolia/autocomplete-core';
import { BiSearch as SearchIcon } from 'react-icons/bi';
import { IoIosReturnLeft as Return } from 'react-icons/io'

import type { AlgoliaIndexItem } from '~/components/Algolia/types';

import { Highlight } from './Highlight';

interface ProductHitParams {
  item: AlgoliaIndexItem;
  source: InternalAutocompleteSource<AlgoliaIndexItem>;
  autocomplete: AutocompleteApi<AlgoliaIndexItem, BaseSyntheticEvent, MouseEvent, KeyboardEvent>;
}

function ProductHit({ item, autocomplete, source }: ProductHitParams) {
  return (
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
              <strong>{item.title}</strong> in{' '}
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
  );
}

export default ProductHit;