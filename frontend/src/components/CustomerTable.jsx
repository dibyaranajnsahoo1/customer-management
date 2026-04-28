import React, { useMemo, useState } from 'react';
import { deleteCustomer } from '../api/customerApi';
import ConfirmModal from './ConfirmModal';

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(value) {
  if (!value) return 'Just now';
  const d = new Date(value);
  return (
    d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })
  );
}

function SkeletonTable() {
  return (
    <div className="table-wrapper" aria-label="Loading customers">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Added</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td><span className="skeleton-block" style={{ width: 160 }} /></td>
              <td><span className="skeleton-block" style={{ width: 140 }} /></td>
              <td><span className="skeleton-block" style={{ width: 100 }} /></td>
              <td><span className="skeleton-block" style={{ width: 90 }} /></td>
              <td style={{ textAlign: 'right' }}><span className="skeleton-block" style={{ width: 64, marginLeft: 'auto' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CustomerTable({ customers, loading, onDeleted, showToast }) {
  const [search, setSearch]     = useState('');
  const [removing, setRemoving] = useState(null);
  const [modal, setModal]       = useState({ open: false, customer: null });
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
    );
  }, [customers, search]);

  const openModal  = (customer) => setModal({ open: true, customer });
  const closeModal = () => setModal({ open: false, customer: null });

  const handleConfirmDelete = async () => {
    const customer = modal.customer;
    closeModal();
    setDeleting(customer.id);

    try {
      await deleteCustomer(customer.id);
    } catch {
      showToast('Failed to delete customer.', 'error');
      setDeleting(null);
      return;
    }

    setRemoving(customer.id);
    window.setTimeout(() => {
      onDeleted(customer.id);
      setRemoving(null);
      setDeleting(null);
      showToast(`${customer.name} removed.`, 'info');
    }, 260);
  };

  const subtitle =
    customers.length === 0
      ? 'No saved records yet'
      : `${filtered.length} of ${customers.length} records`;

  return (
    <section className="panel table-panel" aria-label="Customer directory">
      
      <ConfirmModal
        open={modal.open}
        customerName={modal.customer?.name}
        onCancel={closeModal}
        onConfirm={handleConfirmDelete}
      />

      <div className="table-top">
        <div>
          <span className="panel-title">
            All customers
            <span className="count-pill">{filtered.length}</span>
          </span>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{subtitle}</p>
        </div>

        <label className="search-bar" htmlFor="search-customers">
          
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="search-customers"
            className="search-input"
            type="search"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={customers.length === 0}
          />
        </label>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3>No customers yet</h3>
          <p>Add the first customer from the form and it will appear here instantly.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3>No matching records</h3>
          <p>Try a different name, email address, or phone number.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className={removing === c.id ? 'removing' : ''}
                >
                  <td>
                    <div className="cell-name">
                      <div className="avatar" aria-hidden="true">
                        {getInitials(c.name)}
                      </div>
                      <span className="customer-name">{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <a className="email-link" href={`mailto:${c.email}`}>
                      {c.email}
                    </a>
                  </td>
                  <td>
                    <a className="phone-link" href={`tel:${c.phone}`}>
                      {c.phone}
                    </a>
                  </td>
                  <td>
                    <span className="date-text">{formatDate(c.createdAt)}</span>
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      type="button"
                      disabled={deleting === c.id}
                      onClick={() => openModal(c)}
                      title="Delete customer"
                    >
                      {deleting === c.id ? (
                        <span className="spinner-dark" aria-hidden="true" />
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      )}
                      {deleting === c.id ? 'Deleting' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
