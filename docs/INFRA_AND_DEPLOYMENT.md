# CodeWithKasa Docker, Infra, and CI/CD Guide

This project has three runtime parts:

- `client`: Next.js app, exposed on port `3000`.
- `server`: NestJS API, exposed on port `8000`.
- Data services: PostgreSQL for persistent data and Redis for queues/cache.

The production server image installs Chromium because certificate PDF generation
uses Puppeteer. Keep `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium` in the
server Dockerfile/runtime path.

The client ships Inter as a local font at `client/app/fonts/InterVariable.woff2`.
Do not switch back to `next/font/google` for production because Docker/CI builds
should not depend on fetching Google Fonts during build.

## Recommended Environments

Development should run everything locally through Docker Compose:

```bash
./scripts/register-kasa-command.sh
kasa install dev
```

Open:

- Client: http://localhost:3000
- API: http://localhost:8000
- Swagger: http://localhost:8000/api

Production can run fully through Docker Compose using `docker-compose.prod.yml`.
For a first launch, the bundled Postgres container is acceptable if backups are
configured. For a larger production setup, move PostgreSQL to a managed
database provider.

Good managed PostgreSQL options later:

- AWS RDS
- DigitalOcean Managed PostgreSQL
- Supabase
- Neon
- Render PostgreSQL

Managed PostgreSQL is better long term because backups, point-in-time recovery,
upgrades, monitoring, storage failure handling, and high availability are handled
outside your app server.

Redis starts inside Docker for a normal VPS deployment. Move Redis to managed
Redis later if queue volume, uptime, or horizontal scaling grows.

## File Map

- `docker-compose.yml`: local development stack with hot reload.
- `docker-compose.prod.yml`: production stack. Locally it can build production images; on the server it runs GHCR images.
- `client/Dockerfile`: multi-stage Next.js Dockerfile with `development` and `production` targets.
- `server/Dockerfile`: multi-stage NestJS Dockerfile with `development` and `production` targets.
- `.env.docker.example`: local Docker development env template.
- `.env.production.local.example`: local production Docker test env template.
- `.env.production.example`: production server env template.
- `.github/workflows/ci.yml`: lint, test, build, and Docker image build verification.
- `.github/workflows/deploy.yml`: builds images, pushes to GHCR, and deploys over SSH.

## Local Development

1. Create local env:

```bash
kasa install dev
```

2. Start all services:

```bash
make dev
```

3. Stop services:

```bash
kasa stop
```

4. Reset local database:

```bash
kasa install dev -r
```

The development compose file mounts `./client` and `./server` into containers, so code changes hot reload without rebuilding images.

## Local Production Test

Use this when development is complete and you want to test the built production
containers on your machine before pushing code.

1. Stop development containers:

```bash
make dev-down
```

2. Create the local production env once:

```bash
kasa install app
```

## Installer Database Modes

The installer supports two database modes:

1. **Bundled Docker database**
   - Uses the Postgres service from Docker Compose.
   - Best for local development, demos, and quick trials.
   - Reset with:

```bash
kasa install dev -r
```

2. **External PostgreSQL**
   - Use this for local Postgres, a private database server, or Amazon RDS.
   - Create the empty database before running installation.
   - Enter the connection details in the installer and click **Test and save database**.
   - Restart the app containers so the API boots from that database:

```bash
kasa restart dev
```

For local production testing:

```bash
kasa restart app
```

The runtime database selection is stored in `.kasa/database.json`. Keep this file out of Git.

3. Build and start production containers locally:

```bash
make prod
```

4. Stop local production containers:

```bash
kasa stop
```

This runs the same production Docker targets used by deployment, but with local
URLs. The local production env can point `POSTGRES_VOLUME_NAME` at the
development Postgres volume and set `POSTGRES_VOLUME_EXTERNAL=true`, so you
test the production build against the same local data after stopping
development containers. Do not use `down -v` unless you want to delete the local
database volume.

## Production Deployment Flow

The intended flow is intentionally simple:

1. Develop locally with `docker-compose.yml`.
2. Before deployment, run local build checks.
3. Push code and merge into `master` or `main`.
4. GitHub Actions verifies client and server.
5. If checks pass, Docker images are built and pushed to GHCR.
6. GitHub Actions SSHs into the server.
7. The server pulls the new images and restarts with `docker-compose.prod.yml`.

## Local Build Check Before Deploy

Before pushing, run the production builds locally if you do not want to start the
Docker production stack:

```bash
cd server
npm run build

cd ../client
npm run build
```

When you want the closest real check, prefer:

```bash
make prod
```

After this, push your branch and merge into `master` or `main`. Deployment is
handled by GitHub Actions.

## First-Time Server Setup

On the production server:

```bash
mkdir -p /opt/codewithkasa
cd /opt/codewithkasa
```

Copy these files to that folder:

- `docker-compose.prod.yml`
- `.env.production`

Create `.env.production` from `.env.production.example` and fill real values.

Install Docker and the Docker Compose plugin on the server. Then test:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## GitHub Secrets

Add these repository secrets in GitHub:

- `DEPLOY_HOST`: server IP or hostname.
- `DEPLOY_USER`: SSH username.
- `DEPLOY_SSH_KEY`: private SSH key allowed to deploy.
- `DEPLOY_PORT`: SSH port, usually `22`.
- `DEPLOY_PATH`: server path, for example `/opt/codewithkasa`.
- `NEXT_PUBLIC_APP_URL`: public frontend URL, for example `https://codewithkasa.com`.

Your server-side secrets live in `/opt/codewithkasa/.env.production`, not in GitHub Actions.

## Reverse Proxy

In production, place Nginx, Caddy, Traefik, or a cloud load balancer in front of containers.

Recommended routing:

- `https://your-domain.com` -> client container port `3000`
- `https://api.your-domain.com` -> server container port `8000`

The current Next.js setup can also proxy `/api/*` from the client container to the server container through `NEXT_PUBLIC_API_BASE_URL=http://server:8000`.

## Database Rules

Development:

- Use Docker Postgres from `docker-compose.yml`.
- `DATABASE_SYNC=true` is acceptable while building quickly.

Production:

- Keep `DATABASE_SYNC=false`.
- Use migrations or a reviewed SQL schema deployment before production launch. TypeORM `synchronize` can change schemas automatically and should not be used for production data.
- If using bundled Docker Postgres, back up the `postgres_data` volume before deployments that change entities/schema.
- If using managed PostgreSQL, enable automated daily backups and test restore once before launch.
- Keep at least one recent manual backup before running any seed or data migration.
- Never run the development demo seed on production.
- Use the production seed only for required master data:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec server npm run seed:production
```

- Production seed includes roles, permissions, default role assignment, locations, and email templates. It does not create demo courses or demo exams.
- Keep database credentials only in `.env.production` or your cloud secret manager.

## Moving Data To Production

Use this order for a first launch:

1. Create the production database.
2. Restore a reviewed staging/local dump if you already have real course data.
3. Set `DATABASE_SYNC=false`.
4. Start the server once and verify it connects.
5. Run `npm run seed:production` inside the server container for required master data.
6. Upload media assets through the app or sync S3 separately.
7. Configure site settings, SMTP, payment gateway, BBB, VAPID, and storage from the admin dashboard.
8. Create one test purchase/class/exam/certificate flow before opening to users.

For PostgreSQL dump/restore:

```bash
pg_dump "$LOCAL_DATABASE_URL" --format=custom --no-owner --no-acl > codewithkasa.dump
pg_restore --clean --if-exists --no-owner --no-acl --dbname "$PRODUCTION_DATABASE_URL" codewithkasa.dump
```

Do not copy development payment gateway keys, test users, or demo course data into production unless you intentionally want them.

## Useful Commands

Start development:

```bash
make dev
```

Start local production test:

```bash
make prod
```

View logs:

```bash
docker compose --env-file .env.docker logs -f server
docker compose --env-file .env.docker logs -f client
```

Run server seed in development:

```bash
docker compose --env-file .env.docker exec server npm run seed
```

Run safe production seed:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec server npm run seed:production
```
