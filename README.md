# MATA Admin UI (`MATA-ADMIN-UI`)

Web **admin dashboard** for MATA Shop: products, categories, orders, customers, and store settings. It authenticates against the **MATA-API** Spring Boot service (JWT) via **NextAuth** (credentials provider + session callbacks).

**Related repositories**

| Project | Role |
|--------|------|
| [MATA-API](../MATA-API) | REST API, JWT, PostgreSQL |
| [MATA_APP](../MATA_APP) | Customer mobile app (Flutter) |
| [MATA_UI](../MATA_UI) | Planned public web storefront; not in this repo yet |

---

## Features

- **Sign-in** — Email/password through NextAuth; backend `POST /api/v1/auth/login`; JWT access (and refresh) stored in the session for API calls.
- **Dashboard** — Revenue, active orders, customers, conversion rate, sales chart, recent orders (`/api/v1/admin/dashboard`).
- **Products** — List, create, edit, delete; category picker loads live category names from the API.
- **Categories** — Full CRUD (`/api/v1/categories`); product categories must exist in this list for catalog consistency.
- **Orders** — List all orders, view details, update status (admin); status controls sized to avoid truncated labels.
- **Customers** — List, create, edit, delete; avatars support **network URLs** (e.g. Google profile photos), not only initials.
- **Settings** — Store name, currency, tax rate, shipping fee, support email.

Protected routes under `/admin` require a session; unauthenticated users are redirected to `/login` (see **Route protection**).

---

## Tech stack

| Area | Stack |
|------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Base UI, Motion, Lucide |
| Auth | NextAuth 4 (Credentials + JWT session) |
| Charts | Recharts |
| Validation | Zod 4 |
| Fonts | Geist, Geist Mono (`next/font`) |

---

## Prerequisites

- **Node.js** 20+
- **MATA-API** running (default `http://localhost:8087`) with CORS allowing your dev origin if you call the API directly from the browser.

---

## Environment variables

Create **`.env.local`** in the project root:

```env
# Backend (server-side auth + Next.js rewrites)
MATA_API_URL=http://localhost:8087
NEXT_PUBLIC_API_URL=http://localhost:8087

# NextAuth — required for production sessions
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<at-least-32-chars>
```

Generate a secret, for example:

```bash
openssl rand -base64 32
```

| Variable | Purpose |
|----------|---------|
| `MATA_API_URL` | Backend base URL for server-side requests and rewrites (default `http://localhost:8087`). |
| `NEXT_PUBLIC_API_URL` | Optional; if set, browser may call the API directly; otherwise use same-origin `/api/backend/...` rewrites. |
| `NEXTAUTH_URL` | Canonical app URL (e.g. `https://admin.example.com` in production). |
| `NEXTAUTH_SECRET` | Cookie signing; set in production. |

Server-side parsing: `getServerEnv()` / `parseServerEnv()` in `lib/env.ts`.

---

## Getting started

```bash
cd MATA-ADMIN-UI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at `/login` using an **ADMIN** user from the API seed (see MATA-API `data.sql` / docs), then use `/admin`.

**Production build**

```bash
npm run build
npm start
```

---

## API integration

- **Base path:** All REST resources live under **`/api/v1/...`** on the Java service.
- **Rewrites:** `next.config.ts` maps **`/api/backend/:path*`** → **`${MATA_API_URL}/api/v1/:path*`** so the browser can use same-origin URLs and avoid CORS during local dev.
- **Client:** `lib/api/client.ts` — `apiRequest`, `apiData`, `getApiPath`; pass `token` from the NextAuth session for admin mutations.
- **Auth:** `lib/auth.ts` — credentials validated by the backend; tokens and user embedded in JWT/session.

---

## Project structure

```
├── app/
│   ├── admin/                 # Dashboard, products, categories, orders, customers, settings
│   ├── api/auth/[...nextauth]/
│   ├── login/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/                 # Sidebar, dashboard, modals, tables
│   └── ui/
├── lib/
│   ├── api/                   # Client, types, mappers
│   ├── validations/           # Zod schemas
│   ├── auth.ts
│   └── env.ts
├── hooks/
├── proxy.ts                   # Route protection for /admin
└── next.config.ts             # Rewrites to backend
```

---

## Route protection

`proxy.ts` handles protection for `/admin` (this project uses the Next “proxy” convention instead of a root `middleware.ts` file). Ensure it stays aligned with your Next.js version’s expectations.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000). |
| `npm run build` | Production build. |
| `npm start` | Start production server. |
| `npm run lint` | ESLint. |

---

## Troubleshooting

- **401/403 on admin API calls** — Session missing or access token expired; sign out and sign in again. Confirm `MATA_API_URL` matches the running API.
- **CORS** — Prefer **`/api/backend/...`** in the browser so requests stay same-origin to Next.js.
- **Categories vs products** — Creating a product requires a category name that exists in **Categories** admin (validated by the API).

---

## License

Private — MATA project.
