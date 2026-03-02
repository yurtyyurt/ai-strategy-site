'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { PortfolioConfig, Alert } from '@/lib/types';
import { DEFAULT_PORTFOLIO_CONFIG } from '@/lib/data';
import { loadPortfolio, savePortfolio, loadDismissedAlerts, saveDismissedAlerts, loadManualBreaches, saveManualBreaches } from '@/lib/storage';
import { computeAlerts } from '@/lib/helpers';

interface SyncResult {
  updated: number;
  added: number;
  errors: string[];
}

interface PortfolioContextType {
  config: PortfolioConfig;
  updateConfig: (updater: (prev: PortfolioConfig) => PortfolioConfig) => void;
  dismissedAlerts: Set<string>;
  dismissAlert: (id: string) => void;
  dismissAllAlerts: () => void;
  manualBreaches: Record<string, boolean>;
  toggleBreach: (key: string) => void;
  alerts: Alert[];
  refreshPrices: () => Promise<void>;
  pricesLoading: boolean;
  syncFromT212: () => Promise<SyncResult>;
  syncLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_PORTFOLIO_CONFIG);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [breaches, setBreaches] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const sentAlerts = useRef<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadPortfolio();
    if (saved) setConfig(saved);
    setDismissed(loadDismissedAlerts());
    setBreaches(loadManualBreaches());
    setLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => { if (loaded) savePortfolio(config); }, [config, loaded]);
  useEffect(() => { if (loaded) saveDismissedAlerts(dismissed); }, [dismissed, loaded]);
  useEffect(() => { if (loaded) saveManualBreaches(breaches); }, [breaches, loaded]);

  const updateConfig = useCallback((updater: (prev: PortfolioConfig) => PortfolioConfig) => {
    setConfig(prev => updater(prev));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  }, []);

  const alerts = computeAlerts(config, breaches, dismissed);

  const dismissAllAlerts = useCallback(() => {
    setDismissed(prev => new Set([...prev, ...alerts.map(a => a.id)]));
  }, [alerts]);

  const toggleBreach = useCallback((key: string) => {
    setBreaches(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }, []);

  const refreshPrices = useCallback(async () => {
    setPricesLoading(true);
    try {
      const tickers = config.holdings.map(h => h.ticker).join(',');
      const res = await fetch(`/api/prices?tickers=${tickers}`);
      if (!res.ok) throw new Error('Failed to fetch prices');
      const prices: Record<string, number | null> = await res.json();
      setConfig(prev => ({
        ...prev,
        holdings: prev.holdings.map(h => ({
          ...h,
          price: prices[h.ticker] ?? h.price,
        })),
      }));
    } catch (e) {
      console.error('Price refresh failed:', e);
    } finally {
      setPricesLoading(false);
    }
  }, [config.holdings]);

  const syncFromT212 = useCallback(async (): Promise<SyncResult> => {
    setSyncLoading(true);
    try {
      const res = await fetch('/api/t212');
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { updated: 0, added: 0, errors: [err.error || `HTTP ${res.status}`] };
      }
      const positions: { ticker: string; t212Ticker: string; shares: number; price: number; costBasis: number; pnl: number }[] = await res.json();

      // Compute counts against current config before updating state
      const currentTickers = new Set(config.holdings.map(h => h.ticker.toUpperCase()));
      let updated = 0;
      let added = 0;
      for (const pos of positions) {
        if (currentTickers.has(pos.ticker.toUpperCase())) updated++;
        else added++;
      }

      setConfig(prev => {
        const holdingMap = new Map(prev.holdings.map(h => [h.ticker.toUpperCase(), h]));
        const newHoldings = [...prev.holdings];

        for (const pos of positions) {
          const key = pos.ticker.toUpperCase();
          const existing = holdingMap.get(key);
          if (existing) {
            const idx = newHoldings.indexOf(existing);
            newHoldings[idx] = {
              ...existing,
              shares: pos.shares,
              price: pos.price,
              costBasis: pos.costBasis,
            };
          } else {
            newHoldings.push({
              ticker: pos.ticker,
              name: pos.ticker,
              shares: pos.shares,
              price: pos.price,
              costBasis: pos.costBasis,
              category: 'AI Infrastructure',
              conviction: 3,
            });
          }
        }
        return { ...prev, holdings: newHoldings };
      });

      return { updated, added, errors: [] };
    } catch (e) {
      return { updated: 0, added: 0, errors: [String(e)] };
    } finally {
      setSyncLoading(false);
    }
  }, [config.holdings]);

  // Fire webhook for new alerts
  useEffect(() => {
    if (!loaded || !config.webhookUrl || config.webhookUrl.includes('XXXX')) return;
    alerts.forEach(a => {
      if (sentAlerts.current.has(a.id)) return;
      sentAlerts.current.add(a.id);
      fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: a.ticker, type: 'thesis_break', message: a.label, id: a.id, timestamp: new Date().toISOString() }),
      }).catch(() => {});
    });
  }, [alerts, config.webhookUrl, loaded]);

  if (!loaded) return null;

  return (
    <PortfolioContext.Provider value={{
      config, updateConfig,
      dismissedAlerts: dismissed, dismissAlert, dismissAllAlerts,
      manualBreaches: breaches, toggleBreach,
      alerts, refreshPrices, pricesLoading,
      syncFromT212, syncLoading,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}
