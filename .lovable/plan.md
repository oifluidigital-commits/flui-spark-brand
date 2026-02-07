

# Fix Blocking Issues: frameworkOrigin, Credit Consumption, AI Usage Logging

## Overview

Three backend logic fixes in the AI generation workflow. No new features, no UX changes, no new pages.

## Issue 1: Premature frameworkOrigin Assignment

**Problem**: In `ContentDetailSheet.tsx` line 263, clicking "Sugerir Framework com IA" immediately sets `setFrameworkOrigin('ai')` before the user confirms. If the user then selects a different framework manually and confirms, the origin remains incorrectly set to `'ai'`.

**Fix**: Remove `setFrameworkOrigin('ai')` from the AI suggest button handler (line 263). Instead, track a local `suggestedByAI` boolean flag. In `handleConfirmFramework`, determine origin based on whether the confirmed framework matches the AI suggestion:

```text
ContentDetailSheet.tsx changes:
- Add state: suggestedByAI (boolean, default false)
- AI suggest button: set suggestedByAI = true, set tempFramework, do NOT set frameworkOrigin
- handleConfirmFramework: set frameworkOrigin = suggestedByAI && tempFramework matches suggestion ? 'ai' : 'manual'
- Reset suggestedByAI when entering editing mode or selecting a different card manually
```

## Issue 2: Missing AI Credit Consumption

**Problem**: `useGate('use-ai')` checks `contentCredits > 0` but credits are never decremented after successful generation. The `UserGateContext` state remains unchanged.

**Fix**: Add credit consumption in `useSprintContents.generateText` after successful AI call. Since there is no real auth and credits are mock state in `UserGateContext`, the hook needs access to `setUserGate` to decrement credits.

**Implementation**:
- `useSprintContents` will accept a `consumeCredits` callback parameter
- `SprintDetail.tsx` will pass a callback that calls `setUserGate` to decrement `contentCredits`
- The decrement happens AFTER successful text persistence, BEFORE usage log
- Fixed cost per generation: 10 credits (constant, configurable)
- If credits reach 0, subsequent calls are blocked by existing `useGate` check

```text
Orchestration order in generateText:
1. Validate framework exists (already done)
2. Validate credits > 0 via callback (NEW)
3. Assemble prompt and call edge function (already done)
4. Persist generated_text + status update (already done)
5. Consume credits via callback (NEW)
6. Write usage log (NEW - see Issue 3)
```

Changes to `useSprintContents.ts`:
- Add parameter: `onCreditsConsumed?: (cost: number) => void`
- Add parameter: `onLogUsage?: (log: UsageLogEntry) => void`
- After successful updateContent, call `onCreditsConsumed(CREDIT_COST)`

Changes to `SprintDetail.tsx`:
- Pass `onCreditsConsumed` callback that calls `setUserGate(prev => ({ ...prev, contentCredits: Math.max(0, prev.contentCredits - cost) }))`
- Add pre-generation credit validation: if `userGate.contentCredits < CREDIT_COST`, show toast and abort

Changes to `UserGateContext.tsx`: None. Already exposes `setUserGate`.

## Issue 3: Missing AI Usage Logging

**Problem**: The `ai_usage_log` table exists with RLS policies (INSERT/SELECT for own user), but no code ever writes to it. The edge function returns results without logging.

**Fix**: Write usage log entry in the edge function (`generate-content-text/index.ts`) after successful AI response, using the authenticated Supabase client.

**Implementation in edge function**:
- After parsing the AI response successfully, insert into `ai_usage_log`
- Use the `supabaseClient` from `authenticateRequest()` (already available)
- Log entry fields:
  - `user_id`: from authenticated user
  - `action_type`: `'generate-content-text'`
  - `model_used`: `'google/gemini-2.5-flash'`
  - `tokens_input`: from `data.usage?.prompt_tokens` (if available from gateway response)
  - `tokens_output`: from `data.usage?.completion_tokens` (if available)
  - `credits_consumed`: 10 (fixed cost constant)
  - `request_payload`: `{ framework, format, funnelStage, intention }` (minimal, no PII)
  - `response_preview`: first 200 chars of generatedText
- Log insertion is fire-and-forget (non-blocking, errors logged to console but do not fail the request)
- On AI call failure, also log with `credits_consumed: 0` and `response_preview: error message`

```text
Edge function addition (after line 151, before return):

// Fire-and-forget usage logging
try {
  await supabaseClient.from('ai_usage_log').insert({
    user_id: user.id,
    action_type: 'generate-content-text',
    model_used: 'google/gemini-2.5-flash',
    tokens_input: data.usage?.prompt_tokens || null,
    tokens_output: data.usage?.completion_tokens || null,
    credits_consumed: 10,
    request_payload: { framework, format, funnelStage, intention },
    response_preview: result.generatedText?.substring(0, 200) || null,
  });
} catch (logErr) {
  console.error('Usage log error:', logErr);
}
```

For error cases (429, 402, 500), add a similar log block with `credits_consumed: 0` and status info in `response_preview`.

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/sprint/ContentDetailSheet.tsx` | MODIFY | Fix frameworkOrigin: add `suggestedByAI` flag, move origin assignment to confirmation |
| `src/hooks/useSprintContents.ts` | MODIFY | Add `onCreditsConsumed` and `onLogUsage` callbacks, pre-validate credits, call after success |
| `src/pages/SprintDetail.tsx` | MODIFY | Pass credit consumption callback, pass credit validation, wire to UserGateContext |
| `supabase/functions/generate-content-text/index.ts` | MODIFY | Add ai_usage_log insert after AI response (success and error paths) |

## What Will NOT Change

- No database migrations (ai_usage_log table and RLS already exist)
- No new components or pages
- No changes to UserGateContext interface
- No changes to useGate hook
- No UX layout or visual changes
- No changes to other edge functions
