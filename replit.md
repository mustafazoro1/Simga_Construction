# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **sigma-contractors** (`/`): React + Vite construction company website for Sigma Contractors & Engineering Works (Pvt) Ltd. Brand modeled on real Sigma site (logo, projects, content). Bright sand/warm off-white theme with rust/terracotta accent — explicitly no blue. Pages: Home (hero with rotating taglines, marquee, stats, vision/mission/goal, services, featured projects, location map, CTA), About, Services, Projects (filterable + modal detail view), Contact (react-hook-form + zod, posts to `/api/contact` via generated `useSubmitContactForm` hook). Footer uses styled `Σ SIGMA` text mark (the bundled logo PNG isn't transparent so image-based filters render as a white blob). Stack: wouter, framer-motion, lucide-react, shadcn/ui, react-hook-form, zod, sonner, @tanstack/react-query, @workspace/api-client-react.
- **api-server** (`/api`): Express 5 backend. Uses `cookie-parser` (signed with `SESSION_SECRET`) and `cors({ origin: true, credentials: true })`. Routes: `GET /api/healthz`; `POST /api/contact` (validates with generated `SubmitContactFormBody` zod schema, inserts into `contact_submissions`); admin auth — `POST /api/admin/login` (body `{ password }`, sets signed httpOnly cookie `sigma_admin`, 30d), `POST /api/admin/logout`, `GET /api/admin/me`; site content CMS — `GET /api/content` (public, returns `{ key: value }` map), `PUT /api/content/:key` (admin, body `{ value }`), `DELETE /api/content/:key` (admin), `DELETE /api/content` (admin reset all); image uploads — `POST /api/admin/upload` (admin, body `{ filename, dataUrl }`, saves to `uploads/`, max 12 MB) served via `GET /api/uploads/:name`; **projects CRUD** — `GET /api/projects` (public, auto-seeds 9 real projects on first call), `POST/PUT/DELETE /api/projects[/:id]` (admin); **services CRUD** — `GET /api/services` (public, auto-seeds 6 services on first call), `POST/PUT/DELETE /api/services[/:id]` (admin). Admin password defaults to `123095`, override via env `SIGMA_ADMIN_PASSWORD`. Validation is inline (no zod imports — esbuild bundle for api-server can't resolve `zod/v4`).
- **Database** (Replit PostgreSQL): tables `contact_submissions`, `site_content`, `projects` (id varchar(64) pk, title, category, status, employer, original_contract_value, subcontracting_amount, awarded, completed, scope_note, hero, gallery jsonb, sort_order, timestamps), `services` (id varchar(64) pk, title, description, long_description, image, why_best jsonb, icon, sort_order, timestamps). Schemas in `lib/db/src/schema/`; push with `pnpm --filter @workspace/db run push`.
- **mockup-sandbox**: Canvas component preview server (unused).

## Sigma Admin / Inline CMS

Lightweight admin layer that lets a logged-in user inline-edit most visible site copy.

- **Files**: `src/admin/AdminContext.tsx` (provider, login/logout, edits map persisted to `localStorage`), `src/admin/EditableText.tsx` (`contentEditable` wrapper with dashed primary outline in edit mode), `src/admin/AdminLoginDialog.tsx` (password modal with Close button), `src/admin/AdminBar.tsx` (fixed bottom pill with Edit/Preview toggle, Reset with confirm dialog and edit-count badge, Logout). Wired in `src/App.tsx` (provider + global bar) and `src/components/Header.tsx` (nav button).
- **Login**: Click `Admin` in the header → enter password `123095` → admin bar appears. Auth is server-side via the signed `sigma_admin` cookie set by `POST /api/admin/login`; on mount AdminContext checks `GET /api/admin/me`. Edits are stored in Postgres (`site_content` table) and fetched from `GET /api/content` on every page load, so changes are visible to **all visitors on all devices**. `setValue` PUTs to `/api/content/:key` (fire-and-forget) and Reset calls `DELETE /api/content`. A `localStorage["sigma_admin_edits_cache"]` cache is kept only as a fallback if the API is briefly unreachable on initial load — it is not the source of truth.
- **EditableText keys** are namespaced: `hero.eyebrow`, `hero.tagline.{i}.{title|sub}`, `stats.{i}.{value|label}`, `vmg.{vision|mission|goal}.{label|text}`, `services.section.{title|subtitle}`, `service.{id}.{title|description}`, `cta.{title|description|primaryCta|secondaryCta}`, `location.{title|description|addressLabel|phoneLabel|emailLabel}`, `contact.{address|phone|email}`, `contact.form.{title|description}`, `footer.about`, `about.who.{eyebrow|title|body1|body2}`, `about.badge.{value|label}`, `about.why.{title|subtitle}`, `about.why.item.{idx}`, and per-page `pageHeader` overrides via `PageHeader` `keyPrefix` prop (`page.{home|about|services|projects|contact}.{title|description|eyebrow}`).
- **Hero rotation** is paused while `editMode` is true so admins can edit a stable slide.
- To make new text editable: wrap it in `<EditableText keyName="..." defaultText="..." multiline?={true} as?="span|h1|..." />` and pick a stable, unique key.
