CURRENT_DIR = $(shell pwd)

# Export variable in .app.env.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

start:
	DATABASE_URL=$(DATABASE_URL) \
	SESSION_SECRET=$(SESSION_SECRET) \
	npm start
