/*
  TODO:
    this is purely a hook that needs a remix route as part of it's functionality.
    We should move this hook to it's dedicated folder.
*/

import { useState, useEffect } from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { useFetcher } from 'react-router';

import type { Product, SuggestItem } from '~/shared/types';

import { searchProductPreviews } from './api.server';

type ActionType = {
  results: Product[];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const query = body.get("query") as string;

  if (!query) {
    return null;
  }

  return data<ActionType>({
    results: await searchProductPreviews({ query, perPage: 6 })
  });
};

export type SearchSuggest = (query: string) => void

// Fetchs suggestion list when user types on search bar.
export function useSearchSuggests(): [SuggestItem[], SearchSuggest] {
  const fetcher = useFetcher();
  const [suggests, setSuggests] = useState<SuggestItem[]>([]);
  const searchSuggests: SearchSuggest = (query: string) => {
    fetcher.submit({ query }, { method: 'post', action: '/hooks/auto-complete-search?index' });
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

      setSuggests(suggestItems);
    }
  }, [fetcher.type])

  return [suggests, searchSuggests];
}