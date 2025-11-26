# Cart Style Redesign Plan

## Goals
- Rebuild `/cart` visuals to align with the warm, minimal reference (design-ref1 as primary, ref2 as secondary) using Tailwind and shadcn/radix components only.
- Remove legacy CSS imports (`cart.css`, `Item.css`) and rely on utility classes/components.
- Keep UX smooth across desktop two-column layout and mobile stacking.

## Checkpoints
1) **Layout skeleton**  
   - Two-column desktop grid (items + summary card), stacked on mobile.  
   - Header bar with column labels; light dividers.  
   - Quick visual check for proportions and spacing before detailing.

2) **Item row structure**  
   - Tailwind grid per row: image/details, price, quantity, subtotal.  
   - Compact height, muted dividers, product info hierarchy (name, variant, optional discount pill).  
   - Minimal delete control placement verified.

3) **Quantity control swap**  
   - Replace dropdown with stepper (- qty +) using shadcn buttons.  
   - Confirm disabled/calculating states and mobile tap targets.

4) **Palette & typography**  
   - Warm neutral palette: sand header, deep brown/charcoal text, subtle dividers; restrained accent for sales.  
   - Consistent type scale (names ~17–18px semibold, meta 13–14px muted, prices 16–18px, totals bold).  
   - Alignment and contrast review against reference.

5) **Promo + summary card**  
   - Promo input/button (shadcn Input + Button) inline on desktop, stacked on mobile; concise feedback.  
   - Summary card with labeled rows, thin separators, discount rows, and dark-brown primary checkout button; continue shopping secondary.  
   - Verify readability of totals/discounts.

6) **Polish & QA**  
   - Restyle free-shipping banner; refine spacing/gaps; clamp long titles.  
   - Hover/focus states, loading/disabled handling.  
   - Final desktop/mobile comparison to references.

## Implementation Notes
- Apply Tailwind inline; remove stylesheet imports from cart route and item components.  
- Prefer existing shadcn primitives (`Button`, `Input`, `Card`, `DropdownMenu` if still needed); compose stepper from buttons if no ready-made component.  
- Maintain functional logic (cart mutations, loaders, fetchers) unchanged; style only.  
- Keep promo, summary, and payment methods within the new layout without regressions.
