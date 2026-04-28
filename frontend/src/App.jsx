import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';
import CustomerForm from './components/CustomerForm';
import CustomerTable from './components/CustomerTable';
import ToastContainer, { useToast } from './components/Toast';
import { getCustomers } from './api/customerApi';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [customers, setCustomers]       = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [apiOnline, setApiOnline]       = useState(false);
  const { toasts, showToast }           = useToast();

  const fetchAll = useCallback(async () => {
    setLoadingTable(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data);
      setApiOnline(true);
    } catch {
      setApiOnline(false);
      showToast('Could not reach the server. Start the backend on port 5000.', 'error');
    } finally {
      setLoadingTable(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAdded   = (c) => setCustomers((prev) => [c, ...prev]);
  const handleDeleted = (id) => setCustomers((prev) => prev.filter((c) => c.id !== id));

  const metrics = useMemo(() => {
    const total      = customers.length;
    const today      = customers.filter((c) => c.createdAt?.startsWith(todayStr())).length;
    const latest     = customers[0]?.name?.split(' ')[0] || '—';
    const statusText = apiOnline ? 'Online' : 'Offline';

    return [
      { label: 'Customers',   value: total,      sub: 'all records',  tone: 'blue'  },
      { label: 'Added today', value: today,       sub: 'new entries',  tone: 'green' },
      { label: 'Latest',      value: latest,      sub: 'most recent',  tone: 'amber', small: true },
      { label: 'API status',  value: statusText,  sub: 'connection',   tone: apiOnline ? 'green' : 'red', small: true },
    ];
  }, [customers, apiOnline]);

  return (
    <div className="app-shell">
      <ToastContainer toasts={toasts} />

      
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="brand-text">
            <h1>Customer Management</h1>
            <p>Manage your contacts in one place</p>
          </div>
        </div>

        <div className="topbar-right">
          <div className="stat-badge">
            Total <span>{customers.length}</span>
          </div>
          <div className="stat-badge">
            Today <span>{customers.filter((c) => c.createdAt?.startsWith(todayStr())).length}</span>
          </div>
          <button className="refresh-btn" type="button" onClick={fetchAll}>
            <svg viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <main>
       
        <section className="metrics-grid" aria-label="Customer summary">
          {metrics.map((m) => (
            <div className={`metric-card ${m.tone}`} key={m.label}>
              <div className="metric-label">{m.label}</div>
              <div
                className="metric-value"
                style={m.small ? { fontSize: 15, paddingTop: 4 } : undefined}
              >
                {m.value}
              </div>
              <div className="metric-sub">{m.sub}</div>
            </div>
          ))}
        </section>

        <section className="workspace-grid">
          <CustomerForm onAdded={handleAdded} showToast={showToast} />
          <CustomerTable
            customers={customers}
            loading={loadingTable}
            onDeleted={handleDeleted}
            showToast={showToast}
          />
        </section>
      </main>
    </div>
  );
}
