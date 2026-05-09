.PHONY: dev dev-down prod prod-down prod-logs dev-logs

dev:
	docker compose --env-file .env.docker up --build

dev-down:
	docker compose --env-file .env.docker down

dev-logs:
	docker compose --env-file .env.docker logs -f

prod:
	docker compose --env-file .env.production.local -f docker-compose.prod.yml up --build

prod-down:
	docker compose --env-file .env.production.local -f docker-compose.prod.yml down

prod-logs:
	docker compose --env-file .env.production.local -f docker-compose.prod.yml logs -f
