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
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 15L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick as any);
    return () => document.removeEventListener("mousedown", handleClick as any);
  }, [onClose]);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute top-0 right-0 w-[420px] h-[72px] flex items-center px-4 z-50",
        "animate-[fade-in_250ms_cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
    >
      {/* Search input */}
      <form
        ref={formRef}
        className="flex items-center gap-3 w-full"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <span className="text-rd-text-secondary flex-shrink-0">
          <SearchIcon />
        </span>

        <input
          ref={inputRef}
          className="flex-1 font-body text-[15px] text-black bg-transparent border-none outline-none placeholder:text-rd-text-muted"
          {...autocomplete.getInputProps({ inputElement: inputRef.current })}
        />

        <button
          type="button"
          onClick={onClose}
          className="text-rd-text-secondary hover:text-black transition-colors duration-fast cursor-pointer flex-shrink-0"
          aria-label="Close search"
        >
          <CloseIcon />
        </button>
      </form>

      {/* Results panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className={cn(
            "absolute top-[72px] right-0 w-[480px] max-h-[480px] overflow-y-auto",
            "bg-white border border-rd-border-light rounded-b-rd-md shadow-overlay",
            "animate-[fade-in_150ms_ease]"
          )}
          {...autocomplete.getPanelProps({})}
        >
          {collections.map((collection, index) => {
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
                        <li className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-rd-text-body hover:bg-[#F9F9F9] transition-colors duration-fast cursor-pointer">
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
                          window.rudderanalytics?.track(
                            "search_action_product_hit",
                            { query: item.title }
                          );
                          onClose();
                        }}
                      >
                        <li className="flex items-center gap-3.5 px-5 py-3 hover:bg-[#F9F9F9] transition-colors duration-fast cursor-pointer">
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              className="w-11 h-11 rounded-rd-sm object-cover bg-rd-bg-card flex-shrink-0"
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
                          <li className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-rd-text-body hover:bg-[#F9F9F9] transition-colors duration-fast cursor-pointer">
                            <span className="text-rd-text-muted">
                              <FolderIcon />
                            </span>
                            <span className="flex-1">{catInfo.label}</span>
                            <span className="text-rd-text-muted ml-auto">
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
            <div className="px-5 py-3 border-t border-[#F0F0F0] text-center">
              <Link
                to={`/search?query=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="font-body text-[13px] font-medium text-black underline underline-offset-[3px] decoration-1 hover:decoration-2 transition-all duration-fast"
              >
                View all results for &ldquo;{query}&rdquo;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-5 pt-4 pb-2">
      <span className="font-body text-[11px] font-semibold text-rd-text-muted uppercase tracking-[1px]">
        {title}
      </span>
    </div>
  );
}
