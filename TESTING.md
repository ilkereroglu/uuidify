# 🧪 Testing and Deployment Guide

## 📋 Table of Contents
1. [Local Testing](#local-testing)
2. [Cloudflare Worker Testing](#cloudflare-worker-testing)
3. [Cloudflare Deployment](#cloudflare-deployment)

---

## 🏠 Local Testing

### 1. Go Backend Testing

#### Run tests:
```bash
# Run all tests
make test

# With coverage report
make test-coverage

# Lint check only
make lint
```

#### Run backend locally:
```bash
# Run in development mode
make dev

# Or directly
go run ./cmd/server
```

The server will run on `http://localhost:8080`.

#### Manual Testing:
```bash
# Single UUID (JSON) - Go backend uses root endpoint
curl http://localhost:8080/
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# Single UUID (v1)
curl "http://localhost:8080/?version=v1"
# → {"uuid":"6ba7b810-9dad-11d1-80b4-00c04fd430c8"}

# Multiple UUIDs (v7)
curl "http://localhost:8080/?version=v7&count=5"
# → {"uuids":["01234567-89ab-7def-0123-456789abcdef", ...]}

# Text format
curl "http://localhost:8080/?format=text&count=3"
# → 550e8400-e29b-41d4-a716-446655440000
# → 6ba7b810-9dad-11d1-80b4-00c04fd430c8
# → 01234567-89ab-7def-0123-456789abcdef

# Health check
curl http://localhost:8080/health
# → ok
```

### 2. Docker Testing

```bash
# Build Docker image
make docker

# Run Docker container
docker run -p 8080:8080 uuidify:latest

# Test
curl http://localhost:8080/
```

---

## ☁️ Cloudflare Worker Testing

### 1. Wrangler Installation (If Needed)

```bash
# Install Wrangler globally
npm install -g wrangler

# Or with npm
npm install wrangler --save-dev
```

### 2. Wrangler Login

```bash
# Login to your Cloudflare account
wrangler login
```

This command will open your browser and ask you to log in to your Cloudflare account.

### 3. R2 Bucket Check

Make sure your R2 bucket exists:

```bash
# List R2 buckets
wrangler r2 bucket list

# Create bucket if it doesn't exist
wrangler r2 bucket create uuidify-logs-wnam
```

### 4. Analytics Engine Check

Make sure your Analytics Engine dataset exists. You can create it from the Cloudflare Dashboard or it can be automatically created from wrangler.toml.

### 5. Local Worker Testing

```bash
# Run worker locally
make worker-dev

# Or directly
cd workers && wrangler dev
```

While the worker is running locally, you can test it:

```bash
# UUID generate (root endpoint)
curl http://localhost:8787/
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# Generate with parameters
curl "http://localhost:8787/?version=v4&count=3"
# → {"uuids":["550e8400-e29b-41d4-a716-446655440000", ...]}

# Health check
curl http://localhost:8787/health
# → UUIDify Worker running ✅

# UUID with R2 logging
curl http://localhost:8787/uuid
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# List UUIDs from R2
curl http://localhost:8787/list
# → {"uuids":["...", ...]}
```

---

## 🚀 Cloudflare Deployment

### 1. Preparation

#### Wrangler.toml Check

Check your `wrangler.toml` file:

```toml
name = "uuidify"
main = "workers/main.js"
compatibility_date = "2025-11-02"
workers_dev = false
compatibility_flags = ["nodejs_compat"]

# Route bindings (for production)
routes = [
  { pattern = "api.uuidify.io/*", zone_name = "uuidify.io" }
]

[vars]
GO_API_URL = "https://api.uuidify.io"
BUILD_VERSION = "dev"
GIT_COMMIT = "local"

# Analytics Engine
[[analytics_engine_datasets]]
binding = "UUIDIFY_ANALYTICS"
dataset = "uuidify_logs"

# R2 Bucket
[[r2_buckets]]
binding = "LOG_BUCKET"
bucket_name = "uuidify-logs-wnam"
```

#### Environment Variables (If Needed)

If you want to use environment variables:

```bash
# Add secret
wrangler secret put SECRET_NAME

# Or add to wrangler.toml
[vars]
MY_VAR = "value"
```

### 2. Deployment Process

#### Production Deployment

```bash
# Deploy worker
make worker-deploy

# Or directly
cd workers && wrangler deploy
```

#### Preview Deployment (For Testing)

```bash
# Deploy to preview environment
cd workers && wrangler deploy --env preview
```

### 3. Post-Deployment Checks

#### Test Endpoints

```bash
# Generate UUID (root endpoint)
curl https://api.uuidify.io
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# Generate with parameters
curl "https://api.uuidify.io?version=v7&count=5"
# → {"uuids":["01234567-89ab-7def-0123-456789abcdef", ...]}

# Generate UUID v1
curl "https://api.uuidify.io?version=v1"
# → {"uuid":"6ba7b810-9dad-11d1-80b4-00c04fd430c8"}

# Generate in text format
curl "https://api.uuidify.io?format=text&count=3"
# → 550e8400-e29b-41d4-a716-446655440000
# → 6ba7b810-9dad-11d1-80b4-00c04fd430c8
# → 01234567-89ab-7def-0123-456789abcdef

# Health check endpoint
curl https://api.uuidify.io/health
# → UUIDify Worker running ✅

# UUID with R2 logging
curl "https://api.uuidify.io/uuid?version=v1"
# → {"uuid":"6ba7b810-9dad-11d1-80b4-00c04fd430c8"}

# Or worker.dev URL
curl https://uuidify.uuidify.workers.dev
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
```

#### Log Check

```bash
# View worker logs
wrangler tail

# For specific worker
wrangler tail uuidify
```

#### R2 Bucket Check

```bash
# List R2 bucket contents
wrangler r2 object list uuidify-logs-wnam

# Download specific object
wrangler r2 object get uuidify-logs-wnam uuid-1234567890.json
```

### 4. Troubleshooting

#### If You Get Deployment Error

1. **Check Wrangler version:**
   ```bash
   wrangler --version
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   # Node.js 18+ is required
   ```

3. **Check dependencies:**
   ```bash
   cd workers
   npm install  # If package.json exists
   ```

4. **Check syntax:**
   ```bash
   # Check worker code
   node workers/src/index.js
   ```

#### R2 Bucket Error

If you get R2 bucket error:

1. Make sure the bucket exists
2. Check that the bucket binding is correct
3. Check the bucket from Cloudflare Dashboard

#### Analytics Engine Error

If you get Analytics Engine error:

1. Make sure the dataset exists
2. Check that the binding is correct
3. Check Analytics Engine from Cloudflare Dashboard

---

## 📊 Monitoring

### Cloudflare Dashboard

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages
2. Select `uuidify` worker
3. View Metrics, Logs, and Analytics

### Analytics Engine Query

To query data from Analytics Engine:

```bash
# Query with Wrangler (if supported)
wrangler analytics query
```

Or use Analytics Engine from Cloudflare Dashboard.

---

## 🔄 CI/CD (Optional)

### GitHub Actions

You can create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g wrangler
      - run: wrangler deploy
        working-directory: ./workers
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 📝 Notes

- Make sure your Cloudflare account's Workers plan is active on first deployment
- R2 buckets may incur additional charges (limits exist in free tier)
- Analytics Engine may also incur charges
- Make sure DNS settings are correct for custom domain (api.uuidify.io)

---

## 🆘 Help

If you encounter issues:
1. Use `wrangler --help` command
2. Check [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/) documentation
3. Check worker logs: `wrangler tail`
