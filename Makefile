ifneq (,$(wildcard ./.deploy.env))
	include ./.deploy.env
endif

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

# ==================================================================================== #
# Build & Push Docker Images
# ==================================================================================== #
## build/staging: build web image for staging environment
.PHONY: build/staging
build/staging:
	DOCKER_DEFAULT_PLATFORM=linux/amd64 dotenvx run --env-file .env.staging \
	-- \
	docker compose -f docker-compose.staging.yaml build peasydeal-web

## push/staging: push web image for staging environment
.PHONY: push/staging
push/staging:
	docker compose -f docker-compose.staging.yaml push peasydeal-web && \
	docker system prune -a --volumes --force

## build/prod: build web image for prod environment
.PHONY: build/prod
build/prod:
	DOCKER_DEFAULT_PLATFORM=linux/amd64 dotenvx run --env-file .env.prod \
	-- \
	docker compose -f docker-compose.prod.yaml build peasydeal-web

## push/prod: push web image for staging environment
.PHONY: push/prod
push/prod:
	docker compose -f docker-compose.prod.yaml push peasydeal-web && \
	docker system prune -a --volumes --force

# ==================================================================================== #
# Deploy
# ==================================================================================== #
## deploy/staging: deploy web to staging environment
.PHONY: deploy/staging
deploy/staging: deploy/staging/put-dotenv deploy/staging/put-docker-compose
	@ssh -i $(STAGING_SSH_KEY_PATH) -p $(STAGING_PORT) -t $(STAGING_USER)@$(STAGING_HOST) " \
		cd $(STAGING_DIR) && \
		AWS_PROFILE=peasydeal	docker compose -f docker-compose.staging.yaml pull && \
		docker compose -f docker-compose.staging.yaml up -d --no-deps --remove-orphans && \
		docker system prune -a --volumes --force"

## deploy/staging/put-docker-compose: upload docker-compose.staging.yaml to staging environment.
.PHONY: deploy/staging/put-docker-compose
deploy/staging/put-docker-compose:
	@echo "uploading docker-compose.staging.yaml"
	@ssh -i $(STAGING_SSH_KEY_PATH) -p $(STAGING_PORT) $(STAGING_USER)@$(STAGING_HOST) "mkdir -p $(STAGING_DIR)"
	@scp -i $(STAGING_SSH_KEY_PATH) -P $(STAGING_PORT) ./docker-compose.staging.yaml $(STAGING_USER)@$(STAGING_HOST):$(STAGING_DIR)/docker-compose.staging.yaml
	 @echo "docker-compose.staging.yaml uploaded"

## deploy/staging/put-dotenv: upload .env.staging to staging environment.
.PHONY: deploy/staging/put-dotenv
deploy/staging/put-dotenv:
	@echo "uploading .env.staging"
	@ssh -i $(STAGING_SSH_KEY_PATH) -p $(STAGING_PORT) $(STAGING_USER)@$(STAGING_HOST) "mkdir -p $(STAGING_DIR)"
	@scp -i $(STAGING_SSH_KEY_PATH) -P $(STAGING_PORT) ./.env.staging $(STAGING_USER)@$(STAGING_HOST):$(STAGING_DIR)/.env
	@echo ".env.staging uploaded"

## deploy/prod: deploy web to prod environment
.PHONY: deploy/prod
deploy/prod: deploy/prod/put-dotenv deploy/prod/put-docker-compose
	@ssh -i $(PROD_SSH_KEY_PATH) -p $(PROD_PORT) $(PROD_USER)@$(PROD_HOST) " \
		cd $(PROD_DIR) && \
		AWS_PROFILE=peasydeal docker compose -f docker-compose.prod.yaml pull && \
		docker compose -f docker-compose.prod.yaml up -d --no-deps --remove-orphans && \
		docker system prune -a --volumes --force"

## deploy/prod/put-dotenv: upload .env.prod to prod environment.
.PHONY: deploy/prod/put-dotenv
deploy/prod/put-dotenv:
	@echo "uploading .env.prod"
	@ssh -i $(PROD_SSH_KEY_PATH) -p $(PROD_PORT) $(PROD_USER)@$(PROD_HOST) "mkdir -p $(PROD_DIR)"
	@scp -i $(PROD_SSH_KEY_PATH) -P $(PROD_PORT) ./.env.prod $(PROD_USER)@$(PROD_HOST):$(PROD_DIR)/.env
	@echo ".env.prod uploaded"

## deploy/prod/put-docker-compose: upload docker-compose.prod.yaml to prod environment.
.PHONY: deploy/prod/put-docker-compose
deploy/prod/put-docker-compose:
	@echo "uploading docker-compose.prod.yaml"
	@ssh -i $(PROD_SSH_KEY_PATH) -p $(PROD_PORT) $(PROD_USER)@$(PROD_HOST) "mkdir -p $(PROD_DIR)"
	@scp -i $(PROD_SSH_KEY_PATH) -P $(PROD_PORT) ./docker-compose.prod.yaml $(PROD_USER)@$(PROD_HOST):$(PROD_DIR)/docker-compose.prod.yaml
	@echo "docker-compose.prod.yaml uploaded"


# ==================================================================================== #
# Util command
# ==================================================================================== #
## fb_api_port_forwarding: port forwarding to fb api
.PHONY: fb_api_port_forwarding
fb_api_port_forwarding:
	@if lsof -i :8443 >/dev/null; then \
		echo "port is in use"; \
	else \
		ssh -p $(PROD_PORT) -i $(PROD_SSH_KEY_PATH) -L 8443:localhost:8080 $(PROD_USER)@$(PROD_HOST) && \
		echo "port forwarded"; \
	fi
