# Stage 1: Build
FROM golang:1.22 AS build

LABEL maintainer="İlker Eroğlu <ilkereroglu@gmail.com>" \
      org.opencontainers.image.source="https://github.com/ilkereroglu/uuidify" \
      org.opencontainers.image.description="A simple public UUID generator API built in Go"

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o uuidify ./cmd/server

# Stage 2: Runtime
FROM gcr.io/distroless/base-debian12

COPY --from=build /app/uuidify /uuidify
EXPOSE 8080

USER nonroot:nonroot
ENTRYPOINT ["/uuidify"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://localhost:8080/health || exit 1
