
build-tgbot:
	docker build -t tgbot .

run-tgbot:
	docker run -d -p 3000:3000 --name tgbot --rm tgbot

# Сборка и запуск energyUpdate
build-energy-update:
	docker build -t energy-update-bot .

run-energy-update:
	docker run -d -p 3000:3000 --name energy-update-bot --rm energy-update-bot
