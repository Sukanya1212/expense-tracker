# 🚀 COPY-PASTE DEPLOYMENT COMMANDS

This file contains all commands you need to deploy your Expense Tracker application.
Simply copy and paste these commands in order.

================================================================================
PART 1: BACKEND DEPLOYMENT TO RENDER
================================================================================

## Step 1: Prepare repository
```bash
cd backend
npm run build   # verify TypeScript compiles
```

## Step 2: Push to GitHub (if not already)
Push the repo to your GitHub account. Render connects to GitHub for auto-deploy.

## Step 3: Create the service on Render (Dashboard recommended)
1) Go to https://dashboard.render.com → New → Web Service
2) Connect your GitHub account and select the `expense-tracker` repo
3) Configure the service:
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment**: Node
4) Add environment variables in Render (do NOT store secrets in the repo):
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — your JWT signing secret
   - `NODE_ENV=production`
5) Enable Auto-Deploy (recommended)

## Alternative: Use Render CLI
Install the Render CLI and create the service (example; customize owner/repo):
```bash
npm i -g @render/cli
render login
render services create \
  --name expense-tracker-backend \
  --type web \
  --env node \
  --repo https://github.com/<owner>/expense-tracker \
  --branch main \
  --build-command "npm install && npm run build" \
  --start-command "npm run start"
```

## Verify deployment
Use the URL Render provides (example `https://your-backend.onrender.com`):
```bash
curl https://your-backend.onrender.com/api/health
```

================================================================================
PART 2: FRONTEND DEPLOYMENT TO VERCEL
================================================================================

## Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

## Step 2: Create Production Environment File
Replace with your actual Render backend URL:
```bash
echo VITE_API_URL=https://your-backend.onrender.com/api > .env.production
```

For Windows PowerShell:
```powershell
"VITE_API_URL=https://your-backend.onrender.com/api" | Out-File -FilePath .env.production -Encoding utf8
```

## Step 3: Test Production Build Locally
```bash
npm run build
npm run preview
```

## Step 4: Deploy to Vercel
```bash
npm install -g vercel    # if needed
vercel --prod
```

Follow the prompts when deploying via CLI, or use the Vercel dashboard to import the repo and set `VITE_API_URL` as an environment variable.

================================================================================
PART 3: UPDATE BACKEND CORS (IMPORTANT)
================================================================================

After deploying the frontend, update the backend CORS to include your Vercel origin.

Edit `backend/src/server.ts` and replace:
```typescript
app.use(cors());
```
with:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app'
  ],
  credentials: true
}));
```

Then push changes to GitHub (Render will auto-deploy):
```bash
cd backend
git add .
git commit -m "Update CORS for production"
git push origin main
```

================================================================================
VERIFICATION CHECKLIST
================================================================================

## Backend Tests:
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Signup test
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

## Frontend Tests:
1. Open your Vercel URL
2. Signup/Login
3. Add transactions and verify dashboard

================================================================================
TROUBLESHOOTING
================================================================================

## Check Render logs (Dashboard recommended)
- View logs for the service in Render Dashboard → Service → Logs
## Render CLI logs (optional)
```bash
render logs <service-name>
```

================================================================================
MONGODB ATLAS CONFIGURATION
================================================================================

Make sure your MongoDB Atlas is configured correctly:

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access"
3. Add IP Address: 0.0.0.0/0 (Allow from anywhere)
4. Click "Database Access"
5. Ensure your user has appropriate permissions

================================================================================
REDEPLOYMENT (FUTURE UPDATES)
================================================================================

## Backend Updates:
```bash
cd backend
git add .
git commit -m "Your update message"
git push origin main
```

## Frontend Updates:
```bash
cd frontend
git add .
git commit -m "Your update message"
vercel --prod
```

================================================================================
FINAL URLS
================================================================================

After successful deployment, you'll have:

Backend API: https://your-backend.onrender.com
Frontend App: https://your-frontend.vercel.app

================================================================================

================================================================================
