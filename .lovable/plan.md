

# Final Visual Polish - Design System Consistency

## Overview

Apply typography hierarchy, spacing consistency, and component styling fixes across all pages. This pass addresses page headings, empty states, the Brand page tabs override, and stat card typography to ensure DS compliance.

---

## Changes

### 1. Typography Hierarchy Standardization (All Pages)

Page headings currently use `text-2xl font-bold`. Update to the DS spec: `text-[28px] font-semibold leading-tight`.

**Files affected:**
- `src/pages/Dashboard.tsx` - no page heading (uses cards), skip
- `src/pages/ContentLab.tsx` - line 72: `text-2xl font-bold` to `text-[28px] font-semibold leading-tight`
- `src/pages/Sprints.tsx` - line 1920: same update
- `src/pages/Ideas.tsx` - line 153: same update
- `src/pages/Frameworks.tsx` - line 104: same update
- `src/pages/Radar.tsx` - lines 78, 100: same update (two instances, gated/ungated)
- `src/pages/Brand.tsx` - line 78: same update
- `src/pages/Profile.tsx` - line 85: same update
- `src/pages/Pricing.tsx` - line 54 (`text-3xl font-bold` to `text-[28px] font-semibold leading-tight`), line 116 (`text-2xl font-bold` to `text-[22px] font-semibold leading-tight`)
- `src/pages/Strategy.tsx` - headings already use `text-lg font-semibold` (correct for Heading M), no change needed
- `src/components/onboarding/DiagnosticResults.tsx` - line 32: `text-2xl font-bold` to `text-[28px] font-semibold leading-tight`

Stat values in cards (e.g., ContentLab stats `text-2xl font-bold`, Radar stats `text-2xl font-bold`, Profile stats `text-3xl font-bold`) remain as-is since they are data values, not headings.

### 2. Brand.tsx - Tab Styling Override Fix

The Brand page TabsTriggers (lines 91-113) override the new flat tab style with `data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`. These overrides conflict with the DS flat bottom-indicator style already applied in `tabs.tsx`.

**Fix:** Remove the `className` overrides from all 6 TabsTriggers and remove `bg-secondary` from the TabsList. The base component styles will apply automatically.

### 3. Brand.tsx - TabsList Background

Line 90: `TabsList className="bg-secondary"` should be removed (or set to empty string) so the flat border-bottom style from the updated base component renders correctly.

### 4. Empty State Consistency Check

Review all empty states to ensure they follow the DS pattern: icon (size-12), headline (Heading M), description (body, max 2 lines), single CTA.

**Pages with empty states already well-formed:**
- Dashboard (sprint empty, tasks empty, AI suggestions empty) -- uses h-12 icons, descriptive text, CTA buttons. Already compliant.
- Brand.tsx (empty brand state) -- uses h-10 icon, could bump to h-12 for consistency but it's minor.
- Radar.tsx (EmptyTrends component) -- uses h-8 icon. Update in `src/components/radar/EmptyTrends.tsx` from `h-8 w-8` to `h-12 w-12`, and icon container from `h-16 w-16` to `h-20 w-20`.
- Frameworks empty search result (line 266) -- minimal, add icon and structure.

### 5. Skeleton Background Consistency

The DS spec says skeleton should use `bg-zinc-200 animate-pulse`. The current Skeleton component uses `bg-muted animate-pulse`. Since `--muted` maps to `zinc-50` in light mode, update the Skeleton to use `bg-zinc-200 dark:bg-zinc-800` for proper visibility.

**File:** `src/components/ui/skeleton.tsx`

### 6. Frameworks Empty Search State Enhancement

Line 265-268 in `src/pages/Frameworks.tsx`: currently just a `<p>` tag. Enhance to match DS empty state pattern with icon, heading, and description -- without adding new components or changing structure, just wrapping the existing content with proper styling classes.

---

## Technical Details - File-by-File

| File | Line(s) | Change |
|------|---------|--------|
| `ContentLab.tsx` | 72 | `text-2xl font-bold` to `text-[28px] font-semibold leading-tight` |
| `Sprints.tsx` | 1920 | Same heading update |
| `Ideas.tsx` | 153 | Same heading update |
| `Frameworks.tsx` | 104 | Same heading update |
| `Frameworks.tsx` | 265-268 | Enhance empty state with icon + structured text |
| `Radar.tsx` | 78, 100 | Same heading update (both instances) |
| `Brand.tsx` | 78 | Same heading update |
| `Brand.tsx` | 90-113 | Remove `bg-secondary` from TabsList, remove all `data-[state=active]:bg-primary data-[state=active]:text-primary-foreground` overrides from TabsTriggers |
| `Profile.tsx` | 85 | Same heading update |
| `Pricing.tsx` | 54 | `text-3xl font-bold` to `text-[28px] font-semibold leading-tight` |
| `Pricing.tsx` | 116 | `text-2xl font-bold` to `text-[22px] font-semibold leading-tight` |
| `DiagnosticResults.tsx` | 32 | `text-2xl font-bold` to `text-[28px] font-semibold leading-tight` |
| `EmptyTrends.tsx` | 14-15 | Icon container `h-16 w-16` to `h-20 w-20`, icon `h-8 w-8` to `h-12 w-12` |
| `skeleton.tsx` | 4 | `bg-muted` to `bg-zinc-200 dark:bg-zinc-800` |

## What Will NOT Change

- No routing, navigation, or page structure modifications
- No data fetching, mutations, or business logic changes
- No new components created
- No dependencies added
- All event handlers and form logic preserved

