# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Dr. Hazbi Avdiji (avdiji.com) — a diversity & inclusion consultant in French-speaking Switzerland. The site is in French. Built with Next.js (Pages Router) and TinaCMS (Tina Cloud) for content management. Deployed on Vercel.

## Commands

- **Dev:** `npm run dev` (runs TinaCMS + Next.js dev server)
- **Build:** `npm run build` (TinaCMS build + Next.js build)
- **Lint:** `npm run lint` (Next.js ESLint)
- **Format:** `npx prettier --write <files>` (no format script defined)

## Environment

Requires `.env` with `TINA_CLIENT_ID` and `TINA_TOKEN` from Tina Cloud. Copy `.env.example` as a starting point.

## Architecture

### Routing & Pages

Uses Next.js Pages Router with a catch-all route `src/pages/[[...slug]].tsx` that handles all CMS pages. The home page maps to `content/pages/home.mdx`. Post detail pages are at `src/pages/idee-recue/[slug].tsx` (route prefix: `/idee-recue`).

Static pages are generated via `getStaticProps`/`getStaticPaths` with ISR (`revalidate: 10`). The catch-all page fetches navigation, footer, page content, and optionally posts if the page has a `postList` block.

### TinaCMS Content Model

Schema defined in `tina/config.ts`. Collections:
- **page** — MDX pages with block-based content (`content/pages/`)
- **post** — MDX blog posts called "Idées reçues" (`content/posts/`)
- **category** — Post categories with priority ordering (`content/categories/`)
- **navigation** / **footerNavigation** — Global nav links (singleton-like, create/delete disabled)

Content blocks use templates defined in `src/utils/tina.ts`. The `textContent` template supports rich text with inline media blocks linked via `#media-[id]` URL pattern.

### Post Title Convention

Post titles use the format `XX--[title]` (e.g., `01--Mon titre`) so Hazbi can see ordering in the admin. The number prefix is stripped for display via `formatPostTitle()` in `src/utils/tina.ts`.

### Image Dimensions

TinaCMS `beforeSubmit` hooks automatically compute and store image/video dimensions alongside media fields. This is handled by `addImagesDimensions()` in `src/utils/tina.ts`.

### State Management

Redux Toolkit via `src/store/` with a single `ui` slice managing: scroll restoration, top bar visibility, color theme changes, and browser/OS detection.

### Theming

Six rotating theme colors defined in `src/utils/core.ts` (`themeColors`), exposed as CSS variables (`--color-theme`, etc.) and used in Tailwind config. Supports dark mode via Tailwind's `selector` strategy.

### Tailwind

Custom config in `tailwind.config.ts`:
- Pixel-based spacing scale (not Tailwind defaults)
- Responsive spacers via CSS variables (`spacer-*`, `v-spacer-*`, `gutter`)
- Custom breakpoints including `max-*` variants and interaction queries (`hashover`, `hasmouse`, `hastouch`)
- Custom easing functions for transitions

### Translations

All UI strings are in `content/translations.ts` (French). Import as `t` from `@/content/translations`.

### Animations

Uses Framer Motion for page transitions and UI animations. Respects `prefers-reduced-motion`. Custom easing curves in `src/utils/eases.ts`.

## Prettier Config

Uses single quotes, semicolons, 100 char width, JSX single quotes, with `@trivago/prettier-plugin-sort-imports` and `prettier-plugin-tailwindcss`.
