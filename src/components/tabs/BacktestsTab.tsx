'use client';

import { BACKTESTS } from '@/lib/data';
import { pct } from '@/lib/helpers';

export default function BacktestsTab() {
  const maxRet = Math.max(...BACKTESTS.map(r => r[1]));
  const maxDD = Math.max(...BACKTESTS.map(r => Math.abs(r[4])));

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Strategy</th><th>Total Return</th><th>Ann. Return</th><th>Ann. Vol</th><th>Max DD</th><th>Sharpe</th><th>Worst 1Y</th></tr>
          </thead>
          <tbody>
            {BACKTESTS.map(r => {
              const retW = (r[1] / maxRet * 100).toFixed(0);
              const ddW = (Math.abs(r[4]) / maxDD * 100).toFixed(0);
              return (
                <tr key={r[0]}>
                  <td style={{ fontWeight: 600, minWidth: 200 }}>{r[0]}</td>
                  <td className="bar-cell tabular">
                    <div className="bar-bg" style={{ width: `${retW}%`, background: 'var(--accent)' }} />
                    <span className="bar-val positive">{r[1].toLocaleString()}%</span>
                  </td>
                  <td className="tabular positive">{pct(r[2])}</td>
                  <td className="tabular">{r[3].toFixed(1)}%</td>
                  <td className="bar-cell tabular">
                    <div className="bar-bg" style={{ width: `${ddW}%`, background: 'var(--red)' }} />
                    <span className="bar-val negative">{r[4].toFixed(1)}%</span>
                  </td>
                  <td className="tabular" style={{ fontWeight: 600 }}>{r[5].toFixed(2)}</td>
                  <td className="tabular negative">{r[6].toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="insight">
        AI Overweight (60/40) delivered the best risk-adjusted return (Sharpe 1.29). Every AI strategy beat both SPY and QQQ. But max drawdowns of &minus;39% demand psychological preparation.
      </div>
    </>
  );
}
