# Migration Plan: react-lazy-load-image-component → react-intersection-observer

## Executive Summary

This document outlines the complete migration strategy from `react-lazy-load-image-component` to `react-intersection-observer` for the PeasyDeal web application.

**Current State:**
- 20 files using `react-lazy-load-image-component`
- HOC pattern with `trackWindowScroll` at route level
- Prop drilling `scrollPosition` through multiple component layers
- Mix of `LazyLoadComponent` and `LazyLoadImage` usage patterns

**Target State:**
- Component-level lazy loading with `useInView` hook
- No prop drilling - each component manages its own visibility
- Simplified architecture with better tree-shaking
- Custom fade-in effect replacing blur effect

**Migration Effort:**
- Total files to modify: 20 files
- Estimated time: 3-4 hours
- Risk level: Low (backward compatible changes)

---

## Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Migration Strategy](#migration-strategy)
3. [Implementation Phases](#implementation-phases)
4. [Code Examples](#code-examples)
5. [Testing Strategy](#testing-strategy)
6. [Rollback Plan](#rollback-plan)

---

## Current Architecture Analysis

### Package Information

- **Package:** `react-lazy-load-image-component` v1.6.3
- **Types:** `@types/react-lazy-load-image-component` v1.6.4
- **Vite Config:** Included in `optimizeDeps.include`

### Usage Breakdown

#### 1. Route-Level HOC Pattern (6 files)

All major routes wrap their default export with `trackWindowScroll`:

```typescript
import * as LazyImage from 'react-lazy-load-image-component';
const { trackWindowScroll } = LazyImage;

function MyRoute({ scrollPosition }) {
  return <Component scrollPosition={scrollPosition} />;
}

export default trackWindowScroll(MyRoute);
```

**Files:**
- `app/routes/__index/index.tsx` (Home page)
- `app/routes/__index/product/$prodId.tsx` (Product detail)
- `app/routes/__index/collection/$collection.tsx` (Collection)
- `app/routes/__index/search/index.tsx` (Search results)
- `app/routes/__index/promotion/$promotion.tsx` (Promotion)
- `app/routes/__index/events/win-a-free-surprise-gift.tsx` (Event page)

#### 2. Prop Drilling Chain (13 files)

Intermediate components receive and pass down `scrollPosition`:

```
Route → CategoryPreview → ProductRow → RegularCardWithActionButton → LazyLoadComponent
```

**Intermediate Components:**
- `app/components/CategoryPreview/index.tsx`
- `app/components/ProductCard/utils.ts` (types only)
- `app/components/ProductRow/ProductRow.tsx`
- `app/components/ProductRow/EvenRow.tsx`
- `app/components/ProductRow/OneMainTwoSubs.tsx`
- `app/components/ProductPromotionRow/ProductPromotionRow.tsx`
- `app/routes/__index/components/ProductRowsContainer/index.tsx`
- `app/routes/__index/components/ProductRowsContainer/ThreeColumns.tsx`
- `app/routes/__index/product/components/RecommendedProducts/index.tsx`

#### 3. Leaf Components - Actual Image Rendering (5 files)

These components actually render lazy-loaded images:

**Pattern A: LazyLoadComponent wrapping remix-image** (2 files)
```typescript
<LazyLoadComponent threshold={500} scrollPosition={scrollPosition}>
  <Image src={mainPic} loaderUrl='/remix-image' />
</LazyLoadComponent>
```
- `app/components/ProductCard/RegularCardWithActionButton.tsx`
- `app/routes/__index/events/win-a-free-surprise-gift.tsx` (ItemCard)

**Pattern B: Direct LazyLoadImage** (3 files)
```typescript
<LazyLoadImage
  src={image}
  scrollPosition={scrollPosition}
  placeholder={<img src="/images/placeholder.svg" />}
  alt={title}
/>
```
- `app/components/ProductGrid/MediumGrid.tsx`
- `app/components/ProductGrid/LargeGrid.tsx`
- `app/routes/__index/product/components/TopProductsColumn/TopProductsColumnGrid.tsx` (⚠️ NO scrollPosition)

#### 4. CSS Effects (2 files)

Blur effect import:
```typescript
import llimageStyle from 'react-lazy-load-image-component/src/effects/blur.css';
```
- `app/components/ProductCard/RegularCardWithActionButton.tsx`
- `app/components/ProductCard/index.tsx`

### Component Hierarchy Visualization

```
trackWindowScroll HOC (Route Level)
│
├─ scrollPosition prop drilling ─────────────┐
│                                             │
├─ CategoryPreview                            │
│  └─ ProductRow                              │
│     └─ RegularCardWithActionButton          │
│        └─ LazyLoadComponent ← scrollPosition│
│           └─ <Image> (remix-image)          │
│                                             │
├─ ProductRowsContainer                       │
│  └─ RegularCardWithActionButton             │
│     └─ LazyLoadComponent ← scrollPosition───┘
│        └─ <Image> (remix-image)
│
└─ ProductGrid (Legacy)
   ├─ MediumGrid
   │  └─ LazyLoadImage ← scrollPosition
   └─ LargeGrid
      └─ LazyLoadImage ← scrollPosition
```

### Issues with Current Architecture

1. **Prop Drilling:** `scrollPosition` passed through 3-4 layers unnecessarily
2. **Tight Coupling:** Components coupled to parent HOC implementation
3. **Type Complexity:** `ScrollPosition` and `LazyComponentProps` types spread across files
4. **Legacy Patterns:** Mix of LazyLoadComponent and LazyLoadImage patterns
5. **Missing Optimization:** TopProductsColumnGrid doesn't use scrollPosition properly
6. **Bundle Size:** All routes load the HOC even if not needed

---

## Migration Strategy

### Design Decisions

Based on user preferences:

1. **Architecture:** Component-level with `useInView` hook (eliminates prop drilling)
2. **Loading Effect:** Fade-in animation (custom CSS)
3. **Threshold:** 500px rootMargin (matches current `threshold={500}`)

### Key Benefits

1. **Simplified Code:** Remove 13 files worth of prop drilling
2. **Better Performance:** Only load intersection observer where needed
3. **Easier Maintenance:** Each component self-contained
4. **Type Safety:** Simpler TypeScript types
5. **Bundle Optimization:** Better tree-shaking

### Migration Approach

**Bottom-Up Strategy:**
1. Create reusable components first
2. Migrate leaf components (actual image rendering)
3. Remove prop drilling from intermediate components
4. Remove HOC from routes
5. Cleanup and uninstall old package

**Why Bottom-Up?**
- Changes are backward compatible during migration
- Can test each component independently
- Reduces risk of breaking changes
- Easier to rollback if issues arise

---

## Implementation Phases

### Phase 1: Install & Create Reusable Components

**Tasks:**

1. Install `react-intersection-observer`:
```bash
npm install react-intersection-observer
```

2. Create `app/components/LazyImage/LazyImage.tsx`:
```typescript
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export function LazyImage({ src, alt, className = '', placeholder = '/images/placeholder.svg' }: LazyImageProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '500px',
  });
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${loaded ? 'lazy-image-loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <img src={placeholder} alt="" className="lazy-image-placeholder" />
      )}
    </div>
  );
}
```

3. Create `app/components/LazyImage/LazyImage.css`:
```css
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease-in;
}

.lazy-image-loaded {
  opacity: 1;
}

.lazy-image-placeholder {
  opacity: 0.5;
}
```

4. Create `app/components/LazyImage/index.ts`:
```typescript
export { LazyImage } from './LazyImage';
```

5. Create `app/components/LazyWrapper/LazyWrapper.tsx` (for wrapping remix-image):
```typescript
import { useInView } from 'react-intersection-observer';
import type { ReactNode } from 'react';

interface LazyWrapperProps {
  children: ReactNode;
  threshold?: number;
}

export function LazyWrapper({ children, threshold = 500 }: LazyWrapperProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: `${threshold}px`,
  });

  return (
    <div ref={ref}>
      {inView ? children : <div className="h-full w-full bg-gray-200" />}
    </div>
  );
}
```

6. Create `app/components/LazyWrapper/index.ts`:
```typescript
export { LazyWrapper } from './LazyWrapper';
```

**Files Created:** 5 new files

---

### Phase 2: Migrate Leaf Components (Actual Image Rendering)

These are the components that actually render images. Migrating these first allows us to test the new lazy loading without changing the architecture.

#### 2.1 RegularCardWithActionButton.tsx (HIGHEST PRIORITY)

**File:** `app/components/ProductCard/RegularCardWithActionButton.tsx`

**Current Usage:**
```typescript
import * as LazyImage from 'react-lazy-load-image-component';
const { LazyLoadComponent } = LazyImage;
import llimageStyle from 'react-lazy-load-image-component/src/effects/blur.css';

<LazyLoadComponent threshold={500} scrollPosition={scrollPosition}>
  <Image src={mainPic} loaderUrl='/remix-image' />
</LazyLoadComponent>
```

**Changes:**
1. Remove LazyImage import and blur.css import
2. Import LazyWrapper
3. Replace LazyLoadComponent with LazyWrapper
4. Remove scrollPosition from props interface

**New Code:**
```typescript
import { LazyWrapper } from '~/components/LazyWrapper';

// Remove from interface:
// scrollPosition?: ScrollPosition;

<LazyWrapper threshold={500}>
  <Image src={mainPic} loaderUrl='/remix-image' />
</LazyWrapper>
```

**Lines to modify:** Lines 9-11 (import), 32 (CSS import), 60-65 (interface), 188-214 (usage)

#### 2.2 MediumGrid.tsx

**File:** `app/components/ProductGrid/MediumGrid.tsx`

**Current Usage:**
```typescript
import * as LazyImage from 'react-lazy-load-image-component';
const { LazyLoadImage, ScrollPosition } = LazyImage;

<LazyLoadImage
  placeholder={<img src="/images/placeholder.svg" />}
  alt={title}
  className="medium-grid-image opacity-0"
  src={image}
  scrollPosition={scrollPosition}
/>
```

**New Code:**
```typescript
import { LazyImage } from '~/components/LazyImage';

<LazyImage
  src={image}
  alt={title}
  className="medium-grid-image"
  placeholder="/images/placeholder.svg"
/>
```

**Lines to modify:** Lines 3-5 (import), 23-28 (interface), 94-106 (usage)

#### 2.3 LargeGrid.tsx

**File:** `app/components/ProductGrid/LargeGrid.tsx`

**Current Usage:**
```typescript
import * as LazyImage from 'react-lazy-load-image-component';
const { LazyLoadImage, ScrollPosition } = LazyImage;

<LazyLoadImage
  src={image}
  scrollPosition={scrollPosition}
  placeholder={<img src="/images/placeholder.svg" />}
/>
```

**New Code:**
```typescript
import { LazyImage } from '~/components/LazyImage';

<LazyImage
  src={image}
  alt={title || 'Product image'}
  placeholder="/images/placeholder.svg"
/>
```

**Lines to modify:** Lines 2-4 (import), 18-22 (interface), 75-87 (usage)

#### 2.4 TopProductsColumnGrid.tsx (ADD LAZY LOADING)

**File:** `app/routes/__index/product/components/TopProductsColumn/TopProductsColumnGrid.tsx`

**Current Usage:**
```typescript
import * as LazyImage from 'react-lazy-load-image-component';
const { LazyLoadImage } = LazyImage;

<LazyLoadImage
  src={image}
  className="w-[90px] h-[90px]"
  alt={title}
  placeholder={<img src="/images/placeholder.svg" />}
/>
```

**Issue:** Currently NOT using scrollPosition prop - missing optimization

**New Code:**
```typescript
import { LazyImage } from '~/components/LazyImage';

<LazyImage
  src={image}
  alt={title}
  className="w-[90px] h-[90px]"
  placeholder="/images/placeholder.svg"
/>
```

**Lines to modify:** Lines 4-6 (import), 32-43 (usage)

#### 2.5 win-a-free-surprise-gift.tsx (ItemCard component)

**File:** `app/routes/__index/events/win-a-free-surprise-gift.tsx`

**Current Usage:**
```typescript
import * as LazyImage from 'react-lazy-load-image-component';
const { trackWindowScroll, LazyLoadComponent, ScrollPosition } = LazyImage;

// In ItemCard component (lines 54-131)
<LazyLoadComponent threshold={500} scrollPosition={scrollPosition}>
  <Image src={item.image} loaderUrl='/remix-image' />
</LazyLoadComponent>
```

**New Code:**
```typescript
import { useInView } from 'react-intersection-observer';

// In ItemCard component
const { ref, inView } = useInView({
  triggerOnce: true,
  rootMargin: '500px',
});

<div ref={ref}>
  {inView ? <Image src={item.image} loaderUrl='/remix-image' /> : <div className="h-40 bg-gray-200" />}
</div>
```

**Note:** This component is special - it's in a route file but also defines ItemCard. We'll handle the route export in Phase 4.

**Lines to modify:** Lines 6-8 (import), 54-131 (ItemCard component)

**Summary - Phase 2:**
- Files modified: 5 files
- Pattern: Replace LazyLoadComponent/LazyLoadImage with new components
- Testing: Each component can be tested independently

---

### Phase 3: Remove Prop Drilling from Intermediate Components

Remove `scrollPosition` prop from components that only pass it down.

#### 3.1 CategoryPreview

**File:** `app/components/CategoryPreview/index.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface (line 20)
interface ICategoryPreview {
  category: TCategoryPreview;
  onClickProduct: (uuid: string) => void;
-  scrollPosition?: ScrollPosition;
}

// Remove from props passed to ProductRow (multiple locations)
<ProductRow
  key={`productRow_${category.name}_${index}`}
  category={category}
  products={category.products}
  onClickProduct={onClickProduct}
-  scrollPosition={scrollPosition}
/>
```

**Lines to modify:** Lines 5-7 (import), 20 (interface), all ProductRow calls

#### 3.2 ProductCard/utils.ts

**File:** `app/components/ProductCard/utils.ts`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
export interface IProductCard {
  product: TProduct | TProductPromotion;
  onClickProduct: (uuid: string) => void;
-  scrollPosition?: ScrollPosition;
}
```

**Lines to modify:** Lines 8-10 (import), interface definition

#### 3.3 ProductRow/ProductRow.tsx

**File:** `app/components/ProductRow/ProductRow.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
interface IProductRow {
  category: TCategoryPreview;
  products: (TProduct | TProductPromotion)[];
  onClickProduct: (uuid: string) => void;
-  scrollPosition?: ScrollPosition;
}

// Remove scrollPosition from props passed to RegularCardWithActionButton
<RegularCardWithActionButton
  key={product.uuid}
  product={product}
  onClickProduct={onClickProduct}
-  scrollPosition={scrollPosition}
/>
```

**Lines to modify:** Lines 6-8 (import), interface, all card component calls

#### 3.4 ProductRow/EvenRow.tsx

**File:** `app/components/ProductRow/EvenRow.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
interface EvenRowProps {
  products: TProduct[];
-  scrollPosition?: ScrollPosition;
}

// Remove scrollPosition from MediumGrid calls (no longer needed)
```

**Lines to modify:** Lines 2-4 (import), interface, MediumGrid calls

#### 3.5 ProductRow/OneMainTwoSubs.tsx

**File:** `app/components/ProductRow/OneMainTwoSubs.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
interface OneMainTwoSubsProps {
  products: TProduct[];
-  scrollPosition?: ScrollPosition;
}

// Remove scrollPosition from grid calls
```

**Lines to modify:** Lines 3-5 (import), interface, grid component calls

#### 3.6 ProductPromotionRow/ProductPromotionRow.tsx

**File:** `app/components/ProductPromotionRow/ProductPromotionRow.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
interface IProductPromotionRow {
  products: TProductPromotion[];
  onClickProduct: (uuid: string) => void;
-  scrollPosition?: ScrollPosition;
}

// Remove scrollPosition from RegularCardWithActionButton calls
```

**Lines to modify:** Lines 5-7 (import), interface, card calls

#### 3.7 ProductRowsContainer/index.tsx

**File:** `app/routes/__index/components/ProductRowsContainer/index.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
interface ProductRowsContainerProps {
  products: TProduct[];
  layout?: string;
-  scrollPosition?: ScrollPosition;
}

// Remove scrollPosition from RegularCardWithActionButton calls
```

**Lines to modify:** Lines 2-4 (import), interface, card calls

#### 3.8 ProductRowsContainer/ThreeColumns.tsx

**File:** `app/routes/__index/components/ProductRowsContainer/ThreeColumns.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
interface ProductRowsContainerProps {
  products: TProduct[];
-  scrollPosition?: ScrollPosition;
}

// Remove scrollPosition from RegularCardWithActionButton calls
```

**Lines to modify:** Lines 2-4 (import), interface, card calls

#### 3.9 product/components/RecommendedProducts/index.tsx

**File:** `app/routes/__index/product/components/RecommendedProducts/index.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { ScrollPosition } = LazyImage;

// Remove from interface
interface RecommendedProductsProps {
  recommendedProducts: TProduct[];
  onClickProduct: (uuid: string) => void;
-  scrollPosition?: ScrollPosition;
}

// Remove scrollPosition from ProductPromotionRow call
```

**Lines to modify:** Lines 6-8 (import), interface, ProductPromotionRow call

#### 3.10 ProductCard/index.tsx (Remove blur.css import only)

**File:** `app/components/ProductCard/index.tsx`

**Changes:**
```typescript
// Remove blur.css import
- import llimageStyle from 'react-lazy-load-image-component/src/effects/blur.css';
```

**Note:** This file might not use LazyLoadComponent directly, but imports the CSS. Just remove the import.

**Lines to modify:** Line 32 (CSS import)

**Summary - Phase 3:**
- Files modified: 10 files
- Pattern: Remove imports, remove scrollPosition from interfaces and prop passing
- Testing: Verify components still render correctly (should be backward compatible)

---

### Phase 4: Remove trackWindowScroll HOC from Routes

Remove the HOC wrapper from all route files.

#### 4.1 routes/__index/index.tsx (Home)

**File:** `app/routes/__index/index.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { trackWindowScroll } = LazyImage;

// Remove debug console.log (line 23)
- console.log('~~~*', typeof trackWindowScroll, trackWindowScroll)

// Update function signature (remove scrollPosition param)
- function Index({ scrollPosition }) {
+ function Index() {

// Remove scrollPosition from CategoryPreview calls (line 161)
<CategoryPreview
  key={`${category.name}_${index}`}
  category={category}
  onClickProduct={handleClickProduct}
-  scrollPosition={scrollPosition}
/>

// Change default export (line 200)
- export default trackWindowScroll(Index);
+ export default Index;
```

**Lines to modify:** Lines 3-5 (import), 23 (console.log), 95 (function signature), 161 (CategoryPreview calls), 200 (export)

#### 4.2 routes/__index/product/$prodId.tsx (Product Detail)

**File:** `app/routes/__index/product/$prodId.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { trackWindowScroll, LazyComponentProps } = LazyImage;

// Update type definition (remove LazyComponentProps)
- type ProductDetailProps = LoaderData & LazyComponentProps;
+ type ProductDetailProps = LoaderData;

// Update function signature
- function ProductDetailPage({ scrollPosition }: ProductDetailProps) {
+ function ProductDetailPage() {

// Remove scrollPosition from RecommendedProducts call
<RecommendedProducts
  recommendedProducts={recommendedProducts}
  onClickProduct={handleClickProduct}
-  scrollPosition={scrollPosition}
/>

// Change default export (line 340)
- export default trackWindowScroll(ProductDetailPage);
+ export default ProductDetailPage;
```

**Lines to modify:** Lines 10-12 (import), type definition, function signature, RecommendedProducts call, 340 (export)

#### 4.3 routes/__index/collection/$collection.tsx (Collection)

**File:** `app/routes/__index/collection/$collection.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { trackWindowScroll, LazyComponentProps } = LazyImage;

// Update type definition
- type CollectionProps = LoaderData & LazyComponentProps;
+ type CollectionProps = LoaderData;

// Update function signature
- function Collection({ scrollPosition }: CollectionProps) {
+ function Collection() {

// Remove scrollPosition from ThreeColumns calls
<ThreeColumns
  products={collectionProducts}
-  scrollPosition={scrollPosition}
/>

// Change default export (line 504)
- export default trackWindowScroll(Collection);
+ export default Collection;
```

**Lines to modify:** Lines 17-19 (import), type definition, function signature, ThreeColumns calls, 504 (export)

#### 4.4 routes/__index/search/index.tsx (Search)

**File:** `app/routes/__index/search/index.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { trackWindowScroll, LazyComponentProps } = LazyImage;

// Update type definition
- type TSearch = TLoaderData & LazyComponentProps;
+ type TSearch = TLoaderData;

// Update function signature
- function Search({ scrollPosition }: TSearch) {
+ function Search() {

// Remove scrollPosition from ProductRowsContainer calls
<ProductRowsContainer
  products={products}
-  scrollPosition={scrollPosition}
/>

// Change default export (line 189)
- export default trackWindowScroll(Search);
+ export default Search;
```

**Lines to modify:** Lines 5-7 (import), type definition, function signature, ProductRowsContainer calls, 189 (export)

#### 4.5 routes/__index/promotion/$promotion.tsx (Promotion)

**File:** `app/routes/__index/promotion/$promotion.tsx`

**Changes:**
```typescript
// Remove import
- import * as LazyImage from 'react-lazy-load-image-component';
- const { trackWindowScroll, LazyComponentProps } = LazyImage;

// Update type definition
- type TPromotion = TLoaderData & LazyComponentProps;
+ type TPromotion = TLoaderData;

// Update function signature
- function Promotion({ scrollPosition }: TPromotion) {
+ function Promotion() {

// Remove scrollPosition from ProductRowsContainer calls
<ProductRowsContainer
  products={promotionProducts}
-  scrollPosition={scrollPosition}
/>

// Change default export (line 295)
- export default trackWindowScroll(Promotion);
+ export default Promotion;
```

**Lines to modify:** Lines 6-8 (import), type definition, function signature, ProductRowsContainer calls, 295 (export)

#### 4.6 routes/__index/events/win-a-free-surprise-gift.tsx (Event)

**File:** `app/routes/__index/events/win-a-free-surprise-gift.tsx`

**Changes:**
```typescript
// Remove import (keep only what's needed for ItemCard if we didn't handle it in Phase 2)
- import * as LazyImage from 'react-lazy-load-image-component';
- const { trackWindowScroll, LazyLoadComponent, ScrollPosition } = LazyImage;

// Remove scrollPosition from ItemCard interface (lines 48-52)
interface ItemCardProps {
  item: Item;
-  scrollPosition?: ScrollPosition;
}

// Update EventsEasterHunter function signature (line 183)
- const EventsEasterHunter = ({ scrollPosition }) => {
+ const EventsEasterHunter = () => {

// Remove scrollPosition from ItemCard calls (multiple locations)
<ItemCard
  item={item}
-  scrollPosition={scrollPosition}
/>

// Change default export (line 545)
- export default trackWindowScroll(EventsEasterHunter);
+ export default EventsEasterHunter;
```

**Lines to modify:** Lines 6-8 (import), ItemCard interface, function signature, ItemCard calls, 545 (export)

**Summary - Phase 4:**
- Files modified: 6 files
- Pattern: Remove HOC, remove scrollPosition from function signatures and calls
- Testing: Full page testing needed - verify all routes work correctly

---

### Phase 5: Cleanup & Package Removal

Final cleanup steps.

#### 5.1 Remove Package Dependencies

**File:** `package.json`

Remove these lines:
```json
"react-lazy-load-image-component": "1.6.3",  // line 79
"@types/react-lazy-load-image-component": "1.6.4",  // line 130
```

#### 5.2 Update Vite Configuration

**File:** `vite.config.ts`

Remove from `optimizeDeps.include` array:
```typescript
optimizeDeps: {
  include: [
    // ... other deps
-    'react-lazy-load-image-component',
  ],
}
```

**Line to modify:** Line 24

#### 5.3 Uninstall Package

Run:
```bash
npm uninstall react-lazy-load-image-component @types/react-lazy-load-image-component
```

#### 5.4 Verification

1. Search codebase for any remaining references:
```bash
grep -r "react-lazy-load-image-component" app/
grep -r "LazyLoadImage" app/
grep -r "LazyLoadComponent" app/
grep -r "trackWindowScroll" app/
grep -r "scrollPosition" app/
```

2. Check for any TypeScript errors:
```bash
npm run typecheck
```

3. Test build:
```bash
npm run build
```

**Summary - Phase 5:**
- Files modified: 2 files (package.json, vite.config.ts)
- Commands: 1 uninstall command
- Testing: Build verification, type checking

---

## Code Examples

### Before & After Comparison

#### Example 1: Route Component (Home Page)

**Before:**
```typescript
// app/routes/__index/index.tsx
import * as LazyImage from 'react-lazy-load-image-component';
const { trackWindowScroll } = LazyImage;

function Index({ scrollPosition }) {
  return (
    <div>
      <CategoryPreview
        category={category}
        scrollPosition={scrollPosition}
      />
    </div>
  );
}

export default trackWindowScroll(Index);
```

**After:**
```typescript
// app/routes/__index/index.tsx
function Index() {
  return (
    <div>
      <CategoryPreview category={category} />
    </div>
  );
}

export default Index;
```

**Benefits:**
- Removed 4 lines of imports
- Removed HOC wrapper
- Removed prop passing
- Simpler, cleaner code

#### Example 2: Intermediate Component (ProductRow)

**Before:**
```typescript
// app/components/ProductRow/ProductRow.tsx
import * as LazyImage from 'react-lazy-load-image-component';
const { ScrollPosition } = LazyImage;

interface IProductRow {
  products: TProduct[];
  scrollPosition?: ScrollPosition;
}

function ProductRow({ products, scrollPosition }: IProductRow) {
  return (
    <>
      {products.map(product => (
        <RegularCardWithActionButton
          product={product}
          scrollPosition={scrollPosition}
        />
      ))}
    </>
  );
}
```

**After:**
```typescript
// app/components/ProductRow/ProductRow.tsx
interface IProductRow {
  products: TProduct[];
}

function ProductRow({ products }: IProductRow) {
  return (
    <>
      {products.map(product => (
        <RegularCardWithActionButton product={product} />
      ))}
    </>
  );
}
```

**Benefits:**
- Removed 2 lines of imports
- Removed unnecessary prop
- Component is now self-contained

#### Example 3: Leaf Component (RegularCardWithActionButton)

**Before:**
```typescript
// app/components/ProductCard/RegularCardWithActionButton.tsx
import * as LazyImage from 'react-lazy-load-image-component';
const { LazyLoadComponent } = LazyImage;
import llimageStyle from 'react-lazy-load-image-component/src/effects/blur.css';

interface IProductCard {
  product: TProduct;
  scrollPosition?: ScrollPosition;
}

function RegularCardWithActionButton({ product, scrollPosition }: IProductCard) {
  return (
    <LazyLoadComponent
      threshold={500}
      scrollPosition={scrollPosition}
    >
      <Image src={product.image} loaderUrl='/remix-image' />
    </LazyLoadComponent>
  );
}
```

**After:**
```typescript
// app/components/ProductCard/RegularCardWithActionButton.tsx
import { LazyWrapper } from '~/components/LazyWrapper';

interface IProductCard {
  product: TProduct;
}

function RegularCardWithActionButton({ product }: IProductCard) {
  return (
    <LazyWrapper threshold={500}>
      <Image src={product.image} loaderUrl='/remix-image' />
    </LazyWrapper>
  );
}
```

**Benefits:**
- Cleaner imports (1 line instead of 3)
- No external CSS dependency
- No scrollPosition prop needed
- Uses modern hook-based approach

#### Example 4: Legacy Grid Component

**Before:**
```typescript
// app/components/ProductGrid/LargeGrid.tsx
import * as LazyImage from 'react-lazy-load-image-component';
const { LazyLoadImage, ScrollPosition } = LazyImage;

interface Props {
  scrollPosition?: ScrollPosition;
}

function LargeGrid({ product, scrollPosition }: Props) {
  return (
    <LazyLoadImage
      src={product.image}
      scrollPosition={scrollPosition}
      placeholder={<img src="/images/placeholder.svg" />}
      alt={product.title}
    />
  );
}
```

**After:**
```typescript
// app/components/ProductGrid/LargeGrid.tsx
import { LazyImage } from '~/components/LazyImage';

interface Props {
  product: TProduct;
}

function LargeGrid({ product }: Props) {
  return (
    <LazyImage
      src={product.image}
      alt={product.title}
      placeholder="/images/placeholder.svg"
    />
  );
}
```

**Benefits:**
- Simplified component with built-in lazy loading
- No prop drilling needed
- Fade-in effect included

---

## Testing Strategy

### Testing Phases

#### Phase 1: Component-Level Testing

After migrating leaf components, test each individually:

1. **Visual Testing:**
   - Verify images load when scrolling into viewport
   - Check fade-in animation works smoothly
   - Confirm placeholder shows before load
   - Test on slow network (Chrome DevTools throttling)

2. **Functional Testing:**
   - Images load at correct threshold (500px before viewport)
   - Images only load once (triggerOnce behavior)
   - Multiple images on same page work independently
   - No console errors or warnings

**Test Components:**
- RegularCardWithActionButton
- MediumGrid
- LargeGrid
- TopProductsColumnGrid
- ItemCard (event page)

#### Phase 2: Integration Testing

After removing prop drilling, test component chains:

1. **Home Page (`/`):**
   - Scroll through category previews
   - Verify all product images lazy load
   - Check performance (no lag during scroll)

2. **Product Detail (`/product/:id`):**
   - Test recommended products section
   - Verify top products column loads correctly

3. **Collection Page (`/collection/:name`):**
   - Test product grid lazy loading
   - Verify pagination/filtering still works

4. **Search Page (`/search`):**
   - Test search results lazy loading
   - Verify infinite scroll (if applicable)

5. **Promotion Page (`/promotion/:id`):**
   - Test promotional product grids
   - Verify special layouts work

6. **Event Page (`/events/win-a-free-surprise-gift`):**
   - Test tier cards with item images
   - Verify special event interactions

#### Phase 3: Performance Testing

Compare before/after metrics:

**Metrics to Track:**
- Initial page load time
- Time to First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size (check with `npm run build`)
- Network requests (check in DevTools Network tab)
- Memory usage (Chrome DevTools Performance monitor)

**Tools:**
- Chrome Lighthouse
- WebPageTest
- React DevTools Profiler

**Expected Improvements:**
- Smaller initial bundle (HOC removed from routes)
- Better tree-shaking (component-level imports)
- Similar or better lazy loading performance

#### Phase 4: Browser Testing

Test on multiple browsers and devices:

**Desktop:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Mobile:**
- iOS Safari
- Android Chrome
- Mobile responsive mode

**Test Scenarios:**
- Fast scrolling
- Slow scrolling
- Back/forward navigation
- Refresh page mid-scroll

#### Phase 5: Regression Testing

Verify no functionality was broken:

**Checklist:**
- [ ] Images load correctly on all pages
- [ ] Click interactions on products work
- [ ] Hover effects work (if any)
- [ ] Analytics tracking fires (if image visibility tracked)
- [ ] SEO: Images have proper alt text
- [ ] Accessibility: Keyboard navigation works
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Build succeeds without issues

### Automated Testing

Consider adding tests:

```typescript
// Example test for LazyImage component
import { render, waitFor } from '@testing-library/react';
import { LazyImage } from '~/components/LazyImage';

test('LazyImage loads image when in viewport', async () => {
  const { getByAlt } = render(
    <LazyImage
      src="/test-image.jpg"
      alt="Test image"
      placeholder="/placeholder.svg"
    />
  );

  // Initially shows placeholder
  expect(document.querySelector('img[src="/placeholder.svg"]')).toBeInTheDocument();

  // After intersection (mocked), shows actual image
  await waitFor(() => {
    expect(getByAlt('Test image')).toHaveAttribute('src', '/test-image.jpg');
  });
});
```

**Note:** You may need to mock `react-intersection-observer` for testing. See their docs for test utilities.

---

## Rollback Plan

If issues arise during migration:

### Rollback Strategy

**Git-Based Rollback:**

1. Each phase should be committed separately:
```bash
git commit -m "Phase 1: Add LazyImage and LazyWrapper components"
git commit -m "Phase 2: Migrate leaf components to new lazy loading"
git commit -m "Phase 3: Remove prop drilling from intermediate components"
git commit -m "Phase 4: Remove trackWindowScroll HOC from routes"
git commit -m "Phase 5: Cleanup and remove old package"
```

2. If issues found, rollback to last working commit:
```bash
git log --oneline  # Find the commit hash
git revert <commit-hash>  # Or git reset --hard <commit-hash>
```

### Partial Rollback

If only specific components have issues:

1. **Revert specific file:**
```bash
git checkout HEAD~1 -- app/components/ProductCard/RegularCardWithActionButton.tsx
```

2. **Keep both systems temporarily:**
   - Don't uninstall old package immediately
   - Keep old components alongside new ones
   - Gradually migrate with feature flags

**Example with feature flag:**
```typescript
const USE_NEW_LAZY_LOADING = false;

return USE_NEW_LAZY_LOADING ? (
  <LazyWrapper><Image src={src} /></LazyWrapper>
) : (
  <LazyLoadComponent scrollPosition={scrollPosition}>
    <Image src={src} />
  </LazyLoadComponent>
);
```

### Emergency Rollback

If production issues occur:

1. **Immediate:** Revert entire PR/branch
2. **Quick fix:** Deploy previous working version
3. **Investigate:** Review logs, errors, user reports
4. **Fix forward:** Create hotfix branch with targeted fix

---

## Migration Checklist

### Pre-Migration

- [ ] Create feature branch: `git checkout -b feat/migrate-lazy-loading`
- [ ] Document current bundle size (run `npm run build`)
- [ ] Take screenshots of pages for visual comparison
- [ ] Backup current code (create git tag)
- [ ] Review this migration plan with team

### Phase 1: Setup

- [ ] Install `react-intersection-observer`
- [ ] Create `app/components/LazyImage/LazyImage.tsx`
- [ ] Create `app/components/LazyImage/LazyImage.css`
- [ ] Create `app/components/LazyImage/index.ts`
- [ ] Create `app/components/LazyWrapper/LazyWrapper.tsx`
- [ ] Create `app/components/LazyWrapper/index.ts`
- [ ] Test LazyImage component in isolation
- [ ] Test LazyWrapper component in isolation
- [ ] Commit: "Phase 1: Add LazyImage and LazyWrapper components"

### Phase 2: Leaf Components

- [ ] Migrate `RegularCardWithActionButton.tsx`
- [ ] Test RegularCardWithActionButton on home page
- [ ] Migrate `MediumGrid.tsx`
- [ ] Test MediumGrid component
- [ ] Migrate `LargeGrid.tsx`
- [ ] Test LargeGrid component
- [ ] Migrate `TopProductsColumnGrid.tsx`
- [ ] Test TopProductsColumnGrid on product page
- [ ] Migrate `win-a-free-surprise-gift.tsx` ItemCard
- [ ] Test event page
- [ ] Commit: "Phase 2: Migrate leaf components"

### Phase 3: Remove Prop Drilling

- [ ] Update `CategoryPreview/index.tsx`
- [ ] Update `ProductCard/utils.ts`
- [ ] Update `ProductRow/ProductRow.tsx`
- [ ] Update `ProductRow/EvenRow.tsx`
- [ ] Update `ProductRow/OneMainTwoSubs.tsx`
- [ ] Update `ProductPromotionRow/ProductPromotionRow.tsx`
- [ ] Update `ProductRowsContainer/index.tsx`
- [ ] Update `ProductRowsContainer/ThreeColumns.tsx`
- [ ] Update `product/components/RecommendedProducts/index.tsx`
- [ ] Update `ProductCard/index.tsx` (remove CSS import)
- [ ] Run TypeScript check: `npm run typecheck`
- [ ] Test all pages still work correctly
- [ ] Commit: "Phase 3: Remove prop drilling"

### Phase 4: Remove HOC

- [ ] Update `routes/__index/index.tsx`
- [ ] Test home page thoroughly
- [ ] Update `routes/__index/product/$prodId.tsx`
- [ ] Test product detail page
- [ ] Update `routes/__index/collection/$collection.tsx`
- [ ] Test collection page
- [ ] Update `routes/__index/search/index.tsx`
- [ ] Test search page
- [ ] Update `routes/__index/promotion/$promotion.tsx`
- [ ] Test promotion page
- [ ] Update `routes/__index/events/win-a-free-surprise-gift.tsx`
- [ ] Test event page
- [ ] Run TypeScript check: `npm run typecheck`
- [ ] Run dev server and test all routes
- [ ] Commit: "Phase 4: Remove trackWindowScroll HOC"

### Phase 5: Cleanup

- [ ] Remove from `package.json` (2 entries)
- [ ] Update `vite.config.ts`
- [ ] Run `npm uninstall react-lazy-load-image-component @types/react-lazy-load-image-component`
- [ ] Search for remaining references (grep)
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build`
- [ ] Check bundle size (should be smaller)
- [ ] Commit: "Phase 5: Cleanup and remove old package"

### Post-Migration

- [ ] Full manual testing of all pages
- [ ] Performance testing (Lighthouse)
- [ ] Browser compatibility testing
- [ ] Mobile responsive testing
- [ ] Take screenshots for comparison
- [ ] Update documentation (if any)
- [ ] Create PR for review
- [ ] Deploy to staging environment
- [ ] QA testing on staging
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Risk Assessment

### Low Risk

✅ **Component-level changes:** Each component is isolated and can be tested independently

✅ **Backward compatible during migration:** Can migrate gradually without breaking existing code

✅ **Well-documented package:** `react-intersection-observer` is widely used and well-maintained

### Medium Risk

⚠️ **Prop drilling removal:** Need to ensure all props are correctly removed from the chain

⚠️ **TypeScript types:** Must update all interfaces/types correctly

⚠️ **Testing coverage:** Requires thorough testing across all pages

### Mitigation Strategies

1. **Phase-by-phase commits:** Easy rollback to any point
2. **Bottom-up migration:** Leaf components first, HOC last
3. **Comprehensive testing:** Manual testing at each phase
4. **Feature branch:** All work in isolated branch before merging

---

## Expected Outcomes

### Code Quality Improvements

- **-150 lines of code** (approx): Removed prop drilling and HOC
- **Simpler architecture:** Component-level responsibility
- **Better TypeScript:** Simpler types, fewer generic constraints
- **Easier maintenance:** Self-contained components

### Performance Improvements

- **Smaller initial bundle:** HOC removed from routes
- **Better tree-shaking:** Only import what's needed per component
- **Same or better lazy loading:** 500px threshold maintained
- **Reduced memory:** Observer instance reuse built into react-intersection-observer

### Developer Experience Improvements

- **Easier to understand:** No HOC magic, clear component behavior
- **Easier to test:** Each component independent
- **Less boilerplate:** No prop drilling through 4+ layers
- **Modern patterns:** Hooks-based approach

---

## Timeline Estimate

| Phase | Time Estimate | Risk Level |
|-------|--------------|------------|
| Phase 1: Setup | 30 minutes | Low |
| Phase 2: Leaf Components | 1 hour | Low-Medium |
| Phase 3: Remove Prop Drilling | 45 minutes | Medium |
| Phase 4: Remove HOC | 30 minutes | Low |
| Phase 5: Cleanup | 15 minutes | Low |
| **Development Total** | **3 hours** | |
| Testing | 1 hour | Medium |
| Code Review | 30 minutes | Low |
| **Grand Total** | **4.5 hours** | |

---

## Additional Notes

### Why react-intersection-observer?

1. **Modern:** Hooks-based API (fits React 18+ patterns)
2. **Lightweight:** ~1KB gzipped
3. **TypeScript native:** Full type definitions
4. **Well-maintained:** Active development, 3M+ weekly downloads
5. **Better API:** Simpler than react-lazy-load-image-component
6. **Test utilities:** Built-in mocking for tests

### Alternative Considered

**Native Intersection Observer API:**
- Pros: No dependency, slightly smaller
- Cons: More boilerplate, need to handle cleanup manually, no React integration
- Decision: `react-intersection-observer` provides better DX with minimal overhead

### Future Enhancements

After migration complete, consider:

1. **Add loading skeletons:** Instead of just placeholders
2. **Progressive image loading:** Load low-res first, then high-res
3. **Analytics integration:** Track which products are actually viewed
4. **Image optimization:** Use next-gen formats (WebP, AVIF)
5. **Viewport-based prioritization:** Load above-fold images first

---

## Questions & Answers

### Q: Why not keep the HOC pattern?

**A:** The HOC pattern with `trackWindowScroll` creates tight coupling and unnecessary prop drilling. With `react-intersection-observer`, each component can independently manage its visibility without props from parent routes. This is more aligned with modern React patterns (hooks over HOCs).

### Q: Will this affect SEO?

**A:** No. Images still have proper `src` attributes (either actual image or placeholder) and `alt` text. Search engine bots don't execute JavaScript that simulates scrolling, so they'll see placeholders - same as current behavior. For critical above-the-fold images, consider eager loading (no lazy loading).

### Q: What about images above the fold?

**A:** With `rootMargin: '500px'`, images start loading 500px before entering the viewport. This means above-the-fold images on mobile should load immediately on most devices. For guaranteed immediate loading, you could skip lazy loading for the first few products or add a `priority` prop.

### Q: Can we still use remix-image?

**A:** Yes! The `LazyWrapper` component wraps the remix-image `<Image>` component and only renders it when in view. This maintains all remix-image optimizations (resizing, format conversion, etc.).

### Q: What if intersection observer isn't supported?

**A:** `react-intersection-observer` gracefully falls back - it will immediately render the content if IntersectionObserver API is unavailable. All modern browsers support it (since 2019+). For older browsers, you can polyfill it.

### Q: Will bundle size increase?

**A:** No, it should decrease:
- **Removed:** `react-lazy-load-image-component` (~15KB)
- **Added:** `react-intersection-observer` (~1KB)
- **Net change:** -14KB (approximate)

### Q: What about the blur effect?

**A:** We're replacing it with a fade-in effect using simple CSS transitions. The blur effect required importing CSS from node_modules, which is not ideal. Fade-in is cleaner and more performant.

---

## References

- [react-intersection-observer GitHub](https://github.com/thebuilder/react-intersection-observer)
- [react-intersection-observer Documentation](https://github.com/thebuilder/react-intersection-observer#readme)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Web.dev: Lazy Loading Images](https://web.dev/lazy-loading-images/)

---

## Document History

- **Created:** 2025-11-07
- **Author:** Claude Code (Migration Plan Generator)
- **Version:** 1.0
- **Status:** Ready for Implementation

---

**End of Migration Plan**
