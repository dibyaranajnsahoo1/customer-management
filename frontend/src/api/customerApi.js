
const BASE = import.meta.env.VITE_API_BASE;

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
};

export const getCustomers = () =>
  fetch(`${BASE}/customers`).then(handleResponse);

export const addCustomer = (payload) =>
  fetch(`${BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const deleteCustomer = (id) =>
  fetch(`${BASE}/customers/${id}`, { method: 'DELETE' }).then(handleResponse);
