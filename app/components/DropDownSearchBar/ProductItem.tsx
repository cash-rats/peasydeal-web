import type { AutocompleteComponents } from '@algolia/autocomplete-shared';
import { BsSearch } from 'react-icons/bs';

import { DOMAIN } from '~/utils/get_env_source';
import { composeProductDetailURL } from '~/utils';

import type { AlgoliaIndexItem } from './types';
interface ProductItemParams {
  hit: AlgoliaIndexItem;
  components: AutocompleteComponents;
};

/**
 * We want to display hit products and categories.
 *
 * - [x] Display hit highlight
 * - [x] Add redirection
 * - [ ] Display product image
 */
export function ProductItem({ hit, components }: ProductItemParams) {
  return (
    <a
      href={`${DOMAIN}${composeProductDetailURL({ productName: hit.title, productUUID: hit.uuid })}`}
      className="flex flex-row items-center p-1"
    >
      <div className="mr-3">
        <BsSearch />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <components.Highlight hit={hit} attribute="title" />
        </div>
      </div>
    </a>
  );
}

export default ProductItem