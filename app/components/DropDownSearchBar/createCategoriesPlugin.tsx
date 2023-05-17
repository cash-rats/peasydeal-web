import { Fragment } from 'react';
import { getAlgoliaFacets } from '@algolia/autocomplete-js';
import type { AutocompletePlugin } from '@algolia/autocomplete-js';
import type { SearchClient } from 'algoliasearch/lite';
import { BsBox } from 'react-icons/bs';

type CategoryRecord = {
  label: string;
  count: number;
};

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
              );
            },
          },
        },
      ];
    },
  };
}
