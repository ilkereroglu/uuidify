# 🚀 Quick Start Guide

## 📋 Testing

### 1. Go Backend Testing

```bash
# 1. Run tests
make test

# 2. Start backend
make dev

# 3. Test in another terminal
curl http://localhost:8080/
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
curl "http://localhost:8080/?version=v7&count=3"
# → {"uuids":["01234567-89ab-7def-0123-456789abcdef", ...]}
curl http://localhost:8080/health
# → ok
```

### 2. Cloudflare Worker Testing (Local)

```bash
# 1. Wrangler login (first time)
wrangler login

# 2. Start worker locally
make worker-dev
# or
cd workers && wrangler dev

# 3. Test in another terminal
curl http://localhost:8787/
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
curl "http://localhost:8787/?version=v7&count=3"
# → {"uuids":["01234567-89ab-7def-0123-456789abcdef", ...]}
curl http://localhost:8787/health
# → UUIDify Worker running ✅
```

---

## 🚀 Deploy to Cloudflare

### Step 1: Preparation

```bash
# 1. Wrangler login (if you haven't)
wrangler login

# 2. Check R2 bucket
wrangler r2 bucket list

# 3. Create bucket if it doesn't exist
wrangler r2 bucket create uuidify-logs-wnam
```

### Step 2: Local Testing

```bash
# Test worker locally
make worker-dev

# Test endpoints
curl http://localhost:8787/
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
curl "http://localhost:8787/?version=v1&count=5"
# → {"uuids":["6ba7b810-9dad-11d1-80b4-00c04fd430c8", ...]}
curl http://localhost:8787/health
# → UUIDify Worker running ✅
```

### Step 3: Deploy

```bash
# Deploy to production
make worker-deploy

# or
cd workers && wrangler deploy
```

### Step 4: Test

```bash
# Test production URL
curl https://api.uuidify.io
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
curl "https://api.uuidify.io?version=v7&count=3"
# → {"uuids":["01234567-89ab-7def-0123-456789abcdef", ...]}

# Worker.dev URL
curl https://uuidify.uuidify.workers.dev
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}
```

---

## 🔍 Troubleshooting

### Wrangler Not Found

```bash
# Install Wrangler
npm install -g wrangler
```

### R2 Bucket Error

```bash
# Create bucket
wrangler r2 bucket create uuidify-logs-wnam

# Check bucket list
wrangler r2 bucket list
```

### Deployment Error

```bash
# Check logs
wrangler tail

# Check Wrangler version
wrangler --version
```

---

## 📝 Notes

- Make sure your Cloudflare account's Workers plan is active on first deployment
- R2 buckets may incur additional charges (limits exist in free tier)
- Make sure DNS settings are correct for custom domain (api.uuidify.io)

---

For detailed information, see [TESTING.md](./TESTING.md).
