import { autocomplete } from '@algolia/autocomplete-js';
import type { AutocompleteOptions } from '@algolia/autocomplete-shared';
import { createElement, Fragment, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import type { AlgoliaIndexItem } from '~/components/Algolia/types';

function Autocomplete(props: Partial<AutocompleteOptions<AlgoliaIndexItem>>) {
  const containerRef = useRef(null);
  // const panelRootRef = useRef(null);
  // const rootRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete<AlgoliaIndexItem>({
      container: containerRef.current,
      // renderer: { createElement, Fragment, render: () => { } },
      // render({ children }, root) {
      //   if (!panelRootRef.current || rootRef.current !== root) {
      //     rootRef.current = root;

      //     panelRootRef.current?.unmount();
      //     panelRootRef.current = createRoot(root);
      //   }

      //   panelRootRef.current.render(children);
      // },
      ...props
    })

    return () => {
      search.destroy();
    }
  }, [props]);

  return (<div ref={containerRef} />)
};

export default Autocomplete;