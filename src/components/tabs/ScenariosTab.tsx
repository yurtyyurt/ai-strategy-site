'use client';

import { useState } from 'react';
import { SCENARIOS, ALLOCS, OUTCOMES } from '@/lib/data';
import { gbp } from '@/lib/helpers';

export default function ScenariosTab() {
  const [scenario, setScenario] = useState<string>('normalisation');
  const [alloc, setAlloc] = useState(1);

  const s = SCENARIOS[scenario];
  const o = OUTCOMES[scenario][alloc];
  const [median, p10, p90] = o;
  const beats = median >= 1200;
  const pw = Object.entries(OUTCOMES).reduce((sum, [k, v]) => sum + SCENARIOS[k].prob / 100 * v[alloc][0], 0);

  return (
    <>
      <div className="scenario-controls">
        <div className="control-group">
          <label>Scenario</label>
          <div className="btn-group">
            {Object.entries(SCENARIOS).map(([k, v]) => (
              <button key={k} className={k === scenario ? 'active' : ''} onClick={() => setScenario(k)}>
                {v.label} <span style={{ opacity: 0.5, fontSize: 11 }}>{v.prob}%</span>
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <label>Allocation (AI / Market)</label>
          <div className="btn-group">
            {ALLOCS.map((a, i) => (
              <button key={a} className={i === alloc ? 'active' : ''} onClick={() => setAlloc(i)}>{a} AI/Mkt</button>
            ))}
          </div>
        </div>
      </div>
      <div className="scenario-note">{s.desc} &mdash; {s.prob}% probability</div>
      <div className="outcome-cards">
        <div className="outcome-card">
          <div className="label">Downside (P10)</div>
          <div className="value tabular negative">{gbp(p10)}</div>
          <div className="sub">{p10 < 1200 ? 'Below starting capital' : 'Above starting capital'}</div>
        </div>
        <div className="outcome-card highlight">
          <div className="label">Median Outcome</div>
          <div className="value tabular">{gbp(median)}</div>
          <div className="sub">{beats ? 'Beats' : 'Below'} starting £1,200K</div>
        </div>
        <div className="outcome-card">
          <div className="label">Upside (P90)</div>
          <div className="value tabular positive">{gbp(p90)}</div>
          <div className="sub">Best-case scenario</div>
        </div>
      </div>
      <div className="outcome-meta">
        <div className="meta-card"><div className="label">Prob-Weighted Expected (all scenarios)</div><div className="value tabular">{gbp(Math.round(pw))}</div></div>
        <div className="meta-card"><div className="label">Starting Capital</div><div className="value tabular">£1,200K</div></div>
        <div className="meta-card"><div className="label">Multiple on Capital</div><div className="value tabular">{(median / 1200).toFixed(1)}×</div></div>
      </div>
    </>
  );
}
