#!/bin/bash

# Focloireacht Setup Script
echo "🍀 Setting up Focloireacht - Irish Language Dictionary"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the focloireacht directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npm run db:generate

echo "📊 Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL not set"
    echo "   Please set up your database first:"
    echo "   1. Create a Supabase project at https://supabase.com"
    echo "   2. Get your connection string"
    echo "   3. Set DATABASE_URL environment variable"
    echo "   4. Enable pg_trgm extension in your database"
    echo ""
    echo "   Example:"
    echo "   export DATABASE_URL='postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres'"
    echo ""
else
    echo "✅ DATABASE_URL is set"
    echo "🗄️  Pushing database schema..."
    npm run db:push
    
    echo "🌱 Seeding database with sample data..."
    npm run db:seed
fi

echo ""
echo "🔐 Checking authentication setup..."
if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "⚠️  Warning: GOOGLE_CLIENT_ID not set"
    echo "   Please set up Google OAuth:"
    echo "   1. Go to https://console.cloud.google.com"
    echo "   2. Create a new project"
    echo "   3. Enable Google Identity API"
    echo "   4. Create OAuth 2.0 credentials"
    echo "   5. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
    echo ""
else
    echo "✅ GOOGLE_CLIENT_ID is set"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "⚠️  Warning: NEXTAUTH_SECRET not set"
    echo "   Generate a secure secret:"
    echo "   openssl rand -base64 32"
    echo ""
else
    echo "✅ NEXTAUTH_SECRET is set"
fi

echo ""
echo "🚀 Starting development server..."
echo "   Visit: http://localhost:3000"
echo ""
echo "📋 Next steps:"
echo "   1. Set up database (see setup-database.md)"
echo "   2. Configure Google OAuth (see setup-google-oauth.md)"
echo "   3. Deploy to Vercel with environment variables"
echo ""

npm run dev
