import { useMemo, useCallback, useEffect } from "react";
import { Link, useSubmit, useNavigation } from "react-router";
import type { OnSubmitParams } from "@algolia/autocomplete-core";
import { getSearchClient } from "~/components/Algolia";
import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from "~/components/Algolia/plugins";
import type { AutocompleteItem } from "~/components/Algolia/types";
import useCreateAutocomplete from "~/components/Algolia/hooks/useCreateAutocomplete";
import { trackEvent } from "~/lib/gtm";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function BackArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4C2 3.44772 2.44772 3 3 3H6.5L8 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function decomposeCategoryString(catStr: string) {
  const segs = catStr.split(":");
  if (segs.length < 2) return null;
  return {
    type: segs[0],
    name: segs[1],
    label: segs[2] || segs[1],
  };
}

/* ------------------------------------------------------------------ */
/*  MobileSearch                                                       */
/* ------------------------------------------------------------------ */

export interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const submitSearch = useSubmit();
  const navigation = useNavigation();

  const searchClient = useMemo(() => getSearchClient(), []);
  const recentSearchPlugin = useMemo(() => createRecentSearchPlugin(), []);
  const productsSuggestionsPlugin = useMemo(
    () => createProductsSuggestionsPlugin({ searchClient, recentSearchPlugin }),
    [searchClient, recentSearchPlugin]
  );
  const categoriesPlugin = useMemo(
    () => createCategoriesPlugin({ searchClient }),
    [searchClient]
  );

  const handleSubmit = useCallback(
    ({ state }: OnSubmitParams<AutocompleteItem>) => {
      submitSearch(
        { query: state.query },
        { method: "post", action: "/search?index" }
      );
      onClose();
    },
    [submitSearch, onClose]
  );

  const { autocomplete, state, inputRef, formRef, panelRef } =
    useCreateAutocomplete({
      openOnFocus: true,
      plugins: [productsSuggestionsPlugin, recentSearchPlugin, categoriesPlugin],
      placeholder: "Search products, categories...",
      onSubmit: handleSubmit,
    });

  const collections = state.autoCompleteState.collections;
  const query = state.autoCompleteState.query;

  // Auto-close on navigation
  useEffect(() => {
    if (navigation.state === "loading") onClose();
  }, [navigation.state, onClose]);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-white animate-[fade-in_250ms_cubic-bezier(0.4,0,0.2,1)]">
      {/* Header bar */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-[#F0F0F0]">
        <button
          onClick={onClose}
          className="text-black cursor-pointer flex-shrink-0"
          aria-label="Close search"
        >
          <BackArrowIcon />
        </button>

        <form
          ref={formRef}
          className="flex-1 flex items-center"
          {...autocomplete.getFormProps({ inputElement: inputRef.current })}
        >
          <input
            ref={inputRef}
            className="w-full font-body text-base text-black bg-transparent border-none outline-none placeholder:text-rd-text-muted"
            {...autocomplete.getInputProps({ inputElement: inputRef.current })}
          />
        </form>

        {query && (
          <button
            type="button"
            onClick={() => {
              autocomplete.setQuery("");
              inputRef.current?.focus();
            }}
            className="text-rd-text-muted cursor-pointer flex-shrink-0"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* Results */}
      <div
        ref={panelRef}
        className="overflow-y-auto h-[calc(100vh-56px)]"
        {...autocomplete.getPanelProps({})}
      >
        {collections.map((collection) => {
          const { source, items } = collection;
          if (items.length === 0) return null;
          const sourceId = source.sourceId;

          /* Recent Searches */
          if (sourceId === "recentSearchesPlugin") {
            return (
              <div key={sourceId}>
                <SectionHeader title="Recent Searches" />
                <ul {...autocomplete.getListProps()}>
                  {items.map((item: any) => (
                    <Link
                      key={item.id}
                      to={`/search?query=${encodeURIComponent(item.label)}`}
                      onClick={onClose}
                    >
                      <li className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-rd-text-body hover:bg-[#F9F9F9] cursor-pointer">
                        <span className="text-rd-text-muted">
                          <ClockIcon />
                        </span>
                        {item.label}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            );
          }

          /* Product Suggestions */
          if (sourceId === "querySuggestionsPlugin") {
            return (
              <div key={sourceId}>
                <SectionHeader title="Products" />
                <ul {...autocomplete.getListProps()}>
                  {items.slice(0, 6).map((item: any) => (
                    <Link
                      key={item.objectID || item.uuid}
                      to={`/search?query=${encodeURIComponent(item.title)}`}
                      onClick={() => {
                        trackEvent("search_action_product_hit", { query: item.title });
                        onClose();
                      }}
                    >
                      <li className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-[#F9F9F9] cursor-pointer">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-14 h-14 rounded-rd-sm object-cover bg-rd-bg-card flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-medium text-black truncate">
                            {item.title}
                          </p>
                          {item.price != null && (
                            <p className="font-body text-[13px] text-rd-text-secondary mt-0.5">
                              £{item.price}
                            </p>
                          )}
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            );
          }

          /* Category Suggestions */
          if (sourceId === "categoriesPlugin") {
            return (
              <div key={sourceId}>
                <SectionHeader title="Categories" />
                <ul {...autocomplete.getListProps()}>
                  {items.slice(0, 4).map((item: any, i: number) => {
                    const catInfo = decomposeCategoryString(item.label);
                    if (!catInfo) return null;
                    const url =
                      catInfo.type === "promotion"
                        ? `/promotion/${catInfo.name}`
                        : `/collection/${catInfo.name}`;

                    return (
                      <Link key={i} to={url} onClick={onClose}>
                        <li className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-rd-text-body hover:bg-[#F9F9F9] cursor-pointer">
                          <span className="text-rd-text-muted">
                            <FolderIcon />
                          </span>
                          <span className="flex-1">{catInfo.label}</span>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            );
          }

          return null;
        })}

        {/* Footer */}
        {query && (
          <div className="px-4 py-3 border-t border-[#F0F0F0] text-center">
            <Link
              to={`/search?query=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="font-body text-[13px] font-medium text-black underline underline-offset-[3px]"
            >
              View all results for &ldquo;{query}&rdquo;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <span className="font-body text-[11px] font-semibold text-rd-text-muted uppercase tracking-[1px]">
        {title}
      </span>
    </div>
  );
}
