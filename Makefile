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

# We need to load nvm for ssh remote execution.
# @see https://stackoverflow.com/questions/33357227/bash-doesnt-load-node-on-remote-ssh-command.
staging_deploy:
	ssh -p $(REMOTE_PORT) -t $(REMOTE_USER)@$(REMOTE_HOST) 'source ~/.nvm/nvm.sh && \
	cd $(REMOTE_APP_PATH) && \
	git pull && \
	npm install && \
	npm run build:patched &&\
	make start'

start:
	DATABASE_URL=$(DATABASE_URL) \
	SESSION_SECRET=$(SESSION_SECRET) \
	MYFB_ENDPOINT=$(MYFB_ENDPOINT) \
	pm2 start ecosystem.config.js --env production
