APP=uuidify
PORT=8080

.PHONY: all dev build docker lint test clean

all: build

dev:
	go run ./cmd/server

build:
	go build -o bin/$(APP) ./cmd/server

docker:
	docker build -t $(APP):latest .

lint:
	go fmt ./...
	go vet ./...

test:
	go test ./... -v

clean:
	rm -rf bin
