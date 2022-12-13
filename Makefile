CURRENT_DIR = $(shell pwd)

# Export variable in .app.env.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

NPM_PATH := $(shell which npm)

REMOTE_PORT=22
REMOTE_APP_PATH=/home/flybuddy/peasydeal_web

# npm run build:patched && \
# rsync -Pavz -e 'ssh -i $(HOME)/.ssh/peasydealkey_gcp' build/* $(SERVER_USER)@staging_peasydeal_gcp:/home/flybuddy/peasydeal_web

deploy_staging: build
	ssh -p $(REMOTE_PORT) -t $(SERVER_USER)@$(SERVER_HOST) 'source ~/.nvm/nvm.sh && \
	cd $(REMOTE_APP_PATH) && \
	git reset --hard HEAD && \
	git pull https://$(GITHUB_USERNAME):$(GITHUB_ACCESS_TOKEN)@github.com/$(GITHUB_USERNAME)/peasydeal_web && \
	npm install && \
	npm run build:patched && \
	make start_staging'

build:
	npm run build:patched

start_staging:
	pm2 stop ecosystem.config.js --env staging && pm2 start ecosystem.config.js --env staging
