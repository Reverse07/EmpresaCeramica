# ────────────────────────────────────────────────────────────────────────────
# Makefile — atajos para operaciones Docker de EmpresaCeramica
# Uso: make <objetivo>
# ────────────────────────────────────────────────────────────────────────────

.PHONY: help build up down logs shell ps clean

## Muestra esta ayuda
help:
	@echo ""
	@echo "  Objetivos disponibles:"
	@grep -E '^## ' Makefile | sed 's/## /    /'
	@echo ""

## Construye la imagen de la aplicación
build:
	docker compose build --no-cache

## Levanta todos los servicios en segundo plano
up:
	docker compose up -d

## Detiene y elimina los contenedores (conserva volúmenes)
down:
	docker compose down

## Muestra los logs en tiempo real
logs:
	docker compose logs -f app

## Abre una shell dentro del contenedor de la aplicación
shell:
	docker compose exec app sh

## Lista los contenedores en ejecución
ps:
	docker compose ps

## Elimina contenedores, redes y volúmenes (limpieza total)
clean:
	docker compose down -v --remove-orphans
