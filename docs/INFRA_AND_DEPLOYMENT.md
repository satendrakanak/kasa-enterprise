# CodeWithKasa Docker, Infra, and CI/CD Guide

This project has three runtime parts:

- `client`: Next.js app, exposed on port `3000`.
- `server`: NestJS API, exposed on port `8000`.
- Data services: PostgreSQL for persistent data and Redis for queues/cache.

## Recommended Environments

Development should run everything locally through Docker Compose:

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

Open:

- Client: http://localhost:3000
- API: http://localhost:8000
- Swagger: http://localhost:8000/api

Production should run app containers on your server and PostgreSQL on a managed database provider when possible.

Good managed PostgreSQL options:

- AWS RDS
- DigitalOcean Managed PostgreSQL
- Supabase
- Neon
- Render PostgreSQL

For serious production, managed PostgreSQL is better than running Postgres in the same Docker Compose stack because backups, point-in-time recovery, upgrades, monitoring, storage failure handling, and high availability are handled outside your app server. A local Docker Postgres container is fine for development and small test/staging servers, but it is not the best long-term production choice.

Redis can start inside Docker for a normal VPS deployment. Move Redis to managed Redis later if queue volume, uptime, or horizontal scaling grows.

## File Map

- `docker-compose.yml`: local development stack with hot reload.
- `docker-compose.prod.yml`: production stack using prebuilt images.
- `client/Dockerfile`: multi-stage Next.js Dockerfile with `development` and `production` targets.
- `server/Dockerfile`: multi-stage NestJS Dockerfile with `development` and `production` targets.
- `.env.docker.example`: local Docker development env template.
- `.env.production.example`: production server env template.
- `.github/workflows/ci.yml`: lint, test, build, and Docker image build verification.
- `.github/workflows/deploy.yml`: builds images, pushes to GHCR, and deploys over SSH.

## Local Development

1. Create local env:

```bash
cp .env.docker.example .env.docker
```

2. Start all services:

```bash
docker compose --env-file .env.docker up --build
```

3. Stop services:

```bash
docker compose down
```

4. Reset local database:

```bash
docker compose down -v
docker compose --env-file .env.docker up --build
```

The development compose file mounts `./client` and `./server` into containers, so code changes hot reload without rebuilding images.

## Production Deployment Flow

The intended production flow is:

1. Developer pushes to `main`.
2. GitHub Actions runs CI.
3. Deploy workflow builds Docker images.
4. Images are pushed to GitHub Container Registry.
5. Workflow SSHs into the server.
6. Server pulls the new images.
7. `docker compose -f docker-compose.prod.yml up -d --remove-orphans` restarts the app.

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

- Prefer managed PostgreSQL.
- Keep `DATABASE_SYNC=false`.
- Use migrations before production launch. TypeORM `synchronize` can change schemas automatically and should not be used for production data.
- Enable automated backups and test restore once.
- Keep database credentials only in `.env.production` or your cloud secret manager.

## Useful Commands

Build production images locally:

```bash
docker build --target production -t codewithkasa-server ./server
docker build --target production -t codewithkasa-client ./client \
  --build-arg NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
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
