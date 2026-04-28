const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let customers = [];

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone) =>
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
  });
});

app.get('/customers', (req, res) => {
  const sorted = [...customers].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json({
    success: true,
    count: sorted.length,
    data: sorted,
  });
});

app.post('/customers', (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
  const errors = {};

  if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!validateEmail(email)) {
    errors.email = 'A valid email address is required.';
  }

  if (!validatePhone(phone)) {
    errors.phone = 'A valid phone number is required.';
  }

  if (email && customers.some((customer) => customer.email === email)) {
    errors.email = 'A customer with this email already exists.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const newCustomer = {
    id: uuidv4(),
    name,
    email,
    phone,
    createdAt: new Date().toISOString(),
  };

  customers.push(newCustomer);

  res.status(201).json({
    success: true,
    message: 'Customer added successfully.',
    data: newCustomer,
  });
});

app.delete('/customers/:id', (req, res) => {
  const index = customers.findIndex((customer) => customer.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found.',
    });
  }

  const deleted = customers.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Customer "${deleted.name}" deleted successfully.`,
    data: deleted,
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Customer API running at http://localhost:${PORT}`);
  console.log('GET    /health');
  console.log('GET    /customers');
  console.log('POST   /customers');
  console.log('DELETE /customers/:id');
});
