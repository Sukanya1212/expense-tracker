# 🚀 Deployment Guide - Expense Tracker MERN Application

Complete step-by-step guide to deploy your Expense Tracker application to Heroku (Backend) and Vercel (Frontend).

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- ✅ [Vercel CLI](https://vercel.com/download) installed (optional, can use web dashboard)
- ✅ Git installed and initialized in your project
- ✅ MongoDB Atlas account with connection string ready
- ✅ Heroku account created
- ✅ Vercel account created

---

## 🔧 Part 1: Backend Deployment (Heroku)

### Step 1: Prepare Backend for Deployment

The backend is already configured with:
- ✅ `Procfile` - Tells Heroku how to start the app
- ✅ TypeScript build configuration
- ✅ Node.js version specified in `package.json`

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create Heroku App

```bash
cd backend
heroku create expense-tracker-api-yourname
```

Replace `yourname` with your name or unique identifier.

### Step 4: Set Environment Variables

```bash
heroku config:set MONGO_URI="your_mongodb_atlas_connection_string_here"
heroku config:set JWT_SECRET="mysecretkey123"
heroku config:set NODE_ENV="production"
```

**Important**: Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string.

### Step 5: Deploy to Heroku

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial backend deployment"

# Deploy to Heroku
git push heroku main
```

If your branch is named `master` instead of `main`:
```bash
git push heroku master
```

### Step 6: Verify Backend Deployment

```bash
# Open the app in browser
heroku open

# Check logs
heroku logs --tail

# Test health endpoint
curl https://your-heroku-app.herokuapp.com/api/health
```

Your backend URL will be: `https://your-heroku-app.herokuapp.com`

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend API URL

Create a `.env.production` file in the `frontend` directory:

```bash
cd ../frontend
```

Create `.env.production`:
```env
VITE_API_URL=https://your-heroku-app.herokuapp.com/api
```

Replace `your-heroku-app.herokuapp.com` with your actual Heroku backend URL.

### Step 2: Test Production Build Locally

```bash
npm run build
npm run preview
```

This ensures the build works before deploying.

### Step 3: Deploy to Vercel (Option A: CLI)

```bash
# Install Vercel CLI globally if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `expense-tracker-frontend`
- Directory? `./` (current directory)
- Override settings? **N**

### Step 3: Deploy to Vercel (Option B: Web Dashboard)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-heroku-app.herokuapp.com/api`
6. Click "Deploy"

### Step 4: Verify Frontend Deployment

Your frontend will be live at: `https://your-project.vercel.app`

---

## 🔄 Part 3: Update Backend CORS

After deploying frontend, update backend CORS to allow your Vercel domain.

Edit `backend/src/server.ts`:

```typescript
// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app'
  ],
  credentials: true
}));
```

Then redeploy backend:
```bash
cd backend
git add .
git commit -m "Update CORS for production"
git push heroku main
```

---

## ✅ Part 4: Testing Deployment

### Test Backend APIs

```bash
# Health check
curl https://your-heroku-app.herokuapp.com/api/health

# Test signup (should work)
curl -X POST https://your-heroku-app.herokuapp.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Frontend

1. Open `https://your-project.vercel.app`
2. Create a new account (Signup)
3. Login with credentials
4. Add income and expense transactions
5. View dashboard charts
6. Test filters and search
7. Edit and delete transactions

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: App crashes on Heroku
```bash
# Check logs
heroku logs --tail

# Common fixes:
# 1. Ensure MONGO_URI is set correctly
heroku config:get MONGO_URI

# 2. Ensure build succeeded
heroku run bash
ls dist/  # Should show compiled JS files
```

**Problem**: MongoDB connection fails
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check connection string format
- Ensure database user has correct permissions

### Frontend Issues

**Problem**: API calls fail (CORS errors)
- Ensure backend CORS includes your Vercel domain
- Check `VITE_API_URL` environment variable in Vercel dashboard
- Redeploy frontend after changing env vars

**Problem**: Routes don't work (404 on refresh)
- Ensure `vercel.json` is present with rewrite rules
- Redeploy if needed

---

## 🔐 Environment Variables Summary

### Backend (Heroku)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=mysecretkey123
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-heroku-app.herokuapp.com/api
```

---

## 📝 Deployment Checklist

### Backend
- [ ] Heroku app created
- [ ] Environment variables set
- [ ] Code pushed to Heroku
- [ ] Build successful
- [ ] MongoDB connected
- [ ] Health endpoint working
- [ ] CORS configured

### Frontend
- [ ] Vercel project created
- [ ] Environment variable set
- [ ] Build successful
- [ ] Deployed to production
- [ ] API calls working
- [ ] Routing working

### Testing
- [ ] Signup works
- [ ] Login works
- [ ] Add transaction works
- [ ] Dashboard displays charts
- [ ] Filters work
- [ ] Edit/Delete works

---

## 🔄 Redeployment

### Backend Updates
```bash
cd backend
git add .
git commit -m "Your update message"
git push heroku main
```

### Frontend Updates
```bash
cd frontend
git add .
git commit -m "Your update message"
git push origin main  # Vercel auto-deploys from Git
```

Or using Vercel CLI:
```bash
vercel --prod
```

---

## 📊 Monitoring

### Heroku
```bash
# View logs
heroku logs --tail

# Check dyno status
heroku ps

# Restart app
heroku restart
```

### Vercel
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- View deployment logs
- Check analytics
- Monitor performance

---

## 💰 Cost Considerations

### Free Tier Limits

**Heroku Free Tier** (Eco Dynos - $5/month):
- 1000 dyno hours/month
- Sleeps after 30 min of inactivity
- Wakes up on request (slight delay)

**Vercel Free Tier**:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless functions included

**MongoDB Atlas Free Tier**:
- 512MB storage
- Shared cluster
- Perfect for development/small apps

---

## 🎉 Success!

Your Expense Tracker is now live!

**Backend**: `https://your-heroku-app.herokuapp.com`  
**Frontend**: `https://your-project.vercel.app`

Share your app and start tracking expenses! 💰📊

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Heroku/Vercel logs
3. Verify environment variables
4. Test API endpoints individually
5. Check MongoDB Atlas network access

---

**Happy Deploying! 🚀**
