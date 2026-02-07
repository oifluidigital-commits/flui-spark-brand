

# QA Fix: Sprint Creation → AI Suggestions → Content Display

## Root Cause Analysis

Five blocking issues identified through code tracing:

### B1 (Critical): Sprint exists only in client memory, not in database
`Sprints.tsx` line 607-623 creates a Sprint via `addSprint()` which pushes to React state only (`AppContext.setSprints`). The sprint is NEVER inserted into the `sprints` table in the database. When `SprintDetail` loads and calls `useSprintContents(sprintId)`, all Supabase operations fail silently because RLS on `sprint_contents` requires `EXISTS (SELECT 1 FROM sprints WHERE sprints.id = sprint_contents.sprint_id AND sprints.user_id = auth.uid())`.

**Result**: "Add Content" always fails with generic error. All content CRUD is blocked.

### B2 (Critical): "Gerar Sugestoes IA" button has no onClick handler
`SprintDetail.tsx` line 368-371: the button is rendered but has no `onClick` prop. It is a dead button that does nothing when clicked.

### B3 (Critical): Sprint ID format mismatch
Sprints are created with `id: sprint-${Date.now()}` (line 608) which is NOT a valid UUID. The `sprints.id` column is `uuid` type. Even if an insert were attempted, it would fail on type validation.

### B4 (Medium): Wizard-approved contents are discarded
`handleSave` (line 602-625) only saves the sprint shell. The `wizardData.approvedContents` array (populated in steps 5-6 with themes, formats, frameworks, hooks, CTAs) is never persisted as `sprint_contents` records.

### B5 (Medium): Error messages are generic
`useSprintContents.ts` lines 96-97 and 69-70 show generic toasts ("Erro ao criar conteudo", "Erro ao carregar conteudos") without surfacing the actual Supabase error message.

## Fix Plan

### Fix 1: Persist sprints to database on creation

**File**: `src/hooks/useSprintContents.ts`

Add a new exported function `createSprint` that:
1. Inserts into `sprints` table via Supabase with proper UUID (`crypto.randomUUID()`)
2. Returns the created sprint row
3. Shows specific error on failure

**File**: `src/pages/Sprints.tsx`

Modify `handleSave` (wizard completion):
1. Import and use `supabase` client directly
2. Insert sprint into DB with `gen_random_uuid()` (let DB generate ID)
3. On success, also bulk-insert `approvedContents` as `sprint_contents` rows
4. Add the sprint to local state via `addSprint` with the DB-generated UUID
5. Navigate to `/sprints/{newSprintId}` after save

### Fix 2: Wire "Gerar Sugestoes IA" button

**File**: `src/pages/SprintDetail.tsx`

Add `onClick` handler to the "Gerar Sugestoes IA" button (line 368):
1. Validate sprint exists and has an ID
2. Validate AI credits are available
3. Call the `suggest-sprint-contents` edge function with sprint context (title, description, theme, pillar)
4. On success, bulk-insert returned suggestions as `sprint_contents` records via `createContent`
5. Each record gets: title, format, hook, suggested_cta, intention, framework (from AI)
6. Reload contents after insertion
7. Show toast with count of created suggestions or specific error

Since this is mock-data mode and there may not be an authenticated user, provide a fallback that generates mock content items locally (using the same `generateMockSuggestions` pattern from `Sprints.tsx`) and inserts them via `createContent`.

### Fix 3: Specific error messages

**File**: `src/hooks/useSprintContents.ts`

Replace all generic error toasts with specific ones that include `error.message` or `error.code`:
- `loadContents`: "Erro ao carregar conteudos: {error.message}"
- `createContent`: "Erro ao criar conteudo: {error.message}" plus specific check for RLS violation (code `42501` -> "Sprint nao encontrada no banco de dados")
- `updateContent`: "Erro ao atualizar conteudo: {error.message}"
- `deleteContent`: "Erro ao remover conteudo: {error.message}"

### Fix 4: Empty state "Gerar Sugestoes IA" button wiring

**File**: `src/pages/SprintDetail.tsx`

The `EmptyContentsState` component (line 152-165) has a "Gerar Sugestoes IA" button with no onClick. Wire it to the same handler as Fix 2.

Update `EmptyContentsState` props to accept `onGenerateSuggestions` callback and wire it.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Sprints.tsx` | MODIFY | Persist sprint + approved contents to DB on wizard save |
| `src/pages/SprintDetail.tsx` | MODIFY | Wire AI suggestions button, update EmptyContentsState |
| `src/hooks/useSprintContents.ts` | MODIFY | Add specific error messages with error.message |

## What Will NOT Change

- No new pages or routes
- No new components
- No UX redesign
- No changes to edge functions
- No changes to AppContext interface
- No database migrations (tables already exist)
- No changes to RLS policies

## Deterministic State Transitions

```text
Sprint Creation (Wizard):
  Step 7 Confirm → INSERT sprints row → INSERT sprint_contents rows → addSprint(local) → navigate to detail

Sprint Detail (Empty):
  "Add Content" → INSERT sprint_contents → reload → show in table
  "Gerar Sugestoes IA" → validate credits → generate mock items → INSERT sprint_contents → reload → show in table

Sprint Detail (With Contents):
  All existing flows remain unchanged
```

