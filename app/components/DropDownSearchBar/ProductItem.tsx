import type { AutocompleteComponents } from '@algolia/autocomplete-shared';
import { BsSearch } from 'react-icons/bs';

import type { AlgoliaIndexItem } from './types';
interface ProductItemParams {
  hit: AlgoliaIndexItem;
  components: AutocompleteComponents;
};

/**
 * We want to display hit products and categories.
 *
 * - [ ] Display hit highlight
 * - [ ] Display product image
 * - [ ] Display category
 */
export function ProductItem({ hit, components }: ProductItemParams) {
  return (
    <div className="flex flex-row items-center p-1">
      <div className="mr-3">
        <BsSearch />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <components.Highlight hit={hit} attribute="title" />
        </div>
      </div>
    </div>
  );
}

export default ProductItem