# Pyro Town — Crackers Shop

Full-stack site: React/Vite/Tailwind frontend + an Express API backend with
an admin panel for managing everything dynamically.

## What's in here

- **Storefront** (`/`, `/estimate`, `/cart`, `/payment`) — homepage with
  banners/content pulled from the API, a browsable price list with product
  images, a cart, and a demo checkout (QR "payment" → PDF invoice).
- **Admin panel** (`/admin`) — manage products, banners, trusted partners,
  homepage text content, and view/update orders. Protected by login.
- **API** (`server/`) — Express + a JSON-file store (no external database
  needed to run this locally).

## Running it locally

You need two terminals — one for the API, one for the frontend.

### 1. API server

```bash
cd server
npm install
npm run seed     # writes server/data/db.json from the price list (safe to re-run — wipes products/content/banners back to defaults, but NOT existing orders unless the file is deleted first)
npm run dev       # http://localhost:4000
```

Default admin login: **username `admin`, password `admin123`**.
**Change this before putting the site anywhere public** — edit
`server/src/seed.js` (the `bcrypt.hashSync("admin123", 10)` line) and re-seed,
or add a "change password" endpoint later.

Optional `.env` in `server/`:
```
PORT=4000
JWT_SECRET=replace-with-a-long-random-string
```

### 2. Frontend

```bash
npm install
npm run dev       # http://localhost:5173
```

The frontend talks to the API at `http://localhost:4000` by default. To
point it elsewhere (e.g. once deployed), set `VITE_API_URL` in a `.env` file
at the project root.

## Notes on the checkout flow

- **Payment is a demo only.** "Buy Now" generates a QR code encoding a UPI-style
  string, but nothing is actually charged — there's no payment gateway wired
  up. This matches the 2018 Supreme Court order restricting online firecracker
  sales: the flow is meant to collect an estimate/order, not process real
  payment.
- Once "I've Paid" is clicked, the order is marked paid in the backend and a
  PDF invoice is generated client-side and downloaded automatically.
- Orders show up in the admin **Orders** tab, where you can update status
  (pending → paid → fulfilled/cancelled) as you follow up with the customer.

## Product images

Every category ships with a generated placeholder image (colored gradient +
emoji) so the price list looks complete out of the box. Replace them with
real photos any time via **Admin → Products → edit → upload image**.

## Architecture notes

- Data lives in `server/data/db.json` — a single JSON file. Good enough for
  a small storefront; swap `server/src/db.js` for a real database later
  without touching the route files, as long as `db.get()` / `db.save()`
  keep the same shape.
- Uploaded images are written to `server/public/uploads/` and served at
  `/uploads/...`.
- Admin auth is a single hardcoded user with a JWT session (12h expiry) —
  fine for one shop owner managing their own site, not built for multiple
  admin accounts or fine-grained permissions.
