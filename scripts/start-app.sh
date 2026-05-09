#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env.production.local ]; then
  echo ".env.production.local not found."
  echo "Run first-time setup with: kasa install app"
  exit 1
fi

echo "Starting Kasa Enterprise production test stack..."
docker compose --env-file .env.production.local -f docker-compose.prod.yml up -d

echo ""
echo "Kasa Enterprise production test stack is running."
echo "App:       http://localhost:3000"
echo "Installer: http://localhost:3000/install"
echo "API:       http://localhost:8000"
