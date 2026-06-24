# Bungkit

A single-`package.json` starterkit that combines three apps on the **Bun** runtime,
sharing one **TailwindCSS v4** theme:

| App | Stack | Source | Build output |
| --- | --- | --- | --- |
| Static site | [Eleventy 3](https://www.11ty.dev/) | `apps/website` | `dist/website` |
| Frontend SPA | [Angular 22](https://angular.dev/) (zoneless, standalone) | `apps/app` | `dist/website/app` |
| Backend API | [ElysiaJS](https://elysiajs.com/) | `apps/backend` | `dist/backend` |

In **production** a single Elysia/Bun process serves everything from one origin:

```
http://localhost:3000/         -> Eleventy static site
http://localhost:3000/app/     -> Angular SPA (deep links fall back to the app shell)
http://localhost:3000/api/*    -> Elysia API
```

## Requirements

- [Bun](https://bun.com) `>= 1.3`

## Install

```bash
bun install
```

## Develop

Runs all three apps concurrently with live reload:

```bash
bun run dev
```

- Eleventy site → http://localhost:8080 (Tailwind recompiles on change)
- Angular app → http://localhost:4200 (proxies `/api` → Elysia via `proxy.conf.json`)
- Elysia API → http://localhost:3000

You can also run any app on its own: `bun run dev:website`, `bun run dev:app`, `bun run dev:backend`.

## Build & run (production)

```bash
bun run build        # builds website -> css -> app -> backend into dist/
bun run start        # one Bun process serves the site, the app, and the API
```

Then open http://localhost:3000 (and http://localhost:3000/app/).

Override the served directory or port with env vars: `PUBLIC_DIR`, `PORT`.

## How the pieces fit

- **Tailwind v4** is configured CSS-first. Shared design tokens live in
  [`shared/theme.css`](shared/theme.css) (`@theme { … }`) and are imported by both
  the website ([`apps/website/styles/tailwind.css`](apps/website/styles/tailwind.css))
  and the app ([`apps/app/src/styles.css`](apps/app/src/styles.css)), so they share
  one palette (`brand-*`, `font-display`).
  - The website compiles CSS with `@tailwindcss/cli`.
  - The app compiles CSS through Angular's PostCSS pipeline via
    [`.postcssrc.json`](.postcssrc.json) (`@tailwindcss/postcss`).
- **Angular output** is flattened straight into `dist/website/app` (no `browser/`
  subfolder) using `outputPath: { base, browser: "" }`, with `baseHref: "/app/"`
  so it works when served under that path. See [`angular.json`](angular.json).
- **Elysia** serves the static tree with `@elysiajs/static` and adds an `onError`
  fallback so Angular client-side routes (e.g. `/app/settings`) return the app shell.
  See [`apps/backend/src/index.ts`](apps/backend/src/index.ts).

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Run website + app + API together (live reload) |
| `build` | Clean, then build all three into `dist/` |
| `start` | Run the built Elysia server (serves everything) |
| `clean` | Remove `dist/` and the Angular cache |
| `build:website` / `build:css` / `build:app` / `build:backend` | Per-app builds |

## Layout

```
apps/
  website/    # Eleventy: layouts, pages, Tailwind entry, static public/
  app/        # Angular 22: standalone, zoneless, HttpClient -> /api
  backend/    # ElysiaJS: /api/* + static serving + SPA fallback
shared/
  theme.css   # Tailwind @theme tokens shared by both frontends
eleventy.config.js  angular.json  proxy.conf.json  .postcssrc.json  tsconfig.json
```
