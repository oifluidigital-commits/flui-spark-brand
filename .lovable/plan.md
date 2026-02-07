

# Fix Critical Auth Flow - Email Validation and Google Signup

## Problem Summary

Three blocking issues in the current auth flow:

1. **Email signup blocks users**: After signup, `data.user && !data.session` is true (email not confirmed), showing a full-page "Verifique seu email" card with no skip option. Users cannot proceed.
2. **Google signup redirect**: Google OAuth redirects back to `/` which maps to `/login`. The `onAuthStateChange` listener picks up the session, but if the profile trigger hasn't created the profile yet (race condition), the user gets stuck.
3. **Separate Login/Signup pages**: The prompt requests a unified page with tabs/toggle.

## Fix Plan

### Step 1: Enable Auto-Confirm Email Signups

Use the `configure-auth` tool to enable auto-confirm for email signups. This means `signUp` will return a session immediately, eliminating the email confirmation blocker. The soft verification modal becomes cosmetic only (future-ready).

### Step 2: Unified Login Page (`/login`)

Replace the current separate `Login.tsx` and `Signup.tsx` with a single unified page containing:

- **Tab toggle**: "Entrar" / "Criar conta" (no Shadcn Tabs -- use simple inline toggle buttons)
- **Login form**: Email + Password + show/hide toggle + "Esqueceu a senha?" link
- **Signup form**: Nome + Email + Password (min 8 chars) + Confirmar senha + privacy checkbox
- **Google button**: Below both forms with divider "ou continue com"
- **Footer**: Links to Privacy Policy

Design tokens:
- Card: `bg-white rounded-2xl border-zinc-200 shadow-md max-w-[400px]`
- Primary button: `bg-violet-600 hover:bg-violet-500 text-white rounded-lg`
- Google button: `border-zinc-200 hover:bg-zinc-50 rounded-lg`
- Input focus: `ring-2 ring-violet-600`
- Error: `border-rose-500`, `text-rose-600`

### Step 3: Soft Email Verification Modal

After email signup success, show a non-blocking Dialog (not full-page) with:
- Mail icon (Lucide)
- "Verifique seu email" heading
- Email address shown
- Countdown timer (60s) then "Reenviar email" button
- "Pular verificacao por agora" ghost button that closes modal and redirects to `/onboarding`
- Close (X) button

Since auto-confirm is enabled, the user already has a session. The modal is informational only.

### Step 4: Fix Google OAuth Flow

The current `signInWithGoogle` implementation is correct (uses `lovable.auth.signInWithOAuth`). The issue is the redirect back to origin. After OAuth redirect:
- `onAuthStateChange` fires with `SIGNED_IN`
- `handleSession` fetches profile
- If profile exists with name -> redirect to dashboard/onboarding
- If profile has no name -> redirect to `/complete-profile`

The fix: add a small retry loop in `handleSession` for profile fetch (the DB trigger may have a slight delay after OAuth). Add 2 retries with 500ms delay if profile is null on first attempt.

### Step 5: Remove `/signup` Route

- Delete `Signup.tsx` (functionality merged into `Login.tsx`)
- Update `App.tsx`: remove Signup import and route, redirect `/signup` to `/login`
- Update `AuthLayout.tsx`: apply Flui Design System styling (light mode, violet primary)

### Step 6: Password Visibility Toggle

Add show/hide password toggle (Eye/EyeOff icons) to all password fields in both login and signup forms.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Login.tsx` | REWRITE | Unified login/signup with tabs, soft verification modal, password toggle |
| `src/pages/Signup.tsx` | DELETE | Merged into Login.tsx |
| `src/components/layout/AuthLayout.tsx` | MODIFY | Update styling to Flui Design System |
| `src/hooks/useAuth.ts` | MODIFY | Add profile fetch retry for OAuth, password min 8 chars |
| `src/App.tsx` | MODIFY | Remove Signup route, add /signup redirect to /login |

## What Will NOT Change

- No new pages or routes (beyond redirect)
- No database migrations
- No edge function changes
- No changes to AppContext interface
- No changes to onboarding flow
- No changes to RLS policies

