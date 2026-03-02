import { NextResponse } from 'next/server';
import { fetchT212Portfolio, t212ToStd } from '@/lib/t212';

interface SyncPosition {
  ticker: string;
  t212Ticker: string;
  shares: number;
  price: number;
  costBasis: number;
  pnl: number;
}

export async function GET() {
  if (!process.env.T212_API_KEY) {
    return NextResponse.json({ error: 'No T212_API_KEY configured' }, { status: 503 });
  }

  const positions = await fetchT212Portfolio();
  if (!positions) {
    return NextResponse.json(
      { error: 'T212 API returned errors on both live and demo environments' },
      { status: 502 },
    );
  }

  const result: SyncPosition[] = positions.map(p => ({
    ticker: t212ToStd(p.ticker),
    t212Ticker: p.ticker,
    shares: p.quantity,
    price: p.currentPrice,
    costBasis: p.averagePrice,
    pnl: p.ppl,
  }));

  return NextResponse.json(result);
}
