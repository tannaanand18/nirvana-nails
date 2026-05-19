# Nirvana Nails — deployment & setup

## Vercel environment variables

Required Firebase vars (same as before) **plus**:

```
VITE_ADMIN_EMAILS=your@gmail.com
```

Comma-separated emails that get **admin** access when signing in with name + email (no password).

## Auth (new)

- **Sign in:** name + email only at `/login` — no password, no Firebase Auth.
- **Users:** `/dashboard` — all treatments, offers, and my appointments.
- **Admin:** `/admin` — appointments, treatments, offers, database reset.

## First-time database setup

1. Add `VITE_ADMIN_EMAILS` with your email in Vercel → redeploy.
2. Sign in at `/login` with that email.
3. Open **Admin → Database → Reset & seed database** (clears old data, adds 6 treatments + 3 offers).

Or locally: first visit auto-seeds if `treatments` collection is empty.

## Deploy

```bash
npm run build
firebase deploy --only hosting,firestore
```

Or: `npm run deploy`

## Collections

| Collection | Purpose |
|------------|---------|
| `users` | name, email, role (`user` \| `admin`) |
| `treatments` | salon services (admin CRUD) |
| `offers` | promotions (admin CRUD) |
| `appointments` | bookings (user create, admin approve) |
| `gallery` | optional images |
| `reviews` | optional reviews |

Old `services` collection is replaced by **`treatments`**.
