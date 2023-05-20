import { useMemo } from 'react';
import type { LinksFunction } from '@remix-run/node';
import autocompleteThemeClassicStyles from '@algolia/autocomplete-theme-classic/dist/theme.min.css';
import { OnSubmitParams } from '@algolia/autocomplete-core';
import { useSubmit } from '@remix-run/react';

import { searchClient } from '~/components/Algolia';
import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from '~/components/Algolia/plugins';

import Autocomplete from './Autocomplete';
import DropDownSearchBarStyles from './styles/DropDownSearchBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: autocompleteThemeClassicStyles },
    { rel: 'stylesheet', href: DropDownSearchBarStyles },
  ];
}

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