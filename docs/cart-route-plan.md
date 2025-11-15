## Cart Route Migration Plan

1. **Align exports with RR7 data conventions**
   - Update imports to use the React Router 7 `react-router` entry point (loader/action/links/error types).
   - Ensure `action`, `loader`, `shouldRevalidate`, `links`, and `ErrorBoundary` stay as named exports but conform to RR7 signatures (async functions returning `Response`).
2. **Type cleanup**
   - Confirm `LoaderType` matches the loader return shape and adjust the `useLoaderData` call accordingly.
   - Re-export any helper types (e.g., `SimpleModalProps`) needed by other modules after RR7 conversion.
3. **Testing/validation**
   - Run `npm run typecheck` (once the known unrelated template errors are addressed) or manually verify TypeScript types for the cart route, ensuring no RR6 Remix leftovers remain.
