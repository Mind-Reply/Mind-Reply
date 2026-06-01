---
name: Hydration fix pattern
description: How to avoid SSR/client hydration mismatches in Next.js App Router client components
---

# Hydration Fix Pattern

## Rule
Never compute time-sensitive or environment-sensitive values at render time in client components — they produce different output on server (SSR) vs client.

Common culprits: `new Date().getHours()`, `typeof window`, `Math.random()`, `window.location.*`.

## How to apply
1. Initialize the state to a safe empty value: `const [greeting, setGreeting] = useState('')`
2. Compute the real value in `useEffect`: `useEffect(() => { setGreeting(computeGreeting()); }, [])`
3. On the element, add `suppressHydrationWarning` if a flicker is acceptable.
4. For URL search params: use `new URLSearchParams(window.location.search)` inside `useEffect` instead of `useSearchParams()` — this avoids the Next.js 15 Suspense boundary requirement.

**Why:** Server renders at UTC time; client runs in local time zone. SSR output and hydration output differ → React hydration error.
