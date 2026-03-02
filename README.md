# AI Market Strategy Dashboard

Next.js portfolio strategy dashboard for AI-focused investments.

## Features

- **7-tab interface**: Universe, Backtests, Scenarios, My Portfolio, Model Portfolios, Exit Rules, 10-Year Forecast
- **localStorage persistence**: Edits save automatically and survive page refresh
- **Live price refresh**: Optional Finnhub API integration for real-time prices
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

- `FINNHUB_API_KEY` — Free API key from [finnhub.io](https://finnhub.io) for live price refresh
- `SITE_PASSWORD` — Set to enable password protection

## Deployment

Deploys on **Vercel** from the `main` branch. Any push to `main` triggers automatic redeploy.
