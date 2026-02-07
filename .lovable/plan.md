

# Migrate Strategy & Diagnostic from localStorage to Database

## Problem

After onboarding, `diagnosticResult` and `strategy` are stored in localStorage (and React Context in-memory). This means data is lost across devices and browsers, and is not properly tied to `user_id`.

## Current State (What Already Works)

- **Diagnostics ARE already saved to DB** during onboarding (Onboarding.tsx line 179) with `form_data` and `result` as jsonb
- The `strategies` table exists with the correct schema but is **never written to**
- The `useStrategy` hook calls the `generate-strategy` edge function and returns a `Strategy` object, but only stores it in React Context + localStorage

## Actual DB Schema (differs from prompt)

The user prompt assumed individual columns, but the actual schema is:

- **`diagnostics`**: `id`, `user_id`, `form_data` (jsonb), `result` (jsonb), `ai_model_used`, `tokens_consumed`, `created_at`
- **`strategies`**: `id`, `user_id`, `diagnostic_id` (FK), `data` (jsonb), `is_active` (boolean), `created_at`, `updated_at`

No schema changes needed -- the existing tables support this migration as-is.

## Changes

### 1. `src/hooks/useStrategy.ts` -- Save strategy to DB after generation

After the edge function returns a strategy, persist it to the `strategies` table:

- Get the authenticated user via `supabase.auth.getUser()`
- Find the user's latest diagnostic ID from the `diagnostics` table
- Archive any existing active strategies (`is_active = false`)
- Insert the new strategy with `data` = full Strategy object, `is_active = true`, `diagnostic_id` = latest diagnostic

Add a new function `loadActiveStrategy` that:
- Fetches the user's strategy where `is_active = true`
- Returns the `data` field cast as `Strategy`, or null

### 2. `src/pages/Strategy.tsx` -- Load from DB instead of context

Replace the current logic that depends on `cachedStrategy` from AppContext:

- On mount, call `loadActiveStrategy()` from the updated hook
- If a strategy exists in DB, use it directly (no context dependency)
- If no strategy exists and diagnostic is completed, show error state with retry
- Also load the diagnostic result from DB to populate the `diagnosticResult` for potential retry

### 3. `src/contexts/AppContext.tsx` -- Remove localStorage persistence

- Remove localStorage initialization for `diagnosticResult` and `strategy` (revert to simple `useState(null)`)
- Remove the two `useEffect` hooks that sync to localStorage
- Remove `localStorage.removeItem` calls from `signOut`
- Keep `setDiagnosticResult` and `setStrategy` in context (still used by onboarding flow for in-session state)

### 4. `src/pages/Onboarding.tsx` -- No changes needed

The onboarding already saves diagnostics to DB (line 179). The strategy generation and save will happen on the `/strategy` page via `useStrategy`, which is the existing flow. No onboarding changes required.

## Technical Details

### Strategy save (in `useStrategy.ts`):

```text
// After edge function returns successfully:
const { data: latestDiagnostic } = await supabase
  .from('diagnostics')
  .select('id')
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle();

// Archive existing
await supabase
  .from('strategies')
  .update({ is_active: false })
  .eq('is_active', true);

// Insert new
await supabase
  .from('strategies')
  .insert({
    user_id: user.id,
    diagnostic_id: latestDiagnostic?.id || null,
    data: strategy as any,  // Strategy object as jsonb
    is_active: true,
  });
```

### Strategy load (new function in `useStrategy.ts`):

```text
const { data } = await supabase
  .from('strategies')
  .select('data')
  .eq('is_active', true)
  .maybeSingle();

return data ? (data.data as unknown as Strategy) : null;
```

### Diagnostic load (new function or inline in Strategy.tsx):

```text
const { data } = await supabase
  .from('diagnostics')
  .select('result')
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle();

return data?.result ? (data.result as unknown as DiagnosticResult) : null;
```

## Files Modified

| File | Change |
|------|--------|
| `src/hooks/useStrategy.ts` | Add `saveStrategyToDB`, `loadActiveStrategy`, `loadDiagnosticResult` functions; call save after generation |
| `src/pages/Strategy.tsx` | Load strategy from DB on mount instead of relying on context |
| `src/contexts/AppContext.tsx` | Remove all localStorage logic for diagnostic/strategy (revert to plain `useState(null)`) |

## What Will NOT Change

- No database schema changes or migrations
- No new files created
- No changes to onboarding flow (already saves diagnostics to DB)
- No changes to edge functions
- No changes to UI/visual rendering
- No changes to RLS policies (already configured correctly)
- Existing `Strategy` and `DiagnosticResult` types remain unchanged
