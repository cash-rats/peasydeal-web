import { Fragment } from 'react';
import type { LinksFunction } from '@remix-run/node';
import algoliasearch from 'algoliasearch';
import autocompleteThemeClassicStyles from '@algolia/autocomplete-theme-classic/dist/theme.min.css';
import type { AutocompleteComponents } from '@algolia/autocomplete-shared';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

import DropDownSearchBarStyles from './styles/DropDownSearchBar.css';
import type { AlgoliaIndexItem } from './types';
import Autocomplete from './Autocomplete';
import ProductItem from './ProductItem';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: autocompleteThemeClassicStyles },
    { rel: 'stylesheet', href: DropDownSearchBarStyles },
  ];
}

const appID = 'YPKZCN6KLC';
const appWriteKey = '0c4331c9701338ea7244c6f40c122290';
const indexName = 'staging_products';
const searchClient = algoliasearch(appID, appWriteKey);

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
          return <ProductItem hit={item} components={components} />;
        },
        header({ state }) {
          if (state.query) {
            return null;
          }

          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">Popular Searches</span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
      },
    };
  },
});

function DropDownSearchBar() {
  return (
    <div className="w-full z-20">
      <Autocomplete
        openOnFocus
        plugins={[
          recentSearchPlugin,
          querySuggestionPlugin,
        ]}
      />
    </div>
  )
};

export default DropDownSearchBar;