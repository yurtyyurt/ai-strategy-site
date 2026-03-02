export interface T212Position {
  ticker: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  ppl: number;
  fxPpl?: number;
  initialFillDate?: string;
  pieQuantity?: number;
  frontend?: string;
  maxBuy?: number;
  maxSell?: number;
}

// T212 uses legacy tickers for some stocks
const T212_ALIASES: Record<string, string> = { FB: 'META' };

/** Strip T212 suffix and apply aliases (e.g. FB_US_EQ → META, NVDA_US_EQ → NVDA) */
export function t212ToStd(t212Ticker: string): string {
  const base = t212Ticker.split('_')[0];
  return T212_ALIASES[base] || base;
}

function buildAuthHeader(): string {
  const key = process.env.T212_API_KEY!;
  const secret = process.env.T212_API_SECRET || key;
  const encoded = Buffer.from(`${key}:${secret}`).toString('base64');
  return `Basic ${encoded}`;
}

const T212_BASES = [
  'https://live.trading212.com/api/v0',
  'https://demo.trading212.com/api/v0',
] as const;

/**
 * Fetch portfolio positions from T212, trying live then demo environment.
 * Returns null if no API key or all attempts fail.
 */
export async function fetchT212Portfolio(): Promise<T212Position[] | null> {
  const apiKey = process.env.T212_API_KEY;
  if (!apiKey) return null;

  for (const base of T212_BASES) {
    try {
      const res = await fetch(`${base}/equity/portfolio`, {
        headers: { Authorization: buildAuthHeader() },
        cache: 'no-store',
      });

      if (res.status === 401 || res.status === 403) {
        // Wrong environment, try next
        continue;
      }

      if (!res.ok) {
        console.error(`T212 (${base}) error:`, res.status);
        continue;
      }

      const data: T212Position[] = await res.json();
      console.log(`T212 connected via ${base}, ${data.length} positions`);
      return data;
    } catch (e) {
      console.error(`T212 (${base}) fetch failed:`, e);
      continue;
    }
  }

  return null;
}
