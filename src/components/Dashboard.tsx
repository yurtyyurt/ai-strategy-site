'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import AlertStrip from './AlertStrip';
import EditModal from './EditModal';
import UniverseTab from './tabs/UniverseTab';
import BacktestsTab from './tabs/BacktestsTab';
import ScenariosTab from './tabs/ScenariosTab';
import MyPortfolioTab from './tabs/MyPortfolioTab';
import ModelPortfoliosTab from './tabs/ModelPortfoliosTab';
import ExitRulesTab from './tabs/ExitRulesTab';
import ForecastTab from './tabs/ForecastTab';
import { TABS } from '@/lib/data';

const TAB_COMPONENTS = [UniverseTab, BacktestsTab, ScenariosTab, MyPortfolioTab, ModelPortfoliosTab, ExitRulesTab, ForecastTab];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const { refreshPrices, pricesLoading } = usePortfolio();

  const ActiveTab = TAB_COMPONENTS[activeTab];

  return (
    <div className="app">
      <AlertStrip />
      <header className="topbar">
        <div className="logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="9" height="9" rx="2" fill="#3b82f6"/>
            <rect x="12" y="1" width="9" height="9" rx="2" fill="#3b82f6" opacity="0.5"/>
            <rect x="1" y="12" width="9" height="9" rx="2" fill="#3b82f6" opacity="0.5"/>
            <rect x="12" y="12" width="9" height="9" rx="2" fill="#3b82f6" opacity="0.25"/>
          </svg>
          AI Market Strategy
        </div>
        <nav className="nav">
          {TABS.map((t, i) => (
            <button key={t} className={i === activeTab ? 'active' : ''} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </nav>
        <button onClick={refreshPrices} disabled={pricesLoading} className="refresh-btn" title="Refresh live prices">
          {pricesLoading ? '↻ ...' : '↻ Prices'}
        </button>
      </header>
      <main className="main">
        <section className="tab">
          <ActiveTab />
        </section>
      </main>
      <button className="edit-fab" onClick={() => setModalOpen(true)}>&#9881; Edit Portfolio</button>
      {modalOpen && <EditModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
