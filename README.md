<h1 align="center">
  <img src="./docs/assets/uuidify-icon.png" width="64" valign="middle" alt="UUIDify logo" style="vertical-align:middle; margin-right:10px;" />
  UUIDify
</h1>

<p align="center">
  Ultra-fast UUID & ULID generation API — powered by Go and deployed globally on Cloudflare Workers.
</p>

[![Go](https://img.shields.io/badge/Go-1.22-blue?logo=go)](https://go.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange?logo=cloudflare)](https://api.uuidify.io/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)](https://hub.docker.com/)
[![Uptime](https://img.shields.io/badge/Uptime-99.9%25-success)](https://status.uuidify.io)

---

### Live Endpoints

- **Website:** [uuidify.io](https://uuidify.io) — Project Home ([Source](https://github.com/ilkereroglu/uuidify-web))
- **API:** [api.uuidify.io](https://api.uuidify.io) — UUID/ULID generation
- **Dashboard:** [dashboard.uuidify.io](https://dashboard.uuidify.io) — real-time telemetry
- **Status:** [status.uuidify.io](https://status.uuidify.io) — uptime + health snapshots

## Quick Start

```bash
# Default UUID v4
curl https://api.uuidify.io
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# UUID v7 batch
curl "https://api.uuidify.io?version=v7&count=3"
# → {"uuids":["01234567-89ab-7def-0123-456789abcdef", ...]}

# ULID generation (thanks @colbee1 / PR #3)
curl "https://api.uuidify.io?version=ulid&count=2"
# → {"ulids":["01HX7D9PMV4NQVP3J8B1R6R6FZ","01HX7D9PMV4NQVP3J8B1R6R6GA"]}
```

---

## Parameters

| Param       | Type   | Default | Description |
|-------------|--------|---------|-------------|
| `algorithm` | string | `uuid`  | Generator algorithm (`uuid` or `ulid`) |
| `version`   | string | `v4`    | UUID version (`v1`, `v4`, or `v7`) |
| `count`     | int    | `1`     | Number of identifiers to generate (1–1000) |
| `format`    | string | `json`  | Response format: `json` or `text` |

---

## Response Format

- `count = 1` and UUID algorithm ⇒ `{"uuid":"550e..."}`
- `count > 1` and UUID algorithm ⇒ `{"uuids":["550e...","6ba7..."]}`
- `count = 1` and ULID algorithm/version ⇒ `{"ulid":"01HX..."}`
- `count > 1` and ULID algorithm/version ⇒ `{"ulids":["01HX...","01HX..."]}`

> `format=text` still streams newline-delimited identifiers.

---

## Examples

```bash
# Generate a UUID v1 frame
curl "https://api.uuidify.io?version=v1"

# Request newline UUIDs
curl "https://api.uuidify.io?format=text&count=3"

# Stream ULIDs as text
curl "https://api.uuidify.io?version=ulid&format=text&count=2"
```

---

## Monitoring & Observability

- **Live Dashboard:** [dashboard.uuidify.io](https://dashboard.uuidify.io) shows health, latency (~40 ms observed), and throughput over time.
- **Status Page:** [status.uuidify.io](https://status.uuidify.io) exposes cron-backed health pings, keeping publicly verifiable uptime (99.9% target).

Both surfaces pull metrics from the Cloudflare Worker and Go backend, so you can validate deployments in real time.

---

## Local Development

```bash
# Run Go backend
make dev
# Visit → http://localhost:8080

# Test UUID generation
curl http://localhost:8080/
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# Test ULID generation
curl "http://localhost:8080/?version=ulid&count=2"
# → {"ulids":["01K9N48W4SVAN58GRTTVX2FF5J","01K9N48W4SVAN58GRTTX2CZ8N4"]}

# Test worker locally
make worker-dev
# Visit → http://localhost:8787

# Run tests
make test

# Coverage report
make test-coverage

# Run test script
./test.sh
```

For detailed testing and deployment guide, see [TESTING.md](./TESTING.md).

---

## Docker

```bash
docker build -t uuidify:latest .
docker run -p 8080:8080 uuidify:latest
```

---

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make dev` | Run locally with Go |
| `make build` | Build the binary |
| `make docker` | Build Docker image |
| `make lint` | Run static analysis |
| `make test` | Run all tests |

---

## Deployment

### Cloudflare Workers Deploy

```bash
# Wrangler login (first time)
wrangler login

# Test worker locally
make worker-dev

# Deploy to production
make worker-deploy
```

Deployed via **Cloudflare Workers** with automatic builds from **GitHub → main** branch.

- **Worker:** [uuidify](https://uuidify.uuidify.workers.dev/)
- **Custom Domain:** [api.uuidify.io](https://api.uuidify.io/)
- **Zone:** `uuidify.io`

**For detailed deployment guide, see [TESTING.md](./TESTING.md).**

---

## Roadmap

- ✅ Deploy via Cloudflare Workers (`api.uuidify.io`)
- ✅ Add ULID support (PR #3 by [@colbee1](https://github.com/colbee1))
- ✅ Stand up uptime + analytics dashboards (`dashboard.uuidify.io`, `status.uuidify.io`)
- 🔜 Publish SDKs (Go, Node.js, Python)
- 🔜 Generate OpenAPI Spec + Postman Collection

### SDK Rollout

| Language | Repository | Status |
|----------|------------|--------|
| Go       | [`uuidify-go`](https://github.com/ilkereroglu/uuidify-go) | ✅ Released |
| Python   | [`uuidify-python`](https://github.com/ilkereroglu/uuidify-python) | ✅ Released |
| Node.js  | `uuidify-js` (TBD) | 🔜 In development |

---

## Contributing

We welcome PRs! ❤️  
Follow [Conventional Commits](https://www.conventionalcommits.org/) and open an issue first for new features.

---

## License

MIT © 2025 [İlker Eroğlu](https://github.com/ilkereroglu) & contributors.
