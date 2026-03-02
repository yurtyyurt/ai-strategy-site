import { NextResponse } from 'next/server';
import { fetchT212Portfolio, t212ToStd } from '@/lib/t212';

async function fetchT212Prices(requestedTickers: string[]): Promise<Record<string, number | null>> {
  const positions = await fetchT212Portfolio();
  if (!positions) return {};

  const prices: Record<string, number | null> = {};
  const wanted = new Set(requestedTickers.map(t => t.toUpperCase()));

  for (const pos of positions) {
    const std = t212ToStd(pos.ticker).toUpperCase();
    if (wanted.has(std) && pos.currentPrice > 0) {
      prices[std] = pos.currentPrice;
    }
  }

  return prices;
}

async function fetchYahooPrices(tickers: string[]): Promise<Record<string, number | null>> {
  if (tickers.length === 0) return {};
  const prices: Record<string, number | null> = {};

  // Use v8 chart endpoint (public, no auth needed) — fetch in parallel batches
  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
          { cache: 'no-store', headers: { 'User-Agent': 'Mozilla/5.0' } },
        );
        if (!res.ok) { prices[ticker.toUpperCase()] = null; return; }
        const data = await res.json();
        const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
        prices[ticker.toUpperCase()] = price > 0 ? price : null;
      } catch {
        prices[ticker.toUpperCase()] = null;
      }
    }),
  );

  return prices;
}

async function fetchFinnhubPrices(tickers: string[]): Promise<Record<string, number | null>> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return {};

  const prices: Record<string, number | null> = {};
  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`,
          { next: { revalidate: 60 } },
        );
        const data = await res.json();
        prices[ticker] = data.c > 0 ? data.c : null;
      } catch {
        prices[ticker] = null;
      }
    }),
  );
  return prices;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) || [];

  if (tickers.length === 0) {
    return NextResponse.json({});
  }

  // Try T212 first
  const t212Prices = await fetchT212Prices(tickers);
  const missing = tickers.filter(t => t212Prices[t.toUpperCase()] == null);

  // Fallback chain: Yahoo Finance → Finnhub
  let yahooPrices: Record<string, number | null> = {};
  if (missing.length > 0) {
    yahooPrices = await fetchYahooPrices(missing);
  }

  const stillMissing = missing.filter(t => yahooPrices[t.toUpperCase()] == null);
  let finnhubPrices: Record<string, number | null> = {};
  if (stillMissing.length > 0) {
    finnhubPrices = await fetchFinnhubPrices(stillMissing);
  }

  // Merge results: T212 → Yahoo → Finnhub
  const prices: Record<string, number | null> = {};
  for (const t of tickers) {
    const upper = t.toUpperCase();
    prices[t] = t212Prices[upper] ?? yahooPrices[upper] ?? finnhubPrices[t] ?? null;
  }

  return NextResponse.json(prices);
}
