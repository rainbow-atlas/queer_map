# queer_map

A React + Leaflet web app for browsing queer-friendly places on an interactive map. The UI supports search, category and tag filters, German/English UI strings, embed-friendly URL parameters, and optional legal (privacy / imprint) modals. Location data is shipped as static JSON built from Supabase at deploy time—**the browser does not call Supabase at runtime**.

## Features

- **Map**: Pan/zoom, colored pins per category, tooltips and detail views, optional “my location”, street/satellite tiles (see `src/components/Map.tsx`).
- **Sidebar**: Category filter, multi-tag filter, text search; list stays in sync with map filters.
- **Internationalization**: German and English (`src/i18n/`); language preference is persisted.
- **Embedding**: Query parameters control fullscreen mode, filters, deep links to a place, and chrome hiding—useful for iframes. See [docs/iframe-guide.md](docs/iframe-guide.md).
- **Legal & cookies**: Privacy (DSGVO) and imprint modals; cookie consent banner stores choice in `localStorage` (analytics hooks are placeholders—see notes below).

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 18, TypeScript, Tailwind CSS, Lucide icons |
| Map | Leaflet, react-leaflet |
| Build | Vite 5 |
| Data build | Node script + `@supabase/supabase-js`, `dotenv` |

## Prerequisites

- **Node.js** 20.x (matches CI; other recent LTS versions usually work).
- **npm** (lockfile: `package-lock.json`).
- For refreshing data: a **Supabase** project with the `locations` data your script expects (see [docs/docs.md](docs/docs.md)).

## Quick start

```bash
git clone <repository-url>
cd queer_map
npm ci
```

1. Copy environment template and fill in Supabase values used **only by the build script** (not exposed to the client bundle by default):

   ```bash
   cp .env.example .env
   # Edit .env: SUPABASE_URL, SUPABASE_ANON_KEY
   ```

2. Generate `public/locations.json` (required before the app can load places):

   ```bash
   npm run build:data
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

Open the URL Vite prints (typically `http://localhost:5173`). The app loads locations from `${BASE_URL}/locations.json` (see `import.meta.env.BASE_URL` in Vite).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build:data` | Fetch rows from Supabase and write `public/locations.json` |
| `npm run build` | Runs `build:data`, then production Vite build → `dist/` |
| `npm run preview` | Serve `dist/` locally to verify production output |
| `npm run lint` | ESLint |

## Data flow (Supabase → static JSON)

1. **Source**: The script `scripts/fetch-locations.mjs` reads `locations` and joins category names via `location_categories` / `categories`. It falls back to the legacy `category` column when no junction rows exist.
2. **Output**: `{ "locations": [ … ] }` written to `public/locations.json`. Each item includes `id`, `name`, `position` (`[lat, lng]`), `categories` (array), optional fields like `description`, `website`, `tags`, `image`, `address`, `phone`, `email`, `additionalInfo`, `updatedAt`.
3. **Runtime**: The SPA only `fetch`es that JSON file.

Details and schema notes: [docs/docs.md](docs/docs.md).

## Base URL (`vite.config.ts`)

Vite `base` defaults to `/queer_map/` for GitHub Pages project sites. For a **root** deploy (e.g. custom apex domain), set:

```bash
VITE_BASE_PATH=/ npm run build
```

See [docs/README.md](docs/README.md) for custom-domain setup (queermap.at / GitHub Pages).

## URL query parameters

Useful for sharing and iframes. Parameters are read on load; changing filters updates the URL via `history.replaceState`.

| Parameter | Effect |
|-----------|--------|
| `category=<name>` | Filter to that category (must exist in data). |
| `tags=a,b,c` | OR filter: show locations that have any of these tags. |
| `fullscreen=true` | Map-only layout (no sidebar). |
| `hideLegal=true` | Hide legal links / language strip where applicable. |
| `hideMapZoom=true` | Hide zoom controls on the map. |
| `hideMapSettings=true` | Hide map settings UI. |
| `location=<id>` | Open map on that place ID; optional `locationDetail=preview` for preview-style open. |
| `debug=true` | Show iframe/fullscreen debug hints in the header. |

Full embedding examples: [docs/iframe-guide.md](docs/iframe-guide.md).

## Deployment (GitHub Pages)

Workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

- **Trigger**: Push to `main`, or manual **workflow_dispatch**.
- **Secrets** (repository): `SUPABASE_URL`, `SUPABASE_ANON_KEY` — used during `npm run build` so `locations.json` is fresh in `dist/`.
- **Artifact**: Contents of `dist/` uploaded to GitHub Pages.

For production URLs under `https://<user>.github.io/<repo>/`, the default `base: '/queer_map/'` matches the workflow comment. Custom-domain builds often need `VITE_BASE_PATH=/` in the workflow step—see [docs/README.md](docs/README.md).

## Project layout

```
queer_map/
├── .github/workflows/   # CI deploy to GitHub Pages
├── docs/                  # iframe guide, Supabase handoff, domain notes
├── public/
│   └── locations.json     # Generated; do not edit by hand for production
├── scripts/
│   └── fetch-locations.mjs
├── src/
│   ├── App.tsx            # Shell, filters, URL sync, legal/cookies
│   ├── components/       # Map, Sidebar, LanguageSwitcher, …
│   ├── i18n/
│   └── main.tsx
├── vite.config.ts
└── package.json
```

## Documentation index

| Doc | Content |
|-----|---------|
| [docs/docs.md](docs/docs.md) | Supabase tables, RLS overview, static JSON pipeline |
| [docs/iframe-guide.md](docs/iframe-guide.md) | Embedding, URL parameters, troubleshooting |
| [docs/README.md](docs/README.md) | Custom domain (e.g. queermap.at) + `VITE_BASE_PATH` |

## Development notes

- **Cookie banner**: Accept/reject is persisted; `handleCookieAccept` / `handleCookieReject` in `App.tsx` are the right place to wire analytics or to strip optional cookies on reject. Align implementation with your privacy text (DSGVO modal).
- **Package name**: `package.json` still uses the generic name `vite-react-typescript-starter`; renaming is cosmetic and optional.

## License

Add a `LICENSE` file if you intend to open-source the repo; none is asserted in this README by default.
