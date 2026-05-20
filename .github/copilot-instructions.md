# Copilot Instructions

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build (also used by CI to validate)
npm run preview  # preview the production build locally
```

There are no tests or linters configured.

## Architecture

This is a React 18 + Vite SPA for a language school (English Way Express). It deploys to Vercel via GitHub Actions on every push to `main` and on pull requests.

### Content system

All page content lives as Markdown files in `legacy_content/`. The file naming convention maps directly to URL paths:

- `pages_home.md` → `/`
- `pages_servicos_coaching.md` → `/servicos/coaching` (underscores become `/`)
- `parts_nav.md`, `parts_header.md`, `parts_footer.md` are structural parts

`src/content/legacyContent.js` ingests all `pages_*.md` files at build time via `import.meta.glob`, derives each page's path and title from the file name and its first `# Heading`, then exposes a `pageMap` (a `Map<path, page>`) used throughout the app.

Navigation items are parsed from `parts_nav.md` using a custom parser: `## Label /path` declares top-level items and `### Label /path` declares their children.

### Routing

There are no `<Routes>` or `<Route>` components. `App.jsx` does manual path matching:

1. `/` → `<HomePage />`
2. Path found in `legacyContent.pageMap` → `<LegacyPage />`
3. `/servicos` → `<ServicesHub />`
4. Anything else → `<NotFound />`

### i18n

Seven locales in `src/locales/` (`pt-BR` is default and fallback). **Only UI strings are translated** — page body content exists only in Portuguese. When a user switches to a non-`pt-BR` locale, a `contentNotice` banner is shown on legacy pages.

Always add new UI strings to **all** locale files at once. Use `useTranslation()` / `t()` for any user-visible string in components.

### Key components

- **`LegacyMarkdown`** — renders page body Markdown with two post-processing steps: brand name occurrences (`EnglishWay Express`, etc.) are replaced with an inline logo image, and relative links are rendered as React Router `<Link>` elements.
- **`LeadForm`** — posts contact/job-application data as JSON to the Google Apps Script webhook configured in `VITE_GOOGLE_SHEETS_WEBHOOK_URL`. This env var must be set in both `.env` and in the Vercel project settings.
- **`Layout`** — wraps every page; renders the header with the language switcher, the nav (populated from `legacyContent.navItems`), an optional `preContent` slot (used for the hero carousel on the home page), `children`, a WhatsApp FAB, and the footer.

## Key conventions

- **Adding a new page**: create `legacy_content/pages_{slug}.md` (use `_` for path separators) with a `# Title` as the first line. It will automatically appear in `legacyContent.pageMap` and be routable.
- **Adding a nav link**: edit `legacy_content/parts_nav.md` using the `## Label /path` / `### Label /path` syntax.
- **Environment variable prefix**: all Vite env vars exposed to the client must be prefixed with `VITE_`. The only current one is `VITE_GOOGLE_SHEETS_WEBHOOK_URL`.
- **`normalizePath`**: trailing slashes are stripped everywhere to keep path matching consistent.
