#!/bin/bash

echo "🚀 Starting Backend Deployment to Heroku..."
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null
then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login to Heroku
echo "📝 Logging in to Heroku..."
heroku login

# Get app name from user
echo ""
read -p "Enter your Heroku app name (e.g., expense-tracker-api-yourname): " APP_NAME

# Create Heroku app
echo ""
echo "🔨 Creating Heroku app: $APP_NAME"
heroku create $APP_NAME

# Get MongoDB URI from user
echo ""
echo "📊 MongoDB Configuration"
read -p "Enter your MongoDB Atlas connection string: " MONGO_URI

# Set environment variables
echo ""
echo "⚙️  Setting environment variables..."
heroku config:set MONGO_URI="$MONGO_URI" --app $APP_NAME
heroku config:set JWT_SECRET="mysecretkey123" --app $APP_NAME
heroku config:set NODE_ENV="production" --app $APP_NAME

# Initialize git if needed
if [ ! -d .git ]; then
    echo ""
    echo "📦 Initializing Git repository..."
    git init
fi

# Add and commit files
echo ""
echo "📝 Committing files..."
git add .
git commit -m "Deploy backend to Heroku"

# Add Heroku remote
heroku git:remote -a $APP_NAME

# Deploy to Heroku
echo ""
echo "🚀 Deploying to Heroku..."
git push heroku main || git push heroku master

# Show app URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your backend is live at: https://$APP_NAME.herokuapp.com"
echo ""
echo "🧪 Test your API:"
echo "curl https://$APP_NAME.herokuapp.com/api/health"
echo ""
echo "📋 View logs:"
echo "heroku logs --tail --app $APP_NAME"
