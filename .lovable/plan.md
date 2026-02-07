

# Fix Strategy Persistence After Onboarding

## Problem

The strategy generated after onboarding is stored only in React Context (in-memory). When the user refreshes the page or navigates away and returns to `/strategy`, the data is lost and the page either shows loading indefinitely or tries to re-generate via the AI edge function.

The same issue affects `diagnosticResult` -- both are ephemeral.

## Solution

Add localStorage persistence for `strategy` and `diagnosticResult` in `AppContext.tsx`. When either value is set, it is also saved to localStorage. On mount, the context restores both from localStorage if available. This ensures the `/strategy` page always has data after onboarding completes, without requiring new data structures, services, or components.

## Approach

**No new files, no new types, no new interfaces.** The existing `Strategy` and `DiagnosticResult` types are sufficient. We simply add read/write to localStorage in the existing `AppContext`.

---

## Changes

### 1. `src/contexts/AppContext.tsx`

**Add localStorage persistence for `diagnosticResult` and `strategy`:**

- Define storage keys: `flui_diagnostic_result` and `flui_strategy`
- Initialize both states from localStorage (with JSON.parse fallback to null)
- Add `useEffect` hooks that write to localStorage whenever `diagnosticResult` or `strategy` changes
- Clear both keys on `signOut` (so a different user starts fresh)

Specifically:

**Initialization (lines 96-97):**
```typescript
const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(() => {
  try {
    const stored = localStorage.getItem('flui_diagnostic_result');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
});

const [strategy, setStrategy] = useState<Strategy | null>(() => {
  try {
    const stored = localStorage.getItem('flui_strategy');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
});
```

**Sync to localStorage (new effects after existing effects):**
```typescript
useEffect(() => {
  if (diagnosticResult) {
    localStorage.setItem('flui_diagnostic_result', JSON.stringify(diagnosticResult));
  }
}, [diagnosticResult]);

useEffect(() => {
  if (strategy) {
    localStorage.setItem('flui_strategy', JSON.stringify(strategy));
  }
}, [strategy]);
```

**Clear on sign-out:** Wrap the existing `auth.signOut` to also clear localStorage:
- After `signOut` completes, remove `flui_diagnostic_result`, `flui_strategy`, and reset both states to `null`
- This is done by creating a wrapped `handleSignOut` function that calls `auth.signOut()` then clears storage

### 2. No changes to other files

- `Strategy.tsx` already checks for `cachedStrategy` (from context) before generating -- so restoring from localStorage means it will find the cached strategy and skip the edge function call
- `useStrategy.ts` remains unchanged
- `Onboarding.tsx` already sets `diagnosticResult` and `strategy` via context, which will trigger the new localStorage write effects
- No new data structures, services, or mock files needed

---

## What Will NOT Change

- No new files created
- No new TypeScript interfaces or types
- No changes to routing, navigation, or page structure
- No changes to edge function calls or business logic
- No changes to the onboarding wizard flow
- No UI/visual changes
- Existing `Strategy` and `DiagnosticResult` types used as-is

