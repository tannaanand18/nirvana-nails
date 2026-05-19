# Deploying Nirvana Nails (Vercel)

## 1. Root directory

If this repo contains the `project/` folder as the Vite app, set **Vercel → Settings → General → Root Directory** to `project` (or move these files to the repo root).

## 2. Environment variables (required for auth / Firestore)

In **Vercel → Project → Settings → Environment Variables**, add the same keys you use locally in `.env` (must be prefixed with `VITE_` so Vite exposes them to the browser):

| Name | Example |
|------|---------|
| `VITE_FIREBASE_API_KEY` | from Firebase console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | your project id |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-app.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | numeric id |
| `VITE_FIREBASE_APP_ID` | `1:...:web:...` |

Optional (SEO canonical URLs in production):

| `VITE_SITE_URL` | `https://your-deployment.vercel.app` |

Redeploy after saving variables (**Deployments → Redeploy**).

## 3. SPA routing

`vercel.json` in this folder rewrites all paths to `index.html` so React Router works on refresh.

## 4. Common “blank black page” causes (fixed in code)

1. **`ScrollRestoration` inside `BrowserRouter`** — crashes at runtime. Do not use it unless you migrate to `createBrowserRouter` / `RouterProvider`.
2. **Missing `VITE_FIREBASE_*` on Vercel** — Firebase `initializeApp` used to throw during import. The app now stays usable and shows a top banner until env is set.

## 5. Build locally

```bash
cd project
npm ci
npm run build
npm run preview
```

If `npm run build` fails with an **esbuild version** error on Windows, run `npm rebuild esbuild` and try again.
