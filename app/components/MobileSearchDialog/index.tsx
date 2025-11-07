import {
  useEffect,
  useMemo,
} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from '@chakra-ui/react';
import { VscArrowLeft } from "react-icons/vsc";
import { useNavigation, useSubmit } from 'react-router';

import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from '~/components/Algolia/plugins';
import { searchClient } from '~/components/Algolia';
import {
  CategoryHits,
  ProductHits,
  RecentSearchHits,
} from '~/components/Algolia';
import { useCreateAutocomplete } from '~/components/Algolia/hooks';

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
      searchClient,
      recentSearchPlugin,
    });
  }, [recentSearchPlugin]);

  const categoriesPlugin = useMemo(() => {
    return createCategoriesPlugin({ searchClient })
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
  }, [navigate.state]);

  return (
    <Modal
      scrollBehavior='inside'
      size='full'
      isOpen={isOpen}
      onClose={onBack}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <div {...autocomplete.getRootProps({})}>
            <div className="p-2 flex justify-end">

              {/* Back Button */}
              <IconButton
                aria-label='Back'
                onClick={onBack}
                icon={<VscArrowLeft style={{ fontSize: '32px' }} />}
              />

              {/* Autocomplete search bar */}
              <div className="w-full ml-[10px]">
                <SearchBar
                  autocomplete={autocomplete}
                  formRef={formRef}
                  inputRef={inputRef}
                  state={state.autoCompleteState}
                />
              </div>
            </div>

            {/* Dropdown suggestions */}
            <div
              ref={panelRef}
              {...autocomplete.getPanelProps({})}
            >
              <div className="p-2">
                {
                  state
                    .autoCompleteState
                    .collections.map((collection, index) => {
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
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MobileSearchDialog;