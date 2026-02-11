

# Premium SaaS Homepage — Flui as Narrative Infrastructure

## Overview

Complete rewrite of `src/pages/Index.tsx` to transform the landing page from a functional SaaS page into a premium, category-defining homepage inspired by Linear/Stripe aesthetics. The new page positions Flui as "Narrative Infrastructure" with bold typography, conceptual sections, and a visionary tone.

## Page Structure (8 Sections)

### 1. Hero
- Massive headline: "Authority is not created by volume. It's built by system."
- Subheadline about narrative infrastructure as competitive advantage
- Two CTAs: "Build your Authority System" (primary, violet-600) + "Enter the Studio" (secondary/ghost)
- Clean, spacious layout with strong typographic presence

### 2. Belief Shift
- Title: "The internet doesn't reward content. It rewards clarity."
- 3-4 bold declarative statements challenging volume-first thinking
- Minimal cards or stacked text blocks with subtle left border accents

### 3. Category Definition
- Title: "Flui is Narrative Infrastructure."
- Conceptual comparison diagram: CRM structures revenue, ERP structures operations, Flui structures authority
- Clean three-column layout with icon + label + description

### 4. System Breakdown (The Studio)
- Four system layers presented as architectural components:
  - Studio (command layer)
  - Blueprints (narrative architecture)
  - Sessions (coordinated authority movements)
  - Editor (aligned execution)
- Stacked cards with subtle numbering and descriptions

### 5. Differentiation
- Title: "Content tools help you publish. Flui helps you dominate narrative."
- Contrast between conventional tools (list what they do) vs Flui (what it enables)
- Two-column layout on desktop

### 6. Transformation (Before / After)
- Side-by-side comparison table
- Before: fragmented, reactive, volume-driven
- After: systematic, strategic, authority-compounding
- Clean grid with zinc-50 (before) vs white with violet accent (after)

### 7. Final CTA
- Headline: "Build authority that compounds."
- Single powerful CTA: "Start your Studio"
- Minimal, centered, maximum whitespace

### 8. Footer
- "Flui" branding + minimal links (same structure as current)

## Design Approach

- **Typography-driven**: Extra large headings (text-5xl to text-7xl on desktop), tight leading, bold weight
- **Whitespace-heavy**: Generous section padding (py-24 md:py-32 lg:py-40)
- **Light minimal aesthetic**: bg-white primary, bg-zinc-50 alternating, violet-600 for accents only
- **Subtle motion-ready**: CSS transitions on hover states; no animation library needed
- **Conceptual over decorative**: No product screenshots, no complex illustrations -- just typography, icons, and spatial hierarchy
- **Lucide icons**: Used sparingly for system breakdown and category definition

## Technical Details

### Files Changed

| File | Action | Detail |
|------|--------|--------|
| `src/pages/Index.tsx` | REWRITE | Complete replacement with new premium homepage |

### No Changes To
- Routing (`App.tsx`) -- the `/` route stays as `<Index />`
- No new files, no new dependencies
- No changes to any other page or component

### Design Tokens Used
- `bg-white`, `bg-zinc-50` for backgrounds
- `text-zinc-900`, `text-zinc-600`, `text-zinc-400` for text hierarchy
- `border-zinc-200` for subtle borders
- `violet-600` / `violet-100` for primary accents
- `rounded-xl`, `rounded-2xl` for cards
- All text in English (as specified in the prompt -- this page uses English copy, not PT-BR)

### CTA Links
- "Build your Authority System" and "Start your Studio" link to `/login`
- "Enter the Studio" links to `/login`

