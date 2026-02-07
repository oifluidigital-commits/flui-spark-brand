

# Light Mode Migration and Color System Update

## Overview

Switch the Flui application from dark-mode-default to light-mode-default, update CSS custom properties to use the new color tokens, and replace all hardcoded dark-mode Tailwind classes with semantic/light-mode equivalents. Zero functional changes.

---

## Scope of Changes

### 1. CSS Custom Properties (`src/index.css`)

Update `:root` (default) to use light mode values and `.dark` class for dark mode:

| Token | Light (new default) | Dark (`.dark` class) |
|-------|-------------------|---------------------|
| `--background` | white (0 0% 100%) | zinc-950 (240 10% 3.9%) |
| `--foreground` | zinc-900 (240 10% 3.9%) | zinc-50 (0 0% 98%) |
| `--card` | zinc-100 (240 5% 96%) | zinc-900 (240 10% 5.9%) |
| `--border` | zinc-200 (240 5.9% 90%) | zinc-800 (240 5% 17%) |
| `--primary` | violet-600 (263 70% 50%) | violet-600 |
| `--secondary` | zinc-50 (240 5% 96%) | zinc-900 (240 5% 15%) |
| `--muted` | zinc-50 | zinc-900 |
| `--destructive` | rose-500 (350 89% 60%) | rose-500 |

- Swap `:root` and `.light` blocks (current `.light` becomes `:root`, current `:root` becomes `.dark`)
- Update primary from indigo-600 to violet-600 HSL values
- Update destructive from red to rose-500
- Update scrollbar colors for light mode

### 2. Tailwind Config (`tailwind.config.ts`)

No structural changes needed -- it already reads from CSS variables. The `darkMode: ["class"]` strategy is already correct.

### 3. Sonner Theme (`src/components/ui/sonner.tsx`)

Already uses `useTheme()` from `next-themes` and adapts. No changes needed since it reads the system/class theme.

### 4. Hardcoded Color Classes (8 files)

Replace all hardcoded `bg-zinc-*`, `text-zinc-*`, `border-zinc-*` classes with semantic equivalents, and replace `indigo-*` with `violet-*`:

**Files to update:**

| File | Changes |
|------|---------|
| `src/pages/Sprints.tsx` | ~30 replacements: `bg-zinc-950` to `bg-background`, `bg-zinc-900` to `bg-card`, `border-zinc-800` to `border-border`, `text-zinc-50` to `text-foreground`, `text-zinc-400` to `text-muted-foreground`, `bg-zinc-800` to `bg-muted`, `hover:border-zinc-700` to `hover:border-border`, `indigo-*` to `violet-*` |
| `src/pages/SprintDetail.tsx` | ~10 replacements: status configs `indigo-*` to `violet-*`, `text-zinc-600` to `text-muted-foreground`, `text-zinc-400` to `text-muted-foreground` |
| `src/components/onboarding/steps/StepExpertiseArea.tsx` | `hover:border-zinc-700` to `hover:border-border` |
| `src/components/onboarding/steps/StepContentTopics.tsx` | `hover:border-zinc-700` to `hover:border-border` |
| `src/components/onboarding/steps/StepGoals.tsx` | `hover:border-zinc-700` to `hover:border-border` |
| `src/components/onboarding/steps/StepAudienceChallenges.tsx` | `hover:border-zinc-700` to `hover:border-border` |
| `src/components/gates/PlanBadge.tsx` | `indigo-*` to `violet-*` |
| `src/components/gates/UpgradePrompt.tsx` | `indigo-*` to `violet-*` |

### 5. Comment Updates

Update the design system comment block in `index.css` to reflect the new light-mode-first approach and violet primary.

---

## Color Mapping Reference

```text
HARDCODED CLASS          -->  REPLACEMENT
bg-zinc-950                   bg-background
bg-zinc-900                   bg-card
bg-zinc-900/50                bg-card/50
bg-zinc-800                   bg-muted
border-zinc-800               border-border
border-zinc-700               border-border
hover:border-zinc-700         hover:border-border
text-zinc-50                  text-foreground
text-zinc-400                 text-muted-foreground
text-zinc-600                 text-muted-foreground
indigo-500                    violet-500
indigo-400                    violet-400
indigo-600                    violet-600
indigo-500/20                 violet-500/20
indigo-500/30                 violet-500/30
indigo-500/10                 violet-500/10
indigo-500/5                  violet-500/5
```

---

## What Will NOT Change

- No component structure, props, or event handlers modified
- No new components created
- No data structures, API calls, or state management changed
- No routing or business logic altered
- No dependencies added or removed
- All spacing and layout preserved

