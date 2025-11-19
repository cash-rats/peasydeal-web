# Review Modal Chakra Migration Plan

## Background
- `app/routes/tracking/components/TrackingOrderInfo/components/ReviewModal/index.tsx` still uses Chakra's `Modal` stack (`Modal`, `ModalOverlay`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalCloseButton`).
- We recently introduced a dependency-free dialog shell at `app/components/SimpleModal/index.tsx`, but it lacks enough slots/customization to drop in as a 1:1 replacement.
- Goal: extend `SimpleModal` so ReviewModal (and future consumers) can adopt it without losing UX parity (sizing, header layout, close behavior, accessibility).

## Proposed Steps
1. **Enhance `SimpleModal` API**
   - Add props for `className`, `contentClassName`, `header`, `footer`, and `showCloseIcon`. Allow custom close buttons so ReviewModal can render its existing icon/button placement.
   - Introduce `closeOnOverlayClick` (default `true`) to mirror Chakra's toggleable overlay-close behavior, and ensure `onClose` is optional-safe.
   - Support variable widths via a `size` prop or direct `contentClassName` override so we can match Chakra's `size="xl"` (`max-w-2xl` equivalent).
   - Implement basic body scroll locking (add/remove `overflow-hidden` on `document.body`) and trap focus inside the modal (e.g., use `focus-trap` or a minimal implementation) to maintain accessibility parity.

2. **Maintain Styling**
   - Move existing inline styles (rounded corners, padding, shadows) into Tailwind-friendly classes or allow consumers to pass overrides.
   - Ensure overlay opacity, centered positioning, and animations remain customizable so ReviewModal can keep the same look/feel it currently gets from Chakra.

3. **Refactor ReviewModal**
   - Replace the Chakra imports with `SimpleModal`.
   - Render the header (title + close icon) and body content inside `SimpleModal`'s new header/body slots. Preserve the conditional rendering (form vs. success view) and `handleClose` propagation.
   - Confirm that overlay clicks, Escape key, and explicit close button all call `handleClose` so `onClose(state.loadingState)` keeps working.

4. **Validation**
   - Manually test in the tracking flow: open modal, submit form success/failure, close via overlay/Escape/button, ensure animations and focus trapping behave.
   - Run `npm run lint` and `npm run typecheck` to catch any TypeScript or accessibility issues introduced by the new props.
   - Search for remaining `@chakra-ui/react` imports under `app/routes/tracking/components/TrackingOrderInfo` to see if additional cleanup is needed post-migration.

5. **Cleanup**
   - After ReviewModal is migrated, confirm no Chakra-specific CSS/asset files remain for this component.
   - Update `docs/chakra-migration-plan.md` checklist if ReviewModal was tracked there, noting the route is now Chakra-free.

