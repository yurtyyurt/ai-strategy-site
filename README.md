# AI Market Strategy Dashboard

Next.js portfolio strategy dashboard for AI-focused investments.

## Features

- **7-tab interface**: Universe, Backtests, Scenarios, My Portfolio, Model Portfolios, Exit Rules, 10-Year Forecast
- **localStorage persistence**: Edits save automatically and survive page refresh
- **Live price refresh**: Trading 212, Yahoo Finance, and Finnhub integration
- **Trading 212 sync**: Pull actual shares, cost basis, and prices from your T212 account
- **Cost basis & P/L tracking**: Per-holding purchase price with unrealised gains/losses
- **Thesis cards**: Collapsible per-holding cards with fundamentals, key drivers, and manual break toggles
- **Client-side alerts**: Price-break, concentration, and EXIT-verdict detection with configurable webhook
- **Password protection**: Optional middleware-based auth via environment variable
- **Edit modal**: In-browser holdings/thesis editor with webhook settings and JSON export

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

- `T212_API_KEY` + `T212_API_SECRET` — Trading 212 API credentials for live prices and portfolio sync
- `FINNHUB_API_KEY` — Free API key from [finnhub.io](https://finnhub.io) as fallback
- `SITE_PASSWORD` — Set to enable password protection

## Deployment

Deploys on **Vercel** from the `main` branch. Any push to `main` triggers automatic redeploy.
