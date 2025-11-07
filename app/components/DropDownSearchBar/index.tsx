import { useMemo } from 'react';
import type { LinksFunction } from '@remix-run/node';
import autocompleteThemeClassicStyles from '@algolia/autocomplete-theme-classic/dist/theme.min.css';
import { useSubmit } from 'react-router';
import type { OnSubmitParams } from '@algolia/autocomplete-core';

import { searchClient } from '~/components/Algolia';
import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from '~/components/Algolia/plugins';
import type { AutocompleteItem } from '~/components/Algolia/types';

import Autocomplete from './Autocomplete';
import DropDownSearchBarStyles from './styles/DropDownSearchBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: autocompleteThemeClassicStyles },
    { rel: 'stylesheet', href: DropDownSearchBarStyles },
  ];
}

function DropDownSearchBar() {
  const submitSearch = useSubmit();

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

  const handleSubmit = ({ state }: OnSubmitParams<AutocompleteItem>) => {
    submitSearch(
      { query: state.query },
      {
        method: 'post',
        action: '/search?index',
      },
    )
  }

  return (
    <div className="w-full z-20">
      <Autocomplete
        openOnFocus
        plugins={[
          productsSuggestionsPlugin,
          recentSearchPlugin,
          categoriesPlugin,
        ]}
        placeholder='search anything you like'
        onSubmit={handleSubmit}
        navigator={{
          navigate({ itemUrl }) {
            window.location.assign(itemUrl);
          },

          navigateNewTab({ itemUrl }) {
            const windowReference = window.open(itemUrl, '_blank', 'noopener');

            if (windowReference) {
              windowReference.focus();
            }
          },

          navigateNewWindow({ itemUrl }) {
            window.open(itemUrl, '_blank', 'noopener');
          },
        }}
      />
    </div>
  )
};

export default DropDownSearchBar;