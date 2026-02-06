
# QA Report: Flui Onboarding Wizard

---

## 1. Issues Found

---

### ISSUE #1: Form data is lost on page refresh/reload
- **Step/Screen:** All steps (1-7)
- **Description:** `formData` is stored in React state (`useState`) with `initialFormData` defaults. If the user refreshes the browser at step 5, all data from steps 1-4 is erased. The `?step=5` URL param restores the step number, but the inputs are empty.
- **Why this is a problem:** User loses all progress. They must re-fill everything from scratch, which causes abandonment.

**Impact Level:** CRITICAL

**Correction Proposal:**
- Persist `formData` to `localStorage` on every update (via `useEffect` or within `updateFormData`)
- On mount, read from `localStorage` to restore state
- Clear `localStorage` after successful diagnostic generation

**Validation Checklist:**
- [ ] Fill steps 1-4, refresh page, verify data is restored
- [ ] Complete wizard, verify localStorage is cleared
- [ ] Open in new tab, verify data is available

---

### ISSUE #2: Hardcoded email in initialFormData
- **Step/Screen:** Step 1 (Account Identity)
- **Description:** `initialFormData` has `email: 'pedro@flui.app'` hardcoded. This email is displayed in the read-only email field regardless of who is logged in.
- **Why this is a problem:** The authenticated user's real email is never used. The wrong email is shown and potentially sent to the AI diagnostic function.

**Impact Level:** CRITICAL

**Correction Proposal:**
- Set `initialFormData.email` to `''`
- In `Onboarding.tsx`, populate `formData.email` from the authenticated user's profile on mount: `updateFormData({ email: profile?.email || '' })`

**Validation Checklist:**
- [ ] Login with a real account, verify the correct email appears in Step 1
- [ ] Verify the email sent to `generate-diagnostic` is accurate

---

### ISSUE #3: "Pular e ir para o dashboard" skips onboarding but does NOT persist profile name to database
- **Step/Screen:** All steps (skip button)
- **Description:** `handleSkipOnboarding` updates the local `user` state with `formData.name` and navigates to `/dashboard`, but never calls Supabase to update the `profiles` table. On next login/refresh, the name reverts to the DB value.
- **Why this is a problem:** User thinks they saved their name but it's lost on reload.

**Impact Level:** HIGH

**Correction Proposal:**
- Call `supabase.from('profiles').update({ name: formData.name, onboarding_status: 'in_progress', onboarding_step: currentStep }).eq('user_id', user.id)` before navigating

**Validation Checklist:**
- [ ] Skip onboarding after entering name, refresh, verify name persists
- [ ] Verify `onboarding_step` is correctly saved in DB

---

### ISSUE #4: handleFinishOnboarding sets onboardingStep to hardcoded 4 instead of 7
- **Step/Screen:** Results page (after diagnostic)
- **Description:** Line 176 in `Onboarding.tsx`: `onboardingStep: 4`. After completing all 7 steps and generating a diagnostic, the step is set to 4. This breaks the OnboardingProgressCard logic on the dashboard if the user returns.
- **Why this is a problem:** Data inconsistency. The user completed 7 steps but the system records 4.

**Impact Level:** HIGH

**Correction Proposal:**
- Change to `onboardingStep: 7` (or `stepConfig.length`)
- Also persist this to the database via Supabase update

**Validation Checklist:**
- [ ] Complete wizard, verify profile shows step 7 and status "completed"
- [ ] Check OnboardingProgressCard renders correctly after completion

---

### ISSUE #5: Onboarding completion is NOT persisted to the database
- **Step/Screen:** Results page
- **Description:** `handleFinishOnboarding` and `completeOnboarding` only update local React state. Neither writes `onboarding_status: 'completed'` to the `profiles` table. On next login, the user is redirected back to `/onboarding` because the DB still has `not_started` or `in_progress`.
- **Why this is a problem:** The user can never permanently complete onboarding. Every login loops them back.

**Impact Level:** CRITICAL

**Correction Proposal:**
- In `handleFinishOnboarding`, call `supabase.from('profiles').update({ onboarding_status: 'completed', onboarding_step: 7 }).eq('user_id', user.id)`
- Refresh the auth profile after the update

**Validation Checklist:**
- [ ] Complete wizard, logout, login again, verify redirect goes to `/dashboard`
- [ ] Check `profiles` table in DB has `onboarding_status = 'completed'`

---

### ISSUE #6: Diagnostic result is NOT persisted to the database
- **Step/Screen:** Diagnostic Loading / Results
- **Description:** The AI-generated diagnostic is stored only in React state (`localDiagnosticResult` and `diagnosticResult` in AppContext). The `diagnostics` table exists in the DB schema but is never written to. On page refresh or next session, the diagnostic is lost.
- **Why this is a problem:** The diagnostic (which costs AI credits) must be regenerated every time. The Strategy page depends on `diagnosticResult` from AppContext which is empty on fresh loads.

**Impact Level:** CRITICAL

**Correction Proposal:**
- After successful diagnostic generation, insert into `diagnostics` table with `user_id`, result JSON, and metadata
- On app load (or Strategy page load), fetch the diagnostic from the DB if AppContext is empty

**Validation Checklist:**
- [ ] Complete diagnostic, refresh, verify diagnostic data loads from DB
- [ ] Navigate to /strategy after refresh, verify it can load the diagnostic

---

### ISSUE #7: Step 2 role validation allows "custom" without customRole text
- **Step/Screen:** Step 2 (Role and Experience)
- **Description:** The `isStepValid` check for step 2 is `formData.role !== ''`. When the user types a search query and selects the custom option, `role` is set to `'custom'` and `customRole` to the text. However, the validation does NOT check that `customRole` is non-empty when `role === 'custom'`. If somehow `customRole` is cleared after selection, the user can proceed with an empty custom role.
- **Why this is a problem:** Edge case where empty role data is sent to AI.

**Impact Level:** MEDIUM

**Correction Proposal:**
- Update validation: `return formData.role !== '' && (formData.role !== 'custom' || formData.customRole.trim().length > 0)`

**Validation Checklist:**
- [ ] Select custom role, clear text, verify "Continuar" is disabled

---

### ISSUE #8: Challenges custom text is NOT sent to the edge function
- **Step/Screen:** Step 6 / Diagnostic Generation
- **Description:** In `useDiagnostic.ts` line 33, challenges are filtered with `.filter(c => c !== 'other')` but `formData.customChallenge` is never included in the payload sent to the edge function. The custom challenge text is collected but discarded.
- **Why this is a problem:** User provides specific challenge info that the AI never receives.

**Impact Level:** HIGH

**Correction Proposal:**
- Add `customChallenge` to the prepared data: `challenges: [...formData.challenges.filter(c => c !== 'other'), ...(formData.customChallenge.trim() ? [formData.customChallenge.trim()] : [])]`

**Validation Checklist:**
- [ ] Select "Outro" challenge, type custom text, verify it appears in the edge function request body

---

### ISSUE #9: "Ver minha Estrategia Editorial" button navigates away without completing onboarding
- **Step/Screen:** DiagnosticResults.tsx (CTA section)
- **Description:** The "Ver minha Estrategia Editorial" button calls `navigate('/strategy')` directly (line 227) without calling `onComplete` (which triggers `handleFinishOnboarding`). The user leaves the onboarding flow without marking it as completed. The "Ir para o Dashboard" button does call `onComplete`.
- **Why this is a problem:** If the user clicks "Ver Estrategia", `onboarding_status` is never set to `completed`. On next login they are redirected back to onboarding.

**Impact Level:** CRITICAL

**Correction Proposal:**
- Modify the "Ver Estrategia" button to first call `onComplete()` and then navigate, or modify `onComplete` to accept a redirect path

**Validation Checklist:**
- [ ] Click "Ver minha Estrategia Editorial", verify onboarding is marked completed
- [ ] Logout, login again, verify user goes to dashboard (not onboarding)

---

### ISSUE #10: DiagnosticLoading retry does NOT reset hasStarted ref properly
- **Step/Screen:** Diagnostic Loading (error state)
- **Description:** In `handleRetry` (line 71-84), `hasStarted.current` is set to `false`, but `generateDiagnostic` is called directly in the same function without going through the `useEffect`. This means the `useEffect` could re-fire on a re-render and cause a double invocation. The logic is inconsistent between the initial call (via useEffect) and retry (direct call).
- **Why this is a problem:** Potential double API call wasting AI credits.

**Impact Level:** MEDIUM

**Correction Proposal:**
- Either always call via useEffect (set a trigger state), or remove the useEffect pattern entirely and trigger on mount via a different mechanism. The simplest fix: do NOT set `hasStarted.current = false` in `handleRetry` since the retry calls directly.

**Validation Checklist:**
- [ ] Simulate error, click retry, verify only one API call is made (check network tab)

---

### ISSUE #11: Step 1 does NOT pre-populate name from authenticated profile
- **Step/Screen:** Step 1 (Account Identity)
- **Description:** `initialFormData.name` is `''`. The user already has a `name` in their `profiles` record (set by the `handle_new_user` trigger). This existing name is not loaded into the form.
- **Why this is a problem:** User has to re-type their name even though the system already knows it.

**Impact Level:** MEDIUM

**Correction Proposal:**
- In `Onboarding.tsx`, on mount, populate `formData.name` and `formData.email` from the authenticated profile

**Validation Checklist:**
- [ ] Sign up with a name, navigate to onboarding, verify name is pre-filled in Step 1

---

### ISSUE #12: Progress bar shows 0% on Step 1
- **Step/Screen:** OnboardingProgress component
- **Description:** Progress formula is `((currentStep - 1) / (totalSteps - 1)) * 100`. On step 1, this is `0 / 6 = 0%`. The user sees "0% concluido" before they've done anything, which is correct, but the step 1 indicator is highlighted as "current" while showing 0% -- this is fine UX but duplicated at the bottom ("Passo 1 de 7").
- **Why this is a problem:** Minor redundancy. Two places show step count.

**Impact Level:** LOW

**Correction Proposal:**
- Remove the "Passo X de Y" text at the bottom of the page (line 286) since the progress bar already shows this info

**Validation Checklist:**
- [ ] Verify no duplicate step indicators

---

## 2. Summary Table

| # | Issue | Impact | Category |
|---|-------|--------|----------|
| 1 | Form data lost on refresh | CRITICAL | Data Persistence |
| 2 | Hardcoded email | CRITICAL | Data Integrity |
| 3 | Skip button doesn't persist to DB | HIGH | Data Persistence |
| 4 | Hardcoded step 4 on completion | HIGH | Logic Error |
| 5 | Onboarding status not persisted to DB | CRITICAL | Data Persistence |
| 6 | Diagnostic result not persisted to DB | CRITICAL | Data Persistence |
| 7 | Custom role validation gap | MEDIUM | Validation |
| 8 | Custom challenge not sent to AI | HIGH | Data Loss |
| 9 | "Ver Estrategia" skips onComplete | CRITICAL | Flow Logic |
| 10 | Retry may double-fire | MEDIUM | Edge Case |
| 11 | Name not pre-populated from profile | MEDIUM | UX Friction |
| 12 | Duplicate step counter | LOW | Polish |

---

## 3. Priority Order for Fixes

1. **#5** - Persist onboarding completion to DB (blocks all returning users)
2. **#9** - Fix "Ver Estrategia" to call onComplete (breaks completion flow)
3. **#2** - Replace hardcoded email with real user email
4. **#6** - Persist diagnostic result to DB (prevents credit waste)
5. **#1** - Add localStorage persistence for form data
6. **#8** - Include customChallenge in AI payload
7. **#4** - Fix hardcoded step number
8. **#3** - Persist skip action to DB
9. **#11** - Pre-populate name from profile
10. **#7** - Fix custom role validation
11. **#10** - Clean up retry logic
12. **#12** - Remove duplicate step counter

---

## 4. Test Scenarios Results

| Scenario | Result |
|----------|--------|
| First-time user, no data | Works, but email shows wrong value (#2) |
| Returning user, partial data | Form data lost on return (#1), step number restored via URL |
| User abandons mid-way, returns | All input data lost (#1), step resets to profile value |
| User skips optional steps | Works correctly, sliders have defaults |
| User inputs minimal data | Works, validation allows progression |
| Complete flow end-to-end | Works visually but nothing persists to DB (#5, #6) |
| Click "Ver Estrategia" after diagnostic | Onboarding not marked complete (#9) |
