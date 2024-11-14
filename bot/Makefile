build:
	docker build -t tgbot .
run:
	docker run -d -p 3000:3000 --name tgbot --rm tgbot
# Makefile для energyUpdate

build-energy:
    docker build -t energy-update .

run-energy:
    docker run -p 3000:3000 --env-file .env energy-update
