# Store Pulse

Store Pulse is a full-stack store-rating platform. Administrators manage users and stores, users search stores and submit 1-to-5 ratings, and store owners view rating activity for their store.

## Features

- JWT authentication with `ADMIN`, `USER`, and `STORE_OWNER` roles
- bcrypt password hashing, Helmet, CORS, protected routes, and role authorization
- Admin dashboard with statistics, searchable/sortable/paginated users and stores, and user details
- User registration, store search, accessible star ratings, and one rating per user/store
- Store-owner average-rating and customer-rating dashboard
- Client/server validation, loading and error states, responsive Tailwind UI, and toast notifications
- Supabase PostgreSQL schema and idempotent demo seed data

## Tech stack

- Frontend: React 18, Vite, JavaScript, Tailwind CSS, React Router, Axios, Lucide React
- Backend: Node.js, Express, JavaScript, JWT, bcryptjs, Helmet, CORS
- Database: Supabase PostgreSQL through `@supabase/supabase-js`

## Project structure

```text
store-pulse/
├── backend/
│   ├── src/                 Express API
│   ├── supabase/schema.sql  Database schema
│   ├── supabase/seed.sql    Demo data
│   └── .env.example         Backend configuration template
├── frontend/
│   ├── src/                 React application
│   └── .env.example         Frontend configuration template
└── README.md
```

## Prerequisites

Install the following before continuing:

- Node.js 18 or newer, including npm
- A Supabase account and project
- Git, if cloning the repository

Check Node.js and npm:

```bash
node --version
npm --version
```

## Installation

### 1. Get the source code

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd store-pulse
```

If the project is already open locally, start from its root directory, the directory containing `backend`, `frontend`, and this README.

### 2. Create and configure Supabase

1. Create a new project at [supabase.com](https://supabase.com/).
2. In the Supabase dashboard, open **Project Settings > API**.
3. Copy the project URL and the service-role key. The service-role key is server-only and must never be exposed to the frontend.
4. Open the Supabase **SQL Editor** and run [backend/supabase/schema.sql](backend/supabase/schema.sql).
5. Run [backend/supabase/seed.sql](backend/supabase/seed.sql) to create demo users, stores, and ratings.

Run the schema before the seed. The seed is safe to run again because it uses conflict handling for the demo records.

### 3. Configure the backend

From the project root, copy the backend template:

**PowerShell:**

```powershell
Copy-Item backend/.env.example backend/.env
```

**macOS/Linux/Git Bash:**

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and replace the placeholder values:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
```

Use a long, unpredictable value for `JWT_SECRET`. Keep `SUPABASE_SERVICE_ROLE_KEY` private and do not add it to `frontend/.env`.

### 4. Configure the frontend

From the project root, copy the frontend template:

**PowerShell:**

```powershell
Copy-Item frontend/.env.example frontend/.env
```

**macOS/Linux/Git Bash:**

```bash
cp frontend/.env.example frontend/.env
```

The default `frontend/.env` value is sufficient for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Install dependencies

Install each package set from its own directory:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:5000`. The `nodemon` development script restarts the server when backend files change.

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in a browser. Confirm the API is running by opening `http://localhost:5000/health`; it should return:

```json
{"status":"ok"}
```

To stop either process, press `Ctrl+C` in its terminal.

## Production commands

Build the frontend:

```bash
cd frontend
npm run build
npm run preview
```

Start the backend without file watching:

```bash
cd backend
npm start
```

For deployment, set production environment values, use a strong `JWT_SECRET`, restrict `FRONTEND_URL` to the deployed frontend origin, and keep the Supabase service-role key in server-side secrets only.

## Demo accounts

The seed creates these accounts. Every demo password is `Admin@1234`; change or remove these accounts outside development.

| Role | Email |
| --- | --- |
| Administrator | `admin@example.com` |
| Normal user | `user@example.com` |
| Store owner | `owner@example.com` |

## API overview

```text
POST /api/auth/register              Register a normal user
POST /api/auth/login                 Login and receive a JWT
POST /api/auth/logout                Logout endpoint
GET  /api/admin/dashboard            Admin statistics
GET  /api/admin/users                Search, role, sort, order, page, limit
POST /api/admin/users                Create a user
GET  /api/admin/users/:id            Get user details
GET  /api/admin/stores               Search, sort, order, page, limit
POST /api/admin/stores               Create a store
GET  /api/stores                     Search, page, limit
GET  /api/stores/:id                 Get store details
POST /api/ratings                    { storeId, rating }
PUT  /api/ratings/:storeId           { rating }
GET  /api/ratings/my/:storeId        Get current user's rating
GET  /api/owner/dashboard            Store-owner dashboard
PUT  /api/users/password             { currentPassword, newPassword }
GET  /health                          Health check
```

Authenticated requests use `Authorization: Bearer <token>`. Password hashes are never returned by the API.

## Validation rules

- Name: 20-60 characters
- Address: maximum 400 characters
- Password: 8-16 characters, including one uppercase letter and one special character
- Email: valid email format
- Rating: integer from 1 to 5

## Troubleshooting

- **Supabase request fails:** verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then confirm that `schema.sql` was run before `seed.sql`.
- **Frontend cannot reach the API:** confirm the backend is running on port 5000 and that `VITE_API_URL` matches it. Restart Vite after changing `frontend/.env`.
- **CORS errors:** set `FRONTEND_URL` to the exact frontend origin, including the port, and restart the backend.
- **JWT errors after restarting:** keep `JWT_SECRET` unchanged for existing sessions, or log in again after changing it.
- **Port already in use:** change `PORT` in `backend/.env` and update `VITE_API_URL` to use the same backend port.