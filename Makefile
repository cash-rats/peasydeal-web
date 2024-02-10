CURRENT_DIR = $(shell pwd)

# Export variable in .env.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

NPM_PATH := $(shell which npm)

REMOTE_PORT=22
REMOTE_APP_PATH=/home/flybuddy/peasydeal_web

# List of servers to deploy. Notice that these are the
# host names on the ssh config.
STAGING_SERVER                  = staging_peasydeal_gcp
PROD_SERVER                     = new_prod_peasydeal_gcp

deploy_staging:
	make build && \
	rsync -Pavz -e 'ssh -i $(HOME)/.ssh/peasydealkey_gcp' build public $(SERVER_USER)@$(STAGING_SERVER):/home/flybuddy/peasydeal_web/ && \
	ssh -p $(REMOTE_PORT) -t $(SERVER_USER)@$(STAGING_SERVER) 'source ~/.nvm/nvm.sh && \
	cd $(REMOTE_APP_PATH) && \
	git reset --hard HEAD && \
	git pull https://$(GITHUB_USERNAME):$(GITHUB_ACCESS_TOKEN)@github.com/$(GITHUB_USERNAME)/peasydeal_web staging:staging && \
	git checkout staging && \
	npm install && \
	make start_staging'

deploy_prod:
	make build && \
	rsync -Pavz -e 'ssh -i $(HOME)/.ssh/peasydealkey_gcp' build public $(SERVER_USER)@$(PROD_SERVER):/home/flybuddy/peasydeal_web && \
	ssh -p $(REMOTE_PORT) -t $(SERVER_USER)@$(PROD_SERVER) 'source ~/.nvm/nvm.sh && \
	cd $(REMOTE_APP_PATH) && \
	git reset --hard HEAD && \
	git pull https://$(GITHUB_USERNAME):$(GITHUB_ACCESS_TOKEN)@github.com/$(GITHUB_USERNAME)/peasydeal_web main:main && \
	git checkout main && \
	npm install && \
	make start_prod'

deploy_all: build upload_staging upload_prod

push_image: build_image
	docker push asia-east1-docker.pkg.dev/stable-analogy-288013/peasydeal/web:latest

build_image:
	docker build --platform linux/amd64 \
	--no-cache \
	-f $(CURRENT_DIR)/Dockerfile \
	-t peasydeal/web:latest . && \
	docker tag myiws/alpha-hfun_web:latest asia-east1-docker.pkg.dev/stable-analogy-288013/peasydeal/web:latest

start_local:
	pm2 stop ecosystem.config.js --env local && pm2 start ecosystem.config.js --env local

start_staging:
	pm2 stop ecosystem.config.js --env staging && pm2 start ecosystem.config.js --env staging

start_prod:
	pm2 stop ecosystem.config.js --env production && pm2 start ecosystem.config.js --env production

.PHONY: build
