import React from 'react';

export default function ConfirmModal({ open, customerName, onCancel, onConfirm }) {
  return (
    <div className={`modal-backdrop${open ? ' open' : ''}`} onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <h3>Delete customer?</h3>
        <p>
          Are you sure you want to remove <strong>{customerName}</strong>? This
          action cannot be undone.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-confirm-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
