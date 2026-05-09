#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Stopping Kasa Enterprise Docker stacks..."

./scripts/stop-dev.sh
./scripts/stop-app.sh

echo ""
echo "Kasa Enterprise stacks are stopped."
echo "Ports should now be free for a fresh dev or production test run."
