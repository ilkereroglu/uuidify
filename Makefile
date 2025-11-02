APP=uuidify

dev:
	go run ./cmd/server

build:
	go build -o bin/$(APP) ./cmd/server

docker-build:
	docker build -t $(APP):latest .
