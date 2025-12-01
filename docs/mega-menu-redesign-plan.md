# Mega Menu Reconstruction Plan

## Goal
Align the category mega menu with the provided redesign (left rail + right content grid + footer “Shop all” link) while keeping existing category data and behavior intact.

## Current State (quick recap)
- `app/components/Header/components/CategoriesNav/MegaMenu.tsx` renders only the active category’s children in a grid; no left rail inside the panel.
- “Shop all {category}” link sits at the top of the panel; uses pink accent buttons and Tailwind spacing.
- Menu open/close relies on hover/touch timers per top-nav item; `MegaMenu` only receives a single `category`.
- Styles in `styles/MegaMenu.scss` are minimal (positioning/overlay).

## Target Layout from Mock
- Left rail: list of top-level categories; active row highlighted with gray background and right arrow.
- Right pane: multi-column list of subcategory groups with headings + counts; items with counts beneath.
- Footer: full-width “Shop all {category} (count)” row at the bottom.
- Panel aesthetics: white card, subtle shadow, generous padding, light dividers.
- Interaction: staying within one open panel to switch categories via the rail (not jumping between separate dropdowns).

## Proposed Implementation Outline
1) **Refactor data flow**: pass `topCategories` into the mega menu so the dropdown can render the left rail and manage an internal `activeRail` category (default to hovered/triggered category). Keep counts from existing `Category` shape.
2) **Restructure markup**: rebuild `DropdownMenuContent` as a flex layout with a fixed-width rail and a right-side grid; move “Shop all” to a footer row; add headings with counts and item lists mirroring the mock.
3) **Tailwind-only styling**: drop `styles/MegaMenu.scss` usage and replace panel/rail/typography/arrow/divider styling with inline Tailwind classes (add minimal helper components if needed, but no extra CSS files).
4) **Behavior adjustments**: preserve hover/touch open/close timers; allow rail hover/click to swap the right pane without closing; keep `onClose` when navigating.
5) **Consistency check**: decide whether the “ALL” dropdown (`MegaMenuContent`) needs the same layout or can remain as-is; document any differences.

## Risks / Considerations
- Need to avoid layout shifts when switching rail items (consistent column widths/heights).
- Ensure accessibility: aria labels on rail items, focus/keyboard support in the dropdown.
- Verify responsiveness: horizontal overflow vs. height scroll; keep `max-h` constraints.
- Alignment with existing pink accent palette vs. mock’s neutral tones (confirm chosen direction).
