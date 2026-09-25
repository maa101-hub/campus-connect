# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


---

## 🚀 Deploying the frontend to Vercel (independent backend services)

The API gateway has been removed. The two backend services are deployed
independently (e.g. on Render) and the frontend reaches them like this:

| Path            | Goes to      | How                         |
|-----------------|--------------|-----------------------------|
| `/api/posts/**` | post-service | Vercel rewrite (same-origin)|
| `/api/**`       | user-service | Vercel rewrite (same-origin)|
| `/uploads/**`   | user-service | Vercel rewrite (same-origin)|
| `/ws` (chat)    | user-service | Direct URL via `VITE_WS_URL`|

REST calls stay **same-origin** through Vercel rewrites, so no CORS setup is
needed on the backend. Only the WebSocket connects directly (it already allows
all origins via SockJS).

### 1. Backend service URLs

These are wired into [`vercel.json`](./vercel.json):

- **post-service:** `https://campus-connect-3-3xwb.onrender.com`
- **user-service:** `https://campus-connect-2-wszu.onrender.com`

If your Render URLs change, update `vercel.json` accordingly.

### 2. Vercel project settings

- **Root Directory:** `frontend/campusconnect`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3. Environment variables (Vercel → Settings → Environment Variables)

| Variable       | Value                                             | Why |
|----------------|---------------------------------------------------|-----|
| `VITE_API_URL` | *(leave empty)*                                   | REST uses relative paths handled by the rewrites |
| `VITE_WS_URL`  | `https://campus-connect-2-wszu.onrender.com`      | WebSocket connects directly to user-service |

> Vercel rewrites do **not** support WebSockets, which is why `/ws` points
> straight at the user-service URL via `VITE_WS_URL`.

### 4. Backend env vars (on Render)

Set these on **both** services so they start without the gateway/Eureka:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET` (must be identical on both services)
- **user-service only:** `MAIL_USERNAME`, `MAIL_PASSWORD` (Gmail app password) so OTP emails send
- Eureka is optional and disabled by default. You do **not** need to deploy the
  discovery-server. To re-enable it, set `EUREKA_ENABLED=true` and `EUREKA_URL`.
