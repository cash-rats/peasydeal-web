import {
  useEffect,
  useMemo,
} from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { VscArrowLeft } from "react-icons/vsc";
import { useNavigation, useSubmit } from 'react-router';

import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from '~/components/Algolia/plugins';
import { getSearchClient } from '~/components/Algolia';
import {
  CategoryHits,
  ProductHits,
  RecentSearchHits,
} from '~/components/Algolia';
import { useCreateAutocomplete } from '~/components/Algolia/hooks';

import { Button } from '~/components/ui/button';
import SearchBar from './SearchBar';

interface MobileSearchDialogProps {
  onBack?: () => void;

  isOpen: boolean;
}

function MobileSearchDialog({
  isOpen = false,
  onBack = () => { },
}: MobileSearchDialogProps) {
  const navigate = useNavigation();
  const submitSearch = useSubmit();

  const recentSearchPlugin = useMemo(() => {
    return createRecentSearchPlugin();
  }, []);

  const productsSuggestionsPlugin = useMemo(() => {
    return createProductsSuggestionsPlugin({
      searchClient: getSearchClient(),
      recentSearchPlugin,
    });
  }, [recentSearchPlugin]);

  const categoriesPlugin = useMemo(() => {
    return createCategoriesPlugin({ searchClient: getSearchClient() })
  }, []);

  const {
    autocomplete,
    state,
    inputRef,
    formRef,
    panelRef,
  } = useCreateAutocomplete({
    openOnFocus: true,
    autoFocus: true,
    onSubmit({ state }) {
      submitSearch(
        { query: state.query },
        {
          method: 'post',
          action: '/search?index',
        },
      );
    },
    navigator: {
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
    },
    plugins: [
      productsSuggestionsPlugin,
      recentSearchPlugin,
      categoriesPlugin,
    ]
  });

  useEffect(() => {
    if (navigate.state === 'submitting') {
      onBack();
    }

    return () => {
      onBack();
    }
  }, [navigate.state, onBack]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onBack();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-background focus:outline-none">
          <div
            {...autocomplete.getRootProps({})}
            className="flex h-full flex-col"
          >
            <div className="flex items-center gap-3 border-b border-border p-3">
              <Button
                aria-label="Back"
                variant="ghost"
                size="icon"
                onClick={onBack}
              >
                <VscArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex-1">
                <SearchBar
                  autocomplete={autocomplete}
                  formRef={formRef}
                  inputRef={inputRef}
                  state={state.autoCompleteState}
                />
              </div>
            </div>

            <div
              ref={panelRef}
              {...autocomplete.getPanelProps({})}
              className="flex-1 overflow-y-auto p-3"
            >
              {
                state
                  .autoCompleteState
                  .collections.map((collection) => {
                    const { source, items } = collection;

                    if (source.sourceId === 'querySuggestionsPlugin') {
                      return (
                        <ProductHits
                          key={source.sourceId}
                          autocomplete={autocomplete}
                          items={items}
                          source={source}
                        />
                      );
                    }

                    if (source.sourceId === 'recentSearchesPlugin') {
                      return (
                        <RecentSearchHits
                          key={source.sourceId}
                          autocomplete={autocomplete}
                          items={items}
                          source={source}
                        />
                      );
                    }

                    // @TODO: Assert type to CategoryRecord instead of AgoliaIndexItem
                    if (source.sourceId === 'categoriesPlugin') {
                      return (
                        <CategoryHits
                          key={source.sourceId}
                          source={source}
                          items={items}
                          autocomplete={autocomplete}
                        />
                      )
                    }

                    return null
                  })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MobileSearchDialog;
