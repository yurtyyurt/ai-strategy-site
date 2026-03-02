# AI Market Strategy Dashboard

## Stack
- Next.js 15 (App Router), React 19, TypeScript
- Chart.js + react-chartjs-2
- Tailwind CSS 3 (available but CSS-class approach preferred in globals.css)
- Deployed on Vercel

## Architecture
- `src/lib/types.ts` — All TypeScript interfaces
- `src/lib/data.ts` — Static reference data (universe, backtests, scenarios, forecasts) + default portfolio
- `src/lib/storage.ts` — localStorage persistence layer
- `src/lib/helpers.ts` — Formatting and calculation utilities
- `src/context/PortfolioContext.tsx` — Portfolio state + auto-persistence + alert engine + price refresh + T212 sync
- `src/components/Dashboard.tsx` — Main app shell (topbar, tabs, FAB, modal)
- `src/components/tabs/*.tsx` — One component per tab (7 total)

## Key Patterns
- Portfolio config persists to localStorage on every change
- Live prices via `/api/prices?tickers=AAPL,MSFT` — fallback chain: T212 → Yahoo Finance v8 → Finnhub
- T212 portfolio sync via `/api/t212` — pulls shares, prices, cost basis from Trading 212 account
- T212 tickers use format `NVDA_US_EQ`; `src/lib/t212.ts` strips suffix to map to standard tickers
- Yahoo Finance v8 chart endpoint (no API key needed) is the primary working price source
- Optional password auth via SITE_PASSWORD env var (middleware-based)
- All static reference data lives in `data.ts`; editable portfolio data flows through context
- CSS uses class-based styles from `globals.css`, not inline Tailwind utilities
- Cost basis tracked per holding; P&L shown in My Portfolio tab

## Env Vars
- `T212_API_KEY` — Trading 212 API key. Powers live prices and portfolio sync.
- `FINNHUB_API_KEY` — Optional fallback for tickers not in T212 portfolio.
- `SITE_PASSWORD` — Optional. Enables password protection via middleware.

## Commands
- `npm run dev` — Start dev server (port 3100)
- `npm run build` — Production build
- `npm start` — Start production server
