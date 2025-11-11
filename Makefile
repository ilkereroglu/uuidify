APP=uuidify
PORT=8080
VERSION?=dev
BUILD_TIME=$(shell date -u '+%Y-%m-%d_%H:%M:%S')

.PHONY: all dev build run docker lint test test-coverage clean help worker-dev worker-deploy

all: build

help:
	@echo "Available targets:"
	@echo "  dev            - Run locally with Go"
	@echo "  build          - Build the binary"
	@echo "  run            - Run the built binary"
	@echo "  docker         - Build Docker image"
	@echo "  lint           - Run static analysis"
	@echo "  test           - Run all tests"
	@echo "  test-health    - Run health endpoint checks (local + prod)"
	@echo "  test-coverage  - Run tests with coverage report"
	@echo "  clean          - Clean build artifacts"
	@echo "  worker-dev     - Run Cloudflare Worker locally"
	@echo "  worker-deploy  - Deploy Cloudflare Worker"

dev:
	go run ./cmd/server

build:
	@mkdir -p bin
	go build -o bin/$(APP) ./cmd/server

run: build
	./bin/$(APP)

docker:
	docker build \
		--build-arg VERSION=$(VERSION) \
		--build-arg BUILD_TIME=$(BUILD_TIME) \
		-t $(APP):$(VERSION) \
		-t $(APP):latest \
		.

lint:
	go fmt ./...
	go vet ./...
	@if command -v staticcheck > /dev/null; then \
		staticcheck ./...; \
	else \
		echo "staticcheck not installed, skipping..."; \
	fi

test:
	go test ./... -v

test-health:
	curl -fsS http://localhost:8080/health
	curl -fsS "http://localhost:8080/health?format=json"
	curl -fsS https://api.uuidify.io/health
	curl -fsS "https://api.uuidify.io/health?format=json"

test-coverage:
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

clean:
	rm -rf bin coverage.out coverage.html

# Cloudflare Worker commands
worker-dev:
	cd workers && wrangler dev

worker-deploy:
	cd workers && wrangler deploy
