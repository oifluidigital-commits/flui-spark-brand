
# Select Framework → Generate Content: Full Flow Implementation

## Overview

This plan implements the complete stateful flow from content creation to AI text generation within SprintDetail. Currently, the "Gerar Texto com IA" button is disabled/non-functional, content uses mock data, and there's no DB persistence. We will wire everything end-to-end.

## Current State

- **SprintDetail.tsx** (1228 lines): Uses local `useState` with mock data. No Supabase reads/writes. The "Gerar Texto com IA" button does nothing.
- **generate-content-text** edge function: Already exists and works -- accepts content/brand/strategy, calls Gemini-2.5-flash with tool calling, returns `{ generatedText, alternativeVersions, hashtags, estimatedReadTime }`.
- **sprint_contents** DB table: Fully configured with `framework`, `framework_origin`, `framework_reason`, `intention`, `funnel_stage`, `suggested_cta`, `generated_text`, `status` (enum: idea/backlog/review/scheduled/completed). RLS policies exist via sprint ownership.
- **frameworks** DB table: Has 5 seed rows (AIDA, PAS, Storytelling, Lista Numerada, Antes/Depois). Global rows have `user_id = null`, accessible to all via RLS.

## What Changes

### 1. Database Migration: Seed 3 Missing Frameworks

The user's prompt defined 8 frameworks. The DB already has 5. We need to add the 3 missing ones:
- **Story-Lesson-CTA** (storytelling)
- **Contrarian Insight** (authority)
- **Step-by-Step Educational** (educational)

SQL migration to insert these as global seed frameworks (`user_id = null`, `is_custom = false`).

### 2. New Hook: `useSprintContents.ts`

Centralizes all sprint_contents CRUD with Supabase:

```text
Functions:
- loadContents(sprintId) -> SprintContent[]
- createContent(sprintId, data) -> SprintContent (saves with status 'idea')
- updateContent(id, updates) -> void
- deleteContent(id) -> void
- generateText(contentId) -> { generatedText, alternatives, hashtags }
```

The `generateText` function:
1. Validates framework is set (throws if not)
2. Loads brand and strategy from context/DB
3. Calls `generate-content-text` edge function via `supabase.functions.invoke`
4. Persists `generated_text` to the row
5. Updates status from 'idea' to 'review'
6. Returns the AI result

### 3. New Hook: `useFrameworksDB.ts`

Loads frameworks from DB instead of the hardcoded `contentFrameworks` array:

```text
Functions:
- loadFrameworks() -> Framework[] (from DB, both global and user's custom)
- cached in state, loaded once
```

### 4. Refactor `SprintDetail.tsx`

Major changes to make the page stateful and DB-connected:

**A. Replace mock data with DB reads:**
- On mount, call `loadContents(sprintId)` to fetch real `sprint_contents` rows
- Load frameworks from DB via `useFrameworksDB`
- Show loading skeleton during fetch

**B. Wire CRUD to DB:**
- `handleAddContent` -> inserts row via `createContent` with status `idea`
- `handleSaveContent` -> calls `updateContent`
- `handleDelete` -> calls `deleteContent`
- `handleStatusChange`, `handleDateChange`, `handleFormatChange` -> call `updateContent`

**C. Enforce framework-first rule in ContentDetailSheet:**
- When framework is empty/null, show mandatory framework selection (no other fields visible)
- Once framework is confirmed, lock the structure display (read-only)
- Only `intention`, `funnel_stage`, and `suggested_cta` remain editable below the locked framework
- "Gerar Texto com IA" button becomes active only when framework is confirmed

**D. Wire "Gerar Texto com IA" button:**
- Calls `generateText(contentId)` from the hook
- Shows loading state with spinner
- On success: displays generated text in a new section within the Sheet
- Updates content status to 'review' locally and in DB
- Handles 429/402 errors with toast messages

**E. Generated text section in ContentDetailSheet:**
- Read-only textarea showing `generated_text`
- "Copiar" button to clipboard
- "Regenerar" button to call generateText again
- "Trocar Framework" button that clears generated_text and re-opens framework selection

### 5. Update Edge Function Prompt

Enhance `generate-content-text/index.ts` to use the framework's `structure` steps from the DB row instead of just the framework name string. The content's `framework` field stores the framework name/id -- the edge function will receive the full framework structure from the frontend.

Update the request body to accept `frameworkStructure` (the steps array) in addition to the existing `framework` (name).

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useSprintContents.ts` | CREATE | CRUD + AI generation for sprint_contents via Supabase |
| `src/hooks/useFrameworksDB.ts` | CREATE | Load frameworks from DB |
| `src/pages/SprintDetail.tsx` | MODIFY | Replace mock data with DB, wire CRUD, enforce framework-first, wire AI generation, display generated text |
| `supabase/functions/generate-content-text/index.ts` | MODIFY | Accept `frameworkStructure` array for richer prompt assembly |
| Migration SQL | CREATE | Seed 3 missing framework rows |

## State Machine (Content Lifecycle)

```text
[Create] -> status: "idea", framework: null
    |
[Select Framework] -> framework: set, frameworkOrigin: "manual"
    |
[Adjust intention/funnel/CTA] -> editable fields only
    |
[Generate Text] -> AI call -> generated_text populated, status: "review"
    |
[Review] -> user can edit text, regenerate, or change framework
    |         (changing framework clears generated_text, resets to "idea")
    |
[Schedule/Complete] -> manual status change
```

## What Will NOT Change

- No new pages or routes
- No changes to existing edge functions except `generate-content-text`
- No changes to AppContext
- No schema changes to `sprint_contents` table (all columns already exist)
- No changes to RLS policies
- Frameworks page (`Frameworks.tsx`) remains unchanged
- UI design system fully preserved (Shadcn, Tailwind, zinc palette, dark/light mode)
