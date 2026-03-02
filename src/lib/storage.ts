import type { PortfolioConfig } from './types';

const STORAGE_KEY = 'ai-strategy-portfolio';
const ALERTS_KEY = 'ai-strategy-dismissed-alerts';
const BREACHES_KEY = 'ai-strategy-manual-breaches';

export function loadPortfolio(): PortfolioConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const config = JSON.parse(raw);
    // Migration: ensure costBasis exists on all holdings
    config.holdings?.forEach((h: Record<string, unknown>) => {
      if (h.costBasis === undefined) h.costBasis = h.price;
    });
    if (config.webhookUrl === undefined) config.webhookUrl = '';
    return config;
  } catch { return null; }
}

export function savePortfolio(config: PortfolioConfig) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch { /* quota exceeded */ }
}

export function loadDismissedAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

export function saveDismissedAlerts(alerts: Set<string>) {
  try { localStorage.setItem(ALERTS_KEY, JSON.stringify([...alerts])); } catch { /* */ }
}

export function loadManualBreaches(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(BREACHES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveManualBreaches(breaches: Record<string, boolean>) {
  try { localStorage.setItem(BREACHES_KEY, JSON.stringify(breaches)); } catch { /* */ }
}
