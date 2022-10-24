import { useState, useEffect } from 'react';
import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';

import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import type { SuggestItem } from '~/components/DropDownSearchBar';
import type { Product } from '~/shared/types';
import { fetchProductsByCategory } from '~/api';

type ActionType = {
  results: Product[];
};

export const links: LinksFunction = () => {
  return [
    ...DropDownSearchBarLinks(),
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const query = body.get("query") as string;

  if (!query) {
    return null;
  }

  const results = await fetchProductsByCategory({ title: query });

  return json<ActionType>({ results });
};

export default function AutoCompleteSearch() {
  const [results, setResults] = useState<SuggestItem[]>([]);
  const fetcher = useFetcher();

  const handleDropDownSearch = (query: string) => {
    fetcher.submit({ query }, { method: 'post', action: '/auto-complete-search?index' });
  }
  useEffect(() => {
    if (fetcher.type === 'done') {
      const { results } = fetcher.data as ActionType;

      let suggestItems: SuggestItem[] = [];

      if (results.length > 0) {
        // Transform product result to suggest item.
        suggestItems = results.map<SuggestItem>((result) => {
          return {
            title: result.title,
            data: {
              title: result.title,
              image: result.main_pic,
              discount: result.discount,
              productID: result.productUUID,
            },
          };
        });
      }

      setResults(suggestItems);
    }

  }, [fetcher]);

  return (
    <DropDownSearchBar
      placeholder='Search product by name'
      onDropdownSearch={handleDropDownSearch}
      results={results}
    />
  )
}

