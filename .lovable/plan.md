

# Fluin Design System - Shadcn UI Components Restyling

## Overview

Update the base Shadcn UI component files to match the Fluin Design System specifications. Only className strings are modified -- zero logic, props, or structural changes.

---

## Components to Update

### 1. Button (`src/components/ui/button.tsx`)

**Current**: `rounded-md`, uses semantic `bg-primary` tokens
**Changes**:
- Base class: `rounded-md` to `rounded-lg`
- Size `sm`: `rounded-md` to `rounded-lg`
- Size `lg`: `rounded-md` to `rounded-lg`
- Outline variant: add `dark:border-zinc-700 dark:hover:bg-zinc-800` for dark mode support
- Ghost variant: add `dark:hover:bg-zinc-800` for dark mode support
- Primary/destructive already use semantic tokens which map to violet-600 and rose-500 via CSS vars -- no change needed

### 2. Card (`src/components/ui/card.tsx`)

**Current**: `rounded-lg`, `shadow-sm`, uses `bg-card`
**Changes**:
- `rounded-lg` to `rounded-2xl`
- Add `transition-colors` for hover support from consuming components
- Keep `bg-card` (already maps to zinc-100 light / zinc-900 dark via CSS vars)

### 3. Input (`src/components/ui/input.tsx`)

**Current**: `rounded-md`, uses `bg-background`, `focus-visible:ring-ring`
**Changes**:
- `rounded-md` to `rounded-lg`
- Already uses semantic tokens (`bg-background` = white in light, `border-input`, `ring-ring` = violet-600)
- No additional changes needed beyond border radius

### 4. Textarea (`src/components/ui/textarea.tsx`)

**Current**: `rounded-md`
**Changes**:
- `rounded-md` to `rounded-lg`

### 5. Select Trigger (`src/components/ui/select.tsx`)

**Current**: `rounded-md`
**Changes**:
- SelectTrigger: `rounded-md` to `rounded-lg`

### 6. Badge (`src/components/ui/badge.tsx`)

**Current**: Already `rounded-full`, `px-2.5 py-0.5`, `text-xs` -- matches spec
**Changes**: None needed -- already matches Fluin spec exactly

### 7. Dialog (`src/components/ui/dialog.tsx`)

**Current**: Overlay `bg-black/80`, content `sm:rounded-lg`, `max-w-lg`
**Changes**:
- Overlay: `bg-black/80` to `bg-black/50`
- Content: `sm:rounded-lg` to `sm:rounded-2xl`

### 8. Alert Dialog (`src/components/ui/alert-dialog.tsx`)

**Current**: Overlay `bg-black/80`, content `sm:rounded-lg`
**Changes**:
- Overlay: `bg-black/80` to `bg-black/50`
- Content: `sm:rounded-lg` to `sm:rounded-2xl`

### 9. Tabs (`src/components/ui/tabs.tsx`)

**Current**: Pill-style tabs with `rounded-md bg-muted` list and `rounded-sm` triggers with `data-[state=active]:bg-background`
**Changes**:
- TabsList: Remove `rounded-md bg-muted p-1`, replace with `border-b border-border bg-transparent rounded-none` for flat indicator style
- TabsTrigger: Remove `rounded-sm`, replace active state from `data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm` to `data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none border-b-2 border-transparent -mb-px`

### 10. Table (`src/components/ui/table.tsx`)

**Current**: Uses semantic tokens, header has no background
**Changes**:
- TableHead: Add `bg-muted dark:bg-zinc-800` for header background
- TableRow: Already has `hover:bg-muted/50` -- matches spec

---

## Files Modified (10 total)

| File | Change Summary |
|------|----------------|
| `button.tsx` | `rounded-md` to `rounded-lg` (base + sizes), dark mode classes on outline/ghost |
| `card.tsx` | `rounded-lg` to `rounded-2xl`, add `transition-colors` |
| `input.tsx` | `rounded-md` to `rounded-lg` |
| `textarea.tsx` | `rounded-md` to `rounded-lg` |
| `select.tsx` | SelectTrigger `rounded-md` to `rounded-lg` |
| `badge.tsx` | No changes (already matches spec) |
| `dialog.tsx` | Overlay `bg-black/80` to `/50`, content `rounded-lg` to `rounded-2xl` |
| `alert-dialog.tsx` | Overlay `bg-black/80` to `/50`, content `rounded-lg` to `rounded-2xl` |
| `tabs.tsx` | Pill style to flat bottom-border indicator style |
| `table.tsx` | Add header background `bg-muted` |

## What Will NOT Change

- No component logic, state, or event handlers
- No props or data flow modifications
- No new components created
- No dependencies added
- Badge component already matches spec -- untouched
