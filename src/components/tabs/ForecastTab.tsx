'use client';

import { useState } from 'react';
import { FC_DATA } from '@/lib/data';
import { fmtM, fmtK } from '@/lib/helpers';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SCENARIO_ORDER = ['pw', 'bull', 'base', 'bear'] as const;

export default function ForecastTab() {
  const [scenario, setScenario] = useState('pw');
  const sc = FC_DATA[scenario];
  const f = sc.final;
  const startNW = 1350000;
  const medMultiple = (f.med / startNW).toFixed(1);
  const medCAGR = ((Math.pow(f.med / startNW, 1 / 10) - 1) * 100).toFixed(1);

  const years = sc.yearly.map(y => 2026 + y.y);
  const medians = sc.yearly.map(y => y.med);
  const p10s = sc.yearly.map(y => y.p10);
  const p90s = sc.yearly.map(y => y.p90);

  const maxMed = Math.max(...sc.assets.map(a => a.med));

  return (
    <>
      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Starting Net Worth</div><div className="kpi-value tabular">{fmtM(startNW)}</div></div>
        <div className="kpi"><div className="kpi-label">10Y Median</div><div className="kpi-value tabular" style={{ color: 'var(--accent)' }}>{fmtM(f.med)}</div></div>
        <div className="kpi"><div className="kpi-label">Multiple</div><div className="kpi-value tabular">{medMultiple}x</div></div>
        <div className="kpi"><div className="kpi-label">CAGR</div><div className="kpi-value tabular">{medCAGR}%</div></div>
        <div className="kpi"><div className="kpi-label">Simulations</div><div className="kpi-value tabular">10,000</div></div>
      </div>

      <div className="fc-scenario-btns">
        {SCENARIO_ORDER.map(k => (
          <button key={k} className={k === scenario ? 'active' : ''} onClick={() => setScenario(k)}>
            {FC_DATA[k].label} <span style={{ opacity: 0.5, fontSize: 11 }}>{FC_DATA[k].prob}%</span>
          </button>
        ))}
      </div>
      <div className="scenario-note" style={{ marginBottom: 16 }}>{sc.desc}</div>

      <div className="fc-chart-wrap">
        <Line
          data={{
            labels: years,
            datasets: [
              { label: 'P90 (Upside)', data: p90s, borderColor: 'rgba(34,197,94,0.5)', backgroundColor: 'rgba(34,197,94,0.06)', fill: '+1', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0, pointHoverRadius: 4, tension: 0.3 },
              { label: 'Median (P50)', data: medians, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', fill: '+1', borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#3b82f6', pointHoverRadius: 5, tension: 0.3 },
              { label: 'P10 (Downside)', data: p10s, borderColor: 'rgba(239,68,68,0.5)', backgroundColor: 'transparent', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0, pointHoverRadius: 4, tension: 0.3 },
            ],
          }}
          options={{
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index' as const, intersect: false },
            plugins: {
              legend: { labels: { color: '#a0a0a0', font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'line', padding: 16 } },
              tooltip: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#e5e5e5', bodyColor: '#a0a0a0', padding: 12,
                callbacks: { label: ctx => { const v = ctx.parsed.y ?? 0; return (ctx.dataset.label ?? '') + ': $' + (v / 1000000).toFixed(2) + 'M'; } },
              },
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666', font: { family: 'Inter', size: 11 } } },
              y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666', font: { family: 'Inter', size: 11 }, callback: v => '$' + (Number(v) / 1000000).toFixed(1) + 'M' } },
            },
          }}
        />
      </div>

      <div className="fc-summary-grid">
        <div className="fc-summary-card"><div className="label">Downside (P10)</div><div className="value tabular negative">{fmtM(f.p10)}</div><div className="sub">{(f.p10 / startNW).toFixed(1)}x on capital</div></div>
        <div className="fc-summary-card highlight"><div className="label">Median (P50)</div><div className="value tabular">{fmtM(f.med)}</div><div className="sub">{medMultiple}x on capital</div></div>
        <div className="fc-summary-card"><div className="label">Upside (P90)</div><div className="value tabular positive">{fmtM(f.p90)}</div><div className="sub">{(f.p90 / startNW).toFixed(1)}x on capital</div></div>
      </div>

      <div className="mp-section-title">Asset Class Breakdown (10Y Median)</div>
      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 12, display: 'flex', justifyContent: 'flex-end', gap: 12, paddingRight: 8 }}>
        <span>Start</span><span style={{ minWidth: 80, textAlign: 'right' }}>10Y Value</span><span style={{ minWidth: 48, textAlign: 'right' }}>CAGR</span>
      </div>
      <div className="table-wrap" style={{ border: 'none', background: 'transparent' }}>
        {sc.assets.map(a => {
          const barPct = Math.max(4, (a.med / maxMed * 100)).toFixed(0);
          const gain = a.med - a.start;
          const gainClass = gain >= 0 ? 'positive' : 'negative';
          return (
            <div key={a.name} className="fc-asset-row">
              <div className="fc-asset-name">{a.name}</div>
              <div className="fc-asset-bar"><div className="fc-asset-bar-fill" style={{ width: `${barPct}%`, background: a.color }} /></div>
              <div className="fc-asset-vals">
                <span style={{ color: 'var(--text-faint)' }}>{fmtK(a.start)}</span>
                <span style={{ fontWeight: 600 }}>{fmtK(a.med)}</span>
                <span className={gainClass}>{a.cagr >= 0 ? '+' : ''}{a.cagr}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="insight" style={{ marginTop: 20 }}>
        10,000 Monte Carlo simulations per scenario using log-normal returns. Return assumptions based on Goldman Sachs (S&amp;P 6.5%/yr), ARK/VanEck (BTC $300–600K by 2030–35), VanEck (gold $5K+), and Cyprus real estate forecasts (5–8%/yr). Volatility calibrated to historical asset class behaviour. This is not financial advice.
      </div>
    </>
  );
}
