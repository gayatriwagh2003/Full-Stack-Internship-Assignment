# SmartLeads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack.

## Tech Stack
- **Frontend**: React.js, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt

## Features
- JWT Authentication (Login / Register)
- Role-Based Access Control (Admin / Sales)
- Leads CRUD (Create, Read, Update, Delete)
- Filter by Status & Source
- Search by Name or Email (Debounced)
- Sort by Latest / Oldest
- Backend Pagination (10 per page)
- CSV Export
- Responsive UI

## Setup Instructions

### Local Development

**Backend:**
```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd Frantend
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/leads | Yes | Get all leads |
| POST | /api/leads | Admin | Create lead |
| PUT | /api/leads/:id | Admin | Update lead |
| DELETE | /api/leads/:id | Admin | Delete lead |
| GET | /api/leads/export | Yes | Export CSV |

## Environment Variables

See `Backend/.env.example` for required variables.

## Roles
- **admin** — Create, Edit, Delete leads
- **sales** — View leads only

## Author
Name: Your Name
Email: your@email.com