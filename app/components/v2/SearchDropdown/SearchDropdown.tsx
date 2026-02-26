import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Link, useSubmit } from "react-router";
import type { OnSubmitParams } from "@algolia/autocomplete-core";
import { cn } from "~/lib/utils";
import { getSearchClient } from "~/components/Algolia";
import {
  createProductsSuggestionsPlugin,
  createCategoriesPlugin,
  createRecentSearchPlugin,
} from "~/components/Algolia/plugins";
import type { AutocompleteItem } from "~/components/Algolia/types";
import useCreateAutocomplete from "~/components/Algolia/hooks/useCreateAutocomplete";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper: decompose Algolia category string                          */
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
/*  SearchDropdown                                                     */
/* ------------------------------------------------------------------ */

export interface SearchDropdownProps {
  onClose: () => void;
  className?: string;
}

export function SearchDropdown({ onClose, className }: SearchDropdownProps) {
  const submitSearch = useSubmit();
  const containerRef = useRef<HTMLDivElement>(null);

  const recentSearchPlugin = useMemo(() => createRecentSearchPlugin(), []);
  const searchClient = useMemo(() => getSearchClient(), []);
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
  const isOpen = state.autoCompleteState.isOpen;

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      {/* Full-screen scrim — click to close */}
      <div
        className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[1px] animate-[search-scrim-in_200ms_ease]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search overlay container */}
      <div
        ref={containerRef}
        className={cn(
          "absolute top-0 left-0 right-0 z-[1001]",
          "animate-[search-bar-in_250ms_cubic-bezier(0.4,0,0.2,1)]",
          className
        )}
      >
        {/* Search bar */}
        <div className="bg-white h-[72px] shadow-overlay">
          <div className="max-w-[var(--container-max)] mx-auto h-full flex items-center gap-4 px-12 max-[639px]:px-4">
            {/* Search icon */}
            <span className="text-[#888] flex-shrink-0" aria-hidden="true">
              <SearchIcon />
            </span>

            {/* Search form */}
            <form
              ref={formRef}
              className="flex-1"
              {...autocomplete.getFormProps({ inputElement: inputRef.current })}
            >
              <input
                ref={inputRef}
                className={cn(
                  "w-full font-body text-[18px] max-[639px]:text-base text-black bg-transparent",
                  "border-none outline-none",
                  "placeholder:text-[#999] placeholder:font-normal"
                )}
                {...autocomplete.getInputProps({ inputElement: inputRef.current })}
              />
            </form>

            {/* Clear button (only when query exists) */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  autocomplete.setQuery("");
                  inputRef.current?.focus();
                }}
                className="text-[#999] hover:text-black transition-colors duration-fast cursor-pointer flex-shrink-0"
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="text-[#888] hover:text-black transition-colors duration-fast cursor-pointer flex-shrink-0"
              aria-label="Close search"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Results panel */}
        {isOpen && (
          <div
            ref={panelRef}
            className={cn(
              "bg-white max-w-[var(--container-max)] mx-auto",
              "max-h-[calc(100vh-144px)] overflow-y-auto",
              "border-t border-[#E0E0E0] shadow-overlay",
              "animate-[search-results-in_200ms_cubic-bezier(0.4,0,0.2,1)_100ms_both]"
            )}
            {...autocomplete.getPanelProps({})}
          >
            <div className="px-12 py-6 max-[639px]:px-4">
              {collections.map((collection) => {
                const { source, items } = collection;
                if (items.length === 0) return null;

                const sourceId = source.sourceId;

                /* Recent Searches */
                if (sourceId === "recentSearchesPlugin") {
                  return (
                    <div key={sourceId} className="mb-8 last:mb-0">
                      <SectionHeader title="Recent Searches" />
                      <ul {...autocomplete.getListProps()}>
                        {items.map((item: any) => (
                          <Link
                            key={item.id}
                            to={`/search?query=${encodeURIComponent(item.label)}`}
                            onClick={onClose}
                          >
                            <li className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#333] hover:bg-[#F9F9F9] transition-colors duration-fast cursor-pointer rounded-lg">
                              <span className="text-[#999]">
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
                    <div key={sourceId} className="mb-8 last:mb-0">
                      <SectionHeader title="Products" />
                      <ul {...autocomplete.getListProps()}>
                        {items.slice(0, 6).map((item: any) => (
                          <Link
                            key={item.objectID || item.uuid}
                            to={`/search?query=${encodeURIComponent(item.title)}`}
                            onClick={() => {
                              window.rudderanalytics?.track(
                                "search_action_product_hit",
                                { query: item.title }
                              );
                              onClose();
                            }}
                          >
                            <li className="flex items-center gap-4 px-4 py-3 hover:bg-[#F9F9F9] transition-colors duration-fast cursor-pointer rounded-lg">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-14 h-14 rounded-lg object-cover bg-[#F5F5F5] flex-shrink-0"
                                  loading="lazy"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-[15px] font-medium text-black truncate">
                                  {item.title}
                                </p>
                                {item.price != null && (
                                  <p className="font-body text-[14px] text-[#666] mt-1">
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
                    <div key={sourceId} className="mb-8 last:mb-0">
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
                            <Link
                              key={i}
                              to={url}
                              onClick={() => {
                                window.rudderanalytics?.track(
                                  "search_action_category_hit",
                                  { query: catInfo }
                                );
                                onClose();
                              }}
                            >
                              <li className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#333] hover:bg-[#F9F9F9] transition-colors duration-fast cursor-pointer rounded-lg">
                                <span className="text-[#999]">
                                  <FolderIcon />
                                </span>
                                <span className="flex-1">{catInfo.label}</span>
                                <span className="text-[#999] ml-auto">
                                  <ArrowRightIcon />
                                </span>
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

              {/* Footer — view all results */}
              {query && (
                <div className="mt-6 pt-6 border-t border-[#F0F0F0] text-center">
                  <Link
                    to={`/search?query=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 font-body text-[15px] font-medium text-black underline underline-offset-[3px] decoration-1 hover:decoration-2 transition-all duration-fast"
                  >
                    View all results for &ldquo;{query}&rdquo;
                    <span className="text-[#999]">
                      <ArrowRightIcon />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <span className="font-body text-[12px] font-semibold text-[#999] uppercase tracking-[1.2px]">
        {title}
      </span>
    </div>
  );
}
