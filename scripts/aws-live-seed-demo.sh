#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
AWS_DIR="$ROOT_DIR/deploy/aws"
ENV_FILE="$AWS_DIR/.env.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  echo "Create it from deploy/aws/.env.production.example first."
  exit 1
fi

cd "$AWS_DIR"

docker compose \
  --env-file "$ENV_FILE" \
  -f docker-compose.enterprise.yml \
  exec -T server \
  sh -lc "MARKETPLACE_DEMO_RESET_CONFIRM=RESET_DEMO_DATABASE node dist/database/seed-marketplace-demo-reset.js"
