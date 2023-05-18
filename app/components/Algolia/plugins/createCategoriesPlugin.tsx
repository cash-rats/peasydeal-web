import { Fragment } from 'react';
import { getAlgoliaFacets } from '@algolia/autocomplete-js';
import type { AutocompletePlugin } from '@algolia/autocomplete-js';
import type { SearchClient } from 'algoliasearch/lite';
import { BsBox } from 'react-icons/bs';

import { DOMAIN } from '~/utils/get_env_source';
import { transformCategoryLabelToName } from '~/utils';

import type { CategoryRecord } from '../types';


type CreateCategoriesPluginProps = {
  searchClient: SearchClient;
};

export function createCategoriesPlugin({
  searchClient,
}: CreateCategoriesPluginProps): AutocompletePlugin<CategoryRecord, undefined> {
  return {
    getSources({ query }) {
      return [
        {
          sourceId: 'categoriesPlugin',
          getItems() {
            return getAlgoliaFacets({
              searchClient,
              queries: [
                {
                  indexName: 'staging_products',
                  facet: 'categories',
                  params: {
                    facetQuery: query,
                    maxFacetHits: query ? 3 : 5,
                  },
                },
              ],
            });
          },
          // getItemUrl() {

          // },
          templates: {
            header({ state }) {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Categories</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item, components }) {
              return (
                <a href={`${DOMAIN}/collection/${transformCategoryLabelToName(item.label)}`}>
                  <div className="aa-ItemWrapper p-1">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                        <BsBox fontSize={20} />
                      </div>

                      <div className="aa-ItemContentBody">
                        <div className="aa-ItemContentTitle">
                          <components.Highlight hit={item} attribute="label" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            },
          },
        },
      ];
    },
  };
}
