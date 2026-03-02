'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { verdictColor, verdictBadgeClass, sizingBadgeClass, getHoldingWeight, getPortfolioTotal } from '@/lib/helpers';
import type { Holding, Thesis } from '@/lib/types';

interface Props {
  holding: Holding;
  thesis: Thesis;
  defaultOpen?: boolean;
}

export default function ThesisCard({ holding, thesis, defaultOpen = false }: Props) {
  const { config, manualBreaches, toggleBreach } = usePortfolio();
  const [open, setOpen] = useState(defaultOpen);

  const h = holding;
  const th = thesis;
  const total = getPortfolioTotal(config.holdings);
  const w = getHoldingWeight(h, total);
  const borderColor = verdictColor(th.verdict);
  const dots = Array.from({ length: 5 }, (_, i) => i < h.conviction ? '●' : '○').join('');

  const peBadge = th.fundamentals.peRatio < 0 ? <span className="fund-badge neg">NEGATIVE</span>
    : th.fundamentals.peRatio < 35 ? <span className="fund-badge cheap">CHEAP</span>
    : th.fundamentals.peRatio <= 60 ? <span className="fund-badge fair">FAIR</span>
    : <span className="fund-badge expensive">EXPENSIVE</span>;

  const fcfBadge = th.fundamentals.fcfMargin < 0 ? <span className="fund-badge neg">NEGATIVE</span>
    : th.fundamentals.fcfMargin < 15 ? <span className="fund-badge weak">WEAK</span>
    : <span className="fund-badge strong">STRONG</span>;

  const debtBadge = th.fundamentals.debtEbitda < 1 ? <span className="fund-badge clean">CLEAN</span>
    : th.fundamentals.debtEbitda <= 2.5 ? <span className="fund-badge moderate">MODERATE</span>
    : <span className="fund-badge high-debt">HIGH</span>;

  const upside = ((th.fundamentals.analystTarget - h.price) / h.price * 100);
  const targetBadge = upside >= 0
    ? <span className="fund-badge upside">+{upside.toFixed(0)}% upside</span>
    : <span className="fund-badge downside">{upside.toFixed(0)}% downside</span>;

  return (
    <div className={`thesis-card ${open ? 'open' : ''}`} style={{ borderLeft: `3px solid ${borderColor}` }}>
      <div className="thesis-header" onClick={() => setOpen(!open)}>
        <span className="ticker-tag">{h.ticker}</span>
        <span className="company-name">
          {h.name} <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>{w.toFixed(1)}%</span>
        </span>
        <span className={`verdict-badge ${verdictBadgeClass(th.verdict)}`}>{th.verdict}</span>
        <span className={`sizing-badge ${sizingBadgeClass(th.sizing)}`}>{th.sizing}</span>
        <span className="conviction-dots" style={{ color: borderColor }}>{dots}</span>
        <span className="chevron">▼</span>
      </div>
      <div className="thesis-body">
        <div className="sub-title">Thesis</div>
        <div className="thesis-text">&ldquo;{th.thesis}&rdquo;</div>

        <div className="sub-title">Key Drivers (must remain true)</div>
        <ul className="drivers-list">
          {th.keyDrivers.map((d, i) => <li key={i}>✅ {d}</li>)}
        </ul>

        <div className="sub-title">Thesis Break Conditions</div>
        <ul className="break-list">
          {th.breakConditions.map((bc, idx) => {
            const key = `${h.ticker}:${idx}`;
            const isBreached = bc.type === 'manual' ? !!manualBreaches[key]
              : bc.type === 'price_below' ? h.price < bc.value
              : bc.type === 'price_above' ? h.price > bc.value
              : false;
            return (
              <li key={idx}>
                🔴 {bc.label}{' '}
                {bc.type === 'manual' ? (
                  <label className="break-toggle">
                    <input type="checkbox" checked={isBreached} onChange={() => toggleBreach(key)} />
                    <span className="slider" />
                  </label>
                ) : isBreached ? (
                  <span style={{ color: 'var(--red)', fontWeight: 600, fontSize: 11 }}>TRIGGERED</span>
                ) : (
                  <span style={{ color: 'var(--green)', fontSize: 11 }}>OK</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="sub-title">Fundamentals</div>
        <div className="fundamentals-grid">
          <div className="fund-row"><span className="fund-label">P/E Ratio</span><span className="fund-val">{th.fundamentals.peRatio}x {peBadge}</span></div>
          <div className="fund-row"><span className="fund-label">Revenue Growth</span><span className="fund-val">{th.fundamentals.revenueGrowth}%</span></div>
          <div className="fund-row"><span className="fund-label">FCF Margin</span><span className="fund-val">{th.fundamentals.fcfMargin}% {fcfBadge}</span></div>
          <div className="fund-row"><span className="fund-label">Op. Margin</span><span className="fund-val">{th.fundamentals.operatingMargin}%</span></div>
          <div className="fund-row"><span className="fund-label">Debt/EBITDA</span><span className="fund-val">{th.fundamentals.debtEbitda}x {debtBadge}</span></div>
          <div className="fund-row"><span className="fund-label">Analyst Target</span><span className="fund-val">${th.fundamentals.analystTarget} {targetBadge}</span></div>
        </div>
      </div>
    </div>
  );
}
