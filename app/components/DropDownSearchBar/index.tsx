import { Fragment, useMemo } from 'react';
import type { OnSubmitParams } from '@algolia/autocomplete-core'
import type { LinksFunction } from '@remix-run/node';
import autocompleteThemeClassicStyles from '@algolia/autocomplete-theme-classic/dist/theme.min.css';
import type { AutocompleteComponents } from '@algolia/autocomplete-shared';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

import { ALGOLIA_INDEX_NAME } from '~/utils/get_env_source';
import { createCategoriesPlugin } from '~/components/Algolia/plugins/createCategoriesPlugin';
import { searchClient, ProductHit } from '~/components/Algolia';
import type { AlgoliaIndexItem } from '~/components/Algolia/types';

import Autocomplete from './Autocomplete';
import DropDownSearchBarStyles from './styles/DropDownSearchBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: autocompleteThemeClassicStyles },
    { rel: 'stylesheet', href: DropDownSearchBarStyles },
  ];
}

const indexName = ALGOLIA_INDEX_NAME;

const recentSearchPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'products-recent-search',
  limit: 3,
  transformSource({ source }) {
    return {
      ...source,
      templates: {
        ...source.templates,
        header({ state }) {
          if (state.query) {
            return null;
          }

          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">Your searches</span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
      },
    }
  },
});

const querySuggestionPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName,
  getSearchParams() {
    return recentSearchPlugin.data?.getAlgoliaSearchParams({
      hitsPerPage: 5,
    });
  },
  transformSource({ source }) {
    return {
      ...source,
      templates: {
        ...source.templates,
        item({ item, components }: { item: AlgoliaIndexItem, components: AutocompleteComponents }) {
          return <ProductHit hit={item} components={components} />;
        },
        header({ state }) {
          if (state.query) {
            return null;
          }

          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">Popular searches</span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
      },
    };
  },
});

const categoriesPlugin = createCategoriesPlugin({ searchClient });

function DropDownSearchBar() {
  const onSubmit = ({ state }: OnSubmitParams<AlgoliaIndexItem>): void => { }

  return (
    <div className="w-full z-20">
      <Autocomplete
        openOnFocus
        autoFocus
        onSubmit={onSubmit}
        plugins={[
          querySuggestionPlugin,
          recentSearchPlugin,
          categoriesPlugin,
        ]}
      />
    </div>
  )
};

export default DropDownSearchBar;