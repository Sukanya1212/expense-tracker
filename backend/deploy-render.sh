#!/bin/bash

echo "🚀 Backend Deployment Helper for Render.com"
echo "This script helps set up a Render service for the backend."
echo "It does not store secrets in the repo — set them in the Render dashboard."
echo ""

if ! command -v render &> /dev/null
then
    echo "🔧 Render CLI not found. You can deploy via the Render web UI or install the CLI:" 
    echo "    npm i -g @render/cli"
    echo ""
    echo "This repo also contains a 'render.yaml' at 'backend/render.yaml' you can use for Render's GitHub import (Infrastructure as Code)."
    echo ""
fi

echo "Recommended steps to deploy on Render:"
echo "1) Push your repo to GitHub (if not already)."
echo "2) In Render dashboard, click 'New' → 'Web Service' → 'Connect a repository'."
echo "3) Choose 'expense-tracker' repo, branch 'main', and set the build/start commands:" 
echo "     Build Command: npm install && npm run build"
echo "     Start Command: npm run start"
echo "4) Add environment variables in Render (MONGO_URI, JWT_SECRET, NODE_ENV=production)."
echo "5) Enable Auto-Deploy (recommended)."
echo ""
echo "Optional: create the service from CLI (example, customize repo/owner):"
echo "  render login"
echo "  render services create --name expense-tracker-backend --type web --env node --repo https://github.com/<owner>/expense-tracker --branch main --build-command \"npm install && npm run build\" --start-command \"npm run start\""
echo ""
echo "Note: The CLI command above may require additional flags and an authenticated session."
echo ""
echo "Done. See 'backend/render.yaml' for render configuration you can import." 
