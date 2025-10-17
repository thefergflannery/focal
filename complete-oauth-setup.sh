#!/bin/bash

echo "🍀 Completing Focloireacht OAuth Setup"
echo "====================================="
echo ""

# Load environment variables
source .env.local

# Check if client secret is configured
if [[ "$GOOGLE_CLIENT_SECRET" == "REPLACE_WITH_YOUR_CLIENT_SECRET" ]]; then
    echo "❌ Google Client Secret not configured yet!"
    echo ""
    echo "📋 Please:"
    echo "1. Get your Client Secret from Google Cloud Console"
    echo "2. Edit .env.local and replace REPLACE_WITH_YOUR_CLIENT_SECRET"
    echo "3. Run this script again"
    echo ""
    exit 1
fi

echo "✅ All OAuth credentials configured"
echo ""

# Test OAuth configuration
echo "🧪 Testing OAuth configuration..."
node test-oauth-config.js

echo ""
echo "🚀 Starting Focloireacht with full OAuth support..."
echo "Visit: http://localhost:3000"
echo ""
echo "🔐 You can now:"
echo "- Sign in with Google"
echo "- Submit new Irish words"
echo "- Vote on definitions"
echo "- Access editor features (if you have EDITOR role)"
echo ""

# Start development server with full environment
export DATABASE_URL="postgresql://neondb_owner:npg_LCe0pQUs4kDZ@ep-soft-violet-ab529xjn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run dev


