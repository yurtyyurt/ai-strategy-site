'use client';

import { usePortfolio } from '@/context/PortfolioContext';

export default function AlertStrip() {
  const { alerts, dismissAlert, dismissAllAlerts } = usePortfolio();

  if (alerts.length === 0) return null;

  return (
    <div className="alerts-strip">
      {alerts.map(a => (
        <span key={a.id} className="alert-pill">
          ⚠ {a.ticker}: {a.label}
          <span className="close-pill" onClick={() => dismissAlert(a.id)}>✕</span>
        </span>
      ))}
      <button className="mark-reviewed" onClick={dismissAllAlerts}>MARK ALL REVIEWED</button>
    </div>
  );
}
