'use client';

import { useState, useEffect, useRef } from 'react';
import { PORTFOLIOS } from '@/lib/data';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

export default function ModelPortfoliosTab() {
  const [profile, setProfile] = useState('balanced');
  const p = PORTFOLIOS[profile];
  const aiTotal = p.ai.reduce((s, r) => s + r[1], 0);
  const coreTotal = p.core.reduce((s, r) => s + r[1], 0);

  const makeRows = (arr: [string, number, number][], section: string) =>
    arr.map(r => (
      <tr key={r[0]}>
        <td style={{ fontWeight: 500 }}>{r[0]}</td>
        <td className="tabular">{r[1]}%</td>
        <td className="tabular">£{r[2]}K</td>
        <td><span className={`cat-badge${section === 'ai' ? '' : ' bench'}`}>{section === 'ai' ? 'AI Sleeve' : 'Core'}</span></td>
      </tr>
    ));

  return (
    <>
      <div className="profile-tabs">
        {Object.entries(PORTFOLIOS).map(([k, v]) => (
          <button key={k} className={k === profile ? 'active' : ''} onClick={() => setProfile(k)} style={{ position: 'relative' }}>
            {v.label} ({v.pct}%)
            {v.recommended && <span className="rec-badge">REC</span>}
          </button>
        ))}
      </div>
      <div className="port-layout">
        <div className="donut-wrap">
          <div style={{ maxWidth: 200, maxHeight: 200 }}>
            <Doughnut
              data={{
                labels: ['AI Sleeve', 'Core'],
                datasets: [{ data: [aiTotal, coreTotal], backgroundColor: ['#3b82f6', '#444'], borderWidth: 0, borderRadius: 3 }],
              }}
              options={{ cutout: '68%', plugins: { legend: { display: false } }, responsive: true, animation: { animateRotate: true, duration: 500 } }}
            />
          </div>
          <div className="donut-legend">
            <div className="donut-legend-item"><span className="dot" style={{ background: 'var(--accent)' }} />AI Sleeve {aiTotal}%</div>
            <div className="donut-legend-item"><span className="dot" style={{ background: 'var(--text-faint)' }} />Core {coreTotal}%</div>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Holding</th><th>Weight</th><th>Value</th><th>Sleeve</th></tr></thead>
            <tbody>
              {makeRows(p.ai, 'ai')}
              {makeRows(p.core, 'core')}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
