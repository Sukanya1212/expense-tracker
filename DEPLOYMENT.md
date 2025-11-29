# 🚀 Deployment Guide - Expense Tracker (Render + Vercel)

This guide explains how to deploy the backend to Render and the frontend to Vercel.

---

## 📋 Prerequisites

- Git repository pushed to GitHub
- MongoDB Atlas connection string
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- (Optional) Vercel CLI: `npm i -g vercel`

---

## 🔧 Part 1: Backend Deployment (Render)

The backend already has build/start scripts in `backend/package.json`:

```json
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Recommended approach: use the Render dashboard (UI) to create a Web Service and enable Auto-Deploy from GitHub.

Quick steps (Dashboard):
1) Push your repo to GitHub.
2) Dashboard → New → Web Service → Connect GitHub → select repo.
3) Configure:
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4) Add env vars in Render (Settings → Environment): `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`.
5) Enable Auto-Deploy.

Optional: use `backend/render.yaml` for infra-as-code or the Render CLI to create services.

---

## 🎨 Part 2: Frontend Deployment (Vercel)

Create a `.env.production` in `frontend` with your Render backend URL:

```bash
cd frontend
echo VITE_API_URL=https://your-backend.onrender.com/api > .env.production
```

Build & preview locally:

```bash
npm run build
npm run preview
```

Deploy to Vercel (dashboard or `vercel --prod`). In the Vercel dashboard, set `VITE_API_URL` to your backend URL.

---

## 🔄 Update Backend CORS

Edit `backend/src/server.ts` and allow your Vercel domain:

```ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app'
  ],
  credentials: true
}));
```

Push the change to GitHub (Render will auto-deploy):

```bash
cd backend
git add .
git commit -m "Update CORS for production"
git push origin main
```

---

## ✅ Testing

Health check:

```bash
curl https://your-backend.onrender.com/api/health
```

Signup test:

```bash
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

---

## 🐛 Troubleshooting

- Check Render service logs in the Render dashboard (recommended).
- Render CLI logs: `render logs <service-name>`
- Ensure `MONGO_URI` is correct and MongoDB Atlas network access allows connections.

---

## 🔄 Redeployment

Backend updates:
```bash
cd backend
git add .
git commit -m "Your update message"
git push origin main
```

Frontend updates:
```bash
cd frontend
git add .
git commit -m "Your update message"
vercel --prod
```

---

## Final URLs (examples)

- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-project.vercel.app`

---

If you want, I can also remove the old CI/docs files or generate a short README snippet with exact Render dashboard steps.
