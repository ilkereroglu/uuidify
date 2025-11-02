# 🏗️ Stage 1 — Builder
FROM golang:1.24-alpine AS builder

# Go mod cache layer (faster rebuilds)
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# Copy rest of the source
COPY . .

# Build binary statically
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /uuidify ./cmd/server

# 🧊 Stage 2 — Runtime (Distroless base)
FROM gcr.io/distroless/static-debian12:nonroot

# Copy built binary
COPY --from=builder /uuidify /uuidify

# Network config
EXPOSE 8080

# Run as nonroot (secure by default)
USER nonroot:nonroot
ENTRYPOINT ["/uuidify"]
