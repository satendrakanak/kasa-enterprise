#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

had_env=false
if [ ! -f .env.docker ]; then
  cp .env.docker.example .env.docker
  echo "Created .env.docker from .env.docker.example"
else
  had_env=true
fi

echo "Stopping development stack and removing bundled Docker data..."
docker compose --env-file .env.docker down -v

if [ "$had_env" = true ]; then
  backup_file=".env.docker.backup-$(date +%Y%m%d%H%M%S)"
  cp .env.docker "$backup_file"
  echo "Backed up existing .env.docker to $backup_file"
fi

cp .env.docker.example .env.docker
echo "Reset .env.docker from .env.docker.example"

rm -f .kasa/database.json

echo ""
echo "Development data has been reset."
echo "Start a fresh install with:"
echo "  kasa install dev"
