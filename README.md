# ENDFCOP (Ethiopian National Defence Forces Common Operational Picture)

This monorepo contains the backend API and frontend web for ENDFCOP.

## Requirements
- Node.js 20+
- npm 9+
- Docker (optional but recommended for Postgres & proxy)

## Bootstrap
- Copy `.env.example` to `.env` and adjust secrets
- Install deps: `npm install`
- Build: `npm run build`

## Running locally
- Start API: `npm run -w @endfcop/api dev`
- Start Web: `npm run -w @endfcop/web dev`

API runs on `http://localhost:4000`, Web on `http://localhost:3000`.

## Database
- For development tests, the API tests use SQLite automatically.
- For local Postgres:
  - Start DB only: `docker compose up -d db`
  - Set `DATABASE_URL` in `.env`
  - Apply schema: `npm run -w @endfcop/api prisma:migrate`
  - Seed: `npm run -w @endfcop/api prisma:seed`

## Docker (full stack)
- `docker compose up -d --build`
- Access web via `http://localhost:3000` (nginx proxy)

## Testing
- Backend tests: `npm run -w @endfcop/api test`
- Web E2E: `npx playwright test` from `apps/web`

## Observability
- Health: GET `http://localhost:4000/health`
- Metrics: GET `http://localhost:4000/metrics` (Prometheus format)
- Swagger: `http://localhost:4000/docs`

## Security
- JWT-based auth
- Helmet, CORS, and rate limiting enabled

## Notes
- WebSockets available at `/ws` (proxied to API)