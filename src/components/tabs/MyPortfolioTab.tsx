'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { getPortfolioTotal, getHoldingValue, getHoldingWeight, getHoldingPnL, getHoldingPnLPct, verdictBadgeClass, sizingBadgeClass, fmtD, fmtNW } from '@/lib/helpers';
import { MP_ISSUES, MP_RECS } from '@/lib/data';
import ThesisCard from '../ThesisCard';

const SIM_RETURNS: Record<string, number[]> = { bull: [1.35, 1.35, 1.35], base: [1.15, 1.15, 1.15], bear: [0.80, 1.05, 1.05] };
const SIM_LABELS: Record<string, string> = { bull: 'Bull (+35%/yr)', base: 'Base (+15%/yr)', bear: 'Bear (-20% Y1, +5%/yr)' };
const CAT_COLORS: Record<string, string> = { 'AI Platforms': '#3b82f6', 'AI Infrastructure': '#8b5cf6', 'Energy/Power': '#f59e0b', 'Commodities': '#22c55e' };
const ICON_MAP: Record<string, string> = { trim: '✂', exit: '✖', hold: '✔', add: '+' };
const Q_MAP: Record<string, number> = { 'STRONG BUY': 5, 'BUY': 4, 'HOLD': 3, 'TRIM': 2, 'EXIT': 1 };

export default function MyPortfolioTab() {
  const { config } = usePortfolio();
  const [mpScenario, setMpScenario] = useState('base');
  const [allExpanded, setAllExpanded] = useState(false);

  const holdings = config.holdings;
  const totalVal = getPortfolioTotal(holdings);
  const sorted = [...holdings].sort((a, b) => getHoldingValue(b) - getHoldingValue(a));
  const totalPnL = holdings.reduce((s, h) => s + getHoldingPnL(h), 0);
  const totalCost = holdings.reduce((s, h) => s + h.costBasis * h.shares, 0);
  const totalPnLPct = totalCost > 0 ? ((totalVal - totalCost) / totalCost * 100) : 0;
  const nwPct = 34;

  // Weighted P/E
  const peHoldings = sorted.filter(h => { const th = config.theses[h.ticker]; return th && th.fundamentals.peRatio > 0; });
  const totalPeWeight = peHoldings.reduce((s, h) => s + getHoldingWeight(h, totalVal), 0);
  const wPE = totalPeWeight > 0 ? peHoldings.reduce((s, h) => s + config.theses[h.ticker].fundamentals.peRatio * getHoldingWeight(h, totalVal), 0) / totalPeWeight : 0;

  // Quality score
  const avgQ = (sorted.reduce((s, h) => {
    const th = config.theses[h.ticker];
    return s + (th ? (Q_MAP[th.verdict] || 3) : 3) * getHoldingWeight(h, totalVal);
  }, 0) / 100).toFixed(1);

  // Category breakdown
  const cats: Record<string, number> = {};
  sorted.forEach(h => { cats[h.category] = (cats[h.category] || 0) + getHoldingWeight(h, totalVal); });

  // Scenario simulator
  const sr = SIM_RETURNS[mpScenario];
  const y1 = totalVal * sr[0];
  const y3 = totalVal * sr[0] * sr[1] * sr[2];
  let y5 = totalVal;
  for (let i = 0; i < 5; i++) y5 *= (i < sr.length ? sr[i] : sr[sr.length - 1]);
  const totalNW = 1100000;

  const kpis = [
    ['Total Value', '$' + Math.round(totalVal).toLocaleString()],
    ['Unrealised P&L', (totalPnL >= 0 ? '+' : '') + '$' + Math.round(totalPnL).toLocaleString() + ` (${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct.toFixed(1)}%)`],
    ['% of Net Worth', '~' + nwPct + '%'],
    ['Positions', String(holdings.length)],
    ['Wtd P/E', '~' + Math.round(wPE) + 'x'],
    ['Avg Quality', avgQ + ' / 5'],
  ];

  const fmtN = (n: number | null) => n === null ? '—' : n < 0 ? <span className="negative">{n}%</span> : <>{n}%</>;

  return (
    <>
      <div className="kpi-row">
        {kpis.map(([label, value]) => (
          <div key={label} className="kpi"><div className="kpi-label">{label}</div><div className="kpi-value tabular">{value}</div></div>
        ))}
      </div>

      <div className="mp-section-title">Category Breakdown</div>
      <div className="mp-cat-bar">
        {Object.entries(cats).map(([name, pctV]) => (
          <div key={name} className="mp-cat-seg" style={{ flex: pctV, background: CAT_COLORS[name] || '#666' }} title={`${name}: ${pctV.toFixed(1)}%`}>
            {pctV.toFixed(0)}%
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        {Object.entries(cats).map(([name, pctV]) => (
          <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: CAT_COLORS[name] || '#666' }} />
            {name} ({pctV.toFixed(1)}%)
          </span>
        ))}
      </div>

      <div className="mp-section-title">Holdings</div>
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table>
          <thead>
            <tr><th>Ticker</th><th>Weight</th><th>Value</th><th>P&amp;L</th><th>P/E</th><th>Verdict</th><th>Sizing</th><th>Rev Growth</th><th>Op Margin</th><th>FCF Margin</th></tr>
          </thead>
          <tbody>
            {sorted.map(h => {
              const th = config.theses[h.ticker];
              const w = getHoldingWeight(h, totalVal);
              const v = getHoldingValue(h);
              const pnl = getHoldingPnL(h);
              const pnlPct = getHoldingPnLPct(h);
              const pe = th ? th.fundamentals.peRatio : null;
              const verdict = th?.verdict ?? 'N/A';
              const sizing = th?.sizing ?? 'N/A';
              return (
                <tr key={h.ticker}>
                  <td style={{ fontWeight: 600 }}>{h.ticker}</td>
                  <td className="tabular">{w.toFixed(1)}%</td>
                  <td className="tabular">${Math.round(v).toLocaleString()}</td>
                  <td className={`tabular ${pnl >= 0 ? 'positive' : 'negative'}`}>
                    {pnl >= 0 ? '+' : ''}{Math.round(pnl).toLocaleString()} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)
                  </td>
                  <td className="tabular" style={pe !== null && pe < 0 ? { color: 'var(--red)' } : {}}>{pe !== null ? pe + 'x' : '—'}</td>
                  <td><span className={`verdict-badge ${verdictBadgeClass(verdict)}`}>{verdict}</span></td>
                  <td><span className={`sizing-badge ${sizingBadgeClass(sizing)}`}>{sizing}</span></td>
                  <td className="tabular">{fmtN(th?.fundamentals.revenueGrowth ?? null)}</td>
                  <td className="tabular">{fmtN(th?.fundamentals.operatingMargin ?? null)}</td>
                  <td className="tabular">{fmtN(th?.fundamentals.fcfMargin ?? null)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mp-section-title">Portfolio Issues</div>
      {MP_ISSUES.map((issue, i) => (
        <div key={i} className="alert-card">
          <span className={`alert-sev ${issue.sev}`}>{issue.sev}</span>
          <div><strong style={{ color: 'var(--text)' }}>{issue.title}</strong><br />{issue.desc}</div>
        </div>
      ))}

      <div className="mp-section-title">Recommendations</div>
      <div className="rec-grid">
        {MP_RECS.map((r, i) => (
          <div key={i} className="action-card">
            <div className={`act-icon ${r.icon}`}>{ICON_MAP[r.icon]}</div>
            <div><div className="act-title">{r.title}</div><div className="act-desc">{r.desc}</div></div>
          </div>
        ))}
      </div>

      <div className="mp-section-title">Scenario Simulator</div>
      <div className="mp-sim-controls">
        <div className="control-group">
          <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', marginBottom: 8 }}>Scenario</label>
          <div className="btn-group">
            {Object.entries(SIM_LABELS).map(([k, v]) => (
              <button key={k} className={k === mpScenario ? 'active' : ''} onClick={() => setMpScenario(k)}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mp-sim-grid">
        <div className="mp-sim-card"><div className="label">1-Year</div><div className="value tabular">{fmtD(y1)}</div><div className="sub">NW: {fmtNW(totalNW - totalVal + y1)}</div></div>
        <div className="mp-sim-card"><div className="label">3-Year</div><div className="value tabular">{fmtD(y3)}</div><div className="sub">NW: {fmtNW(totalNW - totalVal + y3)}</div></div>
        <div className="mp-sim-card"><div className="label">5-Year</div><div className="value tabular">{fmtD(y5)}</div><div className="sub">NW: {fmtNW(totalNW - totalVal + y5)}</div></div>
      </div>
      <div className="insight" style={{ marginTop: 16 }}>
        Portfolio is ${Math.round(totalVal).toLocaleString()} ({nwPct}% of ~$1.1M NW). Projections assume non-stock assets grow at 5%/yr.
      </div>

      <div className="thesis-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, marginTop: 32, flexWrap: 'wrap' }}>
          <span className="mp-section-title" style={{ margin: 0 }}>— Thesis &amp; Fundamentals —</span>
          <div className="thesis-controls">
            <button onClick={() => setAllExpanded(!allExpanded)}>{allExpanded ? 'Collapse All' : 'Expand All'}</button>
          </div>
        </div>
        {sorted.map(h => {
          const th = config.theses[h.ticker];
          if (!th) return null;
          const isActionable = th.verdict === 'TRIM' || th.verdict === 'EXIT';
          return <ThesisCard key={h.ticker} holding={h} thesis={th} defaultOpen={allExpanded || isActionable} />;
        })}
      </div>
    </>
  );
}
