'use client';

import { UNIVERSE } from '@/lib/data';
import { pct, pctClass, catClass } from '@/lib/helpers';

const KPIS = [
  ['Instruments Tracked', '19'], ['Data History', '10 Years'],
  ['AI Basket 10Y', '+4,426%'], ['SPY 10Y', '+242%'], ['Best Sharpe', 'NVDA (1.56)'],
];

export default function UniverseTab() {
  return (
    <>
      <div className="kpi-row">
        {KPIS.map(([label, value]) => (
          <div key={label} className="kpi">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value tabular">{value}</div>
          </div>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Ticker</th><th>Category</th><th>Ann. Return</th><th>Ann. Vol</th><th>Max DD</th><th>Sharpe</th></tr>
          </thead>
          <tbody>
            {UNIVERSE.map(r => (
              <tr key={r[0]}>
                <td style={{ fontWeight: 600 }}>{r[0]}</td>
                <td><span className={`cat-badge ${catClass(r[1])}`}>{r[1]}</span></td>
                <td className={`tabular ${pctClass(r[2])}`}>{pct(r[2])}</td>
                <td className="tabular">{r[3].toFixed(1)}%</td>
                <td className="tabular negative">{r[4].toFixed(1)}%</td>
                <td className="tabular" style={{ fontWeight: 600 }}>{r[5].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
