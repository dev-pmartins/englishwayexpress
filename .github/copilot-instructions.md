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

There are no `<Routes>` or `<Route>` components. `App.jsx` does manual path matching in this priority order:

1. `/` → `<HomePage />`
2. `/area-do-aluno/login` → `<StudentLoginPage />`
3. `/area-do-aluno` or `/area-do-aluno/*` → `<StudentArea />`
4. `/noticias/{slug}` → `<PostDetailPage />`
5. `/noticias` → `<PostsPage />`
6. Path found in `legacyContent.pageMap` → `<LegacyPage />`
7. `/servicos` → `<ServicesHub />`
8. Anything else → `<NotFound />`

`StudentArea` does its own sub-routing by reading `location.pathname` directly:
- `/area-do-aluno` → `<StudentHub />`
- `/area-do-aluno/{lang}` (en/es/de/fr/it) → `<StudentLanguagePage />`
- `/area-do-aluno/{lang}/{slug}` → `<StudentPostPage />`

### Student area

Authentication is handled by `StudentAuthContext` (JWT). Tokens are stored in localStorage under `ewe_student_token` / `ewe_student_user`. The API base URL comes from `VITE_API_URL` (defaults to same origin).

The nav "Área do Aluno" item opens a **language preference modal** (`StudentLanguageModal`) instead of navigating directly. Selected language codes are persisted in localStorage under `ewe_student_languages` via the `useStudentLanguages` hook (`src/hooks/useStudentLanguages.js`). `StudentHub` reads this preference and shows only the selected languages (falls back to all five if none saved).

### i18n

Seven locales in `src/locales/` (`pt-BR` is default and fallback). **Only UI strings are translated** — page body content exists only in Portuguese. When a user switches to a non-`pt-BR` locale, a `contentNotice` banner is shown on legacy pages.

Always add new UI strings to **all** locale files at once. Use `useTranslation()` / `t()` for any user-visible string in components.

### Key components

- **`LegacyMarkdown`** — renders page body Markdown with two post-processing steps: brand name occurrences (`EnglishWay Express`, etc.) are replaced with an inline logo image, and relative links are rendered as React Router `<Link>` elements.
- **`LeadForm`** — posts contact/job-application data as JSON to the Google Apps Script webhook configured in `VITE_GOOGLE_SHEETS_WEBHOOK_URL`. This env var must be set in both `.env` and in the Vercel project settings.
- **`Layout`** — wraps every page; renders the header with the language switcher, the nav (populated from `legacyContent.navItems`), an optional `preContent` slot (used for the hero carousel on the home page), `children`, a WhatsApp FAB, and the footer.

## Backend API (`englishwayexpress-api`)

The companion API lives at `../englishwayexpress-api` (sibling directory). It is a **Laravel 13 + Sanctum** application using SQLite by default. The frontend points to it via `VITE_API_URL`.

### Running the API locally

```bash
cd ../englishwayexpress-api
php artisan serve        # starts at http://localhost:8000
php artisan migrate      # run migrations
php artisan db:seed      # seed sample data
```

### Auth

- `POST /api/auth/login` → returns a Sanctum token
- `POST /api/auth/logout` / `POST /api/auth/refresh` / `GET /api/auth/me`
- Roles: `admin`, `professor`, `aluno` — enforced via `role:` middleware

### Key API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/posts` | public | List published posts (news) |
| GET | `/api/posts/{slug}` | public | Post detail |
| GET | `/api/student/posts/{languageCode}` | public | Student posts by language (en/es/de/fr/it) |
| GET | `/api/student/modules` | aluno/professor/admin | Student modules for sidebar |
| GET/POST/PUT/DELETE | `/api/admin/posts` | admin/professor | Manage posts + translations |
| GET/POST/PUT/DELETE | `/api/admin/modules` | admin/professor | Manage modules |
| GET/POST/PUT/DELETE | `/api/admin/materials` | admin/professor | Manage materials |
| GET/POST/PUT/DELETE | `/api/admin/users` | admin | Manage users |
| GET/PUT/DELETE | `/api/admin/contacts` | admin/professor | Manage contact form submissions |

### Data model highlights

- **Post** — has `category` (news/opportunities/tips/events), `status`, `author_id`, `published_at`; translated via `PostTranslation` (one per language code)
- **Module** — belongs to a `Language`, has a `minimum_level`, contains many `Material`s
- **Language** — code (e.g. `en`, `es`, `de`, `fr`, `it`); used to scope student content
- **StudentLevel** — links a user to a language + level (e.g. B2 in English)
- **Contact** — submitted via `POST /api/contacts`; may have `ContactAttachment`s

### Backend env vars

Key vars in `englishwayexpress-api/.env`:
- `FRONTEND_URL` — must match the frontend origin for CORS
- `DB_CONNECTION` — defaults to `sqlite`; switch to `mysql` for production

## Key conventions

- **Adding a new page**: create `legacy_content/pages_{slug}.md` (use `_` for path separators) with a `# Title` as the first line. It will automatically appear in `legacyContent.pageMap` and be routable.
- **Adding a nav link**: edit `legacy_content/parts_nav.md` using the `## Label /path` / `### Label /path` syntax.
- **Environment variable prefix**: all Vite env vars exposed to the client must be prefixed with `VITE_`. Current vars: `VITE_GOOGLE_SHEETS_WEBHOOK_URL`, `VITE_API_URL`.
- **`normalizePath`**: trailing slashes are stripped everywhere to keep path matching consistent.
- **localStorage keys**: `ewe_student_token`, `ewe_student_user` (auth), `ewe_student_languages` (language preferences).
- **Nav special behavior**: the "Área do Aluno" parent nav item (`/area-do-aluno`) is rendered as a `<button>` in `Layout.jsx` that opens `StudentLanguageModal` instead of navigating. Other nav items are standard `<Link>` elements.
