# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: FastAPI (Python 3.11) — uvicorn + SQLAlchemy 2 + psycopg3 + itsdangerous + Pydantic v2
- **Database**: PostgreSQL — schema owned by Drizzle (`lib/db`), accessed from Python via SQLAlchemy ORM models that mirror the drizzle tables column-for-column. Schema migrations are still done with `pnpm --filter @workspace/db run push`.
- **Validation**: Pydantic v2 on the Python side; Zod (`zod/v4`) + `drizzle-zod` still used by the frontend (`@workspace/api-zod`)
- **API codegen**: Orval (from OpenAPI spec) — unchanged; the FastAPI server returns the exact same shapes the spec describes
- **Build**: no build step for the API server; frontend still uses Vite

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **sigma-contractors** (`/`): React + Vite construction company website for Sigma Contractors & Engineering Works (Pvt) Ltd. Brand modeled on real Sigma site (logo, projects, content). **"Power & Trust" palette — dark by default**: navy `#0A192F` background (`--background: 218 65% 11%`), elevated card navy `#112240` (`--card: 220 58% 16%`), `#233554` hairline borders, cool-white text, and Construction Amber `#F59E0B` (`--primary: 38 92% 50%`) for CTAs/accents. Header is glassmorphism: `bg-background/80 backdrop-blur-md` over a card-color hairline. Hero CTA uses an amber box-shadow glow. Hero photo stays in full color over a left-to-right navy gradient overlay so machinery pops. PageHeader uses navy gradient overlay (not foreground) so backdrop images stay visible. ServicesMarquee is a `bg-card` (deep navy) band with alternating amber/white labels + amber diamond separators between thin amber borders. ProjectFormDialog supports both single hero upload AND multi-image gallery upload (multiple-select, per-image remove, persists via existing `gallery: string[]` field on `/api/projects`). Pages: Home (hero with rotating taglines, marquee, stats, vision/mission/goal, services, featured projects, location map, CTA), About, Services, Projects (filterable + modal detail view), Contact (react-hook-form + zod, posts to `/api/contact` via generated `useSubmitContactForm` hook). Footer uses styled `Σ SIGMA` text mark (the bundled logo PNG isn't transparent so image-based filters render as a white blob). Stack: wouter, framer-motion, lucide-react, shadcn/ui, react-hook-form, zod, sonner, @tanstack/react-query, @workspace/api-client-react.
- **api-server** (`/api`): **FastAPI (Python 3.11)** backend running under uvicorn. Source layout: `artifacts/api-server/app/{main,db,models,schemas,auth,seeds}.py` plus one router per resource under `app/routers/`. CORS reflects any origin and allows credentials. The signed admin cookie (`sigma_admin`, httpOnly, 30d, value `"1"`) is signed with `itsdangerous.Signer` using `SESSION_SECRET` and salt `sigma_admin_cookie` — note: this is NOT the same wire format as Express's `cookie-parser`, so admins must re-login once after the migration. JSON body limit 15 MB enforced via middleware. A custom HTTPException handler flattens dict-shaped `detail` so errors return `{ok:false,message:"..."}` like Express did, and a RequestValidationError handler returns `400 {message:"..."}` instead of FastAPI's default `422 {detail:[...]}`. Pydantic models use `alias_generator=to_camel` so the wire format stays camelCase (`originalContractValue`, `whyBest`, `sortOrder`, `createdAt`, etc.). Routes (identical to before): `GET /api/healthz`; `POST /api/contact` (inserts into `contact_submissions`); admin auth — `POST /api/admin/login` `{password}`, `POST /api/admin/logout`, `GET /api/admin/me`; site content CMS — `GET /api/content` (public, `{key:value}` map), `PUT /api/content/:key` (admin, `{value}`), `DELETE /api/content/:key` (admin), `DELETE /api/content` (admin reset all); image uploads — `POST /api/admin/upload` (admin, `{filename,dataUrl}` base64, max 12 MB) served via `GET /api/uploads/:name` (mounted from `artifacts/api-server/uploads/` with `Cache-Control: public, max-age=604800, immutable`); **projects CRUD** — `GET /api/projects` (public, auto-seeds 9 real projects on first call into an empty table), `POST/PUT/DELETE /api/projects[/:id]` (admin); **services CRUD** — `GET /api/services` (public, auto-seeds 6 services on first call), `POST/PUT/DELETE /api/services[/:id]` (admin). Admin password defaults to `123095`, override via env `SIGMA_ADMIN_PASSWORD`. The pnpm workspace package (`@workspace/api-server`) is kept as a stub whose `dev`/`start` scripts shell out to `python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT}`, so the existing workflow command `pnpm --filter @workspace/api-server run dev` continues to work. Production runs `python -m uvicorn app.main:app --host 0.0.0.0 --port 8080` and builds with `pip install -r artifacts/api-server/requirements.txt`.
- **Database** (Replit PostgreSQL): tables `contact_submissions`, `site_content`, `projects` (id varchar(64) pk, title, category, status, employer, original_contract_value, subcontracting_amount, awarded, completed, scope_note, hero, gallery jsonb, sort_order, timestamps), `services` (id varchar(64) pk, title, description, long_description, image, why_best jsonb, icon, sort_order, timestamps). Schemas in `lib/db/src/schema/`; push with `pnpm --filter @workspace/db run push`.
- **mockup-sandbox**: Canvas component preview server (unused).

## Sigma Admin / Inline CMS

Lightweight admin layer that lets a logged-in user inline-edit most visible site copy.

- **Files**: `src/admin/AdminContext.tsx` (provider, login/logout, edits map persisted to `localStorage`), `src/admin/EditableText.tsx` (`contentEditable` wrapper with dashed primary outline in edit mode), `src/admin/AdminLoginDialog.tsx` (password modal with Close button), `src/admin/AdminBar.tsx` (fixed bottom pill with Edit/Preview toggle, Reset with confirm dialog and edit-count badge, Logout). Wired in `src/App.tsx` (provider + global bar) and `src/components/Header.tsx` (nav button).
- **Login**: Click `Admin` in the header → enter password `123095` → admin bar appears. Auth is server-side via the signed `sigma_admin` cookie set by `POST /api/admin/login`; on mount AdminContext checks `GET /api/admin/me`. Edits are stored in Postgres (`site_content` table) and fetched from `GET /api/content` on every page load, so changes are visible to **all visitors on all devices**. `setValue` PUTs to `/api/content/:key` (fire-and-forget) and Reset calls `DELETE /api/content`. A `localStorage["sigma_admin_edits_cache"]` cache is kept only as a fallback if the API is briefly unreachable on initial load — it is not the source of truth.
- **EditableText keys** are namespaced: `hero.eyebrow`, `hero.tagline.{i}.{title|sub}`, `stats.{i}.{value|label}`, `vmg.{vision|mission|goal}.{label|text}`, `services.section.{title|subtitle}`, `service.{id}.{title|description}`, `cta.{title|description|primaryCta|secondaryCta}`, `location.{title|description|addressLabel|phoneLabel|emailLabel}`, `contact.{address|phone|email}`, `contact.form.{title|description}`, `footer.about`, `about.who.{eyebrow|title|body1|body2}`, `about.badge.{value|label}`, `about.why.{title|subtitle}`, `about.why.item.{idx}`, and per-page `pageHeader` overrides via `PageHeader` `keyPrefix` prop (`page.{home|about|services|projects|contact}.{title|description|eyebrow}`).
- **Hero rotation** is paused while `editMode` is true so admins can edit a stable slide.
- To make new text editable: wrap it in `<EditableText keyName="..." defaultText="..." multiline?={true} as?="span|h1|..." />` and pick a stable, unique key.
