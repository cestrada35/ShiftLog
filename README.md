# ShiftLog

A volunteer timekeeping app that replaces pen-and-paper logs with something both volunteers and admins actually want to use.

**[Try the live demo →](https://shiftlog.dev/kiosk)**

<!-- screenshot: kiosk-check-in -->
<!-- ![Kiosk check-in](docs/screenshots/kiosk-check-in.png) -->

---

## What it is

Volunteers show up on-site, tap in a PIN, pick a project, and check in. That's the whole interaction i.e. no account creation, no forms, no training required. Admins get a dashboard that shows who's working, where the hours are going, and what needs attention this week.

The original tool was a paper sheet and a spreadsheet. This is the redesign.

Two personas drive every decision:

- **The Volunteer** — arrives, needs a 10-second check-in, no friction, no confusion.
- **The Admin** — needs a bird's-eye view of the operation: who's on shift, what's active, and where the hours are landing.

## Screenshots

<!-- screenshot: kiosk-identified -->
<!-- ![Volunteer identified](docs/screenshots/kiosk-identified.png) -->

<!-- screenshot: admin-dashboard -->
<!-- ![Admin dashboard](docs/screenshots/admin-dashboard.png) -->

<!-- screenshot: admin-volunteers -->
<!-- ![Volunteer management](docs/screenshots/admin-volunteers.png) -->

---

## Stack

**Frontend**
- Vue 3 + Nuxt 4 (SPA mode)
- TypeScript, strict
- PrimeVue 4 with a custom Aura-based theme
- Pinia for cross-page state
- MSW (Mock Service Worker) for dev and test fixtures
- Vitest + Vue Test Utils for unit and component tests
- Playwright for end-to-end tests

**Backend**
- Django 6.1 + Django REST Framework
- PostgreSQL 16 (prod), SQLite (local)
- Gunicorn in production
- Layered architecture enforced by `import-linter`

**Infrastructure**
- Docker + Docker Compose
- Nginx as reverse proxy and static file server
- GitHub Actions for CI/CD
- Deployed to a self-hosted KVM

---

## Architecture highlights

This is a small app that uses more structure than strictly necessary. That was my deliberate goal as it's a learning project as much as a working tool.

### Layered backend

```
interfaces/     # DRF views, serializers, urls, queries
infrastructure/ # Django ORM, adapters
domain/         # pure Python, no Django imports
```

The `domain/` layer has zero Django imports. It's enforced in CI by `import-linter`, which fails the build if anyone tries to sneak an ORM call into business logic.

The value: **domain tests run in 0.1 seconds without a database.** Fifteen tests covering shift rules, PIN authentication, and volunteer creation run in the time it takes to load a webpage.

### Read models vs. commands

Commands live in `domain/` and go through repository ports. Queries live in `interfaces/http/queries/` and are allowed to import Django directly. The distinction: if it can't fail a business rule, it's a query. No ceremony required. (See ADR 0004.)

### Contract-first frontend

The OpenAPI spec at `packages/contracts/openapi.yaml` is the source. TypeScript types are generated from it, and CI fails if the generated types drift from the spec. This way the frontend has never had a runtime contract mismatch.

### Frontend layering

- **Composables** hold state machines (`useKioskSession`, `useAutoReset`)
- **Pinia stores** hold state that outlives a page (`adminSession`)
- **Presentational components** take props and emit events; they know nothing about the API
- **API adapters** (`lib/api/`) translate HTTP into typed promises

---

## Running locally

Two terminals. Requires Node 22+, Python 3.12+, and a running Postgres or SQLite fallback.

**Backend**

```bash
cd apps/api
conda create -n shiftlog-api python=3.12
conda activate shiftlog-api
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

**Frontend**

```bash
cd apps/web
npm install
npm run dev
```

Then open `http://localhost:3000/kiosk` (PIN `1234`) or `http://localhost:3000/admin` (any seeded admin UUID from the backend seed output).

The frontend runs against MSW mocks by default. To hit the real backend:

```bash
NUXT_PUBLIC_USE_MOCKS=false npm run dev
```

## Running with Docker

The full stack — Postgres, Django, Nginx — runs with one command.

```bash
cp .env.example .env   # then edit with real secrets
docker run --rm httpd:alpine htpasswd -nbB demo your-password > docker/web/.htpasswd
docker compose up --build
```

Open `http://localhost/kiosk` and `http://localhost/admin`.

## Testing

```bash
# Backend
cd apps/api
pytest                  # ~25 tests, 0.5s
ruff check .            # lint
lint-imports            # architecture guardrails

# Frontend
cd apps/web
npm test                # ~50 Vitest tests
npm run typecheck
npx playwright test     # E2E, requires a running stack
```

The domain tests run in **0.1 seconds** because they don't touch the database. Everything else is layered on top of that.

---

## Deployment

Push to `main` and the pipeline handles the rest:

1. Lint, typecheck, and test both apps
2. Build and push Docker images to GHCR
3. SSH to the KVM, pull, and restart the stack
4. Healthcheck the live URL
5. Run Playwright against the production deployment

The E2E step runs *after* deploy, not before. The deployed artifact is real goal, and testing it in a real browser against real HTTPS catches things a locally booted stack can't. (See ADR 0005 when it's written.)

---

## Project structure

```
ShiftLog/
├── apps/
│   ├── api/                    # Django project
│   │   ├── config/             # settings, urls, wsgi
│   │   ├── domain/             # pure Python, no Django
│   │   ├── infrastructure/     # ORM models, adapters
│   │   ├── interfaces/         # DRF views, serializers, queries
│   │   └── tests/              # domain / integration / api
│   └── web/                    # Nuxt project
│       ├── app/
│       │   ├── components/     # kiosk / admin / shared
│       │   ├── composables/    # state machines
│       │   ├── layouts/        # default, kiosk, admin
│       │   ├── lib/api/        # typed API adapters
│       │   ├── mocks/          # MSW handlers and fixtures
│       │   ├── pages/
│       │   ├── plugins/
│       │   └── stores/
│       └── tests/              # unit / component / e2e
├── packages/contracts/         # openapi.yaml + generated types
├── docker/                     # Dockerfiles, nginx.conf
├── docs/adr/                   # architecture decision records
└── docker-compose.yml
```

---

## Architecture decisions

- **ADR 0001** — Layered architecture and repository structure
- **ADR 0002** — Admin identity stubbed via header (demo scope)
- **ADR 0003** — Password credential is forward-looking
- **ADR 0004** — Read models live outside the domain layer

Each one explains the *why*, not just the *what* — including what we deliberately chose not to build.

---

## Known limitations

This is a demo, and some things are honest about it:

- **Admin auth is stubbed.** Admin identity is a header (`X-Admin-Id`). Nginx basic auth is the perimeter. There is no password check on the admin sign-in flow. Documented in ADR 0002.
- **Volunteer passwords exist but aren't consumed.** They're generated and stored, waiting for a "volunteer remote portal" feature that hasn't been built. Documented in ADR 0003.
- **No scheduling.** The kiosk handles check-in and check-out. Scheduled shifts, shift swaps, and time-off requests are out of scope.
- **HTTPS is via host Nginx.** The Docker Nginx serves HTTP behind a host reverse proxy. The container-level SSL setup is a future improvement.

---

## About

Built by [Christian Estrada](https://github.com/cestrada35) as a portfolio project and a deep dive into clean architecture, testing at multiple layers, and shipping with a real CI/CD pipeline.

Feedback, questions, or bug reports are welcome.