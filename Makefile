CURRENT_DIR = $(shell pwd)

# Export variable in .app.env.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

NPM_PATH := $(shell which npm)

start:
	DATABASE_URL=$(DATABASE_URL) \
	SESSION_SECRET=$(SESSION_SECRET) \
	$(NPM_PATH) start
