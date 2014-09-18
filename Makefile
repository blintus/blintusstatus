runserver:
	foreman start

install_dependencies:
	pip install -r requirements.txt --allow-all-external

makemigrations:
	foreman run python manage.py makemigrations

migrate_database: makemigrations
	foreman run python manage.py migrate
