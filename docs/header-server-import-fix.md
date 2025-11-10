# Header Route Server Import Fix

## Problem Summary

The Header route component is experiencing a "Server-only module referenced by client" error in React Router v7.

### Error Details

```
Pre-transform error: Server-only module referenced by client

'./route.server' imported by 'app/routes/components/Header/Header.tsx'

File: app/routes/components/Header/Header.tsx:9:31
```

## Root Cause Analysis

### Current File Structure

```
app/routes/components/Header/
├── index.tsx           # Route entry point (barrel file)
├── Header.tsx          # Client component with React hooks
└── route.server.ts     # Server-only loader/action functions
```

### The Problem

1. **`Header.tsx` is a client component** - It uses React hooks (`useState`, `useEffect`, `useFetcher`)
2. **Line 9 attempts to re-export server functions**: `export { loader, action } from './route.server';`
3. **React Router v7 blocks this** - Client components cannot import or re-export from `.server.ts` files

### Why This Happens

In React Router v7, there's strict code-splitting enforcement:
- `.server.ts` files = server-only code (never bundled for client)
- Client components = cannot touch `.server.ts` files at all
- Even re-export statements count as imports and trigger the error

### Circular Dependency Issue

Current import chain:
```
index.tsx → Header.tsx → route.server.ts → index.tsx (circular!)
```

`route.server.ts` imports `ActionTypes` from `./index`, which creates a circular dependency when combined with the server/client separation issue.

## Solution: Proper Client/Server Separation

### Strategy

Create clean boundaries with shared types:
- Server code stays in `.server.ts`
- Client code stays in `.tsx`
- Shared types in separate `types.ts`
- Route entry point (`index.tsx`) handles all exports

### New File Structure

```
app/routes/components/Header/
├── index.tsx           # Route entry point - exports loader, action, component
├── Header.tsx          # Client component only (no server exports)
├── route.server.ts     # Server functions only
└── types.ts            # Shared types/enums (new file)
```

## Implementation Plan

### Step 1: Create `types.ts`

Create `/app/routes/components/Header/types.ts`:

```typescript
export enum ActionTypes {
  reload_cart_count = 'reload_cart_count',
  redirect_to_collection = 'redirect_to_collection',
}
```

**Purpose**:
- Shared between client and server
- No server-only imports
- Breaks circular dependency

### Step 2: Update `route.server.ts`

Change line 4 from:
```typescript
import { ActionTypes } from './index';
```

To:
```typescript
import { ActionTypes } from './types';
```

**Purpose**:
- Fixes circular dependency
- Imports from shared types instead of route entry

### Step 3: Update `Header.tsx`

**Remove** line 9:
```typescript
export { loader, action } from './route.server';  // DELETE THIS
```

**Add** import for ActionTypes:
```typescript
import { ActionTypes } from './types';
```

**Purpose**:
- Client component no longer touches `.server.ts` file
- Fixes the "Server-only module referenced by client" error

### Step 4: Update `index.tsx`

Replace current content with:

```typescript
// Export server functions from .server file
export { loader, action } from './route.server';

// Export client component and links
export { default, links } from './Header';

// Export shared types
export { ActionTypes } from './types';
```

**Purpose**:
- Route entry point becomes the bridge
- Combines server and client exports safely
- Non-component file can import from `.server.ts`

## Why This Works

### Proper Boundaries

1. **`types.ts`** - Pure TypeScript types/enums
   - No React code
   - No server-only imports
   - Safe for both client and server

2. **`route.server.ts`** - Server-only code
   - Loader and action functions
   - Server-only imports allowed
   - Never bundled for client

3. **`Header.tsx`** - Pure client component
   - React hooks and component logic
   - No server imports
   - Only exports component and links

4. **`index.tsx`** - Route entry point
   - No React component code (just re-exports)
   - Can safely import from `.server.ts`
   - Combines everything for React Router

### React Router v7 Code Splitting

React Router v7 bundler will:
- ✅ Include `types.ts` in both client and server bundles
- ✅ Include `Header.tsx` in client bundle only
- ✅ Include `route.server.ts` in server bundle only
- ✅ Use `index.tsx` to wire everything together

## Expected Outcome

After implementation:
- ✅ No "Server-only module referenced by client" errors
- ✅ Clean separation of concerns
- ✅ No circular dependencies
- ✅ Follows React Router v7 best practices
- ✅ Cart count functionality continues to work correctly

## Comparison with Other Routes

Other routes in the codebase (like `cart.tsx`, `checkout.tsx`) define loader/action directly in the same file as the component. This works but mixes server and client code.

The Header route is unique because:
- It's a reusable component across multiple routes
- It's not directly registered in `routes.ts`
- The separation approach makes the code more maintainable

## Files Modified Summary

| File | Action | Purpose |
|------|--------|---------|
| `types.ts` | CREATE | Shared types/enums |
| `route.server.ts` | UPDATE | Fix import path |
| `Header.tsx` | UPDATE | Remove server export |
| `index.tsx` | UPDATE | Become export bridge |

## Testing

After implementation, verify:
1. Dev server starts without errors
2. Header component renders correctly
3. Cart count loads on page load
4. Cart count updates when items added/removed
5. Category navigation works (redirect_to_collection action)
