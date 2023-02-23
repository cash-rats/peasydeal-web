CURRENT_DIR = $(shell pwd)

# Export variable in .env.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

NPM_PATH := $(shell which npm)

REMOTE_PORT=22
REMOTE_APP_PATH=/home/flybuddy/peasydeal_web

# List of servers to deploy.
STAGING_SERVER                  = staging_peasydeal_gcp
PROD_SERVER                     = prod_peasydeal_gcp

deploy_staging:
	ssh -p $(REMOTE_PORT) -t $(SERVER_USER)@$(STAGING_SERVER) 'source ~/.nvm/nvm.sh && \
	cd $(REMOTE_APP_PATH) && \
	git reset --hard HEAD && \
	git pull https://$(GITHUB_USERNAME):$(GITHUB_ACCESS_TOKEN)@github.com/$(GITHUB_USERNAME)/peasydeal_web && \
	npm install && \
	npm run build:patched && \
	make start_staging'

deploy_prod:
	ssh -p $(REMOTE_PORT) -t $(SERVER_USER)@$(PROD_SERVER) 'source ~/.nvm/nvm.sh && \
	cd $(REMOTE_APP_PATH) && \
	git reset --hard HEAD && \
	git pull https://$(GITHUB_USERNAME):$(GITHUB_ACCESS_TOKEN)@github.com/$(GITHUB_USERNAME)/peasydeal_web && \
	npm install && \
	npm run build:patched && \
	make start_prod'


deploy_all: build upload_staging upload_prod

build:
	npm run build:patched

start_local:
	pm2 stop ecosystem.config.js --env local && pm2 start ecosystem.config.js --env local

start_staging:
	pm2 stop ecosystem.config.js --env staging && pm2 start ecosystem.config.js --env staging

start_prod:
	pm2 stop ecosystem.config.js --env production && pm2 start ecosystem.config.js --env production

.PHONY: build
