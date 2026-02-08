

# Fix Password Input Validation Bug

## Root Cause

The `PasswordInput` component (line 91-128 of `Login.tsx`) is a regular function component, not wrapped in `React.forwardRef`. When `react-hook-form`'s `register('password')` is spread onto it, the returned object contains `{ onChange, onBlur, ref, name }`. In React, `ref` cannot be passed through as a regular prop to function components -- it requires `forwardRef`.

Without the `ref`, react-hook-form cannot read the actual input value. It always sees the field as empty/undefined, which triggers the "Required" / "min length" validation error immediately on submit.

## Fix

### File: `src/pages/Login.tsx`

1. **Convert `PasswordInput` to use `React.forwardRef`** so the `ref` from `register()` is properly forwarded to the underlying `<Input>` element.

2. **Change validation mode** on both forms to `mode: 'onSubmit'` (default) to prevent premature validation. Currently no explicit mode is set which defaults to `onSubmit`, but we should also add `reValidateMode: 'onChange'` so errors clear as the user types.

3. **Update the Zod schemas**: Change signup password minimum from 8 to 6 characters per the requirement, and update error messages to PT-BR ("Campo obrigatório", "Mínimo 6 caracteres").

### Specific Changes

**PasswordInput component (lines 91-128)**:
- Wrap with `React.forwardRef<HTMLInputElement, Props>`
- Remove the `{ register: _reg, ...rest }` destructuring hack
- Forward the ref directly to `<Input ref={ref}>`

**Login form config (line 223-225)**:
- Add `mode: 'onTouched'` so validation only runs after blur, not on mount

**Signup form config (line 228-231)**:
- Add `mode: 'onTouched'`

**Signup schema (line 50-52)**:
- Change `.min(8, ...)` to `.min(6, { message: 'Mínimo 6 caracteres' })`

No other files are changed. The email fields, layout, navigation, and auth logic remain untouched.
