#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env.docker ] && [ -f .env.docker.example ]; then
  cp .env.docker.example .env.docker
fi

if [ ! -f .env.production.local ] && [ -f .env.production.local.example ]; then
  cp .env.production.local.example .env.production.local
fi

echo "Stopping Kasa Enterprise Docker stacks..."

docker compose --env-file .env.docker down --remove-orphans
docker compose --env-file .env.production.local -f docker-compose.prod.yml down --remove-orphans

echo ""
echo "Kasa Enterprise stacks are stopped."
echo "Ports should now be free for a fresh dev or production test run."
