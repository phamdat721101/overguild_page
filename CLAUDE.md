# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Dev server on http://localhost:8080
pnpm build      # Production build
pnpm preview    # Preview production build
pnpm lint       # ESLint
pnpm test       # Run tests once (vitest)
pnpm test:watch # Vitest in watch mode
```

Add shadcn/ui components: `npx shadcn@latest add <component>`

## Architecture

Single-page landing site for OverGuild (Web3 quest board). Stack: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion.

**Page structure** (`src/pages/Index.tsx`): `Navbar → IntroSection → JourneySection → JoinSection → FooterSection`

**Waitlist flow**: `WaitlistForm.tsx` POSTs to `/api/waitlist` (configurable via `VITE_WAITLIST_API` env var).
- Dev: Vite proxies `/api/waitlist` → `http://dev.overguild.com/waitlist` (see `vite.config.ts`)
- Prod (Vercel): `api/waitlist.ts` is a Vercel serverless function that forwards to the same backend

**Path alias**: `@/` maps to `src/` throughout the codebase.

## Design System

The retro pixel/RPG aesthetic is defined entirely in `src/index.css` as Tailwind component and utility classes:

- `btn-pixel` / `btn-pixel-secondary` — pixel-edge buttons with glow
- `card-pixel` — card with clipped corners
- `input-pixel` — form input with pixel corners
- `font-pixel` — Press Start 2P (retro font for accents)
- `text-glow-cyan` / `text-glow-gold` / `text-glow-magenta` — neon text shadows
- `bg-grid` — dark grid background pattern
- `scanlines` — CRT scanline overlay (applied to page root)
- `animate-pulse-glow` / `animate-float` — keyframe animations

Brand colors (CSS variables): `--primary` (cyan `180 100% 50%`), `--secondary` (gold `45 100% 55%`), `--accent` (magenta `300 80% 60%`).

Fonts: Space Grotesk (body/headings), Press Start 2P (pixel accents via `.font-pixel`).

## Assets

Static assets live in two places:
- `src/assets/` — imported in components via ES modules
- `public/` — served directly (used for OG/Twitter meta image tags in `index.html`)

Both `src/assets/` and `public/` contain the same hero and logo files — manage them manually (no sync script).

## Tests

Test files go in `src/**/*.{test,spec}.{ts,tsx}`. Setup file at `src/test/setup.ts`. Uses jsdom environment with vitest globals.
