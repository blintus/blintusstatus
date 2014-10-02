SHELL := /bin/bash

runserver:
	foreman run python manage.py runserver

run_heroku_server:
	foreman start

install_dependencies:
	pip install -r requirements.txt

makemigrations:
	foreman run python manage.py makemigrations

migrate_database: makemigrations
	foreman run python manage.py migrate

test:
	@foreman run python manage.py validate
	@jshint status/assets/js/{pages,shared}

view_yuidocs:
	@DOC_PATH=$$(pwd)/yuidoc/index.html; \
	if type xdg-open >/dev/null 2>&1; then \
		xdg-open "$$DOC_PATH" >/dev/null 2>&1; \
	else \
		open "$$DOC_PATH" >/dev/null 2>&1; \
	fi
