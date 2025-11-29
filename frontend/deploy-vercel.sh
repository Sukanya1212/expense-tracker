#!/bin/bash

echo "🎨 Starting Frontend Deployment to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Get backend URL from user
echo ""
read -p "Enter your Render backend URL (e.g., https://your-backend.onrender.com): " BACKEND_URL

# Create .env.production
echo ""
echo "⚙️  Creating production environment file..."
echo "VITE_API_URL=$BACKEND_URL/api" > .env.production

# Test build
echo ""
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Your app is now live on Vercel"
echo "2. Update backend CORS to include your Vercel domain"
echo "3. Test the application thoroughly"
