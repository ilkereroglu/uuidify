# UUIDify Dashboard

Modern analytics and monitoring surface for `dashboard.uuidify.io`. The site is built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS + shadcn/ui**, and deploys to **Cloudflare Pages** for globally-distributed rendering.

![UUIDify dashboard preview](./public/logo.svg)

## Features

- Cloudflare Pages Functions proxy `/api/health` + `/api/metrics` to the core API
- Auto-refresh controls, manual refresh button, and health snapshot cards
- Recharts visualizations for uptime trend + request volume
- Dark, responsive UI inspired by the Vercel dashboard aesthetic
- Cloudflare Pages configuration via `wrangler.toml` + GitHub Actions workflow

## Local Development

```bash
# install dependencies
npm install

# run Next.js locally (falls back to direct API calls)
npm run dev

# optional: test the fully static + functions stack
wrangler pages dev ./out
```

Copy `.env.example` → `.env.local` to override defaults:

```
API_BASE_URL=https://api.uuidify.io
DEFAULT_REFRESH_INTERVAL=30000
NEXT_PUBLIC_API_BASE_URL=https://api.uuidify.io
```

## Building & Deploying

```bash
# generate static export into ./out (Next.js output=export)
npm run build

# optional: manual deploy to Cloudflare Pages (needs CF creds)
wrangler pages deploy ./out
```

GitHub Actions (`.github/workflows/dashboard-pages.yml`) automatically builds and deploys `dashboard/` to the `uuidify-dashboard` Pages project whenever `main` is updated. Set these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Tech Stack

- Next.js 15 (App Router, Edge runtime)
- React 19, TypeScript 5
- Tailwind CSS 3.x, tailwindcss-animate, shadcn/ui primitives
- Recharts for visualizations
- Cloudflare Pages + Wrangler
- Cloudflare Pages + Wrangler + Functions for edge fetching
