

# Redesign Framework UI: Library, Selector, and Preview

## Overview

Three UI surfaces for content frameworks, all read-only. The current `Frameworks.tsx` page must be rebuilt (it has a "Criar Framework" button and uses mock data from context). The `ContentDetailSheet.tsx` selector needs refinement. A new inline preview component is needed for content review.

## Current State

- **`Frameworks.tsx`**: Uses `useApp()` context with mock `frameworks` array. Has a creation dialog, detail dialog with "Usar Framework" button. Does NOT use `useFrameworksDB` hook (DB data).
- **`ContentDetailSheet.tsx`**: Already has a working framework selector (cards with name, category badge, description) and a read-only locked view. Functional but missing funnel stage badge in selector cards and "suggest with AI" action.
- **DB**: 10 frameworks with `name`, `category`, `structure[]`, `example`, `description`. No `primaryGoal`, `recommendedFunnelStage`, `bestFor`, `avoidWhen` columns -- these fields only exist in the JSON prompt output, not persisted.

## Database Consideration

The user's framework JSON schema includes `primaryGoal`, `recommendedFunnelStage`, `bestFor`, `avoidWhen`, `toneGuidelines`, `lengthGuidelines`, `ctaGuidelines`. None of these exist as DB columns. Two options:

**Chosen approach**: Add a `metadata` jsonb column to the `frameworks` table to store these extended fields without altering the core schema. This keeps the table clean while allowing the Library page to display rich information. A migration will add the column and update existing rows with metadata.

## Changes

### 1. Database Migration: Add `metadata` jsonb column

Add `metadata` column (nullable jsonb, default `null`) to `frameworks` table. Update existing 10 rows with structured metadata containing `primaryGoal`, `recommendedFunnelStage`, `bestFor`, `avoidWhen`, `toneGuidelines`, `lengthGuidelines`, `ctaGuidelines`.

### 2. Update `useFrameworksDB.ts`

- Add `metadata` to the SELECT query and to the `FrameworkDB` interface
- Interface addition:
  ```text
  metadata: {
    primaryGoal?: string;
    recommendedFunnelStage?: 'tofu' | 'mofu' | 'bofu';
    bestFor?: string[];
    avoidWhen?: string[];
    toneGuidelines?: string;
    lengthGuidelines?: string;
    ctaGuidelines?: string;
  } | null;
  ```

### 3. Rebuild `Frameworks.tsx` (Surface 1: Frameworks Library)

**Remove entirely**: Creation dialog, form state, `addFramework` call, `useApp()` dependency, `getCategoryLabel` import.

**Replace with**: Read-only discovery page using `useFrameworksDB()`.

**Layout**:
- Page header: "Frameworks" (text-[28px] font-semibold) + subtitle "Guias de estrutura para seus conteudos"
- No action buttons in header (no "Criar")
- Filter bar: Search input (left) + Category select filter (right)
- Grid: 3 cols desktop, 2 cols tablet, 1 col mobile, gap-6

**Card structure** (each framework):
- Top: Icon container (BookOpen, size-5, `text-violet-600`, in `bg-violet-600/10 rounded-lg h-10 w-10`) + Name (text-lg font-medium)
- Below name: Category badge (rounded-full, existing `categoryColors` map) + Funnel stage badge (`tofu`/`mofu`/`bofu` with teal/violet/fuchsia colors)
- Description: text-sm text-muted-foreground, line-clamp-2
- Structure steps: Numbered list, text-xs, showing step names only (from `structure[]`), max 4 visible + "+N mais" if more
- Footer: step count label
- Card click opens detail dialog

**Detail Dialog** (read-only, max-w-2xl):
- Header: Icon + Name + Category badge + Funnel badge
- Section "Objetivo": `primaryGoal` text
- Section "Estrutura": Full numbered steps with `bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3`
- Section "Melhor para": `bestFor[]` as chip badges
- Section "Evitar quando": `avoidWhen[]` as chip badges (rose tint)
- Section "Exemplo": Blockquote style, italic, with Copy button
- Section "Diretrizes": Tone + Length + CTA guidelines in compact format
- Footer: single "Fechar" button (no "Usar Framework")

**States**:
- Loading: 6 skeleton cards (h-[260px])
- Empty (no results): Standard empty state with Search icon, "Nenhum framework encontrado", subtitle about adjusting filters
- Error: Not needed (silent fallback to empty array)

### 4. Refine `ContentDetailSheet.tsx` (Surface 2: Framework Selector)

Minor refinements to the existing selector within the Sheet:

**Selector cards** (already exist, lines 319-345):
- Add funnel stage badge next to category badge
- Keep: name, category, description (short)
- Do NOT add steps or examples (per spec: "Do NOT show full steps or long examples")

**Add "Sugerir com IA" button**:
- Placed above the framework list, after the warning banner
- Button: `variant="outline"`, Sparkles icon, "Sugerir Framework com IA"
- On click: sets `frameworkOrigin` to `'ai'` and auto-selects the first framework as placeholder (simulated suggestion with toast "Sugestao de framework pela IA")
- Gate: disabled if `!aiAllowed`, shows PlanBadge

**No other changes** to the confirmed/locked state (Surface 3 handles the preview).

### 5. New Component: `FrameworkPreview.tsx` (Surface 3: Read-Only Preview)

**Location**: `src/components/sprint/FrameworkPreview.tsx`

**Purpose**: Inline read-only execution guide shown inside `ContentDetailSheet` when framework is confirmed.

**This replaces** the current inline framework display (lines 235-299 in ContentDetailSheet) with a dedicated component.

**Layout**:
- Container: `rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4`
- Header row: Framework name (font-medium) + Origin badge (AI/Manual) + Lock icon
- Numbered steps: Each step in its own row with `text-primary font-mono` number + step text (text-sm)
- No edit affordance on steps (no hover, no cursor-pointer, no icons suggesting editability)
- Footer: "Trocar Framework" button (outline, RefreshCw icon)
  - If `generatedText` exists, label becomes "Trocar Framework (limpa texto gerado)"
  - On click: clears framework + generated text, resets status to idea

**Props**:
```text
interface FrameworkPreviewProps {
  frameworkName: string;
  frameworkOrigin: 'ai' | 'manual' | null;
  frameworkReason?: string;
  structure: string[] | null;
  hasGeneratedText: boolean;
  onChangeFramework: () => void;
  onClearFrameworkAndText: () => void;
}
```

**States**:
- Default: shows name, steps, origin badge
- With generated text: "Trocar" button shows destructive warning label
- Disabled: N/A (this is always read-only display)

### 6. Update `ContentDetailSheet.tsx` to use `FrameworkPreview`

Replace the inline framework display block (lines 234-299) with `<FrameworkPreview />` component. Pass the relevant props from existing local state.

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| Migration SQL | CREATE | Add `metadata` jsonb column, seed extended data for 10 frameworks |
| `src/hooks/useFrameworksDB.ts` | MODIFY | Add `metadata` to SELECT and interface |
| `src/pages/Frameworks.tsx` | REWRITE | Read-only library with DB data, detail dialog, no creation |
| `src/components/sprint/FrameworkPreview.tsx` | CREATE | Reusable read-only framework execution guide |
| `src/components/sprint/ContentDetailSheet.tsx` | MODIFY | Use FrameworkPreview, add AI suggest button, add funnel badge to selector |

## What Will NOT Change

- No new routes (Frameworks is already at `/content-lab/frameworks`)
- No changes to `useSprintContents.ts`
- No changes to edge functions
- No changes to AppContext
- No changes to types/index.ts
- No RLS policy changes
- No changes to navigation/sidebar

