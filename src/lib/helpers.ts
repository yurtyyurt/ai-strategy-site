import type { Holding, PortfolioConfig, Alert } from './types';

// Formatting
export const pct = (v: number) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
export const pctClass = (v: number) => v >= 0 ? 'positive' : 'negative';
export const gbp = (v: number) => '£' + v.toLocaleString('en-GB') + 'K';
export const fmtUsd = (v: number) => '$' + Math.round(v).toLocaleString();
export const fmtM = (v: number) => '$' + (v / 1000000).toFixed(2) + 'M';
export const fmtK = (v: number) => '$' + Math.round(v / 1000).toLocaleString() + 'K';
export const fmtD = (n: number) => '$' + (n / 1000).toFixed(0) + 'K';
export const fmtNW = (n: number) => '$' + (n / 1000000).toFixed(2) + 'M';

export const catClass = (c: string) =>
  c === 'ETF' ? 'etf' : c === 'Benchmark' ? 'bench' : c === 'AI Newer' ? 'newer' : '';

// Portfolio calculations
export function getPortfolioTotal(holdings: Holding[]) {
  return holdings.reduce((s, h) => s + h.shares * h.price, 0);
}

export function getHoldingValue(h: Holding) {
  return h.shares * h.price;
}

export function getHoldingWeight(h: Holding, total: number) {
  return total > 0 ? (getHoldingValue(h) / total * 100) : 0;
}

export function getHoldingPnL(h: Holding) {
  return (h.price - h.costBasis) * h.shares;
}

export function getHoldingPnLPct(h: Holding) {
  return h.costBasis > 0 ? ((h.price - h.costBasis) / h.costBasis * 100) : 0;
}

// Badge classes
export function verdictColor(v: string) {
  const m: Record<string, string> = { 'STRONG BUY': '#22c55e', 'BUY': '#3b82f6', 'HOLD': '#eab308', 'TRIM': '#f97316', 'EXIT': '#ef4444' };
  return m[v] || '#666';
}

export function verdictBadgeClass(v: string) {
  const m: Record<string, string> = { 'STRONG BUY': 'sb', 'BUY': 'buy', 'HOLD': 'hold', 'TRIM': 'trim', 'EXIT': 'exit' };
  return m[v] || 'na';
}

export function sizingBadgeClass(s: string) {
  const m: Record<string, string> = { 'UNDERWEIGHT': 'uw', 'CORRECT': 'correct', 'OVERWEIGHT': 'ow' };
  return m[s] || 'correct';
}

// Alert computation
export function computeAlerts(
  config: PortfolioConfig,
  manualBreaches: Record<string, boolean>,
  dismissed: Set<string>,
): Alert[] {
  const alerts: Alert[] = [];
  const total = getPortfolioTotal(config.holdings);
  config.holdings.forEach(h => {
    const th = config.theses[h.ticker];
    if (!th) return;
    th.breakConditions.forEach((bc, idx) => {
      if (bc.type === 'price_below' && h.price < bc.value)
        alerts.push({ ticker: h.ticker, label: bc.label, id: `${h.ticker}:price:${idx}` });
      if (bc.type === 'price_above' && h.price > bc.value)
        alerts.push({ ticker: h.ticker, label: bc.label, id: `${h.ticker}:price:${idx}` });
      if (bc.type === 'manual' && manualBreaches[`${h.ticker}:${idx}`])
        alerts.push({ ticker: h.ticker, label: bc.label, id: `${h.ticker}:manual:${idx}` });
    });
    const w = getHoldingWeight(h, total);
    if (w > 12)
      alerts.push({ ticker: h.ticker, label: `${w.toFixed(1)}% concentration (>12%)`, id: `${h.ticker}:conc` });
    if (th.verdict === 'EXIT')
      alerts.push({ ticker: h.ticker, label: 'Verdict is EXIT — consider selling', id: `${h.ticker}:exit` });
  });
  return alerts.filter(a => !dismissed.has(a.id));
}
