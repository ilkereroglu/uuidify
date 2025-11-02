FROM golang:1.22 AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o uuidify ./cmd/server

FROM gcr.io/distroless/base-debian12
COPY --from=build /app/uuidify /uuidify
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/uuidify"]
