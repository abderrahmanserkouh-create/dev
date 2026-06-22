# Xưởng May Nhà Công

Full-stack e‑commerce platform for a garment factory / uniform tailor — rebuilt from Luon Vuituoi (streetwear) into a production‑ready React + Express + MySQL application.

## Stack
- **Frontend**: React 19, React Router 7, Vite 8, Axios
- **Backend**: Node.js, Express 4, MySQL (mysql2)
- **Auth**: JWT + bcryptjs
- **Roles**: admin, customer

## Quick Start

```bash
# Database
mysql -u root < backend/database/schema.sql

# Backend (port 5000)
cd backend
cp .env.example .env
npm install
node database/seed.js
node server.js

# Frontend (port 5173)
cd frontend
npm install
npm run dev
```

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@xuongmaynhacong.com | admin123 |
| Customer | customer@example.com | customer123 |

## Categories (Garment Factory)
Áo Đồng Phục, Áo Sơ Mi, Quần Đồng Phục, Áo Khoác, Veston/Blazer, Đồ Bảo Hộ Lao Động, Phụ Kiện May Mặc

## API Overview
| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/*` | POST/GET/PUT | Register, login, profile |
| `/api/products` | GET/POST | Product listing (public) / create (admin) |
| `/api/products/:id` | GET/PUT/DELETE | Product CRUD |
| `/api/categories` | GET/POST | Active categories / create (admin) |
| `/api/cart` | GET/POST | Cart CRUD (auth) |
| `/api/orders` | POST/GET | Checkout & my orders |
| `/api/favorites/*` | GET/POST | Wishlist |
| `/api/admin/users` | GET/PUT/DELETE | User management (admin) |
| `/api/upload` | POST | Image upload (admin, multer) |

## Deployment (Railway)
Includes `railway.json`, `nixpacks.toml`, `Procfile`, and `backend/scripts/postinstall.js`.
