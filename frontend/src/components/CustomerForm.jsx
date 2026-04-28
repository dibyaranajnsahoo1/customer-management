import React, { useMemo, useState } from 'react';
import { addCustomer } from '../api/customerApi';

const INITIAL_FORM   = { name: '', email: '', phone: '' };
const INITIAL_ERRORS = { name: '', email: '', phone: '' };

function validate(field, value) {
  const v = value.trim();
  switch (field) {
    case 'name':
      return v.length >= 2 ? '' : 'Name must be at least 2 characters.';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.';
    case 'phone':
      return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v)
        ? ''
        : 'Enter a valid phone number.';
    default:
      return '';
  }
}

const FIELDS = [
  {
    name: 'name',
    label: 'Full name',
    type: 'text',
    placeholder: 'John Doe',
    autoComplete: 'name',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    name: 'email',
    label: 'Email address',
    type: 'email',
    placeholder: 'john@example.com',
    autoComplete: 'email',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    name: 'phone',
    label: 'Phone number',
    type: 'tel',
    placeholder: '9876543210',
    autoComplete: 'tel',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.07 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
      </svg>
    ),
  },
];

export default function CustomerForm({ onAdded, showToast }) {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [loading, setLoading] = useState(false);

  const completion = useMemo(() => {
    const filled = Object.values(form).filter((v) => v.trim()).length;
    return Math.round((filled / Object.keys(form).length) * 100);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name:  validate('name',  form.name),
      email: validate('email', form.email),
      phone: validate('phone', form.phone),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await addCustomer(form);
      onAdded(res.data);
      setForm(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
      showToast(`${res.data.name} added successfully.`, 'success');
    } catch (err) {
      if (err.errors) {
        setErrors((prev) => ({ ...prev, ...err.errors }));
        showToast('Please fix the highlighted fields.', 'error');
      } else {
        showToast(err.message || 'Failed to add customer.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="panel form-panel" aria-label="Add customer">
      <p className="panel-title">Add customer</p>
      <p className="panel-desc">Fill in the details to create a new record.</p>

      <div className="progress-bar" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${completion}%` }} />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {FIELDS.map((field) => (
          <div className="form-group" key={field.name}>
            <label className="form-label" htmlFor={field.name}>
              {field.label}
            </label>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden="true">
                {field.icon}
              </span>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                className={`form-input${errors[field.name] ? ' error' : ''}`}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete={field.autoComplete}
                disabled={loading}
              />
            </div>
            {errors[field.name] && (
              <span className="form-error" role="alert">
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Adding…
            </>
          ) : (
            <>
          
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add customer
            </>
          )}
        </button>
      </form>
    </aside>
  );
}
