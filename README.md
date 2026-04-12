# MATA Admin UI

Admin dashboard for the MATA Shop store. Built with Next.js 16, React 19, and NextAuth, with a Spring Boot backend API.

## Features

- **Authentication** — Credential login via NextAuth; JWT session with access/refresh tokens from the backend.
- **Dashboard** — Revenue, active orders, customers, conversion rate, sales chart, and recent orders.
- **Products** — List, create, edit, and delete products with validation (Zod).
- **Orders** — List orders and update order status.
- **Customers** — List registered customers.
- **Settings** — Store name, currency, tax rate, shipping fee, and support email.

Protected routes under `/admin` redirect to `/login` when there is no session (handled via `proxy.ts`).

## Tech Stack

| Area        | Stack |
|------------|--------|
| Framework  | Next.js 16 (App Router) |
| UI         | React 19, Tailwind CSS 4, Base UI, Motion, Lucide icons |
| Auth       | NextAuth (Credentials + JWT) |
| Charts     | Recharts |
| Validation | Zod 4 |
| Fonts      | Geist, Geist Mono (next/font) |

## Prerequisites

- **Node.js** 20+
- **Backend** — MATA Spring Boot API running (default `http://localhost:8087`). Auth, products, orders, customers, dashboard, and settings endpoints are expected under `/api/v1/`.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root (see [Environment variables](#environment-variables) for all options):

```env
# Backend API (used for rewrites and server-side auth)
MATA_API_URL=http://localhost:8087
NEXT_PUBLIC_API_URL=http://localhost:8087

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-at-least-32-chars
```

Generate a secure `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the login page at `/login`; after sign-in you’ll be redirected to `/admin`.

### 4. Production build

```bash
npm run build
npm start
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MATA_API_URL` | No (default: `http://localhost:8087`) | Backend API base URL for server-side requests (auth, rewrites). |
| `NEXT_PUBLIC_API_URL` | No | Backend URL used in the browser when set; otherwise app uses same-origin rewrites. |
| `NEXTAUTH_URL` | No (default: `http://localhost:3000`) | Canonical URL of the app (e.g. `https://admin.example.com` in production). |
| `NEXTAUTH_SECRET` | Yes (production) | Secret for signing cookies; use a long random string. |

Server-side env can be validated with `getServerEnv()` / `parseServerEnv()` from `@/lib/env`.

## Project structure

```
├── app/
│   ├── admin/              # Protected admin pages (layout + sidebar)
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Product list + CRUD
│   │   ├── orders/         # Order list + status
│   │   ├── customers/      # Customer list
│   │   └── settings/       # Store settings
│   ├── api/auth/[...nextauth]/  # NextAuth API route
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout (fonts, SessionProvider, AppStateProvider)
│   └── page.tsx            # Landing/home
├── components/
│   ├── admin/              # Admin-specific (sidebar, dashboard, modals, etc.)
│   ├── ui/                 # Reusable UI (button, dialog, table, select, etc.)
│   └── providers/          # SessionProvider
├── lib/
│   ├── api/                # API client, types, mappers (products, orders, dashboard, etc.)
│   ├── validations/        # Zod schemas (login, product)
│   ├── auth.ts             # NextAuth config (Credentials, JWT/session callbacks)
│   └── env.ts              # Server env validation
├── hooks/                  # e.g. useAdminSession
├── types/                  # Shared TS types
├── proxy.ts                # Route protection for /admin (redirect to /login when unauthenticated)
└── next.config.ts          # Rewrites: /api/backend/* → backend /api/v1/*
```

## API integration

- **Backend base:** Configured via `MATA_API_URL` / `NEXT_PUBLIC_API_URL` (default `http://localhost:8087`).
- **Rewrites:** `next.config.ts` rewrites `/api/backend/:path*` to `${backend}/api/v1/:path*`, so the app can call `/api/backend/...` and avoid CORS when not using `NEXT_PUBLIC_API_URL`.
- **Client:** `lib/api/client.ts` exposes `apiRequest`, `apiData`, and `getApiPath`; auth uses the session’s `accessToken` via the `token` option.
- **Auth:** Login is sent to the backend at `/api/v1/auth/login`; the returned tokens and user are stored in the NextAuth JWT/session.

Route protection for `/admin` is implemented in `proxy.ts` (use this instead of a standalone `middleware.ts` per project conventions).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (default port 3000). |
| `npm run build` | Production build. |
| `npm start` | Run production server. |
| `npm run lint` | Run ESLint. |

## License

Private — MATA project.
