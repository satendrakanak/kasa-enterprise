#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env.docker ]; then
  cp .env.docker.example .env.docker
  echo "Created .env.docker from .env.docker.example"
else
  echo ".env.docker already exists"
fi

echo "Starting Kasa Enterprise development stack..."
docker compose --env-file .env.docker up --build -d

echo ""
echo "Kasa Enterprise development stack is running."
echo "Open the installer and complete setup:"
echo "  http://localhost:3000/install"
echo ""
echo "Useful URLs:"
echo "  App:     http://localhost:3000"
echo "  API:     http://localhost:8000"
echo "  Swagger: http://localhost:8000/api"
echo ""
echo "Logs:"
echo "  make dev-logs"
