'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: '#0a0a0a' }}>
      <form onSubmit={handleSubmit} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '32px 28px', width: '100%', maxWidth: 360 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#e5e5e5', marginBottom: 8 }}>AI Market Strategy</h1>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>Enter password to access the dashboard.</p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e5e5', font: "13px/1.4 'Inter',sans-serif", padding: '10px 14px', borderRadius: 6, marginBottom: 16 }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', background: '#3b82f6', color: '#fff', font: "600 13px/1 'Inter',sans-serif", padding: '11px 20px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Checking...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
