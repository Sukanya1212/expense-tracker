# 🚀 COPY-PASTE DEPLOYMENT COMMANDS

This file contains all commands you need to deploy your Expense Tracker application.
Simply copy and paste these commands in order.

================================================================================
PART 1: BACKEND DEPLOYMENT TO HEROKU
================================================================================

## Step 1: Navigate to Backend Directory
```bash
cd backend
```

## Step 2: Login to Heroku (Browser will open)
```bash
heroku login
```

## Step 3: Create Heroku App
Replace 'yourname' with your actual name or unique identifier:
```bash
heroku create expense-tracker-api-yourname
```

## Step 4: Set Environment Variables
⚠️ IMPORTANT: Replace the MongoDB URI with your actual connection string!
```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="mysecretkey123"
heroku config:set NODE_ENV="production"
```

## Step 5: Build TypeScript (Test locally first)
```bash
npm run build
```

## Step 6: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial backend deployment"
```

## Step 7: Deploy to Heroku
```bash
git push heroku main
```

If your branch is 'master' instead of 'main':
```bash
git push heroku master
```

## Step 8: Verify Deployment
```bash
heroku open
heroku logs --tail
```

## Step 9: Test Backend API
Replace 'your-app-name' with your actual Heroku app name:
```bash
curl https://your-app-name.herokuapp.com/api/health
```

✅ Your backend URL: https://your-app-name.herokuapp.com

================================================================================
PART 2: FRONTEND DEPLOYMENT TO VERCEL
================================================================================

## Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

## Step 2: Create Production Environment File
⚠️ IMPORTANT: Replace with your actual Heroku backend URL!
```bash
echo VITE_API_URL=https://your-app-name.herokuapp.com/api > .env.production
```

For Windows PowerShell:
```powershell
"VITE_API_URL=https://your-app-name.herokuapp.com/api" | Out-File -FilePath .env.production -Encoding utf8
```

## Step 3: Test Production Build Locally
```bash
npm run build
npm run preview
```

## Step 4: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

## Step 5: Login to Vercel
```bash
vercel login
```

## Step 6: Deploy to Vercel
```bash
vercel --prod
```

Follow the prompts:
- Set up and deploy? → Y
- Which scope? → Select your account
- Link to existing project? → N
- Project name? → expense-tracker-frontend
- Directory? → ./ (press Enter)
- Override settings? → N

✅ Your frontend will be live at: https://expense-tracker-frontend.vercel.app

================================================================================
PART 3: UPDATE BACKEND CORS (IMPORTANT!)
================================================================================

After deploying frontend, you need to update backend CORS settings.

## Step 1: Edit backend/src/server.ts

Find this line:
```typescript
app.use(cors());
```

Replace with (use your actual Vercel URL):
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://expense-tracker-frontend.vercel.app',
    'https://your-custom-domain.vercel.app'
  ],
  credentials: true
}));
```

## Step 2: Redeploy Backend
```bash
cd backend
git add .
git commit -m "Update CORS for production"
git push heroku main
```

================================================================================
ALTERNATIVE: VERCEL DEPLOYMENT VIA WEB DASHBOARD
================================================================================

If you prefer using the web interface:

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. Add Environment Variable:
   - Name: VITE_API_URL
   - Value: https://your-app-name.herokuapp.com/api
6. Click "Deploy"

================================================================================
VERIFICATION CHECKLIST
================================================================================

After deployment, test these:

## Backend Tests:
```bash
# Health check
curl https://your-app-name.herokuapp.com/api/health

# Signup test
curl -X POST https://your-app-name.herokuapp.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

## Frontend Tests:
1. Open https://your-frontend.vercel.app
2. ✅ Signup works
3. ✅ Login works
4. ✅ Add transaction works
5. ✅ Dashboard shows charts
6. ✅ Filters work
7. ✅ Edit/Delete works

================================================================================
TROUBLESHOOTING COMMANDS
================================================================================

## View Heroku Logs:
```bash
heroku logs --tail --app your-app-name
```

## Check Heroku Config:
```bash
heroku config --app your-app-name
```

## Restart Heroku App:
```bash
heroku restart --app your-app-name
```

## Check Heroku Dyno Status:
```bash
heroku ps --app your-app-name
```

## Redeploy Frontend:
```bash
cd frontend
vercel --prod
```

## View Vercel Logs:
Visit: https://vercel.com/dashboard

================================================================================
MONGODB ATLAS CONFIGURATION
================================================================================

Make sure your MongoDB Atlas is configured correctly:

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access"
3. Add IP Address: 0.0.0.0/0 (Allow from anywhere)
4. Click "Database Access"
5. Ensure your user has "Read and write to any database" permission

================================================================================
REDEPLOYMENT (FUTURE UPDATES)
================================================================================

## Backend Updates:
```bash
cd backend
git add .
git commit -m "Your update message"
git push heroku main
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

Backend API: https://your-app-name.herokuapp.com
Frontend App: https://your-frontend.vercel.app

Share these URLs and start tracking expenses! 💰📊

================================================================================
