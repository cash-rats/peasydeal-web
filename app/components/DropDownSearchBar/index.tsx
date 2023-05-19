import { Fragment, useMemo } from 'react';
import type { OnSubmitParams } from '@algolia/autocomplete-core'
import type { LinksFunction } from '@remix-run/node';
import autocompleteThemeClassicStyles from '@algolia/autocomplete-theme-classic/dist/theme.min.css';
import type { AutocompleteComponents } from '@algolia/autocomplete-shared';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createAutocomplete } from '@algolia/autocomplete-core';
import insightsClient from 'search-insights';

import { ALGOLIA_INDEX_NAME } from '~/utils/get_env_source';
import { searchClient } from '~/components/Algolia';
import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from '~/components/Algolia/plugins';
import type { AlgoliaIndexItem } from '~/components/Algolia/types';

import Autocomplete from './Autocomplete';
import DropDownSearchBarStyles from './styles/DropDownSearchBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: autocompleteThemeClassicStyles },
    { rel: 'stylesheet', href: DropDownSearchBarStyles },
  ];
}

// const recentSearchPlugin = createLocalStorageRecentSearchesPlugin({
//   key: 'products-recent-search',
//   limit: 3,
//   transformSource({ source }) {
//     return {
//       ...source,
//       templates: {
//         ...source.templates,
//         header({ state }) {
//           if (state.query) {
//             return null;
//           }

//           return (
//             <Fragment>
//               <span className="aa-SourceHeaderTitle">Your searches</span>
//               <div className="aa-SourceHeaderLine" />
//             </Fragment>
//           );
//         },
//       },
//     }
//   },
// });


function DropDownSearchBar() {
  const recentSearchPlugin = useMemo(() => {
    return createRecentSearchPlugin();
  }, []);

  const productsSuggestionsPlugin = useMemo(() => {
    return createProductsSuggestionsPlugin({
      searchClient,
      recentSearchPlugin,
    });
  }, [recentSearchPlugin]);

  const categoriesPlugin = useMemo(() => {
    return createCategoriesPlugin({ searchClient })
  }, []);

  return (
    <div className="w-full z-20">
      <Autocomplete
        openOnFocus
        plugins={[
          productsSuggestionsPlugin,
          recentSearchPlugin,
          categoriesPlugin,
        ]}
      />
    </div>
  )
};

export default DropDownSearchBar;