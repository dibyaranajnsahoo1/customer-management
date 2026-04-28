# Simple Customer Management Dashboard

Full-stack customer management assignment with a React frontend and an Express backend.

## Apps

- `frontend/` - React + Vite dashboard UI
- `backend/` - Express REST API

## Quick Start

Open two terminals.

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- Customers API: `http://localhost:5000/customers`


## What The App Does

- Adds customers with name, email, and phone number
- Validates input on the frontend and backend
- Prevents duplicate email records
- Lists customers newest first
- Searches customers by name, email, or phone
- Deletes customers after confirmation
- Shows loading, empty, success, and error states

# Documentation FrontEnd


## Customer Management Frontend

React + Vite frontend for the Simple Customer Management Dashboard. It provides the complete customer workspace UI: summary metrics, add-customer form, searchable customer directory, delete confirmation, loading skeletons, and toast messages.

## Tech Stack

- React 18
- Vite 5
- Plain CSS with responsive layouts
- Fetch API for backend communication

## Features

- Dashboard summary cards for total customers, today's additions, latest record, and API status
- Add customer form with live validation for name, email, and phone number
- Search customers by name, email, or phone
- Delete customers with a second-click confirmation
- Toast notifications for success, error, and info states
- Loading skeleton table while data is being fetched
- Mobile-friendly table layout
- Vite proxy for backend requests

## Folder Structure

```text
frontend/
  public/                 Static browser assets
  src/
    api/
      customerApi.js      Fetch helpers for customer API calls
    components/
      CustomerForm.jsx    Add-customer form and validation UI
      CustomerTable.jsx   Searchable customer directory and delete flow
      Toast.jsx           Toast state hook and toast renderer
    App.jsx               Main dashboard layout and app state
    index.css             Full application styling
    main.jsx              React entry point
  package.json            Scripts and frontend dependencies
  vite.config.js          Vite dev server and proxy configuration
```

## Requirements

- Node.js 18 or newer recommended
- Backend running at `http://localhost:5000`

## Installation

```bash
npm install
```

Dependencies are already listed in `package.json`.

## Run Locally

Start the backend first from the `backend` folder, then run:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Runs the Vite development server on port `3000`.

```bash
npm start
```

Same as `npm run dev`.

```bash
npm run build
```

Creates a production build in the `dist` folder.

```bash
npm run preview
```

Previews the production build locally.

## API Connection

The frontend calls relative API paths:

```text
GET    /customers
POST   /customers
DELETE /customers/:id
```

Vite forwards those requests to the backend through `vite.config.js`:

```js
proxy: {
  '/customers': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

Because of this proxy, components can call `/customers` without hardcoding the backend URL.

## Validation Rules

The UI validates the same fields as the backend:

- Name must be at least 2 characters.
- Email must match a standard email format.
- Phone must match a simple 10+ digit phone format with optional separators.

Backend validation remains the final source of truth, so duplicate email and invalid field errors are also shown in the UI.

## Main Components

- `App.jsx` owns customer data, loading state, API status, summary metrics, and refresh behavior.
- `CustomerForm.jsx` owns form inputs, client-side validation, submit state, and add-customer calls.
- `CustomerTable.jsx` owns search state, empty states, responsive table rendering, and delete confirmation.
- `Toast.jsx` provides `useToast()` and renders notifications.
- `customerApi.js` centralizes all fetch requests and response handling.

## Production Build

```bash
npm run build
```

After a successful build, Vite writes optimized assets to:

```text
frontend/dist
```

## Troubleshooting

- If the dashboard shows `API status: Offline`, start the backend with `npm run dev` inside `backend`.
- If port `3000` is busy, update the Vite port in `package.json` and `vite.config.js`.
- If customers disappear after restarting the backend, that is expected because the backend uses in-memory storage.


## Documentation Backend

# Customer Management Backend

Express API for the Simple Customer Management Dashboard. It stores customer records in memory and exposes endpoints for listing, creating, and deleting customers.

## Tech Stack

- Node.js
- Express
- CORS
- UUID
- Nodemon for local development

## Features

- REST API for customer management
- In-memory customer storage
- UUID-based customer IDs
- Server-side validation for name, email, and phone
- Duplicate email protection
- Newest-first customer sorting
- Health check endpoint
- JSON error responses

## Folder Structure

```text
backend/
  package.json       Backend scripts and dependencies
  package-lock.json  Locked dependency versions
  server.js          Express app, middleware, validation, and routes
```

## Requirements

- Node.js 18 or newer recommended
- npm

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

For production-style execution:

```bash
npm start
```

## Environment Variables

The server uses port `5000` by default. You can override it with:

```bash
PORT=7000 npm start
```

On Windows PowerShell:

```powershell
$env:PORT=7000; npm start
```

If you change the backend port, update the frontend proxy in `frontend/vite.config.js`.

## API Endpoints

### GET `/health`

Checks whether the API is running.

Response:

```json
{
  "success": true,
  "status": "ok",
  "uptime": 12.34
}
```

### GET `/customers`

Returns all customers sorted by newest first.

Response:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "createdAt": "2026-04-27T10:30:00.000Z"
    }
  ]
}
```

### POST `/customers`

Creates a customer.

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

Success response:

```json
{
  "success": true,
  "message": "Customer added successfully.",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "createdAt": "2026-04-27T10:30:00.000Z"
  }
}
```

Validation error response:

```json
{
  "success": false,
  "errors": {
    "email": "A customer with this email already exists."
  }
}
```

### DELETE `/customers/:id`

Deletes a customer by ID.

Success response:

```json
{
  "success": true,
  "message": "Customer \"John Doe\" deleted successfully.",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "createdAt": "2026-04-27T10:30:00.000Z"
  }
}
```

Not found response:

```json
{
  "success": false,
  "message": "Customer not found."
}
```

## Validation Rules

- `name` is required and must be at least 2 characters.
- `email` is required and must be valid.
- `email` must be unique.
- `phone` is required and must match the accepted phone pattern.

## Data Storage

Customer records are stored in the `customers` array inside `server.js`. This is simple and assignment-friendly, but it is not persistent. Restarting the backend clears all customers.

For production, replace the in-memory array with a database such as PostgreSQL, MySQL, MongoDB, or SQLite.

## Troubleshooting

- If `http://localhost:5000/customers` does not respond, confirm the backend is running.
- If the frontend cannot connect, confirm the frontend proxy still points to the same backend port.
- If duplicate email creation fails, that is expected behavior.

## Important Note

The backend uses in-memory storage. Customer records reset whenever the backend process restarts.
