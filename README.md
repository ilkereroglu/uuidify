# 🌀 uuidify

A blazing-fast public **UUID Generator API** built with **Go** ---
deployed globally via **Cloudflare Workers**.

Generate unique identifiers instantly --- anywhere, anytime. ⚡

[![Go](https://img.shields.io/badge/Go-1.22-blue?logo=go)](https://go.dev/)
[![License:
MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange?logo=cloudflare)](https://api.uuidify.io)
[![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)](https://hub.docker.com/)

------------------------------------------------------------------------

## ⚡ Quick Start

``` bash
curl https://api.uuidify.io
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
```

------------------------------------------------------------------------

## 🔧 Parameters

  Param     Type     Default   Description
  --------- -------- --------- ---------------------------------------
  version   string   v4        UUID version (v1, v4, or v7)
  count     int      1         Number of UUIDs to generate (1--1000)
  format    string   json      Response format: json or text

------------------------------------------------------------------------

## 🧠 Examples

``` bash
curl "https://api.uuidify.io?version=v1"
curl "https://api.uuidify.io?version=v7&count=5"
curl "https://api.uuidify.io?format=text"
```

------------------------------------------------------------------------

## 🧩 Local Development

``` bash
make dev
# Visit → http://localhost:8080
```

------------------------------------------------------------------------

## 🐳 Docker

``` bash
docker build -t uuidify:latest .
docker run -p 8080:8080 uuidify:latest
```

------------------------------------------------------------------------

## ⚙️ Makefile Commands

  Command       Description
  ------------- ---------------------
  make dev      Run locally with Go
  make build    Build the binary
  make docker   Build Docker image
  make lint     Run static analysis
  make test     Run all tests

------------------------------------------------------------------------

## 🚀 Deployment

Deployed via **Cloudflare Workers** with automatic builds from **GitHub
→ main branch**.

-   Worker: [`uuidify`](https://uuidify.uuidify.workers.dev)
-   Custom Domain: [`api.uuidify.io`](https://api.uuidify.io)
-   Zone: `uuidify.io`
-   Environment variable: `GO_API_URL=https://api.uuidify.io`

------------------------------------------------------------------------

## 🧭 Roadmap

-   [x] Deploy via Cloudflare Workers (api.uuidify.io)
-   [ ] Add public uptime dashboard
-   [ ] Publish SDKs (Go, Node.js, Python)
-   [ ] Generate OpenAPI Spec + Postman Collection

------------------------------------------------------------------------

## 🧰 Contributing

We welcome PRs! ❤️

Follow [Conventional Commits](https://www.conventionalcommits.org/) and
open an issue first for new features.

------------------------------------------------------------------------

## 📝 License

MIT © 2025 [İlker Eroğlu](https://github.com/ilkereroglu)
