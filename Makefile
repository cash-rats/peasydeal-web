CURRENT_DIR = $(shell pwd)

# Export variable in .app.env.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

NPM_PATH := $(shell which npm)

REMOTE_USER=bryan
REMOTE_HOST=211.23.181.44
REMOTE_PORT=3333
REMOTE_APP_PATH=/home/bryan/peasydeal_web
REMOTE_BUILD_PATH=$(REMOTE_APP_PATH)/build

# Build product script
# rsync to remote server
# pm2 start remove server
build:
	npm run build:patched
staging_upload: build
	scp -P $(REMOTE_PORT) -r $(CURRENT_DIR)/build $(REMOTE_USER)@$(REMOTE_HOST):$(REMOTE_APP_PATH)

staging_deploy:
	ssh -t $(REMOTE_USER)@$(REMOTE_HOST) 'cd $(REMOTE_APP_PATH) && \
	git pull && \
	npm install && \
	npm run build:patched &&\
	make start'


start:
	DATABASE_URL=$(DATABASE_URL) \
	SESSION_SECRET=$(SESSION_SECRET) \
	pm2 start ecosystem.config.js --env production
