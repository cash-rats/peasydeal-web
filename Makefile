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

# REMOTE_PORT=22
# REMOTE_APP_PATH=/home/flybuddy/peasydeal_web

# List of servers to deploy. Notice that these are the
# host names on the ssh config.
# STAGING_SERVER                  = staging_peasydeal_gcp
# PROD_SERVER                     = new_prod_peasydeal_gcp

# deploy/staging:
# 	make build && \
# 	rsync -Pavz -e 'ssh -i $(HOME)/.ssh/peasydealkey_gcp' build public $(SERVER_USER)@$(STAGING_SERVER):/home/flybuddy/peasydeal_web/ && \
# 	ssh -p $(REMOTE_PORT) -t $(SERVER_USER)@$(STAGING_SERVER) 'source ~/.nvm/nvm.sh && \
# 	cd $(REMOTE_APP_PATH) && \
# 	git reset --hard HEAD && \
# 	git pull https://$(GITHUB_USERNAME):$(GITHUB_ACCESS_TOKEN)@github.com/$(GITHUB_USERNAME)/peasydeal_web staging:staging && \
# 	git checkout staging && \
# 	npm install && \
# 	make start_staging'

# deploy/prod:
# 	ssh $(SERVER_SSH_NAME) \
# 	'/usr/local/bin/login_to_ecr.sh && \
# 	mkdir -p /home/peasydeal/peasydeal_web && \
# 	cd /home/peasydeal/peasydeal_web && \
# 	docker ps -aqf "name=peasydeal_web" | xargs -r docker stop && \
# 	docker ps -aqf "name=peasydeal_web" | xargs -r docker rm -f && \
# 	docker pull 920786632098.dkr.ecr.ap-southeast-1.amazonaws.com/peasydeal_web:latest && \
# 	docker run \
# 	--restart always \
# 	-d \
# 	-p 3000:3001 \
# 	-v /home/peasydeal/peasydeal_web/peasydeal-master-key.json:/myapp/peasydeal-master-key.json \
# 	--network="host" \
# 	--env-file /home/peasydeal/peasydeal_web/.env \
# 	--name peasydeal_web \
# 	920786632098.dkr.ecr.ap-southeast-1.amazonaws.com/peasydeal_web:latest && \
# 	docker image prune -f'

# deploy/all: build upload_staging upload_prod

# build/image:
# 	docker build --platform linux/amd64 \
# 	--no-cache \
# 	-f $(CURRENT_DIR)/Dockerfile \
# 	-t peasydeal/web:latest . && \
# 	docker tag peasydeal/web:latest 920786632098.dkr.ecr.ap-southeast-1.amazonaws.com/peasydeal_web:latest

# push/image: build_image
# 	./scripts/ecr-push.sh peasydeal_web

# start_local:
# 	pm2 stop ecosystem.config.js --env local && pm2 start ecosystem.config.js --env local

# start_staging:
# 	pm2 stop ecosystem.config.js --env staging && pm2 start ecosystem.config.js --env staging

# start_prod:
# 	pm2 stop ecosystem.config.js --env production && pm2 start ecosystem.config.js --env production

# .PHONY: build
