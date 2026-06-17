# Architectural Dilemmas & Decisions

A log of key architectural decisions made during the project — what the options were, what the tradeoffs looked like, and why we went with a specific approach.

---

## 1. Restaurant Filtering — Client-side vs. Server-side vs. Hybrid

**Context:** The Restaurants page has four mobile filters: All, Most Popular, New, and Open Now. We needed to decide where the filtering logic should live.

### Options considered

**Option A — Server-side (Strapi queries via URL search params)**
Each filter click updates the URL (`?filter=most-popular`), the Next.js page re-renders on the server, and a different Strapi query is made for each filter:

- Most Popular → `sort=rating:desc&pagination[limit]=3`
- New → `filters[isNew][$eq]=true`
- All → default query

**Option B — Client-side**
Fetch all restaurants once on the server. A client component receives the full list and filters it in the browser on each filter switch.

**Option C — Hybrid**
Use Strapi queries for filters it can handle (All, Most Popular, New) and client-side logic for filters that require runtime state (Open Now).

### Why we chose client-side (Option B)

1. **Scale** — the dataset has tens of restaurants, not thousands. Fetching all of them is a single fast request. The savings from fetching 3 vs. 20 records are not measurable in practice.

2. **UX** — client-side filtering is instantaneous. Server-side filtering requires a network round-trip and a page re-render on every filter tap, which feels sluggish on mobile for what should be an immediate response.

3. **Open Now forces it anyway** — the Open Now filter depends on the current browser time, which is only available client-side and changes every second. Server-side caching would produce stale results. This means a hybrid approach is unavoidable if we go server-side — and a hybrid adds two different patterns to maintain with no real benefit at this scale.

4. **Simplicity** — one approach, one mental model, less code. The filter logic is colocated in a single client component rather than split across URL state, service functions, and component logic.

### When server-side filtering would be the right call

- The dataset is large enough that fetching everything is expensive (hundreds or thousands of items)
- Filtered URLs need to be SEO-indexable (e.g. shareable links like `/restaurants?filter=open-now`)
- Filters are complex enough (multi-field, cross-relation) that doing them in JavaScript would be slow or error-prone

None of these apply to this project at its current scale.

### Note on Strapi querying

Strapi's built-in query capabilities (`sort`, `pagination[limit]`, `filters[field][$eq]`) are still used in the service layer (`restaurantService.ts`) for the initial data fetch. The decision here is specifically about where the _switching_ between filter views happens — in the URL and on the server, or in component state and in the browser.

---

## 2. Map View on Mobile — How to handle viewport resize while map is active

**Context:** Map View is a desktop-only feature — the button is hidden on mobile via CSS (`display: none`). However, CSS only hides the button; it does not reset the component state. If a user opens Map View on desktop and then resizes the browser to a mobile viewport, the `activeFilter` state remains `'map-view'` and the map stays visible even though it shouldn't exist on mobile.

### Options considered

**Option A — CSS only**
Add `display: none` to the map container below 1024px. The map is hidden but still mounted — Leaflet continues running in the background, consuming memory and holding a DOM node. No state reset.

**Option B — Reset state via `matchMedia` listener**
Use `window.matchMedia('(min-width: 1024px)')` to detect when the viewport crosses the mobile breakpoint. If the active filter is `map-view` at that moment, reset it to `'all'`. The map component unmounts cleanly and the user sees the default restaurant list.

**Option C — URL-based filter state**
Store the active filter in the URL (`?filter=map-view`). On mobile, a server or middleware layer could strip or redirect unsupported filter values. Overkill for this project.

### Why we chose Option B

- **Correct state** — the component state actually matches what the user sees. Option A would leave a hidden-but-alive Leaflet instance running, which is wasteful and could cause subtle bugs.
- **Clean unmount** — resetting to `'all'` lets React unmount the map component properly, freeing Leaflet's resources.
- **Consistent with existing patterns** — `HeaderSearch.tsx` already uses `window.matchMedia('(min-width: 1024px)')` for the same breakpoint, so the approach is established in the codebase.
- **Minimal code** — a single `useEffect` with an event listener; no new abstractions needed.

### Implementation note

The listener is attached in a `useEffect` inside `RestaurantsList` with `activeFilter` as a dependency. When the viewport drops below 1024px and `activeFilter === 'map-view'`, it calls `setActiveFilter('all')`. The effect cleans up the listener on every re-subscribe and on unmount.

---

## 3. Restaurants Page Fetch Error — return null vs error boundary

**Context:** `RestaurantsPage` is an async server component that calls `getAllRestaurants()`. The original implementation wrapped the fetch in a try/catch and returned `null` on failure. A mentor review flagged this as a problem: `return null` renders a completely blank page with no feedback to the user — no message, no retry option, nothing. The user has no way to know if the page is broken, loading, or just empty.

### The problem with `return null`

When a fetch fails silently and the page returns `null`, the user sees a blank white screen. There is no way to distinguish this from a loading state or an actual empty result. The header and footer still render (they come from `layout.tsx`), but the page body is empty. This is a bad user experience and makes the failure invisible.

### Options considered

**Option A — Inline error/empty state**
Keep the try/catch but instead of `return null`, render an error message and a retry button directly in the page component:

```tsx
} catch {
  return <div>Something went wrong. Please try again later.</div>;
}
```

This works but mixes data-fetching logic with error UI inside the same component. It also doesn't give users a way to retry without a full page reload.

**Option B — Next.js `error.tsx` boundary (chosen)**
Remove the try/catch entirely and let the error propagate. Next.js App Router automatically catches unhandled errors in async server components and renders the nearest `error.tsx` file in the same route segment. This file receives an `error` object and a `reset()` function that re-renders the segment — giving the user a proper retry mechanism.

```
app/
  restaurants/
    page.tsx       ← throws on fetch failure
    error.tsx      ← Next.js renders this automatically
```

### Why we chose Option B

- **Separation of concerns** — `page.tsx` only handles the happy path. Error UI lives in its own dedicated file (`error.tsx`), which is the convention Next.js was designed around.
- **Retry without full reload** — the `reset()` prop passed to `error.tsx` re-renders only the failing segment, not the entire page. The user can retry without losing navigation context.
- **Cleaner page component** — removing try/catch also allowed simplifying `let restaurants = []` (which inferred `any[]`) to `const restaurants = await getAllRestaurants()`, which TypeScript types correctly from the service function's return type.
- **Scalable pattern** — if other routes need error handling later, they each get their own `error.tsx` following the same pattern, rather than each page having its own ad-hoc error logic.

### Implementation note

`error.tsx` must be a Client Component (`'use client'`) because it uses the `reset` callback interactively. The component is minimal: a message string and a retry button, both using copy from `copy.ts`.
