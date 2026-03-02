'use client';

import { EXIT_RULES } from '@/lib/data';

export default function ExitRulesTab() {
  return (
    <>
      {EXIT_RULES.map((r, i) => (
        <div key={i} className="rule-card">
          <div className="rule-header">
            <span className={`priority-badge ${r.priority}`}>{r.priority}</span>
            <span className="rule-name">{r.name}</span>
          </div>
          <div className="rule-body">
            <div><dt>Trigger</dt><dd>{r.trigger}</dd></div>
            <div><dt>Action</dt><dd>{r.action}</dd></div>
          </div>
        </div>
      ))}
    </>
  );
}
