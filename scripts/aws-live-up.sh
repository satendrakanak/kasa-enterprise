#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
AWS_DIR="$ROOT_DIR/deploy/aws"
ENV_FILE="$AWS_DIR/.env.production"

if [ ! -f "$ENV_FILE" ]; then
  cp "$AWS_DIR/.env.production.example" "$ENV_FILE"
  echo "Created $ENV_FILE"
  echo "Edit it with your production domains and secrets, then run this command again."
  exit 1
fi

cd "$AWS_DIR"

docker compose \
  --env-file "$ENV_FILE" \
  -f docker-compose.enterprise.yml \
  up --build -d

echo ""
echo "Kasa Enterprise live stack is starting."
echo "Check status:"
echo "  cd $AWS_DIR"
echo "  docker compose --env-file .env.production -f docker-compose.enterprise.yml ps"
