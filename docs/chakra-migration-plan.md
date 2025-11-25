# Chakra/MUI/Emotion Removal – Root Shell Plan

## Completed Work
- Root shell (`app/root.tsx`, `entry.client.tsx`, `entry.server.tsx`) no longer uses Emotion/Chakra/MUI; head content and env injection preserved.
- Shadcn primitives added (`app/components/ui/button.tsx`, `input.tsx`, `dropdown-menu.tsx`) along with global CSS vars in `app/styles/global.css`.
- Search experience rebuilt:
  * `app/components/BaseInput` now composes shadcn `Input` with forwardRef support.
  * Header desktop/mobile search bars use the new primitives (no Chakra styles).
- Categories navigation migrated off Chakra:
  * `CategoriesNav`, `CategoriesNav/MegaMenu`, and `MegaMenuContent` use Radix dropdowns and shadcn buttons.
  * Old Chakra-specific stylesheets removed where possible.

## Outstanding Issues
- `npm run typecheck` fails due to legacy files:
  * Duplicate routes (`routes/blog.tsx`, `cart.tsx`, `checkout.tsx`) collide with their folder-based counterparts.
  * Several `__index/*.tsx` and `_index.disabled/*.tsx` files contain syntax errors; they block CI until fixed/removed.
- Chakra components still remain elsewhere (e.g., `LogoBar` uses Chakra `Drawer`, `IconButton`, etc.).

## Next In-Line Tasks
1. **Resolve Legacy Route Errors**
   - Decide whether to delete or update `routes/blog.tsx`, `cart.tsx`, `checkout.tsx` so only one version exists.
   - Fix or retire the `__index` and `_index.disabled` files causing syntax errors (lines ~38-41).
2. **Continue Chakra Migration**
   - Migrate `LogoBar` (drawer/icon button) and any remaining header components to Radix/shadcn primitives.
   - Search the repo for `@chakra-ui` imports to build a punch list (e.g., drawers, modals, buttons).
3. **Cleanup Styles**
   - Remove any unused Chakra CSS/SCSS files tied to components already migrated.
4. **Verification**
   - Once the above blockers are resolved, rerun `npm run typecheck`/`npm run dev` to ensure the app works without Chakra/MUI.
