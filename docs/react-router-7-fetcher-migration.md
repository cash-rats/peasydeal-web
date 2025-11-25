# React Router 7 Fetcher API Migration Guide

## Overview

React Router 7 has significantly changed the Fetcher API, removing the `fetcher.submission` and `fetcher.type` properties that existed in React Router v6. This document provides a comprehensive guide to migrating from the old API to the new state-based API.

## What Changed

### Removed Properties

The following properties no longer exist on the `Fetcher` type in React Router 7:

- `fetcher.submission` - Previously contained form submission details
  - `fetcher.submission.action` - The URL the form was submitted to
  - `fetcher.submission.method` - The HTTP method (GET/POST)
  - `fetcher.submission.formData` - The submitted form data

- `fetcher.type` - Previously indicated the fetcher's current state
  - Possible values: `"init"`, `"done"`, `"actionSubmission"`, `"loaderSubmission"`, `"actionReload"`, `"actionRedirect"`, `"normalReload"`

### New Properties

React Router 7 uses a flatter, more direct API:

- `fetcher.state` - The current state of the fetcher
  - Possible values: `"idle"`, `"submitting"`, `"loading"`

- `fetcher.formData` - The FormData being submitted (available during submission)

- `fetcher.formMethod` - The HTTP method being used (`"GET"` or `"POST"`)

- `fetcher.formAction` - The URL the form is/was submitted to

- `fetcher.data` - The data returned from the action/loader (persists across reloads)

## Migration Mapping

### From `fetcher.submission` to New API

| Old API | New API | Notes |
|---------|---------|-------|
| `fetcher.submission?.action` | `fetcher.formAction` | Direct replacement |
| `fetcher.submission?.method` | `fetcher.formMethod` | Direct replacement |
| `fetcher.submission?.formData` | `fetcher.formData` | Direct replacement |

### From `fetcher.type` to New API

The `fetcher.type` property has been replaced with compound checks using `fetcher.state`, `fetcher.data`, and `fetcher.formMethod`:

| Old `fetcher.type` | New API Check | Description |
|-------------------|---------------|-------------|
| `"init"` | `state === "idle" && data === undefined` | Initial state before any submission |
| `"done"` | `state === "idle" && data !== undefined` | Submission completed with data |
| `"actionSubmission"` | `state === "submitting" && formMethod === "POST"` | Currently submitting an action (POST) |
| `"loaderSubmission"` | `state === "submitting" && formMethod === "GET"` | Currently submitting a loader (GET) |
| `"actionReload"` | `state === "loading" && data !== undefined && formMethod === "POST"` | Reloading after action completion |
| `"actionRedirect"` | `state === "loading" && data !== undefined && formMethod === "POST"` | Same as actionReload in most cases |
| `"normalReload"` | `state === "loading" && data !== undefined && formMethod === "GET"` | Reloading after loader submission |

## Code Examples

### Example 1: Finding a Specific Fetcher

**Before (React Router v6):**
```typescript
const reloadCartCountFetcher = fetchers.find(
  (f) =>
    f.submission?.action.includes('/components/Header') &&
    f.submission.method === 'POST'
);
```

**After (React Router 7):**
```typescript
const reloadCartCountFetcher = fetchers.find(
  (f) =>
    f.formAction?.includes('/components/Header') &&
    f.formMethod === 'POST'
);
```

### Example 2: Detecting Action Reload

**Before (React Router v6):**
```typescript
useEffect(() => {
  if (reloadCartCountFetcher?.type === 'actionReload') {
    fetcher.submit(
      { action_type: ActionTypes.reload_cart_count },
      { action: '/components/Header?index' },
    );
  }
}, [reloadCartCountFetcher?.type]);
```

**After (React Router 7):**
```typescript
useEffect(() => {
  if (
    reloadCartCountFetcher &&
    reloadCartCountFetcher.state === 'loading' &&
    reloadCartCountFetcher.data !== undefined &&
    reloadCartCountFetcher.formMethod === 'POST'
  ) {
    fetcher.submit(
      { action_type: ActionTypes.reload_cart_count },
      { action: '/components/Header?index' },
    );
  }
}, [
  reloadCartCountFetcher?.state,
  reloadCartCountFetcher?.data,
  reloadCartCountFetcher?.formMethod
]);
```

### Example 3: Detecting Completion

**Before (React Router v6):**
```typescript
useEffect(() => {
  if (fetcher.type === 'done') {
    setNumOfItemsInCart(Number(fetcher.data.numOfItemsInCart));
  }
}, [fetcher.type]);
```

**After (React Router 7):**
```typescript
useEffect(() => {
  if (fetcher.state === 'idle' && fetcher.data !== undefined) {
    setNumOfItemsInCart(Number(fetcher.data.numOfItemsInCart));
  }
}, [fetcher.state, fetcher.data]);
```

### Example 4: Detecting Submission in Progress

**Before (React Router v6):**
```typescript
const isSubmitting = fetcher.type === 'actionSubmission';
```

**After (React Router 7):**
```typescript
const isSubmitting = fetcher.state === 'submitting' && fetcher.formMethod === 'POST';
```

## Real-World Migration: Header Component

In our codebase, we had to migrate the `app/routes/components/Header/index.tsx` component. Here's what was changed:

### Issue 1: Finding Fetchers (Lines 85-89)

**Error:**
```
Property 'submission' does not exist on type 'Fetcher & { key: string; }'
```

**Fix:**
```typescript
// OLD
const reloadCartCountFetcher = fetchers.find(
  (f) =>
    f.submission?.action.includes('/components/Header') &&
    f.submission.method === 'POST'
);

// NEW
const reloadCartCountFetcher = fetchers.find(
  (f) =>
    f.formAction?.includes('/components/Header') &&
    f.formMethod === 'POST'
);
```

### Issue 2: Checking Action Reload State (Lines 98-110)

**Error:**
```
Property 'type' does not exist on type 'Fetcher & { key: string; }'
```

**Fix:**
```typescript
// OLD
useEffect(() => {
  if (reloadCartCountFetcher?.type === 'actionReload') {
    fetcher.submit(
      { action_type: ActionTypes.reload_cart_count },
      { action: '/components/Header?index' },
    );
  }
}, [reloadCartCountFetcher?.type])

// NEW
useEffect(() => {
  if (
    reloadCartCountFetcher &&
    reloadCartCountFetcher.state === 'loading' &&
    reloadCartCountFetcher.data !== undefined &&
    reloadCartCountFetcher.formMethod === 'POST'
  ) {
    fetcher.submit(
      { action_type: ActionTypes.reload_cart_count },
      { action: '/components/Header?index' },
    );
  }
}, [reloadCartCountFetcher?.state, reloadCartCountFetcher?.data, reloadCartCountFetcher?.formMethod])
```

### Issue 3: Checking Done State (Lines 112-116)

**Error:**
```
Property 'type' does not exist on type 'FetcherWithComponents<any>'
```

**Fix:**
```typescript
// OLD
useEffect(() => {
  if (fetcher.type === 'done') {
    setNumOfItemsInCart(Number(fetcher.data.numOfItemsInCart));
  }
}, [fetcher.type]);

// NEW
useEffect(() => {
  if (fetcher.state === 'idle' && fetcher.data !== undefined) {
    setNumOfItemsInCart(Number(fetcher.data.numOfItemsInCart));
  }
}, [fetcher.state, fetcher.data]);
```

## Important Notes

1. **Update useEffect Dependencies**: When migrating from `fetcher.type` to compound checks, make sure to update your `useEffect` dependency arrays to include all the individual properties you're checking (`state`, `data`, `formMethod`).

2. **Data Persistence**: In React Router 7, `fetcher.data` persists across reloads and resubmissions. Use `fetcher.state === 'idle' && fetcher.data !== undefined` to detect when data is available (equivalent to old `type === 'done'`).

3. **Loading vs Submitting**:
   - `state === "submitting"` means the form is being submitted to the action/loader
   - `state === "loading"` means the action/loader has completed and data is being revalidated

4. **Null Safety**: Always use optional chaining (`?.`) when checking properties on fetchers from `useFetchers()` since they might not have all properties set depending on their state.

## Common Patterns

### Showing a Loading Spinner

```typescript
const isLoading = fetcher.state !== 'idle';

// Or more specific:
const isSubmitting = fetcher.state === 'submitting';
const isReloading = fetcher.state === 'loading';
```

### Disabling Form During Submission

```typescript
<button disabled={fetcher.state !== 'idle'}>
  {fetcher.state === 'submitting' ? 'Saving...' : 'Save'}
</button>
```

### Detecting Specific Action Submissions

```typescript
const isSavingProduct =
  fetcher.state === 'submitting' &&
  fetcher.formAction?.includes('/products') &&
  fetcher.formMethod === 'POST';
```

## Resources

- [React Router 7 useFetcher Documentation](https://reactrouter.com/start/framework/fetchers)
- [React Router 7 Migration Guide](https://reactrouter.com/upgrading/remix)
- [GitHub Discussion on Fetcher Type Changes](https://github.com/remix-run/react-router/discussions)

## Conclusion

While the migration from `fetcher.type` to the new state-based API requires more verbose code, it provides clearer semantics and better aligns with the overall React Router 7 architecture. The new API makes it easier to understand exactly what state the fetcher is in and what data is available at any given time.
