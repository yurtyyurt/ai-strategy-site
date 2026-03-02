'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import type { Holding, Verdict, Sizing } from '@/lib/types';

interface Props { onClose: () => void }

export default function EditModal({ onClose }: Props) {
  const [tab, setTab] = useState<'holdings' | 'theses' | 'settings' | 'export'>('holdings');

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>Edit Portfolio</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-tabs">
          {(['holdings', 'theses', 'settings', 'export'] as const).map(t => (
            <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
              {t === 'holdings' ? 'Holdings' : t === 'theses' ? 'Theses' : t === 'settings' ? 'Settings' : 'Export'}
            </button>
          ))}
        </div>
        <div className="modal-body">
          {tab === 'holdings' && <HoldingsEditor />}
          {tab === 'theses' && <ThesesEditor />}
          {tab === 'settings' && <SettingsEditor />}
          {tab === 'export' && <ExportView />}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function HoldingsEditor() {
  const { config, updateConfig } = usePortfolio();

  const update = (i: number, field: keyof Holding, val: string | number) => {
    updateConfig(prev => ({
      ...prev,
      holdings: prev.holdings.map((h, j) => j === i ? { ...h, [field]: val } : h),
    }));
  };

  const remove = (i: number) => {
    updateConfig(prev => ({ ...prev, holdings: prev.holdings.filter((_, j) => j !== i) }));
  };

  const add = () => {
    updateConfig(prev => ({
      ...prev,
      holdings: [...prev.holdings, { ticker: 'NEW', name: 'New Position', shares: 0, price: 0, costBasis: 0, category: 'AI Infrastructure', conviction: 3 }],
    }));
  };

  return (
    <>
      <table className="modal-edit-table">
        <thead>
          <tr><th>Ticker</th><th>Name</th><th>Shares</th><th>Price</th><th>Cost Basis</th><th></th></tr>
        </thead>
        <tbody>
          {config.holdings.map((h, i) => (
            <tr key={i}>
              <td><input value={h.ticker} onChange={e => update(i, 'ticker', e.target.value)} style={{ width: 60 }} /></td>
              <td><input value={h.name} onChange={e => update(i, 'name', e.target.value)} style={{ width: 120 }} /></td>
              <td><input type="number" step="0.01" value={h.shares} onChange={e => update(i, 'shares', parseFloat(e.target.value) || 0)} style={{ width: 80 }} /></td>
              <td><input type="number" step="0.01" value={h.price} onChange={e => update(i, 'price', parseFloat(e.target.value) || 0)} style={{ width: 90 }} /></td>
              <td><input type="number" step="0.01" value={h.costBasis} onChange={e => update(i, 'costBasis', parseFloat(e.target.value) || 0)} style={{ width: 90 }} /></td>
              <td><button className="del-btn" onClick={() => remove(i)}>✖</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={{ marginTop: 12, background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)', font: "500 12px/1 'Inter',sans-serif", padding: '8px 16px', borderRadius: 'var(--radius)', cursor: 'pointer' }}
        onClick={add}
      >
        + Add Position
      </button>
    </>
  );
}

function ThesesEditor() {
  const { config, updateConfig } = usePortfolio();
  const tickers = config.holdings.map(h => h.ticker);
  const [selected, setSelected] = useState(tickers[0] || '');
  const th = config.theses[selected];
  const h = config.holdings.find(x => x.ticker === selected);

  const updateThesis = (field: string, val: string) => {
    updateConfig(prev => ({
      ...prev,
      theses: { ...prev.theses, [selected]: { ...prev.theses[selected], [field]: val } },
    }));
  };

  const updateConviction = (val: number) => {
    updateConfig(prev => ({
      ...prev,
      holdings: prev.holdings.map(x => x.ticker === selected ? { ...x, conviction: val } : x),
    }));
  };

  return (
    <>
      <label>Select Ticker</label>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        {tickers.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      {th ? (
        <>
          <label>Thesis</label>
          <textarea value={th.thesis} onChange={e => updateThesis('thesis', e.target.value)} />
          <label>Conviction (1–5)</label>
          <div className="conviction-slider">
            <input type="range" min="1" max="5" value={h?.conviction ?? 3} onChange={e => updateConviction(parseInt(e.target.value))} />
            <span className="conv-val">{h?.conviction ?? 3}</span>
          </div>
          <label>Verdict</label>
          <select value={th.verdict} onChange={e => updateThesis('verdict', e.target.value)}>
            {(['STRONG BUY', 'BUY', 'HOLD', 'TRIM', 'EXIT'] as Verdict[]).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <label>Sizing</label>
          <select value={th.sizing} onChange={e => updateThesis('sizing', e.target.value)}>
            {(['UNDERWEIGHT', 'CORRECT', 'OVERWEIGHT'] as Sizing[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </>
      ) : (
        <p style={{ color: 'var(--text-faint)', marginTop: 12 }}>No thesis data for this ticker.</p>
      )}
    </>
  );
}

function SettingsEditor() {
  const { config, updateConfig, syncFromT212, syncLoading } = usePortfolio();
  const [syncMsg, setSyncMsg] = useState('');

  const handleSync = async () => {
    setSyncMsg('');
    const result = await syncFromT212();
    if (result.errors.length > 0) {
      setSyncMsg(`Error: ${result.errors[0]}`);
    } else {
      setSyncMsg(`Synced: ${result.updated} updated, ${result.added} new positions`);
    }
  };

  return (
    <>
      <label>Trading 212 Sync</label>
      <p style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 8, lineHeight: 1.5 }}>
        Pull live prices, shares, and cost basis from your Trading 212 account.
      </p>
      <button
        className="btn-primary"
        onClick={handleSync}
        disabled={syncLoading}
        style={{ marginBottom: 4 }}
      >
        {syncLoading ? 'Syncing...' : 'Sync from Trading 212'}
      </button>
      {syncMsg && (
        <p style={{ fontSize: 12, color: syncMsg.startsWith('Error') ? 'var(--red)' : 'var(--green, #22c55e)', marginTop: 4, marginBottom: 16 }}>
          {syncMsg}
        </p>
      )}

      <label style={{ marginTop: 16 }}>Webhook URL (Zapier, Make, etc.)</label>
      <input
        type="url"
        value={config.webhookUrl}
        onChange={e => updateConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
        placeholder="https://hooks.zapier.com/hooks/catch/..."
      />
      <p style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 8, lineHeight: 1.5 }}>
        When a thesis break condition is triggered, an alert payload will be POSTed to this URL.
        Leave blank to disable.
      </p>
    </>
  );
}

function ExportView() {
  const { config } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(config, null, 2);

  const copy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <>
      <div className="export-box">{json}</div>
      <div className="export-note">
        Portfolio data is automatically saved to your browser&apos;s localStorage.
        Use this export to backup or transfer your configuration.
      </div>
      <button
        className="btn-primary"
        onClick={copy}
        style={{ marginTop: 12 }}
      >
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </>
  );
}
