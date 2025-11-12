# UUIDify Deployment Checklist

Use this checklist before/after each production deployment to confirm the platform is healthy across Workers + Pages.

## 1. DNS & TLS
- [ ] `api.uuidify.io`, `dashboard.uuidify.io`, `docs.uuidify.io`, `status.uuidify.io` all resolve via `dig`/`nslookup`.
- [ ] Cloudflare proxy (“orange cloud”) enabled for each CNAME.
- [ ] SSL/TLS mode set to **Full (strict)** under `uuidify.io` → SSL/TLS → Overview.

## 2. Worker & Bindings
- [ ] `wrangler deploy` completes with `account_id=6740062b250900222185a7f9305d6e86`.
- [ ] `wrangler tail` shows no runtime errors after deploy.
- [ ] Confirm bindings in Dashboard → Workers → uuidify:
  - `LOG_BUCKET` (R2) attached.
  - `UUIDIFY_ANALYTICS` dataset present.
  - Env vars `GO_API_URL`, `BUILD_VERSION`, `GIT_COMMIT`.
- [ ] Scheduled trigger (`*/5 * * * *`) listed under “Triggers”.

## 3. Cloudflare Pages
- [ ] Each project (`uuidify-dashboard`, `uuidify-docs`, `uuidify-status`) is linked to `ilkereroglu/uuidify` → branch `main`.
- [ ] Production domains mapped & validated (Pages → Custom Domains).
- [ ] Latest GitHub Actions run (Deploy UUIDify Platform) finished green.
- [ ] Cache Reserve enabled for the `uuidify.io` zone (Dashboard → Caching → Cache Reserve).

## 4. Health & Latency
- [ ] API health JSON responds within 50 ms:
  ```bash
  curl -sS -w "Latency: %{time_total}s\n" "https://api.uuidify.io/health?format=json"
  ```
- [ ] Metrics endpoint returns recent stats:
  ```bash
  curl -sS "https://api.uuidify.io/metrics" | jq '.requestsPerMinute'
  ```
- [ ] Status history endpoint includes fresh cron entries:
  ```bash
  curl -sS "https://api.uuidify.io/uptime?limit=5" | jq '.entries[].checkedAt'
  ```
- [ ] Dashboard/Docs/Status all load over HTTPS and theme toggle + refresh button behave as expected.

## 5. Docker Image (optional delivery target)
- [ ] Build succeeds locally:
  ```bash
  docker build -t uuidify:latest .
  docker run --rm -p 8080:8080 uuidify:latest
  ```
- [ ] Smoke test container: `curl http://localhost:8080/`.

## 6. Manual Rollback Plan
- [ ] Previous Worker deployment id recorded (`wrangler deploy --dry-run` lists active tags).
- [ ] Pages keeps last production deployments visible under Deployments → select “Rollback” if needed.
