# Chakra/MUI/Emotion Removal – Root Shell Plan

## Immediate Scope
Focus on `app/root.tsx` only (keep the temporary `<div> hello </div>` placeholder).

### Steps
1. **Prune Imports**
   - Remove `withEmotionCache`, `ChakraProvider`, `unstable_useEnhancedEffect`, and the context imports (`ClientStyleContext`, `ServerStyleContext`).

2. **Simplify `Document` Component**
   - Convert `Document` to a plain component; drop the Emotion cache wrapper and Chakra provider.
   - Delete the `<meta name="emotion-insertion-point">` and the serverStyle loop that injects `data-emotion` styles (no cache = no extra tags).

3. **Replace the MUI Effect**
   - Recreate the client-only effect using `useEffect` to call `storeSessionIDToSessionStore(gaSessionID)` and remove the cache manipulation/reset logic.

4. **Keep Existing Head Content**
   - Preserve all current `<Meta />`, `<Links />`, SEO tags, GTM/Rudder scripts, and the `window.ENV` script so SSR output stays stable.

5. **Verification**
   - Run `npm run typecheck` (or `npm run dev`) to ensure the app builds and the placeholder renders without Chakra/MUI/Emotion warnings.

## Next Steps (after root shell cleanup)
Once the root shell no longer depends on Chakra/MUI/Emotion, we can migrate actual route components to shadcn/radix one page at a time while slowly removing remaining legacy dependencies.
