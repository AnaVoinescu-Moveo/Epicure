# baseFrontReview

Run this checklist after building any frontend component or file. These are all the real review findings the mentor flagged across the first three frontend PRs. Review each point and fix any violations before pushing.

---

## 1. Text & Copy

- [ ] No hardcoded strings in components (labels, aria-labels, alt text, placeholder text, page titles, descriptions)
- [ ] All UI text must live in `src/constants/copy.ts` under the appropriate section key
- [ ] Nav link labels live in `src/constants/nav.ts` with a proper `NavLink` interface (no `as const`)

## 2. Fonts & Global Styles

- [ ] No `font-family` declaration in any component CSS module — it is set globally on `body` in `src/app/global.css`
- [ ] No other global styles (colors, base resets) duplicated in component files — use CSS tokens from `src/styles/tokens.css`

## 3. Icons & Images

- [ ] All icons are SVG, not PNG — place them in `public/icons/` as `.svg` files
- [ ] No `<img>` tags — use Next.js `<Image>` for all images. **Exception:** Strapi-served images must stay as `<img>` until Strapi is deployed to a public URL (Next.js image optimization blocks localhost via SSRF protection)
- [ ] Hero and other large images go in `public/images/`

## 4. Component Decomposition

- [ ] Each distinct interactive or visual section of a component should be its own component if it can stand alone (e.g. `HeaderIcons`, `DesktopNav`, `HeaderSearch`)
- [ ] Wrapper `<div>` elements that belong logically to a child component should be moved inside that child (e.g. the `mobileLeft` wrapper lives inside `MobileMenu`, not in `Header`)
- [ ] If a component only appears in one place right now, only extract it if the reviewer asks OR if the component file is getting large

## 5. Server vs Client Components (Next.js App Router)

- [ ] Components are **Server Components by default** — do NOT add `'use client'` unless the component uses hooks or event handlers
- [ ] If only part of a component needs interactivity, extract that part into a separate client component (e.g. `HeaderSearch`) and keep the parent as a server component
- [ ] Static parts (logo, nav links, non-interactive buttons) must stay in server components

## 6. Custom Hooks

- [ ] Any `useEffect` that manages a side effect usable in more than one place must be a custom hook
- [ ] Required hooks already in the project — use them, do not inline the logic:
  - `useScrollLock(active)` — lock body scroll
  - `useEscapeKey(callback, active)` — close on Escape key
  - `useIsClickedOutside(ref, callback, active)` — close on outside click
  - `useSearchKeyboard(itemCount, onSelect)` — arrow/enter keyboard nav for lists
  - `useClickOutside(ref, callback)` — close dropdown on outside click

## 7. Mock Data

- [ ] Mock data must NOT live inside component files
- [ ] Place all mock data in `src/mocks/` with a descriptive filename (e.g. `search.ts`)
- [ ] Export both the data constant and any helper functions (e.g. `mockSearch`) from the mocks file

## 8. Data Fetching & API

- [ ] All Strapi API calls must live in a service file under `src/services/` (e.g. `restaurantService.ts`, `dishService.ts`) — never call `strapiGet` directly from a component
- [ ] Service functions must be wrapped with `unstable_cache` from `next/cache`, with a descriptive cache key and `{ revalidate: 60 }`
- [ ] Environment variables must be imported from `src/config/env.ts` — never read `process.env` inline in components or lib files

## 9. TypeScript

- [ ] No inline object type literals where a named interface would be clearer (e.g. `req: { user: JwtUser }` → `req: AuthenticatedRequest`)
- [ ] No `as const` on arrays — use a proper typed interface instead
- [ ] Exclude `.spec.tsx` and `.test.tsx` from `tsconfig.json` so jest-dom matchers do not cause `tsc` errors

## 10. CSS & Styling

- [ ] No hardcoded pixel values for colors — use tokens from `tokens.css`
- [ ] Mobile-first: write base styles for mobile, override in `@media (min-width: 1024px)`
- [ ] Each component has its own `.module.css` file — no cross-component style sharing

## 11. Pre-push Checklist

Before every push:

```bash
npx nx run-many -t lint typecheck build --projects=frontend
npx nx format:check --base="remotes/origin/main"
npx nx test frontend --no-coverage
```

Then run `/code-review` before opening the PR for mentor review.
